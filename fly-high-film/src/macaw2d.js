// Blue-and-gold macaw, side view facing +x. Local units: ~1 = body+head length; y down.
import { spline, ellipse, xf } from './sketch.js';
import { renderOps, thick } from './illus.js';
import { lerp, clamp } from './util.js';

const M = {
  back: { f: '#1f86d6', s: 'rgba(8,40,120,0.6)', r: 'rgba(170,235,255,0.75)', l: '#0b2f6e' },
  teal: { f: '#22b3d6', s: 'rgba(8,70,120,0.55)', r: 'rgba(200,250,255,0.7)', l: '#0b3f72' },
  prim: { f: '#1550b8', s: 'rgba(6,20,80,0.6)', r: 'rgba(140,190,255,0.6)', l: '#081d55' },
  under: { f: '#e9b53a', s: 'rgba(150,90,10,0.55)', r: 'rgba(255,240,170,0.7)', l: '#7a4a08' },
  gold: { f: '#ffb526', s: 'rgba(214,100,10,0.55)', r: 'rgba(255,245,180,0.85)', l: '#8c4a06' },
  green: { f: '#7cc443', s: 'rgba(30,90,20,0.5)', r: 'rgba(220,255,180,0.6)', l: '#2c5a12' },
  white: { f: '#fbf8f2', s: 'rgba(170,160,150,0.4)', r: null, l: '#5a5550' },
  beak: { f: '#2b2b31', s: 'rgba(0,0,0,0.6)', r: 'rgba(170,170,190,0.7)', l: '#0c0c10' },
  black: { f: '#1a1a1e', s: null, r: null, l: '#08080a' },
  foot: { f: '#6e6e78', s: 'rgba(20,20,30,0.5)', r: 'rgba(200,200,210,0.5)', l: '#2a2a30' },
};

