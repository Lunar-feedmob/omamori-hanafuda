import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache; fontcache.patch()
site, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_preview.html'; KEY = 'omamori-hanafuda-v1'; errs = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True).new_page()
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', JSON.stringify({{unlocked: 4, demoDone: true, look: 'ukiyo'}}))"); pg.reload(); pg.wait_for_timeout(1200)
    seq = []
    for i in range(12):
        pg.click('.tabs [data-cycle-look]'); pg.wait_for_timeout(450)
        seq.append([pg.evaluate("document.documentElement.dataset.look"), pg.evaluate("document.querySelector('.tabs .look-name').textContent"), pg.evaluate("document.querySelector('#toast').textContent.trim().slice(0,12)")])
        if i in (2, 8): pg.screenshot(path=f'{out}/cycle-{i}.png')
    print('sequence', seq)
    print('sheet gone', pg.evaluate("!document.querySelector('#themes')"))
    pg.click('#homeView [data-go="2"]', force=True); pg.wait_for_function("document.querySelector('#hintText').textContent.includes('翻开两张')", timeout=20000)
    srcs = pg.evaluate("[...document.querySelectorAll('.card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    a, c = list(d.values())[0]; pg.click(f'.card[data-i="{a}"]'); pg.click(f'.card[data-i="{c}"]'); pg.wait_for_timeout(900)
    before = pg.evaluate("[document.querySelector('#movesLeft').textContent, document.querySelectorAll('.card.done').length]")
    pg.click('#game [data-cycle-look]'); pg.wait_for_timeout(600)
    after = pg.evaluate("[document.querySelector('#movesLeft').textContent, document.querySelectorAll('.card.done').length, document.documentElement.dataset.look, !document.querySelector('#game').hidden]")
    pg.screenshot(path=f'{out}/cycle-game.png'); print('in game', before, '->', after)
    pg.close()
    pg = b.new_page(locale='zh-CN', viewport={'width': 1280, 'height': 800}); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', JSON.stringify({{unlocked: 4, demoDone: true, look: 'rinpa'}}))"); pg.reload(); pg.wait_for_timeout(1200)
    pg.click('.tabs [data-cycle-look]'); pg.wait_for_timeout(700); pg.screenshot(path=f'{out}/cycle-desk.png')
    print('desktop', pg.evaluate("[document.documentElement.dataset.look, document.querySelector('.tabs .look-name').textContent]"))
    print('errors', errs[:5]); b.close()
srv.shutdown()
