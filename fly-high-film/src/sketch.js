// Hand-drawn illustration primitives for Canvas2D: ballpoint ink with line-boil, watercolour/marker washes,
// hatching, paper. World units are "page widths" (the notebook page is 1.0 wide).
import { noise2, rng } from './util.js';

export const INK = '#1b2a6b';
let BOIL = 0; // boil frame index (hand-drawn wobble, 12 fps)
export function setBoil(t) { BOIL = Math.floor(t * 12); }
const j = (x, y, i, amp) => [x + noise2(i * 0.37 + BOIL * 7.1, y * 40, 1) * amp, y + noise2(x * 40, i * 0.41 + BOIL * 5.3, 2) * amp];

// Catmull-Rom spline through control points -> dense polyline
export function spline(cp, closed = false, seg = 10) {
  const out = [], n = cp.length;
  const P = i => closed ? cp[(i + n) % n] : cp[Math.max(0, Math.min(n - 1, i))];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let k = 0; k < seg; k++) {
      const t = k / seg, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  if (!closed) out.push(cp[n - 1]); else out.push(out[0]);
  return out;
}
export const ellipse = (cx, cy, rx, ry, n = 40, a0 = 0, a1 = Math.PI * 2) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
export function xf(pts, { x = 0, y = 0, s = 1, sx = 1, sy = 1, r = 0 } = {}) {
  const c = Math.cos(r), sn = Math.sin(r);
  return pts.map(([px, py]) => { px *= s * sx; py *= s * sy; return [x + px * c - py * sn, y + px * sn + py * c]; });
}
export function plen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
export function trim(pts, f) { // keep first fraction f of the polyline (by length)
  if (f >= 1) return pts; if (f <= 0) return [];
  const L = plen(pts) * f; let acc = 0; const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + d >= L) { const k = (L - acc) / d; out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]); return out; }
    acc += d; out.push(pts[i]); }
  return out;
}

function tracePath(ctx, pts, amp, seed, close) {
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) { const [x, y] = amp ? j(pts[i][0], pts[i][1], i + seed, amp) : pts[i]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  if (close) ctx.closePath();
}

// ballpoint line: tapered ends, slight double pass, boil
export function ink(ctx, pts, w = 0.0028, { color = INK, alpha = 0.92, boil = 0.0011, seed = 0, double = true } = {}) {
  if (!pts || pts.length < 2) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color;
  ctx.globalAlpha = alpha; ctx.lineWidth = w; tracePath(ctx, pts, boil, seed, false); ctx.stroke();
  if (double) { ctx.globalAlpha = alpha * 0.35; ctx.lineWidth = w * 0.6; tracePath(ctx, pts, boil * 1.6, seed + 97, false); ctx.stroke(); }
  ctx.restore();
}

// calligraphic ink: filled variable-width stroke with tapered ends and pressure noise
export function inkV(ctx, pts, w = 0.004, { color = INK, alpha = 1, boil = 0.0011, seed = 0, taper = [0.25, 0.25], press = 0.35, closed = false } = {}) {
  if (!pts || pts.length < 2) return;
  const P = pts.map((p, i) => boil ? j(p[0], p[1], i + seed, boil) : p);
  const n = P.length; const cum = [0]; for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const L = cum[n - 1] || 1e-6; const left = [], right = [];
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const u = cum[i] / L; const ta = closed ? 1 : Math.min(1, u / Math.max(0.001, taper[0])), tb = closed ? 1 : Math.min(1, (1 - u) / Math.max(0.001, taper[1]));
    const ww = w * 0.5 * Math.pow(Math.min(ta, tb), 0.7) * (1 - press * 0.5 + press * (0.5 + 0.5 * noise2(cum[i] * 60 + seed, seed * 3.1, 6)));
    left.push([P[i][0] - dy * ww, P[i][1] + dx * ww]); right.push([P[i][0] + dy * ww, P[i][1] - dx * ww]);
  }
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath();
  left.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
  ctx.closePath(); ctx.fill(); ctx.restore();
}
// cel shading crescents: shadow on the lower-right, rim light on the upper-left (shape minus shifted copy)
export function cel(ctx, pts, { shadow = null, rim = null, d = 0.02, ang = 0.8, soft = true } = {}) {
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9; for (const [x, y] of pts) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
  const B = Math.max(maxx - minx, maxy - miny) * 3;
  for (const [col, k] of [[shadow, 1], [rim, -0.5]]) {
    if (!col) continue;
    const dx = Math.cos(ang) * d * k, dy = Math.sin(ang) * d * k;
    ctx.save(); tracePath(ctx, pts, 0, 0, true); ctx.clip();
    ctx.beginPath(); ctx.rect(minx - B, miny - B, 3 * B, 3 * B);
    pts.forEach(([x, y], i) => i ? ctx.lineTo(x - dx, y - dy) : ctx.moveTo(x - dx, y - dy)); ctx.closePath();
    ctx.clip('evenodd');
    ctx.fillStyle = col; ctx.fillRect(minx - B, miny - B, 3 * B, 3 * B);
    ctx.restore();
  }
}
// grain textures (created once, tiled in world space)
let GRAIN = null, PAPER = null;
function makeGrain() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const r = rng(77);
  const id = x.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) { const v = 200 + (r() - 0.5) * 70 + Math.sin(i * 0.013) * 6; id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
  x.putImageData(id, 0, 0);
  // pigment blooms
  for (let i = 0; i < 60; i++) { const g = x.createRadialGradient(r() * 256, r() * 256, 0, r() * 256, r() * 256, 10 + r() * 40); g.addColorStop(0, `rgba(160,160,160,${0.1 + r() * 0.15})`); g.addColorStop(1, 'rgba(160,160,160,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }
  return c;
}
export function grainPattern(ctx) { GRAIN = GRAIN || makeGrain(); return ctx.createPattern(GRAIN, 'repeat'); }

// watercolour / marker wash with volume shading
// opts: color, light (highlight colour), shade (shadow colour), dir [dx,dy] light dir, alpha, edge
export function wash(ctx, pts, color, { light = null, shade = null, alpha = 0.95, edge = 0.25, off = [0.0012, 0.0008], boil = 0.0008, seed = 3, texture = 0.55, glow = null, bounds = null } = {}) {
  if (!pts || pts.length < 3) return;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.translate(off[0], off[1]);
  tracePath(ctx, pts, boil, seed, true);
  ctx.fillStyle = color; ctx.fill();
  ctx.clip();
  // volume: light from top-left, shade bottom-right
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9; for (const [x, y] of pts) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
  const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2, R = Math.max(maxx - minx, maxy - miny);
  if (light) { const g = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.32, 0, cx - R * 0.2, cy - R * 0.25, R * 0.75); g.addColorStop(0, light); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(minx, miny, maxx - minx, maxy - miny); }
  if (shade) { const g = ctx.createLinearGradient(cx - R * 0.2, cy - R * 0.3, cx + R * 0.35, cy + R * 0.55); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, shade); ctx.fillStyle = g; ctx.fillRect(minx, miny, maxx - minx, maxy - miny); }
  if (glow) { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.6); g.addColorStop(0, glow); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(minx, miny, maxx - minx, maxy - miny); }
  if (texture > 0) { ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = texture * alpha; const p = grainPattern(ctx); p.setTransform(new DOMMatrix().scale(0.0016)); ctx.fillStyle = p; ctx.fillRect(minx, miny, maxx - minx, maxy - miny); ctx.globalCompositeOperation = 'source-over'; }
  ctx.restore();
  // pigment pooling at the edge (darker rim)
  if (edge > 0) { ctx.save(); ctx.globalAlpha = edge * alpha; ctx.strokeStyle = shade || color; ctx.lineWidth = 0.0022; ctx.translate(off[0], off[1]); tracePath(ctx, pts, boil, seed, true); ctx.stroke(); ctx.restore(); }
}

