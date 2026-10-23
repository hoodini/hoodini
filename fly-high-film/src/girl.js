// "Noa" — the heroine. Hand-inked, then coloured like a picture-book illustration.
// Local units: height ~1, feet at (0,0), y down.
import { spline, ellipse, xf, inkV, wash, cel, INK } from './sketch.js';
import { clamp, lerp } from './util.js';
import { renderOps, mixHex, thick } from './illus.js';

const PAL = {
  skin: { f: '#ffdac6', s: 'rgba(236,128,108,0.42)', r: 'rgba(255,250,242,0.75)', l: '#b4563f' },
  hair: { f: '#3f2419', s: 'rgba(16,6,2,0.55)', r: 'rgba(170,110,78,0.6)', l: '#1e0f08' },
  hood: { f: '#f7b538', s: 'rgba(218,104,18,0.62)', r: 'rgba(255,244,190,0.85)', l: '#97470d' },
  hoodIn: { f: '#e6922a', s: 'rgba(170,70,10,0.6)', r: null, l: '#97470d' },
  jeans: { f: '#4268a6', s: 'rgba(16,30,72,0.55)', r: 'rgba(150,190,255,0.45)', l: '#1b2b58' },
  shoe: { f: '#fffaf0', s: 'rgba(140,150,190,0.5)', r: null, l: '#4e5470' },
  pack: { f: '#2fae9c', s: 'rgba(8,72,74,0.58)', r: 'rgba(190,255,240,0.55)', l: '#0d4f4a' },
  strap: { f: '#1f8a7d', s: 'rgba(8,50,50,0.5)', r: null, l: '#0d4f4a' },
  star: { f: '#ffd23f', s: 'rgba(230,140,20,0.6)', r: 'rgba(255,255,240,0.9)', l: '#a8620c' },
};

function _mixHex(a, b, k) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const r = (pa >> 16) * (1 - k) + (pb >> 16) * k, g = ((pa >> 8) & 255) * (1 - k) + ((pb >> 8) & 255) * k, bl = (pa & 255) * (1 - k) + (pb & 255) * k; return `rgb(${r | 0},${g | 0},${bl | 0})`; }
function _thick(sp, w0, w1) { const a = [], b = []; for (let i = 0; i < sp.length; i++) { const p0 = sp[Math.max(0, i - 1)], p1 = sp[Math.min(sp.length - 1, i + 1)]; const dx = p1[0] - p0[0], dy = p1[1] - p0[1], d = Math.hypot(dx, dy) || 1; const w = lerp(w0, w1, i / (sp.length - 1)); a.push([sp[i][0] - dy / d * w, sp[i][1] + dx / d * w]); b.push([sp[i][0] + dy / d * w, sp[i][1] - dx / d * w]); } return a.concat(b.reverse()); }

