# The phone's back gesture inside the game: each step should close the top layer, and only an empty home page leaves.
import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
import fontcache
site = sys.argv[1]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/index.html'
STATE = "(() => ({screen: document.querySelector('#game').hidden ? 'home' : 'game', sheet: ['dex','omamori','settings'].filter(i => !document.getElementById(i).hidden).join(','), modal: !document.querySelector('#modal').hidden, demo: !document.querySelector('#demo').hidden, url: location.pathname}))()"
def pairs(pg):
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    return list(d.values())
ok = True
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True); fontcache.attach(ctx); pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(f'http://127.0.0.1:{port}/tools/test/out/blank.html'); pg.goto(url)   # a page before ours, so leaving is visible
    pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 3, demoDone: true, seenRules: true, look: 'honjo'}))"); pg.reload(); pg.wait_for_timeout(1500)
    def back(label, want):
        global ok
        try: pg.evaluate("history.back()")
        except Exception: pass
        pg.wait_for_timeout(700)
        st = pg.evaluate(STATE) if pg.url.endswith('index.html') else {'left': pg.url.rsplit('/', 1)[-1]}
        good = all(st.get(k) == v for k, v in want.items()); ok &= good
        print(('OK  ' if good else 'BAD ') + label, st, flush=True)
    pg.tap('.tabs [data-sheet="dex"]'); pg.wait_for_timeout(500); back('dex open -> back', {'sheet': '', 'screen': 'home'})
    pg.tap('#homeView [data-go="1"]', force=True); pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000)
    pg.tap('#game [data-sheet="dex"]'); pg.wait_for_timeout(500); back('in game, dex open -> back', {'sheet': '', 'screen': 'game'})
    back('in game -> back', {'screen': 'home'})
    pg.tap('#homeView [data-go="1"]', force=True); pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000)
    for x, y in pairs(pg): pg.tap(f'#deck .card[data-i="{x}"]'); pg.tap(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(450)
    pg.wait_for_function("!document.querySelector('#modal').hidden", timeout=9000); pg.wait_for_timeout(400)
    back('win card -> back', {'modal': False, 'screen': 'home'})
    pg.tap('#homeView [data-go="1"]', force=True); pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000)
    for x, y in pairs(pg): pg.tap(f'#deck .card[data-i="{x}"]'); pg.tap(f'#deck .card[data-i="{y}"]'); pg.wait_for_timeout(450)
    pg.wait_for_function("!document.querySelector('#modal').hidden", timeout=9000); pg.wait_for_timeout(400)
    pg.tap('[data-act="next"]'); pg.wait_for_function("document.querySelector('#btnPeek') && !document.querySelector('#btnPeek').disabled", timeout=20000)
    back('after 前往下一庭, in game -> back', {'screen': 'home', 'modal': False})
    pg.tap('.tabs [data-sheet="settings"]'); pg.wait_for_timeout(500); pg.tap('#btnStats'); pg.wait_for_timeout(400)
    back('settings + stats dialog -> back', {'modal': False, 'sheet': 'settings'})
    back('settings -> back', {'sheet': ''})
    pg.tap('.tabs [data-sheet="omamori"]'); pg.wait_for_timeout(500); pg.tap('#omamori .back-btn'); pg.wait_for_timeout(400)
    print('closed 御守 with its own button; history depth', pg.evaluate("history.state && history.state.hana"))
    pg.evaluate("localStorage.setItem('omamori-hanafuda-v1', JSON.stringify({unlocked: 3, demoDone: false, seenRules: true, look: 'honjo'}))"); pg.reload(); pg.wait_for_timeout(1500)
    pg.tap('#homeView [data-go="1"]', force=True); pg.wait_for_timeout(600)
    print('first-timer tapped a garden: walkthrough open', pg.evaluate("!document.querySelector('#demo').hidden"))
    back('walkthrough -> back', {'demo': False, 'screen': 'home'})
    back('home, nothing open -> back leaves the page', {'left': 'blank.html'})
    print('errors', errs); print('ALL OK' if ok else 'SOME FAILED')
    b.close()
srv.shutdown()
