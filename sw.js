// 花合帖 service worker: once played, the home-screen game opens without a connection.
// The page and its translations are fetched fresh when online (a new version takes effect at once) and fall back to the
// copy from the last visit; art, cards, fonts and the sound and confetti libraries come from the cache and are refreshed
// in the background. Bump CACHE to drop everything kept by an older version.
const CACHE = 'hana-awase-v1';
const SHELL = ['./', './index.html', './i18n.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const CDN = /^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)$/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url), same = url.origin === self.location.origin;
  if (!same && !CDN.test(url.hostname)) return;
  const fresh = req.mode === 'navigate' || (same && /(\/|\.html|\/i18n\.js)$/.test(url.pathname));
  if (fresh) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true}).then(hit => hit || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
