/* tone-lite: the part of Tone.js 14 that 花合帖 uses, rebuilt on plain Web Audio for the 小红书小工具 container
   (the full library carries Worker / fetch code paths the container forbids, and weighs 350 KB).
   Same names and call shapes as Tone: Volume, Gain, Reverb, Filter, Vibrato, Tremolo, AutoFilter, Noise, Synth, FMSynth,
   NoiseSynth, MembraneSynth, PluckSynth, PolySynth, ToneAudioBuffers, ToneBufferSource, Frequency, now, start, context,
   Destination. Plucked strings are computed into buffers (Karplus-Strong in JS), because a Web Audio feedback loop can't
   be shorter than 128 samples and so couldn't reach the high notes. Card foley is synthesised, since the package carries no
   audio files. */
(function () {
  'use strict';
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  var ctx = null, master = null, muted = false;
  function C() { if (!ctx) { ctx = new AC(); master = ctx.createGain(); master.connect(ctx.destination); } return ctx; }
  function M() { C(); return master; }
  var dbToGain = function (db) { return Math.pow(10, db / 20); };
  var gainToDb = function (g) { return 20 * Math.log10(Math.max(1e-6, g)); };
  var NOTE = {C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11};
  var NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  function midi(n) { if (typeof n === 'number') return 69 + 12 * Math.log2(n / 440); var m = /^([A-G][#b]?)(-?\d)$/.exec(n); return NOTE[m[1]] + (+m[2] + 1) * 12; }
  function hz(n) { return typeof n === 'number' ? n : 440 * Math.pow(2, (midi(n) - 69) / 12); }
  function nameOf(m) { m = Math.round(m); return NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }
  function env(o, d) { o = o || {}; return {attack: o.attack != null ? o.attack : d.attack, decay: o.decay != null ? o.decay : d.decay, sustain: o.sustain != null ? o.sustain : d.sustain, release: o.release != null ? o.release : d.release}; }
  // a gain envelope on an AudioParam: attack to `peak`, decay to sustain, release at `end`; returns when it falls silent
  function shape(param, t, end, e, peak) {
    param.cancelScheduledValues(t); param.setValueAtTime(0, t);
    param.linearRampToValueAtTime(peak, t + Math.max(.001, e.attack));
    var s = Math.max(1e-4, peak * e.sustain), dEnd = t + e.attack + Math.max(.001, e.decay);
    if (end > dEnd) { param.exponentialRampToValueAtTime(Math.max(1e-4, s), dEnd); param.setValueAtTime(Math.max(1e-4, s), end); }
    else param.exponentialRampToValueAtTime(Math.max(1e-4, s + (peak - s) * Math.max(0, 1 - (end - t - e.attack) / Math.max(.001, e.decay))), Math.max(end, t + e.attack + .002));
    param.exponentialRampToValueAtTime(1e-4, end + Math.max(.01, e.release));
    return end + Math.max(.01, e.release) + .05;
  }
  // Param: Tone-style volume (dB) or gain knob over an AudioParam
  function Param(audioParam, db) {
    this.p = audioParam; this.db = db;
  }
  Object.defineProperty(Param.prototype, 'value', {
    get: function () { return this.db ? gainToDb(this.p.value) : this.p.value; },
    set: function (v) { this.p.setValueAtTime(this.db ? dbToGain(v) : v, C().currentTime); }
  });
  Param.prototype.rampTo = function (v, secs) {
    var t = C().currentTime, g = this.db ? dbToGain(v) : v;
    this.p.cancelScheduledValues(t); this.p.setValueAtTime(this.p.value, t); this.p.linearRampToValueAtTime(g, t + (secs || .1));
  };

  function Node() {}
  Node.prototype.connect = function (dst) { this.output.connect(dst && dst.input ? dst.input : dst); return this; };
  Node.prototype.toDestination = function () { this.output.connect(M()); return this; };
  Node.prototype.start = function () { return this; };
  Node.prototype.dispose = function () { try { this.output.disconnect(); } catch (e) {} };
  function inherit(F) { F.prototype = Object.create(Node.prototype); F.prototype.constructor = F; return F; }
  function volNode(self, db) { self.output = C().createGain(); self.output.gain.value = dbToGain(db || 0); self.volume = new Param(self.output.gain, true); }

  var Volume = inherit(function Volume(db) { volNode(this, db); this.input = this.output; });
  var Gain = inherit(function Gain(g) { this.input = this.output = C().createGain(); this.output.gain.value = g == null ? 1 : g; this.gain = new Param(this.output.gain, false); });
  var Filter = inherit(function Filter(freq, type) { var f = C().createBiquadFilter(); f.type = type || 'lowpass'; f.frequency.value = freq || 1000; this.input = this.output = f; this.frequency = new Param(f.frequency, false); });

  var Reverb = inherit(function Reverb(o) {
    o = o || {}; var c = C();
    this.decay = o.decay || 1.5; this.preDelay = o.preDelay || .01; var wet = o.wet == null ? 1 : o.wet;
    this.input = c.createGain(); this.output = c.createGain();
    var dry = c.createGain(); dry.gain.value = 1 - wet; this.wetGain = c.createGain(); this.wetGain.gain.value = wet;
    this.conv = c.createConvolver();
    this.input.connect(dry); dry.connect(this.output); this.input.connect(this.conv); this.conv.connect(this.wetGain); this.wetGain.connect(this.output);
  });
  Reverb.prototype.generate = function () {
    var c = C(), sr = c.sampleRate, len = Math.floor(sr * (this.decay + this.preDelay)), buf = c.createBuffer(2, len, sr), pre = Math.floor(sr * this.preDelay);
    for (var ch = 0; ch < 2; ch++) { var d = buf.getChannelData(ch); for (var i = pre; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - (i - pre) / (len - pre), 2.2); }
    this.conv.buffer = buf; return Promise.resolve(this);
  };

  function lfo(freq) { var o = C().createOscillator(); o.frequency.value = freq; return o; }
  var Vibrato = inherit(function Vibrato(freq, depth) {
    var c = C(); this.input = c.createDelay(.05); this.input.delayTime.value = .006; this.output = this.input;
    this.l = lfo(freq || 5); var g = c.createGain(); g.gain.value = .004 * (depth == null ? .1 : depth) * 4; this.l.connect(g); g.connect(this.input.delayTime); this.l.start();
  });
  var Tremolo = inherit(function Tremolo(freq, depth) {
    var c = C(); depth = depth == null ? .5 : depth; this.input = this.output = c.createGain(); this.output.gain.value = 1 - depth / 2;
    this.l = lfo(freq || 10); var g = c.createGain(); g.gain.value = depth / 2; this.l.connect(g); g.connect(this.output.gain);
  });
  Tremolo.prototype.start = function () { if (!this.on) { this.on = true; this.l.start(); } return this; };
  var AutoFilter = inherit(function AutoFilter(o) {
    o = o || {}; var c = C(); this.f = c.createBiquadFilter(); this.f.type = 'lowpass'; this.input = this.output = this.f;
    this.oct = o.octaves == null ? 2.6 : o.octaves; this.depth = o.depth == null ? 1 : o.depth;
    this.l = lfo(o.frequency || 1); this.amt = c.createGain(); this.l.connect(this.amt); this.amt.connect(this.f.frequency);
    this.baseFrequency = o.baseFrequency || 200;
  });
  Object.defineProperty(AutoFilter.prototype, 'baseFrequency', {
    get: function () { return this._base; },
    set: function (b) { this._base = b; var span = b * (Math.pow(2, this.oct) - 1) * this.depth / 2; this.f.frequency.setValueAtTime(b + span, C().currentTime); this.amt.gain.setValueAtTime(span, C().currentTime); }
  });
  AutoFilter.prototype.start = function () { if (!this.on) { this.on = true; this.l.start(); } return this; };

  // noise buffers, made once
  var noiseCache = {};
  function noiseBuffer(type) {
    if (noiseCache[type]) return noiseCache[type];
    var c = C(), len = c.sampleRate * 2, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0), b0 = 0, b1 = 0, b2 = 0, last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (type === 'pink') { b0 = .997 * b0 + w * .029591; b1 = .985 * b1 + w * .032534; b2 = .95 * b2 + w * .048056; d[i] = (b0 + b1 + b2 + w * .1848) * .7; }
      else if (type === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; }
      else d[i] = w;
    }
    return (noiseCache[type] = b);
  }
  var Noise = inherit(function Noise(type) { this.type = type || 'white'; this.output = C().createGain(); this.state = 'stopped'; });
  Noise.prototype.start = function () { if (this.state === 'started') return this; var s = C().createBufferSource(); s.buffer = noiseBuffer(this.type); s.loop = true; s.connect(this.output); s.start(); this.src = s; this.state = 'started'; return this; };
  Noise.prototype.stop = function () { if (this.src) { try { this.src.stop(); } catch (e) {} this.src = null; } this.state = 'stopped'; return this; };

  // ---- instruments: every note builds its own small graph and lets it go when it falls silent ----
  function oscs(type, count, spread) {
    var c = C(), list = [];
    if (/^fat/.test(type)) { var base = type.slice(3), n = count || 3, s = spread || 20; for (var i = 0; i < n; i++) { var o = c.createOscillator(); o.type = base; o.detune.value = n > 1 ? -s / 2 + s * i / (n - 1) : 0; list.push(o); } }
    else { var o1 = c.createOscillator(); o1.type = type || 'triangle'; list.push(o1); }
    return list;
  }
  var Synth = inherit(function Synth(o) {
    o = o || {}; volNode(this, o.volume); this.osc = o.oscillator || {}; this.env = env(o.envelope, {attack: .005, decay: .1, sustain: .3, release: 1}); this.porta = o.portamento || 0;
  });
  Synth.prototype._voice = function (note, t, vel) {
    var c = C(), g = c.createGain(), list = oscs(this.osc.type, this.osc.count, this.osc.spread), k = 1 / list.length;
    list.forEach(function (o) { o.frequency.setValueAtTime(hz(note), t); var m = c.createGain(); m.gain.value = k; o.connect(m); m.connect(g); o.start(t); });
    g.connect(this.output); return {g: g, oscs: list, vel: vel == null ? 1 : vel};
  };
  Synth.prototype.triggerAttackRelease = function (note, dur, t, vel) {
    t = t == null ? C().currentTime : t; var v = this._voice(note, t, vel), stop = shape(v.g.gain, t, t + dur, this.env, v.vel);
    v.oscs.forEach(function (o) { o.stop(stop); }); return this;
  };
  Synth.prototype.triggerAttack = function (note, t, vel) {   // a held voice (used for bird calls with setNote)
    t = t == null ? C().currentTime : t; this.held = this._voice(note, t, vel);
    var e = this.env, p = this.held.g.gain; p.setValueAtTime(0, t); p.linearRampToValueAtTime(this.held.vel, t + e.attack); p.setTargetAtTime(this.held.vel * e.sustain, t + e.attack, e.decay / 3 + .001);
    return this;
  };
  Synth.prototype.setNote = function (note, t) { var h = this.held, porta = this.porta; if (!h) return this; h.oscs.forEach(function (o) { o.frequency.setTargetAtTime(hz(note), t, Math.max(.005, porta / 3)); }); return this; };
  Synth.prototype.triggerRelease = function (t) {
    var h = this.held; if (!h) return this; this.held = null; var r = this.env.release;
    h.g.gain.cancelScheduledValues(t); h.g.gain.setTargetAtTime(0, t, r / 3 + .001); h.oscs.forEach(function (o) { o.stop(t + r + .1); }); return this;
  };

  var FMSynth = inherit(function FMSynth(o) {
    o = o || {}; volNode(this, o.volume); this.h = o.harmonicity == null ? 3 : o.harmonicity; this.mi = o.modulationIndex == null ? 10 : o.modulationIndex;
    this.ct = (o.oscillator && o.oscillator.type) || 'sine'; this.mt = (o.modulation && o.modulation.type) || 'square';
    this.env = env(o.envelope, {attack: .01, decay: .01, sustain: 1, release: .5}); this.menv = env(o.modulationEnvelope, {attack: .5, decay: 0, sustain: 1, release: .5});
  });
  FMSynth.prototype.triggerAttackRelease = function (note, dur, t, vel) {
    var c = C(); t = t == null ? c.currentTime : t; var f = hz(note);
    var car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain(), g = c.createGain();
    car.type = this.ct; mod.type = this.mt; car.frequency.value = f; mod.frequency.value = f * this.h;
    mod.connect(mg); mg.connect(car.frequency); car.connect(g); g.connect(this.output);
    var stop = shape(g.gain, t, t + dur, this.env, vel == null ? 1 : vel);
    shape(mg.gain, t, t + dur, this.menv, this.mi * f * this.h);
    car.start(t); mod.start(t); car.stop(stop); mod.stop(stop); return this;
  };

  var NoiseSynth = inherit(function NoiseSynth(o) { o = o || {}; volNode(this, o.volume); this.type = (o.noise && o.noise.type) || 'white'; this.env = env(o.envelope, {attack: .005, decay: .1, sustain: 0, release: .1}); });
  NoiseSynth.prototype.triggerAttackRelease = function (dur, t, vel) {
    var c = C(); t = t == null ? c.currentTime : t; var s = c.createBufferSource(), g = c.createGain();
    s.buffer = noiseBuffer(this.type); s.connect(g); g.connect(this.output);
    var stop = shape(g.gain, t, t + dur, this.env, vel == null ? 1 : vel); s.start(t, Math.random()); s.stop(stop); return this;
  };

  var MembraneSynth = inherit(function MembraneSynth(o) { o = o || {}; volNode(this, o.volume); this.pd = o.pitchDecay == null ? .05 : o.pitchDecay; this.oct = o.octaves == null ? 10 : o.octaves; this.env = env(o.envelope, {attack: .001, decay: .4, sustain: .01, release: 1.4}); });
  MembraneSynth.prototype.triggerAttackRelease = function (note, dur, t, vel) {
    var c = C(); t = t == null ? c.currentTime : t; var f = hz(note), o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(f * Math.pow(2, this.oct), t); o.frequency.exponentialRampToValueAtTime(f, t + Math.max(.005, this.pd));
    o.connect(g); g.connect(this.output); var stop = shape(g.gain, t, t + dur, this.env, vel == null ? 1 : vel); o.start(t); o.stop(stop); return this;
  };

  // Karplus-Strong in JS: a noise burst circulating in a delay line, averaged (dampening) and scaled (resonance) each pass
  var pluckCache = {};
  var PluckSynth = inherit(function PluckSynth(o) { o = o || {}; volNode(this, o.volume); this.set(o); });
  PluckSynth.prototype.set = function (o) {
    if (o.attackNoise != null) this.attackNoise = o.attackNoise; else if (this.attackNoise == null) this.attackNoise = 1;
    if (o.dampening != null) this.dampening = o.dampening; else if (this.dampening == null) this.dampening = 4000;
    if (o.resonance != null) this.resonance = o.resonance; else if (this.resonance == null) this.resonance = .7;
    return this;
  };
  PluckSynth.prototype.buffer = function (note) {
    var key = [note, this.attackNoise, this.dampening, this.resonance].join('|');
    if (pluckCache[key]) return pluckCache[key];
    var c = C(), sr = c.sampleRate, f = hz(note), N = Math.max(2, Math.round(sr / f)), len = Math.floor(sr * 2.2), b = c.createBuffer(1, len, sr), d = b.getChannelData(0);
    var line = new Float32Array(N), lp = Math.min(.99, Math.exp(-2 * Math.PI * this.dampening / sr)), fb = .985 + .0145 * Math.min(1, this.resonance), prev = 0;
    var burst = Math.min(N, Math.round(N * Math.min(1, .2 + .25 * this.attackNoise)));
    for (var i = 0; i < N; i++) line[i] = i < burst ? Math.random() * 2 - 1 : 0;
    for (var j = 0, p = 0; j < len; j++) {
      var x = line[p], y = (1 - lp) * x + lp * prev; prev = y;
      line[p] = y * fb; d[j] = x * .5; p = (p + 1) % N;
    }
    return (pluckCache[key] = b);
  };
  PluckSynth.prototype.triggerAttackRelease = function (note, dur, t) {
    var c = C(); t = t == null ? c.currentTime : t; var s = c.createBufferSource(), g = c.createGain();
    s.buffer = this.buffer(typeof note === 'number' ? nameOf(midi(note)) : note); s.connect(g); g.connect(this.output);
    g.gain.setValueAtTime(1, t); g.gain.setTargetAtTime(0, t + dur, .12); s.start(t); s.stop(t + dur + .6); return this;
  };

  var PolySynth = inherit(function PolySynth(Voice, o) { o = o || {}; var inner = Object.assign({}, o); delete inner.volume; this.v = new Voice(inner); volNode(this, o.volume); this.v.connect(this.output); });
  PolySynth.prototype.triggerAttackRelease = function (notes, dur, t, vel) { var v = this.v; (Array.isArray(notes) ? notes : [notes]).forEach(function (n) { v.triggerAttackRelease(n, dur, t, vel); }); return this; };

  // Card foley, synthesised: a soft click for placing, a brush of filtered noise for slides, a riffle for the shuffle.
  function foley(name) {
    var c = C(), sr = c.sampleRate, seed = name.length * 7 + (name.charCodeAt(name.length - 1) || 1);
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var kind = /shuffle/.test(name) ? 'shuffle' : /fan|take/.test(name) ? 'fan' : /slide|shove/.test(name) ? 'slide' : 'place';
    var dur = {place: .09, slide: .22, fan: .34, shuffle: .9}[kind], len = Math.floor(sr * dur), b = c.createBuffer(1, len, sr), d = b.getChannelData(0);
    var lp = 0, hp = 0, prev = 0, cut = {place: .35, slide: .22, fan: .18, shuffle: .3}[kind] * (.85 + rnd() * .3);
    var hits = kind === 'shuffle' ? Array.from({length: 14}, function (_, i) { return Math.floor(sr * (.03 + i * .055 + rnd() * .02)); }) : [0];
    for (var i = 0; i < len; i++) {
      var tt = i / sr, w = rnd() * 2 - 1, a = 0;
      hits.forEach(function (h) { if (i >= h) { var u = (i - h) / sr; a += kind === 'place' || kind === 'shuffle' ? Math.exp(-u * 70) : 0; } });
      if (kind === 'slide') a = Math.sin(Math.PI * Math.min(1, tt / dur)) * .7;
      if (kind === 'fan') a = Math.pow(Math.sin(Math.PI * tt / dur), 1.5) * .6;
      lp += cut * (w - lp); hp = lp - prev; prev = lp;
      d[i] = (kind === 'place' ? lp * 1.6 + Math.sin(2 * Math.PI * 140 * tt) * Math.exp(-tt * 60) * .5 : hp * 2.2) * a;
    }
    return b;
  }
  function ToneAudioBuffers(o) { this.cache = {}; this.loaded = true; }
  ToneAudioBuffers.prototype.get = function (name) { return this.cache[name] || (this.cache[name] = foley(name)); };
  var ToneBufferSource = inherit(function ToneBufferSource(o) {
    var c = C(); this.src = c.createBufferSource(); this.src.buffer = o.url; this.src.playbackRate.value = o.playbackRate || 1;
    this.output = c.createGain(); this.src.connect(this.output); this.fade = o.fadeOut || .01; var self = this;
    this.src.onended = function () { if (self.onended) self.onended(); };
  });
  ToneBufferSource.prototype.start = function (t, offset, dur) {
    t = t == null ? C().currentTime : t; this.src.start(t, offset || 0);
    if (dur) { this.output.gain.setValueAtTime(1, t + Math.max(0, dur - this.fade)); this.output.gain.linearRampToValueAtTime(0, t + dur); this.src.stop(t + dur + .02); }
    return this;
  };

  function Frequency(n) { var m = midi(n); return {transpose: function (s) { return Frequency(nameOf(m + s)); }, toNote: function () { return nameOf(m); }, toFrequency: function () { return hz(nameOf(m)); }}; }

  window.Tone = {
    Volume: Volume, Gain: Gain, Reverb: Reverb, Filter: Filter, Vibrato: Vibrato, Tremolo: Tremolo, AutoFilter: AutoFilter, Noise: Noise,
    Synth: Synth, FMSynth: FMSynth, NoiseSynth: NoiseSynth, MembraneSynth: MembraneSynth, PluckSynth: PluckSynth, PolySynth: PolySynth,
    ToneAudioBuffers: ToneAudioBuffers, ToneBufferSource: ToneBufferSource, Frequency: Frequency,
    now: function () { return C().currentTime; },
    start: function () { var c = C(); return c.state === 'running' ? Promise.resolve() : c.resume(); },
    get context() { return C(); },
    Destination: {get mute() { return muted; }, set mute(v) { muted = !!v; M().gain.setValueAtTime(muted ? 0 : 1, C().currentTime); }}
  };
})();
