/* 花合帖 · 小红书小工具 host bridge. Loaded before app.js.
   Sets window.OMA_HOST, which the page uses for storage, saving posters, posting notes and vibration; everything degrades
   to plain browser behaviour when window.xhs is missing (for example when previewing in a desktop browser). */
(function () {
  'use strict';
  // Small fallbacks for APIs newer than the container's Chrome 61 baseline (only what the page uses).
  if (!Array.prototype.flat) Object.defineProperty(Array.prototype, 'flat', {configurable: true, writable: true, value: function (d) {
    d = d === undefined ? 1 : d; return d < 1 ? this.slice() : this.reduce(function (a, x) { return a.concat(Array.isArray(x) ? x.flat(d - 1) : [x]); }, []); }});
  if (!Array.prototype.flatMap) Object.defineProperty(Array.prototype, 'flatMap', {configurable: true, writable: true, value: function (f, t) { return this.map(f, t).flat(1); }});
  if (!Object.fromEntries) Object.fromEntries = function (it) { var o = {}; Array.from(it).forEach(function (kv) { o[kv[0]] = kv[1]; }); return o; };

  var mt = function () { return window.xhs && window.xhs.miniTool; };
  var has = function (name) { var m = mt(); return !!(m && typeof m[name] === 'function'); };
  // buildVersion 9462004 means client 9.46.2 (the last three digits are a build number).
  var clientVersion = 0;
  function readVersion() {
    var lo = window.xhs && window.xhs.launchOptions, env = lo && lo.miniToolEnv, v = Number(env && env.buildVersion) || 0;
    if (v) return Promise.resolve(Math.floor(v / 1000));
    if (!has('getLaunchOptions')) return Promise.resolve(0);
    return mt().getLaunchOptions().then(function (o) { var e = o && o.miniToolEnv; return Math.floor((Number(e && e.buildVersion) || 0) / 1000); }, function () { return 0; });
  }
  var atLeast = function (v) { return clientVersion >= v; };

  // Storage: the platform's Storage API from client 9.46 (1 MB per key), else browser storage, which the container does
  // not promise to keep. Reads come from a copy loaded at start-up, so the page can stay synchronous; writes are queued.
  var mem = {}, useXhs = false, writing = {}, pending = {};
  function ls(op, k, v) { try { if (op === 'get') return localStorage.getItem(k); if (op === 'set') localStorage.setItem(k, v); if (op === 'remove') localStorage.removeItem(k); } catch (e) {} return null; }
  function flush(k) {
    if (writing[k]) return;
    writing[k] = true;
    var v = pending[k]; delete pending[k];
    var done = function () { writing[k] = false; if (k in pending) flush(k); };
    if (v === null) mt().removeStorage({key: k}).then(done, done);
    else mt().setStorage({key: k, data: v}).then(done, function () { ls('set', k, v); done(); });
  }
  var storage = {
    get: function (k) { return k in mem ? mem[k] : null; },
    set: function (k, v) { mem[k] = v; if (useXhs) { pending[k] = v; flush(k); } else ls('set', k, v); },
    remove: function (k) { delete mem[k]; if (useXhs) { pending[k] = null; flush(k); } ls('remove', k); }
  };
  var KEYS = ['omamori-hanafuda-v1'];
  function loadStorage() {
    if (!(atLeast(9460) && has('setStorage') && has('getStorage'))) { KEYS.forEach(function (k) { var v = ls('get', k); if (v !== null) mem[k] = v; }); return Promise.resolve(); }
    useXhs = true;
    return Promise.all(KEYS.map(function (k) {
      return mt().getStorage({key: k}).then(function (r) {
        var v = r && typeof r.data === 'string' ? r.data : null;
        if (v === null) { v = ls('get', k); if (v !== null) storage.set(k, v); }   // carry over what an older client kept in browser storage
        if (v !== null) mem[k] = v;
      }, function () { var v = ls('get', k); if (v !== null) mem[k] = v; });
    }));
  }

  // Leave room for the container's own buttons at the top (client 9.49+ reports where they are).
  function layout() {
    if (!(atLeast(9490) && has('getWindowInfo'))) return Promise.resolve();
    return mt().getWindowInfo().then(function (info) {
      var mb = (info && info.menuButtons) || {}, top = 0;
      ['back', 'me', 'share'].forEach(function (k) { var r = mb[k]; if (r && r.top < 120) top = Math.max(top, r.bottom + 6); });
      if (top) document.documentElement.style.setProperty('--xhs-top', top + 'px');
    }, function () {});
  }

  function tempFile(dataUrl) { return mt().writeTempFile({data: dataUrl}).then(function (r) { return r.filePath; }); }
  var host = {
    name: 'xhs',
    cardExt: {classic: 'webp', sumi: 'webp', shu: 'webp', hwatu: 'webp'},
    storage: storage, vibrate: null, saveImage: null, postNote: null,
    ready: null
  };
  host.ready = readVersion().then(function (v) {
    clientVersion = v;
    if (has('saveImageToPhotosAlbum') && has('writeTempFile')) host.saveImage = function (dataUrl) {
      return tempFile(dataUrl).then(function (p) { return mt().saveImageToPhotosAlbum({filePath: p}); }).then(function () { return true; }, function () { return false; });
    };
    if (has('postNote') && has('writeTempFile')) host.postNote = function (o) {
      return tempFile(o.image).then(function (p) {
        return mt().postNote({title: o.title, content: o.content, pageType: 'photo_publish', mediaInfo: {image_resources: [{url: p}]}});
      }).then(function () { return true; }, function () { return false; });
    };
    if (atLeast(9500) && has('vibrateShort')) host.vibrate = function (kind) {
      var type = {win: 'heavy', miss: 'medium', combo: 'medium', lose: 'medium'}[kind] || 'light';
      mt().vibrateShort({type: type}).catch(function () {});
    };
    return Promise.all([loadStorage(), layout()]);
  }).catch(function () {});
  window.OMA_HOST = host;
})();
