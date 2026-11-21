/* =====================================================================
   "GitHub Universe 2026: 6 updates to the GitHub Copilot app" — Yuval's real footage, edited as ONE kit film (yuv-edit).
   Source: 2560x1440 screen recording with the recorder's own zooms and a webcam PIP (left until 9:14, right after),
   face cam at the top and the end. The 9:16 cut takes the speaker's face from the separate OBS vertical recording.
   Plates change SHAPE between screen and face, screen jump cuts PUSH, B-roll is drawn in code or is a real page in 3D.
   Every event hangs on a spoken word (data.json anchors, output time). 60 fps, 6-subframe motion blur.
   ===================================================================== */
import { clamp, lerp, inv, out3, in3, io3, spring, sk, rgba, INK, FT, rr, rrc, circle, markerPaint, gradPaint, fitSize, mountFilm, rnd, nightSky } from '../../src/core.js';
import { card, neonRing, slamWords, popType, GLOW } from '../../src/ui.js';
import { THREE, makeLaptop, makePhone, makeCard3D } from '../../src/world.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import MARK_URL from '../../brand/phoenix-mark-1024.png';
import D from './data.json';
import RECT from './rects.json';
import { drawPersp, worldOf, toScreen } from './persp.js';

const A = D.A, B = D.B, DUR = D.DUR, W1 = 1920, H1 = 1080, SW = 2560, SH = 1440, LASTF = 32229;
const WHITE = '#FFFFFF', GOLD = INK.gold, PINK = INK.pink, NIGHT = INK.night;
const Q = new URLSearchParams(location.search);
const ROOT = Q.get('root') || 'file:///C:/Users/User/AppData/Local/Temp/claude/C--Users-User--claude-spares-spare-VLFbZF/cdda9d25-01a1-4bdf-abff-ed4c68051eae/scratchpad/gu/v2/';
const FRAMES = ROOT + 'frames/', VFACE = ROOT + 'vface/', WEB = ROOT + 'web/';
const IS_V = (Q.get('L') || 'h') === 'v';

/* ---------------- Phoenix Ink light stage + the signature glow ring ---------------- */
function paperSky(x, W, H, t = 0, { side = 'right' } = {}) {
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, INK.cloud); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const glow = (cx, cy, r, c) => { const q = x.createRadialGradient(cx, cy, 0, cx, cy, r); q.addColorStop(0, c); q.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = q; x.fillRect(0, 0, W, H); };
  const sx = side === 'left' ? 0.22 : 0.78;
  glow(W * sx, H * 0.42, Math.max(W, H) * 0.45, 'rgba(255,46,160,.10)');
  glow(W * (1 - sx), H * 0.15, Math.max(W, H) * 0.38, 'rgba(139,108,255,.09)');
  glow(W * 0.5, H * 1.15, Math.max(W, H) * 0.6, 'rgba(255,143,58,.10)');
  for (let i = 0; i < 70; i++) { const px = rnd(i) * W, py = rnd(i + 99) * H, a = 0.10 + 0.08 * Math.sin(t * 1.2 + i * 2.1); x.fillStyle = `rgba(255,46,160,${a.toFixed(3)})`; x.beginPath(); x.arc(px, py, 1.6, 0, 7); x.fill(); }
}
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
function glowPoly(x, P, t, power = 1) {
  const cx = P.reduce((s, p) => s + p[0], 0) / 4, cy = P.reduce((s, p) => s + p[1], 0) / 4, g = x.createConicGradient(t * 0.9, cx, cy);
  GLOW.forEach((c, i) => g.addColorStop(i / (GLOW.length - 1), c));
  x.save(); x.strokeStyle = g; x.lineJoin = 'round';
  [[34, 0.07], [22, 0.12], [13, 0.22], [7, 0.45], [3.5, 1]].forEach(([lw, al]) => { x.globalAlpha = al * power; x.lineWidth = lw; polyPath(x, P); x.stroke(); });
  x.restore();
}
const B0 = 9.205;   // the music enters at 8.906 s so its drop lands on the cut out of the hook (24.2 s); first beat 0.299 s in
const beatPulse = t => Math.exp(-(((((t - B0) % B) + B) % B) / B) * 5);
const pop = (t, t0, w = 20, z = 0.5) => clamp(spring(t - t0, w, z), 0, 1.25);
const fade = (t, a, b, d = 0.2) => clamp(spring(t - a, 14, 0.8), 0, 1.05) * (1 - in3(inv(b - d, b, t)));

/* ---------------- official logos (Simple Icons, CC0 marks; editorial use) ---------------- */
const LOGO_C = { github: '#181717', githubcopilot: '#0E0D2A', claude: '#D97757', anthropic: '#191919', openai: '#0E0D2A', googlegemini: '#8E75B2', cloudflare: '#F38020',
  gmail: '#EA4335', slack: '#4A154B', notion: '#0E0D2A', vercel: '#0E0D2A', sentry: '#362D59', visualstudiocode: '#007ACC', windowsterminal: '#4D4D4D', moonshotai: '#0E0D2A' };
const LOGO = {}, LOGOW = {};
async function loadLogos() {
  await Promise.all(Object.keys(LOGO_C).map(async k => {
    const im = new Image(); im.src = ROOT + 'logos/' + k + '.svg'; await im.decode();
    const mk = col => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.drawImage(im, 0, 0, 256, 256); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, 256, 256); return c; };
    LOGO[k] = mk(LOGO_C[k]); LOGOW[k] = mk('#FFFFFF');
  }));
}
function logo(x, k, cx, cy, s, white = false) { const c = (white ? LOGOW : LOGO)[k]; if (c) x.drawImage(c, cx - s / 2, cy - s / 2, s, s); }
// a white app tile with the official mark: the way the connectors look in the app itself
function logoTile(x, t, t0, k, cx, cy, s, opt = {}) {
  const p = pop(t, t0, 18, 0.55) * (opt.out != null ? 1 - in3(inv(opt.out, opt.out + 0.2, t)) : 1); if (p <= 0.01) return;
  x.save(); x.translate(cx, cy); x.scale(p, p);
  if (opt.ring) softRing(x, 0, 0, s, s, s * 0.24, t, opt.ring);
  card(x, 0, 0, s, s, s * 0.24, { fill: WHITE, depth: 0.55, shadow: 'rgba(255,46,160,.22)' });
  logo(x, k, 0, opt.label ? -s * 0.1 : 0, s * 0.52);
  if (opt.label) { x.font = FT.textB(s * 0.15); x.fillStyle = INK.ink; x.textAlign = 'center'; x.direction = isHe(opt.label) ? 'rtl' : 'ltr'; x.fillText(opt.label, 0, s * 0.36); }
  x.restore();
}

/* ---------------- footage: lazily decoded frames, an LRU so memory stays flat ---------------- */
const IMG = new Map();
const pad = n => String(n).padStart(6, '0');
function load(map, url, key) {
  if (map.has(key)) { const v = map.get(key); map.delete(key); map.set(key, v); return v.p; }
  const im = new Image(); im.src = url; const p = im.decode().then(() => im).catch(() => null);
  map.set(key, { im, p }); if (map.size > 160) map.delete(map.keys().next().value);
  return p;
}
const get = key => { const v = IMG.get(key); return v && v.im.complete && v.im.naturalWidth ? v.im : null; };
const PL = D.plates;
function plateAt(t) { let lo = 0, hi = PL.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (PL[m].t0 <= t) lo = m; else hi = m - 1; } return lo; }
const srcIdx = (p, t) => clamp(Math.round((p.in + clamp(t - p.t0, 0, p.dur)) * 30), Math.round(p.in * 30), Math.min(LASTF, Math.round((p.in + p.dur) * 30) - 1));
const AVATAR = 27608;                     // he looks straight into the lens (picked from a grid of the last seconds)
const IMG1 = 23700, IMG2 = 24900;         // the two generated covers, as they appear on his screen (for the review-pass scene)
const PAGES = ['universe', 'appchangelog', 'fusion', 'live'];
// licensed Mixkit stock: #14669 phone in hand, #4938 typing on a laptop (30 fps frames, 1920x1080)
// #13192 conference hall, #11213 Golden Gate at dusk (behind the Universe post)
const STOCK = { desk: { id: 's4938', a: A.apps - 0.3, b: A.fix + 3.0, n: 307 },
  conf: { id: 's13192', a: A.popup + 1.5, b: 51.6, n: 382 }, gg: { id: 's11213', a: 51.3, b: A.summary - 0.45, n: 420 } };
const SF_T = 51.71;   // "בסן פרנסיסקו": the hall wipes to the Golden Gate
const stockIdx = (s, t) => clamp(Math.floor((t - s.a + 0.3) * 30), 0, s.n - 1) + 1;
window.prepare = async (t, n = 6, shutter = 0.5, fps = 60) => {
  const need = [];
  for (let i = 0; i < n; i++) {
    const ts = Math.max(0, t - shutter / fps / 2 + shutter / fps * (i + 0.5) / n);
    const k = plateAt(ts), p = PL[k], f = srcIdx(p, ts);
    need.push(load(IMG, FRAMES + pad(f) + '.jpg', f));
    if (IS_V) need.push(load(IMG, VFACE + pad(f) + '.jpg', 'v' + f));
    if (k > 0) { const q = PL[k - 1], g = srcIdx(q, q.t0 + q.dur); need.push(load(IMG, FRAMES + pad(g) + '.jpg', g)); }
    for (const s of Object.values(STOCK)) if (ts > s.a - 0.6 && ts < s.b + 0.8) { const c = stockIdx(s, ts); need.push(load(IMG, WEB + s.id + '/' + pad(c) + '.jpg', s.id + ':' + c)); }
  }
  for (const f of [AVATAR, IMG1, IMG2]) need.push(load(IMG, FRAMES + pad(f) + '.jpg', f));
  if (IS_V) need.push(load(IMG, VFACE + pad(AVATAR) + '.jpg', 'v' + AVATAR));
  for (const pg of PAGES) need.push(load(IMG, WEB + pg + '.png', 'web:' + pg));
  await Promise.all(need);
};

/* ---------------- geometry: where the plate lives ---------------- */
const FULL = { cx: 960, cy: 540, w: 1920, h: 1080, r: 0 };
const PANEL = { cx: 960, cy: 518, w: 1816, h: 1022, r: 28 };
const SPLIT = { cx: 660, cy: 486, w: 1080, h: 608, r: 44 };
const lerpR = (a, b, u) => ({ cx: lerp(a.cx, b.cx, u), cy: lerp(a.cy, b.cy, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u), r: lerp(a.r, b.r, u) });
const home = p => (p.kind === 'face' ? FULL : PANEL);
// title splits on the face plates: the plate becomes a card on the left, the headline owns the right
const SPLITS = [[A.six - 0.25, A.desktop + 1.3], [A.gift - 0.25, 23.7], [A.worth - 0.3, A.e2e + 0.2], [A.claude_side - 0.1, A.claude_end - 0.1]];
function plateRect(t) {
  const k = plateAt(t), p = PL[k], q = k > 0 ? PL[k - 1] : p;
  let R = home(p);
  if (q !== p && q.kind !== p.kind) R = lerpR(home(q), home(p), clamp(spring(t - p.t0, 9, 0.9), 0, 1.05));
  for (const [a, b] of SPLITS) {
    const u = clamp(spring(t - a, 10, 0.78), 0, 1.05) * (1 - clamp(spring(t - b + 0.25, 11, 0.9), 0, 1));
    if (u > 0.0005) R = lerpR(R, SPLIT, u);
  }
  if (t >= A.end) R = lerpR(R, { cx: 560, cy: 460, w: 520, h: 520, r: 260 }, clamp(spring(t - A.end, 8, 0.85), 0, 1.02));
  return R;
}
// the webcam PIP inside the screen recording (source px): bottom-left until 9:14, bottom-right after
const PIP_L = [45, 969, 717, 403], PIP_R = [1746, 958, 758, 426];
const pipOf = p => (p.in < 554 ? PIP_L : PIP_R);
// screen camera: zoom rects (source-normalised), springs in log space
const ZK = D.zooms;
function zoomAt(t) {
  const keys = [[-1, [0, 0, 1, 1]], ...ZK.map(z => [z.t, z.rect])];
  const sq = r => { const s = Math.max(r[2], r[3]), cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2; return [cx, cy, Math.log(s)]; };
  const comp = j => sk(t, keys.map(([tk, r]) => [tk, sq(r)[j]]), 7.5, 1);
  let cx = comp(0), cy = comp(1), s = Math.exp(comp(2)); s = clamp(s, 0.3, 1);
  cx = clamp(cx, s / 2, 1 - s / 2); cy = clamp(cy, s / 2, 1 - s / 2);
  return [cx - s / 2, cy - s / 2, s];
}

/* ---------------- the edit layer ---------------- */
const CUTS = PL.filter((p, i) => i > 0 && p.cut).map(p => p.t0);
const CHAPTERS = [A.fusion - 0.1, A.parallel - 0.2, A.auto + 1.0, A.tools, A.device, A.images + 0.3, A.demo];
const IMPS = [...CUTS.map(t => [t, 1]), ...CHAPTERS.map(t => [t, 2]), [A.six, 2], [A.disc, 2], [A.total, 1], [A.astra_price, 1], [A.my_high, 1], [A.better, 2], [A.github_pick, 1], [A.end, 2]].sort((a, b) => a[0] - b[0]);
function camAt(t) {
  let z = 0, sx = 0, sy = 0, rot = 0;
  for (const [p, st] of IMPS) {
    const u = t - p; if (u < 0) break; if (u > 0.9) continue;
    z += (st >= 2 ? 0.03 : 0.016) * Math.exp(-u / 0.16);
    if (st >= 2) { const a = 5 * Math.exp(-u / 0.11); sx += a * Math.sin(u * 119.4 + p * 7); sy += a * Math.cos(u * 144.5 + p * 3); rot += 0.004 * Math.exp(-u / 0.12) * Math.sin(u * 69.1 + p); }
  }
  return { z, sx, sy, rot };
}
function camApply(x, c) { const k = 1 + c.z + 2 * Math.max(Math.abs(c.sx), Math.abs(c.sy)) / 1080 + Math.abs(c.rot) * 1.8; x.translate(960 + c.sx, 540 + c.sy); x.rotate(c.rot); x.scale(k, k); x.translate(-960, -540); }
function flash(x, t) { let a = 0; for (const p of CHAPTERS) { const u = t - p; if (u >= 0 && u < 0.14) a = Math.max(a, 0.3 * Math.exp(-u / 0.032)); } if (a > 0.01) { x.fillStyle = rgba(WHITE, a); x.fillRect(0, 0, W1, H1); } }

