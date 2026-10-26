import sys, threading, http.server, functools, socketserver
from playwright.sync_api import sync_playwright
import fontcache
site, out, looks, w, h = sys.argv[1], sys.argv[2], sys.argv[3].split(','), int(sys.argv[4]), int(sys.argv[5])
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    ctx = b.new_context(locale='zh-CN', viewport={'width': w, 'height': h}); fontcache.attach(ctx); pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(f'http://127.0.0.1:{port}/_preview.html', wait_until='domcontentloaded')
    for look in looks:
        pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 4, demoDone: true, seenRules: true, look: '%s', best: {std: {1: 3, 2: 2, 3: 1}}}))" % look); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(2600)
        pg.screenshot(path=f'{out}/home-{look}-{w}.png')
    print('errors', errs); b.close()
srv.shutdown()