export function drawGirl(ctx, t, x, y, s, p = {}, { colorK = 1, flip = 1, collect = false, lineK = null } = {}) {
  const P = Object.assign({ look: [0, 0], smile: 0.6, worry: 0, open: 0, lid: 0, cry: 0, blink: true, walk: 0, phase: 0, sit: 0, ride: 0, armL: 0, armR: 0, wave: 0, hug: 0, phone: 0, headTilt: 0, bob: 0, headDrop: 0, turn: 0 }, p);
  const tu = P.turn; // 0 = facing camera, 1 = three-quarter view facing +x
  const ops = [];
  const lk = lineK ?? colorK; // 0 = navy ballpoint, 1 = coloured lines
  const part = (pts, pal, o = {}) => ops.push(['part', pts, pal, o]);
  const line = (pts, w, col, o = {}) => ops.push(['line', pts, w, col, o]);
  const fill = (pts, col, o = {}) => ops.push(['fill', pts, col, o]);

  const sit = Math.max(P.sit, P.ride), walk = P.walk * (1 - sit);
  const sw = Math.sin(P.phase), bob = Math.abs(Math.cos(P.phase)) * 0.022 * walk + P.bob;
  const drop = sit * 0.22;
  const by = -bob + drop;

  // ----- backpack (behind)
  const pk = -0.4 + by;
  part(xf(spline([[-0.21, pk - 0.08], [-0.12, pk - 0.17], [0.12, pk - 0.17], [0.21, pk - 0.08], [0.23, pk + 0.12], [0.12, pk + 0.19], [-0.12, pk + 0.19], [-0.23, pk + 0.12]], true, 8), { x: -tu * 0.09, sx: 1 - tu * 0.25 }), PAL.pack, { w: 0.013, hidden: tu < 0.3 });

  // ----- legs
  const hipY = -0.2 + drop;
  const gait = sd => { // stance: foot slides back linearly (planted on the ground); swing: lifts and moves forward
    const u = (((P.phase + (sd > 0 ? Math.PI : 0)) / (Math.PI * 2)) % 1 + 1) % 1, A = 0.095;
    if (u < 0.5) return [A * (1 - 4 * u), 0];
    const v = (u - 0.5) * 2; return [A * (-1 + 2 * (v * v * (3 - 2 * v))), Math.sin(v * Math.PI) * 0.06];
  };
  const legs = (tu > 0.5 ? [1, -1] : [-1, 1]).map(sd => {
    const k = sd * sw * walk;
    if (sit > 0.01) {
      const kS = [sd * 0.085, -0.25 - P.hug * 0.02], fS = [sd * 0.09, -0.01];
      const kR = [sd * 0.13, -0.05 + drop], fR = [sd * 0.16, 0.07 + drop + Math.sin(t * 3 + sd) * 0.012];
      return { sd, knee: [lerp(sd * 0.065, lerp(kS[0], kR[0], P.ride), sit), lerp(-0.1, lerp(kS[1], kR[1], P.ride), sit)], foot: [lerp(sd * 0.07, lerp(fS[0], fR[0], P.ride), sit), lerp(0, lerp(fS[1], fR[1], P.ride), sit)] };
    }
    const hx = sd * 0.06 * (1 - tu * 0.6) + tu * 0.01, g = gait(sd);
    const fx = hx + sd * 0.01 * (1 - tu) + g[0] * walk * tu + k * 0.1 * (1 - tu), fy = -g[1] * walk * tu - Math.max(0, k) * 0.055 * (1 - tu);
    return { sd, hx, knee: [(hx + fx) / 2 + (g[1] * 0.6 + 0.01) * tu * walk + k * 0.05 * (1 - tu), (hipY + fy) / 2 + 0.003 - g[1] * 0.25 * walk * tu], foot: [fx, fy] };
  });
  const drawLegs = () => legs.forEach(L => {
    const hip = [L.hx ?? L.sd * 0.06, hipY];
    part(thick(spline([hip, L.knee, L.foot], false, 8), 0.05, 0.044), PAL.jeans, { w: 0.011 });
    const f = L.foot;
    const ts = Math.max(tu, sit); // front-facing shoes point at the camera; turned shoes point forward
    const side = [[-0.06, -0.015], [-0.01, -0.055], [0.05, -0.04], [0.08, 0.0], [0.05, 0.028], [-0.055, 0.025]];
    const front = [[-0.045, -0.012], [-0.02, -0.05], [0.025, -0.05], [0.05, -0.012], [0.035, 0.028], [-0.035, 0.028]];
    part(spline(side.map((p, i) => [f[0] + lerp(front[i][0] + L.sd * 0.008, p[0], ts), f[1] + lerp(front[i][1], p[1], ts)]), true, 6), PAL.shoe, { w: 0.011 });
    line([[f[0] + lerp(-0.035, -0.05, ts), f[1] + 0.012], [f[0] + lerp(0.035, 0.07, ts), f[1] + 0.012]], 0.009, '#e8453c', { fixed: true });
  });
  if (sit < 0.5) drawLegs();

  const bodyStart = ops.length; // the far arm is moved before the body when she is turned
  // ----- body: soft bell-shaped hoodie
  const bT = -0.5 + by, bB = -0.17 + by;
  const B = pts => tu > 0 ? xf(pts, { sx: 1 - tu * 0.1 }) : pts, F = pts => tu > 0 ? pts.map(([a, b]) => [a * (1 - tu * 0.3) + tu * 0.05, b]) : pts;
  part(B(spline([[-0.12, bT], [0, bT - 0.015], [0.12, bT], [0.19, bT + 0.07], [0.215, bB - 0.07], [0.2, bB], [0.08, bB + 0.02], [-0.08, bB + 0.02], [-0.2, bB], [-0.215, bB - 0.07], [-0.19, bT + 0.07]], true, 8)), PAL.hood, { w: 0.014 });
  line(F(spline([[-0.11, bB - 0.11], [-0.05, bB - 0.135], [0.05, bB - 0.135], [0.11, bB - 0.11]])), 0.007, PAL.hood.l, { alpha: 0.7 });
  line(F([[-0.11, bB - 0.11], [-0.12, bB - 0.02]]), 0.006, PAL.hood.l, { alpha: 0.6 }); line(F([[0.11, bB - 0.11], [0.12, bB - 0.02]]), 0.006, PAL.hood.l, { alpha: 0.6 });
  line(spline([[-0.2, bB - 0.03], [0, bB - 0.005], [0.2, bB - 0.03]]), 0.006, PAL.hood.l, { alpha: 0.5 });
  for (const sd of [-1, 1]) {
    line(F(spline([[sd * 0.035, bT + 0.03], [sd * 0.04, bT + 0.08], [sd * 0.034, bT + 0.12]])), 0.007, '#fff6e0', { fixed: true, alpha: 0.95 });
    fill(F(ellipse(sd * 0.034, bT + 0.125, 0.008, 0.011, 10)), '#c9c9cf');
    part(thick(F(spline([[sd * 0.115, bT + 0.005], [sd * 0.13, bT + 0.09], [sd * 0.12, bT + 0.19]])), 0.016, 0.014), PAL.strap, { w: 0.007 });
  }
  part(F(spline([[-0.16, bT + 0.02], [-0.12, bT - 0.045], [0, bT - 0.06], [0.12, bT - 0.045], [0.16, bT + 0.02], [0.06, bT + 0.05], [-0.06, bT + 0.05]], true, 6)), PAL.hoodIn, { w: 0.011, hidden: true });
  if (sit >= 0.5) drawLegs();

  // ----- arms (sleeves + mitten hands)
  const shoulder = sd => [sd * 0.165 * (1 - tu * 0.35) + tu * 0.01, bT + 0.065];
  const hands = {};
  const arm = (sd, ang, bend, target = null) => {
    const sh = shoulder(sd);
    let el = [sh[0] + Math.sin(ang) * 0.125 * sd, sh[1] + Math.cos(ang) * 0.125];
    let hd = [el[0] + Math.sin(ang + bend) * 0.115 * sd, el[1] + Math.cos(ang + bend) * 0.115];
    if (target) { hd = target; el = [lerp(sh[0], hd[0], 0.5) + sd * 0.06, lerp(sh[1], hd[1], 0.5) + 0.02]; }
    const sp = spline([sh, el, hd], false, 8);
    part(thick(sp, 0.052, 0.038), PAL.hood, { w: 0.012 });
    const cuffC = sp[sp.length - 2];
    const dir = Math.atan2(hd[1] - cuffC[1], hd[0] - cuffC[0]);
    part(xf(ellipse(0, 0, 0.018, 0.042, 14), { x: hd[0] - Math.cos(dir) * 0.012, y: hd[1] - Math.sin(dir) * 0.012, r: dir }), PAL.hoodIn, { w: 0.008 });
    part(xf(spline([[0, -0.03], [0.03, -0.028], [0.045, 0.0], [0.03, 0.03], [0, 0.032], [-0.012, 0.0]], true, 6), { x: hd[0] + Math.cos(dir) * 0.02, y: hd[1] + Math.sin(dir) * 0.02, r: dir }), PAL.skin, { w: 0.008 });
    hands[sd] = hd; return hd;
  };
  const swing = sw * 0.5 * walk, hugK = P.hug * sit;
  const aSw = sd => lerp(sd < 0 ? swing : -swing, sd * gait(sd)[0] * 4.8 * walk, tu); // arms opposite to the same-side leg
  const hugT = sd => [sd * 0.045, -0.2];
  arm(-1, 0.32 + aSw(-1) + P.armL * 2.3, 0.25, hugK > 0.5 ? hugT(-1) : null);
  const waving = P.wave > 0.01;
  const rightArm = () => arm(1, 0.32 + aSw(1) + P.armR * 2.3 + (waving ? 2.3 * P.wave : 0), 0.25 + (waving ? -0.9 * P.wave + Math.sin(t * 12) * 0.4 * P.wave : 0),
    P.phone > 0.01 ? [0.04, bT + 0.11] : (hugK > 0.5 ? hugT(1) : null));
  if (!waving) { const i0 = ops.length; rightArm(); if (tu > 0.5) ops.splice(bodyStart, 0, ...ops.splice(i0)); }
  if (P.phone > 0.01) {
    const c0 = [0.0, bT + 0.04];
    const ph = spline([[c0[0] - 0.042, c0[1] - 0.065], [c0[0] + 0.042, c0[1] - 0.065], [c0[0] + 0.042, c0[1] + 0.065], [c0[0] - 0.042, c0[1] + 0.065]], true, 3);
    part(ph, { f: '#1d2333', s: null, r: 'rgba(120,140,190,0.6)', l: '#0b0e18' }, { w: 0.008 });
    fill(ph.map(([a, b]) => [lerp(c0[0], a, 0.82), lerp(c0[1], b, 0.86)]), '#8fdcff', { glow: 'rgba(255,255,255,0.9)' });
  }

  // ----- head
  const hc = [Math.sin(P.phase) * 0.008 * walk, -0.735 + by + P.headDrop];
  const H = (pts) => xf(pts, { x: hc[0], y: hc[1], r: P.headTilt + sw * 0.025 * walk * (1 - tu) + tu * walk * 0.04 });
  const fH = (pts) => H(tu > 0 ? pts.map(([a, b]) => [a * (1 - tu * 0.18) + tu * 0.055, b]) : pts); // facial features in 3/4
  part(H(spline([[-0.27, 0.13], [-0.3, -0.04], [-0.24, -0.21], [-0.1, -0.29], [0.08, -0.295], [0.23, -0.22], [0.3, -0.05], [0.28, 0.13], [0.31, 0.19], [0.2, 0.2], [0.15, 0.12], [-0.15, 0.12], [-0.2, 0.2], [-0.31, 0.19]], true, 8)), PAL.hair, { w: 0.015 });
  part(H(spline([[-0.245, 0.02], [-0.235, -0.13], [-0.15, -0.235], [0, -0.258], [0.15, -0.235], [0.235, -0.13], [0.245, 0.02], [0.215, 0.12], [0.12, 0.195], [0, 0.218], [-0.12, 0.195], [-0.215, 0.12]], true, 10)), PAL.skin, { w: 0.013, d: 0.035 });
  for (const sd of [-1, 1]) {
    const cx = sd * 0.15 + P.look[0] * 0.02, cy = 0.105;
    fill(fH(ellipse(cx, cy, 0.06, 0.038, 20)), 'rgba(255,118,118,0.32)');
    for (let k = 0; k < 3; k++) line(fH([[cx - 0.022 + k * 0.016, cy + 0.012], [cx - 0.014 + k * 0.016, cy - 0.01]]), 0.0045, 'rgba(235,90,90,0.75)', { fixed: true });
  }
  const blink = P.blink ? (((t + 0.37) % 3.4) < 0.12 ? 1 : 0) : 0;
  const lid = clamp(Math.max(P.lid, blink));
  for (const sd of [-1, 1]) {
    const ex = sd * 0.1 + P.look[0] * 0.026, ey = 0.045 + P.look[1] * 0.016;
    const rx = 0.05 * (1 - (sd > 0 ? 0.22 : -0.04) * tu), ry = 0.064 * (1 - lid * 0.9);
    if (ry > 0.008) {
      ops.push(['iris', fH(ellipse(ex, ey, rx, ry, 30)), fH([[ex, ey - ry], [ex, ey + ry]])]);
      fill(fH(ellipse(ex + P.look[0] * 0.006, ey + ry * 0.12, rx * 0.46, ry * 0.5, 20)), '#0e0604', { flat: true });
      if (lid < 0.55) {
        fill(fH(ellipse(ex - 0.016, ey - ry * 0.42, 0.019, 0.022 * (1 - lid), 16)), 'rgba(255,255,255,0.98)', { flat: true });
        fill(fH(ellipse(ex + 0.018, ey + ry * 0.48, 0.008, 0.008, 10)), 'rgba(255,255,255,0.92)', { flat: true });
        fill(fH(ellipse(ex + 0.004, ey + ry * 0.62, 0.026, 0.01, 14)), 'rgba(255,190,120,0.35)', { flat: true });
      }
    }
    const ly = ey - ry - 0.004;
    line(fH(spline([[ex - sd * 0.052, ly + 0.02], [ex - sd * 0.02, ly - 0.004], [ex + sd * 0.028, ly], [ex + sd * 0.058, ly + 0.024 + P.worry * 0.004]])), 0.017, '#24110a', { taper: [0.15, 0.35] });
    line(fH([[ex + sd * 0.054, ly + 0.02], [ex + sd * 0.07, ly + 0.012]]), 0.007, '#24110a', { taper: [0.1, 0.9] });
    if (ry > 0.02) line(fH(spline([[ex - sd * 0.028, ey + ry * 0.92], [ex + sd * 0.01, ey + ry * 1.03], [ex + sd * 0.04, ey + ry * 0.85]])), 0.0045, '#b4563f', { alpha: 0.6 });
    const bY = -0.075 - P.worry * 0.01;
    line(fH(spline([[ex - sd * 0.03, bY + 0.006 - P.worry * 0.026], [ex + sd * 0.002, bY - 0.008 - P.worry * 0.006], [ex + sd * 0.034, bY + 0.004 + P.worry * 0.008]])), 0.009, '#3a1d12', { taper: [0.3, 0.6] });
    if (P.cry > 0.01) {
      line(fH(spline([[ex + sd * 0.03, ey + ry * 0.8], [ex + sd * 0.036, ey + ry + 0.05], [ex + sd * 0.03, ey + ry + 0.1]])), 0.008, 'rgba(110,190,255,0.55)', { fixed: true, alpha: P.cry });
      for (let k = 0; k < 2; k++) {
        const ph2 = (t * 0.85 + k * 0.5 + (sd > 0 ? 0.27 : 0)) % 1;
        const tx = ex + sd * 0.034, ty = ey + ry + 0.012 + ph2 * 0.13, sc = 0.7 + 0.3 * Math.sin(ph2 * Math.PI);
        part(fH(spline([[tx, ty - 0.024 * sc], [tx + 0.014 * sc, ty + 0.004], [tx, ty + 0.018 * sc], [tx - 0.014 * sc, ty + 0.004]], true, 6)), { f: `rgba(150,215,255,${0.9 * P.cry})`, s: null, r: 'rgba(255,255,255,0.95)', l: '#3d8fd0' }, { w: 0.004 });
      }
    }
  }
  line(fH(spline([[-0.008 + P.look[0] * 0.02, 0.112], [0.006 + P.look[0] * 0.02, 0.12], [-0.002 + P.look[0] * 0.02, 0.127]])), 0.0065, '#b4563f', { alpha: 0.8 });
  const mx = P.look[0] * 0.02, my = 0.165, mw = 0.038;
  if (P.open > 0.05) {
    part(fH(spline([[mx - mw, my - P.smile * 0.008], [mx, my - 0.006], [mx + mw, my - P.smile * 0.008], [mx + mw * 0.5, my + 0.03 * P.open], [mx, my + 0.04 * P.open + 0.004], [mx - mw * 0.5, my + 0.03 * P.open]], true, 6)), { f: '#8e2b3a', s: null, r: null, l: '#5e1220' }, { w: 0.008 });
    fill(fH(ellipse(mx, my + 0.026 * P.open, 0.018, 0.009 * P.open + 0.002, 12)), '#ff8d9b', { flat: true });
  } else {
    const wob = P.worry > 0.5 ? Math.sin(t * 9) * 0.0025 : 0;
    line(fH(spline([[mx - mw, my - P.smile * 0.012], [mx - mw * 0.4, my + P.smile * 0.012 + wob], [mx + mw * 0.4, my + P.smile * 0.012 - wob], [mx + mw, my - P.smile * 0.012]])), 0.009, '#7a2a24', { taper: [0.3, 0.3] });
  }
  part(H(spline([[-0.255, 0.0], [-0.255, -0.15], [-0.17, -0.25], [0, -0.285], [0.17, -0.25], [0.255, -0.15], [0.255, 0.0],
    [0.225, -0.06], [0.16, -0.11], [0.09, -0.115], [0.035, -0.135], [-0.03, -0.12], [-0.1, -0.13], [-0.17, -0.105], [-0.225, -0.06]], true, 8)), PAL.hair, { w: 0.014 });
  ops.push(['shine', H(spline([[-0.17, -0.19], [-0.07, -0.235], [0.06, -0.24], [0.17, -0.2]], false, 10))]);
  for (const [a, b] of [[[-0.07, -0.25], [-0.04, -0.14]], [[0.06, -0.26], [0.04, -0.15]], [[0.17, -0.21], [0.17, -0.12]]]) line(H(spline([a, [(a[0] + b[0]) / 2 + 0.01, (a[1] + b[1]) / 2], b])), 0.006, PAL.hair.l, { alpha: 0.8 });
  line(H(spline([[0.02, -0.28], [0.03, -0.35 - Math.sin(t * 2.2) * 0.008], [0.1, -0.37], [0.11, -0.32], [0.07, -0.31]])), 0.013, PAL.hair.l, { taper: [0.1, 0.5] });
  const st = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.02 : 0.046; st.push([0.16 + Math.cos(a) * r, -0.17 + Math.sin(a) * r]); }
  part(H(st), PAL.star, { w: 0.008 });

  if (waving) rightArm();
  if (collect) return ops;

  ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s);
  renderOps(ctx, ops, colorK, lk, t);
  ctx.restore();
  return { hands, head: hc };
}

// ink-only stroke list for the notebook doodle (local units)
export function girlStrokes(pose = { smile: 0.6, blink: false, look: [0, 0] }) {
  const ops = drawGirl(null, 0, 0, 0, 1, pose, { collect: true });
  const out = [];
  for (const op of ops) {
    if (op[0] === 'part') { if (!op[3].hidden) out.push({ pts: op[1], w: (op[3].w ?? 0.012) * 0.85 }); }
    else if (op[0] === 'line' && !op[4].fixed) out.push({ pts: op[1], w: op[2] * 0.85 });
    else if (op[0] === 'iris') out.push({ pts: op[1], w: 0.006, dark: true });
  }
  return out;
}
