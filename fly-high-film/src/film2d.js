// The illustrated (2D) part of the film: everything lives on an endless notebook page.
import { paper, setBoil, spline, ellipse, xf, inkV, wash, cel, blob, clipPoly, trim, INK, LINE_GAP } from './sketch.js';
import { drawGirl } from './girl.js';
import { drawMacaw } from './macaw2d.js';
import { renderOps, mixHex } from './illus.js';
import { clamp, lerp, smooth, smoother, pulse, easeInOut, easeOutCubic, easeInCubic, easeOutBack, rng, noise1, noise2 } from './util.js';

export const G = 1.066;            // ground line (feet) in page units
export const GIRL = [0.55, G];     // where the doodle is drawn
export const GS = 0.55;            // girl scale (height in page units)

// --------------------------------------------------------------- helpers
function wtext(ctx, str, x, y, size, color, { weight = 800, font = '"Rubik", sans-serif', align = 'center', alpha = 1, stroke = null, sw = 0, maxW = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); let k = size / 100; ctx.font = `${weight} 100px ${font}`;
  if (maxW) { const mw = ctx.measureText(str).width * k; if (mw > maxW) k *= maxW / mw; }
  ctx.scale(k, k); ctx.globalAlpha *= alpha;
  ctx.font = `${weight} 100px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.direction = /[֐-׿]/.test(str) ? 'rtl' : 'ltr';
  if (stroke) { ctx.lineJoin = 'round'; ctx.strokeStyle = stroke; ctx.lineWidth = sw / k; ctx.strokeText(str, 0, 0); }
  ctx.fillStyle = color; ctx.fillText(str, 0, 0); ctx.restore();
}
function emoji(ctx, e, x, y, size, alpha = 1) { ctx.save(); ctx.translate(x, y); const k = size / 100; ctx.scale(k, k); ctx.globalAlpha *= alpha; ctx.font = '100px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, 0, 6); ctx.restore(); }
const rrect = (x, y, w, h, r) => spline([[x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r]], true, 4);

// --------------------------------------------------------------- notification card (illustrated)
const TOASTS = [
  ['🔔', 'התראה חדשה', '38 הודעות שלא נקראו', '#ff4d5e'], ['🚀', 'יצא מודל חדש!', 'חובה לנסות היום', '#7b5cff'], ['⚡', 'עדכון גרסה 4.2', 'הכל השתנה. שוב.', '#ff8a1f'],
  ['📣', 'אל תפספסו!', 'הוובינר מתחיל עכשיו', '#2f80ff'], ['🤖', 'כלי AI חדש', '10 דברים שחייבים לדעת', '#00b37e'], ['📈', 'טרנד חם', 'כולם כבר משתמשים בזה', '#ffb400'],
  ['⏰', 'דדליין!', 'נשארו שעתיים', '#ff4d5e'], ['💬', 'קבוצה (412)', 'ראית את זה?!', '#7b5cff'], ['🧠', 'Agents 2.0', 'המדריך המלא', '#2f80ff'],
  ['🔥', 'FOMO', 'כולם כבר שם', '#ff4d5e'], ['📰', 'מבזק', 'עוד הכרזה גדולה', '#ff8a1f'], ['📧', '47 מיילים', 'דחוף לטפל', '#00b37e'],
  ['🛠️', 'עוד כלי', 'גם אותו צריך ללמוד', '#ffb400'], ['❗', 'דחוף', 'תענה עכשיו', '#ff4d5e'],
];
function card(ctx, x, y, s, rot, [ic, title, sub, col], { colorK = 1, alpha = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= alpha;
  const w = 0.56, h = 0.17, r = 0.04;
  // soft shadow
  wash(ctx, rrect(-w / 2 + 0.01, -h / 2 + 0.014, w, h, r), 'rgba(40,40,80,0.18)', { edge: 0, texture: 0, off: [0, 0], boil: 0.001 });
  const body = rrect(-w / 2, -h / 2, w, h, r);
  wash(ctx, body, '#fffdf8', { alpha: colorK, edge: 0, texture: 0.12, light: 'rgba(255,255,255,0.8)', shade: 'rgba(120,130,170,0.18)' });
  const icon = rrect(w / 2 - 0.15, -h / 2 + 0.025, 0.12, 0.12, 0.028);
  wash(ctx, icon, col, { alpha: colorK, edge: 0, texture: 0.15, light: 'rgba(255,255,255,0.45)' });
  inkV(ctx, icon, 0.006, { color: mixHex(INK, '#333a55', colorK), boil: 0.0012, closed: true });
  inkV(ctx, body, 0.008, { color: mixHex(INK, '#2c3350', colorK), boil: 0.0014, closed: true });
  if (colorK > 0.2) emoji(ctx, ic, w / 2 - 0.09, -h / 2 + 0.085, 0.075, colorK);
  wtext(ctx, title, w / 2 - 0.175, -0.03, 0.05, mixHex(INK, '#151a2b', colorK), { align: 'right', weight: 800 });
  wtext(ctx, sub, w / 2 - 0.175, 0.035, 0.034, mixHex(INK, '#5d6680', colorK), { align: 'right', weight: 500 });
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(-w / 2 + 0.035, -h / 2 + 0.035, 0.016, 0, 7); ctx.globalAlpha *= colorK; ctx.fill();
  ctx.restore();
}

// --------------------------------------------------------------- landscape pieces
function hills(ctx, x0, x1, t, colorK, prog = 1) {
  const r = rng(12);
  const layers = [
    { y: G - 0.32, amp: 0.1, col: '#bfe0a0', line: '#5c8a3a', f: 2.1 },
    { y: G - 0.16, amp: 0.07, col: '#9fd07a', line: '#4b7f2c', f: 3.3 },
    { y: G + 0.02, amp: 0.02, col: '#7cbf55', line: '#3c6e22', f: 5.0 },
  ];
  layers.forEach((L, li) => {
    const pts = []; for (let x = x0; x <= x1; x += 0.02) pts.push([x, L.y - Math.sin(x * L.f + li) * L.amp - noise1(x * 3 + li * 5, li) * L.amp * 0.6]);
    const k = clamp(prog * 1.4 - li * 0.2);
    if (k <= 0) return;
    const poly = pts.concat([[x1, G + 2], [x0, G + 2]]);
    if (colorK > 0) wash(ctx, poly, L.col, { alpha: colorK * k, edge: 0, texture: 0.25, light: 'rgba(255,255,230,0.35)', off: [0, 0], boil: 0.0015 });
    inkV(ctx, trim(pts, k), 0.0055, { color: mixHex(INK, L.line, colorK), boil: 0.0016, seed: li * 7, taper: [0.02, 0.02] });
  });
}
function tree(ctx, x, y, s, colorK, k = 1, sway = 0) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const trunk = spline([[-0.03, 0], [-0.02, -0.25], [0.02, -0.25], [0.035, 0]], true, 4);
  if (colorK) wash(ctx, trunk, '#8a5a3a', { alpha: colorK * k, shade: 'rgba(40,20,10,0.4)', texture: 0.3 });
  inkV(ctx, trunk, 0.008, { color: mixHex(INK, '#4a2c18', colorK), closed: true, boil: 0.002 });
  for (const [cx2, cy2, cr, sd] of [[-0.11, -0.33, 0.13, 1], [0.11, -0.34, 0.13, 2], [0.0, -0.45, 0.16, 3]]) {
    const crown = blob(cx2 + sway * 0.02, cy2, cr, x * 10 + sd, 24, 0.13);
    if (colorK) { wash(ctx, crown, sd === 3 ? '#67b94a' : '#57a43f', { alpha: colorK * k, light: 'rgba(220,255,170,0.6)', shade: 'rgba(20,70,20,0.45)', texture: 0.3 }); cel(ctx, crown, { shadow: 'rgba(30,90,30,0.4)', rim: 'rgba(230,255,190,0.55)', d: 0.045 }); }
    inkV(ctx, trim(crown.concat([crown[0]]), k), 0.007, { color: mixHex(INK, '#2c5f1e', colorK), boil: 0.002, taper: [0.03, 0.03] });
    for (let i = 0; i < 4; i++) { const a = i * 1.7 + sd; const lx = cx2 + Math.cos(a) * cr * 0.5, ly = cy2 + Math.sin(a) * cr * 0.45; inkV(ctx, trim([[lx, ly], [lx + 0.02, ly - 0.015]], k), 0.004, { color: mixHex(INK, '#2c5f1e', colorK), alpha: 0.6, boil: 0.0015 }); }
  }
  ctx.restore();
}
function flower(ctx, x, y, s, col, colorK, k) {
  if (k <= 0) return;
  inkV(ctx, [[x, y], [x + 0.004, y - 0.05 * s]], 0.004, { color: mixHex(INK, '#3c6e22', colorK), boil: 0.0012 });
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; const p = ellipse(x + Math.cos(a) * 0.014 * s, y - 0.055 * s + Math.sin(a) * 0.014 * s, 0.011 * s, 0.011 * s, 8);
    if (colorK) wash(ctx, p, col, { alpha: colorK * k, edge: 0, texture: 0.1, off: [0, 0] }); }
  if (colorK) wash(ctx, ellipse(x, y - 0.055 * s, 0.008 * s, 0.008 * s, 8), '#ffd23f', { alpha: colorK * k, edge: 0, texture: 0, off: [0, 0] });
}
function sun(ctx, x, y, r, t, colorK, k, dim = 0) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= 1 - dim;
  if (colorK) { const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2); g.addColorStop(0, `rgba(255,220,120,${0.55 * colorK * k})`); g.addColorStop(1, 'rgba(255,220,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
    wash(ctx, ellipse(x, y, r, r, 30), '#ffcf3a', { alpha: colorK * k, light: 'rgba(255,255,220,0.9)', shade: 'rgba(240,140,20,0.4)', texture: 0.2 }); }
  inkV(ctx, trim(ellipse(x, y, r, r, 40), k), 0.007, { color: mixHex(INK, '#c4720c', colorK), boil: 0.0018 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 0.15; const kk = clamp(k * 2 - 1 - i / 24); if (kk <= 0) continue;
    inkV(ctx, trim([[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * (1.65 + (i % 2) * 0.25), y + Math.sin(a) * r * (1.65 + (i % 2) * 0.25)]], kk), 0.006, { color: mixHex(INK, '#d8901a', colorK), boil: 0.002 }); }
  ctx.restore();
}
function puff(ctx, x, y, s, colorK, { fill = '#ffffff', line = '#7f95b8', shade = 'rgba(120,140,190,0.35)', k = 1, seed = 1 } = {}) {
  const pts = []; const n = 7;
  for (let i = 0; i <= 40; i++) { const u = i / 40; const a = Math.PI + u * Math.PI; const bump = Math.abs(Math.sin(u * n * Math.PI / 2 + seed)) * 0.25; pts.push([x + Math.cos(a) * s * (1 + bump * 0.2), y + Math.sin(a) * s * 0.55 * (1 + bump)]); }
  pts.push([x + s, y]); const poly = pts.concat([[x - s, y]]);
  if (colorK) { wash(ctx, poly, fill, { alpha: colorK, light: 'rgba(255,255,255,0.9)', shade, texture: 0.15, edge: 0 }); }
  inkV(ctx, trim(pts, k), 0.006, { color: mixHex(INK, line, colorK), boil: 0.002, seed: seed * 5 });
}
function scribbleCloud(ctx, x, y, w, h, k, seed, colorK, dark) {
  if (k <= 0) return;
  const r = rng(seed); const kk = easeOutCubic(k);
  // billows: big lobes on top, smaller ones underneath -> soft cumulus silhouette
  const top = [], bot = [];
  for (let i = 0; i < 6; i++) { const u = (i + 0.5) / 6; top.push([x - w / 2 + u * w + (r() - 0.5) * 0.03, y - Math.sin(u * Math.PI) * h * 0.35, (0.22 + 0.3 * Math.sin(u * Math.PI)) * h * (0.85 + r() * 0.35)]); }
  for (let i = 0; i < 7; i++) { const u = (i + 0.5) / 7; bot.push([x - w / 2 + u * w, y + h * 0.12, h * (0.12 + r() * 0.07)]); }
  const outline = []; const N = 90;
  for (let i = 0; i <= N; i++) { const px = x - w * 0.55 + i / N * w * 1.1; let tp = y + h * 0.05; for (const [lx, ly, lr] of top) if (Math.abs(px - lx) < lr) tp = Math.min(tp, ly - Math.sqrt(lr * lr - (px - lx) ** 2)); outline.push([px, tp]); }
  for (let i = N; i >= 0; i--) { const px = x - w * 0.55 + i / N * w * 1.1; let bt = y + h * 0.05; for (const [lx, ly, lr] of bot) if (Math.abs(px - lx) < lr) bt = Math.max(bt, ly + Math.sqrt(lr * lr - (px - lx) ** 2) * 0.8); outline.push([px, bt]); }
  ctx.save(); ctx.globalAlpha *= clamp(k * 2) * 0.96;
  const base = dark ? '#6a7386' : '#8891a4';
  if (colorK) {
    wash(ctx, outline, base, { alpha: colorK * kk, light: 'rgba(225,232,245,0.7)', shade: 'rgba(28,32,52,0.55)', texture: 0.3, edge: 0, off: [0, 0], boil: 0.0015 });
    cel(ctx, outline, { shadow: 'rgba(30,36,58,0.42)', rim: 'rgba(235,240,252,0.45)', d: h * 0.18 });
  }
  inkV(ctx, trim(outline, kk), 0.0055, { color: mixHex(INK, '#262c40', colorK), boil: 0.002, seed, taper: [0.02, 0.02] });
  // a few interior billow lines
  top.forEach(([lx, ly, lr], i) => { if (i % 2 === 0) inkV(ctx, trim(ellipse(lx, ly + lr * 0.35, lr * 0.75, lr * 0.5, 14, Math.PI * 1.1, Math.PI * 1.75), kk), 0.003, { color: '#262c40', alpha: 0.45, boil: 0.002 }); });
  ctx.restore();
}

// lightning bolt
function bolt(ctx, x, y, len, seed, a) {
  if (a <= 0) return; const r = rng(seed); const pts = [[x, y]]; let cx = x, cy = y;
  for (let i = 0; i < 9; i++) { cx += (r() - 0.5) * 0.12; cy += len / 9; pts.push([cx, cy]); }
  ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(255,240,150,0.9)'; ctx.shadowBlur = 30;
  inkV(ctx, pts, 0.022, { color: '#fff3a0', boil: 0.003, taper: [0.05, 0.5] }); ctx.shadowBlur = 0;
  inkV(ctx, pts, 0.008, { color: '#1b2238', boil: 0.003, taper: [0.05, 0.5] }); ctx.restore();
}

// hand-lettered "YUV.AI" across the sky (outline written, then gold fill)
function lettering(ctx, str, x, y, size, t, kWrite, kFill, { font = '"Fredoka", sans-serif', grad = ['#ffe17a', '#ffb02e', '#ff8a2a'], outline = '#1b2a6b', glow = true, dotOut = null } = {}) {
  ctx.save(); ctx.translate(x, y); const s = size / 100; ctx.scale(s, s);
  ctx.font = `700 100px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
  const m = ctx.measureText(str); const w = m.width;
  if (dotOut) { const i = str.indexOf('.'); const pre = ctx.measureText(str.slice(0, i)).width, dw = ctx.measureText('.').width; dotOut[0] = x + (-w / 2 + pre + dw / 2) * s; dotOut[1] = y + 30 * s; }
  if (kFill > 0) {
    if (glow) { ctx.shadowColor = `rgba(255,190,80,${0.6 * kFill})`; ctx.shadowBlur = 60; }
    const g = ctx.createLinearGradient(0, -50, 0, 50); grad.forEach((c, i) => g.addColorStop(i / (grad.length - 1), c));
    ctx.globalAlpha = kFill; ctx.fillStyle = g; ctx.fillText(str, 0, 2); ctx.shadowBlur = 0;
    // inner highlight
    ctx.globalAlpha = kFill * 0.5; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.save(); ctx.beginPath(); ctx.rect(-w, -60, w * 2, 38); ctx.clip(); ctx.fillText(str, 0, 2); ctx.restore();
    ctx.globalAlpha = 1;
  }
  if (kWrite > 0) {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = outline; ctx.lineWidth = 3.2;
    const L = 2600; ctx.setLineDash([L * kWrite, L]); ctx.lineDashOffset = 0;
    ctx.strokeText(str, 0, 2); ctx.setLineDash([]);
  }
  ctx.restore();
  return w * s;
}

