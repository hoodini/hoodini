/* =====================================================================
   "יש לי תאריך עברי בתוך Claude Code" — Yuval's real footage, edited as ONE kit film (yuv-edit v2).
   The footage is a plate drawn inside seek(t): screen recording on the Phoenix Ink night stage, face full-bleed.
   Plates change SHAPE between screen and face (panel <-> full frame), screen jump cuts PUSH, face jump cuts PUNCH.
   B-roll is drawn in code and explains exactly what is being said (status line, mod types, zmanim, tokens, API).
   Every event hangs on a spoken word (data.json anchors, output time). 60 fps, 6-subframe motion blur.
   ===================================================================== */
import { clamp, lerp, inv, out3, in3, io3, spring, sk, rgba, INK, FT, rr, rrc, circle, nightSky, markerPaint, gradPaint, mountFilm, rnd } from '../../src/core.js';
import { card, neonRing, slamWords, popType, GLOW } from '../../src/ui.js';
import D from './data.json';

const A = D.A, B = D.B, DUR = D.DUR, W1 = 1920, H1 = 1080;
const WHITE = '#FFFFFF', GOLD = INK.gold, PINK = INK.pink, NIGHT = INK.night, NIGHT2 = INK.night2, NIGHT3 = INK.night3;
const Q = new URLSearchParams(location.search);
const FRAMES = Q.get('frames') || 'file:///home/user/edit_yuv/v2/frames/';
const MATTES = Q.get('mattes') || 'file:///home/user/edit_yuv/v2/mattes/';
const beatPulse = t => Math.exp(-((((t % B) + B) % B) / B) * 5);
const pop = (t, t0, w = 20, z = 0.5) => clamp(spring(t - t0, w, z), 0, 1.25);

/* ---------------- footage: lazily decoded frames, an LRU so memory stays flat ---------------- */
const IMG = new Map(), MAT = new Map();
const pad = n => String(n).padStart(6, '0');
function load(map, url, key) {
  if (map.has(key)) { const v = map.get(key); map.delete(key); map.set(key, v); return v.p; }
  const im = new Image(); im.src = url; const p = im.decode().then(() => im).catch(() => null);
  map.set(key, { im, p }); if (map.size > 120) map.delete(map.keys().next().value);
  return p;
}
const get = (map, key) => { const v = map.get(key); return v && v.im.complete && v.im.naturalWidth ? v.im : null; };
const PL = D.plates;
function plateAt(t) { let lo = 0, hi = PL.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (PL[m].t0 <= t) lo = m; else hi = m - 1; } return lo; }
const srcIdx = (p, t) => clamp(Math.round((p.in + clamp(t - p.t0, 0, p.dur)) * 30), Math.round(p.in * 30), Math.min(5423, Math.round((p.in + p.dur) * 30) - 1));  // 5423 = last decodable source frame
const BEHIND = [[A.faces - 0.3, A.faces_end], [A.mods_now - 0.25, A.mods_now_end]];
// the render driver calls prepare(t) before each frame: decode every frame (and matte) the subframes will touch
window.prepare = async (t, n = 6, shutter = 0.5, fps = 60) => {
  const need = [];
  for (let i = 0; i < n; i++) {
    const ts = Math.max(0, t - shutter / fps / 2 + shutter / fps * (i + 0.5) / n);
    const k = plateAt(ts), p = PL[k];
    need.push(load(IMG, FRAMES + pad(srcIdx(p, ts)) + '.jpg', srcIdx(p, ts)));
    if (k > 0) { const q = PL[k - 1]; need.push(load(IMG, FRAMES + pad(srcIdx(q, q.t0 + q.dur)) + '.jpg', srcIdx(q, q.t0 + q.dur))); }
    if (BEHIND.some(([a, b]) => ts >= a && ts < b)) need.push(load(MAT, MATTES + pad(srcIdx(p, ts)) + '.png', srcIdx(p, ts)));
  }
  const last = PL[PL.length - 1]; need.push(load(IMG, FRAMES + pad(srcIdx(last, last.t0 + last.dur)) + '.jpg', srcIdx(last, last.t0 + last.dur)));
  await Promise.all(need);
};

