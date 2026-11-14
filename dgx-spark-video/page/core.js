/* Core runtime: timings helper W(), shot manager, deterministic seek(t, frame), captions, cues. */
(function () {
  const T = window.TIMINGS;            // {lines:{key:{start,end,words:[{w,s,e}]}}, order:[keys], duration}
  const FPS = 30;
  const tl = gsap.timeline({ paused: true });
  window.TL = tl;
  window.CUES = []; window.CUTS = [];
  const SHOTS = [], PROCS = [], FLASHES = [];
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9.,$%]/g, '').replace(/[.,]$/, '');

  // W(lineKey) -> line start; W(lineKey, 'word' | index, nth=0) -> that word's start time
  function W(key, word, nth = 0) {
    const L = T.lines[key];
    if (!L) throw new Error('W: no line ' + key);
    if (word === undefined) return L.start;
    if (typeof word === 'number') return L.words[Math.max(0, Math.min(L.words.length - 1, word))].s;
    const n = norm(word); let k = 0;
    for (const w of L.words) if (norm(w.w) === n || norm(w.w).startsWith(n)) { if (k++ === nth) return w.s; }
    throw new Error(`W: word "${word}" not in ${key}: ` + L.words.map(w => w.w).join(' '));
  }
  W.end = (key, word, nth = 0) => {
    const L = T.lines[key];
    if (word === undefined) return L.end;
    const s = W(key, word, nth); return L.words.find(w => w.s === s).e;
  };
  window.W = W;

  const cue = (t, type, gain = 1) => window.CUES.push({ t: +t.toFixed(3), type, gain });
  const flash = (t, a = .8) => { FLASHES.push({ t, a }); };
  const proc = f => PROCS.push(f);
  window.cue = cue; window.flash = flash; window.proc = proc;

  // shot(t0, {theme, sec, page}, html, build(q, t0, t1, el))
  const stage = document.getElementById('stage');
  function shot(t0, opt, html, build) {
    const el = document.createElement('div');
    el.className = 'shot t-' + (opt.theme || 'black');
    el.innerHTML = `<div class="cam">${opt.grid === false ? '' : '<div class="grid"></div>'}${html}</div>` + chrome(opt);
    stage.appendChild(el);
    SHOTS.push({ t0, el, opt, build, cam: el.querySelector('.cam') });
  }
  window.shot = shot;
  function chrome(o) {
    return `<div class="chrome"><div class="top"><span>LOCAL AI ISSUE Nº02 · <b>§ ${o.sec || ''}</b></span><span>DGX SPARK <b>VS</b> RTX 5090 · SEP 2026</span></div>
      <div class="bot"><span class="tc">00:00:00</span><span>YUV.AI</span><span>P. <b>${String(o.page || 1).padStart(2, '0')}</b> / 08</span></div>
      <div class="tick tl"></div><div class="tick tr"></div><div class="tick bl"></div><div class="tick br"></div></div>`;
  }

  // procedural helpers (deterministic, evaluated every seek)
  window.counter = (el, t0, t1, a, b, fmt = v => Math.round(v).toLocaleString('en-US'), tickCue = false) => {
    proc(t => { const p = Math.max(0, Math.min(1, (t - t0) / (t1 - t0))); const e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(a + (b - a) * e); });
    if (tickCue) for (let x = t0; x < t1; x += 0.09) cue(x, 'tick', .25);
  };
  window.typeText = (el, text, t0, cps = 28, withCue = true) => {
    const html = el.innerHTML; el.innerHTML = '';
    // text may contain simple spans; type by visible characters of plain text
    proc(t => {
      const n = Math.max(0, Math.floor((t - t0) * cps));
      el.textContent = text.slice(0, n);
      el.appendChild(Object.assign(document.createElement('span'), { className: 'caret', style: `opacity:${(Math.floor(t * 2.5) % 2 || n < text.length) ? 1 : 0}` }));
    });
    if (withCue) for (let i = 0; i < text.length; i += 2) if (text[i] !== ' ') cue(t0 + i / cps, 'type', .35);
    return t0 + text.length / cps;
  };
  // streaming text at a fixed tokens/s (approx 1 token ≈ 4 chars) — used for the split-screen race
  window.stream = (el, text, t0, tokps, cntEl) => {
    proc(t => {
      const tok = Math.max(0, (t - t0) * tokps);
      el.textContent = text.slice(0, Math.floor(tok * 4));
      if (cntEl) cntEl.textContent = t < t0 ? '0' : Math.floor(Math.min(tok, text.length / 4)).toString();
    });
  };

  // captions
  const cap = document.getElementById('cap');
  const CHUNKS = [];
  for (const key of T.order) {
    const L = T.lines[key]; let cur = [], len = 0;
    L.words.forEach((w, i) => {
      if (cur.length && (len + w.w.length > 40 || /[.?!:]$/.test(L.words[i - 1].w) && len > 14)) { CHUNKS.push(cur); cur = []; len = 0; }
      cur.push(w); len += w.w.length + 1;
    });
    if (cur.length) CHUNKS.push(cur);
  }
  let lastCap = '';
  function renderCap(t) {
    let chunk = null;
    for (let i = 0; i < CHUNKS.length; i++) {
      const c = CHUNKS[i], nx = CHUNKS[i + 1];
      const end = Math.min(c[c.length - 1].e + 0.35, nx ? nx[0].s : 1e9);
      if (t >= c[0].s - 0.05 && t < end) { chunk = c; break; }
    }
    let html = '';
    if (chunk) html = '<div class="box"><span class="pr">&gt;</span>' + chunk.map(w =>
      `<span class="w ${t >= w.s && t < Math.max(w.e, w.s + .12) ? 'on' : t >= w.s ? 'past' : ''}">${w.w}</span>`).join(' ') + '</div>';
    if (html !== lastCap) { cap.innerHTML = html; lastCap = html; }
  }

  const grains = [...document.querySelectorAll('.grain')], flashEl = document.getElementById('flash');
  const BEATS = window.BEATS || [];
  function tc(t) { const s = Math.floor(t), f = Math.floor((t - s) * FPS); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(f).padStart(2, '0')}`; }

  window.finalize = function (duration) {
    SHOTS.sort((a, b) => a.t0 - b.t0);
    SHOTS.forEach((s, i) => { s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : duration; });
    SHOTS.forEach((s, i) => {
      const q = sel => s.el.querySelector(sel), qa = sel => [...s.el.querySelectorAll(sel)];
      q.all = qa;
      if (s.build) s.build(q, s.t0, s.t1, s.el);
      window.CUTS.push({ t: +s.t0.toFixed(3), i, theme: s.opt.theme || 'black', sec: s.opt.sec });
      if (i > 0 && !s.opt.noCutCue) cue(s.t0, s.opt.cutCue || 'cut', s.opt.cutGain ?? .5);
    });
    window.SHOTS = SHOTS; window.DURATION = duration;
    window.CUES.sort((a, b) => a.t - b.t);
    // uniquify inline SVG ids per shot
    SHOTS.forEach((s, i) => s.el.querySelectorAll('[id]').forEach(n => {
      const old = n.id, nu = old + '_s' + i; n.id = nu;
      s.el.querySelectorAll('*').forEach(m => { for (const at of ['fill', 'stroke', 'clip-path', 'mask', 'href', 'xlink:href', 'filter', 'marker-end']) {
        const v = m.getAttribute(at); if (v && v.includes('#' + old)) m.setAttribute(at, v.split('#' + old + ')').join('#' + nu + ')').replace(new RegExp('^#' + old + '$'), '#' + nu)); } });
    }));
  };

  let active = null;
  window.seek = function (t, frame) {
    tl.seek(Math.min(t, tl.duration()), false);
    let cur = null;
    for (const s of SHOTS) { const on = t >= s.t0 && t < s.t1; s.el.style.visibility = on ? 'visible' : 'hidden'; if (on) cur = s; }
    if (cur) {
      // punch-in on each cut: start 7% in, settle fast, then slow drift
      const dt = t - cur.t0, p = Math.min(1, dt / 0.32), e = 1 - Math.pow(1 - p, 3);
      const drift = cur.opt.drift ?? 0.018;
      cur.cam.style.transform = `scale(${(1 + (cur.opt.punch ?? 0.07) * (1 - e) + drift * dt / Math.max(0.5, cur.t1 - cur.t0)).toFixed(5)})`;
      const tcEl = cur.el.querySelector('.tc'); if (tcEl) tcEl.textContent = tc(t);
    }
    for (const f of PROCS) f(t);
    // beat-synced micro-zoom
    let b = -1; for (const x of BEATS) { if (x <= t) b = x; else break; }
    const bz = b >= 0 ? 0.0065 * Math.exp(-(t - b) * 11) : 0;
    stage.style.transform = `scale(${(1 + bz).toFixed(5)})`;
    let fa = 0; for (const f of FLASHES) if (t >= f.t && t < f.t + .4) fa = Math.max(fa, f.a * Math.exp(-(t - f.t) * 11));
    flashEl.style.opacity = fa.toFixed(3);
    const gi = (frame ?? Math.round(t * FPS)) % 4; grains.forEach((g, i) => g.style.display = i === gi ? 'block' : 'none');
    renderCap(t);
  };
})();
