# Serve the repo under /omamori-hanafuda/ (as GitHub Pages does) and check what browsers see when installing the game:
# the parsed manifest, installability, every icon link resolving to a real PNG/SVG of the stated size.
import sys, os, threading, http.server, functools, socketserver, json, mimetypes
from playwright.sync_api import sync_playwright
import fontcache
repo = os.path.abspath(sys.argv[1]); parent = os.path.dirname(repo); sub = os.path.basename(repo)
mimetypes.add_type('application/manifest+json', '.webmanifest')
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=parent); H.log_message = lambda *a: None
H.extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.webmanifest': 'application/manifest+json'}
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
base = sys.argv[2] if len(sys.argv) > 2 else f'http://127.0.0.1:{port}/{sub}/'
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(); fontcache.attach(ctx); pg = ctx.new_page(); bad = []
    pg.on('response', lambda r: r.status >= 400 and bad.append((r.status, r.url)))
    pg.goto(base, wait_until='load'); pg.wait_for_timeout(1500)
    cdp = ctx.new_cdp_session(pg)
    m = cdp.send('Page.getAppManifest')
    print('manifest url', m.get('url'), '| parse errors', m.get('errors'))
    print('installability errors', cdp.send('Page.getInstallabilityErrors').get('installabilityErrors'))
    links = pg.evaluate("[...document.querySelectorAll('link[rel~=icon],link[rel=apple-touch-icon],link[rel=manifest]')].map(l => [l.rel, l.href, l.sizes ? l.sizes.value : ''])")
    man = json.loads(m.get('data') or '{}')
    for icon in man.get('icons', []): links.append(['manifest-icon', pg.evaluate("u => new URL(u, document.querySelector('link[rel=manifest]').href).href", icon['src']), icon['sizes'] + ' ' + icon.get('purpose', '')])
    for rel, url, sizes in links:
        r = ctx.request.get(url); ct = r.headers.get('content-type', '')
        dims = pg.evaluate("async u => { const i = new Image(); i.src = u; try { await i.decode(); return [i.naturalWidth, i.naturalHeight]; } catch (e) { return null; } }", url) if 'image' in ct or url.endswith('.ico') else '-'
        print(f'{rel:16s} {r.status} {ct:26s} {str(dims):12s} {sizes:18s} {url.replace(base, "")}')
    print('theme-color now', pg.evaluate("document.querySelector('meta[name=theme-color]').content"), '| title', pg.title())
    print('failed requests', bad)
    b.close()
srv.shutdown()