/* ---------------- drawing the plate ---------------- */
let V_INNER = false;
const faceCrop = (p, t) => (t >= A.end ? [1.28, 0.5, 0.75] : [p.punch || 1, ...(p.anchor || [0.5, 0.3])]);
function drawSource(x, p, t, R, opt = {}) {
  const im = get(t >= A.end ? AVATAR : srcIdx(p, t)); if (!im) return;
  let sx, sy, sw, sh;
  if (p.kind === 'screen') { const [zx, zy, s] = zoomAt(t); sx = zx * SW; sy = zy * SH; sw = s * SW; sh = s * SH; }
  else { const [s, ax, ay] = faceCrop(p, t); sw = SW / s; sh = SH / s; sx = ax * (SW - sw); sy = ay * (SH - sh); }
  const ra = R.w / R.h, ca = sw / sh;
  if (ra > ca) { const nh = sw / ra; sy += (sh - nh) / 2; sh = nh; } else { const nw = sh * ra; sx += (sw - nw) / 2; sw = nw; }
  x.drawImage(im, sx, sy, sw, sh, R.cx - R.w / 2 + (opt.dx || 0), R.cy - R.h / 2, R.w, R.h);
  if (p.kind === 'screen' && !opt.dx) screenHL(x, t, R, sx, sy, sw, sh);
}
// callouts on the real UI of the recording (YouTuber style): dim the rest, glow ring on the element, a label.
// rects are source-normalised and measured on frames where the recorder holds still (D.shl, output time)
const SHL = D.shl || [];
function screenHL(x, t, R, sx, sy, sw, sh) {
  for (const h of SHL) {
    if (t < h.t0 || t > h.t1 + 0.05) continue;
    const sp = clamp(spring(t - h.t0, 10, 0.9), 0, 1) * (1 - in3(inv(h.t1 - 0.25, h.t1, t))); if (sp <= 0.01) continue;
    const L = R.cx - R.w / 2, T = R.cy - R.h / 2, X = L + (h.rect[0] * SW - sx) / sw * R.w, Y = T + (h.rect[1] * SH - sy) / sh * R.h, Wd = h.rect[2] * SW / sw * R.w, Hd = h.rect[3] * SH / sh * R.h;
    x.save(); x.beginPath(); x.rect(L, T, R.w, R.h); x.roundRect(X - 12, Y - 10, Wd + 24, Hd + 20, 18); x.fillStyle = `rgba(28,26,75,${0.4 * sp})`; x.fill('evenodd'); x.restore();
    softRing(x, X + Wd / 2, Y + Hd / 2, Wd + 24, Hd + 20, 18, t, 1.25 * sp);
    if (h.label) chip(x, t, h.t0 + 0.12, clamp(X + Wd / 2, L + 260, L + R.w - 260), Math.max(T + 50, Y - 52), h.label, { size: 30, fill: PINK, ink: WHITE, glow: true, out: h.t1 - 0.2 });
  }
}
const TILTK = (() => { const k = [[-1, 0, 0, 1]]; let n = 0;
  ZK.forEach(z => { const full = z.rect[2] >= 0.99 && z.rect[3] >= 0.99; k.push(full ? [z.t, 0, 0, 1] : [z.t - 0.1, (n++ % 2 ? 6 : -6), 4, 1.0]); }); return k; })();
const SCV = document.createElement('canvas'); SCV.width = PANEL.w; SCV.height = PANEL.h; const scx = SCV.getContext('2d');
function plateTilt(t) { return { ry: sk(t, TILTK.map(k => [k[0], k[1]]), 4, 1), rx: sk(t, TILTK.map(k => [k[0], k[2]]), 4, 1), push: sk(t, TILTK.map(k => [k[0], k[3]]), 4, 1) }; }
function plate(x, t) {
  const k = plateAt(t), p = PL[k], R = plateRect(t);
  const tl = plateTilt(t), pushing = p.cut && k > 0 && PL[k - 1].kind === 'screen' && t - p.t0 < 0.32;
  if (p.kind === 'screen' && !pushing && Math.abs(R.w - PANEL.w) < 1 && Math.abs(R.h - PANEL.h) < 1 && (Math.abs(tl.ry) > 0.05 || Math.abs(tl.rx) > 0.05)) {
    scx.setTransform(1, 0, 0, 1, 0, 0); scx.clearRect(0, 0, PANEL.w, PANEL.h);
    scx.save(); rr(scx, 0, 0, PANEL.w, PANEL.h, PANEL.r); scx.clip(); scx.fillStyle = WHITE; scx.fillRect(0, 0, PANEL.w, PANEL.h);
    drawSource(scx, p, t, { cx: PANEL.w / 2, cy: PANEL.h / 2, w: PANEL.w, h: PANEL.h, r: 0 }); scx.restore();
    const q = { cx: R.cx, cy: R.cy, w: PANEL.w, h: PANEL.h, rx: tl.rx * DEG, ry: tl.ry * DEG, push: tl.push, dof: 2.2 };
    const P = [[-q.w / 2, -q.h / 2], [q.w / 2, -q.h / 2], [q.w / 2, q.h / 2], [-q.w / 2, q.h / 2]].map(([a2, b2]) => toScreen(worldOf(q, a2, b2)));
    shadowPoly(x, P); drawPersp(x, SCV, q); glowPoly(x, P, t, 0.55 + 0.25 * beatPulse(t));
    return;
  }
  if (R.w < W1 - 1 || R.h < H1 - 1) {
    card(x, R.cx, R.cy, R.w, R.h, R.r, { fill: WHITE, shadow: 'rgba(255,46,160,.22)', depth: 0.9 });
    softRing(x, R.cx, R.cy, R.w, R.h, R.r, t, 0.55 + 0.25 * beatPulse(t));
  }
  x.save(); rrc(x, R.cx, R.cy, R.w, R.h, R.r); x.clip();
  const q = k > 0 ? PL[k - 1] : null, u = t - p.t0;
  if (q && p.cut && q.kind === 'screen' && p.kind === 'screen' && u < 0.32) {
    const e = io3(u / 0.32);   // RTL push: the new page arrives from the left
    drawSource(x, q, q.t0 + q.dur - 0.001, R, { dx: e * R.w });
    drawSource(x, p, t, R, { dx: -(1 - e) * R.w });
  } else drawSource(x, p, t, R);
  x.restore();
}

/* ---------------- shared UI pieces ---------------- */
function headline(x, t, words, times, tOut, opt = {}) {
  slamWords(x, t, words, 960, opt.y ?? 150, opt.size ?? 120, opt.ltr ? FT.en : FT.he, opt.color ?? INK.ink, times, tOut,
    { right: opt.right ?? 1800, maxW: opt.maxW ?? 1500, marker: opt.marker != null ? { i: opt.marker, paint: GOLD } : null, ltr: opt.ltr });
}
function mono(x, s, w = 600) { x.font = `${w} ${s}px "JetBrains Mono", monospace`; }
const isHe = s => /[֐-׿]/.test(s);
function chip(x, t, t0, cx, cy, text, opt = {}) {
  const s = pop(t, t0, 20, 0.5) * (opt.out != null ? 1 - in3(inv(opt.out, opt.out + 0.2, t)) : 1); if (s <= 0.01) return;
  const he = isHe(text), sz = opt.size || 30, f = he ? FT.textB(sz) : `700 ${sz}px "JetBrains Mono", monospace`;
  x.save(); x.font = f; const tw = x.measureText(text).width, w = tw + 56, h = sz * 1.9;
  x.translate(cx, cy); x.scale(s, s);
  if (opt.glow) neonRing(x, 0, 0, w, h, h / 2, t * 1.05, { lw: 3, glow: 14, power: 0.6 + 0.4 * beatPulse(t) });
  if (opt.shadow) { x.shadowColor = 'rgba(28,26,75,.25)'; x.shadowBlur = 30; x.shadowOffsetY = 10; }
  rrc(x, 0, 0, w, h, h / 2); x.fillStyle = opt.fill || INK.pinkWash; x.fill(); x.shadowColor = 'transparent';
  x.lineWidth = 2; x.strokeStyle = opt.line || '#F7DCEB'; x.stroke();
  x.fillStyle = opt.ink || INK.pinkDeep; x.textAlign = 'center'; x.direction = he ? 'rtl' : 'ltr'; x.fillText(text, 0, sz * 0.36);
  x.restore();
}
// a labelled card: big title + small line, white with the glow ring when active
function infoCard(x, t, t0, cx, cy, w, h, title, sub, opt = {}) {
  const s = pop(t, t0, 16, 0.6) * (opt.out != null ? 1 - in3(inv(opt.out, opt.out + 0.25, t)) : 1); if (s <= 0.01) return;
  x.save(); x.translate(cx, cy); x.scale(s, s); x.globalAlpha = opt.dim ? 1 - 0.55 * opt.dim : 1;
  if (opt.ring) softRing(x, 0, 0, w, h, 36, t, opt.ring * (0.8 + 0.3 * beatPulse(t)));
  card(x, 0, 0, w, h, 36, { fill: opt.fill || WHITE, depth: 0.8, shadow: 'rgba(255,46,160,.18)', stroke: opt.stroke });
  const he = isHe(title);
  x.textAlign = 'center'; x.direction = he ? 'rtl' : 'ltr';
  const ts = fitSize(x, title, he ? FT.he : FT.en, opt.size || 74, w - 60);
  x.font = (he ? FT.he : FT.en)(ts); x.fillStyle = opt.ink || INK.ink;
  let tx = 0; const ty = sub ? -8 : ts * 0.34;
  if (opt.logo) { const tw = x.measureText(title).width, ls = ts * 0.95; tx = (ls + 18) / 2; logo(x, opt.logo, tx - tw / 2 - 18 - ls / 2, ty - ts * 0.33, ls, opt.logoWhite); }
  x.fillText(title, tx, ty);
  if (sub) { const sh = isHe(sub); x.direction = sh ? 'rtl' : 'ltr'; const ss = fitSize(x, sub, sh ? FT.textB : FT.monoB, opt.subSize || 30, w - 50); x.font = (sh ? FT.textB : FT.monoB)(ss); x.fillStyle = opt.subInk || INK.pinkDeep; x.fillText(sub, 0, 52); }
  x.restore();
}
function arrow(x, x0, y0, x1, y1, k, color = PINK, lw = 6) {
  if (k <= 0.01) return; const xe = lerp(x0, x1, k), ye = lerp(y0, y1, k), a = Math.atan2(y1 - y0, x1 - x0);
  x.save(); x.strokeStyle = color; x.fillStyle = color; x.lineWidth = lw; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0, y0); x.lineTo(xe, ye); x.stroke();
  if (k > 0.6) { x.translate(xe, ye); x.rotate(a); x.beginPath(); x.moveTo(6, 0); x.lineTo(-20, -13); x.lineTo(-20, 13); x.closePath(); x.fill(); }
  x.restore();
}
function counter(x, t, t0, cx, cy, val, fmt, size, color, opt = {}) {
  const s = pop(t, t0, 14, 0.62); if (s <= 0.01) return;
  const v = lerp(opt.from ?? 0, val, clamp(spring(t - t0, opt.w ?? 3.2, 1), 0, 1));
  x.save(); x.translate(cx, cy); x.scale(s, s); x.font = FT.en(size); x.fillStyle = color; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText(fmt(v), 0, size * 0.34); x.restore();
}
const f0 = v => Math.round(v).toLocaleString('en-US'), f1 = v => v.toFixed(1), f2 = v => v.toFixed(2);

// a full-frame scene that grows out of a seed rect and contracts back into it (shape change, never a fade)
const SCN = [], SCN_SEEN = new Set();
function scene(x, t, a, b, seed, fn, opt = {}) {
  if (!SCN_SEEN.has(a + '|' + b)) { SCN_SEEN.add(a + '|' + b); SCN.push([a - 0.01, b + 0.6]); }
  if (t < a - 0.01 || t > b + 0.6) return;
  const u = clamp(spring(t - a, opt.w ?? 9, 0.86), 0, 1.03) * (1 - clamp(spring(t - b, 10, 0.95), 0, 1));
  if (u <= 0.002) return;
  const R = lerpR(seed, FULL, u), r = lerp(seed.r ?? 40, 0, u);
  x.save(); rrc(x, R.cx, R.cy, R.w, R.h, r); x.clip();
  const F2 = opt.fill ?? 1.1; x.translate(960, 500); x.scale(F2, F2); x.translate(-960, -500);
  fn(x, t, u); x.restore();
}
const inScene = t => SCN.some(([a, b]) => t > a + 0.15 && t < b - 0.45);

/* ---------------- the 3D studio (three.js, one renderer, deterministic) ----------------
   Studio-lit objects that hold real material: the six announcements as a 3D carousel (the shared element between
   chapters), the models melting into Fusion, the connectors flowing into Desktop / CLI / VS Code, and a laptop + phone
   whose screens carry the real app. Nothing owns time: every transform is set from t, then render3() draws into the
   film's 2D canvas. */
const G = {};
const SIX = [
  { en: 'Copilot Fusion', he: 'ניתוב חכם בין מודלים', logos: ['claude', 'openai', 'googlegemini'] },
  { en: 'Projects', he: 'עבודה מקבילית בין ריפוזיטוריז', logos: ['github'] },
  { en: 'Automations', he: 'Agentic Workflows', logos: ['github'] },
  { en: 'Your tools', he: 'מתחברים פעם אחת', logos: ['cloudflare', 'gmail', 'slack'] },
  { en: 'Any device', he: 'ממשיכים מכל מכשיר', logos: [] },
  { en: 'Images', he: 'יצירת תמונות בצ׳אט', logos: [] }];
