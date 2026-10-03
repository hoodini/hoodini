// Shared renderer for illustration "ops" (part / line / fill / iris / shine).
import { inkV, wash, cel, INK } from './sketch.js';
import { lerp, clamp } from './util.js';
export function mixHex(a, b, k) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const r = (pa >> 16) * (1 - k) + (pb >> 16) * k, g = ((pa >> 8) & 255) * (1 - k) + ((pb >> 8) & 255) * k, bl = (pa & 255) * (1 - k) + (pb & 255) * k; return `rgb(${r | 0},${g | 0},${bl | 0})`; }
export function thick(sp, w0, w1) { const a = [], b = []; for (let i = 0; i < sp.length; i++) { const p0 = sp[Math.max(0, i - 1)], p1 = sp[Math.min(sp.length - 1, i + 1)]; const dx = p1[0] - p0[0], dy = p1[1] - p0[1], d = Math.hypot(dx, dy) || 1; const w = lerp(w0, w1, i / (sp.length - 1)); a.push([sp[i][0] - dy / d * w, sp[i][1] + dx / d * w]); b.push([sp[i][0] + dy / d * w, sp[i][1] - dx / d * w]); } return a.concat(b.reverse()); }
export function renderOps(ctx, ops, colorK, lk, t = 0) {
  for (const op of ops) {
    const k = op[0];
    if (k === 'part') {
      const [, pts, pal, o] = op;
      if (colorK > 0 && pal.f) { wash(ctx, pts, pal.f, { alpha: colorK, boil: 0.0016, off: [0.0025, 0.0018], edge: 0, texture: 0.16 }); if (colorK > 0.05) cel(ctx, pts, { shadow: pal.s, rim: pal.r, d: o.d ?? 0.03 }); }
      if (!(o.hidden && colorK <= 0.02)) inkV(ctx, pts, o.w ?? 0.012, { color: lk > 0 ? mixHex('#1b2a6b', pal.l, lk) : INK, alpha: o.hidden ? clamp(colorK * 1.5) : 1, boil: 0.0024, seed: pts.length, taper: [0.08, 0.08], press: 0.4 });
    } else if (k === 'line') {
      const [, pts, w, col, o] = op;
      if (o.fixed && colorK <= 0.01) continue;
      const c = o.fixed ? col : (lk > 0 && col.startsWith('#') ? mixHex('#1b2a6b', col, lk) : (lk > 0 ? col : INK));
      inkV(ctx, pts, w, { color: c, alpha: (o.alpha ?? 1) * (o.fixed ? colorK : 1), boil: 0.0022, seed: pts.length * 3, taper: o.taper || [0.25, 0.25] });
    } else if (k === 'fill') {
      const [, pts, col, o] = op; if (colorK <= 0.01) continue;
      wash(ctx, pts, col, { alpha: colorK, edge: 0, texture: o.flat ? 0 : 0.1, off: [0, 0], boil: 0.0012, glow: o.glow || null });
    } else if (k === 'iris') {
      const [, pts, [a, b]] = op;
      ctx.save(); ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py));
      if (colorK < 0.99) { ctx.fillStyle = INK; ctx.globalAlpha = 0.85 * (1 - colorK); ctx.fill(); }
      if (colorK > 0.01) { ctx.globalAlpha = colorK; const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, '#1d0d07'); g.addColorStop(0.55, '#5a2f17'); g.addColorStop(1, '#c47a3c'); ctx.fillStyle = g; ctx.fill(); }
      ctx.restore();
      inkV(ctx, pts, 0.006, { color: lk > 0 ? '#24110a' : INK, boil: 0.0015, closed: true });
    } else if (k === 'shine') {
      if (colorK > 0.01) inkV(ctx, op[1], 0.03, { color: 'rgba(205,150,120,0.5)', alpha: colorK, boil: 0.001, taper: [0.4, 0.4] });
    }
  }
}
