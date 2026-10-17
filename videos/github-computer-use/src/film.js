/* =====================================================================
   GITHUB COPILOT · COMPUTER USE: a 32.9 s one-take motion film (YUV.AI Phoenix Day)
   One seek(t) for both layouts (h 1920x1080, v 1080x1920). Every style is computed
   from t. No timers, no transitions, no state between frames.
   ===================================================================== */
import { clamp, lerp, inv, out2, out3, in2, in3, io3, io2, logLerp, spring, sk, rnd, mix, rgba, C, FT, FONT_FACES, rr, rrc, circle, farR, grad, shadowed, card, neonRing, icon, text, tw } from './core.js';
import { OCT } from './octicons.js';
import { B, bt, DUR, NB, PROMPT, PROMPT_T0, MERCH, MERCH_T0, AMT, AMT_T0, CMD, CMD_T0, charT } from './timeline.js';
import LOGO_URL from '../brand/logo-square-transparent.png'; // private brand asset: copy it from hoodini/yuv-design-system/assets (never committed)

/* ---------------- layouts (screen-space designs, converted to world at each scene's camera) ---------------- */
const LAY = {
  h: {
    name: 'h', W: 1920, H: 1080, pad: 150,
    cam: [[0, 1, 960, 540], [bt(0.5), 1, 960, 540], [bt(11.6), 1.07, 1000, 560], [bt(12), 1.07, 1000, 560], [bt(19.8), 1.1, 1030, 560], [bt(20), 1.1, 1030, 560], [bt(28.6), 1.13, 1050, 565],
      [bt(28.8), 1.13, 1050, 565], 'ALLOW', [bt(31.5), 'HOLD'], [bt(31.5) + 0.001, 1, 960, 540], [bt(35.5), 1.04, 960, 540], [bt(51.8), 1.1, 990, 550], [bt(52), 1.1, 990, 550], [bt(55.8), 1.1, 1020, 550],
      [bt(56), 1.1, 1020, 550], [bt(59.3), 1.16, 1040, 550], [bt(60) + 0.004, 'HOLD'], [bt(60) + 0.005, 1, 960, 540], [DUR, 1.06, 960, 540]],
    disc: [960, 640, 230], pill: [960, 640, 1240, 150], promptF: 54, kick1: [340, 190], hook: [340, 420, 165], cap: [150, 870],
    win: [1300, 560, 1040, 640], winS: 1, head2: [150, 530, 750, 230], chipY: 240, chipX: [1440, 1600, 1760],
    set: [1300, 570, 1060, 690], setS: 1, setBack: [1330, 540, 0.86], head3: [150, 530, 735, 190],
    toast: [1300, 150, 640, 96], appr: [1300, 610, 820, 420], apprS: 1,
    night: { x: 150, ys: [395, 585, 775], size: 185, kick: 215, sub: 875, chips: 955, mark: [1650, 560, 300], lines: [['COPILOT NOW'], ['USES YOUR'], ['DESKTOP APPS.']] },
    win5: [1300, 560, 1040, 640], verb: [150, 450, 170], verbSub: 525, finder: [470, 830, 520, 340], finderS: 1,
    ctl: { head: [150, 470, 670, 180], chips: [[1330, 380], [1330, 545], [1330, 710]], cw: 740, ch: 120 },
    cta: [1300, 545, 960, 160], head7: [150, 520, 740, 210], ctaK: [1300, 700, 760],
    end: [960, 540], endSize: 210, folio: 1050
  },
  v: {
    name: 'v', W: 1080, H: 1920, pad: 70,
    cam: [[0, 1, 540, 960], [bt(0.5), 1, 540, 960], [bt(11.6), 1.06, 560, 990], [bt(12), 1.06, 560, 990], [bt(19.8), 1.09, 560, 1010], [bt(20), 1.09, 560, 1010], [bt(28.6), 1.12, 560, 1020],
      [bt(28.8), 1.12, 560, 1020], 'ALLOW', [bt(31.5), 'HOLD'], [bt(31.5) + 0.001, 1, 540, 960], [bt(35.5), 1.04, 540, 960], [bt(51.8), 1.09, 550, 980], [bt(52), 1.09, 550, 980], [bt(55.8), 1.09, 560, 990],
      [bt(56), 1.09, 560, 990], [bt(59.3), 1.14, 560, 1000], [bt(60) + 0.004, 'HOLD'], [bt(60) + 0.005, 1, 540, 960], [DUR, 1.06, 540, 960]],
    disc: [540, 1080, 240], pill: [540, 1080, 960, 140], promptF: 40, kick1: [60, 500], hook: [60, 900, 190], cap: [600, 520],
    win: [540, 1290, 960, 591], winS: 960 / 1040, head2: [70, 640, 900, 270], chipY: 995, chipX: [700, 840, 980],
    set: [540, 1300, 980, 638], setS: 980 / 1060, setBack: [560, 1250, 0.86], head3: [70, 640, 900, 270],
    toast: [540, 930, 900, 104], appr: [540, 1330, 960, 492], apprS: 960 / 820,
    night: { x: 70, ys: [820, 1040, 1260], size: 230, kick: 610, sub: 1375, chips: 1470, mark: [540, 1700, 250], lines: [['COPILOT NOW'], ['USES YOUR'], ['DESKTOP APPS.']] },
    win5: [540, 1180, 960, 591], verb: [70, 650, 250], verbSub: 735, finder: [540, 1700, 416, 272], finderS: 0.8,
    ctl: { head: [70, 600, 820, 210], chips: [[540, 1120], [540, 1290], [540, 1460]], cw: 920, ch: 128 },
    cta: [540, 1260, 940, 150], head7: [70, 680, 940, 270], ctaK: [540, 1420, 1480],
    end: [540, 960], endSize: 170, folio: 900
  }
};

/* ---------------- camera: one transform, keyed [t, zoom, x, y], eased segments, zoom in log space ---------------- */
function buildCam(L, allowWorld) {
  const K = []; let last = null;
  for (const k of L.cam) {
    if (k === 'ALLOW') { last = [bt(30.8), 1.8, allowWorld[0], allowWorld[1]]; K.push(last); continue; }
    if (k[1] === 'HOLD') { last = [k[0], last[1], last[2], last[3]]; K.push(last); continue; }
    last = k; K.push(k);
  }
  return K;
}
function camAt(K, t) {
  if (t <= K[0][0]) return { z: K[0][1], x: K[0][2], y: K[0][3] };
  for (let i = 0; i < K.length - 1; i++) {
    const a = K[i], b = K[i + 1];
    if (t < b[0]) { const u = io3(inv(a[0], b[0], t)); return { z: logLerp(a[1], b[1], u), x: lerp(a[2], b[2], u), y: lerp(a[3], b[3], u) }; }
  }
  const e = K[K.length - 1]; return { z: e[1], x: e[2], y: e[3] };
}

/* ---------------- state built once per layout, before the first seek ---------------- */
let L, S, CAMK, LOGO = null, CTX = null, SC = 1;
const W = () => L.W, H = () => L.H;
const beatPulse = t => { const k = Math.floor(t / B); return Math.exp(-(t - k * B) * 7); };

function init(lay) {
  L = LAY[lay];
  // provisional camera (without the Allow target) to place the approval card, then the real one
  const allowScreen = () => { const a = L.appr, s = L.apprS; return [a[0] + 255 * s, a[1] + 120 * s]; };
  const camPre = buildCam(L, [L.W / 2, L.H / 2]);
  const toW = (K, tr) => { const c = camAt(K, tr); return { p: (sx, sy) => [(sx - L.W / 2) / c.z + c.x, (sy - L.H / 2) / c.z + c.y], s: v => v / c.z, z: c.z }; };
  const s28 = toW(camPre, bt(28.8)); const aw = s28.p(...allowScreen());
  CAMK = buildCam(L, aw);
  const at = tr => toW(CAMK, tr);
  const r1 = at(bt(1)), r12 = at(bt(12)), r20 = at(bt(20)), r28 = at(bt(28.8)), r32 = at(bt(32)), r36 = at(bt(36)), r52 = at(bt(52)), r56 = at(bt(56)), r60 = at(bt(60));
  const R = (r, a) => { const [x, y] = r.p(a[0], a[1]); return { x, y, w: r.s(a[2]), h: r.s(a[3]) }; };
  S = {};
  S.disc = (() => { const [x, y] = r1.p(L.disc[0], L.disc[1]); return { x, y, d: r1.s(L.disc[2]) }; })();
  S.pill = R(r1, L.pill); S.kick1 = r1.p(...L.kick1); S.k1s = r1.s(1);
  { const r4 = at(bt(4)); const [hx, hy] = r4.p(L.hook[0], L.hook[1]); S.hook = { x: hx, y: hy, size: r4.s(L.hook[2]), maxW: r4.s(L.W - L.hook[0] - L.pad * (L.name === 'h' ? 2.3 : 1)) }; S.cap = r12.p(L.cap[0], L.cap[1]); }
  S.win = R(r12, L.win); S.winS = r12.s(L.winS); S.head2 = { x: r12.p(L.head2[0], 0)[0], y1: r12.p(0, L.head2[1])[1], y2: r12.p(0, L.head2[2])[1], size: r12.s(L.head2[3]) };
  S.chips = L.chipX.map(cx => r12.p(cx, L.chipY)); S.chipS = r12.s(1);
  S.set = R(r20, L.set); S.setS = r20.s(L.setS); S.head3 = { x: r20.p(L.head3[0], 0)[0], y1: r20.p(0, L.head3[1])[1], y2: r20.p(0, L.head3[2])[1], size: r20.s(L.head3[3]) };
  S.toast = R(r20, L.toast); S.appr = R(r28, L.appr); S.apprS = r28.s(L.apprS);
  S.setBack = { x: r28.p(L.setBack[0], 0)[0], y: r28.p(0, L.setBack[1])[1], k: L.setBack[2] };
  const N = L.night; S.night = { x: r32.p(N.x, 0)[0], ys: N.ys.map(y => r32.p(0, y)[1]), size: r32.s(N.size), kick: r32.p(0, N.kick)[1], sub: r32.p(0, N.sub)[1], chips: r32.p(0, N.chips)[1], mark: [...r32.p(N.mark[0], N.mark[1]), r32.s(N.mark[2])], s: r32.s(1) };
  S.win5 = R(r36, L.win5); S.win5S = r36.s(L.winS); S.verb = { x: r36.p(L.verb[0], 0)[0], y: r36.p(0, L.verb[1])[1], size: r36.s(L.verb[2]), sub: r36.p(0, L.verbSub)[1], s: r36.s(1) };
  S.finder = R(r36, L.finder); S.finderS = r36.s(L.finderS);
  S.ctl = { head: { x: r52.p(L.ctl.head[0], 0)[0], y1: r52.p(0, L.ctl.head[1])[1], y2: r52.p(0, L.ctl.head[2])[1], size: r52.s(L.ctl.head[3]) }, chips: L.ctl.chips.map(c => r52.p(c[0], c[1])), cw: r52.s(L.ctl.cw), ch: r52.s(L.ctl.ch), s: r52.s(1) };
  S.cta = R(r56, L.cta); S.head7 = { x: r56.p(L.head7[0], 0)[0], y1: r56.p(0, L.head7[1])[1], y2: r56.p(0, L.head7[2])[1], size: r56.s(L.head7[3]) };
  S.ctaK = [r56.p(L.ctaK[0], L.ctaK[1]), r56.p(L.ctaK[0], L.ctaK[2])]; S.ctaS = r56.s(1);
  S.end = r60.p(...L.end); S.endS = r60.s(1);
  // window-relative helpers
  S.wp = (dx, dy) => [S.win.x + dx * S.winS, S.win.y + dy * S.winS];
  S.w5p = (dx, dy) => [S.win5.x + dx * S.win5S, S.win5.y + dy * S.win5S];
  S.sp = (dx, dy) => [S.set.x + dx * S.setS, S.set.y + dy * S.setS];
  S.ap = (dx, dy) => [S.appr.x + dx * S.apprS, S.appr.y + dy * S.apprS];
  S.fp = (dx, dy) => [S.finder.x + dx * S.finderS, S.finder.y + dy * S.finderS];
}
const cam = t => camAt(CAMK, t);
const toScreen = (t, wx, wy) => { const c = cam(t); return [(wx - c.x) * c.z + L.W / 2, (wy - c.y) * c.z + L.H / 2]; };