function cardCanvas(i) {
  const c = document.createElement('canvas'); c.width = 1100; c.height = 680; const g = c.getContext('2d');
  g.fillStyle = WHITE; rr(g, 0, 0, 1100, 680, 72); g.fill();
  const gr = g.createLinearGradient(0, 0, 1100, 0); gr.addColorStop(0, 'rgba(255,46,160,.10)'); gr.addColorStop(1, 'rgba(139,108,255,.08)'); g.fillStyle = gr; rr(g, 0, 0, 1100, 680, 72); g.fill();
  g.font = FT.en(170); g.fillStyle = PINK; g.textAlign = 'right'; g.direction = 'ltr'; g.fillText('0' + (i + 1), 1030, 200);
  g.drawImage(LOGO.githubcopilot, 70, 70, 96, 96);
  g.font = `700 30px "JetBrains Mono", monospace`; g.fillStyle = INK.ink2; g.textAlign = 'left'; g.fillText('GITHUB UNIVERSE 2026', 190, 132);
  g.font = FT.en(fitSize(g, SIX[i].en, FT.en, 130, 960)); g.fillStyle = INK.ink; g.fillText(SIX[i].en, 70, 430);
  g.font = FT.textB(fitSize(g, SIX[i].he, FT.textB, 58, 960)); g.fillStyle = INK.pinkDeep; g.direction = 'rtl'; g.textAlign = 'right'; g.fillText(SIX[i].he, 1030, 540);
  SIX[i].logos.forEach((k, j) => { g.fillStyle = WHITE; g.save(); g.shadowColor = 'rgba(28,26,75,.18)'; g.shadowBlur = 20; rr(g, 70 + j * 120, 520, 96, 96, 24); g.fill(); g.restore(); g.drawImage(LOGO[k], 86 + j * 120, 536, 64, 64); });
  return c;
}
function tileCanvas(k) {
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  g.fillStyle = WHITE; rr(g, 0, 0, 512, 512, 120); g.fill(); g.drawImage(LOGO[k], 116, 116, 280, 280); return c;
}
function screenCanvas(f, crop, w = 1280, h = 800) {   // a real frame of his app, for a device screen
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); const im = G.frames[f];
  g.fillStyle = WHITE; g.fillRect(0, 0, w, h); if (im) g.drawImage(im, crop[0], crop[1], crop[2], crop[3], 0, 0, w, h); return c;
}
function phoneCanvas() {   // the session, continued on the phone (drawn as the app's mobile view)
  const c = document.createElement('canvas'); c.width = 600; c.height = 1250; const g = c.getContext('2d');
  g.fillStyle = '#0E0D2A'; g.fillRect(0, 0, 600, 1250);
  g.font = `600 26px "JetBrains Mono", monospace`; g.fillStyle = '#CFCDEB'; g.textAlign = 'left'; g.direction = 'ltr'; g.fillText('9:41', 40, 60);
  g.drawImage(LOGOW.githubcopilot, 40, 110, 64, 64); g.font = FT.en(54); g.fillStyle = WHITE; g.fillText('Copilot', 124, 162);
  g.fillStyle = 'rgba(255,46,160,.18)'; rr(g, 40, 220, 520, 70, 35); g.fill(); g.font = FT.textB(30); g.fillStyle = INK.pinkSoft; g.direction = 'rtl'; g.textAlign = 'center'; g.fillText('הסשן ממשיך מהמחשב ✓', 300, 266);
  const bub = (y, txt, me) => { g.font = FT.textB(32); g.direction = 'rtl'; const w = Math.min(460, g.measureText(txt).width + 60); g.fillStyle = me ? PINK : '#1C1A4B'; rr(g, me ? 560 - w : 40, y, w, 74, 30); g.fill(); g.fillStyle = WHITE; g.textAlign = 'center'; g.fillText(txt, (me ? 560 - w / 2 : 40 + w / 2), y + 48); };
  bub(340, 'תריץ את הטסטים שוב', true); bub(440, 'רץ… 42/42 עברו ✓', false); bub(540, 'מעולה, פתח PR', true); bub(640, 'PR #318 נפתח', false);
  g.fillStyle = '#1C1A4B'; rr(g, 40, 1120, 520, 84, 42); g.fill(); g.font = FT.textB(30); g.fillStyle = '#A9A6CF'; g.textAlign = 'right'; g.fillText('Steer the session…', 520, 1172);
  return c;
}
async function init3() {
  await loadLogos();
  G.frames = {};
  const need = [10320, 9450];   // "Keep work moving from anywhere" (5:44) and "Connect your tools once" (5:15) on his screen
  await Promise.all(need.map(async f => { const im = new Image(); im.src = FRAMES + pad(f) + '.jpg'; await im.decode().catch(() => {}); G.frames[f] = im; }));
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  r.setPixelRatio(1); r.setSize(W1, H1, false); r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.0; r.outputColorSpace = THREE.SRGBColorSpace; r.setClearColor(0x000000, 0);
  const scene = new THREE.Scene(), pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new THREE.DirectionalLight('#FFFFFF', 1.6); key.position.set(3, 5, 6); scene.add(key);
  const pinkL = new THREE.PointLight('#FF2EA0', 30, 30); pinkL.position.set(-4, 1, 3); scene.add(pinkL);
  const vioL = new THREE.PointLight('#8B6CFF', 22, 30); vioL.position.set(4, -1, 2); scene.add(vioL);
  const cam = new THREE.PerspectiveCamera(32, W1 / H1, 0.05, 200);
  const tex = c => { const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return tx; };
  // carousel
  const car = new THREE.Group(); scene.add(car);
  G.cards = SIX.map((s, i) => { const m = makeCard3D(cardCanvas(i), { w: 2.2, h: 1.36, r: 0.15, back: '#1C1A4B' }); const piv = new THREE.Group(); piv.add(m); car.add(piv); return { m, piv }; });
  // fusion: model tiles around a glowing core
  const fus = new THREE.Group(); scene.add(fus);
  G.ftiles = ['claude', 'openai', 'googlegemini', 'moonshotai', 'anthropic', 'githubcopilot'].map(k => { const m = makeCard3D(tileCanvas(k), { w: 0.82, h: 0.82, r: 0.18, back: '#1C1A4B' }); fus.add(m); return m; });
  const coreMat = new THREE.MeshPhysicalMaterial({ color: '#FF2EA0', emissive: '#FF2EA0', emissiveIntensity: 0.55, roughness: 0.12, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 });
  G.core = new THREE.Mesh(new THREE.SphereGeometry(0.75, 64, 48), coreMat); fus.add(G.core);
  G.ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.035, 24, 160), new THREE.MeshPhysicalMaterial({ color: '#FFC74E', emissive: '#FF8F3A', emissiveIntensity: 0.6, metalness: 1, roughness: 0.2 })); fus.add(G.ring);
  // tools: connector tiles + three surfaces
  const tools = new THREE.Group(); scene.add(tools);
  G.ttiles = ['cloudflare', 'gmail', 'slack', 'notion', 'vercel', 'sentry'].map(k => { const m = makeCard3D(tileCanvas(k), { w: 0.62, h: 0.62, r: 0.14, back: '#1C1A4B' }); tools.add(m); return m; });
  const surf = (draw) => { const c = document.createElement('canvas'); c.width = 900; c.height = 600; const g = c.getContext('2d'); draw(g); return c; };
  const cDesk = surf(g => { g.fillStyle = WHITE; rr(g, 0, 0, 900, 600, 56); g.fill(); g.save(); rr(g, 30, 30, 840, 420, 30); g.clip(); const im = G.frames[9450]; if (im) g.drawImage(im, 560, 60, 1800, 900, 30, 30, 840, 420); g.restore();
    g.drawImage(LOGO.github, 40, 486, 80, 80); g.font = FT.en(70); g.fillStyle = INK.ink; g.textAlign = 'left'; g.direction = 'ltr'; g.fillText('GitHub Desktop', 140, 552); });
  const cCli = surf(g => { g.fillStyle = '#0B0A1F'; rr(g, 0, 0, 900, 600, 56); g.fill(); ['#FF5F57', '#FEBC2E', '#28C840'].forEach((cc, i) => { g.fillStyle = cc; circle(g, 60 + i * 34, 56, 11); g.fill(); });
    g.font = `600 40px "JetBrains Mono", monospace`; g.textAlign = 'left'; g.direction = 'ltr'; g.fillStyle = PINK; g.fillText('$', 50, 190); g.fillStyle = WHITE; g.fillText('copilot', 90, 190);
    g.fillStyle = '#7CE3A1'; g.fillText('✓ Gmail · Slack · Cloudflare', 50, 270); g.fillStyle = '#A9A6CF'; g.fillText('  connected once', 50, 330);
    g.drawImage(LOGOW.windowsterminal, 40, 486, 80, 80); g.font = FT.en(70); g.fillStyle = WHITE; g.fillText('CLI', 140, 552); });
  const cVs = surf(g => { g.fillStyle = '#1E1E2E'; rr(g, 0, 0, 900, 600, 56); g.fill(); g.drawImage(LOGO.visualstudiocode, 300, 90, 300, 300);
    g.drawImage(LOGOW.githubcopilot, 40, 486, 80, 80); g.font = FT.en(70); g.fillStyle = WHITE; g.textAlign = 'left'; g.direction = 'ltr'; g.fillText('VS Code', 140, 552); });
  G.surfs = [cDesk, cCli, cVs].map(c => { const m = makeCard3D(c, { w: 1.5, h: 1.0, r: 0.1, back: '#1C1A4B' }); tools.add(m); return m; });
  // devices: laptop with the real app on screen, phone that receives the session
  const dev = new THREE.Group(); scene.add(dev);
  G.lap = makeLaptop({ w: 2.2, dpt: 1.45, bodyColor: '#C9CEDC', screenTex: tex(screenCanvas(10320, [560, 40, 1900, 1150])) }); dev.add(G.lap);
  G.phone = makePhone({ w: 0.9, h: 1.88, bodyColor: '#2B2A5E', screenTex: tex(phoneCanvas()) }); dev.add(G.phone);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(2.6, 64), new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.25 })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.62; dev.add(shadow);
  Object.assign(G, { r, scene, cam, car, fus, tools, dev, groups: [car, fus, tools, dev] });
}
function render3(x, group) {
  G.groups.forEach(g => (g.visible = g === group));
  G.r.render(G.scene, G.cam);
  x.drawImage(G.r.domElement, 0, 0, W1, H1);
}
const proj = (obj, v) => { const p = obj.localToWorld(v.clone()).project(G.cam); return [(p.x * 0.5 + 0.5) * W1, (-p.y * 0.5 + 0.5) * H1]; };
const cardQuad = (m, w, h) => [[-w / 2, h / 2], [w / 2, h / 2], [w / 2, -h / 2], [-w / 2, -h / 2]].map(([a, b]) => proj(m, new THREE.Vector3(a, b, 0)));
function nightStage(x, t, side = 'right') { nightSky(x, W1, H1, t, { side }); }
function kicker(x, t, t0, txt, xr = 1840, y = 120, color = '#CFCDEB') {
  const k = clamp(spring(t - t0, 12, 0.9), 0, 1); if (k <= 0.01) return;
  x.save(); x.globalAlpha = k; mono(x, 26, 700); x.fillStyle = color; x.direction = 'ltr'; x.textAlign = 'right'; x.fillText(txt, xr, y + (1 - k) * 14); x.restore();
}

// the six announcements as a 3D carousel on the night stage; it snaps on the beat to the active one and the camera dives in
const RING = 3.3;
function carouselShot(x, t, a, b, { from, to, tSnap, intro = false, label }) {
  scene(x, t, a, b, { cx: 960, cy: 540, w: 80, h: 80, r: 40 }, (x, t) => {
    nightStage(x, t, to % 2 ? 'left' : 'right');
    const ang = (lerp(from, to, clamp(spring(t - tSnap, 7, 0.55), 0, 1.15))) * Math.PI / 3 + (intro ? -1.4 * (1 - clamp(spring(t - a, 2.2, 0.9), 0, 1)) : 0);
    G.car.rotation.y = -ang;
    G.cards.forEach((c, i) => { const th = i * Math.PI / 3, s = intro ? clamp(spring(t - a - 0.3 - i * 0.18, 14, 0.6), 0, 1.1) : 1;
      c.piv.position.set(RING * Math.sin(th), 0, RING * Math.cos(th)); c.piv.rotation.y = th; c.m.scale.setScalar(Math.max(0.001, s)); });
    const dive = clamp(spring(t - (tSnap + 0.45), 5, 0.95), 0, 1), dz = lerp(RING + 5.4, RING + 2.6, dive);
    G.cam.position.set(0.25 * Math.sin(t * 0.4), lerp(0.9, 0.15, dive), dz); G.cam.lookAt(0, lerp(0.1, 0, dive), RING * 0.55);
    render3(x, G.car);
    // the glow ring on the active card, following its projected corners
    const act = G.cards[to], Q = cardQuad(act.m, 2.2, 1.36), rk = clamp(spring(t - tSnap - 0.2, 10, 0.9), 0, 1);
    if (rk > 0.02 && Math.abs(G.car.rotation.y + to * Math.PI / 3) < 0.25) glowPoly(x, Q, t, 1.1 * rk);
    if (label) kicker(x, t, a + 0.2, label);
  }, { w: 12, fill: 1 });
}
function sixScene(x, t) { carouselShot(x, t, A.summary - 0.15, A.first + 0.9, { from: 0, to: 0, tSnap: A.first - 0.2, intro: true, label: '6 ANNOUNCEMENTS · GITHUB UNIVERSE 2026' }); }
function chapters(x, t) {
  [[0, A.fusion - 0.1], [1, A.parallel - 0.2], [2, A.auto + 1.0], [3, A.tools], [4, A.device], [5, A.images + 0.3]].forEach(([i, t0]) =>
    carouselShot(x, t, t0 - 0.05, t0 + 1.45, { from: Math.max(0, i - 1), to: i, tSnap: t0 + 0.1, label: `CHAPTER 0${i + 1} / 06` }));
  // hands-on spread (night): the proof of the six
  const a = A.demo - 0.05, b = A.demo + 1.5;
  scene(x, t, a, b, { cx: 960, cy: 540, w: 60, h: 60, r: 30 }, (x, t) => {
    nightStage(x, t, 'left'); kicker(x, t, a + 0.1, 'HANDS-ON · GITHUB COPILOT APP', 1800, 360);
    headline(x, t, ['בואו', 'נראה', 'את', 'זה', 'עובד'], [a + 0.05, a + 0.15, a + 0.25, a + 0.35, a + 0.45], null, { y: 600, size: 190, marker: 4, color: WHITE });
    logoTile(x, t, a + 0.5, 'githubcopilot', 300, 560, 220, { ring: 1 });
  }, { w: 12, fill: 1 });
  const c = A.cu - 0.2, d = A.cu + 1.6;
  scene(x, t, c, d, PANEL, (x, t) => {
    nightStage(x, t, 'right'); kicker(x, t, c + 0.1, 'NEW · PREVIEW', 1800, 380);
    headline(x, t, ['Computer', 'Use'], [c + 0.1, c + 0.3], null, { y: 620, size: 220, ltr: true, right: 1820, marker: 1, color: WHITE });
  }, { w: 12, fill: 1 });
}

