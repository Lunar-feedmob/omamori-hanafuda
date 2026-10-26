# Installed-app check: visit once online (the service worker keeps what the game used), then lose the connection and
# reopen. The home page must render and a garden must deal real card faces.
import sys, os, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
repo = os.path.abspath(sys.argv[1]); parent, sub = os.path.dirname(repo), os.path.basename(repo)
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=parent); H.log_message = lambda *a: None
H.extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.webmanifest': 'application/manifest+json', '.js': 'text/javascript'}
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://localhost:{port}/{sub}/'
def pairs(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    return list(d.values())
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True); pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url, timeout=90000); pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 2, demoDone: true, seenRules: true}))")
    pg.reload(timeout=90000)
    print('service worker controls the page:', pg.evaluate("navigator.serviceWorker.ready.then(() => new Promise(r => setTimeout(() => r(!!navigator.serviceWorker.controller), 1500)))"), flush=True)
    pg.reload(timeout=90000); pg.wait_for_timeout(1500)
    pg.tap('#homeView [data-go="1"]', force=True); pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=30000)
    for x, y in pairs(pg): pg.tap(f'#deck .card[data-i="{x}"]'); pg.tap(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(450)
    pg.wait_for_timeout(4000)   # let the background refreshes land in the cache
    print('cached entries:', pg.evaluate("caches.open('hana-awase-v1').then(c => c.keys()).then(k => k.length)"), flush=True)
    ctx.set_offline(True)
    pg.reload(timeout=30000); pg.wait_for_timeout(2500)
    print('offline: home rendered', pg.evaluate("!!document.querySelector('#homeView .hv')"), '| look', pg.evaluate("document.documentElement.dataset.look"), flush=True)
    pg.screenshot(path='out/offline-home.png')
    pg.tap('#homeView [data-go="1"]', force=True); pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=30000); pg.wait_for_timeout(300)
    faces = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i => i.complete && i.naturalWidth > 0)")
    print('offline: garden dealt', len(faces), 'cards, faces loaded', sum(faces), flush=True)
    pg.screenshot(path='out/offline-game.png')
    print('errors', errs)
    b.close()
srv.shutdown()
