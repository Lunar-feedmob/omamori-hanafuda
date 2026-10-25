/* A small stand-in for canvas-confetti (the original creates Web Workers, which the 小工具 container forbids).
   Same call shape as the page uses: confetti({particleCount, angle, spread, startVelocity, origin, colors, shapes, gravity,
   drift, ticks, scalar, zIndex}) and confetti.shapeFromPath({path}). Petals fall on a fixed canvas under the cards. */
(function () {
  'use strict';
  var layers = {};
  function layer(z) {
    if (layers[z]) return layers[z];
    var c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:' + z;
    document.body.appendChild(c);
    var L = {canvas: c, ctx: c.getContext('2d'), parts: [], running: false};
    layers[z] = L;
    return L;
  }
  function frame(L) {
    var c = L.canvas, g = L.ctx, dpr = Math.min(2, window.devicePixelRatio || 1), w = innerWidth, h = innerHeight;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    L.parts = L.parts.filter(function (p) { return p.tick < p.ticks; });
    L.parts.forEach(function (p) {
      p.x += Math.cos(p.angle) * p.v + p.drift; p.y += Math.sin(p.angle) * p.v + p.gravity * 3;
      p.v *= 0.9; p.tick++; p.wobble += 0.1; p.tilt += 0.08;
      var a = 1 - p.tick / p.ticks, sx = Math.cos(p.tilt) * p.scalar, sy = (0.6 + 0.4 * Math.sin(p.wobble)) * p.scalar;
      g.save(); g.globalAlpha = Math.max(0, a); g.fillStyle = p.color; g.translate(p.x, p.y + Math.sin(p.wobble) * 3); g.rotate(p.tilt * 0.6); g.scale(sx * 0.6, sy * 0.6);
      if (p.path) g.fill(p.path); else { g.beginPath(); g.arc(0, 0, 5, 0, Math.PI * 2); g.fill(); }
      g.restore();
    });
    if (L.parts.length) requestAnimationFrame(function () { frame(L); }); else { L.running = false; g.clearRect(0, 0, w, h); }
  }
  function confetti(o) {
    o = o || {};
    if (o.disableForReducedMotion && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var L = layer(o.zIndex || 100), n = o.particleCount || 50, colors = o.colors || ['#f6c1cc', '#efb3bf', '#fbe6ea'];
    var shape = o.shapes && o.shapes[0] && o.shapes[0].path2d ? o.shapes[0].path2d : null;
    var ox = (o.origin && o.origin.x != null ? o.origin.x : 0.5) * innerWidth, oy = (o.origin && o.origin.y != null ? o.origin.y : 0.5) * innerHeight;
    var ang = -(o.angle == null ? 90 : o.angle) * Math.PI / 180, spread = (o.spread == null ? 45 : o.spread) * Math.PI / 180;
    for (var i = 0; i < n; i++) L.parts.push({
      x: ox, y: oy, angle: ang + (Math.random() - 0.5) * spread, v: (o.startVelocity || 45) * (0.5 + Math.random() * 0.5) * 0.5,
      gravity: o.gravity == null ? 1 : o.gravity, drift: (o.drift || 0) + (Math.random() - 0.5) * 0.6, ticks: o.ticks || 200, tick: 0,
      wobble: Math.random() * 10, tilt: Math.random() * Math.PI, scalar: o.scalar || 1, color: colors[i % colors.length], path: shape
    });
    if (!L.running) { L.running = true; requestAnimationFrame(function () { frame(L); }); }
  }
  confetti.shapeFromPath = function (o) { var p = null; try { p = new Path2D(o.path); } catch (e) {} return {path2d: p}; };
  window.confetti = confetti;
})();