/* ---------------- motion helpers ---------------- */
const sp = (t, t0, w = 16, z = 0.8) => spring(t - t0, w, z);
/** the hero shape before the drop: disc -> prompt pill -> Ledger window -> Settings -> recedes */
function heroA(t) {
  const d = S.disc, p = S.pill, w = S.win, s = S.set, b = S.setBack;
  const T = [bt(0), bt(1), bt(12), bt(20), bt(28)];
  const kx = [[-1, d.x], [T[1], p.x], [T[2], w.x], [T[3], s.x], [T[4], b.x]];
  const ky = [[-1, d.y], [T[1], p.y], [T[2], w.y], [T[3], s.y], [T[4], b.y]];
  const kw = [[-1, 0], [T[0], d.d], [T[1], p.w], [T[2], w.w], [T[3], s.w], [T[4], s.w * b.k]];
  const kh = [[-1, 0], [T[0], d.d], [T[1], p.h], [T[2], w.h], [T[3], s.h], [T[4], s.h * b.k]];
  const kr = [[-1, d.d / 2], [T[1], p.h / 2], [T[2], 40 * S.winS], [T[3], 40 * S.setS], [T[4], 40 * S.setS * b.k]];
  return { x: sk(t, kx, 13, 0.82), y: sk(t, ky, 13, 0.82), w: sk(t, kw, 14, 0.8), h: sk(t, kh, 14, 0.8), r: Math.max(0, sk(t, kr, 14, 0.85)) };
}

/* ---------------- type ---------------- */
/** words slam in (tiny overshoot), left anchored, exit by sinking into the mask line */
function slam(x, t, words, X, Y, size, times, tOut, opt = {}) {
  if (t < times[0] - 0.01) return;
  if (tOut != null && t > tOut + 0.45) return;
  x.save(); x.font = FT.en(size); x.direction = 'ltr'; x.textAlign = 'left';
  const gap = size * 0.22; const ws = words.map(s => x.measureText(s).width);
  // mask: everything above the baseline band
  x.beginPath(); x.rect(X - size, Y - size * 1.2, 1e4, size * 1.28); x.clip();
  let pos = X;
  words.forEach((s, i) => {
    const ti = times[i];
    if (t >= ti) {
      const k = spring(t - ti, 24, 0.8);
      const out = tOut == null ? 0 : in3(inv(tOut + i * 0.03, tOut + 0.3 + i * 0.03, t));
      const sc = 1 + 0.22 * (1 - k), dy = (1 - k) * size * 0.22 + out * size * 1.05;
      const cx = pos + ws[i] / 2, cy = Y - size * 0.36;
      x.save(); x.translate(cx, cy + dy); x.scale(sc, sc); x.translate(-cx, -cy);
      if (opt.marker && opt.marker.i === i) {
        const m = clamp(spring(t - opt.marker.t, 18, 0.85), 0, 1.05), mw = (ws[i] + size * 0.24) * m, R = pos + ws[i] + size * 0.12;
        x.fillStyle = grad(x, R - mw, 0, R, 0, C.fire); rr(x, R - mw, Y - size * 0.86, mw, size * 0.98, size * 0.14); x.fill();
      }
      x.fillStyle = opt.fills ? opt.fills[i] : (opt.color || C.navy);
      if (opt.fireText && opt.fireText.includes(i)) x.fillStyle = grad(x, pos, Y - size, pos + ws[i], Y, C.fire);
      x.fillText(s, pos, Y); x.restore();
    }
    pos += ws[i] + gap;
  });
  x.restore();
}
/** text rising out of a mask line (kickers, sublines), leaves through the same line */
function rise(x, t, s, X, Y, font, color, tIn, tOut, opt = {}) {
  if (t < tIn) return; if (tOut != null && t > tOut + 0.4) return;
  const size = opt.size || 40;
  const u = out3(inv(tIn, tIn + 0.36, t)), o = tOut == null ? 0 : in3(inv(tOut, tOut + 0.3, t));
  x.save(); x.beginPath(); x.rect(X - 2000, Y - size * 1.05, 6000, size * 1.32); x.clip();
  text(x, s, X, Y + (1 - u) * size * 1.3 + o * size * 1.3, font, color, opt.align || 'left', opt.spacing || 0);
  x.restore();
}
/** kicker row: a chip ("01 / 07"), a label, and a 6px rule running to the margin */
function kicker(x, t, X, Y, num, label, tIn, tOut, s, night = false, ruleTo = null) {
  if (t < tIn || (tOut != null && t > tOut + 0.4)) return;
  const u = out3(inv(tIn, tIn + 0.4, t)), o = tOut == null ? 0 : in3(inv(tOut, tOut + 0.3, t));
  const fs = 30 * s, ch = 52 * s; x.save();
  x.beginPath(); x.rect(X - 50, Y - ch, 6000, ch * 1.6); x.clip();
  const dy = (1 - u) * ch * 1.4 + o * ch * 1.4;
  const cw = tw(x, num, FT.en(fs), 2 * s) + 40 * s;
  rr(x, X, Y - ch * 0.78 + dy, cw, ch, ch / 2); x.fillStyle = night ? C.gold : C.navy; x.fill();
  text(x, num, X + 20 * s, Y - ch * 0.78 + ch * 0.72 + dy, FT.en(fs), night ? C.navy : C.white, 'left', 2 * s);
  const lx = X + cw + 22 * s; text(x, label, lx, Y - ch * 0.78 + ch * 0.72 + dy, FT.en(fs), night ? C.gold : C.navy, 'left', 4 * s);
  const le = lx + tw(x, label, FT.en(fs), 4 * s) + 26 * s, re = ruleTo ?? (X + 1500 * s);
  const ru = out3(inv(tIn + 0.1, tIn + 0.6, t)) * (1 - o);
  if (re > le) { x.fillStyle = night ? C.gold : C.navy; x.fillRect(le, Y - ch * 0.78 + ch / 2 - 3 * s + dy, (re - le) * ru, 6 * s); }
  x.restore();
}

/* ---------------- background: sky, clouds, folio numerals ---------------- */
function sky(x, t) {
  x.fillStyle = grad(x, 0, 0, 0, L.H, C.sky); x.fillRect(0, 0, L.W, L.H);
  const g = x.createRadialGradient(L.W * 0.86, L.H * 0.04, 0, L.W * 0.86, L.H * 0.04, L.W * 0.62);
  g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, L.W, L.H);
}
function clouds(x, t) { // world space: soft, flat banks of elliptical puffs, drifting slowly
  const base = L.name === 'h' ? [[-260, 1110, 1.5], [760, 1170, 1.7], [1700, 1120, 1.4], [260, 170, 0.6], [1500, 300, 0.5]] : [[-150, 1960, 1.4], [760, 2040, 1.6], [180, 300, 0.6], [900, 470, 0.5]];
  for (let c = 0; c < base.length; c++) {
    const [bx, by, s] = base[c], dx = t * (5 + 2.5 * c);
    for (let i = 0; i < 6; i++) {
      const px = bx + dx + (i - 2.5) * 150 * s + rnd(c * 17 + i) * 70 * s, py = by - Math.sin((i + 0.5) / 6 * Math.PI) * 60 * s + rnd(c * 31 + i) * 26 * s, r = (110 + rnd(c * 7 + i) * 80) * s;
      x.save(); x.translate(px, py); x.scale(1.9, 1);
      const g = x.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, 'rgba(255,255,255,0.62)'); g.addColorStop(0.6, 'rgba(255,255,255,0.26)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(-r, -r, r * 2, r * 2); x.restore();
    }
  }
}
const FOLIO = [[0, '01'], [bt(12), '02'], [bt(20), '03'], [bt(32), '04'], [bt(36), '05'], [bt(52), '06'], [bt(56), '07']];
function folio(x, t, night) {
  const size = L.folio;
  for (let i = 0; i < FOLIO.length; i++) {
    const [t0, s] = FOLIO[i], t1 = i + 1 < FOLIO.length ? FOLIO[i + 1][0] : bt(60);
    if (t < t0 || t > t1 + 0.5) continue;
    const isNight = i === 3;
    if (isNight !== night) continue;
    const up = spring(t - t0, 9, 0.86), dn = in3(inv(t1, t1 + 0.45, t));
    x.save(); x.font = FT.en(size); x.direction = 'ltr'; x.textAlign = 'left';
    let X = -size * 0.06 - (t - t0) * 10; const Y = L.H + size * 0.1 + (1 - up) * size * 0.9 + dn * size;
    if (isNight) { X = L.W - x.measureText(s).width * 0.82 + (t - t0) * 10; x.lineWidth = 5; x.strokeStyle = C.orange; x.strokeText(s, X, Y + size * (L.name === 'h' ? 0.42 : 0.2)); }
    else { x.fillStyle = 'rgba(18,22,63,0.075)'; x.fillText(s, X, Y); }
    x.restore();
  }
}

