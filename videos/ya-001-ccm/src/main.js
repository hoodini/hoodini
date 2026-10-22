// YA-001 · CCM — deterministic motion page. window.seek(t, frame) renders any frame.
(async function () {
  const P = new URLSearchParams(location.search);
  const FMT = P.get('fmt') === 'B' ? 'B' : 'A';
  const A = FMT === 'A';
  document.documentElement.classList.add(FMT);
  const W = A ? 1920 : 1080, H = A ? 1080 : 1920;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html, parent) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  };
  const getJSON = async (u, fb) => { try { const r = await fetch(u); return r.ok ? await r.json() : fb; } catch (e) { return fb; } };
  const exists = async (u) => { try { return (await fetch(u, { method: 'HEAD' })).ok; } catch (e) { return false; } };

  await Promise.all([
    '300 40px Assistant', '600 40px Assistant', '800 40px Assistant', '400 40px Anton', '200 40px Oswald', '300 40px Oswald', '600 40px "IBM Plex Mono"',
  ].map((f) => document.fonts.load(f, 'אבג abc 0123')));
  const data = await getJSON('shots.json');
  const stats = await getJSON('gen/stats.json', null);
  const evidence = await getJSON('gen/evidence.json', { lines: ['// evidence.json missing'] });
  const T = YATiming.build(data, FMT);
  const beat = T.beat, BAR = beat * 4;
  const S = T.shots;
  const byKey = Object.fromEntries(S.map((s) => [s.key, s]));
  const thumbs = [];
  for (let i = 0; i < 3; i++) if (await exists(`gen/thumb${i}_${FMT}.png`)) thumbs.push(`gen/thumb${i}_${FMT}.png`);
  const endStill = (await exists(`gen/end_${FMT}.png`)) ? `gen/end_${FMT}.png` : null;

  const stage = $('#stage');
  const tl = gsap.timeline({ paused: true });
  const CUES = [];
  const cue = (t, type, extra) => CUES.push({ t: +t.toFixed(4), type, ...(extra || {}) });
  const updaters = [];
  const onFrame = (fn) => updaters.push(fn);

  // ---------- deterministic helpers ----------
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const fmtInt = (n) => Math.round(n).toLocaleString('en-US');

  // Which shot is on screen at time t, and how far through the following transition we are.
  function phaseAt(t) {
    for (let i = 0; i < S.length; i++) {
      const s = S[i];
      if (t < s.end) return { i, trans: false, p: 0 };
      const n = S[i + 1];
      if (n && t < n.start) return { i, trans: true, p: (t - s.end) / (n.start - s.end) };
    }
    return { i: S.length - 1, trans: false, p: 0 };
  }

  // ---------- icons (48 grid, 2.5 stroke, round caps, exactly one gold detail) ----------
  const ICON = {
    phone: '<rect class="st" x="14" y="4" width="20" height="40" rx="4"/><line class="st" x1="21" y1="8.5" x2="27" y2="8.5"/><line class="st" x1="21" y1="39.5" x2="27" y2="39.5"/><rect class="gold" x="17.5" y="13" width="13" height="22" rx="1.5"/>',
    tower: '<path class="st" d="M19.5 44 L22 23 H26 L28.5 44"/><line class="st" x1="13" y1="44" x2="35" y2="44"/><path class="st" d="M13 15 H35 L31.5 23 H16.5 Z"/><path class="st" d="M17 15 L24 10 L31 15"/><line class="st" x1="24" y1="10" x2="24" y2="6"/><circle class="gold" cx="24" cy="4" r="2.2"/>',
    fan: '<circle class="st" cx="24" cy="24" r="19"/><path class="st" d="M24 21 C 22 13, 27 7, 31 9 C 34 11, 31 17, 26.5 22"/><path class="st" d="M26.6 25.5 C 33 28, 34 35, 30.5 37.5 C 27.5 39.5, 24 34, 23.5 27"/><path class="st" d="M21.2 25 C 15 29.5, 9 27, 9.5 23 C 10 19.5, 16.5 19.5, 21 22.5"/><circle class="gold" cx="24" cy="24" r="3"/>',
    repo: '<path class="st" d="M6 13 a2 2 0 0 1 2 -2 H19 L23 15 H40 a2 2 0 0 1 2 2 V37 a2 2 0 0 1 -2 2 H8 a2 2 0 0 1 -2 -2 Z"/><circle class="st" cx="17" cy="22" r="2.6"/><circle class="st" cx="17" cy="33" r="2.6"/><line class="st" x1="17" y1="24.6" x2="17" y2="30.4"/><path class="st" d="M17 30.5 C 17 26, 31 28.5, 31 24.6"/><circle class="gold" cx="31" cy="22" r="2.6"/>',
    cloudsrv: '<path class="st" d="M13 37 H35 A9 9 0 0 0 36.5 19.2 A12 12 0 0 0 13.5 17.6 A9.7 9.7 0 0 0 13 37 Z"/><rect class="st" x="17" y="21.5" width="14" height="5.5" rx="1.2"/><rect class="st" x="17" y="28.5" width="14" height="5.5" rx="1.2"/><circle class="gold" cx="27.8" cy="24.25" r="1.4"/>',
    lock: '<rect class="st" x="12" y="22" width="24" height="20" rx="3"/><path class="st" d="M17 22 V16 a7 7 0 0 1 14 0 V22"/><circle class="gold" cx="24" cy="31" r="2.6"/>',
  };
  function icon(name, size, parent, x, y) {
    const s = el('div', 'abs', `<svg class="icon" viewBox="0 0 48 48" width="${size}" height="${size}">${ICON[name]}</svg>`, parent);
    if (x != null) { s.style.left = x + 'px'; s.style.top = y + 'px'; }
    s.querySelectorAll('.st').forEach((p) => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1 1'; p.style.strokeDashoffset = '1'; });
    return s;
  }
  function drawIcon(wrap, t, dur = 0.9) {
    const st = wrap.querySelectorAll('.st');
    const gold = wrap.querySelectorAll('.gold');
    gsap.set(gold, { scale: 0, transformOrigin: '50% 50%' });
    tl.to(st, { strokeDashoffset: 0, duration: dur * 0.7, stagger: (dur * 0.3) / Math.max(1, st.length - 1), ease: 'power1.inOut' }, t);
    cue(t, 'pen', { dur });
    tl.to(gold, { scale: 1, duration: 0.35, ease: 'back.out(2.2)' }, t + dur);
    cue(t + dur, 'pop');
  }
  const ARROW = '<svg class="arrow" viewBox="0 0 22 14"><path d="M21 7 H2 M8 1 L2 7 L8 13"/></svg>';

  // ---------- procedural clouds ----------
  function cloudSprite(w, h, seed, puffs = 70, alpha = 0.9) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); const r = rng(seed);
    for (let i = 0; i < puffs; i++) {
      const u = r(), v = r();
      const x = w * (0.12 + 0.76 * u);
      const top = 1 - Math.pow(Math.sin(Math.PI * u), 0.8) * 0.75;
      const y = h * (0.35 + top * 0.4 + v * 0.25);
      const rad = h * (0.12 + r() * 0.22) * (0.6 + 0.6 * Math.sin(Math.PI * u));
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, `rgba(255,255,255,${alpha})`);
      gr.addColorStop(0.55, `rgba(255,255,255,${alpha * 0.55})`);
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
    }
    return c.toDataURL('image/png');
  }
  const R = rng(7);
  const cloudField = [];
  const CF = $('#clouds');
  for (let i = 0; i < 16; i++) {
    const depth = i % 3; // 0 far, 2 near
    const w = (A ? 700 : 620) * (0.7 + depth * 0.45), h = w * 0.42;
    const img = el('img', '', null, CF); img.src = cloudSprite(Math.round(w), Math.round(h), 100 + i);
    cloudField.push({ img, w, h, x: R() * (W + w) - w * 0.5, y: R() * (H + 900), speed: 0.05 + depth * 0.06, drift: (R() - 0.5) * 6, depth });
  }
  // sea of clouds for the sunrise end card
  const SEA = $('#sea');
  const seaY = A ? 800 : 1500;
  for (let i = 0; i < 7; i++) {
    const w = A ? 760 : 620, h = w * 0.45;
    const img = el('img', '', null, SEA); img.src = cloudSprite(w, Math.round(h), 300 + i, 90, 1);
    img.style.left = (i / 6) * (W + 200) - 200 - w * 0.25 + 'px'; img.style.top = seaY - h * 0.25 + (i % 2) * 40 + 'px';
  }
  SEA.style.opacity = 0;
  // transition cloud (push-in)
  const TR = $('#trans');
  const trClouds = el('div', 'layer', null, TR);
  for (let i = 0; i < 6; i++) {
    const w = W * 0.9, h = w * 0.55;
    const img = el('img', '', null, trClouds); img.src = cloudSprite(Math.round(w), Math.round(h), 500 + i, 110, 1);
    img.style.left = (i % 3) * (W * 0.35) - W * 0.2 + 'px'; img.style.top = Math.floor(i / 3) * (H * 0.5) - h * 0.25 + 'px';
  }
  TR.appendChild($('#flash'));
  gsap.set(trClouds, { opacity: 0, transformOrigin: '50% 50%' });

  // stars, earth limb, contrail
  (function () {
    const c = $('#stars'); c.width = W; c.height = H; const g = c.getContext('2d'); const r = rng(42);
    for (let i = 0; i < (A ? 420 : 520); i++) {
      const x = r() * W, y = r() * H * 0.9, s = r() < 0.08 ? 2.2 : r() * 1.4 + 0.4;
      g.fillStyle = r() < 0.15 ? 'rgba(142,195,242,.95)' : `rgba(255,255,255,${0.35 + r() * 0.6})`;
      g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill();
    }
    const e = $('#earth'); e.width = W; e.height = H; const k = e.getContext('2d');
    const Rr = W * 2.4, cx = W / 2, cy = H + Rr - (A ? 120 : 130);
    const atm = k.createRadialGradient(cx, cy, Rr - 10, cx, cy, Rr + 120);
    atm.addColorStop(0, 'rgba(25,184,201,.75)'); atm.addColorStop(0.25, 'rgba(142,195,242,.45)'); atm.addColorStop(1, 'rgba(142,195,242,0)');
    k.fillStyle = atm; k.beginPath(); k.arc(cx, cy, Rr + 120, 0, Math.PI * 2); k.fill();
    const body = k.createLinearGradient(0, cy - Rr, 0, H);
    body.addColorStop(0, '#2F6FD6'); body.addColorStop(0.5, '#0B2A5B');
    k.fillStyle = body; k.beginPath(); k.arc(cx, cy, Rr, 0, Math.PI * 2); k.fill();
    k.strokeStyle = '#FFC53D'; k.lineWidth = 3; k.beginPath(); k.arc(cx, cy, Rr, Math.PI * 1.2, Math.PI * 1.8); k.stroke();
    const ct = $('#contrail'); ct.width = W; ct.height = H;
  })();
  ['#stars', '#earth', '#contrail'].forEach((s) => { const c = $(s); c.style.left = 0; c.style.top = 0; c.style.opacity = 0; });
  const horizon = $('#horizon'); horizon.style.top = seaY + 10 + 'px'; horizon.style.opacity = 0;

  // ---------- sky layers by altitude ----------
  const LAYERS = ['fog', 'tops', 'low', 'deep', 'strat', 'sunrise'];
  const DARK = { deep: 1, strat: 1, sunrise: 1 };
  const layerVis = {
    fog: { clouds: 1, stars: 0, earth: 0, contrail: 0, sea: 0, horizon: 0 },
    tops: { clouds: 0.85, stars: 0, earth: 0, contrail: 0, sea: 0, horizon: 0 },
    low: { clouds: 0.55, stars: 0, earth: 0, contrail: 0, sea: 0, horizon: 0 },
    deep: { clouds: 0.18, stars: 0.35, earth: 0, contrail: 1, sea: 0, horizon: 0 },
    strat: { clouds: 0, stars: 1, earth: 1, contrail: 0, sea: 0, horizon: 0 },
    sunrise: { clouds: 0, stars: 0, earth: 0, contrail: 0, sea: 1, horizon: 1 },
  };
  const skyEl = Object.fromEntries(LAYERS.map((l) => [l, $('#sky-' + l)]));
  const fieldState = { clouds: 1 };
  function applyLayer(layer, t, dur) {
    LAYERS.forEach((l) => tl.to(skyEl[l], { opacity: l === layer ? 1 : 0, duration: dur, ease: 'none' }, t));
    const v = layerVis[layer];
    tl.to(fieldState, { clouds: v.clouds, duration: dur, ease: 'none' }, t);
    tl.to('#stars', { opacity: v.stars, duration: dur, ease: 'none' }, t);
    tl.to('#earth', { opacity: v.earth, duration: dur, ease: 'none' }, t);
    tl.to('#contrail', { opacity: v.contrail, duration: dur, ease: 'none' }, t);
    tl.to('#sea', { opacity: v.sea, duration: dur, ease: 'none' }, t);
    tl.to('#horizon', { opacity: v.horizon, duration: dur, ease: 'none' }, t);
    tl.to('#chrome', { color: DARK[layer] ? '#FFFFFF' : '#0B2A5B', duration: dur, ease: 'none' }, t);
  }
  (function (layer) {
    const v = layerVis[layer];
    LAYERS.forEach((l) => gsap.set(skyEl[l], { opacity: l === layer ? 1 : 0 }));
    fieldState.clouds = v.clouds;
    gsap.set('#stars', { opacity: v.stars }); gsap.set('#earth', { opacity: v.earth }); gsap.set('#contrail', { opacity: v.contrail });
    gsap.set('#sea', { opacity: v.sea }); gsap.set('#horizon', { opacity: v.horizon });
  })(S[0].layer);

  // altitude curve: holds at each shot's ALT, climbs during the transition into the next shot
  function altAt(t) {
    const ph = phaseAt(t);
    const a0 = S[ph.i].alt;
    if (!ph.trans) {
      if (ph.i === 0) return a0 + (S[1].alt - a0) * 0.12 * smooth(t / S[0].end);
      return a0;
    }
    const a1 = S[ph.i + 1].alt;
    return a0 + (a1 - a0) * smooth(ph.p);
  }

  // ---------- chrome ----------
  const CH = $('#chrome');
  const ruleTop = el('div', 'rule', null, CH), ruleBot = el('div', 'rule', null, CH);
  const cBoard = el('div', 'ct', null, CH), cWpt = el('div', 'ct mono', null, CH), cAlt = el('div', 'ct mono', null, CH);
  const cTime = el('div', 'ct mono', null, CH), cMark = el('div', 'ct wordmark', '<span class="yuv">YUV</span><span class="ai">.AI</span>', CH);
  cMark.style.direction = 'ltr';
  cBoard.innerHTML = `<span style="font-weight:800">מ- ערפל</span> ${ARROW} <span style="font-weight:300">אל ברור</span> · <span class="mono">${esc(data.flightCode)}</span>`;
  if (A) {
    Object.assign(ruleTop.style, { left: '80px', right: '80px', top: '80px' });
    Object.assign(ruleBot.style, { left: '80px', right: '80px', top: '1000px' });
    Object.assign(cBoard.style, { right: '80px', top: '36px' });
    Object.assign(cWpt.style, { left: '50%', top: '38px', transform: 'translateX(-50%)' });
    Object.assign(cAlt.style, { left: '80px', top: '38px' });
    Object.assign(cTime.style, { right: '80px', top: '1016px' });
    Object.assign(cMark.style, { left: '80px', top: '1012px', fontSize: '26px' });
  } else {
    cBoard.style.display = 'none';
    Object.assign(ruleTop.style, { left: '100px', right: '120px', top: '292px' });
    Object.assign(ruleBot.style, { left: '100px', right: '120px', top: '1462px' });
    Object.assign(cWpt.style, { right: '120px', top: '226px' });
    Object.assign(cAlt.style, { left: '100px', top: '226px' });
    Object.assign(cTime.style, { right: '120px', top: '1470px' });
    Object.assign(cMark.style, { left: '100px', top: '1466px', fontSize: '44px' });
  }
  gsap.set([ruleTop, ruleBot], { scaleX: 0, transformOrigin: '100% 50%' });
  gsap.set([cBoard, cWpt, cAlt, cTime, cMark], { opacity: 0 });
  tl.to([ruleTop, ruleBot], { scaleX: 1, duration: 0.9, ease: 'power2.out' }, 0.5);
  tl.to([cBoard, cWpt, cAlt, cTime, cMark], { opacity: 1, duration: 0.6, stagger: 0.08 }, 0.9);
  cue(0.5, 'pen', { dur: 0.9 });
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  onFrame((t, f) => {
    let cur = 0;
    S.forEach((s) => { if (t >= s.start - 0.5 * beat) cur = s.wptCurrent; });
    cWpt.textContent = `WPT ${cur}/${T.wptTotal}`;
    cAlt.textContent = `ALT ${fmtInt(Math.round(altAt(t) / 10) * 10)} FT`;
    const fr = f % T.fps, sec = Math.floor(f / T.fps);
    cTime.textContent = `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}:${pad(fr)}`;
  });

  // ---------- headline cards ----------
  function tokens(line) {
    const out = [];
    for (const tk of line.split(' ').filter(Boolean)) {
      const latin = /^[A-Za-z0-9][A-Za-z0-9.\/\-]*$/.test(tk);
      const prev = out[out.length - 1];
      if (latin && prev && prev.latin) { prev.text += ' ' + tk; continue; }
      out.push({ text: tk, latin });
    }
    return out;
  }
  const bidi = (s) => esc(s).replace(/[A-Za-z0-9][A-Za-z0-9.\/\- ]*[A-Za-z0-9]|[A-Za-z0-9]/g, (m) => `<bdi dir="ltr">${m}</bdi>`).replace('←', ARROW);
  function lineHTML(line, mark) {
    const tk = tokens(line);
    const units = tk.map((x) => `<span class="w"><span class="wi" dir="rtl">${bidi(x.text)}</span></span>`);
    if (mark) {
      const mt = tokens(mark).map((x) => x.text);
      for (let i = 0; i + mt.length <= tk.length; i++) {
        if (mt.every((m, j) => tk[i + j].text.replace(/[.,?:]$/, '') === m)) {
          const inner = units.slice(i, i + mt.length).join(' ');
          units.splice(i, mt.length, `<span class="mark"><span class="mbg"></span>${inner}</span>`);
          break;
        }
      }
    }
    return units.join(' ');
  }
  function hlCard(s, parent, opts = {}) {
    const c = el('div', 'card hl', null, parent);
    const l1 = el('div', 'l1', lineHTML(s.l1, opts.mark !== false ? s.mark : null), c);
    let l2 = null;
    if (s.l2) l2 = el('div', 'l2', lineHTML(s.l2, null), c);
    return c;
  }
  function enterHeadline(card, t) {
    gsap.set(card, { y: 50, opacity: 0 });
    tl.to(card, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, t);
    const w1 = card.querySelectorAll('.l1 .wi'), w2 = card.querySelectorAll('.l2 .wi');
    gsap.set([...w1, ...w2], { yPercent: 115 });
    tl.to(w1, { yPercent: 0, duration: 0.55, ease: 'power2.out', stagger: 0.07 }, t + 0.15);
    const t2 = t + 0.15 + 0.07 * w1.length + 0.2;
    tl.to(w2, { yPercent: 0, duration: 0.55, ease: 'power2.out', stagger: 0.06 }, t2);
    const mb = card.querySelector('.mbg');
    const landed = t + 0.15 + 0.07 * (w1.length - 1) + 0.55;
    if (mb) { gsap.set(mb, { scaleX: 0 }); tl.to(mb, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, landed + 0.1); cue(landed + 0.1, 'swipe'); }
    return t2 + 0.06 * w2.length + 0.55;
  }

  // ---------- floats & shakes (pure functions of t) ----------
  const floats = [];
  function floatify(node, amp = 6, period = 4, phase = 0) { floats.push({ node, amp, period, phase }); }
  const shakes = [];
  onFrame((t) => {
    floats.forEach((f) => { f.node.style.translate = `0 ${(Math.sin((t / f.period) * Math.PI * 2 + f.phase) * f.amp).toFixed(2)}px`; });
    shakes.forEach((s) => {
      const on = t >= s.t0 && t <= s.t1 ? 1 : 0;
      const k = on * s.amp;
      s.node.style.translate = `${(Math.sin(t * 41 + s.ph) * k).toFixed(2)}px ${(Math.sin(t * 53 + s.ph * 2) * k).toFixed(2)}px`;
    });
  });

  // ---------- typing, counters, flips ----------
  const typers = [];
  function typer(node, lines, t0, t1) {
    const total = lines.join('\n').length;
    typers.push({ node, lines, t0, t1, total });
    for (let c = 0; c < total; c += 3) cue(t0 + ((t1 - t0) * c) / total, 'tick');
  }
  onFrame((t) => {
    typers.forEach((ty) => {
      const n = Math.floor(clamp((t - ty.t0) / (ty.t1 - ty.t0), 0, 1) * ty.total);
      const txt = ty.lines.join('\n').slice(0, n);
      const blink = t > ty.t1 ? (Math.floor((t - ty.t1) / (beat / 2)) % 2 === 0) : true;
      ty.node.innerHTML = esc(txt) + (t >= ty.t0 - 0.3 && blink ? '<span class="caret"></span>' : '');
    });
  });
  const counters = [];
  onFrame((t) => counters.forEach((c) => {
    const p = easeOutCubic((t - c.t0) / (c.t1 - c.t0));
    c.node.textContent = c.fmt(c.to * p);
  }));
  const flips = [];
  onFrame((t, f) => flips.forEach((fl) => {
    const r = rng(f * 13 + 5);
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789-';
    let out = '';
    for (let i = 0; i < fl.text.length; i++) {
      const lock = fl.t0 + (fl.dur * (i + 1)) / fl.text.length;
      out += t >= lock || fl.text[i] === '-' ? fl.text[i] : (t < fl.t0 ? ' ' : chars[Math.floor(r() * 36)]);
    }
    fl.node.textContent = out;
  }));

  // ---------- route band (persistent waypoints) ----------
  const ROUTE = $('#route');
  const wptShots = S.filter((s) => s.wpt);
  const band = A ? { x0: 1760, y0: 965, x1: 200, y1: 885 } : { x0: 960, y0: 1440, x1: 100, y1: 1385 };
  const routeSvg = el('div', 'layer', `<svg width="${W}" height="${H}" style="position:absolute;inset:0;overflow:visible">
    <path id="rpath" d="M${band.x0} ${band.y0} C ${band.x0 - (band.x0 - band.x1) * 0.35} ${band.y0}, ${band.x1 + (band.x0 - band.x1) * 0.35} ${band.y1}, ${band.x1} ${band.y1}"
      fill="none" stroke="currentColor" stroke-width="${A ? 2.5 : 3.5}" stroke-dasharray="${A ? '10 12' : '14 14'}" stroke-linecap="round"/>
    <g id="rpins"></g>
    <g id="rplane"><path d="M-22 0 L-6 -2 L4 -14 H8 L3 -2 L14 -3 L18 -8 H21 L19 0 L21 8 H18 L14 3 L3 2 L8 14 H4 L-6 2 Z" fill="currentColor" transform="scale(${A ? 1.1 : 1.5}) scale(-1,1)"/></g>
  </svg>`, ROUTE);
  ROUTE.style.color = '#0B2A5B';
  const rpath = routeSvg.querySelector('#rpath');
  const rlen = rpath.getTotalLength();
  const pinFrac = wptShots.map((_, i) => 0.06 + (0.88 * i) / Math.max(1, wptShots.length - 1));
  const pins = [];
  wptShots.forEach((s, i) => {
    const pt = rpath.getPointAtLength(rlen * pinFrac[i]);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const sc = A ? 0.75 : 1;
    g.innerHTML = `<g transform="translate(${pt.x} ${pt.y - 4}) scale(${sc})"><path d="M0 0 C -2 -6, -14 -18, -14 -28 a14 14 0 0 1 28 0 C 14 -18, 2 -6, 0 0 Z" fill="#FFFFFF" stroke="currentColor" stroke-width="3"/><circle cx="0" cy="-28" r="5.5" fill="currentColor"/></g>`;
    routeSvg.querySelector('#rpins').appendChild(g);
    gsap.set(g, { opacity: 0, y: -40 });
    const e = s.start - 0.5 * beat + 0.25;
    tl.to(g, { opacity: 1, y: 0, duration: 0.45, ease: 'bounce.out' }, e);
    cue(e + 0.2, 'pop');
    if (i > 0) tl.to(pins[i - 1], { opacity: 0.5, duration: 0.3 }, e);
    pins.push(g);
  });
  const rplane = routeSvg.querySelector('#rplane');
  const firstW = wptShots[0], lastRouteShot = A ? byKey.proof : byKey.result;
  gsap.set(ROUTE, { opacity: 0 });
  tl.to(ROUTE, { opacity: 1, duration: 0.5 }, firstW.start - 0.5 * beat);
  tl.to(ROUTE, { opacity: 0, duration: 0.3 }, lastRouteShot.end);
  // dark layers: the route switches to white
  S.forEach((s, i) => { if (i > 0) tl.to(ROUTE, { color: DARK[s.layer] ? '#FFFFFF' : '#0B2A5B', duration: 0.3 * beat }, s.start - 0.65 * beat); });
  onFrame((t) => {
    let frac = pinFrac[0] - 0.06;
    wptShots.forEach((s, i) => {
      const e = s.start - 0.5 * beat;
      const from = i === 0 ? 0 : pinFrac[i - 1];
      if (t >= e) frac = from + (pinFrac[i] - from) * smooth((t - e) / 0.9);
    });
    const p = rpath.getPointAtLength(rlen * frac);
    const p2 = rpath.getPointAtLength(Math.min(rlen, rlen * frac + 2));
    const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI + 180;
    rplane.setAttribute('transform', `translate(${p.x} ${p.y - (A ? 26 : 34)}) rotate(${ang.toFixed(2)})`);
  });

  // ---------- phone ↔ control tower link (16:9 only) ----------
  if (A) {
    const L = $('#link');
    const line = el('div', 'abs', `<svg width="40" height="800"><line x1="20" y1="0" x2="20" y2="760" stroke="currentColor" stroke-width="2.5" stroke-dasharray="6 10" stroke-linecap="round"/><circle id="pulse" cx="20" cy="760" r="6" fill="#19B8C9"/></svg>`, L);
    Object.assign(line.style, { left: '80px', top: '160px' });
    const tw = icon('tower', 48, L, 76, 102), ph = icon('phone', 48, L, 76, 930);
    L.style.color = '#0B2A5B';
    gsap.set(L, { opacity: 0 });
    const t3 = byKey.promise.start;
    tl.to(L, { opacity: 1, duration: 0.6 }, t3 + 0.6);
    drawIcon(tw, t3 + 0.6, 0.6); drawIcon(ph, t3 + 0.6, 0.6);
    tl.to(L, { opacity: 0, duration: 0.3 }, byKey.reveal.end);
    S.forEach((s, i) => { if (i > 0) tl.to(L, { color: DARK[s.layer] ? '#FFFFFF' : '#0B2A5B', duration: 0.3 * beat }, s.start - 0.65 * beat); });
    const pulse = line.querySelector('#pulse');
    onFrame((t) => {
      const k = ((t - t3) / BAR) % 1;
      pulse.setAttribute('cy', (760 - 760 * smooth(k)).toFixed(1));
      pulse.setAttribute('opacity', (Math.sin(Math.PI * k)).toFixed(3));
    });
    // shot 13: the phone screen dims to a lock, the tower keeps pulsing
    if (byKey.notam3) {
      const g = ph.querySelector('.gold');
      tl.to(g, { opacity: 0.25, duration: 0.4 }, byKey.notam3.start);
    }
  }

  // ---------- shots ----------
  const SH = $('#shots');
  const NOT = $('#notams');
  const notamTags = [];
  const card = (parent, x, y, w, h) => { const c = el('div', 'card', null, parent); Object.assign(c.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); return c; };
  const chip = (parent, html, x, y) => { const c = el('div', 'chip mono', html, parent); c.style.position = 'absolute'; if (x != null) { c.style.left = x + 'px'; c.style.top = y + 'px'; } return c; };
  const rise = (node, t, d = 0.6, y = 70) => { gsap.set(node, { y, opacity: 0 }); tl.to(node, { y: 0, opacity: 1, duration: d, ease: 'power2.out' }, t); };

  S.forEach((s, i) => {
    const shot = el('div', 'layer shot', null, SH);
    shot.dataset.key = s.key;
    gsap.set(shot, { autoAlpha: 0, transformOrigin: '50% 50%' });
    const e = i === 0 ? 0.1 : s.start - 0.5 * beat; // entrance begins mid-transition, under the cloud
    tl.set(shot, { autoAlpha: 1 }, e);
    const keepNotams = s.notam && S[i + 1] && S[i + 1].notam;
    if (i < S.length - 1) {
      tl.to(shot, { y: -60, scale: 1.05, autoAlpha: 0, duration: 0.5 * beat, ease: 'power2.in' }, s.end);
      if (s.notam && !keepNotams) tl.to(NOT, { y: -60, autoAlpha: 0, duration: 0.5 * beat, ease: 'power2.in' }, s.end);
    }
    const vis = el('div', 'vis', null, shot);
    const fl = el('div', 'float', null, vis);
    floatify(fl, A ? 6 : 7, 4.2, i);
    const VW = A ? 760 : 860, VH = A ? 660 : 540;

    switch (s.key) {
      case 'open': {
        vis.remove();
        const ph = el('img', 'abs', null, shot); ph.src = 'phoenix.png';
        const pw = A ? 400 : 520;
        Object.assign(ph.style, { width: pw + 'px', left: (W - pw) / 2 + 'px', top: (A ? 150 : 380) + 'px' });
        gsap.set(ph, { opacity: 0, y: 80, filter: 'blur(14px)' });
        tl.to(ph, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' }, 0.15);
        cue(0.15, 'swell', { dur: 2.0 });
        const strip = el('div', 'card', null, shot);
        const fs = A ? 58 : 66;
        strip.innerHTML = `<div class="w" style="display:block"><div class="wi" style="display:block;text-align:center;font-size:${fs}px;line-height:1.25">
          <span style="font-weight:800">מ- ערפל</span> ${ARROW} <span style="font-weight:300;color:#2F6FD6">אל ברור</span>
          ${A ? '<span style="color:#4A6285"> · </span>' : '<br>'}<span class="mono" style="font-size:${A ? 40 : 48}px;color:#4A6285">${esc(data.flightCode)}</span></div></div>`;
        Object.assign(strip.style, A ? { left: '50%', top: '640px', transform: 'translateX(-50%)', padding: '26px 56px', whiteSpace: 'nowrap', borderRadius: '999px 999px 999px 6px' }
          : { left: '100px', right: '120px', top: '1010px', padding: '30px 40px' });
        const wi = strip.querySelector('.wi');
        gsap.set(strip, { opacity: 0 }); gsap.set(wi, { yPercent: 110 });
        tl.to(strip, { opacity: 1, duration: 0.4 }, 1.35);
        tl.to(wi, { yPercent: 0, duration: 0.7, ease: 'power2.out' }, 1.4);
        cue(1.4, 'whoosh', { soft: 1 });
        break;
      }
      case 'pain': {
        const c = card(fl, 0, A ? 150 : 90, VW - 40, A ? 420 : 400);
        const inner = el('div', 'layer', null, c); inner.style.margin = '34px'; inner.style.inset = '34px';
        const cols = ['#8EC3F2', '#19B8C9', '#FFE8EF', '#8EC3F2'];
        const r = rng(11 + i);
        for (let k = 0; k < 4; k++) {
          const row = el('div', 'abs', null, inner);
          Object.assign(row.style, { left: 0, right: 0, top: 70 + k * (A ? 72 : 66) + 'px', height: (A ? 52 : 48) + 'px', borderBottom: '1.5px solid rgba(74,98,133,.3)' });
          let x = 0;
          while (x < 92) {
            const w = 10 + r() * 26; const b = el('div', 'abs', null, row);
            Object.assign(b.style, { left: x + '%', width: Math.min(w, 96 - x) + '%', top: '6px', height: (A ? 38 : 34) + 'px', background: cols[(k + Math.floor(x)) % 4], border: '2px solid #0B2A5B', borderRadius: '8px' });
            x += w + 2;
          }
        }
        for (let k = 0; k < 24; k++) { const tk = el('div', 'abs', null, inner); Object.assign(tk.style, { left: (k / 24) * 100 + '%', top: '20px', width: '2px', height: k % 4 ? '14px' : '26px', background: '#4A6285' }); }
        const head = el('div', 'abs', null, inner); Object.assign(head.style, { left: '38%', top: '10px', bottom: '-6px', width: '4px', background: '#A8264F', borderRadius: '2px' });
        const fan = icon('fan', A ? 190 : 170, fl, VW - (A ? 230 : 200), A ? 30 : -10);
        rise(c, e + 0.15);
        drawIcon(fan, e + 0.45, 0.8);
        shakes.push({ node: c, t0: e + 0.6, t1: s.end, amp: 2, ph: 1 }, { node: fan, t0: e + 0.6, t1: s.end, amp: 3, ph: 2 });
        cue(e + 0.7, 'rumble', { dur: s.end - e - 0.7 });
        const hc = hlCard(s, shot); enterHeadline(hc, e + 0.05);
        break;
      }
      case 'promise': {
        const phIc = icon('phone', A ? 190 : 170, fl, A ? 40 : 30, A ? 420 : 330);
        const twIc = icon('tower', A ? 230 : 200, fl, A ? 470 : 600, A ? 20 : 0);
        const p0 = A ? { x: 135, y: 420 } : { x: 115, y: 330 }, p1 = A ? { x: 585, y: 250 } : { x: 700, y: 205 };
        const d = `M${p0.x} ${p0.y} C ${p0.x} ${p0.y - 220}, ${p1.x - 260} ${p1.y + 60}, ${p1.x} ${p1.y}`;
        const sv = el('div', 'layer', `<svg width="${VW}" height="${VH}" style="overflow:visible"><defs><mask id="pm${i}"><path d="${d}" stroke="#fff" stroke-width="16" fill="none" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" class="pmask"/></mask></defs>
          <path d="${d}" stroke="#0B2A5B" stroke-width="3" fill="none" stroke-dasharray="10 12" stroke-linecap="round" mask="url(#pm${i})"/>
          <path class="pp" d="${d}" fill="none" stroke="none"/>
          <g class="pl"><path d="M-22 0 L-6 -2 L4 -14 H8 L3 -2 L14 -3 L18 -8 H21 L19 0 L21 8 H18 L14 3 L3 2 L8 14 H4 L-6 2 Z" fill="#0B2A5B" transform="scale(1.4)"/></g></svg>`, fl);
        drawIcon(phIc, e + 0.25, 0.7);
        drawIcon(twIc, e + 0.55, 0.8);
        const pm = sv.querySelector('.pmask');
        tl.to(pm, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, e + 1.0);
        cue(e + 1.0, 'swell', { dur: 1.4 });
        const pp = sv.querySelector('.pp'), pl = sv.querySelector('.pl'); const plen = pp.getTotalLength();
        gsap.set(pl, { opacity: 0 });
        tl.to(pl, { opacity: 1, duration: 0.2 }, e + 1.0);
        onFrame((t) => {
          const k = smooth((t - (e + 1.0)) / 1.3);
          const a = pp.getPointAtLength(plen * k), b = pp.getPointAtLength(Math.min(plen, plen * k + 2));
          pl.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(2)})`);
        });
        const hc = hlCard(s, shot); enterHeadline(hc, e + 0.05);
        break;
      }
      case 'app': case 'repo': case 'env': case 'repoenv': {
        const ch = { app: 'claude.ai/code', repo: 'GitHub App', env: 'network access · setup script', repoenv: 'network access · setup script' }[s.key];
        const ic = { app: ['phone'], repo: ['repo'], env: ['cloudsrv'], repoenv: ['repo', 'cloudsrv'] }[s.key];
        const cw = A ? 600 : 860, chh = A ? 520 : 500;
        const c = card(fl, A ? 80 : 0, A ? 60 : 20, cw, chh);
        const sz = ic.length > 1 ? (A ? 220 : 240) : (A ? 280 : 300);
        ic.forEach((n, k) => {
          const x = ic.length > 1 ? cw / 2 + (k === 0 ? 20 : -sz - 20) : (cw - sz) / 2;
          const w = icon(n, sz, c, x, A ? 50 : 40);
          drawIcon(w, e + 0.35 + k * 0.25, 0.9);
        });
        const cp = chip(c, esc(ch)); Object.assign(cp.style, { left: '50%', bottom: (A ? 50 : 44) + 'px', transform: 'translateX(-50%)' });
        rise(c, e + 0.1);
        gsap.set(cp, { scale: 0.6, opacity: 0 }); tl.to(cp, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' }, e + 1.35); cue(e + 1.35, 'pop');
        const hc = hlCard(s, shot); enterHeadline(hc, e + 0.05);
        break;
      }
      case 'model': {
        const cw = A ? 660 : 860, chh = A ? 360 : 420;
        const c = card(fl, A ? 50 : 0, A ? 140 : 40, cw, chh);
        const lab = el('div', 'abs mono', 'MODEL', c); Object.assign(lab.style, { left: '48px', top: '44px', fontSize: (A ? 28 : 44) + 'px', color: '#4A6285' });
        const val = el('div', 'abs mono', '', c); Object.assign(val.style, { left: '48px', top: (A ? 130 : 150) + 'px', fontSize: (A ? 62 : 64) + 'px', color: '#0B2A5B' });
        for (let k = 0; k < 21; k++) { const tk = el('div', 'abs', null, c); Object.assign(tk.style, { left: 48 + k * ((cw - 96) / 20) + 'px', bottom: '50px', width: '2.5px', height: (k % 5 ? 18 : 34) + 'px', background: '#0B2A5B' }); }
        const needle = el('div', 'abs', null, c); Object.assign(needle.style, { left: '48px', bottom: '44px', width: '6px', height: '52px', background: '#2F6FD6', borderRadius: '3px' });
        tl.fromTo(needle, { x: 0 }, { x: cw - 102, duration: 1.2, ease: 'power3.out' }, e + 0.5);
        rise(c, e + 0.1);
        flips.push({ node: val, text: 'claude-opus-5-5', t0: e + 0.5, dur: 1.0 });
        cue(e + 1.5, 'chime', { n: 1 });
        const hc = hlCard(s, shot); enterHeadline(hc, e + 0.05);
        break;
      }
      case 'prompt': case 'render': {
        const lines = s.key === 'prompt' ? data.promptLines : evidence.lines;
        const file = s.key === 'prompt' ? 'PROMPT.md' : 'render.mjs';
        const cw = A ? 700 : 860;
        const c = card(fl, A ? 20 : 0, A ? 70 : 0, cw, A ? 470 : 490);
        const hd = el('div', 'abs mono', file, c); Object.assign(hd.style, { left: (A ? 48 : 36) + 'px', top: (A ? 22 : 16) + 'px', fontSize: (A ? 24 : 44) + 'px', color: '#4A6285' });
        const code = el('div', 'code abs', '', c); Object.assign(code.style, { left: 0, right: 0, top: (A ? 44 : 64) + 'px' });
        rise(c, e + 0.1);
        typer(code, lines, s.start + 0.35, s.start + (s.key === 'prompt' ? 2.6 : 2.2));
        if (s.key === 'render') {
          const fc = A ? chip(fl, '', 20, 580) : el('div', 'abs mono', '', c);
          if (!A) Object.assign(fc.style, { right: '36px', top: '16px', fontSize: '44px', color: '#2F6FD6' });
          onFrame((t, f) => { fc.textContent = A ? `FRAME ${String(f).padStart(4, '0')} / ${T.frames}` : `FRAME ${String(f).padStart(4, '0')}`; });
          if (A) rise(fc, e + 0.5, 0.5, 40);
        }
        const hc = hlCard(s, shot); enterHeadline(hc, e + 0.05);
        break;
      }
      case 'loop': {
        const cx = A ? 350 : 420, cy = A ? 330 : 270, rx = A ? 270 : 300, ry = A ? 220 : 190;
        el('div', 'layer', `<svg width="${VW}" height="${VH}" style="overflow:visible"><ellipse class="orb" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="10 12" opacity=".85"/></svg>`, fl);
        const tc = card(fl, cx - (A ? 110 : 100), cy - (A ? 110 : 100), A ? 220 : 200, A ? 220 : 200);
        tc.style.borderRadius = '50%';
        const tw = icon('tower', A ? 150 : 140, tc, A ? 33 : 28, A ? 30 : 26);
        drawIcon(tw, e + 0.3, 0.8);
        rise(tc, e + 0.1);
        const pl = el('div', 'abs', `<svg width="60" height="60" viewBox="-30 -30 60 60" style="overflow:visible"><path d="M-22 0 L-6 -2 L4 -14 H8 L3 -2 L14 -3 L18 -8 H21 L19 0 L21 8 H18 L14 3 L3 2 L8 14 H4 L-6 2 Z" fill="#FFFFFF" transform="scale(1.5)"/></svg>`, fl);
        Object.assign(pl.style, { left: '0px', top: '0px' });
        const tcards = [0, 1, 2].map((k) => {
          const tw2 = A ? 210 : 190, th2 = A ? 128 : 120;
          const c = card(fl, 0, 0, tw2, th2); c.style.overflow = 'hidden'; c.style.borderRadius = '22px 22px 22px 6px';
          if (thumbs[k]) { const im = el('img', '', null, c); im.src = thumbs[k]; Object.assign(im.style, { display: 'block', width: '100%', height: '100%', objectFit: 'cover' }); }
          else { c.style.background = 'linear-gradient(135deg,#FFE8EF,#8EC3F2)'; }
          const badge = el('div', 'abs', '', fl);
          badge.innerHTML = `<svg viewBox="0 0 48 48" width="${A ? 56 : 60}" height="${A ? 56 : 60}"><circle cx="24" cy="24" r="21" fill="#FFFFFF" stroke="#0B2A5B" stroke-width="2.5"/><path class="x" d="M16 16 L32 32 M32 16 L16 32" stroke="#A8264F" stroke-width="4.5" stroke-linecap="round"/><path class="v" d="M14 25 L21 32 L34 17" stroke="#0B2A5B" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg>`;
          const flipAt = s.start + [3, 5, 7][k] * beat;
          tl.to(badge.querySelector('.x'), { opacity: 0, duration: 0.15 }, flipAt);
          tl.to(badge.querySelector('.v'), { opacity: 1, duration: 0.15 }, flipAt);
          tl.fromTo(badge, { scale: 1 }, { scale: 1.25, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, flipAt);
          cue(flipAt, 'pop', { hi: 1 });
          gsap.set([c, badge], { opacity: 0 }); tl.to([c, badge], { opacity: 1, duration: 0.4 }, e + 0.5 + k * 0.12);
          return { c, badge, w: tw2, h: th2, off: (k * 2 * Math.PI) / 3 + 0.6 };
        });
        const t0 = s.start;
        onFrame((t) => {
          const ang = ((t - t0) / (8 * beat)) * Math.PI * 2; // one full oval per 8 beats
          const px = cx + Math.cos(ang) * rx, py = cy + Math.sin(ang) * ry;
          const dx = -Math.sin(ang) * rx, dy = Math.cos(ang) * ry;
          pl.style.transform = `translate(${px - 30}px, ${py - 30}px) rotate(${(Math.atan2(dy, dx) * 180 / Math.PI).toFixed(2)}deg)`;
          tcards.forEach((q) => {
            const a2 = ang + q.off;
            const x = cx + Math.cos(a2) * rx - q.w / 2, y = cy + Math.sin(a2) * ry - q.h / 2;
            q.c.style.left = x + 'px'; q.c.style.top = y + 'px';
            q.badge.style.left = x + q.w - 30 + 'px'; q.badge.style.top = y - 26 + 'px';
          });
        });
        cue(e + 0.3, 'swell', { dur: 3.0 });
        const hc = hlCard(s, shot); enterHeadline(hc, e + 0.05);
        break;
      }
      case 'notam1': case 'notam2': case 'notam3': {
        // NOTAM tags live in their own layer so they stack across shots 11–13
        const tag = el('div', 'card notam', `<span class="tag mono">NOTAM ${s.notam}</span><div class="txt">${lineHTML(s.l1)}</div>`, NOT);
        notamTags.push({ tag, s });
        // visuals sit on a white cloud card so the deep-sky strokes stay readable on the dark sky
        const nc = card(fl, A ? 60 : 0, A ? 100 : 20, A ? 640 : 860, A ? 470 : 480);
        rise(nc, e + 0.1);
        if (s.key === 'notam1') { const tw = icon('tower', 230, nc, A ? 205 : 315, 50); drawIcon(tw, e + 0.3, 0.8); const cp = chip(nc, 'git push'); Object.assign(cp.style, { left: '50%', bottom: '44px', transform: 'translateX(-50%)' }); rise(cp, e + 0.9, 0.4, 30); cue(e + 0.9, 'pop'); }
        if (s.key === 'notam2') { const ic = icon('cloudsrv', 250, nc, 195, 40); drawIcon(ic, e + 0.3, 0.8); const cp = chip(nc, 'network access: Trusted'); Object.assign(cp.style, { left: '50%', bottom: '44px', transform: 'translateX(-50%)' }); rise(cp, e + 0.9, 0.4, 30); cue(e + 0.9, 'pop'); }
        if (s.key === 'notam3') {
          const ph = icon('phone', 260, nc, 40, 100); drawIcon(ph, e + 0.3, 0.7);
          const lk = icon('lock', 120, nc, 110, 170); drawIcon(lk, s.start + 0.6, 0.6);
          tl.to(ph.querySelector('.gold'), { opacity: 0.2, duration: 0.5 }, s.start + 0.5);
          const tw = icon('tower', 240, nc, 360, 90); drawIcon(tw, e + 0.5, 0.7);
          const bc = tw.querySelector('.gold');
          onFrame((t) => { if (t > s.start) bc.style.opacity = (0.55 + 0.45 * Math.cos(((t - s.start) / beat) * Math.PI * 2)).toFixed(3); });
          const ln = el('div', 'layer', `<svg width="600" height="400" style="overflow:visible"><path d="M235 170 C 300 90, 360 90, 420 130" stroke="#0B2A5B" stroke-width="3" fill="none" stroke-dasharray="8 10" stroke-linecap="round"/></svg>`, nc);
          rise(ln, e + 0.9, 0.4, 0);
        }
        break;
      }
      case 'result': {
        const fw = A ? 300 : 260, fh = A ? 600 : 520;
        const fr = el('div', 'abs', null, fl);
        Object.assign(fr.style, { left: (A ? 110 : 40) + 'px', top: (A ? 20 : 0) + 'px', width: fw + 'px', height: fh + 'px', border: '2.5px solid #0B2A5B', borderRadius: '44px', background: '#FFFFFF', boxShadow: '0 20px 40px -24px rgba(6,26,72,.5)', padding: '18px', overflow: 'hidden' });
        const scr = el('div', '', null, fr); Object.assign(scr.style, { width: '100%', height: '100%', borderRadius: '28px', overflow: 'hidden', background: 'linear-gradient(180deg,#0B2A5B,#2F6FD6 50%,#FFC53D)' });
        if (endStill) { const im = el('img', '', null, scr); im.src = endStill; Object.assign(im.style, { width: '100%', height: '100%', objectFit: 'cover' }); }
        rise(fr, e + 0.1, 0.7, 90);
        const b1 = chip(fl, 'DRAFT PR', A ? 450 : 360, A ? 200 : 140), b2 = chip(fl, 'MP4 · 30 fps', A ? 450 : 360, A ? 300 : 250);
        b1.style.color = '#A8264F'; b1.style.borderColor = '#A8264F';
        [b1, b2].forEach((b, k) => { gsap.set(b, { scale: 0.5, opacity: 0 }); tl.to(b, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.2)' }, e + 0.8 + k * 0.25); cue(e + 0.8 + k * 0.25, 'pop'); });
        const hc = hlCard(s, shot); enterHeadline(hc, e + 0.05);
        break;
      }
      case 'proof': {
        const c = card(fl, 20, 90, 720, 460);
        const st = stats || { shots: T.shots.length, frames: T.frames, duration: T.duration, workers: 0, provisional: true };
        const items = [['SHOTS', st.shots, (v) => fmtInt(v)], ['FRAMES', st.frames, (v) => fmtInt(v)], ['DURATION S', st.duration, (v) => v.toFixed(2)], ['RENDER WORKERS', st.workers, (v) => fmtInt(v)]];
        items.forEach(([lab, val, fmt], k) => {
          const ro = el('div', 'readout', `<span class="lab mono">${lab}</span><span class="val mono">0</span>`, c);
          Object.assign(ro.style, { left: (k % 2) * 360 + 'px', width: '360px', top: (k < 2 ? 70 : 260) + 'px' });
          counters.push({ node: ro.querySelector('.val'), to: val, t0: s.start, t1: s.start + 4 * beat, fmt });
        });
        const dv = el('div', 'abs', null, c); Object.assign(dv.style, { left: '40px', right: '40px', top: '228px', height: '2px', background: 'rgba(74,98,133,.35)' });
        const dh = el('div', 'abs', null, c); Object.assign(dh.style, { top: '40px', bottom: '40px', left: '359px', width: '2px', background: 'rgba(74,98,133,.35)' });
        rise(c, e + 0.1);
        cue(s.start + 4 * beat, 'chime', { n: 4 });
        for (let k = 0; k < 4; k++) cue(s.start + k * beat, 'tick', { soft: 1 });
        const hc = hlCard(s, shot); enterHeadline(hc, e + 0.05);
        break;
      }
      case 'reveal': {
        vis.remove();
        const hc = hlCard(s, shot);
        if (A) { hc.style.top = '150px'; } else { hc.style.top = '330px'; }
        enterHeadline(hc, e + 0.05);
        const labels = wptShots.map((x) => x.wpt);
        const n = labels.length;
        let pts, d;
        if (A) {
          pts = labels.map((_, k) => ({ x: 1680 - (k * 1440) / (n - 1), y: 860 - (k * 300) / (n - 1) - Math.sin((k / (n - 1)) * Math.PI) * 40 }));
        } else {
          pts = labels.map((_, k) => ({ x: k % 2 ? 330 : 750, y: 1390 - (k * 560) / (n - 1) }));
        }
        d = 'M' + pts.map((p) => `${p.x} ${p.y}`).join(' L ');
        const big = el('div', 'layer', `<svg width="${W}" height="${H}" style="position:absolute;inset:0;overflow:visible">
          <path class="rb" d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${A ? 3 : 4}" stroke-dasharray="${A ? '12 12' : '14 14'}" stroke-linecap="round" stroke-linejoin="round"/>
          <g class="lights"></g><g class="bpins"></g></svg>`, shot);
        const rb = big.querySelector('.rb'); const L = rb.getTotalLength();
        const lights = big.querySelector('.lights');
        const nL = Math.floor(L / (A ? 34 : 40));
        const lightEls = [];
        for (let k = 0; k <= nL; k++) {
          const p = rb.getPointAtLength((L * k) / nL);
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.innerHTML = `<circle cx="${p.x}" cy="${p.y}" r="${A ? 11 : 13}" fill="#19B8C9" opacity=".35"/><circle cx="${p.x}" cy="${p.y}" r="${A ? 4.5 : 5.5}" fill="#FFFFFF"/>`;
          lights.appendChild(g); lightEls.push(g);
        }
        gsap.set(lightEls, { opacity: 0.12 });
        gsap.set(rb, { opacity: 0 });
        tl.to(rb, { opacity: 0.9, duration: 0.4 }, e + 0.2);
        tl.to(lightEls, { opacity: 1, duration: 0.12, stagger: 1.0 / nL }, s.start + 0.2);
        const chips = labels.map((lab, k) => {
          const p = pts[k];
          const pin = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          pin.innerHTML = `<g transform="translate(${p.x} ${p.y - 6}) scale(${A ? 1 : 1.25})"><path d="M0 0 C -2 -6, -14 -18, -14 -28 a14 14 0 0 1 28 0 C 14 -18, 2 -6, 0 0 Z" fill="#FFFFFF" stroke="#0B2A5B" stroke-width="3"/><circle cx="0" cy="-28" r="5.5" fill="#0B2A5B"/></g>`;
          big.querySelector('.bpins').appendChild(pin);
          const c = el('div', 'chip', `<span style="font-weight:600;font-family:Assistant">${esc(lab)}</span>`, shot);
          Object.assign(c.style, { position: 'absolute', fontSize: (A ? 38 : 48) + 'px', padding: A ? '6px 26px' : '8px 30px' });
          if (A) { c.style.left = p.x + 'px'; c.style.top = p.y + 18 + 'px'; c.style.transform = 'translateX(-50%)'; }
          else { c.style.top = p.y - 40 + 'px'; if (k % 2) c.style.left = p.x + 50 + 'px'; else c.style.right = W - p.x + 50 + 'px'; }
          gsap.set([c, pin], { opacity: 0.25 });
          const tk = s.start + 0.25 + (k * 1.0) / (n - 1);
          tl.to([c, pin], { opacity: 1, duration: 0.2 }, tk);
          cue(tk, 'pop', { hi: 1 });
          return c;
        });
        // all at once: a brief brightness swell across the whole route
        tl.to(lightEls, { scale: 1.35, transformOrigin: '50% 50%', duration: 0.18, yoyo: true, repeat: 1 }, s.start + 1.45);
        tl.to(chips, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, s.start + 1.45);
        cue(s.start + 1.45, 'chime', { n: 3 });
        break;
      }
      case 'end': {
        vis.remove();
        const c = el('div', 'card', null, shot);
        Object.assign(c.style, A ? { left: '50%', width: '980px', marginLeft: '-490px', top: '120px', padding: '40px 60px 44px', textAlign: 'center' }
          : { left: '100px', right: '120px', top: '330px', padding: '44px 40px 48px', textAlign: 'center' });
        const ph = el('img', '', null, c); ph.src = 'phoenix.png'; Object.assign(ph.style, { width: (A ? 190 : 250) + 'px', display: 'block', margin: '0 auto' });
        const wm = el('div', 'wordmark', '<span class="yuv">YUV</span><span class="ai">.AI</span>', c); Object.assign(wm.style, { direction: 'ltr', fontSize: (A ? 64 : 92) + 'px', lineHeight: 1.1, color: '#0B2A5B' });
        const l1 = el('div', 'l1', lineHTML(s.l1), c); Object.assign(l1.style, { fontSize: (A ? 64 : 66) + 'px', marginTop: (A ? 14 : 20) + 'px', lineHeight: 1.15 });
        const l2 = el('div', 'l2', lineHTML(s.l2), c); Object.assign(l2.style, { fontSize: (A ? 46 : 54) + 'px' });
        const cr = el('div', 'mono', 'YUVAL AVIDANI · YUV.AI', c); Object.assign(cr.style, { fontSize: (A ? 24 : 44) + 'px', color: '#4A6285', marginTop: (A ? 18 : 26) + 'px' });
        gsap.set(c, { opacity: 0, y: 60 });
        tl.to(c, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, e + 0.05);
        gsap.set([ph, wm], { opacity: 0, y: 40 });
        tl.to([ph, wm], { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.15 }, e + 0.2);
        const ws = [...l1.querySelectorAll('.wi'), ...l2.querySelectorAll('.wi')];
        gsap.set(ws, { yPercent: 115 });
        tl.to(ws, { yPercent: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 }, e + 0.55);
        gsap.set(cr, { opacity: 0 }); tl.to(cr, { opacity: 1, duration: 0.5 }, e + 1.3);
        break;
      }
    }
  });

  // NOTAM stacking: newest on top, earlier tags shift down and dim to 40%
  (function () {
    if (!notamTags.length) return;
    gsap.set(NOT, { autoAlpha: 1 });
    const top0 = A ? 150 : 330, gap = A ? 26 : 30;
    const heights = notamTags.map(({ tag }) => tag.offsetHeight);
    notamTags.forEach(({ tag, s }, k) => {
      gsap.set(tag, { opacity: 0, top: top0 });
      const e = s.start - 0.5 * beat;
      // y positions after this tag arrives
      let y = top0;
      const order = notamTags.slice(0, k + 1).reverse();
      order.forEach(({ tag: tg }, j) => {
        if (j === 0) { tl.fromTo(tg, { top: y + 80, opacity: 0 }, { top: y, opacity: 1, duration: 0.55, ease: 'power2.out' }, e + 0.1); }
        else tl.to(tg, { top: y, opacity: 0.4, duration: 0.5, ease: 'power2.inOut' }, e + 0.1);
        y += heights[notamTags.indexOf(order[j])] + gap;
      });
      const edge = el('div', 'abs', null, tag); Object.assign(edge.style, { left: '-12px', top: '-2.5px', bottom: '-2.5px', width: '12px', background: '#FFFFFF', transformOrigin: '50% 100%', borderRadius: '0 0 0 6px' });
      tl.fromTo(edge, { scaleY: 1 }, { scaleY: 0, duration: 0.5, ease: 'power2.inOut' }, e + 0.45);
      cue(e + 0.2, 'whoosh', { soft: 1 });
      cue(e + 0.6, 'pop');
    });
  })();

  // ---------- transitions: push-in through a cloud, climb into the next layer ----------
  const flash = $('#flash');
  S.forEach((s, i) => {
    const n = S[i + 1]; if (!n) return;
    const t0 = s.end, mid = t0 + 0.5 * beat;
    tl.fromTo(trClouds, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1.35, duration: 0.5 * beat, ease: 'power2.in', immediateRender: false }, t0);
    tl.to(trClouds, { opacity: 0, scale: 2.2, duration: 0.5 * beat, ease: 'power2.out' }, mid);
    tl.fromTo(flash, { opacity: 0 }, { opacity: 0.8, duration: 0.5 * beat, ease: 'power2.in', immediateRender: false }, t0);
    tl.to(flash, { opacity: 0, duration: 0.5 * beat, ease: 'power2.out' }, mid);
    cue(t0, 'whoosh');
    if (n.layer !== s.layer) { applyLayer(n.layer, mid - 0.15 * beat, 0.3 * beat); cue(t0 - 0.2, 'swell', { dur: beat + 0.6 }); }
    if (n.key === 'reveal') cue(n.start - 2 * BAR, 'riser', { dur: 2 * BAR });
  });
  const endShot = S[S.length - 1];
  tl.to([ruleBot, cTime, cMark], { opacity: 0, duration: 0.4 }, endShot.start - 0.5 * beat);
  const finalHit = Math.floor((T.totalBeats - 0.001) / 4) * 4 * beat; // last downbeat of the video
  cue(finalHit, 'impact');

  // ---------- per-frame world: parallax clouds, contrail, grain ----------
  const grain = $('#grain');
  for (let k = 0; k < 4; k++) { const im = new Image(); im.src = `gen/grain${k}.png`; document.body.appendChild(im); im.style.display = 'none'; }
  const ctr = $('#contrail').getContext('2d');
  onFrame((t, f) => {
    const alt = altAt(t);
    cloudField.forEach((c) => {
      const range = H + c.h + 900;
      const y = ((c.y + alt * c.speed * (A ? 1 : 1.4)) % range) - c.h - 300;
      const x = ((c.x + t * c.drift * (1 + c.depth) + W + c.w) % (W + c.w * 1.5)) - c.w * 0.75;
      c.img.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      c.img.style.opacity = (fieldState.clouds * (0.55 + c.depth * 0.22)).toFixed(3);
    });
    grain.style.backgroundImage = `url(gen/grain${f % 4}.png)`;
    // contrail grows across the deep-blue section
    ctr.clearRect(0, 0, W, H);
    const k = clamp((t - byKey.render.start + beat) / (A ? 14 : 10), 0, 1);
    if (k > 0) {
      const x0 = W * 1.05, y0 = A ? H * 0.3 : 1780, x1 = x0 - (W * 1.2) * k, y1 = y0 - (A ? H * 0.12 : 230) * k;
      const g = ctr.createLinearGradient(x1, y1, x0, y0);
      g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctr.strokeStyle = g; ctr.lineWidth = A ? 5 : 6; ctr.lineCap = 'round';
      ctr.beginPath(); ctr.moveTo(x0, y0); ctr.lineTo(x1, y1); ctr.stroke();
    }
  });

  // ---------- public API ----------
  window.TIMING = {
    fmt: FMT, width: W, height: H, bpm: data.bpm, beat, fps: T.fps, duration: T.duration, frames: T.frames, totalBeats: T.totalBeats,
    shots: S.map((s) => ({ id: s.id, key: s.key, l1: s.l1, l2: s.l2, words: s.words, formula: +s.formula.toFixed(3), beats: s.beats, hold: +s.hold.toFixed(4), start: +s.start.toFixed(4), end: +s.end.toFixed(4), layer: s.layer, alt: s.alt })),
    holdBeats: T.holdBeats, transitions: T.transitions, finalHit,
  };
  window.CUES = CUES.sort((a, b) => a.t - b.t);
  window.CUTS = S.map((s) => +s.start.toFixed(4));
  window.seek = function (t, frame) {
    tl.seek(t, false);
    const f = frame != null ? frame : Math.round(t * T.fps);
    updaters.forEach((fn) => fn(t, f));
    return true;
  };
  await document.fonts.ready;
  await Promise.all([...document.images].map((im) => (im.complete ? 0 : im.decode().catch(() => 0))));
  window.seek(0, 0);
  window.READY = true;
})();