/* ---------------- geometry: where the plate lives ---------------- */
const FULL = { cx: 960, cy: 540, w: 1920, h: 1080, r: 0 };
const PANEL = { cx: 960, cy: 486, w: 1575, h: 886, r: 40 };          // screen stage, leaves the caption band clear
const SPLIT = { cx: 660, cy: 486, w: 1080, h: 608, r: 44 };          // plate as a card on the left, headline on the right
const lerpR = (a, b, u) => ({ cx: lerp(a.cx, b.cx, u), cy: lerp(a.cy, b.cy, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u), r: lerp(a.r, b.r, u) });
const home = p => (p.kind === 'face' ? FULL : PANEL);
// title splits: the plate becomes a card on the left while the headline owns the right
const SPLITS = [[A.plugins - 0.2, A.eq_end], [A.nodrama - 0.2, A.verdict_end]];
function plateRect(t) {
  const k = plateAt(t), p = PL[k], q = k > 0 ? PL[k - 1] : p;
  let R = home(p);
  if (q !== p && q.kind !== p.kind) R = lerpR(home(q), home(p), clamp(spring(t - p.t0, 9, 0.9), 0, 1.05));
  for (const [a, b] of SPLITS) {
    const u = clamp(spring(t - a, 10, 0.78), 0, 1.05) * (1 - clamp(spring(t - b + 0.25, 11, 0.9), 0, 1));
    if (u > 0.0005) R = lerpR(R, SPLIT, u);
  }
  if (t >= A.end) R = lerpR(R, { cx: 560, cy: 460, w: 520, h: 520, r: 260 }, clamp(spring(t - A.end, 8, 0.85), 0, 1.02)); // -> avatar
  return R;
}
// screen camera: zoom rects (source-normalised), each key springs in (critically damped, log space for size)
const ZK = D.zooms;
function zoomAt(t) {
  const keys = [[-1, [0, 0, 1, 1]], ...ZK.map(z => [z.t, z.rect])];
  const sq = r => { const s = Math.max(r[2], r[3]), cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2; return [cx, cy, Math.log(s)]; };
  const comp = j => sk(t, keys.map(([tk, r]) => [tk, sq(r)[j]]), 7.5, 1);
  let cx = comp(0), cy = comp(1), s = Math.exp(comp(2)); s = clamp(s, 0.3, 1);
  cx = clamp(cx, s / 2, 1 - s / 2); cy = clamp(cy, s / 2, 1 - s / 2);
  return [cx - s / 2, cy - s / 2, s];
}

/* ---------------- the edit layer: impulses (camera punches), flashes ---------------- */
const CUTS = PL.filter((p, i) => i > 0 && p.cut).map(p => p.t0);
const IMPS = [...CUTS.map(t => [t, 1]), [A.hook_date, 2], [A.mod - 0.1, 3], [A.what, 3], [A.live, 1], [A.status, 1], [A.toast, 2],
  [A.terminal, 1], [A.desktop, 1], [A.plugins, 2], [A.faces, 2], [A.pray, 2], [A.shabbat, 1], [A.tokens, 2], [A.api, 2],
  [A.explode, 3], [A.mods_now, 2], [A.ch2, 3], [A.nice, 2], [A.read, 1], [A.end, 2]].sort((a, b) => a[0] - b[0]);
function camAt(t) {
  let z = 0, sx = 0, sy = 0, rot = 0;
  for (const [p, st] of IMPS) {
    const u = t - p; if (u < 0) break; if (u > 0.9) continue;
    z += (st >= 3 ? 0.06 : st >= 2 ? 0.035 : 0.018) * Math.exp(-u / 0.16);
    if (st >= 2) { const a = (st >= 3 ? 12 : 6) * Math.exp(-u / 0.11); sx += a * Math.sin(u * 119.4 + p * 7); sy += a * Math.cos(u * 144.5 + p * 3); rot += (st >= 3 ? 0.01 : 0.005) * Math.exp(-u / 0.12) * Math.sin(u * 69.1 + p); }
  }
  return { z, sx, sy, rot };
}
function camApply(x, c) { const k = 1 + c.z + 2 * Math.max(Math.abs(c.sx), Math.abs(c.sy)) / 1080 + Math.abs(c.rot) * 1.8; x.translate(960 + c.sx, 540 + c.sy); x.rotate(c.rot); x.scale(k, k); x.translate(-960, -540); }
const FLASH = [A.mod - 0.1, A.what, A.explode, A.ch2];
function flash(x, t) { let a = 0; for (const p of FLASH) { const u = t - p; if (u >= 0 && u < 0.14) a = Math.max(a, 0.45 * Math.exp(-u / 0.032)); } if (a > 0.01) { x.fillStyle = rgba(WHITE, a); x.fillRect(0, 0, W1, H1); } }

/* ---------------- drawing the plate ---------------- */
function drawSource(x, p, t, R, opt = {}) {
  const im = get(IMG, srcIdx(p, t)); if (!im) return;
  let sx, sy, sw, sh;
  if (p.kind === 'screen') { const [zx, zy, s] = zoomAt(t); sx = zx * 1920; sy = zy * 1080; sw = s * 1920; sh = s * 1080; }
  else { const s = p.punch || 1, [ax, ay] = p.anchor || [0.5, 0.3]; sw = 1920 / s; sh = 1080 / s; sx = ax * (1920 - sw); sy = ay * (1080 - sh); }
  // cover-fit the source crop into R (R can be any aspect while it morphs)
  const ra = R.w / R.h, ca = sw / sh;
  if (ra > ca) { const nh = sw / ra; sy += (sh - nh) / 2; sh = nh; } else { const nw = sh * ra; sx += (sw - nw) / 2; sw = nw; }
  x.drawImage(im, sx, sy, sw, sh, R.cx - R.w / 2 + (opt.dx || 0), R.cy - R.h / 2, R.w, R.h);
}
function plate(x, t) {
  const k = plateAt(t), p = PL[k], R = plateRect(t);
  if (R.w < W1 - 1 || R.h < H1 - 1) {   // a card on the stage: deep night shadow + thin rim
    card(x, R.cx, R.cy, R.w, R.h, R.r, { fill: NIGHT, shadow: 'rgba(5,4,20,.65)', depth: 0.9 });
  }
  x.save(); rrc(x, R.cx, R.cy, R.w, R.h, R.r); x.clip();
  const q = k > 0 ? PL[k - 1] : null, u = t - p.t0;
  if (q && p.cut && q.kind === 'screen' && p.kind === 'screen' && u < 0.32) {
    // screen jump cut: PUSH (RTL: the new page arrives from the left, the old one leaves to the right)
    const e = io3(u / 0.32);
    drawSource(x, q, q.t0 + q.dur - 0.001, R, { dx: e * R.w });
    drawSource(x, p, t, R, { dx: -(1 - e) * R.w });
  } else drawSource(x, p, t, R);
  x.restore();
  if (R.r > 1) { x.save(); rrc(x, R.cx, R.cy, R.w, R.h, R.r); x.lineWidth = 2; x.strokeStyle = 'rgba(255,255,255,.14)'; x.stroke(); x.restore(); }
}
// person matte on top of a headline (text behind the subject)
const mcv = document.createElement('canvas'); mcv.width = W1; mcv.height = H1; const mx = mcv.getContext('2d');
function subjectOver(x, t) {
  const p = PL[plateAt(t)], im = get(IMG, srcIdx(p, t)), mt = get(MAT, srcIdx(p, t)); if (!im || !mt) return;
  mx.setTransform(1, 0, 0, 1, 0, 0); mx.clearRect(0, 0, W1, H1); mx.globalCompositeOperation = 'source-over';
  drawSource(mx, p, t, FULL); mx.globalCompositeOperation = 'destination-in';
  const s = p.punch || 1, [ax, ay] = p.anchor || [0.5, 0.3], sw = 1920 / s, sh = 1080 / s;
  mx.drawImage(mt, ax * (1920 - sw), ay * (1080 - sh), sw, sh, 0, 0, W1, H1); mx.globalCompositeOperation = 'source-over';
  x.drawImage(mcv, 0, 0);
}