// 01 FUSION in 3D: the models' tiles orbit, then melt into one glowing core
function fuseScene(x, t) {
  const a = A.fuse - 0.3, b = A.claims - 0.3;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightStage(x, t, 'left');
    const suck = clamp(spring(t - (a + 3.8), 3.2, 1), 0, 1), cp = clamp(spring(t - a - 0.6, 8, 0.7), 0, 1.1), n = G.ftiles.length;
    // a warm halo behind the core (2D), growing as the models melt in
    const hr = 380 * (0.6 + 0.6 * suck) * cp; if (hr > 1) { const g = x.createRadialGradient(960, 600, 0, 960, 600, hr); g.addColorStop(0, 'rgba(255,199,78,.55)'); g.addColorStop(0.4, 'rgba(255,46,160,.35)'); g.addColorStop(1, 'rgba(255,46,160,0)'); x.fillStyle = g; x.fillRect(0, 0, W1, H1); }
    G.ftiles.forEach((m, i) => { const th = i * 2 * Math.PI / n + (t - a) * 0.7 + suck * 3.5, rad = lerp(2.5, 0.05, suck), s = clamp(spring(t - a - 0.3 - i * 0.12, 14, 0.6), 0, 1.1) * (1 - suck);
      m.position.set(rad * Math.cos(th), 0.45 * Math.sin(th * 1.3) - 0.25, rad * Math.sin(th) * 0.6); m.scale.setScalar(Math.max(0.001, s)); m.lookAt(G.cam.position); });
    G.core.scale.setScalar(Math.max(0.001, cp * (1 + 0.35 * suck + 0.04 * beatPulse(t)))); G.core.position.set(0, -0.25, 0);
    G.ring.scale.setScalar(Math.max(0.001, cp * (1 + 0.3 * suck))); G.ring.position.set(0, -0.25, 0); G.ring.rotation.set(1.2 + 0.2 * Math.sin(t), t * 0.8, 0);
    G.cam.position.set(0.6 * Math.sin((t - a) * 0.25), 0.7, 7.2 - 0.6 * suck); G.cam.lookAt(0, -0.2, 0);
    render3(x, G.fus);
    headline(x, t, ['Fusion', '=', 'התכה'], [a + 0.1, a + 0.3, a + 0.45], null, { y: 175, size: 130, marker: 2, color: WHITE });
    if (suck > 0.6) { x.save(); x.globalAlpha = (suck - 0.6) / 0.4; x.font = FT.en(64); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText('COPILOT FUSION', 960, 625); x.restore(); }
    chip(x, t, a + 4.4, 960, 900, 'אנחנו נבחר את המודלים עבורכם', { size: 36, fill: PINK, ink: WHITE, glow: true });
    kicker(x, t, a + 0.2, '01 · COPILOT FUSION', 1840, 300);
  }, { fill: 1 });
}

// 04 TOOLS in 3D: the connectors' tiles orbit, merge into one connection, and flow into Desktop, CLI and VS Code
function toolsScene(x, t) {
  const a = A.once - 0.2, b = A.tools_end - 0.1;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightStage(x, t, 'right');
    const merge = clamp(spring(t - (A.once + 3.6), 4, 0.95), 0, 1), n = G.ttiles.length, HUB = new THREE.Vector3(0, 1.0, 0);
    G.ttiles.forEach((m, i) => { const th = i * 2 * Math.PI / n + (t - a) * 0.6, rad = lerp(1.9, 0.1, merge), s = clamp(spring(t - a - 0.2 - i * 0.1, 14, 0.6), 0, 1.1) * (1 - 0.9 * merge);
      m.position.set(HUB.x + rad * Math.cos(th), HUB.y + 0.35 * Math.sin(th), rad * Math.sin(th) * 0.5); m.scale.setScalar(Math.max(0.001, s)); m.lookAt(G.cam.position); });
    const on = [A.once + 4.2, A.cli, A.vscode];
    G.surfs.forEach((m, i) => { const s = clamp(spring(t - on[i] + 0.2, 12, 0.6), 0, 1.1), X = (1 - i) * 1.9;   // RTL: Desktop on the right
      m.position.set(X, -0.75 + 0.05 * Math.sin(t * 1.3 + i), 0); m.rotation.set(-0.12, -X * 0.18, 0); m.scale.setScalar(Math.max(0.001, s)); });
    G.cam.position.set(0.5 * Math.sin((t - a) * 0.2), 0.5, 6.3); G.cam.lookAt(0, 0.0, 0);
    render3(x, G.tools);
    // the single connection (2D glow core at the projected hub) and its beams into each surface
    const [hx, hy] = proj(G.tools, HUB), hk = merge;
    if (hk > 0.02) { neonRing(x, hx, hy, 130 * hk, 130 * hk, 65 * hk, t * 1.2, { lw: 4, glow: 22, power: 0.9 }); circle(x, hx, hy, 58 * hk); x.fillStyle = NIGHT; x.fill();
      x.font = FT.textB(26 * hk + 1); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'rtl'; x.fillText('חיבור אחד', hx, hy + 9 * hk); }
    G.surfs.forEach((m, i) => { const k = clamp(spring(t - on[i], 9, 0.9), 0, 1); if (k <= 0.01 || hk < 0.5) return; const [sx, sy] = proj(m, new THREE.Vector3(0, 0.5, 0));
      x.save(); x.strokeStyle = PINK; x.lineWidth = 5; x.setLineDash([4, 14]); x.lineCap = 'round'; x.shadowColor = PINK; x.shadowBlur = 16; x.beginPath(); x.moveTo(hx, hy + 60); x.lineTo(lerp(hx, sx, k), lerp(hy + 60, sy, k)); x.stroke(); x.restore();
      if (t > A.everywhere) glowPoly(x, cardQuad(m, 1.5, 1.0), t, 1); });
    headline(x, t, ['מתחברים', 'פעם', 'אחת'], [a + 0.1, a + 0.3, a + 0.45], null, { y: 150, size: 120, marker: 2, color: WHITE });
    chip(x, t, A.everywhere, 960, 930, 'זמין מכל מקום, בלי להתחבר שוב', { size: 36, fill: PINK, ink: WHITE, glow: true });
  }, { fill: 1 });
}
// 05 ANY DEVICE in 3D: the laptop carries his real app ("Keep work moving from anywhere"); the session is steered to the phone
function deviceScene(x, t) {
  const a = A.phone - 0.3, b = A.device_end - 0.1;
  scene(x, t, a, b, PANEL, (x, t) => {
    nightStage(x, t, 'left');
    const g = x.createRadialGradient(960, 1250, 0, 960, 1250, 900); g.addColorStop(0, 'rgba(255,143,58,.35)'); g.addColorStop(1, 'rgba(255,143,58,0)'); x.fillStyle = g; x.fillRect(0, 0, W1, H1);
    const lid = clamp(spring(t - a - 0.2, 6, 0.8), 0, 1.04), ph = clamp(spring(t - (A.cloud_session + 1.2), 8, 0.7), 0, 1.06), st = clamp(spring(t - A.steer, 6, 0.9), 0, 1);
    G.lap.position.set(1.0, -0.62, 0); G.lap.rotation.set(0, -0.32, 0); G.lap.userData.lid.rotation.x = Math.PI / 2 - 1.85 * lid;   // kit hinge: pi/2 closed
    G.phone.position.set(lerp(-3.6, -1.75, ph), lerp(-1.0, 0.05, ph), 0.6); G.phone.rotation.set(-0.05, 0.42 - 0.1 * st, 0.02); G.phone.scale.setScalar(Math.max(0.001, ph));
    G.phone.userData.screenMat.color.setScalar(lerp(0.12, 1, st));
    G.cam.position.set(0.4 * Math.sin((t - a) * 0.22) - 0.2, 0.9, 6.4); G.cam.lookAt(-0.2, 0.05, 0);
    render3(x, G.dev);
    // steer: an arc of light from the laptop screen to the phone, a dot riding it
    if (t > A.steer - 0.1) { const [lx, ly] = proj(G.lap, new THREE.Vector3(0, 0.75, -0.5)), [px, py] = proj(G.phone, new THREE.Vector3(0, 0.2, 0.1)), mx = (lx + px) / 2, my = Math.min(ly, py) - 260;
      x.save(); x.strokeStyle = PINK; x.lineWidth = 5; x.setLineDash([4, 14]); x.lineCap = 'round'; x.shadowColor = PINK; x.shadowBlur = 18; x.beginPath(); x.moveTo(lx, ly);
      const N = 40; for (let i = 1; i <= Math.round(N * st); i++) { const u = i / N; x.lineTo((1 - u) * (1 - u) * lx + 2 * u * (1 - u) * mx + u * u * px, (1 - u) * (1 - u) * ly + 2 * u * (1 - u) * my + u * u * py); } x.stroke(); x.restore();
      const u = ((t - A.steer) * 0.7) % 1, bxp = (1 - u) * (1 - u) * lx + 2 * u * (1 - u) * mx + u * u * px, byp = (1 - u) * (1 - u) * ly + 2 * u * (1 - u) * my + u * u * py;
      if (st > 0.9) { x.fillStyle = INK.goldFlat; circle(x, bxp, byp, 12); x.fill(); } }
    headline(x, t, ['ממשיכים', 'מכל', 'מכשיר'], [a + 0.1, a + 0.3, a + 0.45], null, { y: 150, size: 120, marker: 0, color: WHITE });
    chip(x, t, A.cloud_session, 1250, 930, 'מתחילים סשן: בענן או במחשב', { size: 34, fill: WHITE, ink: INK.ink, out: A.steer - 0.2 });
    chip(x, t, A.steer, 960, 930, 'Steer  →  ממשיכים מהטלפון', { size: 42, fill: PINK, ink: WHITE, glow: true });
  }, { fill: 1 });
}