/* ---------------- objects ---------------- */
function arrowCursor(x, X, Y, s, fill, stroke) {
  if (s <= 0.01) return;
  x.save(); x.translate(X, Y); x.scale(s, s); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 44); x.lineTo(11, 34); x.lineTo(20, 53); x.lineTo(28, 50); x.lineTo(19, 31); x.lineTo(34, 31); x.closePath();
  x.shadowColor = 'rgba(8,12,48,.35)'; x.shadowBlur = 10; x.shadowOffsetY = 4; x.lineJoin = 'round'; x.lineWidth = 3.4; x.strokeStyle = stroke; x.stroke(); x.shadowColor = 'transparent'; x.fillStyle = fill; x.fill(); x.restore();
}
function clickRing(x, X, Y, t, tc, color, R = 60) { const q = inv(tc, tc + 0.42, t); if (q <= 0 || q >= 1) return; circle(x, X, Y, 8 + R * out3(q)); x.lineWidth = 8 * (1 - q); x.strokeStyle = color; x.stroke(); }
const press = (t, tDown, tUp, depth = 0.9) => sk(t, [[-1, 1], [tDown, depth], [tUp, 1]], 34, 0.8);

/** pop text: each glyph pops on its own spring (LTR). returns caret x */
function popType(x, t, s, X, Y, font, size, color, times) {
  const ch = Array.from(s); x.save(); x.font = font; x.direction = 'ltr'; x.textAlign = 'left'; x.fillStyle = color;
  let caret = X, acc = '';
  ch.forEach((c, i) => {
    const pw = x.measureText(acc).width; acc += c; const ww = x.measureText(acc).width, left = X + pw, cw = ww - pw;
    if (t < times[i]) return; caret = X + ww; if (c === ' ') return;
    const k = spring(t - times[i], 30, 0.8), sc = 0.25 + 0.75 * k;
    x.save(); x.translate(left + cw / 2, Y - size * 0.35); x.scale(sc, sc); x.translate(-(left + cw / 2), -(Y - size * 0.35));
    x.fillText(c, left, Y + (1 - k) * size * 0.18); x.restore();
  });
  x.restore(); return caret;
}
function caret(x, t, X, Y, size, tLast, color = C.orange) {
  const on = t < tLast + 0.05 || Math.floor((t - tLast) / (B / 2)) % 2 === 0; if (!on) return;
  x.fillStyle = color; rr(x, X + size * 0.06, Y - size * 0.82, size * 0.08, size * 0.98, size * 0.04); x.fill();
}
function chipPill(x, cx, cy, label, { fs, fill = C.navy, ink = C.white, font = FT.en, padX = 26, h = null, spacing = 2, iconName = null, iconColor = null } = {}) {
  const w = tw(x, label, font(fs), spacing) + padX * 2 + (iconName ? fs * 1.3 : 0), hh = h || fs * 1.9;
  rrc(x, cx, cy, w, hh, hh / 2); x.fillStyle = fill; x.fill();
  let tx = cx - w / 2 + padX;
  if (iconName) { icon(x, OCT, iconName, tx + fs * 0.5, cy, fs * 1.0, iconColor || ink); tx += fs * 1.3; }
  text(x, label, tx, cy + fs * 0.36, font(fs), ink, 'left', spacing); return w;
}

/* --- the prompt pill (scene 1) --- */
function promptContent(x, t, hb) {
  const k = S.pill.h / 150, cy = hb.y;
  // the Copilot mark: big in the disc, then rides to the pill's left end
  const m = sp(t, bt(1), 13, 0.82);
  const mx = lerp(hb.x, hb.x - hb.w / 2 + 78 * k, m), ms = lerp(S.disc.d * 0.56, 66 * k, m);
  const outT = bt(12);
  const exitU = in3(inv(outT - 0.05, outT + 0.25, t));
  if (exitU < 1) icon(x, OCT, 'copilot-96', mx, cy - exitU * 120 * k, ms * (1 - exitU), C.navy);
  if (t < bt(1.3)) return;
  // own mask for the text line
  const ts = charT(PROMPT, PROMPT_T0, B / 4);
  x.save(); rrc(x, hb.x, cy, hb.w - 20, hb.h - 10, hb.h / 2); x.clip();
  const X = hb.x - hb.w / 2 + 140 * k, Y = cy + L.promptF * 0.36 * S.k1s, fs = L.promptF * S.k1s;
  const dyOut = exitU * hb.h;
  if (t < ts[0]) { if (t >= bt(1.5)) text(x, 'Ask Copilot to do anything…', X, Y + (1 - out3(inv(bt(1.5), bt(1.85), t))) * fs, FT.ui(fs), C.ink2); }
  else {
    const cx = popType(x, t, PROMPT, X, Y - dyOut, FT.uiS(fs), fs, C.navy, ts);
    if (t < bt(10)) caret(x, t, cx, Y - dyOut, fs, ts[ts.length - 1]);
  }
  // send button
  const sx = hb.x + hb.w / 2 - 75 * k, sr = 50 * k * press(t, bt(10), bt(10) + 0.12, 0.82) * (1 - exitU) * clamp(sp(t, bt(1.4), 16), 0, 2);
  circle(x, sx, cy, sr); x.fillStyle = t >= ts[ts.length - 1] ? grad(x, sx - sr, cy - sr, sx + sr, cy + sr, C.fire) : C.navy; x.fill();
  if (sr > 2) { x.save(); x.translate(sx, cy); x.scale(sr / 50, sr / 50); x.strokeStyle = t >= ts[ts.length - 1] ? C.navy : C.white; x.lineWidth = 7; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(0, 18); x.lineTo(0, -16); x.moveTo(-14, -3); x.lineTo(0, -17); x.lineTo(14, -3); x.stroke(); x.restore(); }
  x.restore();
  clickRing(x, sx, cy, t, bt(10), C.navy, 70 * k);
}
/* reply chip (b11): grows out of the send button, then shrinks into the window title bar */
function replyChip(x, t) {
  if (t < bt(11) || t > bt(12.6)) return;
  const k = S.pill.h / 150, fs = 30 * S.k1s;
  const s0 = sp(t, bt(11), 18, 0.8), s1 = sp(t, bt(12), 14, 0.85);
  const p0 = [S.pill.x + S.pill.w / 2 - 75 * k, S.pill.y], p1 = [S.pill.x + S.pill.w / 2 - 260 * k, S.pill.y + S.pill.h / 2 + 62 * k], p2 = S.wp(-200, -278);
  const px = lerp(lerp(p0[0], p1[0], s0), p2[0], s1), py = lerp(lerp(p0[1], p1[1], s0), p2[1], s1), sc = clamp(s0, 0, 1.1) * (1 - clamp(s1, 0, 1));
  if (sc <= 0.01) return;
  x.save(); x.translate(px, py); x.scale(sc, sc);
  const label = 'Opening Ledger 98…'; const w = tw(x, label, FT.uiS(fs)) + 100 * S.k1s, h = 64 * S.k1s;
  card(x, 0, 0, w, h, h / 2, { fill: C.navy, depth: 0.5 });
  icon(x, OCT, 'copilot-24', -w / 2 + 38 * S.k1s, 0, 30 * S.k1s, C.gold);
  text(x, label, -w / 2 + 64 * S.k1s, fs * 0.36, FT.uiS(fs), C.white);
  x.restore();
}

