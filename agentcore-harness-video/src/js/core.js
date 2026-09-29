// ============ CORE: deterministic helpers. No real-time animation, no unseeded randomness. ============
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const rnd = seed => { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const WD = window.WORDS;
// W(lineKey, word, nth) -> start time of the nth spoken (or on-screen) occurrence of `word`
const findTok = (key, w, n = 1) => {
  const L = WD[key]; if (!L) throw new Error("no line " + key);
  const q = norm(w); let c = 0;
  for (const x of L.sp) if (x.w === q && ++c === n) return x;
  c = 0; for (const x of L.disp) if (norm(x.t) === q && ++c === n) return { s: x.s, e: x.e };
  throw new Error(`W(${key},${w},${n}) not found`);
};
const W = (k, w, n) => findTok(k, w, n).s, WE = (k, w, n) => findTok(k, w, n).e, LS = k => WD[k].start, LE = k => WD[k].end;
const CUES = [], CUTS = [], cue = (name, t, vol = 1) => CUES.push({ name, t: +t.toFixed(3), vol });
const TYPERS = [], COUNTERS = [], WOB = [], SPIN = [], LIVE = [];
const stage = document.getElementById("stage"), world = document.getElementById("world");
let UID = 0;
const px = { left: 1, top: 1, width: 1, height: 1, fontSize: 1, right: 1, bottom: 1, borderRadius: 1 };
const st = (d, o) => { for (const k in o) if (o[k] !== undefined) d.style[k] = (px[k] && typeof o[k] === "number") ? o[k] + "px" : o[k]; return d; };
const box = (k, css, html = "", cls = "") => { const d = document.createElement("div"); d.className = "abs " + cls; d.innerHTML = html; st(d, css); k.el.appendChild(d); return d; };
// inline svg with per-instance unique ids (duplicate ids break clip-paths / gradients)
function svgI(name, s, sw = 1.6) {
  let x = ICONS[name]; if (!x) throw new Error("icon " + name); const u = "u" + (++UID);
  x = x.replace(/id="([^"]+)"/g, (m, i) => `id="${i}_${u}"`).replace(/url\(#([^)]+)\)/g, (m, i) => `url(#${i}_${u})`)
       .replace(/(xlink:)?href="#([^"]+)"/g, (m, xl, i) => `${xl || ""}href="#${i}_${u}"`)
       .replace(/(<svg[^>]*?)\s(width|height)="[^"]*"/g, "$1").replace(/(<svg[^>]*?)\s(width|height)="[^"]*"/g, "$1")
       .replace(/<svg /, `<svg style="width:${s}px;height:${s}px;stroke-width:${sw}" `);
  return x;
}
const logoSVG = (v, h) => { const u = "l" + (++UID); return LOGO[v].replace(/\bst(\d)\b/g, `st$1_${u}`).replace(/(<svg[^>]*?)\s(x|y)="[^"]*"/g, "$1").replace(/(<svg[^>]*?)\s(x|y)="[^"]*"/g, "$1").replace(/(<svg[^>]*?)\s(width|height)="[^"]*"/g, "$1").replace(/<svg /, `<svg style="height:${h}px;width:auto" `).replace(/id="([^"]+)"/g, `id="$1_${u}"`); };
const ease = { out3: x => 1 - Math.pow(1 - x, 3) };
// ---------- primitives ----------
function L(k, txt, o = {}) {                       // mask-reveal text line (yPercent 115 -> 0, expo.out)
  const f = o.f || "anton";
  const d = box(k, { left: o.x ?? 80, top: o.y ?? 200, width: o.w, fontSize: o.size || 200, textAlign: o.align || "left", color: o.c }, `<span class="in">${txt}</span>`, `mask f-${f} ${o.cls || ""}`);
  const inn = d.firstChild;
  if (o.fit) { let s = o.size || 200, g = 0; while (inn.getBoundingClientRect().width > o.fit && s > 24 && g++ < 80) { s *= .965; d.style.fontSize = s + "px"; } }
  k.tl.fromTo(inn, { yPercent: 118 }, { yPercent: 0, duration: o.dur || .5, ease: "expo.out", immediateRender: true }, o.t ?? k.t0);
  d._in = inn; return d;
}
function IC(k, name, o = {}) {                      // icon, pop-in
  const d = box(k, { left: o.x, top: o.y, color: o.c, width: o.s || 200, height: o.s || 200 }, svgI(name, o.s || 200, o.sw || 1.6), "ic");
  k.tl.fromTo(d, { scale: 0, rotation: (o.r || 0) - 12 }, { scale: 1, rotation: o.r || 0, duration: .45, ease: "back.out(2)" }, o.t ?? k.t0);
  if (o.pop !== false) cue("pop", o.t ?? k.t0, .6);
  return d;
}
function EM(k, e, o = {}) {                         // emoji, pop-in (humor only)
  const d = box(k, { left: o.x, top: o.y, fontSize: o.s || 200 }, e, "emo");
  k.tl.fromTo(d, { scale: 0, rotation: (o.r || 0) - 20 }, { scale: 1, rotation: o.r || 0, duration: .5, ease: "back.out(2.4)" }, o.t ?? k.t0);
  if (o.wob) WOB.push({ el: d, ph: 1.3, amp: o.wob }); if (o.snd !== false) cue("pop", o.t ?? k.t0, .6);
  return d;
}
function ST(k, txt, o = {}) {                       // sticker: mono, 3px border, hard offset shadow, rotated, wobble
  const w = box(k, { left: o.x, top: o.y }, `<div class="stk" style="font-size:${o.size || 30}px;${o.bg ? "background:" + o.bg + ";" : ""}${o.fg ? "color:" + o.fg + ";" : ""}">${txt}</div>`, "stkw");
  k.tl.fromTo(w, { scale: 0, rotation: (o.r || 0) - 16 }, { scale: 1, rotation: o.r || 0, duration: .45, ease: "back.out(2.6)" }, o.t ?? k.t0);
  WOB.push({ el: w.firstChild, ph: (o.x + o.y) % 6.28, amp: 1.5 }); cue("pop", o.t ?? k.t0, .7); return w;
}
function TO(k, o) {                                 // iOS-style notification toast
  const d = box(k, { left: o.x ?? 1180, top: -240, width: o.w || 640 }, `<div class="ti">${o.icon || "🔔"}</div><div><div class="tt"><b>${o.title}</b><span>now</span></div><div class="tm">${o.msg}</div></div>`, "toast");
  const y = (o.y ?? 130) + 240;
  k.tl.fromTo(d, { y: 0 }, { y, duration: .5, ease: "back.out(1.5)" }, o.t);
  k.tl.to(d, { y: 0, duration: .3, ease: "power2.in", immediateRender: false }, o.t + (o.dur || 1.5));
  cue(o.snd || "ding", o.t); return d;
}
function SC(k, o) {                                 // hand-drawn scribble circle (draw-on)
  const r = rnd(o.seed || 11), N = 44, pts = [];
  for (let i = 0; i <= N; i++) { const a = -2.3 + (i / N) * 1.16 * Math.PI * 2, j = 1 + (r() - .5) * .07 + (i / N) * .07; pts.push([o.w / 2 + o.w / 2 * .96 * Math.cos(a) * j, o.h / 2 + o.h / 2 * .96 * Math.sin(a) * j]); }
  const dpath = "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L");
  const d = box(k, { left: o.x, top: o.y, width: o.w, height: o.h }, `<svg width="${o.w}" height="${o.h}" viewBox="0 0 ${o.w} ${o.h}" style="overflow:visible"><path d="${dpath}" pathLength="1" fill="none" stroke="${o.c || "var(--scr)"}" stroke-width="${o.sw || 8}" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1 1"/></svg>`);
  k.tl.fromTo(d.querySelector("path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: o.dur || .45, ease: "power2.inOut" }, o.t); cue("scribble", o.t, .8); return d;
}
function AR(k, o) {                                 // hand-drawn curved arrow + serif label
  const [x1, y1, x2, y2] = o.p, cx = (x1 + x2) / 2 + (o.bend ?? 60), cy = (y1 + y2) / 2 - (o.bend2 ?? 60);
  const ang = Math.atan2(y2 - cy, x2 - cx), hl = 34, a1 = ang + 2.65, a2 = ang - 2.65;
  const dd = `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, hd = `M${x2 + hl * Math.cos(a1)} ${y2 + hl * Math.sin(a1)} L${x2} ${y2} L${x2 + hl * Math.cos(a2)} ${y2 + hl * Math.sin(a2)}`;
  const c = o.c || "var(--scr)";
  const d = box(k, { left: 0, top: 0, width: 1920, height: 1080 }, `<svg width="1920" height="1080" style="overflow:visible"><path d="${dd}" pathLength="1" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" style="stroke-dasharray:1 1"/><path d="${hd}" pathLength="1" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1 1"/></svg>`);
  const ps = d.querySelectorAll("path");
  k.tl.fromTo(ps[0], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .4, ease: "power2.inOut" }, o.t);
  k.tl.fromTo(ps[1], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .15, ease: "power1.out" }, o.t + .36);
  if (o.label) L(k, o.label, { f: "serif", x: o.lx, y: o.ly, size: o.ls || 54, c: o.lc || c, t: o.t + .1, dur: .5, cls: "" });
  cue("scribble", o.t, .6); return d;
}
function CU(k, pts) {                               // animated mouse cursor with clicks
  const c = box(k, {}, `<svg viewBox="0 0 24 24" width="46" height="46"><path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11.2 13.2 L18 13 Z" fill="#0B0B0C" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`, "cursor");
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    k.tl.fromTo(c, { x: a.x, y: a.y }, { x: b.x, y: b.y, duration: Math.max(.05, b.t - a.t), ease: "power2.inOut", immediateRender: i === 0 }, a.t);
  }
  if (pts.length === 1) st(c, { left: pts[0].x, top: pts[0].y });
  k.tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: .15 }, pts[0].t - .05);
  pts.forEach(p => { if (!p.click) return;
    const rp = box(k, { left: p.x + 8, top: p.y + 6 }, "", "ripple");
    k.tl.fromTo(rp, { scale: .2, opacity: .9 }, { scale: 1.3, opacity: 0, duration: .4, ease: "power2.out" }, p.t);
    k.tl.fromTo(c, { scale: 1 }, { scale: .82, duration: .06, yoyo: true, repeat: 1, immediateRender: false }, p.t); cue("click", p.t, .8); });
  return c;
}
function TY(k, o) {                                 // typed terminal text with blinking caret (driven by fx)
  const d = box(k, { left: o.x, top: o.y, fontSize: o.size || 34, color: o.c, width: o.w }, `<span class="tx"></span><span class="caret">▋</span>`, "f-mono " + (o.cls || ""));
  d.style.whiteSpace = "pre"; TYPERS.push({ tx: d.firstChild, caret: d.lastChild, text: o.text, t0: o.t, cps: o.cps || 42 });
  return d;
}
function CN(k, o) {                                 // counter
  const d = box(k, { left: o.x, top: o.y, fontSize: o.size || 200, width: o.w, textAlign: o.align || "left", color: o.c }, "", "f-" + (o.f || "anton") + " " + (o.cls || ""));
  COUNTERS.push({ el: d, a: o.from, b: o.to, t0: o.t, dur: o.dur || 1, fmt: o.fmt || (v => Math.round(v).toLocaleString("en-US")) }); return d;
}
function PN(k, o = {}) {                            // panel with pop/wipe-in
  const d = box(k, { left: o.x, top: o.y, width: o.w, height: o.h, background: o.bg, border: o.bd, borderRadius: o.r, boxShadow: o.sh, color: o.c, overflow: o.ov, padding: o.pad }, o.html || "", o.cls || "");
  if (o.t !== undefined) { if (o.wipe) k.tl.fromTo(d, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: o.dur || .45, ease: "expo.out" }, o.t);
    else k.tl.fromTo(d, { scale: 0, rotation: (o.rot || 0) - 6 }, { scale: 1, rotation: o.rot || 0, duration: .4, ease: "back.out(1.8)" }, o.t); if (o.snd !== false) cue("pop", o.t, .5); }
  else if (o.rot) d.style.transform = `rotate(${o.rot}deg)`;
  return d;
}
function RL(k, o) {                                 // draw-on rule / strike-through (scaleX)
  const d = box(k, { left: o.x, top: o.y, width: o.w, height: o.h || 12, background: o.c || "var(--fg)", transformOrigin: "0 50%" });
  k.tl.fromTo(d, { scaleX: 0 }, { scaleX: 1, duration: o.dur || .35, ease: "expo.out" }, o.t); if (o.snd !== false) cue("scribble", o.t, .5); return d;
}
function FADE(k, el, t, dur = .3) { k.tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur }, t); return el; }
// ---------- shots ----------
const SHOTS = [];
const S = (id, t0, theme, page, fn, o = {}) => SHOTS.push({ id, t0, theme, page, fn, o });
