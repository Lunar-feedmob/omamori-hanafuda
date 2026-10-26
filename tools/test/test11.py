import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache; fontcache.patch()
site, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_preview.html'; KEY = 'omamori-hanafuda-v1'; errs = []
R = "(s => { const r = document.querySelector(s).getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; })"
with sync_playwright() as p:
    b = p.chromium.launch()
    for (w, h, m) in [(390, 844, True), (1280, 800, False)]:
        for look in ['ukiyo', 'pixel']:
            pg = b.new_context(locale='zh-CN', viewport={'width': w, 'height': h}, is_mobile=m, has_touch=m).new_page()
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', JSON.stringify({{unlocked: 3, demoDone: {str(look == 'ukiyo').lower()}, look: '{look}'}}))"); pg.reload(); pg.wait_for_timeout(1000)
            res = {}
            for sheet in ['dex', 'omamori', 'settings']:
                pg.click(f'.tabs [data-sheet="{sheet}"]'); pg.wait_for_timeout(500)
                res[sheet] = pg.evaluate(R, f'#{sheet} .back-btn')
                if sheet == 'dex' and w < 500: pg.screenshot(path=f'{out}/back-{look}-dex.png')
                pg.click(f'#{sheet} .back-btn'); pg.wait_for_timeout(400)
            pg.click('#homeView [data-go="1"]', force=True); pg.wait_for_timeout(700)
            if look == 'pixel':   # first garden for a new player opens the practice demo
                res['demo'] = pg.evaluate(R, '#demo .back-btn'); pg.screenshot(path=f'{out}/back-demo.png'); pg.click('#demoSkip'); pg.wait_for_timeout(600)
                pg.click('[data-go="1"]') if pg.evaluate("!document.querySelector('#game').hidden") is False and pg.query_selector('#modal:not([hidden]) [data-go]') else None
            pg.wait_for_timeout(600)
            if pg.evaluate("!document.querySelector('#game').hidden"): res['game'] = pg.evaluate(R, '#btnHome')
            print(w, look, res); pg.close()
    print('errors', errs[:5]); b.close()
srv.shutdown()
