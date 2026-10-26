# 装到桌面 in settings: an Android/desktop install prompt gives a button; iPhone Safari gets instructions; inside the
# installed app the entry is hidden.
import sys, threading, http.server, functools, socketserver
from playwright.sync_api import sync_playwright
import fontcache
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=sys.argv[1]); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/index.html'
SEEN = "[!document.querySelector('#installGroup').hidden, !document.querySelector('#btnInstall').hidden, document.querySelector('#installNote').textContent.slice(0, 18)]"
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    def page(**kw):
        ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, **kw); fontcache.attach(ctx); pg = ctx.new_page()
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(url); pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({demoDone: true}))"); pg.reload(); pg.wait_for_timeout(1200)
        return pg
    pg = page()
    pg.tap('.tabs [data-sheet="settings"]'); pg.wait_for_timeout(400); print('plain Chrome, no prompt yet:', pg.evaluate(SEEN))
    pg.evaluate("(() => { const e = new Event('beforeinstallprompt'); e.prompt = () => { window.__prompted = true; }; e.userChoice = Promise.resolve({outcome: 'accepted'}); window.dispatchEvent(e); })()")
    pg.wait_for_timeout(200); print('Android install prompt available:', pg.evaluate(SEEN))
    pg.screenshot(path='out/install-android.png')
    pg.tap('#btnInstall'); pg.wait_for_timeout(300); print('tapped: prompt shown', pg.evaluate("!!window.__prompted"), '| after', pg.evaluate(SEEN))
    ios = page(user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1')
    ios.tap('.tabs [data-sheet="settings"]'); ios.wait_for_timeout(400); print('iPhone Safari:', ios.evaluate(SEEN))
    ios.locator('#installGroup').screenshot(path='out/install-ios.png')
    print('errors', errs); b.close()
srv.shutdown()