// pose: { phase, flap (0..1), fold (0..1), legs (0..1), beak (0..1), tilt, look }
export function drawMacaw(ctx, t, x, y, s, pose = {}, { colorK = 1, flip = 1, rot = 0, lineK = null, collect = false } = {}) {
  const P = Object.assign({ phase: 0, flap: 1, fold: 0, legs: 0, beak: 0, tilt: 0, glide: 0.25 }, pose);
  const ops = [];
  const part = (pts, pal, o = {}) => ops.push(['part', pts, pal, o]);
  const line = (pts, w, col, o = {}) => ops.push(['line', pts, w, col, o]);
  const fill = (pts, col, o = {}) => ops.push(['fill', pts, col, o]);

  // wing lift: +1 up, -1 down
  const lift = lerp(P.glide, Math.sin(P.phase), P.flap) * (1 - P.fold);
  const S = [0.04, -0.12];

  // wing built from individual feathers in plan coords (bk = toward tail, out = span), projected with sin(elevation)
  const feather = (base, ang, len, wid) => { // ang: 0 = pointing outward, PI/2 = pointing back
    const u = [Math.sin(ang), Math.cos(ang)], v = [u[1], -u[0]];
    const sh = [[0, -0.5], [0.35, -1], [0.8, -0.8], [1, 0], [0.8, 0.8], [0.35, 1], [0, 0.5]];
    return sh.map(([a, c]) => [base[0] + u[0] * a * len + v[0] * c * wid * 0.5, base[1] + u[1] * a * len + v[1] * c * wid * 0.5]);
  };
  const wing = (near) => {
    if (P.fold > 0.5) return foldedWing(near);
    const elev = lift * 1.25 + 0.12;
    const sy = Math.sin(elev), up = sy >= 0;
    if (!near && Math.abs(sy) < 0.3) return; // edge-on far wing is hidden by the body
    const L = near ? 1.08 : 0.95;
    const prj = ([bk, out]) => [S[0] - bk * L * 0.95 + (near ? 0 : 0.06), S[1] - out * L * Math.max(Math.abs(sy), 0.06) * Math.sign(sy || 1)];
    const P2 = pts => spline(pts.map(prj), true, 3);
    const dim = near ? 1 : 0.8;
    const col = (h, ul) => ({ ...h, f: ul });
    const prim = up ? col(M.prim, near ? '#1650b8' : '#103e94') : col(M.under, near ? '#c9a24a' : '#a98838');
    const secC = up ? col(M.back, near ? '#1f77d0' : '#165fae') : col(M.under, near ? '#d8b04c' : '#b3913e');
    const gcov = up ? col(M.teal, near ? '#22b3d6' : '#1890b4') : col(M.gold, near ? '#f2b630' : '#d39b2a');
    const lcov = up ? col(M.teal, near ? '#3cc6e2' : '#22a3c4') : col(M.gold, near ? '#ffc443' : '#e0a634');
    // primaries: from the hand, fanning outward -> back (draw back-most first so the outermost sits on top)
    for (let i = 9; i >= 0; i--) { const k = i / 9; const base = [lerp(0.02, 0.07, k), lerp(0.56, 0.72, k)]; part(P2(feather(base, lerp(1.25, 0.18, k), lerp(0.3, 0.5, k), 0.085)), prim, { w: 0.007, d: 0.02 }); }
    // secondaries along the forearm, pointing back
    for (let i = 10; i >= 0; i--) { const k = i / 10; const base = [0.03, lerp(0.06, 0.56, k)]; part(P2(feather(base, lerp(1.55, 1.38, k), 0.4, 0.09)), secC, { w: 0.007, d: 0.02 }); }
    // greater coverts
    for (let i = 11; i >= 0; i--) { const k = i / 11; const base = [-0.02, lerp(0.04, 0.66, k)]; part(P2(feather(base, lerp(1.5, 1.0, k), 0.21, 0.085)), gcov, { w: 0.006, d: 0.015 }); }
    // lesser coverts + leading edge
    for (let i = 8; i >= 0; i--) { const k = i / 8; const base = [-0.06, lerp(0.02, 0.6, k)]; part(P2(feather(base, lerp(1.45, 1.1, k), 0.12, 0.08)), lcov, { w: 0.005, d: 0.012 }); }
    part(P2([[-0.08, 0], [-0.1, 0.3], [-0.06, 0.6], [0.0, 0.7], [0.0, 0.58], [-0.03, 0.3], [-0.02, 0.0]]), lcov, { w: 0.008 });
  };
  const foldedWing = () => {
    const pts = spline([[0.1, -0.15], [-0.05, -0.19], [-0.3, -0.12], [-0.62, -0.02], [-0.78, 0.04], [-0.55, 0.06], [-0.25, 0.04], [0.02, -0.02]], true, 8);
    part(pts, M.back, { w: 0.012, d: 0.04 });
    part(spline([[0.08, -0.15], [-0.08, -0.18], [-0.22, -0.13], [-0.12, -0.07], [0.04, -0.06]], true, 6), M.teal, { w: 0.008 });
    for (let i = 0; i < 6; i++) line(spline([[-0.15 - i * 0.07, -0.13 + i * 0.02], [-0.3 - i * 0.07, -0.04 + i * 0.012]]), 0.005, M.prim.l, { alpha: 0.7 });
  };

  // far wing (behind)
  wing(false);
  // tail
  const tailK = 0.04 * Math.sin(t * 2.5);
  for (const [dy, len, pal] of [[0.03, 1.0, M.under], [-0.01, 1.08, M.back], [0.015, 0.95, M.prim]]) {
    const tp = spline([[-0.33, 0.0 + dy * 0.5], [-0.7, 0.07 + dy + tailK], [-0.33 - 0.78 * len, 0.16 + dy * 2 + tailK * 1.5]], false, 10);
    part(thick(tp, 0.055, 0.012), pal, { w: 0.009 });
  }
  // body
  const body = spline([[-0.38, 0.0], [-0.17, -0.17], [0.08, -0.23], [0.25, -0.25], [0.35, 0.04], [0.24, 0.2], [0.0, 0.22], [-0.23, 0.13]], true, 10);
  part(body, M.back, { w: 0.014, d: 0.05 });
  part(spline([[-0.3, 0.07], [-0.1, 0.02], [0.14, -0.02], [0.32, -0.01], [0.33, 0.07], [0.22, 0.19], [0.0, 0.21], [-0.21, 0.13]], true, 8), M.gold, { w: 0.01, d: 0.04 });
  // head
  const hc = [0.36, -0.16];
  const H = pts => xf(pts.map(([a, b]) => [a - hc[0], b - hc[1]]), { x: hc[0], y: hc[1], r: P.tilt });
  part(H(spline([[0.22, -0.2], [0.3, -0.31], [0.43, -0.32], [0.52, -0.24], [0.52, -0.1], [0.44, -0.03], [0.3, -0.02], [0.24, -0.08]], true, 8)), M.teal, { w: 0.013, d: 0.04 });
  part(H(spline([[0.3, -0.3], [0.42, -0.33], [0.51, -0.26], [0.46, -0.22], [0.36, -0.25]], true, 6)), M.green, { w: 0.008 });
  // white face patch + stripes
  part(H(spline([[0.38, -0.22], [0.47, -0.25], [0.53, -0.18], [0.52, -0.08], [0.44, -0.06], [0.39, -0.12]], true, 8)), M.white, { w: 0.008 });
  for (let i = 0; i < 4; i++) line(H(spline([[0.41 + i * 0.012, -0.12 - i * 0.005], [0.45 + i * 0.012, -0.135 - i * 0.008], [0.5, -0.14 - i * 0.01]])), 0.006, '#151515', { taper: [0.2, 0.5] });
  // black throat band
  part(H(spline([[0.36, -0.045], [0.45, -0.055], [0.49, -0.02], [0.42, 0.01], [0.35, -0.005]], true, 6)), M.black, { w: 0.006 });
  // eye
  const ex = 0.445, ey = -0.2;
  part(H(ellipse(ex, ey, 0.026, 0.026, 18)), { f: '#f4ecc4', s: 'rgba(160,120,40,0.4)', r: null, l: '#2a2010' }, { w: 0.006 });
  fill(H(ellipse(ex + 0.004, ey, 0.012, 0.013, 12)), '#050505', { flat: true });
  fill(H(ellipse(ex - 0.004, ey - 0.008, 0.006, 0.006, 8)), 'rgba(255,255,255,0.95)', { flat: true });
  // beak (hooked)
  const bo = P.beak * 0.035;
  part(H(spline([[0.49, -0.07 + bo * 0.3], [0.57, -0.05 + bo], [0.6, 0.01 + bo], [0.55, 0.04 + bo], [0.49, -0.01 + bo * 0.5]], true, 6)), M.beak, { w: 0.009 });
  part(H(spline([[0.5, -0.23], [0.6, -0.22], [0.67, -0.13], [0.67, -0.02], [0.62, 0.05], [0.6, -0.04], [0.55, -0.08], [0.5, -0.07]], true, 8)), M.beak, { w: 0.012, d: 0.03 });
  line(H(spline([[0.53, -0.2], [0.6, -0.18], [0.64, -0.1]])), 0.012, 'rgba(200,200,215,0.55)', { fixed: true, taper: [0.4, 0.4] });
  // feet
  if (P.legs > 0.01) {
    for (const dx of [0.0, 0.08]) { const fy = 0.15 + 0.08 * P.legs;
      part(thick(spline([[dx - 0.02, 0.12], [dx - 0.01, fy]]), 0.02, 0.018), M.foot, { w: 0.006 });
      for (const tx of [-0.05, 0.04]) part(thick(spline([[dx - 0.01, fy], [dx + tx, fy + 0.02]]), 0.012, 0.008), M.foot, { w: 0.005 });
    }
  }
  // near wing (in front)
  wing(true);

  if (collect) return ops;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * flip, s);
  renderOps(ctx, ops, colorK, lineK ?? colorK, t);
  ctx.restore();
}

// where Noa sits on the back (local coords)
export const SEAT = [0.0, -0.2];