/* ---------------- shared UI pieces ---------------- */
const DATE = 'כ״ד בחשון תשפ״ז';
function headline(x, t, words, times, tOut, opt = {}) {
  slamWords(x, t, words, 960, opt.y ?? 150, opt.size ?? 120, opt.ltr ? FT.en : FT.he, opt.color ?? WHITE, times, tOut,
    { right: opt.right ?? 1800, maxW: opt.maxW ?? 1500, marker: opt.marker != null ? { i: opt.marker, paint: GOLD } : null, ltr: opt.ltr });
}
function mono(x, s, w = 600) { x.font = `${w} ${s}px "JetBrains Mono", monospace`; }
function terminal(x, cx, cy, w, h, t, opt = {}) {   // a Claude Code window drawn in code
  card(x, cx, cy, w, h, 34, { fill: '#0B0A1F', shadow: 'rgba(5,4,20,.7)', depth: 1, stroke: 'rgba(255,255,255,.12)' });
  x.save(); rrc(x, cx, cy, w, h, 34); x.clip();
  const L = cx - w / 2, T = cy - h / 2;
  x.fillStyle = '#14123A'; x.fillRect(L, T, w, 56);
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => { circle(x, L + 34 + i * 26, T + 28, 8); x.fillStyle = c; x.fill(); });
  mono(x, 22, 500); x.fillStyle = INK.onNight3; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText(opt.title || 'Claude Code', L + 120, T + 36);
  mono(x, 24, 500);
  (opt.lines || []).forEach((ln, i) => { x.fillStyle = ln[1] || 'rgba(207,205,235,.55)'; x.fillText(ln[0], L + 44, T + 110 + i * 42); });
  x.restore();
}
function statusBar(x, L, T, w, h, t, items) {   // the status line under the prompt
  x.save(); rr(x, L, T, w, h, h / 2); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill();
  mono(x, 24, 600); x.direction = 'ltr'; x.textAlign = 'left'; x.fillStyle = '#7CE3A1'; x.fillText('▸▸ auto mode on', L + 26, T + h / 2 + 8);
  x.fillStyle = 'rgba(207,205,235,.6)'; x.fillText('(shift+tab to cycle)', L + 270, T + h / 2 + 8);
  let xr = L + w - 26;
  for (const it of items) xr = it(xr, T + h / 2) - 22;
  x.restore();
}
// a gold-marked RTL chip that types in (the Hebrew date, the zmanim, ...)
function goldChip(x, t, t0, xr, cy, text, size = 30) {
  const s = pop(t, t0, 22, 0.5); if (s <= 0.01) return xr;
  x.save(); x.font = FT.textB(size); x.direction = 'rtl'; const tw = x.measureText(text).width, w = tw + 40, h = size * 1.5;
  x.translate(xr - w / 2, cy); x.scale(s, s);
  rrc(x, 0, 0, w, h, 12); x.fillStyle = markerPaint(x, GOLD, -h / 2, h); x.fill();
  x.restore();
  const times = Array.from(text).map((_, i) => t0 + 0.1 + i * 0.035);
  popType(x, t, text, xr - 20, cy + size * 0.36, FT.textB, size, INK.ink, times);
  return xr - w;
}
function chip(x, t, t0, cx, cy, text, opt = {}) {   // Phoenix Ink chip: pink wash, deep pink text
  const s = pop(t, t0, 20, 0.5) * (opt.out != null ? 1 - in3(inv(opt.out, opt.out + 0.2, t)) : 1); if (s <= 0.01) return;
  const he = /[֐-׿]/.test(text), f = he ? FT.textB(opt.size || 30) : `700 ${opt.size || 28}px "JetBrains Mono", monospace`;
  x.save(); x.font = f; const tw = x.measureText(text).width, w = tw + 56, h = (opt.size || 30) * 1.9;
  x.translate(cx, cy); x.scale(s, s);
  if (opt.glow) neonRing(x, 0, 0, w, h, h / 2, t * 1.05, { lw: 3, glow: 14, power: 0.6 + 0.4 * beatPulse(t) });
  rrc(x, 0, 0, w, h, h / 2); x.fillStyle = opt.fill || INK.pinkWash; x.fill();
  x.fillStyle = opt.ink || INK.pinkDeep; x.textAlign = 'center'; x.direction = he ? 'rtl' : 'ltr'; x.fillText(text, 0, (opt.size || 30) * 0.36);
  x.restore();
}
function codeChip(x, t, t0, tOut, cx, cy, text, prompt = '$') {   // a command as typed, night glass, caret
  const s = pop(t, t0, 22, 0.5) * (1 - in3(inv(tOut - 0.2, tOut, t))); if (s <= 0.01) return;
  mono(x, 46, 600); x.direction = 'ltr';
  const full = prompt + ' ' + text, w = x.measureText(full).width + 90, h = 100;
  x.save(); x.translate(cx, cy); x.scale(s, s);
  card(x, 0, 0, w, h, 34, { fill: 'rgba(20,18,58,.95)', shadow: 'rgba(5,4,20,.7)', depth: 0.8, stroke: 'rgba(255,255,255,.16)' });
  x.textAlign = 'left'; x.fillStyle = PINK; x.fillText(prompt, -w / 2 + 45, 16);
  const pw = x.measureText(prompt + ' ').width, n = clamp(Math.floor((t - t0 - 0.15) / 0.045), 0, text.length);
  x.fillStyle = WHITE; x.fillText(text.slice(0, n), -w / 2 + 45 + pw, 16);
  if (n < text.length || Math.floor(t * 2.5) % 2 === 0) { const cw = x.measureText(text.slice(0, n)).width; x.fillStyle = INK.goldFlat; x.fillRect(-w / 2 + 49 + pw + cw, -22, 5, 48); }
  x.restore();
}
// a full-frame scene that grows out of a seed rect and contracts back into it (shape change, never a fade)
function scene(x, t, a, b, seed, fn, opt = {}) {
  if (t < a - 0.01 || t > b + 0.6) return;
  const u = clamp(spring(t - a, opt.w ?? 9, 0.86), 0, 1.03) * (1 - clamp(spring(t - b, 10, 0.95), 0, 1));
  if (u <= 0.002) return;
  const R = lerpR(seed, FULL, u), r = lerp(seed.r ?? 40, 0, u);
  x.save(); rrc(x, R.cx, R.cy, R.w, R.h, r); x.clip(); fn(x, t, u); x.restore();
}