// "it's not 'give a task -> pick Claude or OpenAI'": A vs B, then the route switches models mid-task, then all melt into one
function routeScene(x, t) {
  const a = A.cloud - 0.3, b = A.fusion_end + 0.1;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    infoCard(x, t, a + 0.1, 960, 170, 860, 120, 'משימה: לפתח אפליקציה', null, { size: 64 });
    const ph = clamp(spring(t - (A.start_with - 1.2), 7, 0.9), 0, 1);       // 0 = the naive way, 1 = the route
    if (ph < 0.98) {   // the naive pick: one model, then struck through
      x.save(); x.globalAlpha = 1 - ph; x.translate(0, -ph * 60);
      arrow(x, 960, 250, 960, 380, clamp(spring(t - a - 0.4, 9, 0.9), 0, 1), INK.ink2, 5);
      infoCard(x, t, a + 0.6, 1250, 480, 420, 150, 'Claude', 'או', { size: 70, subInk: INK.ink2, logo: 'claude' });
      infoCard(x, t, a + 0.75, 670, 480, 420, 150, 'OpenAI', null, { size: 70, logo: 'openai' });
      const st = clamp(spring(t - (A.cloud + 2.6), 12, 0.8), 0, 1);
      if (st > 0.01) { x.strokeStyle = PINK; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); x.moveTo(420, 600); x.lineTo(420 + 1080 * st, 380); x.stroke(); }
      chip(x, t, A.cloud + 2.7, 960, 700, 'לא סתם "בוא נבחר מודל"', { size: 36, fill: WHITE, ink: INK.ink });
      x.restore();
    }
    if (ph > 0.02) {   // the route: start with A, move to B, continue with C
      const L = 300, Rr = 1620, y = 560, segs = [['Opus 5.5', 'להתחיל עם'], ['GPT-6.1 Sol', 'לעבור ל'], ['Gemini 4 Argon', 'להמשיך עם']];
      const merge = clamp(spring(t - A.fuse_all, 6, 0.9), 0, 1);
      x.save(); x.globalAlpha = ph;
      segs.forEach(([m, he], i) => {
        const ti = A.start_with + i * 0.9, w0 = (Rr - L) / 3, X = Rr - (i + 1) * w0 + 10, gw = (w0 - 20) * clamp(spring(t - ti, 10, 0.85), 0, 1);
        const on = t >= ti && (i === 2 || t < A.start_with + (i + 1) * 0.9 + 4) ? 1 : 0.35;
        x.save(); x.globalAlpha = ph * (merge > 0.5 ? 1 : on); rr(x, X + (w0 - 20) - gw, y - 60, gw, 120, 30);
        x.fillStyle = merge > 0.02 ? gradPaint(x, L, 0, Rr, 0, [INK.violet, PINK, INK.orange]) : [INK.ink, PINK, INK.violet][i]; x.fill(); x.restore();
        if (gw > 40 && merge < 0.6) { x.save(); x.globalAlpha = ph * (1 - merge); x.font = FT.en(46); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText(m, X + (w0 - 20) / 2, y + 16);
          x.font = FT.textB(34); x.fillStyle = INK.ink2; x.direction = 'rtl'; x.fillText(he, X + (w0 - 20) / 2, y - 90); x.restore(); }
      });
      if (merge > 0.01) { softRing(x, (L + Rr) / 2, y, Rr - L - 20, 120, 30, t, merge);
        x.save(); x.globalAlpha = merge; x.font = FT.en(70); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText('COPILOT FUSION', (L + Rr) / 2, y + 25); x.restore(); }
      chip(x, t, A.start_with + 3.2, 960, 760, 'סוויטה שלמה של ניתובים, בתוך המשימה', { size: 34, fill: WHITE, ink: INK.ink, out: A.fuse_all - 0.3 });
      chip(x, t, A.fuse_all + 0.3, 960, 760, 'כל המודלים, מותכים למודל אחד', { size: 38, fill: PINK, ink: WHITE, glow: true });
      x.restore();
    }
  }, { fill: 1 });
}
// "the credits will run out slower ... 30% off" (the banner in the app: 30% off Fusion usage through Nov 30, 2026)
function discScene(x, t) {
  const a = A.slower - 0.2, b = A.disc_end + 0.9;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'left' });
    headline(x, t, ['הקרדיטים', 'ייגמרו', 'לאט', 'יותר'], [a + 0.1, a + 0.3, a + 0.5, a + 0.65], null, { y: 190, size: 130, marker: 2 });
    const s = pop(t, A.disc - 0.3, 12, 0.6);
    if (s > 0.01) { x.save(); x.translate(960, 560); x.scale(s, s); softRing(x, 0, 0, 760, 360, 60, t, 1); card(x, 0, 0, 760, 360, 60, { fill: WHITE, depth: 1 }); x.restore(); }
    counter(x, t, A.disc - 0.2, 960, 560, 30, v => '−' + Math.round(v) + '%', 230, PINK);
    logoTile(x, t, A.disc - 0.1, 'githubcopilot', 1340, 410, 120, { ring: 0.8 });
    chip(x, t, A.disc + 0.4, 960, 800, 'על שימוש ב-Copilot Fusion · עד 30.11.2026', { size: 32, fill: WHITE, ink: INK.ink, shadow: true });
  }, { fill: 1 });
}
// 02 PROJECTS
const REPOS = [['web-app', 1450, 360], ['api', 470, 360], ['docs', 1450, 760], ['mobile', 470, 760]];
function repoCard(x, t, t0, cx, cy, name, opt = {}) {
  const s = pop(t, t0, 16, 0.6); if (s <= 0.01) return;
  x.save(); x.translate(cx, cy); x.scale(s, s);
  if (opt.ring) softRing(x, 0, 0, 380, 130, 30, t, opt.ring);
  card(x, 0, 0, 380, 130, 30, { fill: '#0E0D2A', depth: 0.7, shadow: 'rgba(255,46,160,.2)', stroke: 'rgba(255,255,255,.12)' });
  logo(x, 'github', -150, 0, 56, true); mono(x, 24, 600); x.fillStyle = INK.onNight3; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('repo', -105, -20);
  mono(x, 40, 700); x.fillStyle = WHITE; x.fillText(name, -105, 30);
  if (opt.check) { x.fillStyle = '#28C840'; circle(x, 150, 0, 22 * opt.check); x.fill(); x.strokeStyle = WHITE; x.lineWidth = 5; x.beginPath(); x.moveTo(140, 0); x.lineTo(148, 9); x.lineTo(162, -9); x.stroke(); }
  x.restore();
}
function reposScene(x, t) {
  const a = A.repos2 - 0.3, b = A.create_projects - 0.3;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    headline(x, t, ['כמה', 'ריפוזיטוריז,', 'קשורים'], [a + 0.1, a + 0.3, A.repos2 + 1.6], null, { y: 175, size: 120, marker: 2 });
    repoCard(x, t, a + 0.3, 1300, 560, 'web-app'); repoCard(x, t, a + 0.7, 620, 560, 'api');
    const k = clamp(spring(t - (A.repos2 + 1.6), 8, 0.9), 0, 1);
    if (k > 0.01) { x.save(); x.strokeStyle = PINK; x.lineWidth = 6; x.setLineDash([4, 16]); x.lineCap = 'round'; x.beginPath(); x.moveTo(1100, 560); x.lineTo(1100 - 280 * k, 560); x.stroke(); x.restore(); }
  }, { fill: 1 });
}
function hubScene(x, t) {
  const a = A.repos + 1.5, b = A.proj_end - 0.1;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'left' });
    const cx = 960, cy = 560, hs = pop(t, a + 0.1, 12, 0.6);
    REPOS.forEach(([n, px, py], i) => {
      const lk = clamp(spring(t - a - 0.4 - i * 0.15, 9, 0.9), 0, 1);
      x.save(); x.strokeStyle = 'rgba(255,46,160,.55)'; x.lineWidth = 5; x.setLineDash([3, 14]); x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(lerp(cx, px, lk), lerp(cy, py, lk)); x.stroke(); x.restore();
      // the docs change ripples from 'docs' to every other repo, and Copilot checks each one
      const rip = n === 'docs' ? 0 : clamp(spring(t - (A.other_proj + 0.4 + i * 0.25), 9, 0.9), 0, 1);
      const ck = clamp(spring(t - (A.proj_end - 6.5 + i * 0.3), 12, 0.6), 0, 1.1);
      repoCard(x, t, a + 0.3 + i * 0.15, px, py, n, { ring: n === 'docs' && t > A.docs ? 0.9 : rip * 0.6, check: t > A.proj_end - 6.5 ? ck : 0 });
      if (n !== 'docs' && t > A.other_proj) { const u = clamp((t - A.other_proj - i * 0.25) / 1.0, 0, 1), dx = REPOS[2][1], dy = REPOS[2][2];
        if (u > 0 && u < 1) { const bx = lerp(dx, px, io3(u)), by = lerp(dy, py, io3(u)); x.fillStyle = INK.orange; circle(x, bx, by, 14); x.fill(); } }
    });
    if (hs > 0.01) { x.save(); x.translate(cx, cy); x.scale(hs, hs); softRing(x, 0, 0, 520, 220, 40, t, t > A.same_session ? 1.2 : 0.7);
      card(x, 0, 0, 520, 220, 40, { fill: WHITE, depth: 1 }); x.font = FT.en(64); x.fillStyle = INK.ink; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText('COPILOT PROJECT', 0, -10);
      x.font = FT.textB(32); x.fillStyle = INK.pinkDeep; x.direction = 'rtl'; x.fillText(t > A.same_session ? 'אותו סשן, על כל הריפוזיטוריז' : 'משימה אחת · כמה ריפוזיטוריז', 0, 58); x.restore(); }
    chip(x, t, A.memory - 0.6, 960, 760, 'מנהל את הסשן', { size: 30, fill: WHITE, ink: INK.ink, out: A.docs - 0.5 });
    chip(x, t, A.memory, 960, 830, 'ואת הזיכרון', { size: 30, fill: WHITE, ink: INK.ink, out: A.docs - 0.5 });
    chip(x, t, A.docs, 960, 790, 'שינוי אחד: עדכון הדוקומנטציה', { size: 34, fill: PINK, ink: WHITE, glow: true, out: A.proj_end - 6.8 });
    chip(x, t, A.proj_end - 6.5, 960, 790, 'Copilot מבין איפה לשנות, בכל ריפו', { size: 34, fill: PINK, ink: WHITE, glow: true });
    mono(x, 28, 700); x.fillStyle = INK.pinkDeep; x.direction = 'ltr'; x.textAlign = 'right'; x.globalAlpha = 0.9; x.fillText('02 · COPILOT PROJECTS', 1840, 140); x.globalAlpha = 1;
  }, { fill: 1 });
}
// 03 AUTOMATIONS: two rules, each a trigger -> an action
function rule(x, t, t0, t1, y, trig, act, sub) {
  const s = pop(t, t0, 16, 0.6); if (s <= 0.01) return;
  x.save(); x.translate(0, (1 - clamp(s, 0, 1)) * 40);
  infoCard(x, t, t0, 1430, y, 520, 150, trig, 'TRIGGER', { size: 60, subInk: INK.ink2, logo: 'github' });
  arrow(x, 1150, y, 860, y, clamp(spring(t - t0 - 0.3, 9, 0.9), 0, 1));
  infoCard(x, t, t1, 520, y, 640, 150, act, sub, { size: 56, ring: 0.9, logo: 'githubcopilot' });
  x.restore();
}
function autoScene(x, t) {
  const a = A.pr - 0.5, b = A.auto_end - 0.1;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    headline(x, t, ['בכל', 'פעם', 'ש...'], [a + 0.1, a + 0.25, a + 0.4], null, { y: 170, size: 120, marker: 1 });
    rule(x, t, A.pr - 0.2, A.review, 380, 'PR נפתח', 'Code Review', 'לפי הסטנדרט שלנו');
    rule(x, t, A.issues - 0.2, A.triage, 620, 'Issue נפתח', 'Triage', 'חוקר · מנתב · מטפל');
    ['CI/CD', 'קונקטורים', 'אוטומציות רגילות'].forEach((c, i) => chip(x, t, A.cicd + i * 1.5, 1500 - i * 470, 850, c, { size: 32, fill: i ? WHITE : PINK, ink: i ? INK.ink : WHITE, glow: !i }));
    mono(x, 28, 700); x.fillStyle = INK.pinkDeep; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('03 · COPILOT AUTOMATIONS', 80, 140);
  }, { fill: 1 });
}
// ATMOSPHERE: licensed stock footage, full bleed, slow push + drift, kinetic chips on top
function stockShot(x, t, s, top) {
  scene(x, t, s.a, s.b, PANEL, (x, t) => {
    const im = get(s.id + ':' + stockIdx(s, t)); if (!im) { paperSky(x, W1, H1, t); return; }
    const z = 1.04 + 0.12 * clamp((t - s.a) / (s.b - s.a)), dx = 40 * Math.sin((t - s.a) * 0.7);
    x.save(); x.translate(960 + dx, 540); x.scale(z, z); x.drawImage(im, -960, -540, 1920, 1080); x.restore();
    const g = x.createLinearGradient(0, 400, 0, 1080); g.addColorStop(0, 'rgba(11,10,31,0)'); g.addColorStop(1, 'rgba(11,10,31,.7)'); x.fillStyle = g; x.fillRect(0, 0, 1920, 1080);
    top(x, t);
  }, { fill: 1 });
}
function atmosphere(x, t) {
  const Dk = STOCK.desk;
  stockShot(x, t, Dk, (x, t) => {
    chip(x, t, Dk.a + 0.3, 1400, 230, 'Copilot לוחץ על אפליקציות הדסקטופ', { size: 40, fill: PINK, ink: WHITE, glow: true, out: Dk.b - 0.25 });
    [['חלונות', A.os], ['דפדפן', A.browser], ['נגן מוזיקה', A.music], ['תקלה במחשב? "תסתער"', A.fix]].forEach(([w, t0], i) =>
      chip(x, t, t0, [1500, 1100, 700, 1100][i], [380, 380, 380, 500][i] + 8 * Math.sin(t * 1.3 + i), w, { size: 36, fill: WHITE, ink: INK.ink, out: Dk.b - 0.25 }));
  });
}
// MODEL PRICES (numbers read off the model picker in the app: AI credits per 1M tokens)
function priceScene(x, t) {
  const a = A.price400 - 0.4, b = A.price_end + 0.2;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    headline(x, t, ['כמה', 'עולה', 'מיליון', 'טוקנים?'], [a + 0.1, a + 0.25, a + 0.4, a + 0.55], null, { y: 165, size: 115, marker: 3 });
    const col = (cx, t0, name, ctx, rows, total, tTot, ring) => {
      const s = pop(t, t0, 14, 0.62); if (s <= 0.01) return;
      x.save(); x.translate(cx, 560); x.scale(s, s);
      softRing(x, 0, 0, 640, 600, 44, t, ring);
      card(x, 0, 0, 640, 600, 44, { fill: WHITE, depth: 1 });
      logo(x, name.startsWith('Claude') ? 'claude' : 'openai', 0, -248, 58); x.font = FT.en(60); x.fillStyle = INK.ink; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText(name, 0, -165);
      mono(x, 24, 600); x.fillStyle = INK.ink2; x.fillText(ctx, 0, -125);
      rows.forEach(([lab, v, tv], i) => { const y = -70 + i * 80; if (t < tv - 0.1) return;
        mono(x, 30, 600); x.fillStyle = INK.ink2; x.textAlign = 'left'; x.fillText(lab, -260, y);
        x.font = FT.en(54); x.fillStyle = INK.ink; x.textAlign = 'right'; x.fillText(f0(lerp(0, v, clamp(spring(t - tv, 3.5, 1), 0, 1))), 260, y + 6); });
      if (t > tTot - 0.1) { x.fillStyle = 'rgba(28,26,75,.12)'; x.fillRect(-260, 170, 520, 3);
        x.font = FT.en(96); x.fillStyle = PINK; x.textAlign = 'center'; x.fillText('≈ ' + f0(lerp(0, total, clamp(spring(t - tTot, 3.2, 1), 0, 1))), 0, 260); }
      x.restore();
    };
    col(1380, a + 0.3, 'Claude Opus 5.5', 'context 328K–1.1M · 5 reasoning levels', [['Input', 400, A.price400], ['Cached', 20, A.price400 + 5.5], ['Output', 2000, A.output]], 2420, A.total, t > A.total && t < A.astra ? 1.1 : 0.4);
    col(560, A.astra - 0.2, 'GPT-6 Astra', 'context 400K–1.2M', [['Input', 1000, A.astra_price - 0.4], ['Cached', 100, A.astra_price], ['Output', 5000, A.astra_price + 0.4]], 6100, A.astra_price + 1.0, t > A.astra_price + 1 ? 1.1 : 0.4);
    chip(x, t, a + 0.8, 960, 930, 'AI credits למיליון טוקנים · מתוך בורר המודלים', { size: 28, fill: WHITE, ink: INK.ink2 });
  }, { fill: 1 });
}
// FUSION EFFORT: Standard / High / Max (the page's own descriptions), and his pick
function effortScene(x, t) {
  const a = A.standard - 0.5, b = A.my_high + 2.6;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'left' });
    headline(x, t, ['Fusion:', 'מה', 'רמת', 'ה-Effort?'], [a + 0.1, a + 0.25, a + 0.4, a + 0.55], null, { y: 165, size: 110, marker: 3 });
    const L3 = [['Standard', 'מודלים ורסטיליים ומהירים', A.standard], ['High', 'מודלים חכמים יותר', A.high], ['Max', 'מודלי הדגל · הכי יקרים', A.max]];
    const act = t > A.my_high ? 1 : L3.reduce((c, l, i) => (t >= l[2] ? i : c), -1);
    L3.forEach(([n, d, t0], i) => {
      const cx = 1450 - i * 490, isAct = i === act, dim = act >= 0 && !isAct ? 1 : 0;
      infoCard(x, t, a + 0.3 + i * 0.15, cx, 560, 440, 360, n, d, { size: 96, subSize: 30, ring: isAct ? 1.2 : 0, dim, ink: isAct ? PINK : INK.ink });
    });
    chip(x, t, A.confusing, 960, 830, 'קצת מבלבל – הייתי מעדיף שגם זה יהיה אוטומטי', { size: 32, fill: WHITE, ink: INK.ink, out: A.my_high - 0.4 });
    chip(x, t, A.my_high, 960, 830, 'הבחירה שלי: High', { size: 44, fill: PINK, ink: WHITE, glow: true });
  }, { fill: 1 });
}
// CASCADE: what the Fusion route did with the image request
function cascadeScene(x, t) {
  const a = A.cascade - 0.2, b = A.nano + 2.0;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    headline(x, t, ['Fusion', 'בפעולה:', 'Cascade'], [a + 0.1, a + 0.3, a + 0.5], null, { y: 160, size: 115, marker: 2 });
    const steps = [['Solver', 'GPT-6.1 Sol', A.review_pass - 1.2], ['Review pass', 'בודק את התוצאה', A.review_pass], ['Fixes', 'מתקן אם צריך', A.review_pass + 1.0]];
    const act = t > A.gpt61 - 0.2 ? 0 : -1;
    steps.forEach(([n, d, t0], i) => {
      const cx = 1480 - i * 520;
      infoCard(x, t, t0, cx, 480, 440, 230, n, i === 0 && t > A.gpt61 ? 'GPT-6.1 Sol' : d, { size: 70, ring: act === i ? 1.2 : 0.3, logo: i === 0 ? 'openai' : 'githubcopilot' });
      if (i < 2) arrow(x, cx - 240, 480, cx - 280, 480, clamp(spring(t - t0 - 0.3, 9, 0.9), 0, 1), PINK, 6);
    });
    mono(x, 26, 500); x.fillStyle = INK.ink2; x.direction = 'ltr'; x.textAlign = 'center'; x.globalAlpha = clamp((t - a - 0.8) * 3);
    x.fillText('“A solver will work on your request, followed by a review pass and fixes if needed.”', 960, 690); x.globalAlpha = 1;
    chip(x, t, A.nano, 1480, 800, 'skill: nano-banana-2', { size: 32, fill: NIGHT, ink: WHITE, line: 'rgba(255,255,255,.2)', glow: true });
  }, { fill: 1 });
}
// "sounds like a gimmick, but imagine during development": three things an image can be
function gimmickScene(x, t) {
  const a = A.gimmick - 0.2, b = A.gimmick_end + 0.4;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'left' });
    headline(x, t, ['גימיק?', 'תחשבו', 'שוב'], [a + 0.1, A.gimmick + 0.8, A.gimmick + 1.0], null, { y: 170, size: 130, marker: 0 });
    const cards = [['מוקאפ ל-UI חדש', A.ui], ['אינפוגרפיקה', A.infographic], ['תרשים זרימה', A.infographic + 1.4]];
    cards.forEach(([n, t0], i) => {
      const cx = 1450 - i * 490, s = pop(t, t0, 14, 0.6); if (s <= 0.01) return;
      x.save(); x.translate(cx, 560); x.scale(s, s); softRing(x, 0, 0, 430, 430, 40, t, t > cards[2][1] && i === 2 ? 1 : 0.5); card(x, 0, 0, 430, 430, 40, { fill: WHITE, depth: 0.9 });
      x.save(); rrc(x, 0, -40, 370, 280, 24); x.clip(); x.fillStyle = INK.cloud; x.fillRect(-185, -180, 370, 280);
      if (i === 0) { x.fillStyle = 'rgba(28,26,75,.85)'; x.fillRect(-185, -180, 370, 40); [0, 1, 2].forEach(k => { rr(x, -160 + k * 115, -110, 95, 70, 12); x.fillStyle = k === 1 ? PINK : 'rgba(28,26,75,.15)'; x.fill(); }); rr(x, -160, -20, 320, 70, 14); x.fillStyle = 'rgba(28,26,75,.1)'; x.fill(); }
      if (i === 1) { [0.5, 0.8, 0.35, 0.95].forEach((v, k) => { rr(x, -150 + k * 82, 80 - 200 * v * clamp(spring(t - t0 - k * 0.1, 7, 0.8), 0, 1), 56, 200 * v, 10); x.fillStyle = k === 3 ? PINK : INK.violet; x.fill(); }); }
      if (i === 2) { [[-110, -120], [110, -120], [0, 0]].forEach(([px, py], k) => { rrc(x, px, py, 140, 64, 16); x.fillStyle = k === 2 ? PINK : WHITE; x.fill(); x.strokeStyle = INK.ink; x.lineWidth = 2; x.stroke(); });
        arrow(x, -110, -88, -20, -34, clamp(spring(t - t0 - 0.2, 9, 0.9), 0, 1), INK.ink, 3); arrow(x, 110, -88, 20, -34, clamp(spring(t - t0 - 0.3, 9, 0.9), 0, 1), INK.ink, 3); }
      x.restore();
      x.font = FT.he(64); x.fillStyle = INK.ink; x.textAlign = 'center'; x.direction = 'rtl'; x.fillText(n, 0, 170); x.restore();
    });
  }, { fill: 1 });
}
// TRANSPARENCY: what the image cost, read off his session panel
function costScene(x, t) {
  const a = A.transparency - 0.2, b = A.cost_end + 0.4;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'right' });
    headline(x, t, ['רק', 'GitHub', 'מראה', 'את', 'זה'], [a + 0.1, a + 0.25, a + 0.4, a + 0.5, a + 0.6], null, { y: 165, size: 115, marker: 1 });
    const box = (cx, t0, label, draw, ring) => { const s = pop(t, t0, 14, 0.62); if (s <= 0.01) return; x.save(); x.translate(cx, 540); x.scale(s, s); softRing(x, 0, 0, 470, 380, 40, t, ring); card(x, 0, 0, 470, 380, 40, { fill: WHITE, depth: 0.9 });
      mono(x, 28, 700); x.fillStyle = INK.ink2; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText(label, 0, 140); x.restore(); draw(cx); };
    box(1480, a + 0.4, 'AI CREDITS · SESSION', cx => { const v = t < A.cost ? 9.05 : t < A.cost2 ? lerp(9.05, 25.7, clamp(spring(t - A.cost, 3, 1), 0, 1)) : lerp(25.7, 26.3, clamp(spring(t - A.cost2, 4, 1), 0, 1));
      if (t > a + 0.4) { x.save(); x.font = FT.en(150); x.fillStyle = t > A.cost ? PINK : INK.ink; x.textAlign = 'center'; x.direction = 'ltr'; x.fillText(f2(v), cx, 570); x.restore(); } }, t > A.cost ? 1.1 : 0.5);
    box(960, A.tokens - 0.2, 'TOKENS', cx => counter(x, t, A.tokens - 0.2, cx, 520, 133.9, v => f1(v) + 'K', 150, INK.ink), 0.5);
    box(440, A.images16 - 0.2, 'IMAGES', cx => counter(x, t, A.images16 - 0.2, cx, 520, 16.6, f1, 150, INK.ink), 0.5);
    chip(x, t, A.cost, 1480, 820, 'השער עלה 25.7 קרדיטים', { size: 30, fill: PINK, ink: WHITE, glow: true });
  }, { fill: 1 });
}
// REVIEW PASS: it generated two covers and kept the better one
function reviewScene(x, t) {
  const a = A.rev2 - 0.3, b = A.better + 2.2;
  scene(x, t, a, b, PANEL, (x, t) => {
    paperSky(x, W1, H1, t, { side: 'left' });
    headline(x, t, ['Review', 'pass'], [a + 0.1, a + 0.3], null, { y: 165, size: 120, ltr: true, right: 1800, marker: 1 });
    const pick = clamp(spring(t - A.better, 9, 0.85), 0, 1);
    [[IMG1, 1380, 'תמונה 1', A.rev2 - 0.1], [IMG2, 560, 'תמונה 2', A.fix2 + 1.4]].forEach(([f, cx, lab, t0], i) => {
      const im = get(f), s = pop(t, t0, 14, 0.62); if (!im || s <= 0.01) return;
      const w = 680, h = 510, best = i === 1 ? pick : 0, dim = i === 0 ? pick : 0;
      x.save(); x.translate(cx, 560); x.scale(s * (1 + 0.06 * best), s * (1 + 0.06 * best)); x.globalAlpha = 1 - 0.5 * dim;
      softRing(x, 0, 0, w, h, 30, t, best * 1.3 + 0.2);
      card(x, 0, 0, w, h, 30, { fill: NIGHT, depth: 1 });
      // crop the generated cover out of his screen (it fills the left of the frame)
      x.save(); rrc(x, 0, 0, w, h, 30); x.clip(); x.drawImage(im, 0, 0, 1920, 1440, -w / 2, -h / 2, w, h); x.restore();
      x.restore();
      chip(x, t, t0 + 0.2, cx, 920, lab, { size: 30, fill: WHITE, ink: INK.ink });
    });
    chip(x, t, A.fix2, 960, 560, 'תיקון אוטומטי →', { size: 32, fill: NIGHT, ink: WHITE, out: A.better - 0.3 });
    chip(x, t, A.better + 0.1, 560, 240, '✓ הרבה יותר טובה', { size: 40, fill: PINK, ink: WHITE, glow: true });
  }, { fill: 1 });
}

