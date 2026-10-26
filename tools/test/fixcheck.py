import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache
site, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    ctx = b.new_context(locale='zh-CN', viewport={'width': 320, 'height': 568}, device_scale_factor=2, is_mobile=True, has_touch=True); fontcache.attach(ctx); pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(f'http://127.0.0.1:{port}/_preview.html', wait_until='domcontentloaded')
    for look in ['techo', 'pixel']:
        pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 8, demoDone: true, seenRules: true, look: '%s'}))" % look); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(1200)
        pg.tap('#homeView [data-go="8"]', force=True)
        pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=25000)
        print(look, pg.evaluate("[document.querySelector('#pairsLab').scrollWidth <= document.querySelector('#pairsLab').clientWidth + 1, document.querySelector('#pairsTotal').getBoundingClientRect().height, Math.round(document.querySelector('#deck .card').getBoundingClientRect().width)]"))
        pg.locator('.hud').screenshot(path=f'{out}/fix-hud-{look}.png')
        pg.tap('#btnHome'); pg.wait_for_timeout(300)
    pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 8, demoDone: true, seenRules: true, look: 'honjo', best: {std: {1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2}}}))"); pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(1500)
    pg.locator('.hj-stage').screenshot(path=f'{out}/fix-dawn.png')
    ctx2 = b.new_context(locale='zh-CN', viewport={'width': 768, 'height': 1024}, device_scale_factor=2, is_mobile=True, has_touch=True); fontcache.attach(ctx2); p2 = ctx2.new_page()
    p2.goto(f'http://127.0.0.1:{port}/_preview.html', wait_until='domcontentloaded'); p2.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 8, demoDone: true, seenRules: true, look: 'ukiyo'}))"); p2.reload(wait_until='domcontentloaded'); p2.wait_for_timeout(1200)
    for sh in ['dex', 'omamori', 'settings']:
        p2.tap(f'.tabs [data-sheet="{sh}"]'); p2.wait_for_timeout(1800)
        print('ipad', sh, p2.evaluate(f"(() => {{ const r = document.querySelector('#{sh} .back-btn').getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)]; }})()"))
        p2.tap(f'#{sh} .back-btn'); p2.wait_for_timeout(500)
    print('errors', errs); b.close()
srv.shutdown()