/* --- Ledger 98 window (legacy, GUI-only). design space 1040 x 640, origin centre --- */
function ledgerState(t) {
  return {
    merchant: t >= MERCH_T0 ? 1 : 0, amount: t >= AMT_T0 ? 1 : 0,
    cat: t >= bt(43.5) ? 'Travel' : 'Select…', receipt: t >= bt(51),
    rowHi: t >= bt(41) && t < bt(52) ? sp(t, bt(41), 14, 0.85) : 0,
    newPress: press(t, bt(41), bt(41) + 0.12, 0.9), subPress: press(t, bt(52), bt(52) + 0.12, 0.9),
    scan: inv(bt(37), bt(37.9), t), roles: t >= bt(38) && t < bt(41.5), outlines: t >= bt(37) && t < bt(41.5)
  };
}
function ledger(x, t, cx, cy, s, enterT, exitT, opt = {}) {
  const st = ledgerState(t), XD = opt.exitDur ?? 0.25, XS = opt.exitStag ?? 0.03;
  x.save(); x.translate(cx, cy); x.scale(s, s);
  // title bar (navy, shares the card's top corners)
  const tb = 84;
  x.save(); rr(x, -520, -320, 1040, 640, 40); x.clip();
  const bodyU = opt.bodyU ?? 1;
  x.fillStyle = C.cloud; x.fillRect(-520, 320 - 640 * bodyU, 1040, 640 * bodyU);
  x.fillStyle = C.navy; x.fillRect(-520, -320, 1040, tb);
  const eu = out3(inv(enterT, enterT + 0.35, t)), xu = exitT == null ? 0 : in3(inv(exitT, exitT + XD, t));
  // title bar content (own mask = the bar)
  x.save(); x.beginPath(); x.rect(-520, -320, 1040, tb); x.clip();
  const ty = -278 + (1 - eu) * 60 - xu * 60;
  [C.coral, C.orange, C.gold].forEach((c, i) => { circle(x, -480 + i * 30, ty, 9); x.fillStyle = c; x.fill(); });
  text(x, 'Ledger 98', -370, ty + 10, FT.uiB(28), C.white); text(x, 'Expense Report', -220, ty + 10, FT.ui(24), C.denim);
  text(x, 'v4.2 · 2009', 480, ty + 9, FT.ui(22), '#8A93C4', 'right');
  x.restore();
  // body rows: each has its own mask and staggered enter/exit
  const rows = [['Date', '10/14/2026', -176], ['Merchant', '', -104], ['Amount', '', -32], ['Category', st.cat, 40]];
  rows.forEach(([lab, val, y], i) => {
    const e = out3(inv(enterT + 0.06 + i * 0.05, enterT + 0.4 + i * 0.05, t)), o = exitT == null ? 0 : in3(inv(exitT + i * XS, exitT + XD + i * XS, t));
    if (e <= 0 || o >= 1) return;
    x.save(); x.beginPath(); x.rect(-500, y - 34, 1000, 68); x.clip(); x.translate(0, (1 - e) * 70 + o * 70);
    text(x, lab, -470, y + 9, FT.uiS(24), C.ink2);
    if (i === 1 && st.rowHi > 0) { const w = 760 * clamp(st.rowHi, 0, 1); rr(x, 470 + 20 - w, y - 34, w, 68, 34); x.fillStyle = 'rgba(255,199,78,0.45)'; x.fill(); }
    rr(x, -260, y - 28, 730, 56, 28); x.fillStyle = C.white; x.fill(); x.lineWidth = 2; x.strokeStyle = C.line; x.stroke();
    if (opt.focus === i) { rr(x, -264, y - 32, 738, 64, 32); x.lineWidth = 4; x.strokeStyle = C.navy; x.stroke(); }
    if (i === 1 && st.merchant) { const ts = charT(MERCH, MERCH_T0, B / 8); const cxp = popType(x, t, MERCH, -232, y + 9, FT.uiS(26), 26, C.navy, ts); if (t < AMT_T0) caret(x, t, cxp, y + 9, 26, ts[ts.length - 1]); }
    else if (i === 2 && st.amount) { const ts = charT(AMT, AMT_T0, B / 8); const cxp = popType(x, t, AMT, -232, y + 9, FT.uiS(26), 26, C.navy, ts); if (t < bt(48)) caret(x, t, cxp, y + 9, 26, ts[ts.length - 1]); }
    else if (val) text(x, val, -232, y + 9, FT.ui(26), val === 'Select…' ? '#8A93C4' : C.navy);
    if (i === 3) { x.save(); x.translate(430, y); x.strokeStyle = C.navy; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(-9, -4); x.lineTo(0, 5); x.lineTo(9, -4); x.stroke(); x.restore(); }
    x.restore();
  });
  // receipt drop zone
  {
    const y = 118, e = out3(inv(enterT + 0.26, enterT + 0.6, t)), o = exitT == null ? 0 : in3(inv(exitT + 4 * XS, exitT + XD + 4 * XS, t));
    if (e > 0 && o < 1) {
      x.save(); x.beginPath(); x.rect(-500, y - 40, 1000, 80); x.clip(); x.translate(0, (1 - e) * 80 + o * 80);
      text(x, 'Receipt', -470, y + 9, FT.uiS(24), C.ink2);
      rr(x, -260, y - 36, 730, 72, 36); x.fillStyle = st.receipt ? C.white : '#E3ECFA'; x.fill(); x.setLineDash([10, 8]); x.lineWidth = 2.5; x.strokeStyle = st.receipt ? C.line : '#93A6CF'; x.stroke(); x.setLineDash([]);
      const clipS = opt.clipS ?? 1;
      if (st.receipt) { icon(x, OCT, 'file-24', -215, y, 30, C.navy); text(x, 'receipt-oct.pdf', -184, y + 9, FT.uiS(25), C.navy); const ck = clamp(sp(t, bt(51), 18, 0.8), 0, 1.1); circle(x, 420, y, 20 * ck); x.fillStyle = C.navy; x.fill(); icon(x, OCT, 'check-16', 420, y, 22 * ck, C.gold); }
      else { if (clipS > 0.01) icon(x, OCT, 'paperclip-24', -215, y, 30 * clipS, C.navy); text(x, 'Drop a file here', -184, y + 9, FT.ui(24), '#6C76A8'); }
      x.restore();
    }
  }
  // buttons
  {
    const y = 232, e = out3(inv(enterT + 0.32, enterT + 0.66, t)), o = exitT == null ? 0 : in3(inv(exitT + 5 * XS, exitT + XD + 5 * XS, t));
    if (e > 0 && o < 1) {
      x.save(); x.beginPath(); x.rect(-500, y - 44, 1000, 88); x.clip(); x.translate(0, (1 - e) * 90 + o * 90);
      x.save(); x.translate(-330, y); x.scale(st.newPress, st.newPress); rrc(x, 0, 0, 280, 64, 32); x.fillStyle = C.navy; x.fill(); icon(x, OCT, 'plus-24', -98, 0, 26, C.white); text(x, 'New expense', -76, 9, FT.uiS(24), C.white); x.restore();
      x.save(); x.translate(360, y); x.scale(st.subPress, st.subPress); rrc(x, 0, 0, 220, 64, 32); x.fillStyle = grad(x, -110, 0, 110, 0, C.fire); x.fill(); text(x, 'Submit', 0, 9, FT.uiB(25), C.navy, 'center'); x.restore();
      x.restore();
    }
  }
  // READS: scan line + dotted accessibility boxes + role chips
  if (st.outlines) {
    const sy = -236 + st.scan * 556;
    const boxes = [[105, -176, 738, 64], [105, -104, 738, 64], [105, -32, 738, 64], [105, 40, 738, 64], [105, 118, 738, 80], [-330, 232, 292, 76], [360, 232, 232, 76]];
    const gone = in3(inv(bt(41.2), bt(41.5), t));
    boxes.forEach(([bx, by, bw, bh], i) => {
      if (sy < by - bh / 2) return; const k = clamp(spring(t - (bt(37) + (by + 236) / 556 * (bt(37.9) - bt(37))), 22, 0.8), 0, 1.1) * (1 - gone); if (k <= 0.01) return;
      x.save(); x.translate(bx, by); x.scale(k, k); x.setLineDash([7, 6]); x.lineWidth = 2.5; x.strokeStyle = C.orange; rrc(x, 0, 0, bw, bh, bh / 2); x.stroke(); x.restore();
    });
    if (st.scan > 0 && st.scan < 1) { x.fillStyle = grad(x, -520, 0, 520, 0, C.fire); x.fillRect(-520, sy - 3, 1040, 6); }
    if (st.roles) {
      [['textbox', 330, -104, 0], ['combobox', 330, 40, 0.125], ['button', -330, 186, 0.25]].forEach(([r, rx, ry, d]) => {
        const k = clamp(sp(t, bt(38) + d, 20, 0.8), 0, 1.1) * (1 - gone); if (k <= 0.01) return;
        x.save(); x.translate(rx, ry - 44); x.scale(k, k); chipPill(x, 0, 0, r, { fs: 19, font: FT.monoB, fill: C.navy, ink: C.gold, padX: 16, spacing: 0, h: 36 }); x.restore();
      });
    }
  }
  x.restore(); // card clip
  x.restore();
}
/* Category dropdown (b43) */
function dropdown(x, t) {
  if (t < bt(43) || t > bt(44.2)) return;
  const k = clamp(sp(t, bt(43), 18, 0.8), 0, 1.08) * (1 - in3(inv(bt(43.7), bt(44.0), t)));
  if (k <= 0.01) return;
  const [cx, cy] = S.w5p(220, 150), s = S.win5S;
  x.save(); x.translate(cx, cy - 80 * s * (1 - k)); x.scale(s * k, s * k);
  card(x, 0, 0, 420, 196, 36, { fill: C.white, depth: 0.7 });
  ['Meals', 'Travel', 'Software'].forEach((o, i) => {
    const y = -62 + i * 62;
    if (o === 'Travel' && t >= bt(43.5)) { rrc(x, 0, y, 380, 52, 26); x.fillStyle = grad(x, -190, 0, 190, 0, C.fire); x.fill(); }
    text(x, o, -160, y + 9, FT.uiS(25), C.navy);
  });
  x.restore();
}
/* Finder "Receipts" window: grows out of the paperclip (b48), shrinks back into it (b51) */
function finder(x, t) {
  if (t < bt(48) || t > bt(51.8)) return;
  const [px, py] = S.w5p(-215, 118);
  const g = sp(t, bt(48), 13, 0.82), back = sp(t, bt(51), 14, 0.85);
  const u = clamp(g, 0, 1.05) * (1 - clamp(back, 0, 1));
  if (u <= 0.005) return;
  const fx = lerp(px, S.finder.x, u), fy = lerp(py, S.finder.y, u), s = S.finderS;
  const w = lerp(40 * s, S.finder.w, u), h = lerp(40 * s, S.finder.h, u);
  card(x, fx, fy, w, h, lerp(20 * s, 40 * s, u), { fill: C.white, depth: u });
  if (u < 0.3) return;
  const e = out3(inv(bt(48.3), bt(48.6), t)), o = 0, cs = s * w / S.finder.w;
  x.save(); rrc(x, fx, fy, w, h, lerp(20 * s, 40 * s, u)); x.clip(); x.translate(fx, fy); x.scale(cs, s * h / S.finder.h);
  x.fillStyle = C.navy; x.fillRect(-260, -170, 520, 70);
  x.save(); x.translate(0, (1 - e) * 40 + o * 40);
  icon(x, OCT, 'file-directory-fill-24', -220, -135, 30, C.gold); text(x, 'Receipts', -195, -126, FT.uiB(26), C.white);
  const files = ['receipt-oct.pdf', 'hotel.pdf', 'flight.pdf'];
  files.forEach((f, i) => {
    const fxx = -165 + i * 165, fyy = 45;
    if (i === 0 && t >= bt(49) && t < bt(51)) { rrc(x, fxx, fyy, 140, 170, 32); x.setLineDash([8, 7]); x.lineWidth = 2.5; x.strokeStyle = '#93A6CF'; x.stroke(); x.setLineDash([]); return; }
    if (i === 0 && t >= bt(51)) return;
    rrc(x, fxx, fyy, 140, 170, 32); x.fillStyle = C.cloud; x.fill();
    icon(x, OCT, 'file-24', fxx, fyy - 22, 58, C.navy); text(x, f, fxx, fyy + 58, FT.uiS(17), C.navy, 'center');
  });
  x.restore(); x.restore();
}
/* the dragged file tile (b49-b51) follows Copilot's cursor */
function dragTile(x, t, cur) {
  if (t < bt(49) || t > bt(51.1)) return;
  const s = S.finderS, k = 1 - in3(inv(bt(50.9), bt(51.05), t));
  const lift = clamp(sp(t, bt(49), 20, 0.8), 0, 1.1);
  x.save(); x.translate(cur[0] - 20 * s, cur[1] - 30 * s); x.scale(s * (1 + 0.06 * lift) * k, s * (1 + 0.06 * lift) * k); x.rotate(-0.06 * lift);
  card(x, 0, 0, 140, 170, 32, { fill: C.white, depth: 0.6 * lift });
  icon(x, OCT, 'file-24', 0, -22, 58, C.navy); text(x, 'receipt-oct.pdf', 0, 58, FT.uiS(17), C.navy, 'center');
  x.restore();
}