// REAL B-ROLL: a live capture of the actual page, in a browser card; scroll/zoom keys; spotlight on real DOM rects
const BCW = 1680, BCH = 850, BC = document.createElement('canvas'); BC.width = BCW; BC.height = BCH; const bx = BC.getContext('2d');
function browserCard(x, t, a, b, page, url, keys, hls, tilt, opt = {}) {
  scene(x, t, a, b, PANEL, (x, t) => {
    if (opt.bg) opt.bg(x, t); else paperSky(x, W1, H1, t, { side: 'right' });
    const im = get('web:' + page), R0 = RECT[page]; if (!im) return;
    const w = BCW, h = BCH, bar = 62;
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
    const ry = sk(t, tilt.map(k => [k[0], k[1]]), 3.2, 1), rx = sk(t, tilt.map(k => [k[0], k[2]]), 3.2, 1), push = sk(t, tilt.map(k => [k[0], k[3]]), 3.2, 1);
    const q = { cx: 960, cy: 470, w, h, rx: rx * DEG, ry: ry * DEG, push: push * 0.9, dof: 2.6 };
    const P = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([a2, b2]) => toScreen(worldOf(q, a2, b2)));
    shadowPoly(x, P); drawPersp(x, BC, q); glowPoly(x, P, t, 0.75 + 0.2 * beatPulse(t));
    if (opt.fig) { x.save(); mono(x, 22, 700); x.fillStyle = opt.bg ? '#FFFFFF' : INK.ink2; x.direction = 'ltr'; x.textAlign = 'left'; x.globalAlpha = clamp((t - a) * 2); x.fillText(opt.fig, Math.max(60, P[3][0]), Math.min(985, P[3][1] + 38)); x.restore(); }
    if (HR && sp > 0.01) {
      const pd = 10, lx = HR[0] - pd + (HR[2] + 2 * pd) / 2 - w / 2, ly = HR[1] - pd + (HR[3] + 2 * pd) / 2 - h / 2, lift = 70 * sp, sc = 1 + 0.05 * sp;
      const T = worldOf(q, lx, ly, lift), lw = (HR[2] + 2 * pd) * sc, lh = (HR[3] + 2 * pd) * sc;
      const lq = { ...q, w: lw, h: lh, T, dof: 0 };
      const sub = [(HR[0] - pd) / w, (HR[1] - pd) / h, (HR[0] + HR[2] + pd) / w, (HR[1] + HR[3] + pd) / h];
      const LP = [[-lw / 2, -lh / 2], [lw / 2, -lh / 2], [lw / 2, lh / 2], [-lw / 2, lh / 2]].map(([a2, b2]) => toScreen(worldOf(q, lx + a2, ly + b2, lift)));
      x.save(); x.globalAlpha = sp; shadowPoly(x, LP, 0.3); drawPersp(x, BC, lq, sub); x.restore();
      glowPoly(x, LP, t, 1.2 * sp);
      const mxp = (LP[0][0] + LP[1][0]) / 2;
      if (act[3]) chip(x, t, act[0] + 0.15, clamp(mxp, 360, 1560), clamp(Math.min(LP[0][1], LP[1][1]) - 44, 130, 860), act[3], { size: 30, fill: PINK, ink: WHITE, glow: true, out: act[1] - 0.2 });
    }
  }, { fill: 1 });
}
function uniBg(x, t) {
  const dr = (s, z0) => { const im = get(s.id + ':' + stockIdx(s, t)); if (!im) return false; const z = z0 + 0.08 * clamp((t - s.a) / 8), dx = 30 * Math.sin((t - s.a) * 0.5); x.save(); x.translate(960 + dx, 540); x.scale(z, z); x.drawImage(im, -960, -540, 1920, 1080); x.restore(); return true; };
  if (!dr(STOCK.conf, 1.04)) paperSky(x, W1, H1, t);
  const wk = clamp(spring(t - SF_T, 7, 0.9), 0, 1);
  if (wk > 0.001) { x.save(); x.beginPath(); x.rect(W1 * (1 - wk), 0, W1 * wk, H1); x.clip(); dr(STOCK.gg, 1.06); x.restore(); }
  const g = x.createLinearGradient(0, 0, 0, H1); g.addColorStop(0, 'rgba(14,13,42,.35)'); g.addColorStop(1, 'rgba(14,13,42,.55)'); x.fillStyle = g; x.fillRect(0, 0, W1, H1);
}
function realBroll(x, t) {
  const U = RECT.universe, C = RECT.appchangelog, F = RECT.fusion, LV = RECT.live;
  // the Universe 2026 post: the title, then the hero art
  browserCard(x, t, A.popup + 1.5, A.summary - 0.45, 'universe', 'github.blog · GitHub Universe 2026',
    [[A.popup, 0, 1], [A.universe + 1.2, 250, 1.15, 1080], [A.was_there, 560, 1.0]],
    [[A.universe, A.universe + 3.6, [U.h1[0][0] - 20, U.h1[0][1] - 14, U.h1[0][2] + 40, U.h1[0][3] + 28], 'GitHub Universe 2026'], [A.was_there + 1.0, A.summary - 0.6, [316, 760, 1528, 860], 'San Francisco · Fort Mason']],
    [[A.popup + 1.3, -22, 13, 1.45], [A.popup + 2.1, -12, 8, 1.15], [A.universe, -5, 4, 1.05], [A.was_there + 0.3, 7, 5, 1.04], [A.summary - 0.8, 12, 7, 1.1]], { bg: uniBg, fig: 'FIG. 1 · github.blog/news-insights · 28.10.2026' });
  // Copilot Fusion changelog: "within two points of Opus 5.5 Max at about half the cost"
  browserCard(x, t, A.claims - 0.2, A.cloud - 0.45, 'fusion', 'github.blog/changelog · Copilot Fusion',
    [[A.claims - 1, 0, 1], [A.claims + 2.4, 1500, 1.25, 1080], [A.model_pick + 3.5, 2380, 1.2, 1080]],
    [[A.claims + 0.3, A.claims + 2.4, [F.h1[0][0] - 20, F.h1[0][1] - 14, F.h1[0][2] + 40, F.h1[0][3] + 28], 'Copilot Fusion · GA'],
     [A.claims + 3.4, A.model_pick + 3.4, [630, 1960, 900, 200], 'Fusion Max ≈ Opus 5.5 Max · בחצי מהעלות'],
     [A.model_pick + 4.4, A.cloud - 0.6, [630, 2640, 900, 250], 'Standard · High · Max']],
    [[A.claims - 0.3, 22, 12, 1.4], [A.claims + 0.5, 11, 7, 1.12], [A.claims + 2.6, 4, 4, 1.03], [A.model_pick + 3.6, -8, 5, 1.04], [A.cloud - 0.8, -12, 7, 1.1]], { fig: 'FIG. 2 · github.blog/changelog · Copilot Fusion' });
  // Copilot app Universe releases changelog: projects
  browserCard(x, t, A.create_projects - 0.2, A.repos + 1.3, 'appchangelog', 'github.blog/changelog · GitHub Copilot app',
    [[A.create_projects - 1, 0, 1], [A.create_projects + 1.6, 1050, 1.25, 1080]],
    [[A.create_projects + 0.2, A.create_projects + 1.6, [C.h1[0][0] - 20, C.h1[0][1] - 14, C.h1[0][2] + 40, C.h1[0][3] + 28], 'GitHub Copilot app · Universe'],
     [A.create_projects + 2.5, A.repos + 1.2, [C.projects[0][0] - 16, C.projects[0][1] - 12, C.projects[0][2] + 32, C.projects[0][3] + 24], 'Copilot projects']],
    [[A.create_projects - 0.3, -22, 12, 1.4], [A.create_projects + 0.5, -11, 7, 1.12], [A.create_projects + 1.8, -4, 4, 1.03], [A.repos + 1.0, 10, 7, 1.1]], { fig: 'FIG. 3 · github.blog/changelog · GitHub Copilot app' });
  // the Universe post again: automations
  browserCard(x, t, A.agentic - 0.2, A.stars + 1.8, 'universe', 'github.blog · GitHub Universe 2026',
    [[A.agentic - 1, 4500, 1.15, 1080], [A.stars + 1.8, 4620, 1.15, 1080]],
    [[A.agentic + 0.4, A.stars + 1.7, [U.automations[0][0] - 16, U.automations[0][1] - 12, U.automations[0][2] + 32, 290], 'Copilot automations']],
    [[A.agentic - 0.3, 22, 12, 1.4], [A.agentic + 0.5, 11, 7, 1.12], [A.agentic + 1.4, 4, 4, 1.03], [A.stars + 1.4, -9, 6, 1.08]], { fig: 'FIG. 4 · github.blog · Copilot automations' });
  // his course page (the CTA): the title, then the price button
  browserCard(x, t, A.course - 0.2, A.me - 0.35, 'live', 'live.yuv.ai',
    [[A.course - 1, 0, 1], [A.course + 3.5, 300, 1.15, 1300], [A.live - 0.9, 820, 1.25, 1500], [A.me - 2.5, 1500, 1.0]],
    [[A.course + 0.6, A.live - 0.2, [LV.h1[0][0] - 20, LV.h1[0][1] - 14, LV.h1[0][2] + 40, LV.h1[0][3] + 28], 'הקורס על Grok Bot'], [A.live + 0.2, A.me - 2.6, [1200, 1240, 820, 120], 'live.yuv.ai']],
    [[A.course - 0.3, -22, 13, 1.45], [A.course + 0.5, -12, 8, 1.15], [A.course + 1.4, -5, 4, 1.05], [A.live, 6, 5, 1.03], [A.me - 2.6, 12, 7, 1.1]], { fig: 'FIG. 5 · live.yuv.ai' });
}

