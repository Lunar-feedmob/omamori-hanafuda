# Render cards.html into ten 1080x1440 PNGs for the 小红书 note.
import os, sys, threading, http.server, functools, socketserver
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools', 'test'))
from playwright.sync_api import sync_playwright
import fontcache
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); OUT = os.path.join(os.path.dirname(__file__), 'png')
os.makedirs(OUT, exist_ok=True)
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT); H.log_message = lambda *a: None
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={'width': 1080, 'height': 1440}, device_scale_factor=1); fontcache.attach(ctx); pg = ctx.new_page()
    pg.goto(f'http://127.0.0.1:{port}/docs/xhs-note/cards.html', wait_until='load', timeout=120000)
    pg.evaluate("document.fonts.ready"); pg.wait_for_function("[...document.images].every(i => i.complete && i.naturalWidth)", timeout=60000); pg.wait_for_timeout(800)
    for i in range(1, 11):
        pg.locator(f'#c{i}').screenshot(path=f'{OUT}/{i:02d}.png')
        over = pg.evaluate(f"(() => {{ const c = document.getElementById('c{i}'), r = c.getBoundingClientRect(); return [...c.querySelectorAll('*')].filter(e => {{ const q = e.getBoundingClientRect(); return q.height && (q.bottom > r.bottom - 40 || q.right > r.right + 1) && !e.closest('.phones') && !e.matches('.num,.brand'); }}).map(e => e.className || e.tagName).slice(0, 4); }})()")
        print(f'{i:02d}.png', 'content near the edge:' if over else 'ok', over or '')
    b.close()
srv.shutdown()
