import sys, threading, http.server, functools, socketserver
from playwright.sync_api import sync_playwright
import fontcache
site, out, looks = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
def pairs(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    return list(d.values())
with sync_playwright() as p:
    b = p.chromium.launch()
    for look in looks:
        ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}); fontcache.attach(ctx); pg = ctx.new_page()
        pg.goto(f'http://127.0.0.1:{port}/_preview.html', wait_until='domcontentloaded'); pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 3, demoDone: true, seenRules: true, look: '%s'}))" % look); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(1500)
        pg.click('#homeView [data-go="1"]', force=True)
        pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000); pg.wait_for_timeout(400)
        pr = pairs(pg)
        cdp = pg.context.new_cdp_session(pg); cdp.send('Animation.enable'); cdp.send('Animation.setPlaybackRate', {'playbackRate': .2})
        pg.click(f'#deck .card[data-i="{pr[0][0]}"]'); pg.click(f'#deck .card[data-i="{pr[1][0]}"]'); pg.wait_for_timeout(500); pg.screenshot(path=f'{out}/{look}-s-miss.png')
        pg.wait_for_timeout(1500); pg.mouse.click(5, 400); pg.wait_for_timeout(2500)
        x, y = pr[0]; pg.click(f'#deck .card[data-i="{x}"]'); pg.click(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(900); pg.screenshot(path=f'{out}/{look}-s-mark.png')
        pg.wait_for_timeout(2600); pg.screenshot(path=f'{out}/{look}-s-fly.png')
        cdp.send('Animation.setPlaybackRate', {'playbackRate': 1}); pg.wait_for_timeout(600)
        for x, y in pr[1:]:
            pg.click(f'#deck .card[data-i="{x}"]'); pg.click(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(520)
        cdp.send('Animation.setPlaybackRate', {'playbackRate': .2}); pg.wait_for_timeout(700); pg.screenshot(path=f'{out}/{look}-s-sweep.png')
        pg.wait_for_function("!document.querySelector('#modal').hidden", timeout=8000); pg.wait_for_timeout(2600); pg.screenshot(path=f'{out}/{look}-s-win.png')
        pg.close()
    b.close()
srv.shutdown()