/* --- Copilot app Settings (design 1060 x 690) --- */
function settings(x, t, cx, cy, s, enterT, k) {
  x.save(); x.translate(cx, cy); x.scale(s * k, s * k);
  x.save(); rr(x, -530, -345, 1060, 690, 40); x.clip();
  x.fillStyle = C.cloud; x.fillRect(-530, -345, 1060, 690);
  x.fillStyle = C.navy; x.fillRect(-530, -345, 1060, 84);
  const e = i => out3(inv(enterT + i * 0.05, enterT + 0.35 + i * 0.05, t));
  // title bar
  x.save(); x.beginPath(); x.rect(-530, -345, 1060, 84); x.clip(); x.translate(0, (1 - e(0)) * 60);
  icon(x, OCT, 'gear-24', -486, -303, 32, C.white); text(x, 'Settings', -456, -293, FT.uiB(28), C.white);
  icon(x, OCT, 'copilot-24', 480, -303, 32, C.gold); text(x, 'GitHub Copilot', 452, -293, FT.uiS(22), C.denim, 'right');
  x.restore();
  // sidebar
  x.fillStyle = '#DCE7F8'; x.fillRect(-530, -261, 300, 606);
  const items = [['General', 'gear-24'], ['Sessions', 'terminal-24'], ['Computer Use', 'device-desktop-24'], ['Customizations', 'sliders-24']];
  const iy = i => -200 + i * 66;
  // indicator: two springs, one per edge, leading edge (bottom, moving down) is stiffer -> it stretches
  const top = sk(t, [[-1, iy(0) - 27], [bt(21), iy(2) - 27]], 13, 0.85), bot = sk(t, [[-1, iy(0) + 27], [bt(21), iy(2) + 27]], 24, 0.8);
  if (e(1) > 0) { rr(x, -516, top, 272, bot - top, 27); x.fillStyle = C.white; x.fill(); }
  items.forEach(([lab, ic], i) => {
    x.save(); x.beginPath(); x.rect(-530, iy(i) - 30, 300, 60); x.clip(); x.translate(0, (1 - e(1 + i * 0.5)) * 60);
    icon(x, OCT, ic, -486, iy(i), 26, C.navy); text(x, lab, -458, iy(i) + 9, (i === 2 ? FT.uiB : FT.uiS)(23), C.navy); x.restore();
  });
  // main pane
  x.save(); x.beginPath(); x.rect(-215, -240, 720, 90); x.clip(); x.translate(0, (1 - e(2)) * 90);
  text(x, 'COMPUTER USE', -180, -168, FT.en(48), C.navy, 'left', 1);
  const hw = tw(x, 'COMPUTER USE', FT.en(48), 1);
  rr(x, -180 + hw + 22, -206, 196, 40, 20); x.lineWidth = 3; x.strokeStyle = C.orange; x.stroke(); text(x, 'PUBLIC PREVIEW', -180 + hw + 120, -177, FT.en(20), C.coral, 'center', 2);
  x.restore();
  x.save(); x.beginPath(); x.rect(-215, -146, 720, 46); x.clip(); x.translate(0, (1 - e(3)) * 46);
  text(x, 'Let Copilot work with desktop apps for you.', -180, -114, FT.ui(24), C.ink2); x.restore();
  // enable row + toggle
  const on = t >= bt(24);
  x.save(); x.beginPath(); x.rect(-215, -100, 720, 124); x.clip(); x.translate(0, (1 - e(4)) * 124);
  rrc(x, 145, -38, 660, 100, 36); x.fillStyle = C.white; x.fill();
  text(x, 'Enable Computer Use', -150, -29, FT.uiB(27), C.navy);
  x.restore();
  x.restore(); // card clip
  // toggle (outside the clip so its neon edge can glow)
  if (e(4) > 0.98) {
    const tx = 400, ty = -38, tw2 = 112, th = 62;
    const neonP = t >= bt(23) && t < bt(24.8) ? clamp(sp(t, bt(23), 16, 0.85), 0, 1) * (1 - inv(bt(24.4), bt(24.8), t)) * (0.85 + 0.6 * beatPulse(t)) : 0;
    if (neonP > 0.01) neonRing(x, tx, ty, tw2 + 16, th + 16, (th + 16) / 2, t * 1.6, { lw: 3.5, glow: 16, power: neonP });
    const fillU = clamp(sp(t, bt(24), 16, 0.85), 0, 1);
    rrc(x, tx, ty, tw2, th, th / 2); x.fillStyle = C.line; x.fill();
    if (fillU > 0) { x.save(); rrc(x, tx, ty, tw2, th, th / 2); x.clip(); x.fillStyle = grad(x, tx - tw2 / 2, 0, tx + tw2 / 2, 0, C.fire); x.fillRect(tx - tw2 / 2, ty - th / 2, tw2 * fillU, th); x.restore(); }
    // knob: two springs, one per edge; the leading (right) edge is stiffer, so the knob stretches
    const L0 = tx - tw2 / 2 + 5, R0 = L0 + 52, L1 = tx + tw2 / 2 - 5 - 52, R1 = tx + tw2 / 2 - 5;
    const kl = sk(t, [[-1, L0], [bt(24), L1]], 13, 0.85), kr = sk(t, [[-1, R0], [bt(24), R1]], 26, 0.8);
    shadowed(x, () => rr(x, kl, ty - 26, kr - kl, 52, 26), C.white, 0.18);
  }
  // macOS permissions rows
  const rowsP = [['Accessibility', bt(25)], ['Screen Recording', bt(26)]];
  x.save(); rr(x, -530, -345, 1060, 690, 40); x.clip();
  { const u = out3(inv(bt(24.6), bt(25), t)); if (u > 0) { x.save(); x.beginPath(); x.rect(-215, 30, 720, 40); x.clip(); text(x, 'MACOS PERMISSIONS', -180, 62 + (1 - u) * 40, FT.en(22), C.ink2, 'left', 3); x.restore(); } }
  rowsP.forEach(([lab, t0], i) => {
    const k2 = clamp(sp(t, t0, 18, 0.8), 0, 1.1); if (k2 <= 0.01) return;
    const y = 112 + i * 84;
    x.save(); x.translate(145, y); x.scale(k2, k2);
    rrc(x, 0, 0, 660, 70, 35); x.fillStyle = C.white; x.fill();
    icon(x, OCT, i === 0 ? 'eye-24' : 'device-desktop-24', -290, 0, 26, C.navy); text(x, lab, -262, 9, FT.uiS(24), C.navy);
    rrc(x, 228, 0, 168, 44, 22); x.fillStyle = C.navy; x.fill(); icon(x, OCT, 'check-16', 168, 0, 20, C.gold); text(x, 'Granted', 186, 8, FT.uiB(20), C.white);
    x.restore();
  });
  x.restore();
  x.restore();
}
/* toast (b27) grows into the approval card (b28) */
function approval(x, t, curOverAllow) {
  if (t < bt(27) || t > bt(31.6)) return;
  const T = S.toast, A = S.appr, s = S.apprS;
  const [tgx, tgy] = S.sp(400, -38); // the toggle (in world)
  const a = clamp(sp(t, bt(27), 18, 0.8), 0, 1.1), b = sp(t, bt(28), 13, 0.82);
  const cx = lerp(lerp(tgx, T.x, clamp(a, 0, 1)), A.x, b), cy = lerp(lerp(tgy, T.y, clamp(a, 0, 1)), A.y, b);
  const w = lerp(lerp(112 * S.setS, T.w, a), A.w, b), h = lerp(lerp(62 * S.setS, T.h, a), A.h, b), r = lerp(h / 2, 40 * s, clamp(b, 0, 1));
  card(x, cx, cy, w, h, r, { fill: C.white, depth: 1 });
  // toast content: own mask + timing
  const tIn = out3(inv(bt(27.1), bt(27.4), t)), tOut = in3(inv(bt(28), bt(28.2), t));
  if (tIn > 0 && tOut < 1) {
    const k = T.h / 96;
    x.save(); rrc(x, cx, cy, w, h, r); x.clip(); x.translate(0, (1 - tIn) * 50 * k - tOut * 50 * k);
    icon(x, OCT, 'copilot-24', cx - w / 2 + 52 * k, cy, 38 * k, C.navy);
    text(x, 'Copilot wants to use Ledger 98', cx - w / 2 + 92 * k, cy + 10 * k, FT.uiB(28 * k), C.navy);
    x.restore();
  }
  // card content
  const e = i => out3(inv(bt(28.2) + i * 0.05, bt(28.55) + i * 0.05, t));
  if (e(0) <= 0) return;
  x.save(); rrc(x, cx, cy, w, h, r); x.clip(); x.translate(cx, cy); x.scale(s, s);
  x.save(); x.translate(0, (1 - e(0)) * 60);
  circle(x, -330, -118, 48); x.fillStyle = C.navy; x.fill(); icon(x, OCT, 'copilot-24', -330, -118, 56, C.gold);
  text(x, 'Allow Copilot to use Ledger 98?', -262, -126, FT.uiX(32), C.navy);
  text(x, 'It will read the screen, click and type in this app.', -262, -86, FT.ui(22), C.ink2);
  x.restore();
  x.save(); x.translate(0, (1 - e(1)) * 60); x.fillStyle = C.line; x.fillRect(-370, -20, 740, 2);
  text(x, 'You can stop it any time with Esc.', -370, 34, FT.ui(21), C.ink2);
  x.restore();
  x.restore();
  // buttons (outside clip so Allow's neon can breathe)
  if (e(2) > 0) {
    x.save(); x.translate(cx, cy); x.scale(s, s); x.translate(0, (1 - e(2)) * 40);
    const by = 120;
    rrc(x, -262, by, 220, 72, 36); x.lineWidth = 3; x.strokeStyle = C.navy; x.stroke(); text(x, 'Decline', -262, by + 9, FT.uiS(25), C.navy, 'center');
    rrc(x, -12, by, 250, 72, 36); x.fillStyle = C.denim; x.fill(); text(x, 'Always allow', -12, by + 9, FT.uiS(25), C.navy, 'center');
    const pk = press(t, bt(30.5), bt(30.75), 0.88);
    const np = t >= bt(29.9) ? clamp(sp(t, bt(29.9), 16, 0.85), 0, 1) * (0.9 + 0.7 * beatPulse(t)) : 0;
    x.save(); x.translate(255, by); x.scale(pk, pk);
    if (np > 0.01) neonRing(x, 0, 0, 236, 88, 44, t * 1.6, { lw: 4, glow: 18, power: np });
    rrc(x, 0, 0, 220, 72, 36); x.fillStyle = grad(x, -110, 0, 110, 0, C.fire); x.fill(); text(x, 'Allow', 0, 10, FT.uiX(27), C.navy, 'center');
    x.restore();
    x.restore();
  }
}

