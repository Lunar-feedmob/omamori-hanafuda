import sys, threading, http.server, functools, socketserver, json
from playwright.sync_api import sync_playwright
site, out = sys.argv[1], sys.argv[2]; looks = sys.argv[3].split(',')
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{port}/_preview.html'; KEY = 'omamori-hanafuda-v1'
ids = json.load(open(site + '/../ids.json'))
coll = {k: (6 if i % 9 == 0 else 1) for i, k in enumerate(ids) if i % 4 != 3}
SAVE = {'unlocked': 5, 'demoDone': True, 'best': {'std': {'1': 3, '2': 2, '3': 3, '4': 1}}, 'collected': coll, 'seals': {'san': 1, 'muku': 1}}
with sync_playwright() as p:
    b = p.chromium.launch()
    for look in looks:
        pg = b.new_context(locale='zh-CN', viewport={'width': 390, 'height': 844}, device_scale_factor=1, is_mobile=True, has_touch=True).new_page()
        pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', {json.dumps(json.dumps(dict(SAVE, look=look)))})"); pg.reload(); pg.wait_for_timeout(1500)
        pg.screenshot(path=f'{out}/{look}-1home.png')
        pg.click('#homeView [data-go="1"]'); pg.wait_for_function("document.querySelector('#hintText').textContent.includes('翻开两张')", timeout=20000)
        srcs = pg.evaluate("[...document.querySelectorAll('.card .front img')].map(i=>i.getAttribute('src'))"); d = {}
        for i, s2 in enumerate(srcs): d.setdefault(s2, []).append(i)
        pairs = list(d.values())
        pg.click(f'.card[data-i="{pairs[0][0]}"]'); pg.click(f'.card[data-i="{pairs[0][1]}"]'); pg.wait_for_timeout(900)
        a = pairs[1][0]; c = pairs[2][0]; pg.click(f'.card[data-i="{a}"]'); pg.click(f'.card[data-i="{c}"]'); pg.wait_for_timeout(250)
        pg.screenshot(path=f'{out}/{look}-2game.png')
        pg.wait_for_timeout(1200)
        for x, y in pairs[1:]: pg.click(f'.card[data-i="{x}"]'); pg.click(f'.card[data-i="{y}"]'); pg.wait_for_timeout(500)
        pg.wait_for_timeout(2600); pg.screenshot(path=f'{out}/{look}-3win.png')
        pg.click('[data-act="home"]'); pg.wait_for_timeout(500)
        pg.click('.tabs [data-sheet="dex"]'); pg.wait_for_timeout(700); pg.screenshot(path=f'{out}/{look}-4dex.png'); pg.click('[data-close="dex"]')
        pg.click('.tabs [data-sheet="settings"]'); pg.wait_for_timeout(600); pg.screenshot(path=f'{out}/{look}-5set.png'); pg.click('[data-close="settings"]')
        pg.close()
        pg = b.new_page(locale='zh-CN', viewport={'width': 1280, 'height': 800}); pg.goto(url); pg.evaluate(f"localStorage.setItem('{KEY}', {json.dumps(json.dumps(dict(SAVE, look=look)))})"); pg.reload(); pg.wait_for_timeout(1200)
        pg.click('#homeView [data-go="5"]'); pg.wait_for_function("document.querySelector('#hintText').textContent.includes('翻开两张')", timeout=20000); pg.wait_for_timeout(400)
        pg.screenshot(path=f'{out}/{look}-6desk.png'); pg.close()
        html = '<body style="margin:0;background:#666;display:flex;gap:6px;padding:6px;align-items:flex-start">' + ''.join(f'<img src="{look}-{k}.png" style="height:600px">' for k in ['1home', '2game', '3win', '4dex', '5set']) + '</body>'
        open(f'{out}/{look}.html', 'w').write(html)
        sp = b.new_page(locale='zh-CN', viewport={'width': 1450, 'height': 612}); sp.goto(f'file://{out}/{look}.html'); sp.wait_for_timeout(300); sp.screenshot(path=f'{out}/{look}-sheet.png'); sp.close()
        print(look, 'ok', flush=True)
    b.close()
srv.shutdown()
