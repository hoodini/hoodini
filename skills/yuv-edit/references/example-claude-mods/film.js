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
import RECT from './rects.json';
import { drawPersp, worldOf, toScreen } from './persp.js';   // real 3D perspective (WebGL quad + depth of field)   // DOM rects of the real pages (device px), captured with the screenshots

const A = D.A, B = D.B, DUR = D.DUR, W1 = 1920, H1 = 1080;
const WHITE = '#FFFFFF', GOLD = INK.gold, PINK = INK.pink, NIGHT = INK.night, NIGHT2 = INK.night2, NIGHT3 = INK.night3;
const Q = new URLSearchParams(location.search);
const FRAMES = Q.get('frames') || 'file:///home/user/edit_yuv/v2/frames/';
const MATTES = Q.get('mattes') || 'file:///home/user/edit_yuv/v2/mattes/';
// Yuval prefers the light edition: Paper/Cloud stage with soft pink / violet / orange glows (29.10.2026)
function paperSky(x, W, H, t = 0, { side = 'right' } = {}) {
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, INK.cloud); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const glow = (cx, cy, r, c) => { const q = x.createRadialGradient(cx, cy, 0, cx, cy, r); q.addColorStop(0, c); q.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = q; x.fillRect(0, 0, W, H); };
  const sx = side === 'left' ? 0.22 : 0.78;
  glow(W * sx, H * 0.42, Math.max(W, H) * 0.45, 'rgba(255,46,160,.10)');
  glow(W * (1 - sx), H * 0.15, Math.max(W, H) * 0.38, 'rgba(139,108,255,.09)');
  glow(W * 0.5, H * 1.15, Math.max(W, H) * 0.6, 'rgba(255,143,58,.10)');
  for (let i = 0; i < 70; i++) { const px = rnd(i) * W, py = rnd(i + 99) * H, a = 0.10 + 0.08 * Math.sin(t * 1.2 + i * 2.1); x.fillStyle = `rgba(255,46,160,${a.toFixed(3)})`; x.beginPath(); x.arc(px, py, 1.6, 0, 7); x.fill(); }
}
// the glow ring (Yuval: "more of that glow, it's stunning"): conic glow stops, soft halo from stacked strokes
function softRing(x, cx, cy, w, h, r, t, power = 1) {
  if (w < 2 || h < 2 || power <= 0.01) return;
  const g = x.createConicGradient(t * 0.9, cx, cy); GLOW.forEach((c, i) => g.addColorStop(i / (GLOW.length - 1), c));
  x.save(); x.strokeStyle = g;
  [[34, 0.07], [22, 0.12], [13, 0.22], [7, 0.45], [3.5, 1]].forEach(([lw, a]) => { x.globalAlpha = a * power; x.lineWidth = lw; rrc(x, cx, cy, w + 6, h + 6, r + 3); x.stroke(); });
  x.restore();
}
const DEG = Math.PI / 180;
function polyPath(x, P) { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); }
function shadowPoly(x, P, a = 0.24) { x.save(); x.shadowColor = `rgba(255,46,160,${a})`; x.shadowBlur = 90; x.shadowOffsetY = 40; polyPath(x, P); x.fillStyle = 'rgba(255,255,255,.98)'; x.fill(); x.restore(); }
function glowPoly(x, P, t, power = 1) {   // the glow ring, following the card in perspective
  const cx = P.reduce((s, p) => s + p[0], 0) / 4, cy = P.reduce((s, p) => s + p[1], 0) / 4, g = x.createConicGradient(t * 0.9, cx, cy);
  GLOW.forEach((c, i) => g.addColorStop(i / (GLOW.length - 1), c));
  x.save(); x.strokeStyle = g; x.lineJoin = 'round';
  [[34, 0.07], [22, 0.12], [13, 0.22], [7, 0.45], [3.5, 1]].forEach(([lw, al]) => { x.globalAlpha = al * power; x.lineWidth = lw; polyPath(x, P); x.stroke(); });
  x.restore();
}
const beatPulse = t => Math.exp(-((((t % B) + B) % B) / B) * 5);
const pop = (t, t0, w = 20, z = 0.5) => clamp(spring(t - t0, w, z), 0, 1.25);

