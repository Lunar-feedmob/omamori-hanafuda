import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache
site, out, looks = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_preview.html'
def pairs(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    return list(d.values())
with sync_playwright() as p:
    b = p.chromium.launch()
    for look in looks:
        errs = []
        ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}, device_scale_factor=1); fontcache.attach(ctx); pg = ctx.new_page()
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.goto(url, wait_until='domcontentloaded'); pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 3, demoDone: true, seenRules: true, look: '%s', best: {std: {1: 3, 2: 2}}, collected: {'matsu-tsuru': 1}}))" % look); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(1500)
        pg.screenshot(path=f'{out}/{look}-home.png')
        pg.click('#homeView [data-go="2"]', force=True); pg.wait_for_timeout(260); pg.screenshot(path=f'{out}/{look}-deal1.png')
        pg.wait_for_timeout(250); pg.screenshot(path=f'{out}/{look}-deal2.png')
        pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000); pg.wait_for_timeout(200)
        pr = pairs(pg)
        a, c = pr[0][0], pr[1][0]
        pg.click(f'#deck .card[data-i="{a}"]'); pg.click(f'#deck .card[data-i="{c}"]'); pg.wait_for_timeout(330); pg.screenshot(path=f'{out}/{look}-miss.png')
        pg.wait_for_timeout(900)
        x, y = pr[0]
        pg.click(f'#deck .card[data-i="{x}"]'); pg.click(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(560); pg.screenshot(path=f'{out}/{look}-match.png')
        pg.wait_for_timeout(500); pg.screenshot(path=f'{out}/{look}-fly.png')
        for x, y in pr[1:]:
            pg.click(f'#deck .card[data-i="{x}"]'); pg.click(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(520)
        pg.wait_for_timeout(250); pg.screenshot(path=f'{out}/{look}-sweep.png')
        pg.wait_for_function("!document.querySelector('#modal').hidden", timeout=8000); pg.wait_for_timeout(700); pg.screenshot(path=f'{out}/{look}-win1.png')
        pg.wait_for_timeout(1800); pg.screenshot(path=f'{out}/{look}-win2.png')
        print(look, 'tally', pg.evaluate("[...document.querySelectorAll('.tally b')].map(b=>b.textContent)"), 'errors', errs)
        ctx.close()
    b.close()
srv.shutdown()