// --------------------------------------------------------------- use-case cards for the "order" board
const USES = [
  ['👩‍🏫', 'מורה', 'מערך שיעור ב-5 דקות', '#ff8a1f'], ['🧑‍💼', 'בעלת עסק', 'מענה חכם ללקוחות 24/7', '#2f80ff'],
  ['⚖️', 'עורך דין', 'סיכום חוזה בשניות', '#7b5cff'], ['👩‍💻', 'מפתחת', 'סוכן שכותב ובודק קוד', '#00b37e'],
  ['🎓', 'סטודנט', 'סיכום הרצאה + כרטיסיות', '#ff4d5e'], ['📊', 'מנהלת', 'דוח שבועי אוטומטי', '#14a3c7'],
  ['🎨', 'קריאייטיב', 'רעיונות לקמפיין', '#e8459a'], ['👨‍👩‍👧', 'הורים', 'תכנון שבוע משפחתי', '#ffb400'],
];
function useCard(ctx, x, y, s, [ic, who, what, col], k) {
  if (k <= 0) return;
  const sc = s * (0.6 + 0.4 * easeOutBack(clamp(k * 1.3), 2.0));
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(k * 2);
  const w = 0.62, h = 0.3, r = 0.05;
  wash(ctx, rrect(-w / 2 + 0.012, -h / 2 + 0.018, w, h, r), 'rgba(30,40,90,0.16)', { edge: 0, texture: 0, off: [0, 0], boil: 0.001 });
  const b = rrect(-w / 2, -h / 2, w, h, r);
  wash(ctx, b, '#fffdf7', { edge: 0, texture: 0.12, light: 'rgba(255,255,255,0.9)', shade: 'rgba(120,130,170,0.15)' });
  const band = rrect(-w / 2, -h / 2, w, 0.085, r);
  ctx.save(); clipPoly(ctx, b); wash(ctx, [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, -h / 2 + 0.085], [-w / 2, -h / 2 + 0.085]], col, { edge: 0, texture: 0.15, light: 'rgba(255,255,255,0.35)', off: [0, 0] }); ctx.restore();
  inkV(ctx, b, 0.008, { color: '#283052', boil: 0.0014, closed: true });
  inkV(ctx, [[-w / 2, -h / 2 + 0.085], [w / 2, -h / 2 + 0.085]], 0.005, { color: '#283052', boil: 0.0012 });
  emoji(ctx, ic, w / 2 - 0.075, 0.035, 0.11);
  wtext(ctx, who, w / 2 - 0.04, -h / 2 + 0.044, 0.056, '#ffffff', { align: 'right', weight: 800 });
  wtext(ctx, what, w / 2 - 0.15, 0.035, 0.048, '#17203a', { align: 'right', weight: 700, maxW: w - 0.27 });
  // tick
  inkV(ctx, [[-w / 2 + 0.035, 0.045], [-w / 2 + 0.052, 0.068], [-w / 2 + 0.088, 0.012]], 0.011, { color: '#16a34a', boil: 0.0012, taper: [0.1, 0.2] });
  ctx.restore();
}