/* ---------------- footage: lazily decoded frames, an LRU so memory stays flat ---------------- */
const IMG = new Map(), MAT = new Map();   // LRU of decoded frames (pages are re-touched every frame, so they stay)
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
const AVATAR = 5372;   // frame where Yuval looks straight into the lens (picked from a grid of the last 4 s)
const WEB = Q.get('web') || 'file:///home/user/edit_yuv/v2/web/';
const PAGES = ['changelog', 'pricing', 'plugins'];
const CANDLE_N = 240;                                   // Mixkit #29425 (Shabbat-like candles), 30 fps frames
const candleIdx = t => clamp(Math.floor((t - (A.pray - 0.3)) * 30), 0, CANDLE_N - 1) + 1;
const BEHIND = [[A.mods_now - 0.25, A.mods_now_end]];
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
  need.push(load(IMG, FRAMES + pad(AVATAR) + '.jpg', AVATAR));
  for (const pg of PAGES) need.push(load(IMG, WEB + pg + '.png', 'web:' + pg));
  if (t > A.pray - 0.6 && t < A.pray_end + 0.8) for (let i = 0; i < n; i++) { const c = candleIdx(t + (i - n / 2) / 600); need.push(load(IMG, WEB + 'candles/' + pad(c) + '.jpg', 'c:' + c)); }
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
const IMPS = [...CUTS.map(t => [t, 1]), [A.hook_date, 2], [A.mod - 0.1, 3], [A.what, 3], [A.tools, 1], [A.mods_in, 2], [A.live, 2], [A.status, 1], [A.toast, 2],
  [A.terminal, 1], [A.desktop, 1], [A.plugins, 2], [A.pray, 2], [A.shabbat, 1], [A.tokens, 2], [A.api, 2],
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
  const im = get(IMG, t >= A.end ? AVATAR : srcIdx(p, t)); if (!im) return;
  let sx, sy, sw, sh;
  if (p.kind === 'screen') { const [zx, zy, s] = zoomAt(t); sx = zx * 1920; sy = zy * 1080; sw = s * 1920; sh = s * 1080; }
  else { const s = p.punch || 1, [ax, ay] = p.anchor || [0.5, 0.3]; sw = 1920 / s; sh = 1080 / s; sx = ax * (1920 - sw); sy = ay * (1080 - sh); }
  // cover-fit the source crop into R (R can be any aspect while it morphs)
  const ra = R.w / R.h, ca = sw / sh;
  if (ra > ca) { const nh = sw / ra; sy += (sh - nh) / 2; sh = nh; } else { const nw = sh * ra; sx += (sw - nw) / 2; sw = nw; }
  x.drawImage(im, sx, sy, sw, sh, R.cx - R.w / 2 + (opt.dx || 0), R.cy - R.h / 2, R.w, R.h);
}
// 3D tilt of the screen panel while the camera zooms in (alternating side), flat again when it zooms out
const TILTK = (() => { const k = [[-1, 0, 0, 1]]; let n = 0;
  ZK.forEach(z => { const full = z.rect[2] >= 0.99 && z.rect[3] >= 0.99; k.push(full ? [z.t, 0, 0, 1] : [z.t - 0.1, (n++ % 2 ? 8 : -8), 5, 1.16]); }); return k; })();
