import sys, threading, http.server, functools, socketserver
from playwright.sync_api import sync_playwright
import fontcache
site, out, looks = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch()
    for look in looks:
        ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}); fontcache.attach(ctx); pg = ctx.new_page()
        pg.goto(f'http://127.0.0.1:{port}/_preview.html', wait_until='domcontentloaded'); pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 3, demoDone: true, seenRules: true, look: '%s'}))" % look); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(1500)
        # warm up: open and leave a level once so assets are decoded
        pg.click('#homeView [data-go="2"]', force=True); pg.wait_for_timeout(2500); pg.click('#btnHome'); pg.wait_for_timeout(800)
        cdp = pg.context.new_cdp_session(pg); cdp.send('Animation.enable'); cdp.send('Animation.setPlaybackRate', {'playbackRate': .12})
        pg.click('#homeView [data-go="2"]', force=True); pg.wait_for_timeout(700); pg.screenshot(path=f'{out}/{look}-slow1.png')
        pg.wait_for_timeout(1500); pg.screenshot(path=f'{out}/{look}-slow2.png')
        pg.close()
    b.close()
srv.shutdown()