/* ---------------- B-roll scenes ---------------- */
// HOOK: the status line with the Hebrew date, then it hands over to the real screen
function hook(x, t) {
  scene(x, t, -1, A.hook_end - 0.35, PANEL, (x, t) => {
    nightSky(x, W1, H1, t, { side: 'right' });
    const push = 1 + 0.05 * clamp(t / A.hook_end);
    x.save(); x.translate(960, 560); x.scale(push, push); x.translate(-960, -560);
    terminal(x, 960, 560, 1300, 560, t, { title: 'Claude Code · v2.1.289', lines: [['● It passed validation. Next I\'m writing a test.'], ['● Both tests pass. Last step is a type-check.'], ['  Ran 3 shell commands'], ['> /plugin-authoring', '#FFFFFF']] });
    statusBar(x, 340, 740, 1240, 62, t, [xr => goldChip(x, t, A.hook_date, xr, 771, DATE, 30)]);
    if (t > A.hook_date) neonRing(x, 1330, 771, 290, 58, 18, t * 1.2, { lw: 3, glow: 16, power: 0.5 + 0.5 * beatPulse(t) });
    x.restore();
    headline(x, t, ['משהו', 'מוזר', 'קורה'], [A.hook_strange, A.hook_moozar, A.hook_moozar + 0.35], A.hook_date - 0.25, { y: 190, size: 140 });
    headline(x, t, ['תאריך', 'עברי', 'בתוך', 'Claude Code'], [A.hook_date, A.hook_date + 0.3, A.hook_inside, A.hook_inside + 0.25], A.hook_end - 0.6, { y: 190, size: 120, marker: 1 });
  });
}
// MOD: pink punch page, giant MOD
function modPage(x, t) {
  const a = A.mod - 0.12, b = PL[3].t0 - 0.05;
  scene(x, t, a, b, { cx: 960, cy: 540, w: 40, h: 40, r: 20 }, (x, t) => {
    x.fillStyle = PINK; x.fillRect(0, 0, W1, H1);
    const s = pop(t, a, 18, 0.5);
    x.save(); x.font = FT.en(420); x.textAlign = 'center'; x.direction = 'ltr'; x.fillStyle = 'rgba(255,255,255,.16)';
    x.translate(960, 640); x.scale(s, s); x.fillText('MOD', 0, 0); x.restore();
    headline(x, t, ['זה', 'נקרא', 'מוד'], [a, a + 0.12, A.mod], A.how - 0.2, { y: 600, size: 200, right: 1450, marker: 2 });
    headline(x, t, ['איך', 'עושים', 'את', 'זה?'], [A.how, A.how + 0.25, PL[2].t0 + 0.05, PL[2].t0 + 0.25], b - 0.2, { y: 600, size: 170, right: 1500 });
  }, { w: 11 });
}
// TYPES: what a mod can be, each piece appears as he names it
function modTypes(x, t) {
  const a = A.what - 0.08, b = A.types_end;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightSky(x, W1, H1, t, { side: 'left' });
    x.save(); x.font = FT.en(520); x.fillStyle = 'rgba(255,255,255,.05)'; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('01', 40, 760); x.restore();
    const mv = clamp(spring(t - A.live + 0.1, 9, 0.9), 0, 1);           // headline lifts away once the demo starts
    x.save(); x.translate(0, -mv * 60); x.scale(1, 1);
    headline(x, t, ['מה', 'זה', 'מוד?'], [a, a + 0.12, a + 0.25], null, { y: 175 - mv * 30, size: 140 - mv * 40, marker: 2 });
    x.restore();
    const enter = pop(t, A.live - 0.15, 12, 0.7);
    if (enter <= 0.01) return;
    x.save(); x.translate(860, 560); x.scale(enter, enter); x.translate(-860, -560);
    terminal(x, 860, 560, 1180, 600, t, { lines: [['> make the status line show the hebrew date', '#FFFFFF'], ['● Writing statusline hook…'], ['● Hot-reloading mod: hebrew-date']] });
    // live pane slides out of the window's left edge
    const lp = clamp(spring(t - A.live, 12, 0.7), 0, 1.02);
    if (lp > 0.01) { x.save(); rr(x, 270, 300, 300 * lp, 520, 26); x.fillStyle = '#1A1846'; x.fill(); x.clip();
      mono(x, 20, 500); x.fillStyle = INK.cyan; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('LIVE · tool calls', 290, 340);
      for (let i = 0; i < 7; i++) { const on = t > A.live + 0.3 + i * 0.35; x.fillStyle = on ? 'rgba(207,205,235,.8)' : 'rgba(207,205,235,.2)'; x.fillText(['Read  plugin.json', 'Bash  mkdir hooks', 'Edit  statusline.js', 'Bash  npm test', 'Read  hebcal.js', 'Edit  hint.js', 'Bash  type-check'][i], 290, 390 + i * 54); }
      x.restore(); }
    // band above the prompt
    const bp = clamp(spring(t - A.band, 14, 0.7), 0, 1.02);
    if (bp > 0.01) { x.save(); rr(x, 640, 700 - 70 * bp, 760, 52, 26); x.fillStyle = 'rgba(93,228,233,.14)'; x.fill(); mono(x, 22, 600); x.fillStyle = INK.cyan; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('⎇ main · 3 files changed', 670, 734 - 70 * bp); x.restore(); }
    // status line with a ticking token counter
    const sp = clamp(spring(t - A.status, 14, 0.7), 0, 1.02);
    if (sp > 0.01) { x.save(); x.globalAlpha = 1; rr(x, 300, 860 - 6, 1120 * sp, 50, 25); x.fillStyle = 'rgba(255,255,255,.07)'; x.fill(); x.clip();
      mono(x, 22, 600); x.direction = 'ltr'; x.textAlign = 'left'; x.fillStyle = '#7CE3A1'; x.fillText('Opus 5.5', 324, 887);
      x.fillStyle = INK.onNight2; x.fillText('ctx ' + Math.round(lerp(12, 48, clamp((t - A.status) / 6))) + '%', 470, 887);
      x.restore(); goldChip(x, t, A.status + 0.2, 1410, 879, DATE, 24); }
    // toast
    const tp = pop(t, A.toast, 20, 0.5);
    if (tp > 0.01) { x.save(); x.translate(1250, 340); x.scale(tp, tp); card(x, 0, 0, 340, 96, 26, { fill: WHITE, depth: 0.6 });
      x.fillStyle = '#28C840'; circle(x, -130, 0, 16); x.fill(); x.font = FT.textB(28); x.fillStyle = INK.ink; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('Task finished ✓', -100, 10); x.restore(); }
    x.restore();
    // labels on the right, as he names them
    [['Live pane', A.live], ['Band', A.band], ['Status line', A.status], ['Toast', A.toast]].forEach(([s, t0], i) => chip(x, t, t0 + 0.05, 1670, 330 + i * 120, s, { size: 28 }));
  });
}
// WHERE: terminal or desktop
function where(x, t) {
  const a = A.terminal - 0.2, b = A.types2_end;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightSky(x, W1, H1, t, { side: 'right' });
    headline(x, t, ['בטרמינל', 'או', 'בדסקטופ'], [A.terminal, A.desktop - 0.35, A.desktop], null, { y: 185, size: 140, marker: 2 });
    const s1 = pop(t, A.terminal, 16, 0.6), s2 = pop(t, A.desktop, 16, 0.6);
    if (s1 > 0.01) { x.save(); x.translate(1330, 600); x.scale(s1, s1); terminal(x, 0, 0, 640, 400, t, { title: 'Terminal', lines: [['$ claude', '#FFFFFF'], ['● mods: hebrew-date']] }); statusBar(x, -300, 140, 600, 44, t, [xr => goldChip(x, t, A.terminal + 0.3, xr, 162, DATE, 20)]); x.restore(); }
    if (s2 > 0.01) { x.save(); x.translate(590, 600); x.scale(s2, s2); card(x, 0, 0, 640, 400, 34, { fill: INK.cloud, depth: 0.8 });
      x.fillStyle = '#E9E7F3'; x.fillRect(-320, -200, 640, 50); x.font = FT.textB(24); x.fillStyle = INK.ink; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('Claude · Code tab', -280, -167);
      rr(x, -280, 140, 560, 40, 20); x.fillStyle = WHITE; x.fill(); goldChip(x, t, A.desktop + 0.3, 270, 160, DATE, 20); x.restore(); }
  });
}
// ZMANIM: the same status line again, now listing what he asked for
function zmanim(x, t) {
  const a = A.pray - 0.3, b = A.pray_end;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightSky(x, W1, H1, t, { side: 'right' });
    headline(x, t, ['כל', 'מה', 'שאני', 'רוצה'], [A.pray, A.pray + 0.12, A.pray + 0.24, A.pray + 0.36], null, { y: 170, size: 130, marker: 3 });
    terminal(x, 960, 590, 1300, 520, t, { lines: [['> remind me of prayer times in the status line', '#FFFFFF'], ['● Adding zmanim to the hebrew-date mod…']] });
    const items = [['זמן תפילה', A.pray], ['חצות', A.chatzot], ['תיקון חצות', A.tikun], ['ערבית', A.arvit], ['כניסת שבת', A.shabbat]];
    statusBar(x, 330, 760, 1260, 62, t, [xr => goldChip(x, t, a, xr, 791, DATE, 26)]);
    let xr = 1560;
    items.forEach(([s, t0], i) => { const cx = 1520 - i * 230; chip(x, t, t0, cx, 900, s, { size: 30, fill: WHITE, ink: INK.ink }); });
  });
}
// TOKENS: a counter in the status line (labelled as an example; no invented claim)
function tokens(x, t) {
  const a = A.tokens - 0.25, b = A.tokens_end;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightSky(x, W1, H1, t, { side: 'left' });
    headline(x, t, ['כמה', 'טוקנים?'], [A.tokens - 0.25, A.tokens], null, { y: 190, size: 150, marker: 1 });
    terminal(x, 960, 580, 1300, 520, t, { lines: [['> how many tokens would this cost tomorrow?', '#FFFFFF'], ['● Estimating from today\'s sessions…']] });
    statusBar(x, 330, 760, 1260, 62, t, [xr => { const n = Math.round(lerp(0, 184000, clamp(spring(t - A.tokens - 0.2, 2.2, 1), 0, 1)));
      mono(x, 28, 700); x.direction = 'ltr'; x.textAlign = 'right'; x.fillStyle = INK.goldFlat; x.fillText(n.toLocaleString('en-US') + ' tokens', xr, 801); return xr - 300; }]);
    chip(x, t, A.tokens + 0.6, 1680, 900, 'דוגמה בלבד', { size: 24, fill: 'rgba(255,255,255,.1)', ink: INK.onNight2 });
  });
}
// API vs SUBSCRIPTION
function apiVsSub(x, t) {
  const a = A.api - 0.25, b = A.api_end;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightSky(x, W1, H1, t, { side: 'right' });
    headline(x, t, ['API', 'או', 'מנוי?'], [A.api - 0.1, A.sub - 0.4, A.sub], null, { y: 190, size: 150, marker: 2 });
    const tilt = Math.sin(t * 1.6) * 0.05 * clamp(t - A.sub, 0, 1) + 0.06 * (1 - clamp(spring(t - A.sub, 6, 0.6), 0, 1)) * (t > A.api ? 1 : 0);
    x.save(); x.translate(960, 600); x.rotate(tilt);
    x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(-520, -4, 1040, 8);
    const s1 = pop(t, A.api, 16, 0.6), s2 = pop(t, A.sub, 16, 0.6);
    if (s1 > 0.01) { x.save(); x.translate(330, -150); x.scale(s1, s1); card(x, 0, 0, 380, 240, 40, { fill: NIGHT3, depth: 0.9, stroke: PINK, strokeW: 4 }); x.font = FT.en(96); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText('API', 0, 20); mono(x, 26, 600); x.fillStyle = INK.pinkSoft; x.fillText('pay per token', 0, 80); x.restore(); }
    if (s2 > 0.01) { x.save(); x.translate(-330, -150); x.scale(s2, s2); card(x, 0, 0, 380, 240, 40, { fill: WHITE, depth: 0.9 }); x.font = FT.he(110); x.fillStyle = INK.ink; x.textAlign = 'center'; x.direction = 'rtl'; x.fillText('מנוי', 0, 30); x.font = FT.textB(26); x.fillStyle = INK.pinkDeep; x.fillText('Claude Max', 0, 84); x.restore(); }
    x.restore();
  });
}
// SKILLS -> MODS: skill cards burst out, one MOD card stays, then the iris closes onto the face
function skills(x, t) {
  const a = A.skills - 0.3, b = PL[12].t0 + 0.15;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightSky(x, W1, H1, t, { side: 'left' });
    const ex = clamp(spring(t - A.explode, 5, 0.9), 0, 1.2);
    for (let i = 0; i < 26; i++) {
      const ang = rnd(i) * Math.PI * 2, d = 120 + ex * (500 + rnd(i + 3) * 700), s = pop(t, a + 0.15 + i * 0.03, 18, 0.6) * (1 - 0.4 * ex);
      if (s <= 0.01) continue;
      const cx = 960 + Math.cos(ang) * d, cy = 520 + Math.sin(ang) * d * 0.62;
      x.save(); x.translate(cx, cy); x.rotate((rnd(i + 9) - 0.5) * 0.5 * (0.3 + ex)); x.scale(s, s);
      card(x, 0, 0, 190, 64, 32, { fill: i % 3 ? WHITE : INK.pinkWash, depth: 0.4 });
      mono(x, 22, 700); x.fillStyle = INK.ink; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText('SKILL.md', 0, 8); x.restore();
    }
    const m = pop(t, A.explode + 0.15, 14, 0.5);
    if (m > 0.01) { x.save(); x.translate(960, 520); x.scale(m, m); neonRing(x, 0, 0, 460, 150, 75, t * 1.3, { lw: 4, glow: 22 }); rrc(x, 0, 0, 460, 150, 75); x.fillStyle = PINK; x.fill(); x.font = FT.en(100); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText('MODS', 0, 36); x.restore(); }
    headline(x, t, ['כמו', 'הסקילים'], [A.skills - 0.2, A.skills], null, { y: 175, size: 140, marker: 1 });
  }, { w: 10 });
}
// CHAPTER 2: the verdict spread
function chapter2(x, t) {
  const a = A.ch2 - 0.05, b = A.ch2 + 1.25;
  scene(x, t, a, b, { cx: 1500, cy: 540, w: 60, h: 60, r: 30 }, (x, t) => {
    nightSky(x, W1, H1, t, { side: 'right' });
    x.save(); x.font = FT.en(560); x.fillStyle = 'rgba(255,255,255,.06)'; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('02', 60, 780); x.restore();
    mono(x, 30, 700); x.fillStyle = INK.pinkSoft; x.direction = 'ltr'; x.textAlign = 'right'; x.fillText('02 · VERDICT', 1800, 380);
    headline(x, t, ['שווה', 'את', 'זה?'], [a + 0.05, a + 0.2, a + 0.35], null, { y: 600, size: 210, marker: 2 });
  }, { w: 12 });
}
// headlines that go with the splits
function splitTitles(x, t) {
  headline(x, t, ['מוד', '=', 'פלאגין'], [A.plugins - 0.05, A.plugins + 0.2, A.plugins + 0.4], A.eq_end - 0.35, { y: 560, size: 170, right: 1840, maxW: 640, marker: 2 });
  headline(x, t, ['לא', 'דרמטי.'], [A.nodrama, A.drama], A.verdict_end - 0.3, { y: 470, size: 160, right: 1840, maxW: 640 });
  headline(x, t, ['אבל', 'נחמד.'], [A.nice - 0.4, A.nice], A.verdict_end - 0.3, { y: 650, size: 160, right: 1840, maxW: 640, marker: 1 });
}
function behindTitles(x, t) {
  headline(x, t, ['הפנים', 'של', 'קלוד'], [A.faces, A.faces + 0.45, A.faces + 0.7], A.faces_end - 0.3, { y: 420, size: 250, right: 1820, maxW: 1700, marker: 0 });
  headline(x, t, ['מודים.', 'עכשיו.'], [A.mods_now, A.mods_now + 0.3], A.mods_now_end - 0.3, { y: 400, size: 270, right: 1800, maxW: 1650, marker: 0 });
}
// chips over the screen plate
function overlays(x, t) {
  codeChip(x, t, A.update - 0.1, PL[4].t0 - 0.05, 960, 830, 'claude --update');
  codeChip(x, t, A.pa - 0.1, A.what - 0.1, 960, 830, '/plugin-authoring', '>');
  chip(x, t, A.hot, 960, 840, '↻  hot-reload · אוטומטי', { size: 30, glow: true, out: PL[6].t0 - 0.2 });
  // lower third (white card, pink bar), above the captions, RTL start = right
  const lt0 = A.lt, lt1 = A.lt + 3.6, s = clamp(spring(t - lt0, 12, 0.7), 0, 1.02) * (1 - in3(inv(lt1 - 0.25, lt1, t)));
  if (s > 0.01) { x.save(); const w = 560 * s, X = 1840 - w, Y = 760; x.beginPath(); x.rect(X - 30, Y - 40, w + 60, 220); x.clip();
    card(x, 1840 - 280, Y + 70, 560, 140, 40, { fill: WHITE, depth: 0.7 }); x.fillStyle = PINK; rr(x, 1840 - 22, Y + 26, 8, 88, 4); x.fill();
    x.direction = 'rtl'; x.textAlign = 'right'; x.font = FT.he(70); x.fillStyle = INK.ink; x.fillText('יובל אבידני', 1800, Y + 82);
    x.font = FT.textB(26); x.fillStyle = INK.ink2; x.fillText('AI Builder & Speaker · YUV.AI', 1800, Y + 120); x.restore(); }
  // CTA: the only glow ring in the film
  const c = pop(t, A.read - 0.15, 18, 0.5) * (1 - in3(inv(A.end - 0.2, A.end + 0.1, t)));
  if (c > 0.01) { x.save(); x.translate(1590, 300); x.scale(c, c); const w = 560, h = 124;
    neonRing(x, 0, 0, w, h, h / 2, t * 1.05, { lw: 4, glow: 24, power: 0.75 + 0.25 * beatPulse(t) });
    rrc(x, 0, 0, w, h, h / 2); x.fillStyle = PINK; x.fill(); x.font = FT.textB(48); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'rtl'; x.fillText('ספרו לי בתגובות ←', 0, 17);
    x.font = FT.textB(34); x.shadowColor = 'rgba(14,13,42,.85)'; x.shadowBlur = 20; x.fillText('איזה מוד הייתם בונים?', 0, 130); x.restore(); }
}
// END: the face becomes a round avatar with the glow ring, signature writes on
function endcard(x, t) {
  if (t < A.end) return;
  const u = t - A.end, R = plateRect(t);
  neonRing(x, R.cx, R.cy, R.w + 18, R.h + 18, (R.w + 18) / 2, t * 1.05, { lw: 4, glow: 18, power: clamp(u * 2) });
  headline(x, t, ['תמשיכו', 'לעוף', 'גבוה'], [A.end + 0.35, A.end + 0.55, A.end + 0.75], null, { y: 470, size: 150, right: 1800, maxW: 900, marker: 1 });
  const sk2 = io3(inv(A.end + 1.1, A.end + 2.6, t));
  x.save(); x.translate(1790, 650); x.rotate(-0.05); x.font = FT.hand(110); x.direction = 'rtl'; x.textAlign = 'right'; const sw = x.measureText('יובל אבידני').width;
  x.beginPath(); x.rect(-sw * sk2 - 10, -130, sw * sk2 + 20, 190); x.clip(); x.fillStyle = INK.goldFlat; x.fillText('יובל אבידני', 0, 0); x.restore();
  const ul = out3(inv(A.end + 2.6, A.end + 3.25, t)); x.strokeStyle = INK.gold[1]; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(1790, 690); x.lineTo(1790 - 520 * ul, 708); x.stroke();
  x.direction = 'ltr'; x.textAlign = 'right'; x.font = FT.en(56); x.fillStyle = PINK; x.fillText('YUV.AI', 1840, 1000);
  mono(x, 20, 700); x.fillStyle = INK.cyan; x.fillText("LET'S FLY HIGH", 1840, 1034);
  x.textAlign = 'left'; mono(x, 30, 600); x.fillStyle = INK.onNight2; x.fillText('yuv.ai', 80, 1020);
}