const SCV = document.createElement('canvas'); SCV.width = PANEL.w; SCV.height = PANEL.h; const scx = SCV.getContext('2d');
function plateTilt(t) { return { ry: sk(t, TILTK.map(k => [k[0], k[1]]), 4, 1), rx: sk(t, TILTK.map(k => [k[0], k[2]]), 4, 1), push: sk(t, TILTK.map(k => [k[0], k[3]]), 4, 1) }; }
function plate(x, t) {
  const k = plateAt(t), p = PL[k], R = plateRect(t);
  const tl = plateTilt(t), pushing = p.cut && k > 0 && PL[k - 1].kind === 'screen' && t - p.t0 < 0.32;
  if (p.kind === 'screen' && !pushing && Math.abs(R.w - PANEL.w) < 1 && Math.abs(R.h - PANEL.h) < 1 && (Math.abs(tl.ry) > 0.05 || Math.abs(tl.rx) > 0.05)) {
    scx.setTransform(1, 0, 0, 1, 0, 0); scx.clearRect(0, 0, PANEL.w, PANEL.h);
    scx.save(); rr(scx, 0, 0, PANEL.w, PANEL.h, PANEL.r); scx.clip(); scx.fillStyle = NIGHT; scx.fillRect(0, 0, PANEL.w, PANEL.h);
    drawSource(scx, p, t, { cx: PANEL.w / 2, cy: PANEL.h / 2, w: PANEL.w, h: PANEL.h, r: 0 }); scx.restore();
    const q = { cx: R.cx, cy: R.cy, w: PANEL.w, h: PANEL.h, rx: tl.rx * DEG, ry: tl.ry * DEG, push: tl.push, dof: 2.2 };
    const P = [[-q.w / 2, -q.h / 2], [q.w / 2, -q.h / 2], [q.w / 2, q.h / 2], [-q.w / 2, q.h / 2]].map(([a2, b2]) => toScreen(worldOf(q, a2, b2)));
    shadowPoly(x, P); drawPersp(x, SCV, q); glowPoly(x, P, t, 0.55 + 0.25 * beatPulse(t));
    return;
  }
  if (R.w < W1 - 1 || R.h < H1 - 1) {   // a card on the stage: deep night shadow + thin rim
    card(x, R.cx, R.cy, R.w, R.h, R.r, { fill: NIGHT, shadow: 'rgba(255,46,160,.22)', depth: 0.9 });
    softRing(x, R.cx, R.cy, R.w, R.h, R.r, t, 0.55 + 0.25 * beatPulse(t));
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
  slamWords(x, t, words, 960, opt.y ?? 150, opt.size ?? 120, opt.ltr ? FT.en : FT.he, opt.color ?? INK.ink, times, tOut,
    { right: opt.right ?? 1800, maxW: opt.maxW ?? 1500, marker: opt.marker != null ? { i: opt.marker, paint: GOLD } : null, ltr: opt.ltr });
}
function mono(x, s, w = 600) { x.font = `${w} ${s}px "JetBrains Mono", monospace`; }
function terminal(x, cx, cy, w, h, t, opt = {}) {   // a Claude Code window drawn in code
  card(x, cx, cy, w, h, 34, { fill: '#0B0A1F', shadow: 'rgba(255,46,160,.22)', depth: 1, stroke: 'rgba(255,255,255,.12)' });
  if (opt.glow !== false) softRing(x, cx, cy, w, h, 34, t, 0.5 + 0.3 * beatPulse(t));
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
  rrc(x, 0, 0, w, h, h / 2); x.fillStyle = opt.fill || INK.pinkWash; x.fill(); x.lineWidth = 2; x.strokeStyle = INK.pinkLine || '#F7DCEB'; x.stroke();
  x.fillStyle = opt.ink || INK.pinkDeep; x.textAlign = 'center'; x.direction = he ? 'rtl' : 'ltr'; x.fillText(text, 0, (opt.size || 30) * 0.36);
  x.restore();
}
function codeChip(x, t, t0, tOut, cx, cy, text, prompt = '$') {   // a command as typed, night glass, caret
  const s = pop(t, t0, 22, 0.5) * (1 - in3(inv(tOut - 0.2, tOut, t))); if (s <= 0.01) return;
  mono(x, 46, 600); x.direction = 'ltr';
  const full = prompt + ' ' + text, w = x.measureText(full).width + 90, h = 100;
  x.save(); x.translate(cx, cy); x.scale(s, s);
  softRing(x, 0, 0, w, h, 34, t, 0.8); card(x, 0, 0, w, h, 34, { fill: 'rgba(20,18,58,.96)', shadow: 'rgba(255,46,160,.25)', depth: 0.8, stroke: 'rgba(255,255,255,.16)' });
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
    paperSky(x, W1, H1, t, { side: 'right' });
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
// WHAT: the question gets its own spread, held over the first words of the answer
function whatChapter(x, t) {
  const a = A.what - 0.08, b = A.face_start + 0.05;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'left' });
    x.save(); x.font = FT.en(520); x.fillStyle = 'rgba(255,46,160,.07)'; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('01', 40, 760); x.restore();
    mono(x, 30, 700); x.fillStyle = INK.pinkDeep; x.direction = 'ltr'; x.textAlign = 'right'; x.fillText('01 · MODS', 1800, 380);
    headline(x, t, ['מה', 'זה', 'מוד?'], [a + 0.05, a + 0.2, a + 0.35], null, { y: 600, size: 230, marker: 2 });
  }, { w: 12 });
}
// LAB: plugin vs mod (the answer), then the mod window grows into the three examples (shared element)
const TOOLS = ['GitHub', 'Slack', 'Gmail', 'Drive', 'Web'];
function miniUI(x, t, cx, cy, w, h, on) {   // the parts a mod adds to Claude's own window
  const u = clamp(on, 0, 1); if (u <= 0.01) return;
  const L = cx - w / 2, T = cy - h / 2;
  x.save(); rr(x, L + 18, T + 70, w * 0.3 * u, h - 150, 14); x.fillStyle = 'rgba(93,228,233,.22)'; x.fill(); x.restore();
  x.save(); rr(x, L + 18, T + h - 62, (w - 36) * u, 40, 20); x.fillStyle = 'rgba(255,255,255,.10)'; x.fill(); x.restore();
  if (u > 0.6) { x.save(); rr(x, L + w - 190, T + 74, 170, 52, 16); x.fillStyle = WHITE; x.fill(); x.fillStyle = '#28C840'; circle(x, L + w - 166, T + 100, 9); x.fill(); x.restore(); }
  x.save(); rr(x, L + w - 230, T + h - 56, 200, 28, 10); x.fillStyle = markerPaint(x, GOLD, T + h - 56, 28); x.globalAlpha = u; x.fill(); x.restore();
}
function lab(x, t) {
  const a = A.eq_end - 0.15, b = A.types_end;
  scene(x, t, a, b, SPLIT, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    const ph2 = clamp(spring(t - (A.live - 0.5), 8, 0.9), 0, 1.02);        // 0 = plugin vs mod, 1 = examples
    // ----- phase 1: two columns (RTL: plugin first, on the right) -----
    if (ph2 < 0.98) {
      const out = ph2;
      // PLUGIN column
      x.save(); x.translate(out * 700, 0);
      const s1 = pop(t, a + 0.1, 16, 0.6);
      if (s1 > 0.01) {
        headline(x, t, ['פלאגין'], [a + 0.1], null, { y: 250, size: 140, right: 1690, maxW: 600 });
        x.save(); x.font = FT.textB(40); x.fillStyle = INK.ink2; x.direction = 'rtl'; x.textAlign = 'center'; x.fillText('נותן ל-Claude כלים לצאת החוצה', 1390, 330); x.restore();
        x.save(); x.translate(1390, 620); x.scale(s1, s1); terminal(x, 0, 0, 420, 270, t, { title: 'Claude', lines: [['> /plugin install', '#FFFFFF']] }); x.restore();
        TOOLS.forEach((tl, i) => {   // tools fly OUT along arrows
          const k = clamp(spring(t - A.tools - i * 0.12, 10, 0.75), 0, 1.05), ang = -Math.PI * 0.9 + i * Math.PI * 0.45;
          if (k <= 0.01) return;
          const r0 = 200, r1 = 200 + 190 * k, cx = 1390 + Math.cos(ang) * r1 * 1.25, cy = 620 + Math.sin(ang) * r1 * 0.62;   // flattened arc: every chip stays above the caption band
          x.save(); x.strokeStyle = INK.pink; x.lineWidth = 4; x.setLineDash([2, 12]); x.lineCap = 'round';
          x.beginPath(); x.moveTo(1390 + Math.cos(ang) * r0 * 1.05, 620 + Math.sin(ang) * r0 * 0.7); x.lineTo(cx, cy); x.stroke(); x.restore();
          chip(x, t, A.tools + i * 0.12, cx, cy, tl, { size: 26, fill: WHITE, ink: INK.ink });
        });
      }
      x.restore();
      // divider
      x.save(); x.globalAlpha = 1 - out; x.strokeStyle = INK.line || '#ECEAF4'; x.lineWidth = 3; x.beginPath(); x.moveTo(960, 230); x.lineTo(960, 900); x.stroke(); x.restore();
    }
    // MOD column: its window is the shared element that becomes the big examples window
    const sM = pop(t, A.mods_in - 0.1, 16, 0.6);
    if (sM <= 0.01) return;
    const cx = lerp(530, 830, ph2), cy = lerp(620, 575, ph2), w = lerp(420, 1240, ph2), h = lerp(270, 640, ph2);
    if (ph2 < 0.6) {
      x.save(); x.translate(-ph2 * 400, 0);
      headline(x, t, ['מוד'], [A.mods_in - 0.1], null, { y: 250, size: 140, right: 690, maxW: 500, marker: 0 });
      x.save(); x.font = FT.textB(40); x.fillStyle = INK.ink2; x.direction = 'rtl'; x.textAlign = 'center'; x.fillText('משנה את הנראות של Claude עצמו', 530, 330); x.restore();
      x.restore();
    }
    x.save(); x.translate(cx, cy); x.scale(sM, sM); x.translate(-cx, -cy);
    const lines = ph2 > 0.5 ? [['> make the status line show the hebrew date', '#FFFFFF'], ['● Writing the hebrew-date mod…'], ['● Hot-reloading: hebrew-date'], ['  Ran 3 shell commands']] : [['> /plugin-authoring', '#FFFFFF']];
    terminal(x, cx, cy, w, h, t, { title: 'Claude Code', lines });
    // inward arrows: the mod changes Claude itself
    if (ph2 < 0.5) {
      const k = clamp(spring(t - A.mods_in - 0.3, 9, 0.8), 0, 1) * (1 - ph2 * 2);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => { const ox = cx + dx * (w / 2 + 90 - 40 * k), oy = cy + dy * (h / 2 + 60 - 25 * k);
        x.save(); x.globalAlpha = k; x.strokeStyle = INK.pink; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(ox, oy); x.lineTo(ox - dx * 50, oy - dy * 35); x.stroke(); x.restore(); });
      miniUI(x, t, cx, cy, w, h, spring(t - A.mods_in - 0.5, 8, 0.9));
      if (t > A.faces) softRing(x, cx, cy, w + 20, h + 20, 40, t, 1.2);    // "the face of Claude"
    }
    x.restore();
    if (ph2 < 0.6 && t > A.faces - 0.1) headline(x, t, ['הפנים', 'של', 'Claude'], [A.faces, A.faces + 0.4, A.faces + 0.6], null, { y: 870, size: 78, right: 800, maxW: 560, marker: 0 });   // clear of the caption band
    // ----- phase 2: the three examples, one at a time, in the spotlight -----
    if (ph2 > 0.3) {
      const L = cx - w / 2, T = cy - h / 2, ex = clamp((ph2 - 0.3) / 0.7);
      const parts = [
        { k: 'live', t0: A.live, en: 'LIVE PANE', he: 'חלון צד שמתעדכן בזמן אמת', r: [L + 22, T + 74, 360, h - 160] },
        { k: 'status', t0: A.status - 0.6, en: 'STATUS LINE', he: 'שורת הסטטוס שלמטה', r: [L + 22, T + h - 76, w - 44, 56] },
        { k: 'toast', t0: A.toast, en: 'TOAST', he: 'הודעה שקופצת', r: [L + w - 470, T + 80, 440, 120] }];
      const act = parts.reduce((c, p) => (t >= p.t0 ? p : c), null);
      // draw the parts as they arrive
      parts.forEach((p, i) => {
        const k = clamp(spring(t - p.t0, 12, 0.7), 0, 1.02) * ex; if (k <= 0.01) return;
        const [X, Y, PW, PH] = p.r;
        x.save();
        if (p.k === 'live') { rr(x, X, Y, PW * k, PH, 18); x.fillStyle = '#1D1B4E'; x.fill(); x.clip(); mono(x, 26, 600); x.fillStyle = INK.cyan; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('LIVE · tool calls', X + 22, Y + 44);
          ['Read  plugin.json', 'Bash  mkdir hooks', 'Edit  statusline.js', 'Bash  npm test', 'Read  hebcal.js', 'Edit  hint.js'].forEach((s2, j) => { const on = t > p.t0 + 0.4 + j * 0.45; x.fillStyle = on ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.18)'; x.fillText(s2, X + 22, Y + 100 + j * 52); }); }
        if (p.k === 'status') { rr(x, X, Y, PW * k, PH, PH / 2); x.fillStyle = 'rgba(255,255,255,.12)'; x.fill(); x.clip(); mono(x, 26, 700); x.direction = 'ltr'; x.textAlign = 'left'; x.fillStyle = '#7CE3A1'; x.fillText('▸▸ Opus 5.5', X + 26, Y + 37); x.fillStyle = INK.onNight2; x.fillText('ctx 31%', X + 230, Y + 37); }
        x.restore();
        if (p.k === 'status' && k > 0.5) goldChip(x, t, p.t0 + 0.2, X + PW - 20, Y + PH / 2, DATE, 28);
        if (p.k === 'toast') { const s3 = pop(t, p.t0, 20, 0.5) * ex; if (s3 > 0.01) { x.save(); x.translate(X + PW / 2, Y + PH / 2); x.scale(s3, s3); card(x, 0, 0, PW, PH, 30, { fill: WHITE, depth: 0.8 }); x.fillStyle = '#28C840'; circle(x, -PW / 2 + 50, 0, 20); x.fill(); x.font = FT.textB(40); x.fillStyle = INK.ink; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('Task finished ✓', -PW / 2 + 90, 14); x.restore(); } }
      });
      // spotlight: dim the window except the active part, glow ring on the part
      if (act) {
        const [X, Y, PW, PH] = act.r, sp = clamp(spring(t - act.t0, 10, 0.9), 0, 1) * ex;
        x.save(); rrc(x, cx, cy, w, h, 34); x.clip(); x.beginPath(); x.rect(L, T, w, h); x.roundRect(X - 8, Y - 8, PW + 16, PH + 16, 24); x.fillStyle = `rgba(11,10,31,${0.55 * sp})`; x.fill('evenodd'); x.restore();
        softRing(x, X + PW / 2, Y + PH / 2, PW + 16, PH + 16, 24, t, 1.1 * sp);
      }
      // labels on the right: the active one big, the earlier ones as small chips above
      parts.forEach((p, i) => {
        if (t < p.t0) return;
        const isAct = p === act, k = clamp(spring(t - p.t0, 14, 0.7), 0, 1.03) * ex;
        if (isAct) {
          x.save(); x.translate(1690, 560); x.scale(k, k);
          x.font = FT.en(84); x.fillStyle = INK.ink; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText(p.en, 0, 0);
          x.font = FT.textB(36); x.fillStyle = INK.pinkDeep; x.direction = 'rtl'; x.fillText(p.he, 0, 64);
          x.restore();
        } else chip(x, t, p.t0, 1690, 300 + i * 74, p.en, { size: 24, fill: WHITE, ink: INK.ink2 });
      });
      mono(x, 28, 700); x.fillStyle = INK.pinkDeep; x.direction = 'ltr'; x.textAlign = 'right'; x.globalAlpha = ex; x.fillText('3 MOD EXAMPLES', 1840, 150); x.globalAlpha = 1;
    }
  }, { w: 10 });
}
// REAL B-ROLL: a live capture of the actual page, in a browser card; scroll/zoom keys; spotlight on real DOM rects
const BCW = 1560, BCH = 790, BC = document.createElement('canvas'); BC.width = BCW; BC.height = BCH; const bx = BC.getContext('2d');
function browserCard(x, t, a, b, page, url, keys, hls, tilt) {
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    const im = get(IMG, 'web:' + page), R0 = RECT[page]; if (!im) return;
    const w = BCW, h = BCH, bar = 62;
    // 1. the card, flat, into its own canvas: browser chrome, the live page (scroll + zoom), the spotlight dim
    bx.setTransform(1, 0, 0, 1, 0, 0); bx.clearRect(0, 0, w, h);
    bx.save(); rr(bx, 0, 0, w, h, 34); bx.clip(); bx.fillStyle = WHITE; bx.fillRect(0, 0, w, h);
    bx.fillStyle = INK.cloud; bx.fillRect(0, 0, w, bar);
    ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => { circle(bx, 34 + i * 26, bar / 2, 8); bx.fillStyle = c; bx.fill(); });
    rr(bx, w / 2 - 380, 14, 760, bar - 28, (bar - 28) / 2); bx.fillStyle = WHITE; bx.fill();
    mono(bx, 22, 500); bx.fillStyle = INK.ink2; bx.direction = 'ltr'; bx.textAlign = 'center'; bx.fillText(url, w / 2, bar / 2 + 8);
    const y = sk(t, keys.map(k => [k[0], k[1]]), 4, 1), z = Math.exp(sk(t, keys.map(k => [k[0], Math.log(k[2] || 1)]), 4, 1));
    const fx = sk(t, keys.map(k => [k[0], k[3] ?? R0.W / 2]), 4, 1);
    const sw = R0.W / z, shh = sw * (h - bar) / w, sx = clamp(fx - sw / 2, 0, R0.W - sw), sy = clamp(y, 0, R0.H - shh);
    bx.drawImage(im, sx, sy, sw, shh, 0, bar, w, h - bar);
    const map = r => { let X = (r[0] - sx) * w / sw, Y = bar + (r[1] - sy) * (h - bar) / shh, PW = r[2] * w / sw, PH = r[3] * (h - bar) / shh;
      const X2 = Math.min(X + PW, w - 24), Y2 = Math.min(Y + PH, h - 24); X = Math.max(X, 24); Y = Math.max(Y, bar + 16); return [X, Y, X2 - X, Y2 - Y]; };
    const act = hls.filter(hl => t >= hl[0] && t < hl[1]).pop();
    let sp = 0, HR = null;
    if (act) { HR = map(act[2]); sp = clamp(spring(t - act[0], 10, 0.9), 0, 1) * (1 - in3(inv(act[1] - 0.2, act[1], t)));
      bx.beginPath(); bx.rect(0, bar, w, h - bar); bx.roundRect(HR[0] - 10, HR[1] - 10, HR[2] + 20, HR[3] + 20, 18); bx.fillStyle = `rgba(28,26,75,${0.42 * sp})`; bx.fill('evenodd'); }
    bx.restore();
    // 2. the 3D move: tilt keys [t, rotY deg, rotX deg, push]; the card turns toward the camera while something is lit
    const ry = sk(t, tilt.map(k => [k[0], k[1]]), 3.2, 1), rx = sk(t, tilt.map(k => [k[0], k[2]]), 3.2, 1), push = sk(t, tilt.map(k => [k[0], k[3]]), 3.2, 1);
    const q = { cx: 960, cy: 470, w, h, rx: rx * DEG, ry: ry * DEG, push, dof: 2.6 };
    const P = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([a2, b2]) => toScreen(worldOf(q, a2, b2)));
    shadowPoly(x, P); drawPersp(x, BC, q); glowPoly(x, P, t, 0.75 + 0.2 * beatPulse(t));
    // 3. the lit element lifts off the page toward the camera (its own layer, a little larger), glow + label on it
    if (HR && sp > 0.01) {
      const pad = 10, lx = HR[0] - pad + (HR[2] + 2 * pad) / 2 - w / 2, ly = HR[1] - pad + (HR[3] + 2 * pad) / 2 - h / 2, lift = 70 * sp, sc = 1 + 0.05 * sp;
      const T = worldOf(q, lx, ly, lift), lw = (HR[2] + 2 * pad) * sc, lh = (HR[3] + 2 * pad) * sc;
      const lq = { ...q, w: lw, h: lh, T, dof: 0 };
      const sub = [(HR[0] - pad) / w, (HR[1] - pad) / h, (HR[0] + HR[2] + pad) / w, (HR[1] + HR[3] + pad) / h];
      const LP = [[-lw / 2, -lh / 2], [lw / 2, -lh / 2], [lw / 2, lh / 2], [-lw / 2, lh / 2]].map(([a2, b2]) => toScreen(worldOf(q, lx + a2, ly + b2, lift)));
      x.save(); x.globalAlpha = sp; shadowPoly(x, LP, 0.3); drawPersp(x, BC, lq, sub); x.restore();
      glowPoly(x, LP, t, 1.2 * sp);
      const top = LP.reduce((m, p2) => (p2[1] < m[1] ? p2 : m), LP[0]), mxp = (LP[0][0] + LP[1][0]) / 2;
      if (act[3]) chip(x, t, act[0] + 0.15, clamp(mxp, 300, 1620), clamp(Math.min(LP[0][1], LP[1][1]) - 44, 130, 860), act[3], { size: 30, fill: PINK, ink: WHITE, glow: true, out: act[1] - 0.2 });
    }
  });
}
function realBroll(x, t) {
  const C = RECT.changelog, P = RECT.pricing, G = RECT.plugins;
  // "זה העדכון האחרון של Anthropic?" -> the real changelog, the newest version lit up
  browserCard(x, t, A.hook_end, A.not_this - 0.15, 'changelog', 'code.claude.com/docs/en/changelog',
    [[A.hook_end - 1, 0, 1], [A.latest - 0.2, 120, 1.25, 1400]],
    [[A.latest, A.latest + 0.9, [C.h1[0] - 20, C.h1[1] - 14, 1120, C.h1[3] + 28], 'Claude Code changelog'], [A.latest + 0.9, A.not_this, [1700, 250, 430, 70], 'הגרסה האחרונה']],
    [[A.hook_end - 0.2, -24, 14, 1.45], [A.hook_end + 0.5, -14, 9, 1.18], [A.latest, -6, 4, 1.06], [A.latest + 0.9, 8, 5, 1.04]]);
  // "API Credits ... מול המנוי" -> the real pricing page: the API tab, then Pro / Max
  browserCard(x, t, A.api - 0.25, A.api_end, 'pricing', 'claude.com/pricing',
    [[A.api - 1, 330, 1.8, 1320], [A.api + 2.2, 330, 1.8, 1320], [A.sub - 0.3, 620, 1]],
    [[A.api, A.sub - 0.35, [1272, 580, 98, 70], 'API'], [A.sub - 0.3, A.api_end, [P.proCard[0], P.proCard[1], P.maxCard[0] + P.maxCard[2] - P.proCard[0], 900], 'מנוי']],
    [[A.api - 0.4, 22, 12, 1.4], [A.api + 0.2, 12, 8, 1.15], [A.sub - 0.5, 4, 4, 1.05], [A.sub + 0.3, -8, 6, 1.06]]);
  // "אז הבנו, זה הרעיון של מודים בתוך Claude" -> the real plugins docs page
  browserCard(x, t, A.idea - 0.05, A.skills - 0.3, 'plugins', 'code.claude.com/docs/en/plugins',
    [[A.idea - 1, 0, 1], [A.skills - 1.4, 380, 1]],
    [[A.idea + 0.6, A.skills - 0.3, [G.h1[0] - 20, G.h1[1] - 14, 1400, 330], 'Plugins overview']],
    [[A.idea - 0.2, -22, 13, 1.45], [A.idea + 0.5, -12, 8, 1.15], [A.idea + 1.4, -4, 4, 1.05], [A.skills - 0.6, 10, 7, 1.12]]);
}

