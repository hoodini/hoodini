// FZ1073 news trailer — deterministic scene. window.seek(t, frame) renders an exact frame; no timers, no CSS transitions.
(function () {
  const { BEAT, TRANS, FPS, SHOTS, CHIPS, TOTAL, FRAMES, byId } = window.TIMING;
  const params = new URLSearchParams(location.search);
  const FMT = params.get('fmt') === 'h' ? 'h' : 'v';
  const W = FMT === 'v' ? 1080 : 1920, H = FMT === 'v' ? 1920 : 1080;
  document.body.classList.add(FMT);
  const stage = document.getElementById('stage');
  stage.style.setProperty('--W', W + 'px');
  stage.style.setProperty('--H', H + 'px');
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const S = (id) => byId(id);

  // ---------------- layout ----------------
  const LB = FMT === 'h' ? (H - W / 2.39) / 2 : 0; // letterbox bar height (16:9 only)
  const LAY = FMT === 'v' ? {
    chromeFont: 30, r1: { x: 120, y: 234, w: 840 }, r2: { x: 120, y: 282, w: 840 }, rule: { x: 120, y: 332, w: 840 },
    center: { x: 120, y: 420, w: 840, h: 1000 }, textGfx: { x: 120, y: 380, w: 840, h: 500 }, gfx: { x: 120, y: 905, w: 840, h: 500 },
    hero: { x: 120, y: 470, w: 840, h: 640 }, horizon: 1330, chip: { x: 120, y: 1452, w: 840, font: 34, align: 'center' },
    maxFont: { center: 220, gfx: 190, hero: 200 }, counterFont: [54, 76],
  } : {
    chromeFont: 26, r1: { x: 1000, y: LB + 22, w: 800 }, r2: { x: 120, y: LB + 22, w: 820 }, rule: { x: 120, y: LB + 72, w: 1680 },
    center: { x: 160, y: LB + 100, w: 1600, h: 560 }, textGfx: { x: 1000, y: LB + 100, w: 800, h: 560 }, gfx: { x: 140, y: LB + 150, w: 800, h: 520 },
    hero: { x: 160, y: LB + 80, w: 1600, h: 420 }, horizon: LB + 610, chip: { x: 120, y: H - LB - 74, w: 1680, font: 30, align: 'flex-start' },
    maxFont: { center: 190, gfx: 150, hero: 170 }, counterFont: [46, 64],
  };
  const MINFONT = 96;
  const place = (e, b) => Object.assign(e.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', height: (b.h != null ? b.h + 'px' : '') });

  // ---------------- text helpers ----------------
  const ARROW = '<svg class="arrow" viewBox="0 0 100 60" aria-label="←"><path d="M94 30H14M36 8L10 30l26 22" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function tokens(str, ctx) {
    return str.split(' ').map((w) => {
      if (w === '←') return ARROW;
      if (/^(FZ|YA)?[0-9][0-9.,:]*$/.test(w) && /[A-Z]/.test(w)) return `<bdi class="code">${w}</bdi>`;
      if (/^[0-9][0-9.,:]*$/.test(w)) return ctx === 'counter' ? `<bdi class="num">${w}</bdi>` : `<bdi class="num">${w}</bdi>`;
      if (/[A-Za-z]/.test(w)) { const m = w.match(/^([^A-Za-z]*)([A-Za-z].*?)([,.]?)$/); return `${m[1]}<bdi class="lat">${m[2]}</bdi>${m[3]}`; }
      return w;
    }).join(' ');
  }

  // ---------------- backgrounds ----------------
  const bgs = $('#bgs'), fx = $('#fx'), gfxs = $('#gfxs');
  const LAYERS = {};
  const CLOUDS = []; // {img, layer, x0, y0, s, vx, vy, kind}
  function layer(name, bg) { const l = el('div', 'layer'); l.style.background = bg; bgs.appendChild(l); LAYERS[name] = l; return l; }
  function addClouds(l, kind, set, n, seed, yr, sr, vx) {
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      const img = el('img', 'cl'); img.src = `../assets/img/cloud_${set}${i % 3}.png`;
      const s = lerp(sr[0], sr[1], r());
      img.style.width = 900 * s + 'px'; img.style.height = 450 * s + 'px';
      img.style.opacity = (0.55 + 0.45 * r()).toFixed(2);
      l.appendChild(img);
      CLOUDS.push({ img, kind, x0: r() * (W + 900 * s) - 450 * s, y0: lerp(yr[0], yr[1], r()) * H - 225 * s, w: 900 * s, h: 450 * s, vx: vx * (0.6 + 0.8 * r()), side: r() < 0.5 ? -1 : 1, ph: r() * 6.28 });
    }
  }
  const HZ = LAY.horizon;
  layer('calm', 'linear-gradient(180deg,#2F6FD6 0%,#4F8FE4 45%,#8EC3F2 100%)');
  addClouds(LAYERS.calm, 'calm', 'w', 9, 11, [0.55, 1.0], [0.7, 1.5], 22);
  layer('black', '#05070D');
  layer('storm', 'linear-gradient(180deg,#061A48 0%,#0B2A5B 45%,#4A6285 100%)');
  addClouds(LAYERS.storm, 'storm', 's', 14, 21, [-0.1, 1.1], [0.9, 1.9], 0);
  layer('brk', 'linear-gradient(180deg,#061A48 0%,#0B2A5B 30%,#2F6FD6 78%,#8EC3F2 100%)');
  addClouds(LAYERS.brk, 'brk', 's', 8, 31, [-0.05, 0.45], [1.0, 1.8], 0);
  addClouds(LAYERS.brk, 'brkw', 'w', 7, 32, [0.8, 1.05], [0.9, 1.6], 18);
  const hzp = (HZ / H * 100).toFixed(1);
  layer('dawn', `radial-gradient(ellipse 60% 22% at 30% ${hzp}%, rgba(255,255,255,.95) 0%, rgba(255,232,239,.7) 35%, rgba(238,106,146,0) 100%), radial-gradient(ellipse 120% 30% at 50% ${hzp}%, rgba(238,106,146,.28) 0%, rgba(238,106,146,0) 70%), linear-gradient(180deg,#2F6FD6 0%,#8EC3F2 ${(HZ / H * 55).toFixed(1)}%,#FFE8EF ${hzp}%,#FFFFFF 100%)`);
  addClouds(LAYERS.dawn, 'dawn', 'd', 14, 41, [HZ / H + 0.0, 1.0], [0.9, 1.8], 14);
  layer('end', 'linear-gradient(180deg,#FFE8EF 0%,#FFFFFF 70%)');
  addClouds(LAYERS.end, 'end', 'd', 6, 51, [0.82, 1.02], [1.0, 1.7], 10);

  // light rays (shot 17) + horizon (19–20) + particles (19–20)
  const rays = el('div', 'layer'); rays.style.background = 'repeating-conic-gradient(from 200deg at 35% -10%, rgba(255,255,255,.16) 0deg 4deg, rgba(255,255,255,0) 4deg 11deg)'; rays.style.maskImage = 'linear-gradient(180deg,#000 0%,rgba(0,0,0,.6) 60%,transparent 100%)'; fx.appendChild(rays);
  const horizon = el('div', 'layer'); horizon.innerHTML = `<div style="position:absolute;left:0;right:0;top:${HZ - 2}px;height:4px;background:linear-gradient(90deg,rgba(255,197,61,0) 0%,#FFC53D 25%,#FFC53D 75%,rgba(255,197,61,0) 100%)"></div>`; fx.appendChild(horizon);
  const parts = el('div', 'layer'); fx.appendChild(parts);
  const PARTS = []; { const r = rng(77); for (let i = 0; i < 46; i++) { const d = el('div'); const s = 3 + r() * 7; Object.assign(d.style, { position: 'absolute', width: s + 'px', height: s + 'px', borderRadius: '50%', background: i % 3 ? '#FFFFFF' : '#FFE8EF', boxShadow: '0 0 12px rgba(255,255,255,.9)' }); parts.appendChild(d); PARTS.push({ d, x: r() * W, y: r() * H, v: 18 + r() * 40, ph: r() * 6.28 }); } }

  // ---------------- gfx builders ----------------
  const G = LAY.gfx; const GW = G.w, GH = G.h;
  const svgWrap = (inner, w = GW, h = GH) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const illus = (color) => `<div class="illus-tag" style="left:0;top:-52px;color:${color}">המחשה</div>`;
  function gfxBox(shotId, html, box = G) { const g = el('div', 'gfx'); place(g, box); g.innerHTML = html; g.dataset.shot = shotId; gfxs.appendChild(g); return g; }

  // map projection (schematic, real coordinates)
  const LON0 = 32.5, LON1 = 58, LAT0 = 22.5, LAT1 = 34.5, KX = Math.cos(28 * Math.PI / 180);
  const mw = (LON1 - LON0) * KX, mh = (LAT1 - LAT0); const msc = Math.min(GW / mw, GH / mh) * 0.94;
  const mox = (GW - mw * msc) / 2, moy = (GH - mh * msc) / 2;
  const P = (lon, lat) => [mox + (lon - LON0) * KX * msc, moy + (LAT1 - lat) * msc];
  const DXB = P(55.36, 25.25), TLV = P(34.89, 32.01), TUU = P(36.62, 28.37);
  const CTRL = [lerp(DXB[0], TLV[0], 0.5) + 10, Math.min(DXB[1], TLV[1]) - 40];
  const qb = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  const DIV_T = 0.74, DIVP = qb(DXB, CTRL, TLV, DIV_T);
  // split quadratic at DIV_T for the travelled part
  const C1 = [lerp(DXB[0], CTRL[0], DIV_T), lerp(DXB[1], CTRL[1], DIV_T)];
  const BCTRL = [DIVP[0] - 30, lerp(DIVP[1], TUU[1], 0.15)];
  function mapSVG(mode) {
    const ink = mode === 'light' ? '#FFFFFF' : '#0B2A5B';
    const line = mode === 'light' ? '#FFFFFF' : '#2F6FD6';
    let grid = '';
    for (let lon = 35; lon <= 55; lon += 5) { const a = P(lon, LAT0), b = P(lon, LAT1); grid += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; }
    for (let lat = 25; lat <= 33; lat += 4) { const a = P(LON0, lat), b = P(LON1, lat); grid += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; }
    const dot = (p, lab, dx, dy, anchor, id) => `<g ${id ? `id="${id}"` : ''}><circle cx="${p[0]}" cy="${p[1]}" r="22" fill="${line}" opacity=".22"/><circle cx="${p[0]}" cy="${p[1]}" r="10" fill="${ink}"/><text x="${p[0] + dx}" y="${p[1] + dy}" text-anchor="${anchor}" font-family="PlexMono" font-weight="600" font-size="32" fill="${ink}" direction="ltr">${lab}</text></g>`;
    const full = `M${DXB[0]},${DXB[1]} Q${CTRL[0]},${CTRL[1]} ${TLV[0]},${TLV[1]}`;
    const trav = `M${DXB[0]},${DXB[1]} Q${C1[0]},${C1[1]} ${DIVP[0]},${DIVP[1]}`;
    const bend = `M${DIVP[0]},${DIVP[1]} Q${BCTRL[0]},${BCTRL[1]} ${TUU[0]},${TUU[1]}`;
    if (mode === 'light') {
      return svgWrap(`<g stroke="${ink}" stroke-opacity=".16" stroke-width="2">${grid}</g>
        <path d="${full}" fill="none" stroke="#19B8C9" stroke-width="16" stroke-opacity=".35" stroke-linecap="round" pathLength="1" class="draw" stroke-dasharray="1 1"/>
        <path d="${full}" fill="none" stroke="${line}" stroke-width="7" stroke-linecap="round" pathLength="1" class="draw" stroke-dasharray="1 1"/>
        <circle class="head" r="13" fill="#FFFFFF"/>
        ${dot(DXB, 'DXB', 0, 62, 'middle')}${dot(TLV, 'TLV', 0, -38, 'middle')}`);
    }
    return svgWrap(`<g stroke="${ink}" stroke-opacity=".14" stroke-width="2">${grid}</g>
      <path d="${full}" fill="none" stroke="${line}" stroke-width="5" stroke-opacity=".35" stroke-dasharray="4 16" stroke-linecap="round"/>
      <path d="${trav}" fill="none" stroke="${line}" stroke-width="7" stroke-linecap="round"/>
      <path d="${bend}" fill="none" stroke="#19B8C9" stroke-width="18" stroke-opacity=".3" stroke-linecap="round" pathLength="1" class="draw" stroke-dasharray="1 1"/>
      <path d="${bend}" fill="none" stroke="${line}" stroke-width="8" stroke-linecap="round" pathLength="1" class="draw" stroke-dasharray="1 1"/>
      ${dot(DXB, 'DXB', 0, 62, 'middle')}${dot(TLV, 'TLV', 0, -38, 'middle')}${dot(TUU, 'TUU', -34, 12, 'end', 'tuu')}`);
  }

  // cabin: 29 rows × 6 seats = 174 (737 MAX 8 cabin as a schematic seat map)
  const KIDS = (() => { const r = rng(2727), s = new Set(); while (s.size < 27) s.add(Math.floor(r() * 174)); return s; })();
  function cabinSVG(kids) {
    const cols = 29, pitch = Math.min(26, (GW - 90) / cols), rowP = 30, aisle = 26;
    const cw = cols * pitch, ch = 6 * rowP + aisle;
    const x0 = (GW - cw) / 2 + pitch / 2 + 14, y0 = (GH - ch) / 2 + rowP / 2;
    let dots = '';
    for (let c = 0; c < cols; c++) for (let r = 0; r < 6; r++) {
      const i = c * 6 + r, y = y0 + r * rowP + (r >= 3 ? aisle : 0), x = x0 + c * pitch;
      const isKid = KIDS.has(i);
      const fill = kids ? (isKid ? '#FFFFFF' : '#0B2A5B') : '#FFFFFF';
      const op = kids ? (isKid ? 1 : 0.35) : 0.92;
      dots += `<circle class="seat" data-c="${c}" cx="${x}" cy="${y}" r="${kids && isKid ? 10 : 8.5}" fill="${fill}" opacity="${op}"/>` + (kids && isKid ? `<circle cx="${x}" cy="${y}" r="17" fill="#19B8C9" opacity=".45"/>` : '');
    }
    const fx0 = (GW - cw) / 2 - 40, fy0 = (GH - ch) / 2 - 34, fw = cw + 90, fh = ch + 68;
    return svgWrap(`<rect x="${fx0}" y="${fy0}" width="${fw}" height="${fh}" rx="${fh / 2}" fill="rgba(11,42,91,.18)" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="4"/>${dots}`);
  }

  function altimeterSVG() {
    const cx = GW / 2, cy = GH / 2, R = Math.min(GW, GH) / 2 - 20;
    let ticks = '';
    for (let i = 0; i < 50; i++) { const a = i / 50 * Math.PI * 2, big = i % 5 === 0; const r1 = R - (big ? 34 : 18); ticks += `<line x1="${cx + Math.sin(a) * r1}" y1="${cy - Math.cos(a) * r1}" x2="${cx + Math.sin(a) * (R - 4)}" y2="${cy - Math.cos(a) * (R - 4)}" stroke-width="${big ? 6 : 3}"/>`; if (big) ticks += `<text x="${cx + Math.sin(a) * (R - 62)}" y="${cy - Math.cos(a) * (R - 62) + 13}" font-size="38">${i / 5}</text>`; }
    return svgWrap(`<circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="rgba(6,26,72,.55)" stroke="#8EC3F2" stroke-opacity=".6" stroke-width="4"/>
      <g stroke="#FFFFFF" fill="#FFFFFF" font-family="PlexMono" font-weight="600" text-anchor="middle" direction="ltr">${ticks}</g>
      <rect x="${cx - 150}" y="${cy + 30}" width="300" height="84" rx="12" fill="#061A48" stroke="#8EC3F2" stroke-opacity=".5" stroke-width="3"/>
      <text class="altread" x="${cx + 118}" y="${cy + 92}" font-family="PlexMono" font-weight="600" font-size="58" fill="#FFFFFF" text-anchor="end" direction="ltr">34,000</text>
      <text x="${cx}" y="${cy - 58}" font-family="PlexMono" font-weight="600" font-size="28" fill="#8EC3F2" text-anchor="middle" direction="ltr">ALT · FT</text>
      <g class="needle"><path d="M${cx - 9},${cy} L${cx},${cy - R + 40} L${cx + 9},${cy} Z" fill="#FFFFFF"/><circle cx="${cx}" cy="${cy}" r="16" fill="#FFFFFF"/></g>`);
  }

  // seven-segment transponder
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  function segDigit(x, y, w, h, idx) {
    const t = w * 0.16, g = 4;
    const hz = (yy) => `M${x + t / 2 + g},${yy} l${t / 2},${-t / 2} h${w - 2 * t - 2 * g} l${t / 2},${t / 2} l${-t / 2},${t / 2} h${-(w - 2 * t - 2 * g)} Z`;
    const vt = (xx, yy, hh) => `M${xx},${yy + g} l${t / 2},${t / 2} v${hh - t - 2 * g} l${-t / 2},${t / 2} l${-t / 2},${-t / 2} v${-(hh - t - 2 * g)} Z`;
    const hh = h / 2;
    const d = { a: hz(y + t / 2), g: hz(y + hh), d: hz(y + h - t / 2), f: vt(x + t / 2, y + t / 2, hh - t / 2), b: vt(x + w - t / 2, y + t / 2, hh - t / 2), e: vt(x + t / 2, y + hh, hh - t / 2), c: vt(x + w - t / 2, y + hh, hh - t / 2) };
    return Object.entries(d).map(([k, p]) => `<path class="sg d${idx}" data-k="${k}" d="${p}"/>`).join('');
  }
  function xpdrSVG() {
    const pw = Math.min(GW, 760), ph = 330, px = (GW - pw) / 2, py = (GH - ph) / 2;
    const dw = 120, dh = 200, gap = 34, tot = 4 * dw + 3 * gap, dx = px + (pw - tot) / 2, dy = py + 88;
    let digits = ''; for (let i = 0; i < 4; i++) digits += segDigit(dx + i * (dw + gap), dy, dw, dh, i);
    return svgWrap(`<defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="26" fill="rgba(6,26,72,.88)" stroke="#8EC3F2" stroke-opacity=".7" stroke-width="4"/>
      <text x="${px + 34}" y="${py + 56}" font-family="PlexMono" font-weight="600" font-size="30" fill="#8EC3F2" direction="ltr">XPDR · SQUAWK</text>
      <g class="digits" filter="url(#glow)">${digits}</g>`);
  }

  function radarSVG() {
    const cx = GW / 2, cy = GH / 2, R = Math.min(GW, GH) / 2 - 16;
    let rings = ''; for (let i = 1; i <= 3; i++) rings += `<circle cx="${cx}" cy="${cy}" r="${R * i / 3}" fill="none"/>`;
    let wedge = ''; for (let i = 0; i < 10; i++) { const a0 = -i * 4 * Math.PI / 180, a1 = -(i + 1) * 4 * Math.PI / 180; wedge += `<path d="M${cx},${cy} L${cx + Math.sin(a0) * R},${cy - Math.cos(a0) * R} A${R},${R} 0 0 0 ${cx + Math.sin(a1) * R},${cy - Math.cos(a1) * R} Z" fill="#19B8C9" opacity="${(0.55 * (1 - i / 10)).toFixed(3)}"/>`; }
    const blip = (i) => `<g class="blip b${i}"><circle r="30" fill="#8EC3F2" opacity=".35"/><path d="M0,-17 L12,13 L0,6 L-12,13 Z" fill="#FFFFFF"/></g>`;
    return svgWrap(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="rgba(6,26,72,.7)"/>
      <g stroke="#8EC3F2" stroke-opacity=".5" stroke-width="3">${rings}<line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}"/><line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}"/></g>
      <g class="sweep">${wedge}<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - R}" stroke="#FFFFFF" stroke-width="4"/></g>
      <circle cx="${cx}" cy="${cy}" r="9" fill="#FFFFFF"/>${blip(0)}${blip(1)}`);
  }
  const BLIPS = [{ a: -62, r: 0.62 }, { a: -44, r: 0.74 }];

  function personPath(x, base, h) { const hr = h * 0.15, w = h * 0.46, sy = base - h + 2 * hr + h * 0.06; return `<circle cx="${x}" cy="${base - h + hr}" r="${hr}"/><path d="M${x - w / 2},${base} L${x - w / 2},${sy + w * 0.32} Q${x - w / 2},${sy} ${x - w * 0.18},${sy} L${x + w * 0.18},${sy} Q${x + w / 2},${sy} ${x + w / 2},${sy + w * 0.32} L${x + w / 2},${base} Z"/>`; }
  function peopleSVG(mode) {
    const r = rng(mode === 'stand' ? 1616 : 1414); const n = 5; let figs = '';
    const glow = `<defs><radialGradient id="pg${mode}" cx="50%" cy="100%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset=".62" stop-color="#8EC3F2" stop-opacity=".9"/><stop offset="1" stop-color="#8EC3F2" stop-opacity="0"/></radialGradient></defs><ellipse cx="${GW / 2}" cy="${GH}" rx="${GW * 0.72}" ry="${GH * 1.05}" fill="url(#pg${mode})"/>`;
    const spread = mode === 'stand' ? 0.74 : 0.92; const sp = GW * spread / n;
    for (let i = 0; i < n; i++) { const x = GW / 2 + (i - (n - 1) / 2) * sp; const h = Math.min(GH * (0.55 + 0.22 * r()) * (i % 2 ? 0.92 : 1), sp * (mode === 'stand' ? 2.0 : 1.85)); figs += `<g class="fig" fill="#0B2A5B">${personPath(x, GH + 4, h)}</g>`; }
    return svgWrap(`${glow}${figs}`);
  }
  function doorSVG(open) {
    const dw = Math.min(300, GW * 0.36), dh = GH - 30, x = GW / 2 - dw / 2, y = 14;
    const frame = `<path d="M${x},${y + dh} V${y + 24} Q${x},${y} ${x + 24},${y} H${x + dw - 24} Q${x + dw},${y} ${x + dw},${y + 24} V${y + dh}" pathLength="1" class="draw" stroke-dasharray="1 1"/>`;
    if (!open) {
      return svgWrap(`<g fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${frame}
        <path d="M${x},${y + dh} H${x + dw}" pathLength="1" class="draw" stroke-dasharray="1 1"/>
        <rect x="${x + dw * 0.3}" y="${y + 50}" width="${dw * 0.4}" height="${dh * 0.14}" rx="10" pathLength="1" class="draw" stroke-dasharray="1 1"/>
        <rect x="${x + dw - 64}" y="${y + dh * 0.45}" width="36" height="58" rx="6" pathLength="1" class="draw" stroke-dasharray="1 1"/></g>`);
    }
    const leaf = `<path d="M${x},${y + dh} V${y + 24} L${x - dw * 0.55},${y + 60} V${y + dh - 26} Z" fill="rgba(11,42,91,.65)" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>`;
    const spill = `<defs><linearGradient id="spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset="1" stop-color="#8EC3F2" stop-opacity=".8"/></linearGradient><radialGradient id="flr" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#8EC3F2" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="${GW / 2}" cy="${GH}" rx="${GW * 0.55}" ry="${GH * 0.5}" fill="url(#flr)"/>
      <rect x="${x + 3}" y="${y + 3}" width="${dw - 6}" height="${dh - 3}" rx="20" fill="url(#spill)"/>`;
    let figs = ''; [[-0.95, 0.5], [0.95, 0.56], [0, 0.42]].forEach(([k, s]) => { figs += `<g class="fig" fill="#0B2A5B">${personPath(GW / 2 + k * dw * 0.9, GH + 4, GH * s)}</g>`; });
    return svgWrap(`${spill}${leaf}<g fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round">${frame}</g>${figs}`);
  }

  // ---------------- build per-shot DOM ----------------
  const texts = $('#texts'), chipsEl = $('#chips');
  const TXT = {}, GFX = {}, FIT = {};
  const DARK_TEXT = new Set([18, 19, 20]);

  function buildText(s) {
    const box = s.layout === 'center' ? LAY.center : s.layout === 'hero' ? LAY.hero : LAY.textGfx;
    const t = el('div', 'shot-text ' + (DARK_TEXT.has(s.id) ? 'dark' : 'light'));
    place(t, box);
    if (s.layout === 'end') return null;
    const head = el('div', 'head' + (s.headKind === 'mono' ? ' mono' : ''));
    head.innerHTML = s.head.map((ln) => {
      let h = s.headKind === 'mono' ? ln.split('').map((c) => `<span class="ch">${c}</span>`).join('') + '<span class="cursor"></span>' : tokens(ln, 'head');
      if (s.marker && ln.includes(s.marker)) h = h.replace(s.marker, `<span class="markword"><span class="markbg"></span>${s.marker}</span>`);
      return `<span class="line"${s.headKind === 'mono' ? ' dir="ltr"' : ''}>${h}</span>`;
    }).join('');
    t.appendChild(head);
    if (s.counter) t.appendChild(el('div', 'counter', tokens(s.counter, 'counter')));
    if (!DARK_TEXT.has(s.id) && s.act !== 2) {
      const sc = el('div'); Object.assign(sc.style, { position: 'absolute', inset: '-12% -8%', zIndex: -1, background: 'radial-gradient(ellipse at 50% 50%, rgba(6,26,72,.42) 0%, rgba(6,26,72,0) 68%)' });
      t.style.zIndex = 0; t.insertBefore(sc, head);
    }
    texts.appendChild(t);
    return t;
  }

  function fitText(s, t) {
    const head = $('.head', t), cnt = $('.counter', t);
    const box = s.layout === 'center' ? LAY.center : s.layout === 'hero' ? LAY.hero : LAY.textGfx;
    const maxW = box.w / (s.punch ? 1.1 : 1.0);
    const maxF = LAY.maxFont[s.layout === 'center' ? 'center' : s.layout === 'hero' ? 'hero' : 'gfx'] * (s.headKind === 'mono' ? 0.8 : 1);
    head.style.fontSize = '100px';
    const lw = Math.max(...[...head.querySelectorAll('.line')].map((l) => l.getBoundingClientRect().width));
    let F = Math.min(maxF, Math.floor(100 * maxW / lw));
    const lines = s.head.length;
    let cf = 0;
    const fitH = () => { cf = cnt ? Math.max(LAY.counterFont[0], Math.min(LAY.counterFont[1], Math.round(F * 0.36))) : 0; return lines * F * 1.02 + (cnt ? cf * 1.6 : 0); };
    while (fitH() > box.h && F > MINFONT) F -= 2;
    head.style.fontSize = F + 'px';
    if (cnt) {
      cnt.style.fontSize = cf + 'px';
      const cw = cnt.getBoundingClientRect().width; if (cw > box.w) { cf = Math.floor(cf * box.w / cw); cnt.style.fontSize = cf + 'px'; }
    }
    FIT[s.id] = { font: F, counter: cf, ok: F >= MINFONT && (!cnt || cf >= 46) };
  }

  function buildEnd(s) {
    const e = el('div', 'endcard');
    if (FMT === 'v') {
      place(e, { x: 120, y: 330, w: 840, h: 1200 });
      e.innerHTML = `<img class="logo" src="../assets/img/phoenix.png" style="width:340px;height:340px">
        <div class="wordmark" style="font-size:104px;margin-top:4px"><span class="yuv">YUV</span><span class="ai">.AI</span></div>
        <div class="endhead" style="font-weight:800;font-size:104px;line-height:1.05;margin-top:64px">הפרטים עדיין<br>מתבררים.</div>
        <div class="srclabel" style="font-size:34px;margin-top:52px">מקורות</div>
        <div class="sources" style="font-size:36px;line-height:1.5;margin-top:8px">CBS News · ynet · Times of Israel<br>CNN · Wikipedia</div>
        <div class="credit" style="font-size:30px;margin-top:40px">YUVAL AVIDANI · YUV.AI</div>`;
    } else {
      place(e, { x: 160, y: LB + 96, w: 1600, h: 640 });
      e.style.flexDirection = 'row'; e.style.justifyContent = 'space-between'; e.style.alignItems = 'center';
      e.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:820px">
          <div class="endhead" style="font-weight:800;font-size:112px;line-height:1.05">הפרטים עדיין<br>מתבררים.</div>
          <div class="srclabel" style="font-size:30px;margin-top:40px">מקורות</div>
          <div class="sources" style="font-size:32px;line-height:1.5;margin-top:6px">CBS News · ynet · Times of Israel<br>CNN · Wikipedia</div>
          <div class="credit" style="font-size:28px;margin-top:30px">YUVAL AVIDANI · YUV.AI</div></div>
        <div style="display:flex;flex-direction:column;align-items:center;width:600px">
          <img class="logo" src="../assets/img/phoenix.png" style="width:400px;height:400px">
          <div class="wordmark" style="font-size:100px"><span class="yuv">YUV</span><span class="ai">.AI</span></div></div>`;
    }
    e.style.opacity = 0; e.style.visibility = 'hidden';
    texts.appendChild(e);
    return e;
  }

  SHOTS.forEach((s) => {
    TXT[s.id] = s.layout === 'end' ? buildEnd(s) : buildText(s);
    const g = s.gfx;
    const light = '#FFFFFF', dark = '#0B2A5B';
    if (g === 'route') GFX[s.id] = gfxBox(s.id, mapSVG('light') + illus(light));
    if (g === 'divert') GFX[s.id] = gfxBox(s.id, mapSVG('dark') + illus(dark));
    if (g === 'cabin') GFX[s.id] = gfxBox(s.id, cabinSVG(false) + illus(light));
    if (g === 'cabinKids') GFX[s.id] = gfxBox(s.id, cabinSVG(true) + illus(light));
    if (g === 'altimeter') GFX[s.id] = gfxBox(s.id, altimeterSVG() + illus(light));
    if (g === 'xpdr') GFX[s.id] = gfxBox(s.id, xpdrSVG() + illus(light));
    if (g === 'radar') GFX[s.id] = gfxBox(s.id, radarSVG() + illus(light));
    if (g === 'door') GFX[s.id] = gfxBox(s.id, doorSVG(false) + illus(light));
    if (g === 'doorOpen') GFX[s.id] = gfxBox(s.id, doorSVG(true) + illus(light));
    if (g === 'people') GFX[s.id] = gfxBox(s.id, peopleSVG('rise') + illus(light));
    if (g === 'peopleStand') GFX[s.id] = gfxBox(s.id, peopleSVG('stand') + illus(light));
  });

  const CHIP_EL = CHIPS.map((c) => {
    const e = el('div', 'chip'); const b = LAY.chip;
    Object.assign(e.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', justifyContent: b.align });
    e.innerHTML = `<span style="font-size:${b.font}px;padding:${Math.round(b.font * 0.28)}px ${Math.round(b.font * 0.8)}px">${c.html}</span>`;
    chipsEl.appendChild(e); return e;
  });

  // chrome placement
  const chrome = $('#chrome');
  chrome.style.fontSize = LAY.chromeFont + 'px';
  place($('.r1', chrome), LAY.r1); place($('.r2', chrome), LAY.r2);
  place($('.rule', chrome), LAY.rule);
  if (FMT === 'h') { $('.r1', chrome).style.flexDirection = 'row'; $('.r2', chrome).style.flexDirection = 'row'; }
  // letterbox
  if (FMT === 'h') { const [a, b] = document.querySelectorAll('#letterbox .bar'); a.style.top = 0; a.style.height = LB + 'px'; b.style.bottom = 0; b.style.height = LB + 'px'; }
  // whip
  const whip = $('#whip'); const WHIP_IMGS = [];
  const whipBand = el('div', 'band'); whip.appendChild(whipBand);
  { const r = rng(909); for (let i = 0; i < 16; i++) { const im = el('img'); const s = 1.6 + r(); Object.assign(im.style, { width: 900 * s + 'px', height: 450 * s + 'px', left: (r() * W - 450 * s) + 'px', top: (H * 0.45 + i / 16 * H * 1.9 - 225 * s) + 'px' }); whip.appendChild(im); WHIP_IMGS.push(im); } }
  const WHIPS = [{ after: 9, set: 's' }, { after: 13, set: 'w' }].map((w) => { const s = S(w.after); const dur = 8 / FPS; return { ...w, t0: s.end + (TRANS - dur) / 2, dur, mid: s.end + TRANS / 2 }; });

  // ---------------- time helpers ----------------
  const s10 = S(10), s11 = S(11), s12 = S(12), s18 = S(18), s19 = S(19);
  function altitude(t) {
    if (t < s10.start) return 34000;
    if (t < s10.end) return lerp(34000, 17000, ease(clamp01((t - s10.start) / s10.hold)));
    if (t < s11.end) return lerp(17000, 21750, ease(clamp01((t - s10.end) / (s11.end - s10.end))));
    if (t < s12.end) return lerp(21750, 15000, ease(clamp01((t - s11.end) / (s12.end - s11.end))));
    if (t < s18.start) return 15000;
    if (t < s18.end) return lerp(15000, 0, ease(clamp01((t - s18.start) / s18.hold)));
    return 0;
  }
  const fmtAlt = (a) => Math.round(a / 10) * 10 >= 10 ? Math.round(a / 10 * 1) * 10 : 0;
  const comma = (n) => n.toLocaleString('en-US');
  const tau = (t) => (t < s19.start ? t : t < s19.end ? s19.start + 0.5 * (t - s19.start) : s19.start + 0.5 * s19.hold + (t - s19.end));
  const storm_off = (t) => 140 * t + 1700 * Math.max(0, Math.min(t, s10.end) - (s10.start - 0.15));

  // ---------------- GSAP master timeline ----------------
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  const F1 = 1 / FPS;
  // initial states
  Object.values(LAYERS).forEach((l) => tl.set(l, { opacity: 0 }, 0));
  tl.set([rays, horizon, parts], { opacity: 0 }, 0);
  tl.set(LAYERS.calm, { opacity: 1 }, 0);
  tl.set(chrome, { autoAlpha: 0 }, 0);
  tl.to(chrome, { autoAlpha: 1, duration: 0.4 }, 0.9);
  // act backgrounds
  const S5 = S(5), S9 = S(9), S13 = S(13), S14 = S(14), S17 = S(17), S20 = S(20);
  tl.set(LAYERS.calm, { opacity: 0 }, S5.end);
  tl.set(LAYERS.black, { opacity: 1 }, S5.end);
  tl.set(chrome, { autoAlpha: 0 }, S5.end);
  tl.set(LAYERS.black, { opacity: 0 }, WHIPS[0].mid);
  tl.set(LAYERS.storm, { opacity: 1 }, WHIPS[0].mid);
  tl.set(chrome, { autoAlpha: 1 }, WHIPS[0].mid);
  tl.set(LAYERS.storm, { opacity: 0 }, WHIPS[1].mid);
  tl.set(LAYERS.brk, { opacity: 1 }, WHIPS[1].mid);
  tl.to(rays, { opacity: 1, duration: 0.6 }, S17.start - 0.1);
  tl.to(LAYERS.dawn, { opacity: 1, duration: TRANS, ease: 'power1.inOut' }, S17.end);
  tl.set(LAYERS.brk, { opacity: 0 }, s18.start);
  tl.to(rays, { opacity: 0, duration: 0.4 }, s18.start - 0.2);
  tl.set(chrome, { attr: { 'data-ink': 'dark' } }, s18.start - TRANS / 2);
  tl.to([horizon, parts], { opacity: 1, duration: TRANS + 0.2 }, s19.start - TRANS);
  tl.to(LAYERS.end, { opacity: 1, duration: TRANS + 0.25 }, S20.start - TRANS);
  tl.to(parts, { opacity: 0.6, duration: 0.5 }, S20.start - TRANS);
  // slow push on catharsis (background only)
  tl.fromTo('#bgs', { scale: 1 }, { scale: 1.08, duration: s19.hold, ease: 'sine.out', immediateRender: false }, s19.start);
  tl.set('#bgs', { scale: 1 }, S20.start);
  // punch-in on the radar + dive backgrounds (8–15%)
  [[10, '#scene'], [13, '#scene']].forEach(([id, target]) => { const s = S(id); tl.fromTo(target, { scale: 1 }, { scale: 1.08, duration: 4 * F1, ease: 'power2.out', immediateRender: false }, s.start + BEAT); tl.to(target, { scale: 1.12, duration: s.hold - BEAT - 4 * F1 }, s.start + BEAT + 4 * F1); tl.set(target, { scale: 1 }, s.end + TRANS / 2); });

  SHOTS.forEach((s, i) => {
    const t = TXT[s.id]; const next = SHOTS[i + 1];
    const hardOut = (s.act === 2) || (s.id === 5) || (next && WHIPS.some((w) => w.after === s.id));
    if (t) {
      tl.set(t, { autoAlpha: 1 }, s.start);
      const head = $('.head', t), cnt = $('.counter', t);
      if (head && s.headKind !== 'mono') {
        tl.fromTo(head, { scale: 1.16 }, { scale: 0.97, duration: F1, immediateRender: false }, s.start);
        tl.to(head, { scale: 1, duration: F1 }, s.start + F1);
      }
      if (cnt) tl.fromTo(cnt, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out', immediateRender: false }, s.start + 0.06);
      if (s.punch && head) {
        tl.to(head, { scale: 1.07, duration: 4 * F1, ease: 'power2.out' }, s.start + 2 * BEAT);
        tl.to(head, { scale: 1.10, duration: s.hold - 2 * BEAT - 4 * F1 }, s.start + 2 * BEAT + 4 * F1);
      }
      if (s.marker) tl.fromTo($('.markbg', t), { scaleX: 0 }, { scaleX: 1, duration: 0.38, ease: 'power2.out', immediateRender: false }, s.start + BEAT);
      if (s.layout === 'end') tl.fromTo(t, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, immediateRender: false }, s.start - TRANS);
      if (next) { if (hardOut) tl.set(t, { autoAlpha: 0 }, s.end); else tl.to(t, { autoAlpha: 0, duration: 0.1 }, s.end); }
    }
    const g = GFX[s.id];
    if (g) {
      if (s.act === 2) tl.set(g, { autoAlpha: 1 }, s.start);
      else tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, immediateRender: false }, Math.max(0, s.start - 0.2));
      if (hardOut) tl.set(g, { autoAlpha: 0 }, WHIPS.some((w) => w.after === s.id) ? s.end + TRANS / 2 : s.end);
      else tl.to(g, { autoAlpha: 0, duration: 0.15 }, s.end);
      const draws = g.querySelectorAll('.draw');
      if (s.gfx === 'door') tl.fromTo(draws, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06, immediateRender: false }, s.start);
      if (s.gfx === 'doorOpen') tl.set(draws, { strokeDashoffset: 0 }, 0);
      if (s.gfx === 'divert') tl.fromTo(draws, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut', immediateRender: false }, s.start);
      if (s.gfx === 'route') tl.set(draws, { strokeDashoffset: 1 }, 0);
      const figs = g.querySelectorAll('.fig');
      if (figs.length && s.gfx !== 'peopleStand') tl.fromTo(figs, { y: GH * 0.8 }, { y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.045, immediateRender: false }, s.start - 0.05);
      if (s.gfx === 'peopleStand') tl.fromTo(figs, { scale: 0.96, transformOrigin: '50% 100%' }, { scale: 1.0, duration: s.hold, immediateRender: false }, s.start);
    }
  });
  CHIPS.forEach((c, i) => {
    const a = S(c.from), b = S(c.to); const e = CHIP_EL[i];
    tl.fromTo(e, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, immediateRender: false }, a.start - 0.05);
    tl.to(e, { autoAlpha: 0, duration: 0.1 }, b.end);
  });
  tl.set({}, {}, TOTAL);

  // ---------------- procedural per-frame state ----------------
  const grain = $('#grain'), altv = $('#altv');
  const GRAINS = [0, 1, 2, 3].map((i) => `url(../assets/img/grain_${i}.png)`);
  function procedural(t, frame) {
    const T = tau(t);
    // clouds
    for (const c of CLOUDS) {
      let x = c.x0, y = c.y0;
      if (c.kind === 'calm' || c.kind === 'dawn' || c.kind === 'end' || c.kind === 'brkw') { const span = W + c.w; x = ((c.x0 + c.vx * T + c.w) % span + span) % span - c.w; }
      if (c.kind === 'storm') { const span = H + c.h; y = ((c.y0 - storm_off(t) * (0.7 + 0.6 * (c.w / 1700)) + c.h) % span + span) % span - c.h; x = c.x0 + Math.sin(t * 0.7 + c.ph) * 20; }
      if (c.kind === 'brk') { const p = Math.max(0, t - S14.start); x = c.x0 + c.side * (40 * p + 260 * Math.max(0, t - S17.start) ** 1.6); y = c.y0 - 30 * p; }
      c.img.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    }
    // particles (slow-motion clock)
    for (const p of PARTS) { const y = ((p.y - p.v * T) % H + H) % H; const x = p.x + Math.sin(T * 0.6 + p.ph) * 14; p.d.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`; p.d.style.opacity = (0.45 + 0.4 * Math.sin(T * 1.3 + p.ph)).toFixed(2); }
    // handheld shake: background only, shot 10, ≤ 6 px
    const bgsEl = bgs;
    if (t >= s10.start && t < s10.end) { const k = Math.sin(Math.PI * clamp01((t - s10.start) / s10.hold)); const dx = 6 * k * (0.6 * Math.sin(t * 37.1) + 0.4 * Math.sin(t * 23.7 + 1.3)); const dy = 6 * k * (0.6 * Math.sin(t * 31.3 + 2.1) + 0.4 * Math.sin(t * 19.9)); bgsEl.style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`; } else bgsEl.style.translate = '0px 0px';
    // altimeters
    const a = altitude(t);
    altv.textContent = t >= s18.end ? 'ALT GND' : `ALT ${comma(Math.round(a / 10) * 10)} FT`;
    for (const id of [5, 10]) { const g = GFX[id]; $('.altread', g).textContent = comma(Math.round(a / 10) * 10); const R = Math.min(GW, GH) / 2; $('.needle', g).setAttribute('transform', `rotate(${((a % 1000) / 1000 * 360).toFixed(2)} ${GW / 2} ${GH / 2})`); }
    // date typing (shot 1)
    { const s = S(1), tt = $('.head', TXT[1]); const chs = tt.querySelectorAll('.ch'); const n = Math.max(0, Math.min(chs.length, Math.floor((t - s.start - 0.25) / 0.07) + 1)); chs.forEach((c, i) => { c.style.visibility = i < n ? 'visible' : 'hidden'; }); const cur = $('.cursor', tt); const tc = t - s.start; cur.style.visibility = tc < 1.6 && (n < chs.length || Math.floor(tc / 0.27) % 2 === 0) ? 'visible' : 'hidden'; }
    // route draw (shot 2)
    { const s = S(2), g = GFX[2]; const p = ease(clamp01((t - s.start + 0.1) / 0.8)); g.querySelectorAll('.draw').forEach((d) => d.style.strokeDashoffset = 1 - p); const pt = qb(DXB, CTRL, TLV, p); const h = $('.head', g); h.setAttribute('cx', pt[0]); h.setAttribute('cy', pt[1]); h.style.opacity = p > 0 && p < 1 ? 1 : 0; }
    // cabin reveal (shot 3)
    { const s = S(3), g = GFX[3]; const p = clamp01((t - s.start + 0.2) / 0.5); g.querySelectorAll('.seat').forEach((d) => { d.style.visibility = (28 - d.dataset.c) / 29 < p ? 'visible' : 'hidden'; }); }
    // transponder (11, 12)
    for (const id of [11, 12]) {
      const s = S(id), g = GFX[id];
      let code = '7700', lit = 4;
      if (id === 11) lit = Math.max(0, Math.min(4, Math.floor((t - s.start) / (3 * F1)) + 1));
      if (id === 12) code = t >= s.start + 2 * F1 ? '7500' : '7700';
      for (let d = 0; d < 4; d++) { const on = d < lit ? SEG[code[d]] : ''; g.querySelectorAll('.d' + d).forEach((p) => { const k = p.dataset.k; p.setAttribute('fill', on.includes(k) ? '#FFFFFF' : 'rgba(142,195,242,.05)'); }); }
    }
    // radar (13): two sweeps over the hold
    { const s = S(13), g = GFX[13]; const per = (s.hold - 0.1) / 2; const ang = 360 * clamp01((t - s.start + 0.05) / (2 * per)) * 2 - 0; const R = Math.min(GW, GH) / 2 - 16;
      $('.sweep', g).setAttribute('transform', `rotate(${ang.toFixed(2)} ${GW / 2} ${GH / 2})`);
      BLIPS.forEach((b, i) => { const bl = $('.b' + i, g); const ba = ((b.a % 360) + 360) % 360; const x = GW / 2 + Math.sin(b.a * Math.PI / 180) * R * b.r, y = GH / 2 - Math.cos(b.a * Math.PI / 180) * R * b.r; let since = ang - ba; let lum = 0; if (since >= 0) { const k = since % 360; lum = Math.max(0.25, Math.exp(-k / 140)); } bl.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${b.a})`); bl.style.opacity = lum.toFixed(3); });
    }
    // TUU pulse (18)
    { const s = S(18), tu = $('#tuu circle', GFX[18]); const p = clamp01((t - s.start - 0.45) / 0.4); tu.setAttribute('r', (22 + 14 * p).toFixed(1)); tu.setAttribute('opacity', (0.22 + 0.4 * p).toFixed(2)); }
    // whips
    let wOn = false;
    for (const w of WHIPS) {
      if (t >= w.t0 && t <= w.t0 + w.dur) {
        wOn = true; const p = (t - w.t0) / w.dur;
        WHIP_IMGS.forEach((im) => { im.src = `../assets/img/cloud_${w.set}${WHIP_IMGS.indexOf(im) % 3}.png`; });
        const bc = w.set === 's' ? '74,98,133' : '232,242,252';
        whipBand.style.background = `linear-gradient(180deg, rgba(${bc},0) 0%, rgba(${bc},1) 30%, rgba(${bc},1) 70%, rgba(${bc},0) 100%)`;
        whip.style.opacity = 1; whip.style.transform = `translateY(${lerp(H * 0.6, -H * 2.6, p).toFixed(1)}px)`; whip.style.filter = 'blur(14px)';
        $('#scene').style.filter = `blur(${(16 * Math.sin(Math.PI * p)).toFixed(1)}px)`;
      }
    }
    if (!wOn) { whip.style.opacity = 0; $('#scene').style.filter = 'none'; }
    // grain
    grain.style.backgroundImage = GRAINS[frame % 4];
    const gr = rng(frame * 7 + 3); grain.style.backgroundPosition = `${Math.floor(gr() * 512)}px ${Math.floor(gr() * 512)}px`;
  }

  // ---------------- cues for the audio script ----------------
  function cues() {
    const ev = [];
    const s = (id) => S(id);
    ev.push({ t: s(5).end, type: 'silence_start' }, { t: s(6).start, type: 'silence_end' });
    ev.push({ t: s(6).start, type: 'heartbeat' });
    [7, 8, 9].forEach((id) => ev.push({ t: s(id).start, type: 'subhit' }));
    for (let d = 0; d < 4; d++) ev.push({ t: s(11).start + d * 3 * F1, type: 'tick' });
    ev.push({ t: s(12).start + 2 * F1, type: 'tick' });
    const per = (s(13).hold - 0.1) / 2;
    BLIPS.forEach((b) => { const ba = ((b.a % 360) + 360) % 360; for (let k = 0; k < 2; k++) { const ang = ba + 360 * k; const tt = s(13).start - 0.05 + ang / 720 * 2 * per; if (tt < s(13).end) ev.push({ t: tt, type: 'ping' }); } });
    WHIPS.forEach((w) => ev.push({ t: w.t0, type: 'whoosh', dur: w.dur }));
    ev.push({ t: s(10).start - 0.15, type: 'wind', dur: s(10).hold + 0.2 });
    ev.push({ t: s(18).start, type: 'swell', dur: s(18).hold + TRANS });
    ev.push({ t: s(19).start, type: 'dropout' }, { t: s(20).start, type: 'resolve' });
    SHOTS.forEach((x) => { if (x.punch) ev.push({ t: x.start + 2 * BEAT, type: 'punch' }); });
    ev.sort((a, b) => a.t - b.t);
    return { fps: FPS, bpm: window.TIMING.BPM, beat: BEAT, trans: TRANS, total: TOTAL, frames: FRAMES, shots: SHOTS.map((x) => ({ id: x.id, act: x.act, scene: x.scene, text: x.text, counter: x.counter, words: x.words, formula: +x.formula.toFixed(3), beats: x.beats, hold: +x.hold.toFixed(4), start: +x.start.toFixed(4), end: +x.end.toFixed(4) })), events: ev.map((e) => ({ ...e, t: +e.t.toFixed(4) })) };
  }

  // ---------------- boot ----------------
  async function boot() {
    await Promise.all([
      document.fonts.load('800 100px Assistant', 'אב'), document.fonts.load('300 100px Assistant', 'אב'), document.fonts.load('700 100px Assistant', 'אב'),
      document.fonts.load('400 100px Anton', 'A1'), document.fonts.load('200 100px Oswald', 'A'), document.fonts.load('300 100px Oswald', 'A'), document.fonts.load('600 100px PlexMono', 'A1'),
    ]);
    await document.fonts.ready;
    await Promise.all([...document.images].map((im) => im.decode().catch(() => {})));
    // preload grain + whip sprites
    await Promise.all(['grain_0', 'grain_1', 'grain_2', 'grain_3', 'cloud_s0', 'cloud_s1', 'cloud_s2', 'cloud_w0', 'cloud_w1', 'cloud_w2'].map((n) => { const im = new Image(); im.src = `../assets/img/${n}.png`; return im.decode().catch(() => {}); }));
    SHOTS.forEach((s) => { const t = TXT[s.id]; if (t && s.layout !== 'end') { t.style.visibility = 'visible'; fitText(s, t); t.style.visibility = ''; } });
    window.FIT = FIT;
    window.CUES = cues();
    window.seek(0, 0);
    window.READY = true;
  }
  window.seek = function (t, frame) { tl.seek(Math.min(t, TOTAL), false); procedural(t, frame == null ? Math.round(t * FPS) : frame); };
  window.FMT = FMT;
  boot();
})();