/* ---------------- text over the plates / splits ---------------- */
function splitTitles(x, t) {
  headline(x, t, ['6', 'עדכונים'], [A.six - 0.05, A.six + 0.25], A.desktop + 0.9, { y: 470, size: 200, right: 1840, maxW: 640, marker: 0 });
  headline(x, t, ['GitHub', 'Copilot', 'app'], [A.desktop - 0.6, A.desktop - 0.4, A.desktop - 0.2], A.desktop + 0.9, { y: 640, size: 90, right: 1840, maxW: 640, ltr: true });
  headline(x, t, ['מתנה', 'ארגונית'], [A.gift - 0.05, A.gift + 0.4], 23.35, { y: 470, size: 170, right: 1840, maxW: 640, marker: 1 });
  headline(x, t, ['חסרת', 'תקדים'], [A.gift + 1.0, A.gift + 1.3], 23.35, { y: 650, size: 130, right: 1840, maxW: 640 });
  // the verdict: A vs B in the right column
  const v1 = pop(t, A.all_models - 0.2, 14, 0.6) * (1 - in3(inv(A.e2e - 0.3, A.e2e, t))), v2 = pop(t, A.stay_claude - 0.2, 14, 0.6) * (1 - in3(inv(A.e2e - 0.3, A.e2e, t)));
  const vc = (s, y, q, ans, ring) => { if (s <= 0.01) return; x.save(); x.translate(1500, y + 60); x.scale(s, s); softRing(x, 0, 0, 620, 210, 36, t, ring); card(x, 0, 0, 620, 210, 36, { fill: WHITE, depth: 0.9 });
    x.font = FT.textB(fitSize(x, q, FT.textB, 36, 560)); x.fillStyle = INK.ink2; x.textAlign = 'center'; x.direction = 'rtl'; x.fillText(q, 0, -36);
    x.font = FT.en(84); x.fillStyle = PINK; x.direction = 'ltr'; const aw = x.measureText(ans).width; x.fillText(ans, 34, 60); logo(x, ans === 'GitHub' ? 'github' : 'claude', 34 - aw / 2 - 46, 30, 62); x.restore(); };
  headline(x, t, ['שווה', 'לי?'], [A.worth, A.worth + 0.3], A.e2e - 0.3, { y: 190, size: 120, right: 1840, maxW: 640, marker: 1 });
  vc(v1, 330, 'רוצים את כל המודלים + שקיפות בתמחור?', 'GitHub', t > A.github_pick ? 1 : 0.3);
  vc(v2, 620, 'מפתחים רק עם Claude Code?', 'Claude Desktop', 0.3);
  headline(x, t, ['Claude,', 'מנגד:'], [A.claude_side + 0.1, A.claude_side + 0.4], A.claude_in_gh - 0.3, { y: 470, size: 140, right: 1840, maxW: 640 });
  headline(x, t, ['Claude', 'זמין', 'גם', 'ב-GitHub'], [A.claude_in_gh - 0.1, A.claude_in_gh + 0.1, A.claude_in_gh + 0.25, A.claude_in_gh + 0.4], A.claude_end - 0.5, { y: 470, size: 120, right: 1840, maxW: 640, marker: 3 });
  headline(x, t, ['Copilot', 'Desktop'], [A.claude_in_gh + 1.5, A.claude_in_gh + 1.7], A.claude_end - 0.5, { y: 640, size: 90, right: 1840, maxW: 640, ltr: true });
}
// chips over the screen plate: always clear of the webcam PIP corner (bottom-left until 9:14, bottom-right after)
function overlays(x, t) {
  if (V_INNER) { /* side chips are re-placed by drawV */ }
  const p = PL[plateAt(t)], right = p.kind === 'screen' && p.in >= 554;
  // the app: "like Codex or Claude Desktop" + what's in the sidebar
  logoTile(x, t, A.codex - 0.1, 'openai', 1680, 250, 150, { label: 'Codex', out: A.projects_tab - 0.2, ring: 0.6 });
  logoTile(x, t, A.codex + 0.5, 'claude', 1500, 250, 150, { label: 'Claude Desktop', out: A.projects_tab - 0.2, ring: 0.6 });
  ['Projects', 'Automations', 'Customize', 'Skills', 'Connectors'].forEach((n, i) => chip(x, t, A.projects_tab + i * 0.5, 1600, 230 + i * 92, n, { size: 28, fill: i % 2 ? WHITE : INK.pinkWash, ink: INK.ink, shadow: true, out: A.popup - 0.2 }));
  chip(x, t, A.popup, 1500, 230, 'פופ-אפ: מה חדש ב-Universe ’26', { size: 34, fill: PINK, ink: WHITE, glow: true, out: A.popup + 1.4 });
  // images: his guess about the model, labelled as a guess
  chip(x, t, A.gptimg, 1380, 250, 'הניחוש שלי: GPT Image של OpenAI', { size: 32, fill: WHITE, ink: INK.ink, shadow: true, out: A.images_end + 0.2 });
  // hands-on: chat modes
  chip(x, t, A.fusion2, 1300, 880, 'Copilot Fusion: ON', { size: 32, fill: PINK, ink: WHITE, glow: true, out: A.standard - 0.7 });
  chip(x, t, A.used, 960, 880, 'תחילת חודש: כמעט 0 קרדיטים בשימוש', { size: 30, fill: WHITE, ink: INK.ink, shadow: true, out: A.credits_end });
  // Computer Use toggle + Grok Bot
  chip(x, t, A.cu_settings + 1.0, 960, 880, 'Settings → Computer Use → Enable', { size: 30, fill: NIGHT, ink: WHITE, line: 'rgba(255,255,255,.2)', out: A.apps - 0.5 });
  chip(x, t, A.grokbot, 960, 880, '"לך ל-Grok Bot"', { size: 36, fill: PINK, ink: WHITE, glow: true, out: A.cu_end - 0.2 });
  // the prompt, typed as he types it
  promptCard(x, t, A.prompt - 0.2, A.send + 1.2);
  chip(x, t, A.refuse, 900, 210, '✕  "לא אוכל לייצר את לוגן וולברין"', { size: 34, fill: WHITE, ink: INK.pinkDeep, shadow: true, out: A.original - 0.2 });
  chip(x, t, A.original, 900, 210, '✓  שער עם גיבור מקורי', { size: 36, fill: PINK, ink: WHITE, glow: true, out: A.gimmick - 0.5 });
  // the generated covers on his screen
  chip(x, t, A.marvel_said, 1500, 170, 'ביקשתי: שער קומיקס בסגנון מארוול', { size: 30, fill: WHITE, ink: INK.ink, shadow: true, out: A.stage });
  chip(x, t, A.octocat, 1500, 170, 'חסר: Mona, האוקטוקט', { size: 32, fill: WHITE, ink: INK.pinkDeep, shadow: true, out: A.another + 1.5 });
  chip(x, t, A.launch, 1500, 170, '✓ עם הסמל של GitHub', { size: 34, fill: PINK, ink: WHITE, glow: true, out: A.img_end - 0.3 });
  void right;
  if (V_INNER) return;   // the 9:16 re-places the lower third and the CTA
  lowerThird(x, t);
  cta(x, t);
}
const PROMPT = 'צור תמונה של לוגן וולברין, שער קומיקס בסגנון מארוול, שמראה את ההשקה החדשה של GitHub ב-Universe 2026';
function promptCard(x, t, a, b) {
  const s = pop(t, a, 16, 0.6) * (1 - in3(inv(b - 0.2, b, t))); if (s <= 0.01) return;
  x.save(); x.translate(960, 200); x.scale(s, s);
  softRing(x, 0, 0, 1500, 150, 34, t, 0.7); card(x, 0, 0, 1500, 150, 34, { fill: 'rgba(20,18,58,.96)', depth: 0.8, stroke: 'rgba(255,255,255,.16)' });
  const n = clamp(Math.floor((t - a - 0.2) / ((A.send - A.prompt) / PROMPT.length)), 0, PROMPT.length);
  x.font = FT.textB(34); x.fillStyle = WHITE; x.direction = 'rtl'; x.textAlign = 'right';
  const lines = wrapLines(x, PROMPT.slice(0, n), 1400); lines.slice(-2).forEach((ln, i) => x.fillText(ln, 710, -14 + i * 48));
  mono(x, 24, 700); x.fillStyle = PINK; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('PROMPT', -720, -36);
  x.restore();
}
const LT0 = 11.2, LT1 = 14.9;
function lowerThird(x, t) {
  const s = clamp(spring(t - LT0, 12, 0.7), 0, 1.02) * (1 - in3(inv(LT1 - 0.25, LT1, t)));
  if (s <= 0.01) return;
  x.save(); const w = 600 * s, X = 1840 - w, Y = 760; x.beginPath(); x.rect(X - 30, Y - 40, w + 60, 220); x.clip();
  softRing(x, 1840 - 300, Y + 70, 600, 140, 40, t, 0.9); card(x, 1840 - 300, Y + 70, 600, 140, 40, { fill: WHITE, depth: 0.7 }); x.fillStyle = PINK; rr(x, 1840 - 22, Y + 26, 8, 88, 4); x.fill();
  x.direction = 'rtl'; x.textAlign = 'right'; x.font = FT.he(70); x.fillStyle = INK.ink; x.fillText('יובל אבידני', 1800, Y + 82);
  x.font = FT.textB(26); x.fillStyle = INK.ink2; x.fillText('AI Builder & Speaker · GitHub Star', 1800, Y + 120); x.restore();
}
function cta(x, t) {
  const c = pop(t, A.follow - 0.15, 18, 0.5) * (1 - in3(inv(A.end - 0.2, A.end + 0.1, t)));
  if (c <= 0.01) return;
  x.save(); x.translate(1590, 300); x.scale(c, c); const w = 560, h = 124;
  neonRing(x, 0, 0, w, h, h / 2, t * 1.05, { lw: 4, glow: 24, power: 0.75 + 0.25 * beatPulse(t) });
  rrc(x, 0, 0, w, h, h / 2); x.fillStyle = PINK; x.fill(); x.font = FT.textB(46); x.fillStyle = WHITE; x.textAlign = 'center'; x.direction = 'rtl';
  x.fillText(t < A.comment - 0.2 ? 'עקבו אחריי ←' : 'ספרו לי בתגובות ←', 0, 16);
  x.font = FT.textB(32); x.shadowColor = 'rgba(14,13,42,.85)'; x.shadowBlur = 20; x.fillText(t < A.comment - 0.2 ? 'עוד סרטונים בדרך' : 'על מה שתרצו שאתמקד', 0, 128); x.restore();
}
function endcard(x, t) {
  if (t < A.end) return;
  const u = t - A.end, R = plateRect(t);
  // the night end card grows out of the avatar circle (shape change), then the avatar sits on it
  const ir = clamp(spring(u, 5, 0.95), 0, 1) * 2300;
  x.save(); circle(x, R.cx, R.cy, Math.max(R.w / 2, ir)); x.clip(); nightSky(x, W1, H1, t, { side: 'left' }); x.restore();
  plate(x, t);
  const pw = clamp(u * 2) * (0.85 + 0.15 * beatPulse(t));
  neonRing(x, R.cx, R.cy, R.w + 22, R.h + 22, (R.w + 22) / 2, t * 1.05, { lw: 6, glow: 30, power: pw });
  softRing(x, R.cx, R.cy, R.w + 40, R.h + 40, (R.w + 40) / 2, t + 1.3, 0.6 * pw);
  headline(x, t, ['תמשיכו', 'לעוף', 'גבוה'], [A.end + 0.35, A.end + 0.55, A.end + 0.75], null, { y: 470, size: 150, right: 1800, maxW: 900, marker: 1, color: WHITE });
  const sk2 = io3(inv(A.end + 1.1, A.end + 2.6, t));
  x.save(); x.translate(1790, 650); x.rotate(-0.05); x.font = FT.hand(110); x.direction = 'rtl'; x.textAlign = 'right'; const sw = x.measureText('יובל אבידני').width;
  x.beginPath(); x.rect(-sw * sk2 - 10, -130, sw * sk2 + 20, 190); x.clip(); x.fillStyle = INK.pinkSoft; x.fillText('יובל אבידני', 0, 0); x.restore();
  const ul = out3(inv(A.end + 2.6, A.end + 3.25, t)); x.strokeStyle = INK.gold[1]; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(1790, 690); x.lineTo(1790 - 520 * ul, 708); x.stroke();
  const mk = clamp(spring(u - 1.4, 9, 0.7), 0, 1.1);
  if (G.mark && mk > 0.01) { x.save(); x.translate(1540, 985); x.scale(mk, mk); x.drawImage(G.mark, -60, -60, 120, 120); x.restore(); }
  x.direction = 'ltr'; x.textAlign = 'right'; x.font = FT.en(56); x.fillStyle = PINK; x.fillText('YUV.AI', 1840, 1000);
  mono(x, 20, 700); x.fillStyle = '#CFCDEB'; x.fillText("LET'S FLY HIGH", 1840, 1034);
  x.textAlign = 'left'; mono(x, 30, 600); x.fillStyle = '#CFCDEB'; x.fillText('live.yuv.ai', 80, 1020);
}

