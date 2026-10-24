// Browser adapter, used for development and automated tests (tools/build-web.mjs bundles the game into dev/index.html).
module.exports = function webAdapter() {
  const canvas = document.getElementById('stage') || document.body.appendChild(document.createElement('canvas'));
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  const size = () => { canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr); canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; };
  size();
  const sounds = {};
  let loopAudio = null;
  return {
    name: 'web', canvas, dpr,
    info: () => ({w: innerWidth, h: innerHeight, dpr, safeTop: 0, safeBottom: 0}),
    onTouch(start, move, end) {
      const pt = e => { const r = canvas.getBoundingClientRect(); return {x: e.clientX - r.left, y: e.clientY - r.top}; };
      canvas.addEventListener('pointerdown', e => start(pt(e))); canvas.addEventListener('pointermove', e => move(pt(e))); canvas.addEventListener('pointerup', e => end(pt(e)));
    },
    loadImage: src => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }),
    storage: {get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }},
    audio: {
      play(file, vol = 1) { try { const a = (sounds[file] = sounds[file] || new Audio(file)).cloneNode(); a.volume = vol; a.play().catch(() => {}); } catch (e) {} },
      loop(file, vol = .6) { try { if (!loopAudio || !loopAudio.src.endsWith(file)) { if (loopAudio) loopAudio.pause(); loopAudio = new Audio(file); loopAudio.loop = true; } loopAudio.volume = vol; loopAudio.play().catch(() => {}); } catch (e) {} },
      stopLoop() { if (loopAudio) loopAudio.pause(); }
    },
    vibrate: kind => { try { navigator.vibrate && navigator.vibrate(kind === 'win' ? [16, 60, 30] : kind === 'miss' ? [8, 40, 8] : 12); } catch (e) {} },
    share: {setup() {}},
    offscreen: (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; },
    saveImage: c => new Promise(res => { const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'omamori-hanafuda.png'; a.click(); res(); }),
    loadFont: (path, family) => { try { const f = new FontFace(family, `url(${path})`); f.load().then(x => document.fonts.add(x)); } catch (e) {} return family; },
    raf: cb => requestAnimationFrame(cb),
    onShow: cb => document.addEventListener('visibilitychange', () => !document.hidden && cb()),
    onHide: cb => document.addEventListener('visibilitychange', () => document.hidden && cb()),
    onResize: cb => addEventListener('resize', () => { size(); cb(); })
  };
};
