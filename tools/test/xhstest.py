import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
dist, out = sys.argv[1], sys.argv[2]
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=dist); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{port}/'
MOCK = """(() => {
  const calls = window.__calls = [], store = JSON.parse(sessionStorage.getItem('__xhsStore') || '{}');
  const ok = (name, extra) => (o) => { calls.push([name, o]); return Promise.resolve(Object.assign({errMsg: name + ':ok'}, extra && extra(o))); };
  window.xhs = {launchOptions: {miniToolEnv: {buildVersion: 9512004, userDataPath: 'usr'}}, miniTool: {
    getLaunchOptions: ok('getLaunchOptions', () => ({miniToolEnv: {buildVersion: 9512004}})),
    setStorage: o => { store[o.key] = o.data; sessionStorage.setItem('__xhsStore', JSON.stringify(store)); calls.push(['setStorage', o.key]); return Promise.resolve({errMsg: 'setStorage:ok'}); },
    getStorage: o => Promise.resolve({errMsg: 'getStorage:ok', data: o.key in store ? store[o.key] : null}),
    removeStorage: o => { delete store[o.key]; return Promise.resolve({errMsg: 'removeStorage:ok'}); },
    writeTempFile: ok('writeTempFile', () => ({filePath: 'tmp/poster.png'})),
    saveImageToPhotosAlbum: ok('saveImageToPhotosAlbum'), postNote: ok('postNote'), vibrateShort: ok('vibrateShort'),
    getWindowInfo: ok('getWindowInfo', () => ({windowWidth: 390, windowHeight: 844, menuButtons: {back: null, me: null, share: {left: 330, top: 50, right: 374, bottom: 82, width: 44, height: 32}}}))
  }};
})();"""
errs, external = [], []
with sync_playwright() as p:
    b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    ctx.add_init_script(MOCK)
    ctx.route('**/*', lambda r: (external.append(r.request.url), r.abort()) if not r.request.url.startswith(base) else r.continue_())
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.goto(base + 'index.html'); pg.wait_for_timeout(2500)
    pg.screenshot(path=f'{out}/xhs-home.png')
    print('top padding', pg.evaluate("getComputedStyle(document.querySelector('#app')).paddingTop"), '| skins', pg.evaluate("document.querySelectorAll('#skins .skin').length"))
    pg.click('#homeView [data-go="1"]', force=True); pg.wait_for_timeout(900)
    if pg.evaluate("!document.querySelector('#demo').hidden"): pg.click('#demoSkip'); pg.wait_for_timeout(500)
    pg.wait_for_function("document.querySelector('#hintText').textContent.includes('翻开两张')", timeout=20000)
    srcs = pg.evaluate("[...document.querySelectorAll('#deck .card .front img')].map(i=>i.getAttribute('src'))"); d = {}
    for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
    pg.screenshot(path=f'{out}/xhs-game.png')
    for a, c in d.values(): pg.click(f'#deck .card[data-i="{a}"]'); pg.click(f'#deck .card[data-i="{c}"]'); pg.wait_for_timeout(600)
    pg.wait_for_timeout(2500); pg.screenshot(path=f'{out}/xhs-win.png')
    print('won', pg.evaluate("document.querySelector('#modalCard h2') && document.querySelector('#modalCard h2').textContent"), '| card src sample', srcs[0])
    print('audio', pg.evaluate("(() => { const T = window.Tone; return T ? [typeof T.PluckSynth, T.context.state] : null; })()"))
    print('win buttons', pg.evaluate("[...document.querySelectorAll('#modalCard .modal-actions .btn')].map(b => b.textContent)"))
    calls = pg.evaluate("window.__calls.map(c => c[0])"); print('calls', {k: calls.count(k) for k in set(calls)})
    # reload: progress must come back from the platform storage
    pg.reload(); pg.wait_for_timeout(2500)
    print('after reload unlocked', pg.evaluate("JSON.parse(JSON.parse(sessionStorage.getItem('__xhsStore'))['omamori-hanafuda-v1']).unlocked"), '| localStorage used', pg.evaluate("localStorage.length"))
    pg.click('.tabs [data-cycle-look]'); pg.wait_for_timeout(600); pg.click('.tabs [data-cycle-look]'); pg.wait_for_timeout(600); pg.screenshot(path=f'{out}/xhs-kare.png')
    print('look', pg.evaluate("document.documentElement.dataset.look"), '| fonts ok', pg.evaluate("document.fonts.check('20px \"Shippori Mincho\"')"))
    print('external requests', external[:5], '| errors', errs[:6])
    b.close()
srv.shutdown()
