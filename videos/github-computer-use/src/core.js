/* =====================================================================
   core: pure motion math + canvas helpers (adapted from the YUV.AI motion kit)
   Every function is a pure function of its inputs. No timers, no state.
   ===================================================================== */
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const inv = (a, b, x) => clamp((x - a) / (b - a));
export const out2 = u => 1 - (1 - u) * (1 - u);
export const out3 = u => 1 - Math.pow(1 - u, 3);
export const in2 = u => u * u;
export const in3 = u => u * u * u;
export const io3 = u => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const io2 = u => (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
export const logLerp = (a, b, u) => a * Math.pow(b / a, u);
export const Z = 0.8; // house damping ratio: a tiny overshoot at most (0.78-0.9)
/** closed-form damped spring step response: 0 at t<=0, settles at 1 */
export function spring(t, w = 14, z = Z) {
  if (t <= 0) return 0;
  if (z < 1) { const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); }
  return 1 - Math.exp(-w * t) * (1 + w * t);
}
/** sum of springs: one spring per change. keys [[t, v], ...] */
export function sk(t, keys, w = 14, z = Z) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * spring(t - keys[i][0], w, z); return v; }
export function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

/* ---------- colour ---------- */
export function hex(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
export function toHex(a) { return '#' + a.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join(''); }
export function mix(a, b, u) { const A = hex(a), Bc = hex(b); u = clamp(u); return toHex(A.map((v, i) => lerp(v, Bc[i], u))); }
export function rgba(h, a) { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; }

export const C = {
  navy: '#12163F', navy2: '#1E2357', navy3: '#0B0E2A', denim: '#AFCBEF', cloud: '#EEF3FB',
  gold: '#FFC74E', orange: '#FF8F3A', coral: '#F56B49', pink: '#FF66C4', cyan: '#5DE4E9',
  sky: ['#5EA9F2', '#93CBFF', '#DDF0FF'], ink2: '#4A5085', line: '#C9D6EE', white: '#FFFFFF',
  fire: ['#FFC74E', '#FF8F3A', '#F56B49']
};
export const SPECTRUM = ['#5DE4E9', '#4FA3FF', '#8B6CFF', '#FF66C4', '#FF8F3A', '#FFC74E', '#5DE4E9'];

/* ---------- type ---------- */
export const FT = {
  en: s => `400 ${s}px Anton, Impact, sans-serif`,
  ui: s => `500 ${s}px Inter, sans-serif`, uiS: s => `600 ${s}px Inter, sans-serif`, uiB: s => `700 ${s}px Inter, sans-serif`, uiX: s => `800 ${s}px Inter, sans-serif`,
  mono: s => `500 ${s}px "JetBrains Mono", monospace`, monoB: s => `700 ${s}px "JetBrains Mono", monospace`
};
export const FONT_FACES = ['400 100px Anton', '500 30px Inter', '600 30px Inter', '700 30px Inter', '800 30px Inter', '500 30px "JetBrains Mono"', '700 30px "JetBrains Mono"'];

/* ---------- shapes ---------- */
export function rr(x, X, Y, w, h, r) { r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2)); x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
export function rrc(x, cx, cy, w, h, r) { rr(x, cx - w / 2, cy - h / 2, w, h, r); }
export function circle(x, cx, cy, r) { x.beginPath(); x.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2); }
export function farR(W, H, ox, oy) { return Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([a, b]) => Math.hypot(a - ox, b - oy))) * 1.02; }
export function grad(x, x0, y0, x1, y1, stops) { const g = x.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, j) => g.addColorStop(j / (stops.length - 1), c)); return g; }

/** two-layer navy-tinted shadow (ambient + contact) under the current path-producing fn */
export function shadowed(x, pathFn, fill, depth = 1) {
  x.save();
  if (depth > 0.01) {
    x.shadowColor = 'rgba(8,12,48,.42)'; x.shadowBlur = 70 * depth; x.shadowOffsetY = 30 * depth; pathFn(); x.fillStyle = fill; x.fill();
    x.shadowColor = 'rgba(8,12,48,.38)'; x.shadowBlur = 16 * depth; x.shadowOffsetY = 6 * depth; x.fill();
    x.shadowColor = 'transparent';
  } else { pathFn(); x.fillStyle = fill; x.fill(); }
  x.restore();
}
/** card: radius 36-48, two-layer navy shadow, optional top rim light */
export function card(x, cx, cy, w, h, r, { fill = '#FFFFFF', depth = 1, stroke = null, strokeW = 2 } = {}) {
  if (w <= 0.5 || h <= 0.5) return;
  shadowed(x, () => rrc(x, cx, cy, w, h, r), fill, depth);
  if (stroke) { x.save(); rrc(x, cx, cy, w, h, r); x.lineWidth = strokeW; x.strokeStyle = stroke; x.stroke(); x.restore(); }
}
/** rotating neon conic edge (the only glow allowed): crisp line + halo. power pulses on the beat */
export function neonRing(x, cx, cy, w, h, r, angle, { lw = 4, glow = 20, power = 1 } = {}) {
  if (w <= 1 || h <= 1 || power <= 0.01) return;
  const g = x.createConicGradient(angle, cx, cy); SPECTRUM.forEach((c, i) => g.addColorStop(i / (SPECTRUM.length - 1), c));
  x.save(); x.strokeStyle = g;
  x.filter = `blur(${(glow * power).toFixed(1)}px)`; x.lineWidth = lw * 4.5 * power; rrc(x, cx, cy, w, h, r); x.stroke();
  x.filter = `blur(${(glow * 0.3 * power).toFixed(1)}px)`; x.lineWidth = lw * 2; rrc(x, cx, cy, w, h, r); x.stroke();
  x.filter = 'none'; x.lineWidth = lw; rrc(x, cx, cy, w, h, r); x.stroke();
  x.restore();
}
/** octicon (official GitHub icon path data) centred at cx,cy, size px */
export function icon(x, OCT, name, cx, cy, size, color) {
  const I = OCT[name]; if (!I || size <= 0.2) return;
  x.save(); x.translate(cx - size / 2, cy - size / 2); x.scale(size / I.vb, size / I.vb); x.fillStyle = color;
  for (const d of I.d) x.fill(new Path2D(d));
  x.restore();
}
/** text helper; ltr always (this film is English) */
export function text(x, s, X, Y, font, color, align = 'left', spacing = 0) {
  x.save(); x.font = font; x.direction = 'ltr'; x.textAlign = align; x.textBaseline = 'alphabetic'; x.fillStyle = color;
  if (spacing) x.letterSpacing = spacing + 'px';
  x.fillText(s, X, Y); x.restore();
}
export function tw(x, s, font, spacing = 0) { x.save(); x.font = font; if (spacing) x.letterSpacing = spacing + 'px'; const w = x.measureText(s).width; x.restore(); return w; }