/* --- Copilot's own cursor: navy arrow + fire badge with the official mark --- */
function copilotCursor(x, X, Y, s, badgeU = 1) {
  arrowCursor(x, X, Y, s * 1.15, C.navy, C.white);
  if (badgeU <= 0.01) return;
  x.save(); x.translate(X + 36 * s, Y + 62 * s); x.scale(s * badgeU, s * badgeU);
  shadowed(x, () => rr(x, 0, -21, 148, 42, 21), grad(x, 0, 0, 148, 0, C.fire), 0.35);
  icon(x, OCT, 'copilot-24', 26, 0, 26, C.navy); text(x, 'Copilot', 46, 8, FT.uiB(21), C.navy);
  x.restore();
}
function cursorPathCopilot(t) {
  const P = (dx, dy) => S.w5p(dx, dy);
  const K = [[bt(35.9), P(170, -120)], [bt(39.5), P(-330, 238)], [bt(42.4), P(300, 46)], [bt(43.3), P(120, 152)], [bt(43.9), P(330, -98)], [bt(46.2), P(330, -26)], [bt(48.5), S.fp(-165, 45)], [bt(49.25), P(60, 124)], [bt(51.4), P(360, 238)]];
  const kx = [[-1, K[0][1][0]], ...K.slice(1).map(k => [k[0], k[1][0]])], ky = [[-1, K[0][1][1]], ...K.slice(1).map(k => [k[0], k[1][1]])];
  return [sk(t, kx, 10, 0.88), sk(t, ky, 10, 0.88)];
}
function cursorPathUser(t) {
  const P = (dx, dy) => S.wp(dx, dy), Q = (dx, dy) => S.sp(dx, dy);
  const [ax, ay] = S.ap(255, 128);
  const start = toWorldScreenEdge(t);
  const K = [[bt(17.4), P(300, 46)], [bt(18.5), P(80, 124)], [bt(22.2), Q(408, -30)], [bt(28.6), [ax, ay]]];
  const kx = [[-1, start[0]], ...K.map(k => [k[0], k[1][0]])], ky = [[-1, start[1]], ...K.map(k => [k[0], k[1][1]])];
  return [sk(t, kx, 10, 0.88), sk(t, ky, 10, 0.88)];
}
function toWorldScreenEdge() { const c = camAt(CAMK, bt(17.4)); return [(L.W * 1.05 - L.W / 2) / c.z + c.x, (L.H * 1.05 - L.H / 2) / c.z + c.y]; }

/* --- control chips + CTA --- */
function ctlChip(x, cx, cy, w, h, label, ic, s) {
  card(x, cx, cy, w, h, h / 2, { fill: C.white, depth: 0.8 });
  circle(x, cx - w / 2 + h / 2, cy, h * 0.36); x.fillStyle = C.navy; x.fill(); icon(x, OCT, ic, cx - w / 2 + h / 2, cy, h * 0.36, C.gold);
  const fs = h * 0.38; x.save(); x.font = FT.en(fs); const maxW = w - h - 50 * s; let f = fs; const ww = tw(x, label, FT.en(fs), 2 * s); if (ww > maxW) f = fs * maxW / ww; x.restore();
  text(x, label, cx - w / 2 + h + 18 * s, cy + f * 0.36, FT.en(f), C.navy, 'left', 2 * s);
}

/* ---------------- the frame ---------------- */
function draw(x, t, tf) {
  const night = (t >= bt(30.8) && t < bt(36.4)) || t >= bt(59.3);
  // 0. sky (screen)
  sky(x, t);
  folio(x, t, false);
  // 1. world under the camera
  const c = cam(t), k = x.canvas.width / L.W;
  x.save(); x.setTransform(k * c.z, 0, 0, k * c.z, k * (L.W / 2 - c.z * c.x), k * (L.H / 2 - c.z * c.y));
  clouds(x, t);
  if (t < bt(31.6)) worldA(x, t, tf);
  if (t >= bt(35.4) && t < bt(60.1)) worldB(x, t, tf);
  x.restore();
  // 2. floods + night pages (screen space)
  nightLayer(x, t, tf, k);
}

function worldA(x, t, tf) {
  const hb = heroA(t);
  const inSet = t >= bt(20);
  // headline column
  kicker(x, t, S.kick1[0], S.kick1[1] - S.pill.h * 0.0 - 20 * S.k1s, '01 / 07', 'GITHUB COPILOT APP · NEW', bt(0.25), bt(11.8), S.k1s, false, S.pill.x + S.pill.w / 2);
  { const hk = S.hook; x.save(); x.font = FT.en(hk.size); const w1 = x.measureText('YOUR AGENT').width, w2 = x.measureText('GOT HANDS.').width; x.restore();
    const lw = hk.maxW, sz = Math.min(hk.size, hk.size * lw / Math.max(w1, w2));
    if (L.name === 'h') { slam(x, t, ['YOUR', 'AGENT', 'GOT', 'HANDS.'], hk.x, hk.y, sz * 0.92, [bt(4), bt(4.5), bt(6), bt(6.5)], bt(11.6), { marker: { i: 3, t: bt(6.5) + 0.08 } }); }
    else { slam(x, t, ['YOUR', 'AGENT'], hk.x, hk.y - sz * 1.0, sz, [bt(4), bt(4.5)], bt(11.6)); slam(x, t, ['GOT', 'HANDS.'], hk.x, hk.y, sz, [bt(6), bt(6.5)], bt(11.6), { marker: { i: 1, t: bt(6.5) + 0.08 } }); } }
  slam(x, t, ['GUI'], S.head2.x, S.head2.y1, S.head2.size, [bt(16)], bt(20));
  slam(x, t, ['ONLY.'], S.head2.x, S.head2.y2, S.head2.size, [bt(17)], bt(20), { marker: { i: 0, t: bt(17) + 0.08 } });

  // hero shape
  if (hb.w > 1) {
    const isPrompt = t < bt(12) + 0.2;
    // neon edge on the prompt pill: the key input
    if (t < bt(12)) { const np = clamp(sp(t, bt(1), 10, 0.85), 0, 1) * (1 - inv(bt(11.8), bt(12.05), t)) * (0.85 + 0.6 * beatPulse(t)); if (np > 0.01) neonRing(x, hb.x, hb.y, hb.w + 18, hb.h + 18, (hb.h + 18) / 2, t * 1.5, { lw: 4, glow: 20, power: np }); }
    card(x, hb.x, hb.y, hb.w, hb.h, hb.r, { fill: inSet ? C.cloud : (t < bt(12.2) ? C.white : C.cloud), depth: 1 });
    if (isPrompt) { x.save(); rrc(x, hb.x, hb.y, hb.w, hb.h, hb.r); x.clip(); promptContent(x, t, hb); x.restore(); }
    if (t >= bt(12) && t < bt(20.5)) {
      x.save(); rrc(x, hb.x, hb.y, hb.w, hb.h, hb.r); x.clip();
      const s = hb.w / 1040; ledger(x, t, hb.x, hb.y, s, bt(12) + 0.18, bt(20), { focus: t >= bt(18) && t < bt(18.7) ? 3 : (t >= bt(19) && t < bt(20) ? -1 : null) });
      x.restore();
    }
    if (inSet) { const s = hb.w / 1060; settings(x, t, hb.x, hb.y, s, bt(20) + 0.2, 1); }
  }
  replyChip(x, t);
  { // hard-cut captions (their own layer, on frame time so no subframe blends across the cut)
    const cap = tf >= bt(18) && tf < bt(19) ? 'CLICK.' : (tf >= bt(19) && tf < bt(20) ? 'CLICK. CLICK.' : null);
    if (cap) { const s = S.chipS * (L.name === 'h' ? 1 : 1.15), fs = 54 * s, [X, Y] = S.cap; x.save(); x.font = FT.en(fs); const w = x.measureText(cap).width + 56 * s; rr(x, X, Y - 46 * s, w, 92 * s, 46 * s); x.fillStyle = C.navy; x.fill(); text(x, cap, X + 28 * s, Y + 20 * s, FT.en(fs), C.gold, 'left', 1); x.restore(); }
  }
  // API / CLI / MCP: the wall
  ['API', 'CLI', 'MCP'].forEach((lab, i) => {
    const t0 = bt(13 + i); if (t < t0 || t > bt(20.4)) return;
    const kk = clamp(sp(t, t0, 22, 0.8), 0, 1.1) * (1 - in3(inv(bt(20) + i * 0.04, bt(20.25) + i * 0.04, t)));
    if (kk <= 0.01) return;
    const [cx, cy] = S.chips[i], s = S.chipS;
    x.save(); x.translate(cx, cy); x.scale(kk * s, kk * s); x.rotate((i - 1) * 0.04);
    card(x, 0, 0, 150, 76, 38, { fill: C.navy, depth: 0.6 });
    text(x, lab, 0, 15, FT.en(42), C.white, 'center', 2);
    const st = clamp(sp(t, t0 + 0.12, 18, 0.85), 0, 1); // strike sweeps right-to-left
    if (st > 0) { x.fillStyle = grad(x, -60, 0, 60, 0, C.fire); rr(x, 64 - 128 * st, -5, 128 * st, 10, 5); x.fill(); }
    x.restore();
  });
  // headline 3
  slam(x, t, ['ONE'], S.head3.x, S.head3.y1, S.head3.size, [bt(21)], bt(28.4));
  slam(x, t, ['SWITCH.'], S.head3.x, S.head3.y2, S.head3.size, [bt(22)], bt(28.4), { marker: { i: 0, t: bt(22) + 0.08 } });
  // approval card
  approval(x, t);
  // the user's cursor (scene 2-3)
  if (t >= bt(17.4) && t < bt(31.2)) {
    const [ux, uy] = cursorPathUser(t);
    const s = (L.name === 'h' ? 1.25 : 1.35) * S.chipS;
    clickRing(x, ux, uy, t, bt(18), C.navy, 46 * s); clickRing(x, ux, uy, t, bt(19), C.navy, 46 * s); clickRing(x, ux, uy, t, bt(24), C.navy, 46 * s); clickRing(x, ux, uy, t, bt(30.5), C.navy, 46 * s);
    const ps = press(t, bt(18), bt(18) + 0.1, 0.85) * press(t, bt(19), bt(19) + 0.1, 0.85) * press(t, bt(24), bt(24) + 0.1, 0.85) * press(t, bt(30.5), bt(30.75), 0.85);
    arrowCursor(x, ux, uy, s * ps, C.white, C.navy);
  }
}

