# Disk cache for Google Fonts requests in Playwright tests: replays cached CSS/font files, fetches (and stores) misses.
import hashlib, os, json
DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fontcache')
def attach(ctx):
    def handle(route):
        url = route.request.url
        if 'fonts.googleapis.com' not in url and 'fonts.gstatic.com' not in url: return route.fallback()
        h = hashlib.sha1(url.encode()).hexdigest(); body, meta = os.path.join(DIR, h), os.path.join(DIR, h + '.json')
        if os.path.exists(body) and os.path.exists(meta):
            m = json.load(open(meta)); return route.fulfill(status=200, headers=m, body=open(body, 'rb').read())
        try:
            r = route.fetch(timeout=20000)
            hd = {k: v for k, v in r.headers.items() if k.lower() in ('content-type', 'access-control-allow-origin')}
            hd.setdefault('access-control-allow-origin', '*')
            open(body, 'wb').write(r.body()); json.dump(hd, open(meta, 'w'))
            route.fulfill(status=r.status, headers=hd, body=r.body())
        except Exception:
            route.abort()
    ctx.route('**/*', handle)
def patch():
    # attach the cache to every context and page the test makes
    from playwright.sync_api._generated import Browser
    nc, npg = Browser.new_context, Browser.new_page
    def new_context(self, *a, **k): c = nc(self, *a, **k); attach(c); return c
    def new_page(self, *a, **k): pg = npg(self, *a, **k); attach(pg.context); return pg
    Browser.new_context, Browser.new_page = new_context, new_page