/* ---------------- captions: calm phrases ---------------- */
const CH = D.chunks;
function capOnLight(t) {
  if (inScene(t)) { const sh = [STOCK.desk].some(s => t > s.a && t < s.b + 0.3); return !sh; }
  const p = PL[plateAt(t)];
  if (p.kind === 'screen') return false;
  return SPLITS.some(([a, b]) => t > a + 0.2 && t < b);
}
function capX(t) {   // over the screen recording the caption sits beside the webcam PIP, never on it
  if (inScene(t)) return [960, 1500];
  const p = PL[plateAt(t)];
  if (p.kind !== 'screen') return SPLITS.some(([a, b]) => t > a && t < b) ? [660, 1000] : [960, 1500];
  return p.in < 554 ? [1190, 1180] : [730, 1180];
}
function wrapLines(x, text, maxW) { const out = []; let line = ''; for (const w of text.split(' ')) { const tl = line ? line + ' ' + w : w; if (x.measureText(tl).width > maxW && line) { out.push(line); line = w; } else line = tl; } if (line) out.push(line); return out; }
function captions(x, t) {
  if (t >= A.end - 0.05) return;
  let c = null; for (const ch of CH) { if (t >= ch.t0 - 0.05 && t < ch.end) { c = ch; break; } } if (!c) return;
  const text = c.words.map(o => o.w).join(' '), light = capOnLight(t), [cx, maxW] = capX(t);
  const size = Math.min(54, fitSize(x, text, FT.textB, 54, maxW)), y = 1022;
  const k = out3(inv(c.t0 - 0.05, c.t0 + 0.13, t)), dy = (1 - k) * 10;
  void light;
  x.save(); x.font = FT.textB(size); x.direction = 'rtl'; x.textAlign = 'center'; x.globalAlpha = k;
  const pw = x.measureText(text).width + size * 1.1, ph = size * 1.62;
  x.shadowColor = 'rgba(14,13,42,.35)'; x.shadowBlur = 24; x.shadowOffsetY = 8; rrc(x, cx, y + dy - size * 0.33, pw, ph, ph / 2); x.fillStyle = 'rgba(14,13,42,.88)'; x.fill(); x.shadowColor = 'transparent';
  x.lineWidth = 1.5; x.strokeStyle = 'rgba(255,255,255,.14)'; x.stroke();
  x.fillStyle = WHITE; x.fillText(text, cx, y + dy);
  x.restore();
}
function progress(x, t) { const u = clamp(t / DUR); x.fillStyle = 'rgba(28,26,75,.10)'; x.fillRect(0, 0, W1, 6); x.fillStyle = gradPaint(x, W1, 0, 0, 0, [PINK, INK.cyan]); x.fillRect(W1 * (1 - u), 0, W1 * u, 6); }

/* ---------------- the frame ---------------- */
function draw(x, t, L) { if (L.name === 'v') drawV(x, t); else drawH(x, t, true); }
function scenes(x, t) {
  sixScene(x, t); chapters(x, t); fuseScene(x, t); routeScene(x, t); discScene(x, t); reposScene(x, t); hubScene(x, t); autoScene(x, t); toolsScene(x, t);
  atmosphere(x, t); deviceScene(x, t); priceScene(x, t); effortScene(x, t); cascadeScene(x, t); gimmickScene(x, t); costScene(x, t); reviewScene(x, t); realBroll(x, t);
}
const SECTIONS = [[24.2, 'GITHUB COPILOT APP'], [A.fusion - 0.1, '01 · COPILOT FUSION'], [A.parallel - 0.2, '02 · PROJECTS'], [A.auto + 1.0, '03 · AUTOMATIONS'],
  [A.tools, '04 · YOUR TOOLS'], [A.device, '05 · ANY DEVICE'], [A.images + 0.3, '06 · IMAGES'], [A.demo, 'HANDS-ON'], [A.cu - 0.2, 'COMPUTER USE'], [A.img_try, 'IMAGES · LIVE'], [A.verdict, 'VERDICT']];
function sectionPill(x, t) {
  if (t < 24.4 || t > A.verdict - 0.2) return;
  const p = PL[plateAt(t)]; if (p.kind !== 'screen' && !inScene(t)) return;
  let s = SECTIONS[0]; for (const q of SECTIONS) if (t >= q[0]) s = q;
  x.save(); mono(x, 22, 700); const w = x.measureText(s[1]).width + 64; rr(x, 64, 34, w, 46, 23); x.fillStyle = 'rgba(14,13,42,.86)'; x.fill();
  x.fillStyle = PINK; circle(x, 88, 57, 6); x.fill(); x.fillStyle = WHITE; x.direction = 'ltr'; x.textAlign = 'left'; x.fillText(s[1], 104, 65); x.restore();
}
function drawH(x, t, full) {
  paperSky(x, W1, H1, t, { side: 'right' });
  x.save(); camApply(x, camAt(t));
  plate(x, t);
  splitTitles(x, t); overlays(x, t);
  scenes(x, t);
  endcard(x, t);
  x.restore();
  flash(x, t); sectionPill(x, t); if (full) { captions(x, t); progress(x, t); }
}
// register every scene window once (pure: only their arguments), so captions and the 9:16 know when a scene is on
(() => { const c = document.createElement('canvas').getContext('2d'); for (const s of [-1]) scenes(c, s); })();

/* ---------------- 9:16: the same film, re-framed ---------------- */
const VW = 1080, VH = 1920, INC = document.createElement('canvas'); INC.width = W1; INC.height = H1; const inx = INC.getContext('2d');
function faceMode(t) {
  const p = PL[plateAt(t)];
  if (p.kind !== 'face' || t >= A.end - 0.3) return false;
  if (SPLITS.some(([a, b]) => t > a - 0.3 && t < b + 0.5)) return false;
  return !SCN.some(([a, b]) => t > a - 0.25 && t < b);
}
let SWL = null;
function modeAt(t) {
  if (!SWL) {
    const seg = []; let prev = null;
    for (let s = 0; s <= DUR + 1; s += 1 / 60) { const m = faceMode(s); if (m !== prev) { seg.push([s, m]); prev = m; } }
    SWL = seg.filter((g, i) => !(g[1] && (seg[i + 1] ? seg[i + 1][0] : DUR) - g[0] < 0.8));
    SWL = SWL.filter((g, i) => i === 0 || g[1] !== SWL[i - 1][1]);
  }
  let i = SWL.length - 1; while (i > 0 && SWL[i][0] > t) i--;
  const [ts, m] = SWL[i], from = i > 0 ? SWL[i - 1][1] : m;
  return clamp(lerp(from ? 1 : 0, m ? 1 : 0, clamp(spring(t - ts, 8, 0.95), 0, 1)), 0, 1);
}
// the speaker in the signature glow circle under the card: the clean face cam of the OBS vertical recording
function vFace(x, t, k) {
  if (k < 0.01) return;
  const p = PL[plateAt(t)], f = srcIdx(p, t), im = get('v' + f); if (!im) return;
  const FX = VW / 2, FY = 1450, FR = 270 * (0.85 + 0.15 * k);
  x.save(); x.globalAlpha = k; circle(x, FX, FY, FR); x.clip(); x.drawImage(im, 40, 50, 400, 400, FX - FR, FY - FR, 2 * FR, 2 * FR); x.restore();
  x.save(); x.globalAlpha = k; neonRing(x, FX, FY, 2 * FR + 20, 2 * FR + 20, FR + 10, t * 1.05, { lw: 6, glow: 30, power: 0.85 + 0.15 * beatPulse(t) }); x.restore();
  softRing(x, FX, FY, 2 * FR + 44, 2 * FR + 44, FR + 22, t + 1.3, 0.6 * k);
}
function drawV(x, t) {
  inx.setTransform(1, 0, 0, 1, 0, 0); V_INNER = true; drawH(inx, t, false); V_INNER = false;
  const u = modeAt(t), fc = 900;
  paperSky(x, VW, VH, t, { side: 'right' });
  if (u < 0.99) {
    x.save(); x.globalAlpha = 1 - u;
    x.font = FT.he(100); x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = INK.ink; x.fillText('6 עדכונים ל-GitHub Copilot', VW / 2, 222);
    x.font = FT.textB(38); x.fillStyle = INK.ink2; x.fillText('מה הוכרז ב-Universe 2026', VW / 2, 284);
    x.direction = 'ltr'; x.font = FT.en(44); x.fillStyle = PINK; x.fillText('YUV.AI', VW / 2, 110); x.restore();
  }
  const ek = out3(inv(A.end - 0.3, A.end + 0.4, t)), cy0 = lerp(330, 665, ek);
  const S = [lerp(0, fc - 304, u), 0, lerp(1920, 608, u), 1080], Dd = [lerp(16, 0, u), lerp(cy0, 0, u), lerp(1048, VW, u), lerp(590, VH, u)], r = lerp(30, 0, u);
  vFace(x, t, (1 - u) * (1 - ek));
  if (u < 0.98) softRing(x, Dd[0] + Dd[2] / 2, Dd[1] + Dd[3] / 2, Dd[2] + 16, Dd[3] + 16, r + 8, t, 0.9 * (1 - u));
  x.save(); rr(x, Dd[0], Dd[1], Dd[2], Dd[3], r); x.clip(); x.drawImage(INC, S[0], S[1], S[2], S[3], Dd[0], Dd[1], Dd[2], Dd[3]); x.restore();
  if (u > 0.02) {
    const lt = pop(t, LT0 + 0.1, 16, 0.6) * (1 - in3(inv(LT1 - 0.3, LT1, t)));
    if (lt > 0.01) { x.save(); x.globalAlpha = u; chip(x, t, LT0 + 0.1, VW / 2, 1240, 'יובל אבידני · AI Builder & Speaker', { size: 36, fill: WHITE, ink: INK.ink, glow: true, out: LT1 - 0.3 }); x.restore(); }
    if (t > A.follow - 0.2) { x.save(); x.globalAlpha = u; chip(x, t, A.follow - 0.15, VW / 2, 300, t < A.comment - 0.2 ? 'עקבו אחריי ←' : 'ספרו לי בתגובות ←', { size: 44, fill: PINK, ink: WHITE, glow: true, out: A.end - 0.2 }); x.restore(); }
  }
  if (t < A.end - 0.05) {
    let c = null; for (const ch of CH) { if (t >= ch.t0 - 0.05 && t < ch.end) { c = ch; break; } }
    if (c) {
      const text = c.words.map(o => o.w).join(' '), size = 66, k = out3(inv(c.t0 - 0.05, c.t0 + 0.13, t)), light = u < 0.5;
      x.save(); x.font = FT.textB(size); x.direction = 'rtl'; x.textAlign = 'center'; x.lineJoin = 'round'; x.globalAlpha = k;
      const lines = wrapLines(x, text, 940), y0 = lerp(1010, 1470, u) + (1 - k) * 10;
      lines.forEach((ln, i) => { const y = y0 + i * size * 1.25;
        if (light) { x.fillStyle = INK.ink; x.fillText(ln, VW / 2, y); }
        else { x.lineWidth = size * 0.16; x.strokeStyle = 'rgba(14,13,42,.85)'; x.strokeText(ln, VW / 2, y); x.fillStyle = WHITE; x.fillText(ln, VW / 2, y); } });
      x.restore();
    }
  }
  const pu = clamp(t / DUR); x.fillStyle = 'rgba(28,26,75,.10)'; x.fillRect(0, 0, VW, 8); x.fillStyle = gradPaint(x, VW, 0, 0, 0, [PINK, INK.cyan]); x.fillRect(VW * (1 - pu), 0, VW * pu, 8);
}
mountFilm({ layouts: { h: { name: 'h', W: W1, H: H1 }, v: { name: 'v', W: VW, H: VH } }, draw, dur: DUR, clk: { B, BPM: D.BPM }, init: async () => { await init3(); const m = new Image(); m.src = MARK_URL; await m.decode(); G.mark = m; } });