// --------------------------------------------------------------- camera
function cam(ctx, W, H, cx, cy, viewW) {
  const portrait = H > W; const vw = portrait ? viewW * 0.62 : viewW;
  const z = W / vw; ctx.setTransform(z, 0, 0, z, W / 2 - cx * z, H / 2 - cy * z);
  return [cx - W / 2 / z, cy - H / 2 / z, cx + W / 2 / z, cy + H / 2 / z];
}

// --------------------------------------------------------------- MAIN
const PILE = TOASTS.map((tst, i) => { const r = rng(40 + i); return { tst, dx: (r() - 0.5) * 0.12, rot: (r() - 0.5) * 0.7, side: r() }; });
const PILE_T = [20.4, 21.0, 21.6, 22.2, 22.8, 23.3, 23.8, 24.4, 25.0, 25.6, 26.2, 26.8, 27.4, 28.0];

export function render2D(ctx, t, W, H, start) {
  setBoil(t);
  const portrait = H > W;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);

  // ---- global states
  const bloom = smooth(7.7, 9.0, t);                                   // colour arrives
  const storm = smoother(17.0, 20.0, t) * (1 - smoother(37.5, 41.0, t) * 0.85) * (1 - smooth(48.5, 50.4, t));
  const gold = smoother(50.2, 51.2, t);
  const walkX = lerp(GIRL[0], 1.75, smoother(12.4, 16.9, t));
  const NOA = [walkX, G];
  const LANDX = NOA[0] - 0.62;

  // ---- camera path
  let cx, cy, vw;
  const s = start; // {cx, cy, vw} matching the 3D shot at the hand-off
  if (t < 10.5) { const k = smoother(7.7, 10.5, t); cx = lerp(s.cx, NOA[0] + 0.05, k); cy = lerp(s.cy, G - 0.33, k); vw = lerp(s.vw, 1.55, k); }
  else if (t < 17) { const k = smoother(10.5, 12.5, t); cx = lerp(NOA[0] + 0.05, NOA[0] + 0.2, k); cy = lerp(G - 0.33, G - 0.42, k); vw = lerp(1.55, 2.1, k); }
  else if (t < 28.8) { const k = smoother(17, 28.5, t); cx = NOA[0] + lerp(0.2, 0.05, k); cy = G - lerp(0.42, 0.62, k); vw = lerp(2.1, 2.25, k); }
  else if (t < 37.6) { const k = smoother(28.8, 37.2, t); cx = NOA[0] + lerp(0.05, 0.0, k); cy = G - lerp(0.62, 0.3, k); vw = lerp(2.25, 1.15, k); }
  else if (t < 47.4) { const k = smoother(37.6, 41.5, t), k2 = smoother(43, 47.2, t); cx = NOA[0] + lerp(0.0, -0.3, k) + k2 * 0.25; cy = G - lerp(0.3, 0.42, k) - k2 * 0.05; vw = lerp(1.15, 1.9, k) - k2 * 0.15; }
  else if (t < 50.6) { const k = smoother(47.4, 50.6, t), m = macawState(t, NOA, LANDX), b = smooth(47.4, 48.1, t); cx = lerp(NOA[0] - 0.05, m.x + 0.35, b); cy = lerp(G - 0.47, m.y - 0.12, b); vw = lerp(1.75, 2.3, k); }
  else if (t < 55.2) { const k = smoother(50.6, 53.4, t), kz = Math.pow(smooth(53.3, 55.2, t), 2.2); cx = lerp(NOA[0] + 1.6, 4.3, k); cy = lerp(G - 3.0, G - 3.35, k); vw = lerp(2.3, 2.75, k) * (1 - kz * 0.988); const dot = DOT; cx = lerp(cx, dot[0], kz); cy = lerp(cy, dot[1], kz); }
  else if (t < 69.8) { const k = smoother(55.2, 57.0, t), k2 = smoother(64.6, 66.5, t); cx = 8.0; if (portrait) { cx = 8.0 + k2 * 0.13; cy = lerp(lerp(-2.82, -2.63, k), -3.04, k2); vw = lerp(1.2, 3.44, k) * (1 - k2 * 0.64); } else { cy = -2.82 - k2 * 0.28; vw = lerp(1.2, 3.25, k) * (1 - k2 * 0.56); } }
  else { const k = smoother(69.8, 71.5, t); cx = lerp(8.0, 11.0, k); cy = lerp(-3.12, -3.1, k); vw = lerp(1.15, 2.4, k); }
  const view = cam(ctx, W, H, cx, cy, vw);

  // ---- paper (warm in sun, cool in storm, golden above)
  paper(ctx, view, W, H, { lines: 1 - gold * 0.75 - smooth(55, 56, t) * 0.0 });

  // =============================== ground world
  if (t < 50.45) {
    const wc = bloom * (1 - storm * 0.6);
    const build = smooth(10.6, 13.0, t);
    sun(ctx, NOA[0] + 0.75, G - 0.95, 0.09, t, wc, smooth(10.6, 11.6, t), storm);
    hills(ctx, -0.6, 4.2, t, wc, build);
    [[-0.25, 0.7], [0.15, 0.5], [1.15, 0.75], [1.45, 0.55], [2.65, 0.8], [3.1, 0.6]].forEach(([x, sc], i) => tree(ctx, x, G - 0.2 - i % 2 * 0.06, sc, wc, smooth(11.2 + i * 0.25, 12.2 + i * 0.25, t), Math.sin(t * (1 + storm * 4) + i) * (0.2 + storm)));
    const r = rng(3); for (let i = 0; i < 46; i++) { const x = -0.4 + r() * 4.2; flower(ctx, x, G + 0.03 + r() * 0.04, 0.8 + r() * 0.5, ['#ff8fb4', '#ffffff', '#ffd23f', '#b99cff', '#ff9f5a'][i % 5], wc, smooth(11.8 + i * 0.02, 12.4 + i * 0.02, t)); }
    // fair-weather clouds + birds
    if (storm < 0.9) { puff(ctx, NOA[0] - 0.3 + t * 0.01, G - 0.95, 0.13, wc, { k: smooth(11, 12, t), seed: 2 }); puff(ctx, NOA[0] + 0.25 + t * 0.008, G - 1.1, 0.09, wc, { k: smooth(11.3, 12.3, t), seed: 5 }); }
    for (let i = 0; i < 3; i++) { const bx = NOA[0] - 0.4 + i * 0.12 + (t - 11) * 0.05, by = G - 0.8 - i * 0.04 + Math.sin(t * 3 + i) * 0.01; const fl = Math.sin(t * 9 + i) * 0.012;
      if (t > 11.5 && t < 18.5) inkV(ctx, [[bx - 0.025, by - fl], [bx, by + 0.008], [bx + 0.025, by - fl]], 0.005, { color: INK, boil: 0.0015, alpha: 1 - storm }); }
    // storm clouds scribbled in
    for (let i = 0; i < 9; i++) { const k = smooth(17.0 + i * 0.22, 18.6 + i * 0.22, t) * (1 - smooth(48.5, 50.2, t)); if (k > 0) scribbleCloud(ctx, NOA[0] - 1.2 + i * 0.36 + Math.sin(t * 0.3 + i) * 0.03, G - 1.0 - (i % 3) * 0.1, 0.55, 0.22, k, 30 + i, bloom, i % 2); }
    // upper storm layer (the macaw flies through these)
    if (t > 46) for (let i = 0; i < 14; i++) { const k = 1 - smooth(48.8, 50.4, t); scribbleCloud(ctx, NOA[0] - 0.4 + i * 0.32, G - 1.5 - (i % 4) * 0.35, 0.6, 0.3, k, 60 + i, bloom, 1); }
    // grey wash over everything during the storm
    if (storm > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(96,110,140,${0.55 * storm})`; ctx.fillRect(view[0], view[1], view[2] - view[0], view[3] - view[1]); ctx.restore(); }
    // golden hole + beam
    const hole = smoother(37.6, 39.6, t) * (1 - smooth(47, 49, t));
    if (hole > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const hx = LANDX - 0.1, hy = G - 1.05;
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 0.55); g.addColorStop(0, `rgba(255,222,140,${0.9 * hole})`); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(hx - 0.6, hy - 0.6, 1.2, 1.2);
      const beam = [[hx - 0.08, hy], [hx + 0.08, hy], [NOA[0] + 0.55, G + 0.02], [NOA[0] - 0.25, G + 0.02]];
      const bg = ctx.createLinearGradient(hx, hy, hx, G); bg.addColorStop(0, `rgba(255,226,150,${0.75 * hole})`); bg.addColorStop(1, `rgba(255,214,130,${0.2 * hole})`);
      ctx.fillStyle = bg; ctx.beginPath(); beam.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.fill(); ctx.restore();
      for (let i = 0; i < 5; i++) inkV(ctx, [[hx - 0.05 + i * 0.025, hy + 0.05], [NOA[0] - 0.15 + i * 0.13, G - 0.05]], 0.003, { color: '#c98a1a', alpha: 0.35 * hole, boil: 0.002 });
    }
    // lightning
    [22.1, 25.5, 27.7, 31.4, 34.6].forEach((bt, i) => { const a = pulse(bt, bt + 0.03, bt + 0.12, bt + 0.3, t) * storm; if (a > 0) { bolt(ctx, NOA[0] - 0.7 + i * 0.37, G - 1.05, 0.75, 9 + i, a); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(200,215,255,${0.25 * a})`; ctx.fillRect(view[0], view[1], view[2] - view[0], view[3] - view[1]); ctx.restore(); } });
  }

  // =============================== Noa + pile + macaw (ground & flight)
  if (t < 50.45) {
    const colorN = bloom;
    let pose = { smile: 0.6, look: [0, 0] }, pos = [NOA[0], NOA[1]], sc = GS, ride = 0;
    if (t < 10.5) pose = { smile: lerp(0.5, 0.9, smooth(8.6, 9.2, t)), open: pulse(9.2, 9.4, 9.9, 10.2, t) * 0.55, look: [lerp(0, 0.35, pulse(8.2, 8.5, 8.9, 9.2, t)) - lerp(0, 0.35, pulse(8.9, 9.1, 9.4, 9.6, t)), 0], wave: pulse(9.3, 9.6, 10.2, 10.5, t), lid: pulse(7.9, 8.0, 8.15, 8.3, t), blink: t > 8.5 };
    else if (t < 17) pose = { smile: 0.8, walk: smooth(12.3, 12.6, t) * (1 - smooth(16.6, 16.9, t)), phase: walkX * 22, look: [0.35, -0.1] };
    else if (t < 28.8) pose = { smile: lerp(0.6, -0.7, smooth(17.4, 22, t)), worry: smooth(17.4, 19, t), open: pulse(17.6, 17.8, 18.6, 19, t) * 0.7, look: [Math.sin(t * 2.1) * 0.6 * smooth(20, 21, t), lerp(-0.2, -0.9, smooth(17.4, 18, t)) + smooth(20.5, 21.5, t) * 0.6], phone: smooth(19.6, 20.2, t), cry: smooth(26.0, 27.5, t), headDrop: 0 };
    else if (t < 37.6) pose = { smile: -0.9, worry: 1, sit: smoother(28.8, 30.0, t), hug: smoother(29.4, 30.4, t), lid: 0.45, cry: 1, look: [0, 0.6], headTilt: 0.1, blink: false };
    else if (t < 47.4) {
      const up = smooth(38.2, 39.5, t);
      pose = { smile: lerp(-0.7, 0.6, smooth(41, 44, t)), worry: lerp(1, 0, smooth(40, 43, t)), sit: 1 - smoother(44.8, 45.8, t), hug: 1 - smoother(39.6, 41.0, t), lid: lerp(0.45, 0, up), cry: 1 - smooth(39.5, 41.5, t), look: [lerp(0, -0.7, up), lerp(0.6, -0.6, up) + smooth(41.5, 42.5, t) * 0.4], headTilt: lerp(0.1, -0.08, up), open: pulse(44.0, 44.2, 44.6, 44.9, t) * 0.5, blink: t > 40 };
    }
    // boarding: hop onto the macaw's back
    const board = smoother(45.9, 46.9, t);
    const mac = macawState(t, NOA, LANDX);
    if (board > 0 && mac) {
      const seat = [mac.x + 0.02 * mac.s, mac.y - 0.24 * mac.s];
      pos = [lerp(NOA[0], seat[0], board), lerp(NOA[1], seat[1], board) - Math.sin(board * Math.PI) * 0.25];
      sc = lerp(GS, GS * 0.62, board); ride = board;
      pose = Object.assign({}, pose, { ride: board, sit: 0, smile: 0.8, open: t > 48 && t < 50.5 ? 0.5 : pose.open, look: [0.6, -0.2], armL: t > 48.6 ? smooth(48.6, 49.2, t) * 0.9 : 0, armR: t > 48.6 ? smooth(48.6, 49.2, t) * 0.9 : 0, worry: 0, cry: 0, hug: 0 });
    }
    // macaw behind Noa when landed, in front when she rides
    if (mac && ride < 0.5) drawMacaw(ctx, t, mac.x, mac.y, mac.s, mac.pose, { colorK: 1, flip: mac.flip, rot: mac.rot });
    if (t >= 7.6) drawGirl(ctx, t, pos[0], pos[1], sc, pose, { colorK: colorN * (1 - storm * 0.25), lineK: colorN });
    if (mac && ride >= 0.5) drawMacaw(ctx, t, mac.x, mac.y, mac.s, mac.pose, { colorK: 1, flip: mac.flip, rot: mac.rot });
    // the pile of notifications on her head/back
    const head = [pos[0], pos[1] - sc * (0.735 + 0.27) + sc * 0.22 * Math.max(pose.sit || 0, pose.ride || 0)];
    let stackY = head[1];
    PILE.forEach((p, i) => {
      const td = PILE_T[i]; if (t < td - 0.9) return;
      const fall = clamp((t - (td - 0.9)) / 0.9); const e = easeInCubic(fall);
      const after = t - td; const bounce = after > 0 ? Math.exp(-after * 8) * Math.sin(after * 26) * 0.012 : 0;
      const rel = smooth(48.0 + i * 0.07, 49.6 + i * 0.07, t);
      const ty = stackY - 0.04;
      const x0 = pos[0] + (p.side - 0.5) * 1.2, y0 = view[1] - 0.2;
      let x = lerp(x0, pos[0] + p.dx, e), y = lerp(y0, ty, e) - Math.abs(bounce);
      let rot = lerp(p.rot * 4, p.rot, e);
      if (rel > 0) { x += rel * (p.side - 0.5) * 1.4; y += easeInCubic(rel) * 1.6; rot += rel * 3 * (p.side - 0.5); }
      card(ctx, x + (i % 2 ? 1 : -1) * sc * 0.06 * (i / 14), y, sc * 0.95 * (1 - rel * 0.3), rot, p.tst, { colorK: Math.max(0.15, colorN * (1 - storm * 0.3)), alpha: 1 - smooth(0.6, 1, rel) });
      if (after > -0.05 && rel <= 0) stackY -= sc * 0.105;
    });
    // anxiety scribble above her head (grows while overloaded)
    const anx = smooth(23, 27, t) * (1 - smooth(39.5, 41.5, t));
    if (anx > 0) { const rr = rng(77); const pts = []; for (let i = 0; i < 70; i++) { const a = i * 0.9 + t * 3; pts.push([head[0] + 0.28 + Math.cos(a) * 0.06 * (0.6 + rr()) , stackY - 0.02 + Math.sin(a * 1.3) * 0.04 * (0.6 + rr())]); }
      inkV(ctx, trim(pts, anx), 0.004, { color: '#20263a', boil: 0.004, alpha: 0.75 }); }
    // rain
    if (storm > 0.05) { const rr = rng(9); ctx.save(); for (let i = 0; i < 220; i++) { const x = view[0] + rr() * (view[2] - view[0] + 0.4); const sp = 1.8 + rr(); const y = view[1] + ((rr() * 10 + t * sp) % 1) * (view[3] - view[1] + 0.2) - 0.1;
        inkV(ctx, [[x, y], [x - 0.012, y + 0.05]], 0.0028, { color: '#2a3550', alpha: 0.5 * storm * (1 - smooth(38, 41, t) * 0.6), boil: 0.001 }); } ctx.restore(); }
  }

  // =============================== above the clouds: YUV.AI
  if (t >= 50.0 && t < 55.4) {
    const a = smooth(50.0, 50.6, t);
    ctx.save(); ctx.globalAlpha = a;
    // golden sky wash
    const g = ctx.createLinearGradient(0, view[1], 0, view[3]); g.addColorStop(0, '#9fd2f0'); g.addColorStop(0.55, '#ffe6b0'); g.addColorStop(1, '#ffc98a');
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = g; ctx.fillRect(view[0], view[1], view[2] - view[0], view[3] - view[1]); ctx.globalCompositeOperation = 'source-over';
    // sun glow
    const sg = ctx.createRadialGradient(5.2, G - 3.75, 0, 5.2, G - 3.75, 1.1); sg.addColorStop(0, 'rgba(255,250,220,0.95)'); sg.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = sg; ctx.fillRect(view[0], view[1], view[2] - view[0], view[3] - view[1]);
    // sea of clouds (bottom)
    for (let i = 0; i < 18; i++) puff(ctx, 2.0 + i * 0.32, G - 2.62 + (i % 3) * 0.05, 0.22 + (i % 4) * 0.04, 1, { seed: i + 3, line: '#8aa0c8' });
    // YUV.AI written in the sky
    lettering(ctx, 'YUV.AI', 4.3, G - 3.5, portrait ? 0.3 : 0.5, t, smooth(50.7, 52.6, t), smooth(51.9, 52.9, t), { dotOut: DOT });
    ctx.restore();
    // macaw + Noa flying toward the letters
    const k = smoother(50.45, 54.2, t);
    const mx = lerp(NOAX(t) + 1.75, 4.0, k), my = lerp(G - 2.95, G - 3.0, k) + Math.sin(t * 2) * 0.02;
    if (t >= 50.45) drawMacaw(ctx, t, mx, my, lerp(0.55 * 0.62 / 0.62 * 0.55 / 0.55, 0.42, k), { phase: t * 9, flap: 0.8 }, { colorK: 1 });
    if (t >= 50.45) drawGirl(ctx, t, mx + 0.01, my - lerp(0.13, 0.1, k), lerp(0.34, 0.24, k), { ride: 1, smile: 1, open: 0.5, look: [0.6, -0.4], armL: 0.9, armR: 0.9 }, { colorK: 1 });
  }
  // gold flood when diving into the dot
  const dotK = smooth(54.4, 55.2, t) * (1 - smooth(55.2, 56.2, t));

  // =============================== order board
  if (t >= 55.0 && t < 72) {
    const OB = [8.0, -3.0];
    const a = smooth(55.0, 55.5, t) * (1 - smooth(69.8, 70.8, t));
    ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(OB[0], OB[1], 0, OB[0], OB[1], 2.0); g.addColorStop(0, 'rgba(255,240,200,0.8)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(view[0], view[1], view[2] - view[0], view[3] - view[1]);
    // connectors + cards in a calm ring
    const n = USES.length;
    USES.forEach((u, i) => {
      const ang = -Math.PI / 2 + i / n * Math.PI * 2;
      const R = portrait ? [0.62, 0.95] : [1.28, 0.6]; const px = OB[0] + Math.cos(ang) * R[0], py = OB[1] + Math.sin(ang) * R[1];
      const k = smooth(56.2 + i * 0.55, 56.9 + i * 0.55, t);
      if (k > 0) { const dl = trim([[OB[0] + Math.cos(ang) * 0.22, OB[1] + Math.sin(ang) * 0.16], [px, py]], k);
        ctx.save(); ctx.setLineDash([0.012, 0.012]); ctx.strokeStyle = '#3b4a7a'; ctx.lineWidth = 0.004; ctx.globalAlpha *= 0.8; ctx.beginPath(); dl.forEach(([x, y], j) => j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }
      useCard(ctx, px, py, portrait ? 0.76 : 0.82, u, smooth(56.4 + i * 0.55, 57.2 + i * 0.55, t));
    });
    // centre: Noa on the macaw, calm and smiling
    const hover = Math.sin(t * 1.6) * 0.012;
    wash(ctx, ellipse(OB[0], OB[1] + 0.02, 0.24, 0.17, 40), '#fff5d6', { edge: 0, texture: 0.1, glow: 'rgba(255,255,255,0.9)', alpha: 0.9 });
    inkV(ctx, ellipse(OB[0], OB[1] + 0.02, 0.24, 0.17, 50), 0.006, { color: '#c48a1c', closed: true, boil: 0.0015 });
    drawMacaw(ctx, t, OB[0] - 0.02, OB[1] + 0.06 + hover, 0.27, { fold: 1, legs: 0.6, tilt: -0.1 }, { colorK: 1 });
    drawGirl(ctx, t, OB[0] - 0.015, OB[1] + 0.0 + hover, 0.16, { ride: 1, smile: 1, look: [0, 0], open: 0.3 }, { colorK: 1 });
    ctx.restore();
    // calm close-up: thought bubble with a tidy checklist (64.6 -> 69.8)
    const q = smooth(64.8, 65.8, t) * (1 - smooth(69.4, 70.2, t));
    if (q > 0) {
      const bx = OB[0] + 0.14, by = OB[1] - 0.22;
      for (const [dx, dy, r] of [[-0.05, 0.1, 0.012], [-0.02, 0.06, 0.018]]) { wash(ctx, ellipse(bx + dx, by + dy, r, r, 14), '#ffffff', { alpha: q, edge: 0, texture: 0 }); inkV(ctx, ellipse(bx + dx, by + dy, r, r, 14), 0.003, { color: '#283052', closed: true, alpha: q }); }
      const bub = blob(bx + 0.15, by - 0.07, 0.165, 7, 40, 0.1);
      wash(ctx, bub, '#ffffff', { alpha: q, edge: 0, texture: 0.05, glow: 'rgba(255,250,230,0.8)' }); inkV(ctx, bub.concat([bub[0]]), 0.004, { color: '#283052', alpha: q, boil: 0.0012 });
      ['מה חשוב לי', 'מה הכלי הנכון', 'מה הצעד הבא'].forEach((s2, i) => { const ck = smooth(65.6 + i * 0.7, 66.0 + i * 0.7, t) * q; if (ck <= 0) return;
        wtext(ctx, s2, bx + 0.225, by - 0.135 + i * 0.065, 0.031, '#17203a', { align: 'right', alpha: ck, weight: 700 });
        inkV(ctx, trim([[bx + 0.242, by - 0.135 + i * 0.065], [bx + 0.252, by - 0.12 + i * 0.065], [bx + 0.277, by - 0.16 + i * 0.065]], ck), 0.006, { color: '#16a34a', boil: 0.001 }); });
    }
  }

  // =============================== closing: FLY HIGH
  if (t >= 69.8) {
    const a = smooth(69.8, 70.6, t);
    ctx.save(); ctx.globalAlpha = a;
    const CX = 11.0, CY = -3.1;
    const g = ctx.createLinearGradient(0, view[1], 0, view[3]); g.addColorStop(0, '#8ccaf0'); g.addColorStop(0.6, '#ffe2a8'); g.addColorStop(1, '#ffc782');
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = g; ctx.fillRect(view[0], view[1], view[2] - view[0], view[3] - view[1]); ctx.globalCompositeOperation = 'source-over';
    const sg = ctx.createRadialGradient(CX + 0.6, CY - 0.5, 0, CX + 0.6, CY - 0.5, 1.2); sg.addColorStop(0, 'rgba(255,252,225,0.95)'); sg.addColorStop(1, 'rgba(255,235,180,0)'); ctx.fillStyle = sg; ctx.fillRect(view[0], view[1], view[2] - view[0], view[3] - view[1]);
    for (let i = 0; i < 14; i++) puff(ctx, CX - 2.2 + i * 0.34, CY + 0.72 + (i % 3) * 0.05, 0.2 + (i % 4) * 0.04, 1, { seed: i + 9, line: '#8aa0c8' });
    const titleY = portrait ? CY - 0.38 : CY - 0.36;
    lettering(ctx, 'FLY HIGH', CX, titleY, portrait ? 0.25 : 0.4, t, smooth(70.4, 72.0, t), smooth(71.4, 72.4, t));
    lettering(ctx, 'WITH YUV.AI', CX, titleY + (portrait ? 0.2 : 0.3), portrait ? 0.13 : 0.2, t, smooth(72.0, 73.2, t), smooth(72.8, 73.6, t), { grad: ['#5fc6ff', '#2a86e6', '#1557c0'], glow: false });
    ctx.restore();
    // macaw + Noa crossing the sun
    const k = clamp((t - 70.3) / 9.5);
    drawMacaw(ctx, t, lerp(CX - 1.6, CX + 1.8, k), CY - 0.05 - Math.sin(k * Math.PI) * 0.25, 0.3, { phase: t * 8, flap: 0.8 }, { colorK: 1 });
    drawGirl(ctx, t, lerp(CX - 1.6, CX + 1.8, k) + 0.01, CY - 0.05 - Math.sin(k * Math.PI) * 0.25 - 0.075, 0.17, { ride: 1, smile: 1, open: 0.5, look: [0.5, -0.2], armL: 0.9, armR: 0.9 }, { colorK: 1 });
  }

  // ---- screen-space finishing: gold flood, vignette, lamp warmth, fade
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const lamp = 1 - smooth(7.7, 9.4, t);
  if (lamp > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; const lg = ctx.createRadialGradient(W * 0.45, H * 0.4, 0, W * 0.5, H * 0.5, Math.hypot(W, H) * 0.6); lg.addColorStop(0, `rgba(235,215,185,${lamp})`); lg.addColorStop(1, `rgba(120,90,60,${lamp})`); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  if (dotK > 0) { ctx.fillStyle = `rgba(255,214,110,${dotK})`; ctx.fillRect(0, 0, W, H); }
  const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.62);
  v.addColorStop(0, 'rgba(60,30,10,0)'); v.addColorStop(1, `rgba(40,20,8,${0.32 - gold * 0.12})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  const fade = smooth(79.6, 81.0, t); if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
}

// macaw position/pose for the ground section
function NOAX(t) { return lerp(GIRL[0], 1.75, smoother(12.4, 16.9, t)); }
export const DOT = [4.47, G - 3.4];
function macawState(t, NOA, LANDX) {
  if (t < 38.4) return null;
  const s = 0.62;
  if (t < 41.6) { // descend through the light, flapping
    const k = easeOutCubic(clamp((t - 38.4) / 3.2));
    const x = lerp(LANDX - 1.0, LANDX, k), y = lerp(G - 1.35, G - 0.13 * s * 1.0 - 0.115, k);
    return { x, y: y - smooth(0.85, 1, k) * 0.04, s, flip: 1, rot: lerp(0.35, -0.62, smooth(0.7, 1, k)), pose: { phase: t * lerp(7, 13, k), flap: lerp(0.6, 1, k) * (1 - smooth(0.92, 1, k)), legs: smooth(0.6, 0.9, k), glide: 0.4 } };
  }
  if (t < 47.25) { // perched beside her, talks, lowers wing
    const talk = (t > 43.6 && t < 46.2) ? Math.max(0, Math.sin((t - 43.6) * 11)) * 0.8 : 0;
    const lower = pulse(44.6, 45.2, 46.6, 47.2, t);
    return { x: LANDX, y: G - 0.235, s, flip: 1, rot: -0.62, pose: { fold: 1 - lower, legs: 1, beak: talk, tilt: -0.35 + Math.sin(t * 1.3) * 0.04, glide: -0.2, flap: 0 } };
  }
  // take off up and away (now facing right, Noa on board)
  const k = smoother(47.4, 50.6, t), turn = smoother(47.25, 47.75, t);
  const x = lerp(LANDX, NOA[0] + 1.75, k), y = lerp(G - 0.235, G - 2.95, easeInOut(k));
  return { x, y, s: lerp(s, 0.55, k), flip: 1, rot: lerp(-0.62, 0, turn) * (1 - turn) + (-0.35 * Math.sin(k * Math.PI)) * turn, pose: { phase: t * 12, flap: 1, legs: 1 - smooth(47.6, 48.1, t), glide: 0.3 } };
}
