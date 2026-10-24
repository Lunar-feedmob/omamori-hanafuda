// A garden in play: HUD, the board, look-again and restart, toasts, and the result popup.
const {LEVELS, SEASONS, KANJI, BY_ID, WIN_TITLE, LOSE_TITLE, OM_TIERS} = require('../core/data');
const {Game} = require('../core/rules');
const {rr, text, wrap, ease} = require('../render/ui');

module.exports = function Play(app, n, again) {
  const {ui} = app, s = app.save;
  let game, cards, cols = 0, hint = '', hintUntil = 0, toast = null, banner = null, last = Date.now(), dealAt = 0;
  const say = (msg, ms) => { hint = msg; hintUntil = ms ? Date.now() + ms : 0; };
  const cardSrc = id => `assets/cards/${s.skin === 'classic' ? 'classic' : 'classic'}/${BY_ID[id].file}.jpg`;
  function emit(ev, d) {
    if (ev === 'flip') app.sfx('flip');
    else if (ev === 'unflip') app.sfx('unflip');
    else if (ev === 'miss') { app.buzz('miss'); say('不是一对，记下它们 · 点任意处继续'); }
    else if (ev === 'match') {
      app.buzz('match'); cards[d.cards[0]].pop = cards[d.cards[1]].pop = Date.now();
      const m = BY_ID[d.id], first = game.fresh[game.fresh.length - 1] === d.id;
      toast = {at: Date.now(), t1: first ? '初见 · 记入图鉴' : '再会 · 御守 +1', t2: `${m.jp} · ${m.cn}`, t3: `${m.mean} · 收下一枚${m.om}`, id: d.id};
      say(d.combo >= 2 ? `连续配对 ${d.combo} 组` : '翻开两张，找出成对的花札');
      app.persist();
    } else if (ev === 'upgrade') toast = {at: Date.now(), t1: `御守升级 · ${OM_TIERS[d.tier].name}`, t2: BY_ID[d.id].om, t3: d.tier > 1 ? '金线织满，愿望圆满' : '布面绣上了金线', id: d.id};
    else if (ev === 'combo') banner = {at: Date.now(), k: {3: '三連', 5: '五連', 7: '七連'}[d], line: {3: '花信 · 多给一步', 5: '风来 · 多一次回看', 7: '花吹雪'}[d]};
    else if (ev === 'win') { app.persist(); app.buzz('win'); ui.later(() => ui.show(Result(true)), 900); }
    else if (ev === 'lose') { app.persist(); ui.later(() => ui.show(Result(false)), 600); }
    ui.animate(600);
  }
  function start(ids) {
    game = new Game(n, s, emit, ids);
    cards = game.deck.map(() => ({f: 0, pop: 0}));
    cols = 0; toast = banner = null; dealAt = Date.now();
    say('发牌中…'); app.sfx('deal');
    ui.preload(game.ids.map(cardSrc).concat([app.theme().back]));
    const ready = () => game.ids.every(id => ui.img(cardSrc(id))) || Date.now() - dealAt > 4000;
    const wait = () => { if (!ready()) { ui.later(wait, 120); return; } const ms = game.startPreview(); say('看一眼，记在心里', ms); app.sfx('peek'); ui.later(() => { game.endPreview(); app.sfx('unflip'); say('翻开两张，找出成对的花札'); }, ms); };
    ui.later(wait, 450 + game.deck.length * 22);
  }
  function tap(i) {
    const ms = game.tap(i);
    if (ms) ui.later(() => { if (game.pending) game.resolve(); }, ms);
    if (game.phase === 'play' && game.first !== null) say('再翻一张');
  }
  function peek() { const ms = game.peek(); if (!ms) return; app.sfx('peek'); say('再看一眼，步数不变', ms); ui.later(() => { game.endPeek(); app.sfx('unflip'); say('翻开两张，找出成对的花札'); }, ms); }

  // the result popup, worded per look
  function Result(won) {
    const th = app.theme(), L = game.L, at = Date.now();
    return {
      draw(c, t, w, h) {
        const k = ease((t - at) / 300);
        ui.area('scrim', 0, 0, w, h, null, {block: true});
        c.fillStyle = `rgba(0,0,0,${.45 * k})`; c.fillRect(0, 0, w, h);
        const pw = Math.min(w - 32, 400), ph = 340, px = (w - pw) / 2, py = (h - ph) / 2 + (1 - k) * 16;
        c.globalAlpha = k; th.panel(c, px, py, pw, ph); th.ornament(c, px, py, pw);
        const x = px + 20;
        text(c, `${SEASONS[L.s].name} · 第${KANJI[L.n - 1]}庭 · ${L.name}`, x, py + 40, {size: 12, color: th.muted, font: th.font});
        text(c, won ? (L.n === LEVELS.length ? '八处庭院，全部点亮' : WIN_TITLE[s.look] || '庭院点亮了') : LOSE_TITLE[s.look] || '步数用尽了', x, py + 74, {size: 24, weight: 700, color: th.text, font: th.title});
        let y = py + 104;
        if (won) {
          text(c, L.haiku[0], x, y, {size: 14, color: th.text, font: th.font}); y += 20;
          text(c, `${L.haiku[1]}　— ${L.haiku[2]}`, x, y, {size: 12, color: th.muted, font: th.font}); y += 30;
          const fl = game.flowers(); text(c, '✿✿✿'.slice(0, fl) + '·'.repeat(3 - fl), x, y + 6, {size: 28, color: th.accent, font: th.font}); y += 30;
          y = wrap(c, `${isFinite(game.budget) ? `用了 ${game.used} 步，还剩 ${game.left} 步。` : `用了 ${game.used} 步。`}收下御守 ${game.total} 枚。${game.yaku.length ? '凑成役：' + game.yaku.join('、') + '。' : ''}`, x, y, pw - 40, 18, {size: 13, color: th.muted, font: th.font});
        } else {
          y = wrap(c, `步数用尽了。配成 ${game.pairs} / ${game.total} 组。再来一次时，步数和回看都会恢复，牌也会重新洗过。`, x, y, pw - 40, 20, {size: 13, color: th.muted, font: th.font});
        }
        const bw = pw - 40, by = py + ph - 116, nextL = LEVELS[L.n];
        const primary = won ? (nextL ? `前往 · ${nextL.name}` : '返回庭院') : '重试本关';
        const pa = ui.area('r-primary', x, by, bw, 48, () => { ui.hide(); app.sfx('tap'); if (!won) start(); else if (nextL) ui.go(Play(app, nextL.n)); else app.home(); });
        th.button(c, x, by, bw, 48, primary, true, pa.down, 16);
        const half = (bw - 10) / 2;
        const ra = ui.area('r-again', x, by + 58, half, 44, () => { ui.hide(); app.sfx('tap'); start(won ? null : game.ids); });
        th.button(c, x, by + 58, half, 44, won ? '再玩一次' : '同一组牌', false, ra.down, 14);
        const ha = ui.area('r-home', x + half + 10, by + 58, half, 44, () => { ui.hide(); app.sfx('tap'); app.home(); });
        th.button(c, x + half + 10, by + 58, half, 44, '返回庭院', false, ha.down, 14);
        c.globalAlpha = 1;
        if (k < 1) ui.animate(50);
      }
    };
  }

  function layout(W, H, N) {
    const gap = W < 480 ? 6 : 10, ratio = 100 / 61, MAX = W < 480 ? 92 : 140;
    const fit = cc => { const rows = Math.ceil(N / cc); return Math.min((W - gap * (cc - 1)) / cc, ((H - gap * (rows - 1)) / rows) / ratio, MAX); };
    let best = null;
    for (let cc = 2; cc <= N; cc++) { const wv = fit(cc), score = wv - (cc * Math.ceil(N / cc) - N) * .6; if (!best || score > best.score) best = {cc, wv, score}; }
    if (!cols || fit(cols) < best.wv * .8) cols = best.cc;   // keep the arrangement for the whole garden
    return {cols, cw: Math.floor(fit(cols)), gap};
  }

  if (app.pf.name === 'web' && typeof window !== 'undefined') window.__game = () => game;   // test hook, browser preview only
  return {
    onEnter() { start(again); },
    onTapEmpty() { if (game.pending && game.pending.miss) { game.resolve(); ui.animate(400); } },
    draw(c, t, w, h) {
      const th = app.theme(), sf = app.pf.info(), pad = 16, W = w - pad * 2, dt = Math.min(64, t - last); last = t;
      th.background(c, w, h, t);
      const top = sf.safeTop + 8;
      // top bar
      const back = ui.area('back', pad, top, 44, 44, () => { app.sfx('tap'); app.home(); });
      th.button(c, pad, top, 44, 44, '‹', false, back.down, 22);
      text(c, `${SEASONS[game.L.s].name} · 第${KANJI[game.n - 1]}庭`, w / 2, top + 16, {size: 11, color: th.muted, font: th.font, align: 'center'});
      text(c, game.L.name, w / 2, top + 40, {size: 22, weight: 700, color: th.text, font: th.title, align: 'center', spacing: 2});
      const snd = ui.area('sound', w - pad - 44, top, 44, 44, () => { s.sound = !s.sound; app.persist(); if (s.sound) app.sfx('tap'); });
      th.button(c, w - pad - 44, top, 44, 44, s.sound ? '♪' : '–', false, snd.down, 18);
      // HUD
      const hy = top + 54, hh = 54, hw = (W - 8) / 2;
      th.panel(c, pad, hy, hw, hh); th.panel(c, pad + hw + 8, hy, hw, hh);
      const limited = isFinite(game.budget), low = limited && game.left <= 3;
      text(c, limited ? '剩余步数' : '已用步数', pad + 12, hy + 18, {size: 11, color: th.muted, font: th.font});
      const mw = text(c, String(limited ? game.left : game.used), pad + 12, hy + 45, {size: 26, weight: 700, color: low ? th.shu : th.text, font: th.font});
      text(c, limited ? `/ ${game.budget}` : '不限', pad + 16 + mw, hy + 45, {size: 13, color: th.muted, font: th.font});
      if (limited) { c.fillStyle = th.line; c.fillRect(pad + hw - 60, hy + 40, 48, 4); c.fillStyle = low ? th.shu : th.accent; c.fillRect(pad + hw - 60, hy + 40, 48 * Math.max(0, game.left / game.budget), 4); }
      text(c, game.combo >= 2 ? `已配对 · 连续 ${game.combo}` : '已配对', pad + hw + 20, hy + 18, {size: 11, color: game.combo >= 2 ? th.accent : th.muted, font: th.font});
      const pw2 = text(c, String(game.pairs), pad + hw + 20, hy + 45, {size: 26, weight: 700, color: th.text, font: th.font});
      text(c, `/ ${game.total} 组`, pad + hw + 24 + pw2, hy + 45, {size: 13, color: th.muted, font: th.font});
      // hint
      if (hintUntil && t > hintUntil) hintUntil = 0;
      text(c, hint, w / 2, hy + hh + 24, {size: 13, color: th.muted, font: th.font, align: 'center'});
      // buttons
      const by = h - sf.safeBottom - 12 - 50;
      const canPeek = game.phase === 'play' && game.peeks > 0;
      const pk = ui.area('peek', pad, by, W - 98, 50, canPeek ? peek : null);
      c.globalAlpha = canPeek ? 1 : .45; th.button(c, pad, by, W - 98, 50, `重新看牌 · ${game.peeks}`, true, pk.down, 16); c.globalAlpha = 1;
      const rs = ui.area('restart', w - pad - 88, by, 88, 50, () => { app.sfx('tap'); start(game.ids); });
      th.button(c, w - pad - 88, by, 88, 50, '重来', false, rs.down, 15);
      // board
      const bTop = hy + hh + 40, bH = by - 12 - bTop, inner = 10;
      const {cols: cc, cw, gap} = layout(W - inner * 2, bH - inner * 2, game.deck.length), ch = Math.round(cw * 100 / 61), rows = Math.ceil(game.deck.length / cc);
      const gw = cc * cw + (cc - 1) * gap, gh = rows * ch + (rows - 1) * gap, gx = (w - gw) / 2, gy = bTop + (bH - gh) / 2;
      th.board(c, gx - inner, gy - inner, gw + inner * 2, gh + inner * 2);
      const backIm = ui.img(th.back);
      let moving = false;
      game.deck.forEach((cd, i) => {
        const r = Math.floor(i / cc), inRow = Math.min(cc, game.deck.length - r * cc), col = i % cc;
        const x = (w - (inRow * cw + (inRow - 1) * gap)) / 2 + col * (cw + gap), y = gy + r * (ch + gap);
        const target = cd.up || cd.done || cd.peek ? 1 : 0, st = cards[i];
        if (st.f !== target) { st.f += Math.sign(target - st.f) * dt / 360; st.f = Math.min(1, Math.max(0, st.f)); if (Math.abs(st.f - target) < .01) st.f = target; moving = true; }
        const deal = ease((t - dealAt - i * 22) / 420); if (deal < 1) moving = true;
        const sx = Math.abs(Math.cos(st.f * Math.PI)), showFace = st.f > .5;
        const pop = st.pop ? Math.sin(Math.min(1, (t - st.pop) / 500) * Math.PI) * .07 : 0; if (st.pop && t - st.pop < 500) moving = true;
        const scale = 1 + pop;
        ui.area('card' + i, x, y, cw, ch, () => tap(i));
        c.save(); c.globalAlpha = deal; c.translate(x + cw / 2, y + ch / 2 + (1 - deal) * 14); c.scale(sx * scale, scale);
        c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
        rr(c, -cw / 2, -ch / 2, cw, ch, cw * (showFace ? .04 : .08)); c.fillStyle = showFace ? '#fff' : th.panelBg; c.fill(); c.shadowColor = 'transparent';
        c.clip();
        const im = showFace ? ui.img(cardSrc(cd.id)) : backIm;
        if (im) c.drawImage(im, -cw / 2, -ch / 2, cw, ch);
        c.restore();
        if (cd.done && st.f === 1) { c.lineWidth = 3; c.strokeStyle = th.accent; rr(c, x - 3, y - 3, cw + 6, ch + 6, cw * .06); c.stroke(); }
      });
      if (moving) ui.animate(80);
      // a streak seal
      if (banner) {
        const k = (t - banner.at) / 1800;
        if (k >= 1) banner = null; else {
          const a = k < .15 ? k / .15 : k > .8 ? (1 - k) / .2 : 1, cx = w / 2, cy = bTop + bH / 2;
          c.globalAlpha = a; c.save(); c.translate(cx, cy); c.rotate(-.08); rr(c, -46, -46, 92, 92, 10); c.fillStyle = 'rgba(255,255,255,.92)'; c.fill(); c.lineWidth = 4; c.strokeStyle = '#c23b22'; c.stroke();
          text(c, banner.k, 0, 10, {size: 30, weight: 900, color: '#c23b22', font: th.title, align: 'center'}); c.restore();
          text(c, banner.line, cx, cy + 72, {size: 14, weight: 700, color: th.text, font: th.font, align: 'center'}); c.globalAlpha = 1; ui.animate(60);
        }
      }
      // toast
      if (toast) {
        const k = (t - toast.at) / 1900;
        if (k >= 1) toast = null; else {
          const a = k < .1 ? k / .1 : k > .85 ? (1 - k) / .15 : 1, tw = Math.min(W, 300), tx = (w - tw) / 2, ty = by - 76 + (1 - Math.min(1, k * 8)) * 10;
          c.globalAlpha = a; th.panel(c, tx, ty, tw, 64);
          const im = ui.img(cardSrc(toast.id)); if (im) { c.save(); rr(c, tx + 8, ty + 8, 29, 48, 2); c.clip(); c.drawImage(im, tx + 8, ty + 8, 29, 48); c.restore(); }
          text(c, toast.t1, tx + 46, ty + 20, {size: 11, color: th.accent, font: th.font});
          text(c, toast.t2, tx + 46, ty + 38, {size: 14, weight: 700, color: th.text, font: th.font});
          text(c, toast.t3, tx + 46, ty + 55, {size: 11, color: th.muted, font: th.font});
          c.globalAlpha = 1; ui.animate(60);
        }
      }
    }
  };
};
