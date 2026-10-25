"""Fonts and images for the 小红书小工具 build (the container is offline, so everything ships inside the zip).
Usage: python3 xhs/assets.py      -> xhs/.cache/{fonts,cards,art}/  (needs network once, and Playwright for images)
- Japanese display fonts: one weight per look, cut down to the characters the page shows in them (Google Fonts `text=`).
  Chinese running text uses the phone's own fonts.
- Mantia / Hwatu card faces (large SVGs) become 300x492 WebP; the three original decks stay SVG (they are small).
- Home artwork becomes WebP at the size it is shown.
"""
import functools, http.server, json, os, re, socketserver, sys, threading, urllib.parse, urllib.request
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'xhs', '.cache')
html = open(os.path.join(ROOT, 'src', 'page.html'), encoding='utf-8').read()
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'}

# ---- fonts ----
FONTS = [  # family, weight used by its look
    ('Shippori Mincho B1', 800), ('Zen Old Mincho', 600), ('Shippori Mincho', 500), ('Kaisei Decol', 700), ('Klee One', 600),
    ('Yusei Magic', 400), ('Zen Antique', 400), ('Hina Mincho', 400), ('Kaisei Tokumin', 800), ('Yuji Boku', 400),
    ('Shippori Antique B1', 400), ('DotGothic16', 400), ('Yuji Syuku', 400)]
cjk = lambda s: {c for c in s if '぀' <= c <= 'ヿ' or '一' <= c <= '鿿' or '々' <= c <= '〇'}
def jp_chars():
    s = set()
    for pat in [r"\['[a-z0-9-]+', \d+, '[0-9a-z-]+', '([^']+)', '([^']+)'", r"name: '([^']+)', s: \d", r"haiku: \['([^']+)'",
                r"\[\d+, '[^']+', '([^']+)'\]", r"k: '([^']+)', how", r"jp: '([^']+)'"]:
        for m in re.finditer(pat, html): s |= cjk(''.join(m.groups()))
    for a, b in [('const HOME = {', 'function mangaLines()'), ('const PAINT = {', 'const scopeIds'), ('const NIWA_ART = [', 'const niwaSrc'), ('const UKIYO_PRINTS', 'const HOME_BG')]:
        i = html.index(a); s |= cjk(html[i:html.index(b, i)])
    s |= cjk('花合帖睦月如月弥生卯月皐月水無月文月葉月長月神無月霜月師走松梅桜藤菖蒲牡丹萩芒菊紅葉柳桐名所江戸百景読む済次号印春夏秋冬第庭話目次段')
    s |= {chr(c) for c in range(0x3041, 0x3097)} | {chr(c) for c in range(0x30a1, 0x30fb)} | set('ー々〆「」『』・、。…！？（）〜')
    return ''.join(sorted(s)) + ''.join(chr(c) for c in range(0x20, 0x7f))
def fonts():
    os.makedirs(os.path.join(OUT, 'fonts'), exist_ok=True)
    text, faces, total = jp_chars(), [], 0
    for fam, w in FONTS:
        t = '花合帖' if fam == 'Yuji Syuku' else text
        q = urllib.parse.urlencode({'family': f'{fam}:wght@{w}', 'text': t, 'display': 'swap'}, safe=':@;')
        css = urllib.request.urlopen(urllib.request.Request('https://fonts.googleapis.com/css2?' + q, headers=UA), timeout=60).read().decode()
        urls = re.findall(r'url\((https://[^)]+)\)', css)
        assert len(urls) == 1, (fam, len(urls))
        data = urllib.request.urlopen(urllib.request.Request(urls[0], headers=UA), timeout=60).read()
        name = fam.lower().replace(' ', '-') + f'-{w}.woff2'
        open(os.path.join(OUT, 'fonts', name), 'wb').write(data); total += len(data)
        faces.append(f'@font-face{{font-family:"{fam}";src:url(./fonts/{name}) format("woff2");font-weight:{w};font-style:normal;font-display:swap}}')
        print(f'{fam:22s} {w}  {len(data) // 1024} KB')
    open(os.path.join(OUT, 'fonts.css'), 'w').write('\n'.join(faces) + '\n')
    print('fonts total', total // 1024, 'KB')

# ---- images ----
RASTER_SKINS = ['classic', 'sumi', 'shu', 'hwatu']
def images():
    from playwright.sync_api import sync_playwright
    H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT); H.log_message = lambda *a: None
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{port}/'
    JS = """async ([src, w, h, q]) => {
      const im = new Image(); im.src = src; await im.decode();
      const W = w || Math.min(im.naturalWidth, h ? Math.round(im.naturalWidth * h / im.naturalHeight) : im.naturalWidth), H = w && h ? h : Math.round(im.naturalHeight * W / im.naturalWidth);
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
      g.drawImage(im, 0, 0, W, H); return c.toDataURL('image/webp', q); }"""
    import base64
    def save(path, data):
        os.makedirs(os.path.dirname(path), exist_ok=True); open(path, 'wb').write(base64.b64decode(data.split(',')[1])); return os.path.getsize(path)
    sizes = {}
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(); pg.goto(base + 'README.md')
        for skin in RASTER_SKINS:
            n = 0
            for f in sorted(os.listdir(os.path.join(ROOT, 'cards', skin))):
                if f.endswith('.svg'): n += save(os.path.join(OUT, 'cards', skin, f[:-4] + '.webp'), pg.evaluate(JS, [base + f'cards/{skin}/{f}', 300, 492, .8]))
            sizes['cards/' + skin] = n
        n = 0
        for f in sorted(os.listdir(os.path.join(ROOT, 'art'))):
            stem, ext = os.path.splitext(f)
            if ext not in ('.jpg', '.webp'): continue
            if stem == 'giga-scroll':   # a long handscroll strip: keep its height, it is shown 150-200 px tall
                n += save(os.path.join(OUT, 'art', stem + '.webp'), pg.evaluate(JS, [base + 'art/' + f, 0, 240, .72])); continue
            width = 640 if stem.startswith(('rinpa', 'manga', 'matsuri', 'ukiyo', 'techo-0')) else 520
            n += save(os.path.join(OUT, 'art', stem + '.webp'), pg.evaluate(JS, [base + 'art/' + f, width, 0, .74]))
        sizes['art'] = n
        b.close()
    srv.shutdown()
    for k, v in sizes.items(): print(f'{k:16s} {v // 1024} KB')

if __name__ == '__main__':
    what = sys.argv[1:] or ['fonts', 'images']
    if 'fonts' in what: fonts()
    if 'images' in what: images()