// WHERE: terminal or desktop
function where(x, t) {
  const a = A.terminal - 0.2, b = A.types2_end;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
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
    const cim = get(IMG, 'c:' + candleIdx(t));
    if (cim) { const k = 1.04 + 0.04 * clamp((t - a) / (b - a)); x.save(); x.translate(960, 540); x.scale(k, k); x.drawImage(cim, -960, -540, 1920, 1080); x.restore();
      x.fillStyle = 'rgba(14,13,42,.25)'; x.fillRect(0, 0, W1, H1); } else paperSky(x, W1, H1, t, { side: 'right' });
    x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30;
    headline(x, t, ['כל', 'מה', 'שאני', 'רוצה'], [A.pray, A.pray + 0.12, A.pray + 0.24, A.pray + 0.36], null, { y: 170, size: 130, marker: 3, color: WHITE });
    x.restore();
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
    paperSky(x, W1, H1, t, { side: 'left' });
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
    paperSky(x, W1, H1, t, { side: 'right' });
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
    paperSky(x, W1, H1, t, { side: 'left' });
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
    if (m > 0.01) { x.save(); x.translate(960, 520); x.scale(m, m); softRing(x, 0, 0, 460, 150, 75, t, 1); rrc(x, 0, 0, 460, 150, 75); x.fillStyle = PINK; x.fill(); x.font = FT.en(100); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText('MODS', 0, 36); x.restore(); }
    headline(x, t, ['כמו', 'הסקילים'], [A.skills - 0.2, A.skills], null, { y: 175, size: 140, marker: 1 });
  }, { w: 10 });
}
// CHAPTER 2: the verdict spread
function chapter2(x, t) {
  const a = A.ch2 - 0.05, b = A.ch2 + 1.25;
  scene(x, t, a, b, { cx: 1500, cy: 540, w: 60, h: 60, r: 30 }, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    x.save(); x.font = FT.en(560); x.fillStyle = 'rgba(255,46,160,.08)'; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('02', 60, 780); x.restore();
    mono(x, 30, 700); x.fillStyle = INK.pinkDeep; x.direction = 'ltr'; x.textAlign = 'right'; x.fillText('02 · VERDICT', 1800, 380);
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
  x.save(); x.shadowColor = 'rgba(14,13,42,.55)'; x.shadowBlur = 30; headline(x, t, ['מודים.', 'עכשיו.'], [A.mods_now, A.mods_now + 0.3], A.mods_now_end - 0.3, { y: 400, size: 270, right: 1800, maxW: 1650, marker: 0, color: WHITE }); x.restore();
}
// chips over the screen plate
function overlays(x, t) {
  codeChip(x, t, A.update - 0.1, PL[4].t0 - 0.05, 960, 830, 'claude --update');
  codeChip(x, t, A.pa - 0.1, A.what - 0.1, 960, 830, '/plugin-authoring', '>');
  chip(x, t, A.hot, 960, 840, '↻  hot-reload · אוטומטי', { size: 30, glow: true, out: PL[6].t0 - 0.2 });
  // lower third (white card, pink bar), above the captions, RTL start = right
  const lt0 = A.lt, lt1 = A.lt + 3.6, s = clamp(spring(t - lt0, 12, 0.7), 0, 1.02) * (1 - in3(inv(lt1 - 0.25, lt1, t)));
  if (s > 0.01) { x.save(); const w = 560 * s, X = 1840 - w, Y = 760; x.beginPath(); x.rect(X - 30, Y - 40, w + 60, 220); x.clip();
    softRing(x, 1840 - 280, Y + 70, 560, 140, 40, t, 0.9); card(x, 1840 - 280, Y + 70, 560, 140, 40, { fill: WHITE, depth: 0.7 }); x.fillStyle = PINK; rr(x, 1840 - 22, Y + 26, 8, 88, 4); x.fill();
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
  const pw = clamp(u * 2) * (0.85 + 0.15 * beatPulse(t));
  neonRing(x, R.cx, R.cy, R.w + 22, R.h + 22, (R.w + 22) / 2, t * 1.05, { lw: 6, glow: 30, power: pw });
  softRing(x, R.cx, R.cy, R.w + 40, R.h + 40, (R.w + 40) / 2, t + 1.3, 0.6 * pw);
  headline(x, t, ['תמשיכו', 'לעוף', 'גבוה'], [A.end + 0.35, A.end + 0.55, A.end + 0.75], null, { y: 470, size: 150, right: 1800, maxW: 900, marker: 1 });
  const sk2 = io3(inv(A.end + 1.1, A.end + 2.6, t));
  x.save(); x.translate(1790, 650); x.rotate(-0.05); x.font = FT.hand(110); x.direction = 'rtl'; x.textAlign = 'right'; const sw = x.measureText('יובל אבידני').width;
  x.beginPath(); x.rect(-sw * sk2 - 10, -130, sw * sk2 + 20, 190); x.clip(); x.fillStyle = INK.pinkDeep; x.fillText('יובל אבידני', 0, 0); x.restore();
  const ul = out3(inv(A.end + 2.6, A.end + 3.25, t)); x.strokeStyle = INK.gold[1]; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(1790, 690); x.lineTo(1790 - 520 * ul, 708); x.stroke();
  x.direction = 'ltr'; x.textAlign = 'right'; x.font = FT.en(56); x.fillStyle = PINK; x.fillText('YUV.AI', 1840, 1000);
  mono(x, 20, 700); x.fillStyle = INK.ink2; x.fillText("LET'S FLY HIGH", 1840, 1034);
  x.textAlign = 'left'; mono(x, 30, 600); x.fillStyle = INK.ink2; x.fillText('yuv.ai', 80, 1020);
}

/* ---------------- captions: calm phrases (Yuval: word-by-word pops are distracting) ----------------
   The whole phrase appears at once with one short rise and stays still until the next one. Ink on the light stage,
   white with a night stroke over full-frame footage. */
const CH = D.chunks;
function capOnLight(t) {
  if (t > A.pray - 0.1 && t < A.pray_end) return false;       // over the real candle footage
  const p = PL[plateAt(t)];
  if (p.kind === 'screen') return true;
  return SPLITS.some(([a, b]) => t > a + 0.2 && t < b);
}
function captions(x, t) {
  if (t >= A.end - 0.05) return;
  let c = null; for (const ch of CH) { if (t >= ch.t0 - 0.05 && t < ch.end) { c = ch; break; } } if (!c) return;
  const text = c.words.map(o => o.w).join(' '), size = 54, y = 1022, light = capOnLight(t);
  const k = out3(inv(c.t0 - 0.05, c.t0 + 0.13, t)), dy = (1 - k) * 10;
  x.save(); x.font = FT.textB(size); x.direction = 'rtl'; x.textAlign = 'center'; x.lineJoin = 'round'; x.globalAlpha = k;
  if (light) { x.fillStyle = INK.ink; x.fillText(text, 960, y + dy); }
  else { x.lineWidth = size * 0.16; x.strokeStyle = 'rgba(14,13,42,.85)'; x.strokeText(text, 960, y + dy); x.fillStyle = WHITE; x.fillText(text, 960, y + dy); }
  x.restore();
}
function progress(x, t) { const u = clamp(t / DUR); x.fillStyle = 'rgba(28,26,75,.10)'; x.fillRect(0, 0, W1, 6); x.fillStyle = gradPaint(x, W1, 0, 0, 0, [PINK, INK.cyan]); x.fillRect(W1 * (1 - u), 0, W1 * u, 6); }

/* ---------------- the frame ---------------- */
function draw(x, t, L) {
  paperSky(x, W1, H1, t, { side: 'right' });
  x.save(); camApply(x, camAt(t));
  plate(x, t);
  if (BEHIND.some(([a, b]) => t >= a && t < b)) { behindTitles(x, t); subjectOver(x, t); }
  splitTitles(x, t); overlays(x, t);
  hook(x, t); modPage(x, t); whatChapter(x, t); lab(x, t); where(x, t); zmanim(x, t); tokens(x, t); realBroll(x, t); skills(x, t); chapter2(x, t);
  endcard(x, t);
  x.restore();
  flash(x, t); captions(x, t); progress(x, t);
}
mountFilm({ layouts: { h: { name: 'h', W: W1, H: H1 } }, draw, dur: DUR, clk: { B, BPM: D.BPM } });
