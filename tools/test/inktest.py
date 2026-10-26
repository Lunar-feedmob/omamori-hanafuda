import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache
site, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
coll = {k: 1 for k in ['matsu', 'matsu-tan', 'ume', 'ume-tan', 'ume-uguisu', 'sakura', 'sakura-tan', 'sakura-maku']}
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}); fontcache.attach(ctx); pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(f'http://127.0.0.1:{port}/_preview.html', wait_until='domcontentloaded')
    pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 2, demoDone: true, seenRules: true, look: 'washi', collected: %s}))" % json.dumps(coll)); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(1500)
    print('before', pg.evaluate("[...document.querySelectorAll('.np')].slice(0,3).map(n => n.className)"))
    pg.click('#homeView [data-go="1"]', force=True)
    pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000); pg.wait_for_timeout(300)
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    print('deck', sorted(set(s.split('/')[-1] for s in srcs)))
    for x, y in d.values(): pg.click(f'#deck .card[data-i="{x}"]'); pg.click(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(520)
    pg.wait_for_function("!document.querySelector('#modal').hidden", timeout=8000); pg.wait_for_timeout(500)
    pg.click('[data-act="home"]'); pg.wait_for_timeout(500)
    print('after', pg.evaluate("[...document.querySelectorAll('.np')].slice(0,3).map(n => n.className + (n.querySelector('.np-ink') ? ' +ink' : ''))"))
    pg.evaluate("document.querySelector('.niwa').scrollIntoView({block:'center'})"); pg.wait_for_timeout(1300)
    pg.locator('.niwa').screenshot(path=f'{out}/ink-mid.png')
    pg.wait_for_timeout(2500); pg.locator('.niwa').screenshot(path=f'{out}/ink-end.png')
    print('end', pg.evaluate("[...document.querySelectorAll('.np')].slice(0,3).map(n => n.className + (n.querySelector('.np-ink.play') ? ' +played' : ''))"), 'errors', errs)
    b.close()
srv.shutdown()