/* ---------------- kinetic captions (kit style): each word pops when spoken, the spoken word is gold ---------------- */
const CH = D.chunks;
function captions(x, t) {
  if (t >= A.end - 0.05) return;
  let c = null; for (const ch of CH) { if (t >= ch.t0 - 0.02 && t < ch.end) { c = ch; break; } } if (!c) return;
  const size = 58, y = 1018;
  x.save(); x.font = FT.textB(size); x.direction = 'rtl'; x.textAlign = 'left'; x.lineJoin = 'round';
  const ws = c.words.map(o => x.measureText(o.w).width), gap = size * 0.3, total = ws.reduce((p, q) => p + q, 0) + gap * (ws.length - 1);
  let pos = 960 + total / 2;
  c.words.forEach((o, i) => {
    const xl = pos - ws[i]; pos -= ws[i] + gap;
    if (t < o.t0 - 0.03) return;
    const s = clamp(spring(t - o.t0 + 0.03, 24, 0.5), 0, 1.2), cur = t < o.t1 + 0.05 && (i === c.words.length - 1 || t < c.words[i + 1].t0);
    const sc = (0.55 + 0.45 * s) * (cur ? 1.06 : 1) * (1 - in3(inv(c.end - 0.1, c.end, t))); if (sc <= 0.01) return;
    x.save(); x.translate(xl + ws[i] / 2, y - size * 0.35); x.scale(sc, sc); x.translate(-(xl + ws[i] / 2), -(y - size * 0.35));
    x.lineWidth = size * 0.17; x.strokeStyle = NIGHT; x.strokeText(o.w, xl, y);
    x.shadowColor = 'rgba(5,4,20,.5)'; x.shadowBlur = 14; x.shadowOffsetY = 5; x.fillStyle = cur ? INK.goldFlat : WHITE; x.fillText(o.w, xl, y); x.restore();
  });
  x.restore();
}
function progress(x, t) { const u = clamp(t / DUR); x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(0, 0, W1, 6); x.fillStyle = gradPaint(x, W1, 0, 0, 0, [PINK, INK.cyan]); x.fillRect(W1 * (1 - u), 0, W1 * u, 6); }

/* ---------------- the frame ---------------- */
function draw(x, t, L) {
  nightSky(x, W1, H1, t, { side: 'right' });
  x.save(); camApply(x, camAt(t));
  plate(x, t);
  if (BEHIND.some(([a, b]) => t >= a && t < b)) { behindTitles(x, t); subjectOver(x, t); }
  splitTitles(x, t); overlays(x, t);
  hook(x, t); modPage(x, t); modTypes(x, t); where(x, t); zmanim(x, t); tokens(x, t); apiVsSub(x, t); skills(x, t); chapter2(x, t);
  endcard(x, t);
  x.restore();
  flash(x, t); captions(x, t); progress(x, t);
}
mountFilm({ layouts: { h: { name: 'h', W: W1, H: H1 } }, draw, dur: DUR, clk: { B, BPM: D.BPM } });
