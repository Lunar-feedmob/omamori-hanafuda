# The game's one app icon, in every size the web and the mini tool need. Drawn here as SVG and rasterised with headless
# Chromium (no image libraries needed). The icon does not change with the theme: it uses the default look's colours
# (本所怪谈: a night navy tile, lantern vermilion, paper) and one bold card, 芒に月 — red sky, full moon, dark hill — with no text.
import base64, os, struct
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INDIGO, INDIGO_LIGHT, PAPER, SHU, MOON, HILL = '#141a30', '#2a3462', '#f3ead6', '#d4532e', '#fbf3dc', '#0e1222'

def card(scale, rot):
    # a 61:100 hanafuda card centred on a 512 canvas: paper border, red sky, full moon, a dark hill with three bold blades
    w, h = 232 * scale, 380 * scale
    x, y, r, b = 256 - w / 2, 256 - h / 2, 20 * scale, 13 * scale
    fx, fy, fw, fh = x + b, y + b, w - 2 * b, h - 2 * b
    hill = (f'M{fx} {fy + fh * .62} C{fx + fw * .28} {fy + fh * .5} {fx + fw * .52} {fy + fh * .54} {fx + fw * .72} {fy + fh * .6} '
            f'S{fx + fw * .95} {fy + fh * .58} {fx + fw} {fy + fh * .55} V{fy + fh} H{fx}Z')
    blades = ''.join(f'<path d="M{fx + fw * k} {fy + fh} Q{fx + fw * (k + .02)} {fy + fh * .8} {fx + fw * (k + .1)} {fy + fh * t}" fill="none" stroke="{MOON}" stroke-opacity=".9" stroke-width="{7 * scale}" stroke-linecap="round"/>'
                     for k, t in [(.22, .66), (.46, .7), (.7, .68)])
    return (f'<g transform="rotate({rot} 256 256)">'
            f'<rect x="{x + 6 * scale}" y="{y + 12 * scale}" width="{w}" height="{h}" rx="{r}" fill="#0b1630" opacity=".35"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{PAPER}"/>'
            f'<clipPath id="face"><rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" rx="{r * .45}"/></clipPath>'
            f'<g clip-path="url(#face)"><rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" fill="{SHU}"/>'
            f'<circle cx="{fx + fw * .5}" cy="{fy + fh * .33}" r="{fw * .3}" fill="{MOON}"/><path d="{hill}" fill="{HILL}"/>{blades}</g></g>')

def svg(kind):
    # 'any': a rounded tile with transparent corners (favicons, desktop shortcuts); 'full': edge to edge (iOS rounds it
    # itself, Android masks it), with the card kept inside the maskable safe zone (the central 80% circle)
    bg = (f'<radialGradient id="g" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="{INDIGO_LIGHT}"/><stop offset="1" stop-color="{INDIGO}"/></radialGradient>')
    if kind == 'any': return f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">{bg}<rect width="512" height="512" rx="112" fill="url(#g)"/>{card(1, -8)}</svg>'
    if kind == 'small': return f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">{bg}<rect width="512" height="512" rx="96" fill="url(#g)"/>{card(1.12, 0)}</svg>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">{bg}<rect width="512" height="512" fill="url(#g)"/>{card(.8, -8)}</svg>'

def ico(pngs):
    # a .ico holding PNG images (supported by every browser that reads .ico)
    head, data, off = struct.pack('<HHH', 0, 1, len(pngs)), b'', 6 + 16 * len(pngs)
    for size, png in pngs:
        head += struct.pack('<BBBBHHII', size % 256, size % 256, 0, 0, 1, 32, len(png), off + len(data)); data += png
    return head + data

OUT = os.path.join(ROOT, 'icons'); os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, 'icon.svg'), 'w').write(svg('any'))
JOBS = [('small', 16, 'favicon-16.png'), ('small', 32, 'favicon-32.png'), ('small', 48, 'favicon-48.png'), ('full', 180, 'apple-touch-icon.png'),
        ('any', 192, 'icon-192.png'), ('any', 512, 'icon-512.png'), ('full', 192, 'icon-maskable-192.png'), ('full', 512, 'icon-maskable-512.png'),
        ('full', 1024, '../xhs/release/icon-1024.png'), ('full', 512, '../xhs/release/icon-512.png')]
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    made = {}
    for kind, size, name in JOBS:
        pg.set_viewport_size({'width': size, 'height': size})
        pg.set_content(f'<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,{base64.b64encode(svg(kind).encode()).decode()}" width="{size}" height="{size}" style="display:block"></body></html>')
        pg.wait_for_function('document.images[0].complete')
        png = pg.screenshot(omit_background=True, clip={'x': 0, 'y': 0, 'width': size, 'height': size})
        open(os.path.join(OUT, name), 'wb').write(png); made[name] = png
        print(f'{name:32s} {size}x{size} {len(png) // 1024 or 1} KB')
    b.close()
open(os.path.join(ROOT, 'favicon.ico'), 'wb').write(ico([(16, made['favicon-16.png']), (32, made['favicon-32.png']), (48, made['favicon-48.png'])]))
print('favicon.ico', os.path.getsize(os.path.join(ROOT, 'favicon.ico')) // 1024, 'KB')