function worldB(x, t, tf) {
  const W5 = S.win5, s = S.win5S;
  // hero B: window -> "Submitted" pill -> chip 1 -> CTA pill
  const [c1x, c1y] = S.ctl.chips[0];
  const T52 = bt(52.2), T53 = bt(53), T56 = bt(56);
  const subW = S.ctl.cw * 0.86, subH = S.ctl.ch;
  const hx = sk(t, [[-1, W5.x], [T52, W5.x], [T53, c1x], [T56, S.cta.x]], 13, 0.82), hy = sk(t, [[-1, W5.y], [T52, W5.y], [T53, c1y], [T56, S.cta.y]], 13, 0.82);
  const hw = sk(t, [[-1, W5.w], [T52, subW], [T53, S.ctl.cw], [T56, S.cta.w]], 14, 0.8), hh = sk(t, [[-1, W5.h], [T52, subH], [T53, S.ctl.ch], [T56, S.cta.h]], 14, 0.8);
  const hr = Math.max(0, sk(t, [[-1, 40 * s], [T52, subH / 2], [T53, S.ctl.ch / 2], [T56, S.cta.h / 2]], 14, 0.85));
  const showWin = t >= bt(36.0);
  // verbs (left column), each swaps behind its own mask
  const V = [['READS.', 'the screen and every control', bt(36), bt(40)], ['CLICKS.', 'buttons, menus and fields', bt(40), bt(44)], ['TYPES.', 'text, keys and shortcuts', bt(44), bt(48)], ['DRAGS.', 'files across apps', bt(48), bt(52)]];
  V.forEach(([v, sub, a, b]) => {
    slam(x, t, [v], S.verb.x, S.verb.y, S.verb.size, [a], b - 0.36, { marker: { i: 0, t: a + 0.08 } });
    const vfs = (L.name === 'h' ? 34 : 40) * S.verb.s; rise(x, t, sub, S.verb.x + 4 * S.verb.s, S.verb.sub, FT.uiS(vfs), C.navy, a + 0.12, b - 0.4, { size: vfs * 1.2 });
  });
  // the hero
  if (showWin && t < bt(60.1)) {
    const tWinOut = bt(52.05);
    if (t < bt(36.25)) { // the night page is shrinking into this rect: draw nothing here, the night layer owns it
    } else {
      // CTA neon edge (key input) once the chips have merged
      if (t >= T56) { const np = clamp(sp(t, T56 + 0.15, 10, 0.85), 0, 1) * (0.85 + 0.6 * beatPulse(t)); neonRing(x, hx, hy, hw + 18 * S.ctaS, hh + 18 * S.ctaS, (hh + 18 * S.ctaS) / 2, t * 1.5, { lw: 4, glow: 20, power: np }); }
      const pressK = t >= bt(59.25) ? press(t, bt(59.25), bt(59.25) + 0.12, 0.9) : 1;
      x.save(); x.translate(hx, hy); x.scale(pressK, pressK); x.translate(-hx, -hy);
      card(x, hx, hy, hw, hh, hr, { fill: t < T53 + 0.1 ? C.navy : C.white, depth: out2(inv(bt(36.25), bt(36.6), t)) });
      if (t < bt(52.6)) { x.save(); rrc(x, hx, hy, hw, hh, hr); x.clip(); ledger(x, t, W5.x, W5.y, s, bt(36.3), tWinOut, { exitDur: 0.16, exitStag: 0.006, bodyU: out3(inv(bt(36.25), bt(36.6), t)) * (1 - in3(inv(bt(52.05), bt(52.35), t))), focus: t >= bt(44) && t < MERCH_T0 + 1.25 ? 1 : (t >= AMT_T0 && t < bt(48) ? 2 : null), clipS: 1 - clamp(sp(t, bt(48), 16, 0.85), 0, 1) + clamp(sp(t, bt(51), 16, 0.85), 0, 1) }); x.restore(); }
      // submitted pill content
      if (t >= bt(52.3) && t < T53 + 0.25) {
        const e = out3(inv(bt(52.35), bt(52.7), t)), o = in3(inv(T53, T53 + 0.22, t));
        x.save(); rrc(x, hx, hy, hw, hh, hr); x.clip(); x.translate(0, (1 - e) * hh - o * hh);
        const ss = S.ctl.s; circle(x, hx - hw / 2 + hh / 2, hy, hh * 0.34); x.fillStyle = C.gold; x.fill(); icon(x, OCT, 'check-16', hx - hw / 2 + hh / 2, hy, hh * 0.36, C.navy);
        text(x, 'SUBMITTED', hx - hw / 2 + hh + 14 * ss, hy + hh * 0.14, FT.en(hh * 0.36), C.white, 'left', 2 * ss);
        x.restore();
      }
      // chip 1 content (inside the hero), its own mask
      if (t >= T53 && t < T56 + 0.25) {
        const e = out3(inv(T53 + 0.08, T53 + 0.4, t)), o = in3(inv(T56, T56 + 0.2, t));
        x.save(); rrc(x, hx, hy, hw, hh, hr); x.clip(); x.translate(0, (1 - e) * hh - o * hh);
        const h = S.ctl.ch; circle(x, hx - hw / 2 + h / 2, hy, h * 0.36); x.fillStyle = C.navy; x.fill(); icon(x, OCT, 'shield-check-24', hx - hw / 2 + h / 2, hy, h * 0.4, C.gold);
        text(x, 'APPROVE EACH APP', hx - hw / 2 + h + 18 * S.ctl.s, hy + h * 0.14, FT.en(h * 0.38), C.navy, 'left', 2 * S.ctl.s);
        x.restore();
      }
      // CTA content: /computer on typed at 16ths
      if (t >= T56 + 0.1) {
        const e = out3(inv(T56 + 0.15, T56 + 0.45, t)); const ss = S.ctaS, h = S.cta.h;
        x.save(); rrc(x, hx, hy, hw, hh, hr); x.clip(); x.translate(0, (1 - e) * hh);
        circle(x, hx - hw / 2 + h / 2, hy, h * 0.34); x.fillStyle = C.navy; x.fill(); icon(x, OCT, 'terminal-24', hx - hw / 2 + h / 2, hy, h * 0.36, C.gold);
        const fs = h * 0.4, ts = charT(CMD, CMD_T0, B / 4);
        const cx2 = popType(x, t, CMD, hx - hw / 2 + h + 20 * ss, hy + fs * 0.36, FT.monoB(fs), fs, C.navy, ts);
        caret(x, t, cx2, hy + fs * 0.36, fs, ts[ts.length - 1]);
        // return key
        const rx = hx + hw / 2 - h / 2; circle(x, rx, hy, h * 0.34); x.fillStyle = t >= ts[ts.length - 1] ? grad(x, rx - h * .34, hy, rx + h * .34, hy, C.fire) : C.navy; x.fill();
        x.save(); x.translate(rx, hy); x.scale(h / 150, h / 150); x.strokeStyle = t >= ts[ts.length - 1] ? C.navy : C.white; x.lineWidth = 7; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(16, -18); x.lineTo(16, 6); x.lineTo(-16, 6); x.moveTo(-6, -5); x.lineTo(-17, 6); x.lineTo(-6, 17); x.stroke(); x.restore();
        x.restore();
      }
      x.restore();
    }
  }
  dropdown(x, t);
  finder(x, t);
  // chips 2 + 3 grow out of chip 1, then merge into the CTA
  [['STOP ANYTIME · ESC', 'stop-24', bt(54)], ['RESET ALWAYS-ALLOWED APPS', 'trash-16', bt(55)]].forEach(([lab, ic, t0], i) => {
    if (t < t0 || t > T56 + 0.6) return;
    const [tx, ty] = S.ctl.chips[i + 1], [fx, fy] = S.ctl.chips[i];
    const g = sp(t, t0, 16, 0.8), m = sp(t, T56, 13, 0.82);
    const cx = lerp(lerp(fx, tx, g), S.cta.x, clamp(m, 0, 1)), cy = lerp(lerp(fy, ty, g), S.cta.y, clamp(m, 0, 1));
    const w = lerp(S.ctl.cw * clamp(0.3 + 0.7 * g, 0, 1.05), S.cta.w * 0.6, clamp(m, 0, 1)), h = lerp(S.ctl.ch * clamp(g, 0, 1.05), S.cta.h * 0.5, clamp(m, 0, 1));
    if (m > 0.97 || h < 2) return;
    if (m < 0.05) ctlChip(x, cx, cy, w, h, lab, ic, S.ctl.s);
    else card(x, cx, cy, w, h, h / 2, { fill: C.white, depth: 0.8 * (1 - m) });
  });
  // Esc keycap (b54)
  if (t >= bt(54) && t < bt(56.1)) {
    const [cx, cy] = S.ctl.chips[1]; const k = clamp(sp(t, bt(54.1), 18, 0.8), 0, 1.1) * (1 - in3(inv(bt(55.9), bt(56.1), t))); const pk = press(t, bt(54.5), bt(54.5) + 0.12, 0.86);
    const s2 = S.ctl.s, X = cx + S.ctl.cw / 2 - 90 * s2;
    if (k > 0.01) { x.save(); x.translate(X, cy); x.scale(k * pk * s2, k * pk * s2); card(x, 0, 0, 110, 82, 26, { fill: C.navy, depth: 0.5 }); text(x, 'esc', 0, 10, FT.monoB(30), C.gold, 'center'); x.restore(); }
  }
  // the TYPES dropdown + cursor
  if (t >= bt(36.2) && t < bt(52.7)) {
    const cur = cursorPathCopilot(t);
    dragTile(x, t, cur);
    const s2 = (L.name === 'h' ? 1.05 : 1.2) * S.verb.s;
    [bt(41), bt(43), bt(49), bt(52)].forEach(tc => clickRing(x, cur[0], cur[1], t, tc, C.orange, 48 * s2));
    const ps = press(t, bt(41), bt(41) + 0.1, 0.85) * press(t, bt(43), bt(43) + 0.1, 0.85) * press(t, bt(49), bt(49) + 0.1, 0.85) * press(t, bt(52), bt(52) + 0.1, 0.85);
    const appear = clamp(sp(t, bt(36.2), 16, 0.8), 0, 1.1), gone = in3(inv(bt(52.3), bt(52.65), t));
    copilotCursor(x, cur[0], cur[1], s2 * ps * (1 - gone) * clamp(appear, 0, 1.05), appear);
  }
  // control headline + get-it headline
  slam(x, t, ['YOU\'RE', 'IN'], S.ctl.head.x, S.ctl.head.y1, S.ctl.head.size, [bt(53), bt(53.25)], bt(55.3));
  slam(x, t, ['CONTROL.'], S.ctl.head.x, S.ctl.head.y2, S.ctl.head.size, [bt(53.5)], bt(55.3), { marker: { i: 0, t: bt(53.5) + 0.08 } });
  slam(x, t, ['TURN', 'IT'], S.head7.x, S.head7.y1, S.head7.size, [bt(56), bt(56.25)], null);
  slam(x, t, ['ON.'], S.head7.x, S.head7.y2, S.head7.size, [bt(57)], null, { marker: { i: 0, t: bt(57) + 0.08 } });
  const kf = (L.name === 'h' ? 30 : 34) * S.ctaS;
  rise(x, t, 'OR: SETTINGS  ›  COMPUTER USE  ›  ENABLE', S.ctaK[0][0], S.ctaK[0][1], FT.en(kf), C.navy, bt(58), null, { size: kf, align: 'center', spacing: 3 * S.ctaS });
  rise(x, t, 'MACOS · WINDOWS · PUBLIC PREVIEW', S.ctaK[1][0], S.ctaK[1][1] + (L.name === 'h' ? 0 : 0), FT.en(kf * 0.9), C.ink2, bt(59), null, { size: kf, align: 'center', spacing: 3 * S.ctaS });
}