// parallel hatching inside a shape (shadow)
export function hatch(ctx, pts, { angle = -0.9, gap = 0.006, w = 0.0012, color = INK, alpha = 0.35, seed = 5 } = {}) {
  ctx.save(); tracePath(ctx, pts, 0, 0, true); ctx.clip();
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9; for (const [x, y] of pts) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
  const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2, R = Math.hypot(maxx - minx, maxy - miny);
  ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = w; ctx.lineCap = 'round';
  const dx = Math.cos(angle), dy = Math.sin(angle), nx = -dy, ny = dx;
  let i = 0;
  for (let s = -R; s < R; s += gap) { const a = [cx + nx * s - dx * R, cy + ny * s - dy * R], b = [cx + nx * s + dx * R, cy + ny * s + dy * R];
    tracePath(ctx, [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b], 0.0009, seed + i++, false); ctx.stroke(); }
  ctx.restore();
}

// noisy blob polygon (for colour-bloom reveal masks)
export function blob(cx, cy, r, seed = 1, n = 64, rough = 0.18) {
  const o = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; const k = 1 + noise2(Math.cos(a) * 1.7 + seed, Math.sin(a) * 1.7, 3) * rough * 2 + noise2(Math.cos(a) * 5, Math.sin(a) * 5 + seed, 4) * rough * 0.6; o.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]); } return o;
}
export function clipPoly(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.clip(); }

// lined notebook paper in world space (page width = 1)
export const LINE_GAP = 0.032 * 4.1 / 3.0, MARGIN_X = 0.12;
function makePaper() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); const r = rng(5);
  x.fillStyle = '#f6efdf'; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) { const g = 200 + r() * 40; x.fillStyle = `rgba(${g},${g - 8},${g - 25},0.10)`; x.fillRect(r() * 512, r() * 512, 1 + r() * 3, 1); }
  return c;
}
export function paper(ctx, view, W, H, { tint = null, lines = 1 } = {}) {
  PAPER = PAPER || makePaper();
  const [x0, y0, x1, y1] = view;
  ctx.save();
  const p = ctx.createPattern(PAPER, 'repeat'); p.setTransform(new DOMMatrix().scale(1 / 1100)); ctx.fillStyle = p; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  if (lines > 0) {
    ctx.globalAlpha = 0.5 * lines; ctx.strokeStyle = 'rgb(86,140,205)'; ctx.lineWidth = 0.0016;
    const off = 0.0355; for (let y = Math.floor((y0 - off) / LINE_GAP) * LINE_GAP + off; y < y1; y += LINE_GAP) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgb(220,80,90)'; ctx.globalAlpha = 0.45 * lines; ctx.lineWidth = 0.0018;
    for (let x = Math.floor((x0 - MARGIN_X) / 1.0) * 1.0 + MARGIN_X; x < x1; x += 1.0) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
  }
  if (tint) { ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = tint; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
  ctx.restore();
}
