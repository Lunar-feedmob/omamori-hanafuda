// Adapter for mini-game runtimes that follow the WeChat 小游戏 API shape (wx, and — assumed, to be checked against its docs — xhs).
// Everything the game needs from the host goes through this object; nothing else touches `api` directly.
module.exports = function miniGameAdapter(api, name) {
  const win = api.getWindowInfo ? api.getWindowInfo() : api.getSystemInfoSync();
  const canvas = api.createCanvas();          // the first canvas created is the on-screen one
  const dpr = win.pixelRatio || 2;
  canvas.width = Math.round(win.windowWidth * dpr); canvas.height = Math.round(win.windowHeight * dpr);
  const safe = win.safeArea || {top: 0, bottom: win.windowHeight};
  const sounds = {};
  let loopAudio = null;
  const call = (fn, ...a) => { try { return typeof api[fn] === 'function' ? api[fn](...a) : undefined; } catch (e) { return undefined; } };
  return {
    name, canvas, dpr,
    info: () => ({w: win.windowWidth, h: win.windowHeight, dpr, safeTop: safe.top || 0, safeBottom: win.windowHeight - (safe.bottom || win.windowHeight)}),
    onTouch(start, move, end) {
      const pt = e => { const t = (e.changedTouches || e.touches || [])[0] || {}; return {x: t.clientX, y: t.clientY}; };
      api.onTouchStart(e => start(pt(e))); api.onTouchMove(e => move(pt(e))); api.onTouchEnd(e => end(pt(e)));
    },
    loadImage: src => new Promise(res => { const im = api.createImage(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }),
    storage: {get: k => call('getStorageSync', k) || null, set: (k, v) => call('setStorageSync', k, v)},
    audio: {
      play(file, vol = 1) {
        const pool = sounds[file] || (sounds[file] = []);
        let a = pool.find(x => x.idle);
        if (!a) { a = api.createInnerAudioContext(); a.src = file; a.idle = true; a.onEnded(() => { a.idle = true; }); pool.push(a); }
        a.idle = false; a.volume = vol; a.seek(0); a.play();
      },
      loop(file, vol = .6) {
        if (loopAudio && loopAudio.src === file) { loopAudio.volume = vol; return; }
        if (loopAudio) loopAudio.destroy();
        loopAudio = api.createInnerAudioContext(); loopAudio.src = file; loopAudio.loop = true; loopAudio.volume = vol; loopAudio.play();
      },
      stopLoop() { if (loopAudio) { loopAudio.destroy(); loopAudio = null; } }
    },
    vibrate: kind => call('vibrateShort', {type: kind === 'win' ? 'heavy' : kind === 'miss' ? 'medium' : 'light'}),
    share: {
      setup(payload) { call('showShareMenu', {menus: ['shareAppMessage', 'shareTimeline']}); call('onShareAppMessage', payload); call('onShareTimeline', payload); }
    },
    // Poster: draw to an off-screen canvas, write a temp file, ask to save it into the album (the user grants album access once).
    offscreen: (w, h) => { const c = api.createCanvas(); c.width = w; c.height = h; return c; },
    saveImage: c => new Promise((res, rej) => {
      c.toTempFilePath({fileType: 'png', success: r => api.saveImageToPhotosAlbum({filePath: r.tempFilePath, success: res, fail: rej}), fail: rej});
    }),
    loadFont: (path, family) => call('loadFont', path) || family,
    raf: cb => requestAnimationFrame(cb),
    onShow: cb => call('onShow', cb), onHide: cb => call('onHide', cb)
  };
};