/* night pages: the drop (b30.8-b36.4) and the end card (b59.3-) */
function nightLayer(x, t, tf, k) {
  x.save(); x.setTransform(k, 0, 0, k, 0, 0);
  // --- drop flood: fire pours out of Allow, navy follows from the same point ---
  if (t >= bt(30.8) && t < bt(36.5)) {
    const [ax, ay] = S.ap(255, 120); const c = cam(Math.min(t, bt(31.49))); const sx = (ax - c.x) * c.z + L.W / 2, sy = (ay - c.y) * c.z + L.H / 2;
    const R = farR(L.W, L.H, sx, sy);
    const fu = io2(inv(bt(30.8), bt(30.8) + 0.35, t)), nu = io2(inv(bt(31.3), bt(31.3) + 0.35, t));
    if (t < bt(35.5)) {
      if (fu > 0 && nu < 1) { circle(x, sx, sy, R * fu); x.fillStyle = grad(x, sx - R, sy - R, sx + R, sy + R, C.fire); x.fill(); }
      if (nu > 0) { circle(x, sx, sy, R * nu); x.fillStyle = C.navy; x.fill(); }
      if (nu >= 1) { folio(x, t, true); nightIdea(x, t); }
    } else {
      // the night page shrinks back into the Ledger window (shape, never fade)
      const u = io3(inv(bt(35.5), bt(36.25), t));
      const [wx, wy] = toScreen(t, S.win5.x, S.win5.y), cz = cam(t).z;
      const ww = S.win5.w * cz, wh = S.win5.h * cz;
      const cx = lerp(L.W / 2, wx, u), cy = lerp(L.H / 2, wy, u), w = lerp(L.W * 1.02, ww, u), h = lerp(L.H * 1.02, wh, u), r = lerp(0, 40 * S.win5S * cz, u);
      if (t < bt(36.25)) {
        rrc(x, cx, cy, w, h, r); x.fillStyle = C.navy; x.fill();
        nightIdeaShrink(x, t, u, cx, cy, w, h);
      }
    }
  }
  // --- end card ---
  if (t >= bt(59.3)) {
    const [px, py] = toScreen(Math.min(t, bt(59.99)), S.cta.x, S.cta.y);
    // fire covers the frame exactly on b60 (camera resets under it); navy follows and the end card reveals inside it
    const R = farR(L.W, L.H, px, py), f = io2(inv(bt(59.3), bt(59.3) + 0.35, t)), u = io2(inv(bt(59.42), bt(59.42) + 0.35, t));
    if (f > 0 && u < 1) { circle(x, px, py, R * f); x.fillStyle = grad(x, px - R, py - R, px + R, py + R, C.fire); x.fill(); }
    if (u > 0) { circle(x, px, py, R * u); x.fillStyle = C.navy; x.fill(); x.save(); circle(x, px, py, R * u); x.clip(); endCard(x, t); x.restore(); }
  }
  x.restore();
}
function nightWorld(x, t, fn, tMin = 0) { // night content lives under the camera too (end card: the post-reset camera)
  const c = cam(Math.max(t, tMin)); x.save(); x.transform(c.z, 0, 0, c.z, L.W / 2 - c.z * c.x, L.H / 2 - c.z * c.y); fn(); x.restore();
}
function nightIdea(x, t) {
  nightWorld(x, t, () => {
    const N = S.night, s = N.s, out = bt(35.3);
    kicker(x, t, N.x, N.kick, '04 / 07', 'COMPUTER USE · PUBLIC PREVIEW', bt(32), out, s, true, N.x + (L.W - 2 * L.pad) * s);
    const lines = L.night.lines;
    lines.forEach((ws, i) => {
      x.save(); x.font = FT.en(N.size); const wd = x.measureText(ws.join(' ')).width; x.restore();
      const maxW = (L.W - 2 * L.pad) * s * (L.name === 'h' ? 0.75 : 0.95); const size = wd > maxW ? N.size * maxW / wd : N.size;
      slam(x, t, ws, N.x, N.ys[i], size, [bt(32) + i * B / 4], out, { color: C.white, fireText: i === 2 ? [0] : null });
    });
    rise(x, t, 'EVEN THE ONES WITH NO API.', N.x + 4 * s, N.sub, FT.en(58 * s), C.gold, bt(33), out, { size: 58 * s, spacing: 3 * s });
    ['MACOS', 'WINDOWS', 'APP + CLI'].forEach((lab, i) => {
      const kk = clamp(sp(t, bt(34) + i * B / 2, 20, 0.8), 0, 1.1) * (1 - in3(inv(out, out + 0.2, t))); if (kk <= 0.01) return;
      x.save(); x.font = FT.en(30 * s); const ws2 = ['MACOS', 'WINDOWS'].slice(0, i).map(l => x.measureText(l).width + 80 * s + 20 * s).reduce((a, b) => a + b, 0); x.restore();
      const w = tw(x, lab, FT.en(30 * s), 3 * s) + 52 * s; const cx = N.x + ws2 + w / 2;
      x.save(); x.translate(cx, N.chips); x.scale(kk, kk); rrc(x, 0, 0, w, 60 * s, 30 * s); x.lineWidth = 3 * s; x.strokeStyle = C.white; x.stroke(); text(x, lab, 0, 11 * s, FT.en(30 * s), C.white, 'center', 3 * s); x.restore();
    });
    // the white Copilot mark (it becomes Copilot's cursor badge after the night)
    const [mx, my, ms] = N.mark; const mk = clamp(sp(t, bt(35), 18, 0.8), 0, 1.1);
    if (mk > 0.01) icon(x, OCT, 'copilot-96', mx, my, ms * mk, C.white);
  });
}
function nightIdeaShrink(x, t, u, cx, cy, w, h) {
  // the mark rides with the shrinking page toward the cursor's start, turning into the badge
  nightWorld(x, t, () => {
    const [mx, my, ms] = S.night.mark; const [tx, ty] = (() => { const p = S.w5p(170, -120); return [p[0] + 36 * S.verb.s * 1.05 + 20, p[1] + 62 * S.verb.s * 1.05]; })();
    const g = io3(u); icon(x, OCT, 'copilot-96', lerp(mx, tx, g), lerp(my, ty, g), lerp(ms, 26 * S.verb.s, g), mix(C.white, C.gold, g));
  });
}
function endCard(x, t) {
  nightWorld(x, t, () => {
    const [ex, ey] = S.end, s = S.endS, size = L.endSize * s;
    const shrink = in3(inv(bt(62), bt(62.45), t)); // everything shrinks into one point
    const pu = 1 - shrink;
    x.save(); x.translate(ex, ey); x.scale(Math.max(0.001, pu), Math.max(0.001, pu)); x.translate(-ex, -ey);
    if (pu > 0.01) {
      // kicker
      const kfs = 30 * s; rise(x, t, 'GITHUB COPILOT APP · PUBLIC PREVIEW', ex, ey - size * 0.95, FT.en(kfs), C.gold, bt(60), null, { size: kfs, align: 'center', spacing: 4 * s });
      // headline (centred): COMPUTER USE, the key word in fire
      x.save(); x.font = FT.en(size); const w1 = x.measureText('COMPUTER ').width, w2 = x.measureText('USE').width; x.restore();
      const maxW = (L.W - 2 * L.pad) * s; const fsz = (w1 + w2) > maxW ? size * maxW / (w1 + w2) : size; const sc = fsz / size;
      slam(x, t, ['COMPUTER', 'USE'], ex - (w1 + w2) * sc / 2, ey + fsz * 0.35, fsz, [bt(60), bt(60.25)], null, { color: C.white, fireText: [1] });
      rise(x, t, 'Settings › Computer Use › Enable   ·   /computer on', ex, ey + fsz * 0.35 + 90 * s, FT.uiS(34 * s), C.denim, bt(61), null, { size: 40 * s, align: 'center' });
      rise(x, t, 'Source: GitHub Changelog, Oct 1 2026 · docs.github.com', ex, ey + fsz * 0.35 + 150 * s, FT.ui(24 * s), '#8A93C4', bt(61.25), null, { size: 30 * s, align: 'center' });
    }
    x.restore();
    // the point grows into a disc (b63) which becomes the phoenix mark (b64)
    if (t >= bt(62.4)) {
      const d = sp(t, bt(63), 14, 0.82), m = sp(t, bt(64), 14, 0.82);
      const R0 = 6 * s, R1 = 150 * s, R2 = 165 * s;
      const r = lerp(lerp(R0, R1, clamp(d, 0, 1.05)), R2, clamp(m, 0, 1.05));
      const lift = L.name === 'h' ? 70 * s : 110 * s;
      const cy = ey - lift * clamp(m, 0, 1);
      circle(x, ex, cy, r); x.fillStyle = C.navy2; x.fill();
      if (LOGO && m > 0.01) { const ls = r * 1.62 * clamp(m, 0, 1.05); x.save(); x.imageSmoothingQuality = 'high'; x.drawImage(LOGO, ex - ls / 2, cy - ls / 2, ls, ls); x.restore(); }
      // wordmark rises out of a mask line under the mark
      const wy = cy + r + 110 * s;
      rise(x, t, 'YUV.AI', ex, wy, FT.en(96 * s), C.pink, bt(64) + 0.05, null, { size: 96 * s, align: 'center', spacing: 4 * s });
      rise(x, t, "LET'S FLY HIGH", ex, wy + 60 * s, FT.en(34 * s), C.cyan, bt(64) + 0.18, null, { size: 36 * s, align: 'center', spacing: 8 * s });
    }
  }, bt(60) + 0.006);
}

/* ---------------- mount: async seek(t), everything decoded before the first seek ---------------- */
const Q = new URLSearchParams(location.search);
const LAYK = Q.get('L') || 'h'; SC = +(Q.get('scale') || 1);
init(LAYK);
const cv = document.getElementById('c'); cv.width = Math.round(L.W * SC); cv.height = Math.round(L.H * SC);
CTX = cv.getContext('2d');
const frame = (t, tf) => { const x = CTX; x.setTransform(SC, 0, 0, SC, 0, 0); x.clearRect(0, 0, L.W, L.H); draw(x, Math.max(0, t), tf ?? t); };
window.seek = async (t, tf) => { frame(t, tf); };
window.FILM = { B, BPM: 60 / B, DUR, NB, layout: L.name, W: L.W, H: L.H, cuts: [bt(18), bt(19), bt(20)] };
window.__ready = (async () => {
  await Promise.all(FONT_FACES.map(f => document.fonts.load(f, 'ABC abc 123 /computer ·›…')));
  await document.fonts.ready;
  if (LOGO_URL) { const im = new Image(); im.src = LOGO_URL; await im.decode(); LOGO = im; }
  frame(0, 0);
  return FONT_FACES.every(f => document.fonts.check(f));
})();
