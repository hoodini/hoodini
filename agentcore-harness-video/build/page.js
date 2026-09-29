(async()=>{try{
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

// ================= PAGES 1-6 =================
const mono = (k, txt, o) => L(k, txt, { f: "mono", cls: "b", size: 34, ...o });
// ---- 01 HOOK
S("cold", 0, "ink", 1, k => {
  TY(k, { x: 80, y: 300, size: 46, text: "$ ./agent --env local", t: .05, cps: 60, c: "var(--fg)" });
  ST(k, "localhost:3000", { x: 1220, y: 420, r: 5, t: .3, size: 34 });
});
S("h1a", W("h1", "pov"), "paper", 1, k => {
  mono(k, "POV:", { x: 80, y: 150, size: 46, t: W("h1", "pov") });
  L(k, "YOUR AI", { x: 70, y: 205, size: 280, fit: 1300, t: W("h1", "your") });
  L(k, "AGENT", { x: 70, y: 445, size: 400, fit: 1250, t: W("h1", "agent") });
  IC(k, "l:laptop", { x: 1360, y: 250, s: 400, sw: 1.3, t: W("h1", "agent") + .1 });
  ST(k, "localhost:3000", { x: 1330, y: 700, r: 5, t: W("h1", "agent") + .25, size: 34 });
});
S("h1b", W("h1", "works"), "ink", 1, k => {
  L(k, "WORKS", { x: 70, y: 165, size: 480, fit: 1400, t: W("h1", "works") });
  L(k, "PERFECTLY", { x: 70, y: 640, size: 230, fit: 1600, t: W("h1", "perfectly") });
  IC(k, "l:badge-check", { x: 1440, y: 190, s: 330, c: "var(--ac)", sw: 1.5, t: W("h1", "works") + .12 });
  TO(k, { t: W("h1", "perfectly") + .05, icon: "✅", title: "CI", msg: "all tests passed", x: 1180, y: 700 });
});
S("h1c", W("h1", "on"), "orange", 1, k => {
  L(k, "ON YOUR", { x: 70, y: 160, size: 280, fit: 1400, t: W("h1", "on") });
  L(k, "LAPTOP.", { x: 70, y: 440, size: 420, fit: 1300, t: W("h1", "laptop") });
  EM(k, "💻", { x: 1480, y: 300, s: 300, t: W("h1", "laptop") + .05, r: 8, wob: 2 });
  ST(k, "works on my machine™", { x: 1150, y: 800, r: -3, t: W("h1", "laptop") + .3, size: 32 });
  AR(k, { p: [1520, 250, 1250, 470], t: W("h1", "laptop") + .25, label: "famous last words.", lx: 1230, ly: 150, ls: 60, bend: 80, bend2: 30 });
});
S("h2", LS("h2"), "paper", 1, k => {
  mono(k, "BOSS SAYS:", { x: 80, y: 150, size: 40, t: LS("h2") });
  L(k, "SHIP IT.", { x: 70, y: 210, size: 470, fit: 1700, t: W("h2", "ship") });
  PN(k, { x: 1000, y: 730, w: 470, h: 100, bg: "var(--fg)", c: "var(--bg)", html: `<div class="f-mono" style="font:800 34px/100px 'JetBrains Mono';text-align:center">DEPLOY TO PROD</div>`, t: W("h2", "ship") + .2 });
  CU(k, [{ x: 1600, y: 500, t: W("h2", "ship") + .1 }, { x: 1180, y: 770, t: W("h2", "it") + .05, click: true }]);
  ST(k, "friday 4:59 PM", { x: 80, y: 800, r: -4, t: W("h2", "ship") + .3, size: 32 });
});
S("h3a", LS("h3"), "ink", 1, k => {
  L(k, "COOL.", { x: 70, y: 170, size: 430, fit: 1500, t: LS("h3") });
  L(k, "now it needs…", { f: "serif", x: 80, y: 600, size: 170, c: "var(--ac)", t: W("h3", "now") });
});
const prob = (k, n, word, icon, o = {}) => {
  const t = k.t0;
  mono(k, `// PROBLEM ${n}/5`, { x: 80, y: 150, t });
  L(k, word, { x: 70, y: 205, size: 520, fit: 1720, t: t + .03 });
  IC(k, icon, { x: 80, y: 660, s: 210, sw: 1.5, t: t + .15 });
  if (o.st) ST(k, o.st, { x: o.sx ?? 380, y: o.sy ?? 730, r: o.sr ?? -4, t: t + .25, size: 32 });
  if (o.toast) TO(k, { t: t + .2, x: 1180, y: 690, ...o.toast });
  if (o.em) EM(k, o.em, { x: 1600, y: 660, s: 200, t: t + .2, r: 8, wob: 3 });
};
S("sand", W("h3", "sandboxes"), "paper", 1, k => prob(k, 1, "SANDBOXES", "l:box", { st: "who runs this code??", em: "📦" }));
S("mem", W("h3", "memory"), "orange", 1, k => prob(k, 2, "MEMORY", "l:brain", { st: "state? what state?", em: "🧠" }));
S("auth", W("h3", "auth"), "ink", 1, k => prob(k, 3, "AUTH", "l:key-round", { toast: { icon: "🚫", title: "401", msg: "unauthorized", snd: "err" } }));
S("logs", W("h3", "logs"), "paper", 1, k => { prob(k, 4, "LOGS", "l:scroll-text");
  TY(k, { x: 420, y: 700, size: 30, text: "ERR  timeout  ...\nERR  timeout  ...\nWARN retry 7/7", t: k.t0 + .15, cps: 60 }); });
S("scal", W("h3", "scaling"), "orange", 1, k => prob(k, 5, "SCALING", "l:trending-up", { toast: { icon: "🔥", title: "503", msg: "service unavailable", snd: "err" } }));
S("ther", LS("h4"), "ink", 1, k => {
  L(k, "And", { f: "serif", x: 80, y: 190, size: 200, t: LS("h4") });
  L(k, "therapy.", { f: "serif", x: 70, y: 330, size: 560, fit: 1400, c: "var(--ac)", t: W("h4", "therapy") });
  EM(k, "🛋️", { x: 1500, y: 330, s: 290, t: W("h4", "therapy") + .05, r: -6 });
  SC(k, { x: 40, y: 350, w: 1440, h: 470, t: W("h4", "therapy") + .3, c: "var(--fg)" });
  cue("scratch", W("h4", "therapy") - .02);
  ST(k, "insurance not included", { x: 80, y: 830, r: -2, t: W("h4", "therapy") + .4, size: 30 });
}, { cut: "none" });
// ---- 02 PAIN
S("duct", LS("pain1"), "paper", 2, k => {
  mono(k, "SO YOU", { x: 80, y: 150, size: 44, t: LS("pain1") });
  L(k, "DUCT-TAPE", { x: 70, y: 220, size: 560, fit: 1740, t: W("pain1", "duct") });
  const tp = box(k, { left: 380, top: 470, width: 900, height: 96, background: "#b9b3a6", transform: "rotate(-6deg)", boxShadow: "0 6px 0 rgba(0,0,0,.25)", transformOrigin: "0 50%" });
  k.tl.fromTo(tp, { scaleX: 0 }, { scaleX: 1, duration: .3, ease: "power3.out" }, W("pain1", "tape")); cue("tape", W("pain1", "tape") - .02);
  ST(k, "TODO: fix later", { x: 1230, y: 780, r: 5, t: W("pain1", "tape") + .1, size: 34 });
});
S("six", W("pain1", "six"), "orange", 2, k => {
  L(k, "6", { x: 70, y: 130, size: 540, t: W("pain1", "six") });
  L(k, "SERVICES", { x: 70, y: 690, size: 190, fit: 800, t: W("pain1", "services") });
  const items = [["aws:lambda", "compute"], ["aws:ecs", "sandbox"], ["aws:dynamodb", "memory"], ["aws:cognito", "auth"], ["aws:cloudwatch", "logs"], ["aws:secrets", "secrets"]];
  items.forEach((it, i) => { const cx = 900 + (i % 3) * 300, cy = 190 + Math.floor(i / 3) * 320, rot = [-4, 3, -2, 4, -3, 2][i];
    const p = PN(k, { x: cx, y: cy, w: 250, h: 290, bg: "var(--ac)", bd: "3px solid var(--fg)", r: 18, sh: "8px 8px 0 var(--fg)", rot, t: W("pain1", "six") + .12 + i * .09,
      html: `<div style="margin:22px auto 0;width:150px">${svgI(it[0], 150)}</div><div class="f-mono" style="font:800 26px 'JetBrains Mono';text-align:center;margin-top:18px">${it[1]}</div>` });
    WOB.push({ el: p, ph: i * 1.1, amp: 1.2, base: rot }); });
  [[880, 470, -12], [1100, 250, 8]].forEach((a, i) => { const tp = box(k, { left: a[0], top: a[1], width: 700, height: 70, background: "#b9b3a6", transform: `rotate(${a[2]}deg)`, opacity: .92, transformOrigin: "0 50%" });
    k.tl.fromTo(tp, { scaleX: 0 }, { scaleX: 1, duration: .25, ease: "power3.out" }, W("pain1", "services") - .1 + i * .12); });
  ST(k, "held together by hope", { x: 900, y: 830, r: -3, t: W("pain1", "services") + .2, size: 30 });
});
S("twelve", LS("pain2"), "ink", 2, k => {
  L(k, "12", { x: 70, y: 120, size: 540, c: "var(--ac)", t: LS("pain2") });
  L(k, "DASHBOARDS", { x: 70, y: 690, size: 150, fit: 820, t: W("pain2", "dashboards") });
  const r = rnd(5);
  for (let i = 0; i < 12; i++) { const cx = 900 + (i % 4) * 232, cy = 170 + Math.floor(i / 4) * 230;
    let bars = ""; for (let b = 0; b < 5; b++) bars += `<div style="display:inline-block;width:20px;margin-right:9px;background:var(--ac);height:${20 + Math.floor(r() * 70)}px;vertical-align:bottom"></div>`;
    PN(k, { x: cx, y: cy, w: 210, h: 200, bd: "3px solid var(--fg)", r: 8, rot: (i % 3 - 1) * 2, t: LS("pain2") + .1 + i * .06, html: `<div class="f-mono" style="font:700 18px 'JetBrains Mono';padding:12px">dash_${i + 1}</div><div style="padding:0 16px;height:110px;display:flex;align-items:flex-end">${bars}</div>` }); }
  ST(k, "tab 12 of 12", { x: 900, y: 790, r: 3, t: W("pain2", "dashboards") + .2, size: 30 });
});
S("zero", W("pain2", "zero"), "paper", 2, k => {
  L(k, "0", { x: 70, y: 110, size: 860, t: W("pain2", "zero") });
  L(k, "SLEEP", { x: 560, y: 330, size: 330, fit: 1000, t: W("pain2", "sleep") });
  EM(k, "😵‍💫", { x: 1500, y: 200, s: 280, t: W("pain2", "sleep") + .1, wob: 4 });
  SC(k, { x: 30, y: 130, w: 520, h: 800, t: W("pain2", "sleep") + .02, seed: 4 });
  AR(k, { p: [1420, 680, 640, 800], t: W("pain2", "sleep") + .15, label: "suspicious.", lx: 1050, ly: 700, ls: 70, bend: 0, bend2: -60 });
});
S("fire", LS("pain3"), "orange", 2, k => {
  L(k, "PROD IS", { x: 70, y: 150, size: 280, fit: 900, t: LS("pain3") });
  L(k, "ON FIRE.", { x: 70, y: 410, size: 420, fit: 1300, t: W("pain3", "on") });
  TO(k, { t: W("pain3", "on") + .05, icon: "🔔", title: "PAGER", msg: "prod is on fire. again.", x: 1200, y: 140, snd: "err", dur: 1.2 });
  EM(k, "🔥", { x: 1500, y: 470, s: 320, t: W("pain3", "fire") + .0, wob: 4 });
});
S("again", W("pain3", "again"), "ink", 2, k => {
  L(k, "AGAIN.", { x: 70, y: 150, size: 720, fit: 1760, t: W("pain3", "again") });
  PN(k, { x: 1300, y: 700, w: 470, h: 100, bg: "var(--fg)", c: "var(--bg)", html: `<div style="font:800 32px/100px 'JetBrains Mono';text-align:center">SNOOZE 5 MIN</div>`, t: W("pain3", "again") + .05 });
  CU(k, [{ x: 1000, y: 560, t: W("pain3", "again") + .1 }, { x: 1500, y: 745, t: W("pain3", "again") + .45, click: true }]);
  ST(k, "denied.", { x: 1640, y: 610, r: 6, t: W("pain3", "again") + .5, size: 36 });
});
S("riser", LE("pain3") + .05, "paper", 2, k => {
  cue("riser", k.t0);
  TY(k, { x: 80, y: 330, size: 58, text: "$ pip install sanity", t: k.t0, cps: 26 });
  TY(k, { x: 80, y: 470, size: 40, text: "ERROR: no matching distribution\nfound for sanity", t: k.t0 + .55, cps: 60, c: "#c26a00" });
}, { cut: "none" });
// ---- 03 THE DROP
S("slam", LS("drop1"), "orange", 3, k => {
  const tA = W("drop1", "amazon");
  const lg = box(k, { left: 660, top: 330 }, logoSVG("mono", 330)); st(lg, { transformOrigin: "50% 50%" });
  k.tl.fromTo(lg, { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: .14, ease: "expo.out" }, k.t0);
  k.tl.to(lg, { scale: .42, x: -560, y: -250, duration: .3, ease: "expo.inOut", immediateRender: false }, tA - .05);
  mono(k, "MEET", { x: 80, y: 150, size: 46, t: k.t0 + .05 });
  L(k, "AMAZON", { x: 70, y: 360, size: 560, fit: 1760, t: tA });
  ST(k, "yes, that Amazon.", { x: 1300, y: 200, r: -3, t: tA + .2, size: 30 });
  cue("boom", k.t0);
}, { cut: "none", flash: true });
S("bedrock", W("drop1", "bedrock"), "paper", 3, k => {
  L(k, "BEDROCK", { x: 70, y: 200, size: 520, fit: 1760, t: W("drop1", "bedrock") });
  IC(k, "aws:bedrock", { x: 80, y: 700, s: 170, t: W("drop1", "bedrock") + .12 });
  EM(k, "🪨", { x: 1560, y: 690, s: 180, t: W("drop1", "bedrock") + .2, r: 10 });
});
S("agentcore", W("drop1", "agentcore"), "ink", 3, k => {
  L(k, "AGENTCORE", { x: 70, y: 200, size: 470, fit: 1760, c: "var(--ac)", t: W("drop1", "agentcore") });
  IC(k, "aws:agentcore", { x: 80, y: 690, s: 190, t: W("drop1", "agentcore") + .12 });
  mono(k, "// amazon bedrock agentcore", { x: 310, y: 770, size: 34, c: "var(--dim)", t: W("drop1", "agentcore") + .2 });
});
S("main", LS("drop2"), "paper", 3, k => {
  mono(k, "// MAIN CHARACTER:", { x: 80, y: 160, size: 44, t: LS("drop2") });
  L(k, "MAIN CHARACTER:", { x: 70, y: 260, size: 420, fit: 1760, t: W("drop2", "main") });
  EM(k, "⭐", { x: 1500, y: 600, s: 220, t: W("drop2", "character") + .1, wob: 5 });
  ST(k, "protagonist energy", { x: 80, y: 700, r: -3, t: W("drop2", "character") + .2, size: 34 });
});
S("harness", W("drop2", "harness"), "orange", 3, k => {
  L(k, "the", { f: "serif", x: 80, y: 130, size: 190, t: W("drop2", "the") });
  L(k, "HARNESS", { x: 60, y: 270, size: 560, fit: 1760, t: W("drop2", "harness") });
  IC(k, "aws:agentcore", { x: 1560, y: 100, s: 190, t: W("drop2", "harness") + .1 });
  ST(k, "harness GA · 18 JUN 2026", { x: 80, y: 800, r: -2, t: W("drop2", "harness") + .3, size: 32 });
});
// ---- 04 ANALOGY
S("rest", LS("an1"), "paper", 4, k => {
  L(k, "think", { f: "serif", x: 80, y: 160, size: 210, t: LS("an1") });
  L(k, "RESTAURANT.", { x: 70, y: 350, size: 420, fit: 1720, t: W("an1", "restaurant") });
  EM(k, "🍽️", { x: 1560, y: 130, s: 250, t: W("an1", "restaurant") + .1, r: 8, wob: 3 });
  ST(k, "table for 1 agent", { x: 80, y: 780, r: 3, t: W("an1", "restaurant") + .3, size: 32 });
});
S("recipe", W("an1", "you"), "orange", 4, k => {
  L(k, "YOU BRING", { x: 70, y: 190, size: 260, fit: 800, t: W("an1", "you") });
  L(k, "THE RECIPE.", { x: 70, y: 470, size: 200, fit: 800, t: W("an1", "recipe") });
  const items = ["model", "tools", "skills", "instructions"];
  PN(k, { x: 960, y: 170, w: 840, h: 620, bg: "var(--ac)", bd: "4px dashed var(--fg)", rot: -3, t: W("an1", "recipe") - .1,
    html: `<div class="f-serif" style="font-size:96px;padding:30px 44px 0">Recipe</div><div class="f-mono" style="font:700 38px/1.9 'JetBrains Mono';padding:10px 54px">${items.map(x => "▢ " + x).join("<br>")}</div>` });
  ST(k, "grandma approved", { x: 80, y: 760, r: -4, t: W("an1", "recipe") + .3, size: 32 });
});
S("config", W("an1", "thats"), "ink", 4, k => {
  L(k, "THAT'S YOUR", { x: 70, y: 190, size: 200, fit: 650, t: W("an1", "thats") });
  L(k, "CONFIG.", { x: 70, y: 430, size: 300, fit: 650, c: "var(--ac)", t: W("an1", "config") });
  PN(k, { x: 780, y: 160, w: 1040, h: 620, bg: "#151517", bd: "3px solid var(--fg)", t: W("an1", "thats"), wipe: true,
    html: `<div class="f-mono" style="font:700 24px 'JetBrains Mono';color:#7d786f;padding:14px 26px;border-bottom:2px solid #333">config.yaml</div>` });
  TY(k, { x: 810, y: 250, size: 32, c: "#EEE8DD", text: "# recipe = config\nmodel: …\ntools: …\nskills: …\ninstructions: …", t: W("an1", "thats") + .15, cps: 46 });
  CU(k, [{ x: 1500, y: 700, t: W("an1", "config") - .1 }, { x: 900, y: 205, t: W("an1", "config") + .3, click: true }]);
});
S("awsrun", LS("an2"), "paper", 4, k => {
  const lg = box(k, { left: 80, top: 170 }, logoSVG("default", 230)); FADE(k, lg, LS("an2"), .2);
  L(k, "RUNS", { x: 70, y: 450, size: 470, fit: 900, t: W("an2", "runs") });
  IC(k, "l:chef-hat", { x: 1250, y: 170, s: 480, sw: 1.2, t: W("an2", "runs") + .1 });
});
S("kitchen", W("an2", "entire"), "ink", 4, k => {
  L(k, "the entire", { f: "serif", x: 80, y: 150, size: 170, t: W("an2", "entire") });
  L(k, "KITCHEN.", { x: 70, y: 320, size: 430, fit: 1150, c: "var(--ac)", t: W("an2", "kitchen") });
  ["environment", "compute", "memory", "identity", "networking", "observability"].forEach((x, i) =>
    PN(k, { x: 1330, y: 150 + i * 92, w: 490, h: 72, bd: "3px solid var(--fg)", r: 40, t: W("an2", "kitchen") + .08 + i * .07, html: `<div class="f-mono" style="font:700 30px/66px 'JetBrains Mono';text-align:center">${x}</div>` }));
  ST(k, "dishes: not your problem", { x: 80, y: 790, r: -3, t: W("an2", "kitchen") + .3, size: 32 });
});
// ---- 05 HOW IT WORKS
const CODE = [["c-c", "# simplified for the screen"], ["", `<span class="c-k">harness:</span> my-agent`], ["", `<span class="c-k">model:</span>        <span class="c-s">bedrock/claude-sonnet-4-6</span>`],
  ["", `<span class="c-k">tools:</span>        [<span class="c-n">browser, code_interpreter, gateway</span>]`], ["", `<span class="c-k">skills:</span>       [<span class="c-n">awsSkills</span>]`], ["", `<span class="c-k">instructions:</span> <span class="c-s">"You are a research agent."</span>`]];
const codeShot = (k, marks) => {
  PN(k, { x: 80, y: 150, w: 1180, h: 500, bg: "#151517", bd: "3px solid var(--fg)", snd: false, t: k.t0, wipe: true, html: "" });
  CODE.forEach((c, i) => { const y = 190 + i * 72;
    const hl = box(k, { left: 92, top: y - 8, width: 1156, height: 60, background: "var(--ac)", opacity: 0 });
    const m = marks.find(q => q.line === i); if (m) { k.tl.fromTo(hl, { opacity: 0 }, { opacity: .3, duration: .1 }, m.t); k.tl.to(hl, { opacity: 0, duration: .1, immediateRender: false }, m.t2); }
    const d = box(k, { left: 118, top: y }, c[0] ? `<span class="${c[0]}">${c[1]}</span>` : c[1], "code"); st(d, { fontSize: 28 }); FADE(k, d, k.t0 + .05 + i * .04, .12); });
};
S("how1a", LS("how1"), "ink", 5, k => {
  codeShot(k, [{ line: 2, t: W("how1", "model"), t2: W("how1", "tools") }, { line: 3, t: W("how1", "tools"), t2: W("how1", "skills") }]);
  L(k, "MODEL", { x: 1300, y: 170, size: 250, fit: 520, t: W("how1", "model") });
  L(k, "TOOLS", { x: 1300, y: 400, size: 250, fit: 520, c: "var(--ac)", t: W("how1", "tools") });
  mono(k, "// a config is…", { x: 90, y: 720, size: 40, c: "var(--dim)", t: LS("how1") });
});
S("how1b", W("how1", "skills"), "paper", 5, k => {
  codeShot(k, [{ line: 4, t: W("how1", "skills"), t2: W("how1", "instructions") }, { line: 5, t: W("how1", "instructions"), t2: LE("how1") + .2 }]);
  L(k, "SKILLS", { x: 1300, y: 170, size: 250, fit: 520, t: W("how1", "skills") });
  L(k, "INSTRUCTIONS", { x: 1300, y: 400, size: 250, fit: 520, c: "var(--ac)", t: W("how1", "instructions") });
  ST(k, "config, not code", { x: 90, y: 720, r: -3, t: W("how1", "instructions") + .2, size: 34 });
});
S("two", LS("how2"), "orange", 5, k => {
  L(k, "2", { x: 70, y: 110, size: 900, t: LS("how2") });
  L(k, "API", { x: 620, y: 200, size: 340, t: W("how2", "api") });
  L(k, "CALLS", { x: 620, y: 500, size: 340, fit: 1100, t: W("how2", "calls") });
  SC(k, { x: 20, y: 140, w: 560, h: 830, t: W("how2", "calls") + .1, seed: 9 });
  AR(k, { p: [1500, 220, 1220, 340], t: W("how2", "calls") + .3, label: "yes, two.", lx: 1400, ly: 130, ls: 78, c: "var(--fg)", bend: 40, bend2: 40 });
});
const term = (k, o) => { PN(k, { x: 80, y: 530, w: 1760, h: o.h || 300, bg: o.bg, bd: "3px solid var(--fg)", t: o.t, wipe: true, html: "" });
  TY(k, { x: 116, y: 560, size: 30, c: o.fg, text: o.text, t: o.t + .1, cps: o.cps || 95 }); };
S("create", W("how2", "createharness"), "ink", 5, k => {
  mono(k, "01", { x: 80, y: 130, size: 50, c: "var(--ac)", t: k.t0 });
  L(k, "CREATEHARNESS", { x: 70, y: 200, size: 300, fit: 1740, t: k.t0 + .03 });
  term(k, { t: k.t0 + .12, bg: "#151517", fg: "#EEE8DD", text: `$ aws bedrock-agentcore-control create-harness \\\n    --harness-name "MyHarness" \\\n    --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole"` });
  ST(k, "from the official docs", { x: 1380, y: 490, r: 3, t: k.t0 + .5, size: 26 });
});
S("invoke", W("how2", "invokeharness"), "paper", 5, k => {
  mono(k, "02", { x: 80, y: 130, size: 50, c: "#c26a00", t: k.t0 });
  L(k, "INVOKEHARNESS", { x: 70, y: 200, size: 300, fit: 1740, t: k.t0 + .03 });
  term(k, { t: k.t0 + .12, bg: "#0B0B0C", fg: "#EEE8DD", h: 340, text: `response = client.invoke_harness(\n    harnessArn=HARNESS_ARN,\n    runtimeSessionId=SESSION_ID,\n    messages=[{"role": "user", "content": [{"text": "hi"}]}],\n)`, cps: 80 });
  ST(k, "boto3 · bedrock-agentcore", { x: 1250, y: 490, r: 3, t: k.t0 + .5, size: 26 });
});
S("thatsit", W("how2", "thats"), "orange", 5, k => {
  L(k, "THAT'S IT.", { x: 70, y: 260, size: 560, fit: 1760, t: W("how2", "thats") });
  EM(k, "🎤", { x: 1500, y: 640, s: 210, t: W("how2", "it") + .05, r: 12 });
  ST(k, "no, really.", { x: 80, y: 700, r: -4, t: W("how2", "it") + .1, size: 38 });
});
// ---- 06 BUILT-INS
S("bi0", LS("b1"), "paper", 6, k => {
  L(k, "BUILT IN:", { x: 70, y: 230, size: 560, fit: 1760, t: LS("b1") });
  ST(k, "batteries included", { x: 90, y: 760, r: -4, t: LS("b1") + .2, size: 36 });
  EM(k, "🔋", { x: 1560, y: 660, s: 200, t: LS("b1") + .25, r: 10 });
});
const tool = (k, icon, w1, w2, id, sub, o = {}) => { const t = k.t0;
  IC(k, icon, { x: 80, y: 170, s: 400, sw: 1.3, t });
  L(k, w1, { x: 560, y: 190, size: w2 ? 300 : (o.s1 ?? 420), fit: 1260, t: t + .03 });
  if (w2) L(k, w2, { x: 560, y: 190 + 285, size: 300, fit: 1260, t: t + .1 });
  const sy = o.sy ?? (w2 ? 790 : 700);
  mono(k, "// " + sub, { x: 560, y: sy, size: 32, c: "var(--ac)", t: t + .2 }); if (id) mono(k, id, { x: 560, y: sy + 46, size: 30, c: "var(--dim)", t: t + .25 });
};
S("browser", W("b1", "browser"), "ink", 6, k => { tool(k, "l:globe", "BROWSER", null, "agentcore_browser", "tool 1/4"); ST(k, "no chromedriver hell", { x: 1250, y: 700, r: 4, t: k.t0 + .3, size: 30 }); });
S("codei", W("b1", "code"), "paper", 6, k => { tool(k, "l:square-code", "CODE", "INTERPRETER", "agentcore_code_interpreter", "tool 2/4"); ST(k, "sandboxed python + node", { x: 1250, y: 800, r: -3, t: k.t0 + .3, size: 30 }); });
S("shell", W("b1", "shell"), "orange", 6, k => { tool(k, "l:square-terminal", "SHELL", null, null, "tool 3/4", { sy: 815, s1: 380 });
  PN(k, { x: 560, y: 580, w: 1150, h: 190, bg: "#0B0B0C", bd: "3px solid var(--fg)", t: k.t0 + .2, wipe: true, html: "" });
  TY(k, { x: 590, y: 605, size: 32, c: "#EEE8DD", text: "$ ls -la\nagent.py  notes.md  out/", t: k.t0 + .3, cps: 40 }); });
S("fs", W("b1", "file"), "ink", 6, k => { tool(k, "l:folder-open", "FILE", "SYSTEM", "file_operations", "tool 4/4"); ST(k, "files persist", { x: 1250, y: 800, r: 3, t: k.t0 + .3, size: 32 }); });
S("gw", LS("b2"), "paper", 6, k => {
  L(k, "GATEWAY", { x: 70, y: 140, size: 250, fit: 900, t: W("b2", "gateway") });
  const nd = (x, y, w, h, txt, t, inv) => PN(k, { x, y, w, h, bg: inv ? "var(--fg)" : "var(--bg)", c: inv ? "var(--bg)" : "var(--fg)", bd: "3px solid var(--fg)", t, r: 10, html: `<div style="font:800 32px/${h}px 'JetBrains Mono';text-align:center">${txt}</div>` });
  nd(100, 500, 300, 140, "AGENT", W("b2", "gateway") + .05, false);
  nd(700, 470, 420, 200, "GATEWAY", W("b2", "plugs"), true);
  const outs = ["OpenAPI", "Smithy", "Lambda", "MCP servers"];
  outs.forEach((o, i) => { nd(1420, 300 + i * 130, 400, 100, o, W("b2", i < 2 ? "apis" : "mcp") + .05 + (i % 2) * .08, false); });
  const ln = (x1, y1, x2, y2, t) => { const d = box(k, { left: 0, top: 0 }, `<svg width="1920" height="1080"><path d="M${x1} ${y1} L${x2} ${y2}" pathLength="1" stroke="var(--fg)" stroke-width="5" fill="none" style="stroke-dasharray:1 1"/></svg>`);
    k.tl.fromTo(d.querySelector("path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .25 }, t); };
  ln(400, 570, 700, 570, W("b2", "plugs")); outs.forEach((_, i) => ln(1120, 570, 1420, 350 + i * 130, W("b2", i < 2 ? "apis" : "mcp") + .1));
  ST(k, "one plug, many tools", { x: 90, y: 780, r: -3, t: W("b2", "mcp") + .2, size: 32 });
});
S("usb", LS("b2b"), "orange", 6, k => {
  L(k, "MCP", { x: 70, y: 130, size: 620, fit: 1000, t: W("b2b", "mcp") });
  L(k, "IS USB-C", { x: 70, y: 660, size: 240, fit: 1000, t: W("b2b", "usbc") - .2 });
  IC(k, "l:cable", { x: 1360, y: 130, s: 360, sw: 1.3, t: W("b2b", "usbc") });
  ST(k, "MCP = USB-C for AI tools", { x: 1000, y: 620, r: -5, t: W("b2b", "tools") - .3, size: 44 });
});
S("mem1", LS("b3"), "ink", 6, k => {
  IC(k, "l:brain", { x: 80, y: 170, s: 380, c: "var(--ac)", sw: 1.3, t: LS("b3") });
  L(k, "MEMORY", { x: 560, y: 190, size: 440, fit: 1260, t: W("b3", "memory") });
  ["prefers dark mode", "last session: 3 days ago", "name: Yuval"].forEach((x, i) => PN(k, { x: 560, y: 560 + i * 90, w: 640 + i * 30, h: 70, bd: "3px solid var(--fg)", r: 40, t: W("b3", "remembers") + i * .12, html: `<div style="font:700 30px/64px 'JetBrains Mono';text-align:center">${x}</div>` }));
  mono(k, "// short-term + long-term", { x: 1300, y: 600, size: 30, c: "var(--dim)", t: W("b3", "remembers") + .3 });
});
S("ex", W("b3", "unlike"), "paper", 6, k => {
  EM(k, "💔", { x: 80, y: 170, s: 480, t: W("b3", "unlike"), r: -6, wob: 3 });
  L(k, "unlike your", { f: "serif", x: 660, y: 190, size: 190, t: W("b3", "unlike") });
  L(k, "ex.", { f: "serif", x: 660, y: 340, size: 600, c: "var(--ac)", t: W("b3", "ex") });
  SC(k, { x: 630, y: 360, w: 620, h: 470, t: W("b3", "ex") + .25, c: "var(--fg)" });
  TO(k, { t: W("b3", "ex") + .3, icon: "💬", title: "ex", msg: "we need to talk (read 2019)", x: 1240, y: 640, w: 590 });
});
S("anymodel", LS("b4"), "orange", 6, k => {
  L(k, "ANY MODEL.", { x: 70, y: 140, size: 300, fit: 1700, t: LS("b4") });
  ["Anthropic Claude", "Amazon Nova", "Meta Llama", "DeepSeek", "Qwen", "Kimi", "MiniMax", "Cohere", "Mistral", "OpenAI", "Google Gemini", "LiteLLM"].forEach((x, i) =>
    PN(k, { x: 80 + (i % 4) * 440, y: 470 + Math.floor(i / 4) * 120, w: 410, h: 92, bd: "3px solid var(--fg)", r: 46, bg: i % 5 == 0 ? "var(--fg)" : "transparent", c: i % 5 == 0 ? "var(--bg)" : "var(--fg)", t: LS("b4") + .12 + i * .04, snd: i % 3 == 0,
      html: `<div style="font:800 28px/86px 'JetBrains Mono';text-align:center">${x}</div>` }));
});
S("switch", W("b4", "switch"), "ink", 6, k => {
  PN(k, { x: 80, y: 150, w: 1120, h: 690, bd: "3px solid var(--fg)", t: k.t0, wipe: true, html: "" });
  const badge = PN(k, { x: 880, y: 170, w: 300, h: 60, bd: "3px solid var(--fg)", r: 30, t: k.t0 + .1, snd: false, html: `<div style="font:800 26px/54px 'JetBrains Mono';text-align:center" id="b_${k.id}">MODEL A ▾</div>` });
  const badge2 = PN(k, { x: 880, y: 170, w: 300, h: 60, bg: "var(--ac)", c: "#0B0B0C", bd: "3px solid var(--fg)", r: 30, snd: false, html: `<div style="font:800 26px/54px 'JetBrains Mono';text-align:center">MODEL B ▾</div>` });
  k.tl.fromTo(badge2, { opacity: 0 }, { opacity: 1, duration: .05 }, W("b4", "switch") + .55);
  const msg = (y, t, txt, me) => PN(k, { x: me ? 560 : 110, y, w: 600, h: 90, bg: me ? "var(--fg)" : "transparent", c: me ? "var(--bg)" : "var(--fg)", bd: "3px solid var(--fg)", r: 18, t, snd: false, html: `<div style="font:600 27px/86px 'JetBrains Mono';padding:0 22px">${txt}</div>` });
  msg(270, k.t0 + .2, "Plan a 5-day Tokyo trip", true); msg(390, k.t0 + .35, "Day 1: Asakusa, then…", false);
  msg(540, W("b4", "switch") + .7, "Add a day trip to Kyoto", true); msg(660, W("b4", "keep") + .05, "Sure — day 6: Kyoto ✓", false);
  CU(k, [{ x: 1400, y: 560, t: W("b4", "switch") - .05 }, { x: 1040, y: 205, t: W("b4", "switch") + .5, click: true }]);
  L(k, "SWITCH", { x: 1290, y: 190, size: 260, fit: 560, t: W("b4", "switch") });
  L(k, "MID-SESSION", { x: 1290, y: 400, size: 100, fit: 560, c: "var(--ac)", t: W("b4", "mid") });
  ST(k, "context kept ✓", { x: 1240, y: 640, r: 4, t: W("b4", "context"), size: 34 });
});
S("cli", LS("b5"), "paper", 6, k => {
  L(k, "DEPLOY FROM THE CLI.", { x: 70, y: 150, size: 300, fit: 1720, t: LS("b5") });
  PN(k, { x: 80, y: 470, w: 1300, h: 340, bg: "#0B0B0C", bd: "3px solid var(--fg)", t: W("b5", "cli"), wipe: true, html: "" });
  TY(k, { x: 116, y: 505, size: 38, c: "#EEE8DD", text: "$ agentcore deploy\n⠿ creating harness…\n✔ deployed", t: W("b5", "cli") + .1, cps: 22 });
  ST(k, "npm i -g @aws/agentcore", { x: 1080, y: 800, r: 3, t: W("b5", "cli") + .6, size: 28 });
});
S("grass", W("b5", "now"), "orange", 6, k => {
  L(k, "NOW GO", { x: 70, y: 150, size: 300, fit: 1300, t: W("b5", "now") });
  L(k, "TOUCH GRASS.", { x: 70, y: 430, size: 420, fit: 1700, t: W("b5", "touch") });
  EM(k, "🌱", { x: 1460, y: 150, s: 260, t: W("b5", "grass") + .1, wob: 4 });
  ST(k, "log off. seriously.", { x: 80, y: 790, r: -3, t: W("b5", "grass") + .25, size: 34 });
});

// ================= PAGES 7-14 =================
S("p0a", LS("p0"), "ink", 7, k => {
  L(k, "NOW THE PART", { x: 70, y: 160, size: 250, fit: 1720, t: W("p0", "now") });
  L(k, "THAT MAKES", { x: 70, y: 390, size: 250, fit: 1720, t: W("p0", "that") });
  L(k, "OTHER SETUPS", { x: 70, y: 620, size: 250, fit: 1720, c: "var(--ac)", t: W("p0", "other") });
}, { cut: "whoosh" });
S("p0b", W("p0", "sweat"), "orange", 7, k => {
  L(k, "SWEAT.", { x: 70, y: 200, size: 760, fit: 1500, t: W("p0", "sweat") });
  EM(k, "😅", { x: 1450, y: 170, s: 280, t: W("p0", "sweat") + .05, wob: 4 }); EM(k, "💦", { x: 1580, y: 480, s: 200, t: W("p0", "sweat") + .15, wob: 6 });
  ST(k, "other setups", { x: 80, y: 800, r: -3, t: W("p0", "sweat") + .2, size: 34 });
});
// ---- 08 SCALE
S("n01", LS("p1a"), "orange", 8, k => {
  mono(k, "// PILLAR 1 OF 3", { x: 80, y: 130, size: 36, t: LS("p1a") });
  L(k, "01", { x: 60, y: 170, size: 680, t: W("p1a", "one") });
  L(k, "SCALE", { x: 880, y: 300, size: 430, fit: 940, t: W("p1a", "scale") });
  IC(k, "l:layers", { x: 1500, y: 720, s: 200, t: W("p1a", "scale") + .1 });
}, { cut: "whoosh" });
S("hostel", W("p1a", "hostel"), "paper", 8, k => {
  PN(k, { x: 80, y: 150, w: 900, h: 660, bd: "6px dashed var(--fg)", t: k.t0, wipe: true, html: `<div class="f-mono" style="font:800 30px 'JetBrains Mono';padding:14px 22px">ONE BOX</div>` });
  const r = rnd(21); for (let i = 0; i < 32; i++) { const e = EM(k, "🧍", { x: 110 + (i % 8) * 105 + r() * 20, y: 230 + Math.floor(i / 8) * 130 + r() * 20, s: 96, t: k.t0 + .1 + i * .035, snd: false }); WOB.push({ el: e, ph: i, amp: 3 }); }
  L(k, "HOSTEL", { x: 1030, y: 170, size: 400, fit: 780, t: W("p1a", "hostel") });
  ST(k, "shared everything", { x: 1030, y: 470, r: 4, t: W("p1a", "crams"), size: 32 });
  ST(k, "one box.", { x: 1180, y: 620, r: -5, t: W("p1a", "box"), size: 44 });
});
S("hotel", LS("p1b"), "ink", 8, k => {
  L(k, "HOTEL", { x: 70, y: 130, size: 360, fit: 900, t: W("p1b", "hotel") });
  mono(k, "1 session = 1 private room", { x: 960, y: 190, size: 36, c: "var(--ac)", t: W("p1b", "guest") });
  for (let i = 0; i < 12; i++) { const x = 80 + (i % 6) * 292, y = 470 + Math.floor(i / 6) * 200;
    PN(k, { x, y, w: 270, h: 175, bd: "3px solid var(--fg)", r: 6, t: LS("p1b") + .15 + i * .05, snd: i < 3, html: `<div class="f-mono" style="font:700 22px 'JetBrains Mono';padding:10px 14px;color:var(--dim)">ROOM ${101 + i}</div>` });
    const lk = IC(k, "l:lock", { x: x + 100, y: y + 60, s: 80, c: "var(--ac)", sw: 2, t: W("p1b", "locked") + i * .05, pop: false }); if (i < 4) cue("lock", W("p1b", "locked") + i * .05, .7); }
});
S("sess", LS("p1c"), "paper", 8, k => {
  L(k, "ONE SESSION", { x: 70, y: 150, size: 380, fit: 1720, t: W("p1c", "one") });
  PN(k, { x: 80, y: 520, w: 760, h: 300, bd: "4px solid var(--fg)", r: 8, t: W("p1c", "session"), html: `<div class="f-mono" style="font:700 26px 'JetBrains Mono';padding:16px 22px">session_id: 7f3a…</div>` });
  EM(k, "🧑‍💻", { x: 340, y: 590, s: 170, t: W("p1c", "session") + .15, wob: 3 });
  ST(k, "= one private room", { x: 930, y: 640, r: 3, t: W("p1c", "session") + .25, size: 40 });
});
S("mvm", W("p1c", "microvm"), "orange", 8, k => {
  L(k, "ONE", { f: "serif", x: 80, y: 120, size: 170, t: W("p1c", "one", 2) });
  L(k, "MICROVM", { x: 60, y: 300, size: 520, fit: 1760, t: W("p1c", "microvm") });
  IC(k, "l:server", { x: 1600, y: 110, s: 170, sw: 1.6, t: W("p1c", "microvm") + .15 });
  ST(k, "Firecracker microVM", { x: 80, y: 810, r: -3, t: W("p1c", "microvm") + .25, size: 34 });
});
S("eight", W("p1c", "up"), "ink", 8, k => {
  IC(k, "l:clock", { x: 80, y: 170, s: 420, c: "var(--ac)", sw: 1.3, t: W("p1c", "eight") - .1 });
  L(k, "8 H", { x: 600, y: 130, size: 720, fit: 1200, t: W("p1c", "eight") });
  mono(k, "// max session lifetime · default 28800 s", { x: 600, y: 760, size: 32, c: "var(--dim)", t: W("p1c", "hours") });
  ST(k, "up to", { x: 1450, y: 170, r: 6, t: W("p1c", "up"), size: 40 });
});
S("ten", LS("p1d"), "paper", 8, k => {
  CN(k, { x: 70, y: 100, size: 500, from: 10, to: 5000, t: LS("p1d") + .05, dur: W("p1d", "thousand") - LS("p1d") });
  L(k, "concurrent sessions", { f: "serif", x: 80, y: 640, size: 100, t: LS("p1d") + .1 });
  const sq = []; for (let i = 0; i < 100; i++) sq.push(box(k, { left: 80 + (i % 25) * 70, top: 760 + Math.floor(i / 25) * 22, width: 56, height: 14, background: "var(--fg)" }));
  k.tl.fromTo(sq, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: (W("p1d", "thousand") - LS("p1d")) / 110, duration: .12 }, LS("p1d") + .05);
  mono(k, "// default quota: active session workloads · us-east-1 / us-west-2 · adjustable", { x: 80, y: 880 - 30, size: 21, c: "var(--dim)", t: W("p1d", "thousand") });
  ST(k, "10 → 5,000", { x: 1350, y: 620, r: 4, t: W("p1d", "sessions"), size: 40 });
});
S("zeroserv", W("p1d", "zero"), "orange", 8, k => {
  L(k, "0", { x: 70, y: 110, size: 820, t: W("p1d", "zero") });
  L(k, "SERVERS", { x: 560, y: 250, size: 330, fit: 1250, t: W("p1d", "servers") });
  mono(k, "// for you to run", { x: 570, y: 610, size: 44, t: W("p1d", "run") });
  ST(k, "scales on demand", { x: 570, y: 720, r: -4, t: W("p1d", "run") + .1, size: 44 });
  EM(k, "😌", { x: 1560, y: 150, s: 220, t: W("p1d", "servers") + .1, wob: 3 });
});
// ---- 09 SECURITY
S("n02", LS("p2a"), "ink", 9, k => {
  mono(k, "// PILLAR 2 OF 3", { x: 80, y: 130, size: 36, t: LS("p2a") });
  L(k, "02", { x: 60, y: 170, size: 680, t: W("p2a", "two") });
  L(k, "SECURITY", { x: 800, y: 300, size: 330, fit: 1040, c: "var(--ac)", t: W("p2a", "security") });
  IC(k, "l:shield-check", { x: 1450, y: 560, s: 260, c: "var(--fg)", t: W("p2a", "security") + .1 });
}, { cut: "whoosh" });
S("whenend", W("p2a", "when"), "paper", 9, k => {
  L(k, "WHEN A SESSION", { x: 70, y: 150, size: 220, fit: 1720, t: W("p2a", "when") });
  L(k, "ENDS,", { x: 70, y: 380, size: 430, fit: 1000, t: W("p2a", "ends") });
  IC(k, "l:timer", { x: 1300, y: 430, s: 360, t: W("p2a", "ends") + .1 });
  ST(k, "session over.", { x: 700, y: 700, r: -3, t: W("p2a", "ends") + .25, size: 34 });
});
S("shatter", W("p2a", "microvm"), "orange", 9, k => {
  const tt = W("p2a", "terminated"), r = rnd(31), sqs = [];
  for (let i = 0; i < 18; i++) { const x = 520 + (i % 6) * 140, y = 470 + Math.floor(i / 6) * 140;
    const q = box(k, { left: x, top: y, width: 132, height: 132, background: "var(--fg)", border: "3px solid var(--bg)" });
    k.tl.fromTo(q, { scale: 0 }, { scale: 1, duration: .25, ease: "back.out(2)" }, k.t0 + .03 * i);
    const ang = Math.atan2(y - 540, x - 960) + (r() - .5) * .8, d = 500 + r() * 800;
    k.tl.to(q, { x: Math.cos(ang) * d, y: Math.sin(ang) * d + 250, rotation: (r() - .5) * 720, opacity: 0, duration: .7, ease: "power2.in", immediateRender: false }, tt); }
  const lab = box(k, { left: 520, top: 585 }, `<div class="f-mono" style="font:800 46px 'JetBrains Mono';color:var(--bg);width:830px;text-align:center">microVM</div>`);
  k.tl.fromTo(lab, { opacity: 0 }, { opacity: 1, duration: .1 }, k.t0 + .3); k.tl.to(lab, { opacity: 0, duration: .05, immediateRender: false }, tt);
  L(k, "TERMINATED.", { x: 70, y: 150, size: 300, fit: 1720, t: tt });
  cue("crash", tt);
});
S("wipe", W("p2a", "and"), "ink", 9, k => {
  L(k, "MEMORY", { x: 70, y: 150, size: 300, fit: 900, t: W("p2a", "memory") });
  L(k, "WIPED.", { x: 70, y: 400, size: 400, fit: 1100, c: "var(--ac)", t: W("p2a", "wiped") - .1 });
  const t0 = W("p2a", "memory"), t1 = LE("p2a") + .1, cells = [];
  for (let i = 0; i < 48; i++) { const cx = 80 + (i % 16) * 108, cy = 700 + Math.floor(i / 16) * 62;
    const c = box(k, { left: cx, top: cy, width: 92, height: 46, background: "var(--fg)" }); FADE(k, c, k.t0 + .01 * i, .1);
    k.tl.to(c, { opacity: 0, scale: .2, duration: .12, immediateRender: false }, t0 + .25 + (cx / 1800) * (t1 - t0 - .3)); }
  const b = EM(k, "🧹", { x: -220, y: 640, s: 230, t: k.t0, snd: false }); k.tl.to(b, { x: 2150, duration: t1 - t0 - .3, ease: "none", immediateRender: false }, t0 + .25); cue("sweep", t0 + .25);
  mono(k, "// memory sanitized", { x: 1150, y: 480, size: 34, c: "var(--dim)", t: W("p2a", "wiped") });
});
S("vault", LS("p2b"), "paper", 9, k => {
  L(k, "API KEYS", { x: 70, y: 150, size: 400, fit: 1500, t: W("p2b", "api") });
  const key = IC(k, "l:key-round", { x: 100, y: 620, s: 200, sw: 1.6, t: LS("p2b") + .1 });
  k.tl.to(key, { x: 1000, duration: .55, ease: "power3.inOut", immediateRender: false }, W("p2b", "sit") - .2);
  IC(k, "l:vault", { x: 1250, y: 470, s: 380, c: "var(--fg)", sw: 1.3, t: W("p2b", "sit") - .1 }); cue("lock", W("p2b", "vault"));
  ST(k, "AgentCore Identity token vault", { x: 80, y: 830 - 40, r: -2, t: W("p2b", "vault") + .1, size: 30 });
});
S("never", W("p2b", "the"), "ink", 9, k => {
  EM(k, "🙈", { x: 80, y: 170, s: 430, t: W("p2b", "the"), wob: 3 });
  L(k, "NEVER", { x: 640, y: 150, size: 480, fit: 1150, c: "var(--ac)", t: W("p2b", "never") });
  L(k, "SEES THEM.", { x: 640, y: 560, size: 180, fit: 1150, t: W("p2b", "sees") });
  PN(k, { x: 640, y: 780, w: 800, h: 80, bd: "3px solid var(--fg)", t: W("p2b", "sees") + .15, html: `<div style="font:700 32px/74px 'JetBrains Mono';padding:0 24px">API_KEY = ████████████</div>` });
});
// ---- 10 OBSERVABILITY
S("n03", LS("p3a"), "orange", 10, k => {
  mono(k, "// PILLAR 3 OF 3", { x: 80, y: 130, size: 36, t: LS("p3a") });
  L(k, "03", { x: 60, y: 170, size: 480, t: W("p3a", "three") });
  L(k, "OBSERVABILITY", { x: 60, y: 660, size: 230, fit: 1780, t: W("p3a", "observability") });
  IC(k, "l:eye-off", { x: 1500, y: 200, s: 260, t: W("p3a", "observability") + .1 });
}, { cut: "whoosh" });
S("bbox", W("p3a", "think"), "ink", 10, k => {
  PN(k, { x: 100, y: 260, w: 780, h: 480, bg: "var(--ac)", c: "#0B0B0C", bd: "4px solid var(--fg)", r: 22, t: k.t0, html: `<div style="font:800 34px 'JetBrains Mono';padding:26px 34px;letter-spacing:.06em">FLIGHT RECORDER</div>` });
  const bars = []; for (let i = 0; i < 44; i++) bars.push(box(k, { left: 140 + i * 16.5, top: 500, width: 10, height: 10, background: "#0B0B0C" }));
  const rec = box(k, { left: 640, top: 290 }, `<span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:#0B0B0C;margin-right:12px;vertical-align:-3px"></span><span style="font:800 34px 'JetBrains Mono'">REC</span>`); rec.style.color = "#0B0B0C";
  LIVE.push(t => { if (t < k.t0 || t > k.t1) return; bars.forEach((b, i) => { const h = 20 + 190 * Math.abs(Math.sin(t * 5 + i * .55) * Math.sin(t * 2.3 + i * .21)); b.style.height = h + "px"; b.style.top = (500 - h / 2 + 60) + "px"; }); rec.style.opacity = (Math.floor(t * 2.4) % 2) ? .25 : 1; });
  L(k, "BLACK", { x: 960, y: 220, size: 340, fit: 880, t: W("p3a", "flight") });
  L(k, "BOX.", { x: 960, y: 520, size: 340, fit: 880, c: "var(--ac)", t: W("p3a", "black") });
  ST(k, "every step. recorded.", { x: 100, y: 800, r: -3, t: W("p3a", "box") - .1, size: 32 });
});
S("wf", LS("p3b"), "paper", 10, k => {
  const row = (label, y, tt, bars, hh, bg) => { L(k, label, { x: 80, y: y + 20, size: 66, fit: 250, t: tt });
    bars.forEach((b, i) => PN(k, { x: 360 + b[0], y: y + (110 - hh) / 2, w: b[1], h: hh, bg, bd: "3px solid var(--fg)", t: tt + .06 * i, wipe: true, snd: i === 0, html: "" })); };
  row("SESSION", 200, W("p3b", "session"), [[0, 1400]], 110, "var(--fg)");
  row("TRACE", 380, W("p3b", "trace"), [[0, 440], [470, 520], [1020, 380]], 110, "var(--ac)");
  row("STEP", 560, W("p3b", "step"), [[0, 130], [150, 240], [400, 70], [490, 180], [690, 150], [860, 220], [1100, 110], [1230, 170]], 90, "var(--bg)");
  mono(k, "// session → trace → step", { x: 360, y: 150, size: 30, c: "var(--dim)", t: LS("p3b") });
  ST(k, "traced automatically", { x: 1200, y: 740, r: 3, t: W("p3b", "step") + .3, size: 34 });
});
S("moves", W("p3b", "every"), "ink", 10, k => {
  L(k, "EVERY MOVE", { x: 70, y: 140, size: 350, fit: 1740, t: W("p3b", "every") });
  L(k, "RECORDED.", { x: 70, y: 480, size: 290, fit: 1740, c: "var(--ac)", t: W("p3b", "recorded") });
  ["model call", "tool call", "memory op", "shell command"].forEach((x, i) => PN(k, { x: 80 + i * 440, y: 800 - 30, w: 410, h: 80, bd: "3px solid var(--fg)", r: 40, t: W("p3b", "move") + .1 + i * .1, html: `<div style="font:700 28px/74px 'JetBrains Mono';text-align:center">${x}</div>` }));
});
S("vs", LS("p3c"), "orange", 10, k => {
  L(k, "VS.", { x: 60, y: 90, size: 1000, fit: 1700, t: LS("p3c") });
  L(k, "versus you,", { f: "serif", x: 1220, y: 300, size: 130, t: W("p3c", "you") });
}, { cut: "whoosh" });
S("3am", W("p3c", "3am"), "ink", 10, k => {
  L(k, "03:07", { x: 60, y: 150, size: 640, fit: 1450, c: "var(--ac)", t: W("p3c", "3am") });
  L(k, "AM", { x: 1200, y: 640, size: 220, t: W("p3c", "3am") + .1 });
  EM(k, "😴", { x: 1500, y: 170, s: 250, t: W("p3c", "3am") + .1, wob: 4 }); EM(k, "☕", { x: 1580, y: 520, s: 170, t: W("p3c", "3am") + .25, wob: 5 });
  mono(k, "// prod is down. it is 3AM.", { x: 80, y: 800, size: 36, c: "var(--dim)", t: W("p3c", "3am") + .2 });
});
S("tabs", W("p3c", "hopping"), "paper", 10, k => {
  const tabs = []; for (let i = 0; i < 9; i++) tabs.push(PN(k, { x: 80 + i * 196, y: 170, w: 186, h: 70, bd: "3px solid var(--fg)", r: 8, t: k.t0 + i * .03, snd: false, html: `<div style="font:700 21px/64px 'JetBrains Mono';text-align:center">log-group-${i + 1}</div>` }));
  PN(k, { x: 80, y: 250, w: 1760, h: 520, bd: "3px solid var(--fg)", t: k.t0, wipe: true, html: `<div class="f-mono" style="font:600 28px 'JetBrains Mono';padding:26px 34px;color:var(--dim)">loading logs…<br>filter: ERROR | no results<br>time range: last 15 min<br>where is the request id???</div>` });
  const r = rnd(77), order = []; let prev = 0; for (let i = 0; i < 14; i++) { let n; do n = Math.floor(r() * 9); while (n === prev); order.push(n); prev = n; }
  const hop = 1.7 / 13, pts = [{ x: 900, y: 500, t: k.t0 + .1 }];
  order.forEach((n, i) => { const tt = k.t0 + .25 + i * hop; pts.push({ x: 80 + n * 196 + 80, y: 200, t: tt, click: true });
    k.tl.set(tabs[n], { backgroundColor: "#FF9900" }, tt); if (i > 0) k.tl.set(tabs[order[i - 1]], { backgroundColor: "rgba(0,0,0,0)" }, tt); });
  CU(k, pts);
  ST(k, "9 tabs. no root cause.", { x: 1180, y: 800 - 30, r: 3, t: W("p3c", "groups") - .2, size: 32 });
  L(k, "03:07 AM", { f: "mono", x: 1500, y: 120, size: 1, t: 0 }); 
});
// ---- 11 PRICING
S("pr1a", LS("pr1"), "ink", 11, k => {
  L(k, "PRICING.", { x: 70, y: 210, size: 520, fit: 1760, t: LS("pr1") });
  EM(k, "💸", { x: 1560, y: 660, s: 200, t: LS("pr1") + .2, wob: 4 }); ST(k, "the part CFOs read", { x: 80, y: 800 - 30, r: -3, t: LS("pr1") + .25, size: 32 });
}, { cut: "whoosh" });
const SEG = [["b", .12], ["i", .16], ["b", .1], ["i", .2], ["b", .08], ["i", .22], ["b", .12]];   // busy / idle (waiting on model)
const bar = (k, y, showIdle, tag) => { let x = 0; const out = [];
  SEG.forEach(([ty, w], i) => { const W_ = w * 1760;
    const d = PN(k, { x: 80 + x, y, w: W_ - 6, h: 150, bg: ty === "b" ? "var(--ac)" : "transparent", bd: "3px solid var(--fg)", t: k.t0 + .05 * i, wipe: true, snd: false,
      html: (ty === "i" ? `<div style="position:absolute;inset:0;background:repeating-linear-gradient(135deg,var(--fg) 0 3px,transparent 3px 16px);opacity:.28"></div>` : "") + `<div class="f-mono" style="position:relative;font:800 24px/150px 'JetBrains Mono';text-align:center">${ty === "b" ? "CPU busy" : (showIdle ? "waiting on model" : "")}</div>` });
    out.push({ ty, x0: x, w: w }); x += W_; }); return out; };
S("pr1b", W("pr1", "you"), "paper", 11, k => {
  L(k, "ACTIVE CPU", { x: 70, y: 140, size: 300, fit: 1200, t: W("pr1", "active") });
  bar(k, 520, false); mono(k, "// you pay for the busy bits", { x: 80, y: 720, size: 40, t: W("pr1", "cpu") });
  ST(k, "per-second billing", { x: 1300, y: 720, r: 3, t: W("pr1", "cpu") + .1, size: 34 });
});
S("pr2", LS("pr2"), "orange", 11, k => {
  L(k, "WAITING ON", { x: 70, y: 130, size: 220, fit: 1200, t: LS("pr2") }); L(k, "THE MODEL?", { x: 70, y: 320, size: 220, fit: 1200, t: W("pr2", "model") - .2 });
  const segs = bar(k, 640, true), a = W("pr2", "model"), b = W("pr2", "no") + .3;
  const ph = box(k, { left: 80, top: 610, width: 6, height: 210, background: "var(--fg)" }), cnt = box(k, { left: 1200, top: 160, fontSize: 60, width: 640, textAlign: "right" }, "", "f-mono b");
  LIVE.push(t => { const p = Math.min(1, Math.max(0, (t - a) / (b - a))); ph.style.left = (80 + 1760 * p) + "px"; let billed = 0; segs.forEach(s => { if (s.ty === "b") billed += Math.max(0, Math.min(p, s.x0 + s.w) - s.x0); }); cnt.innerHTML = `<span style="font-size:26px;display:block;color:var(--dim)">cpu-seconds billed</span>${(billed * 20).toFixed(1)}`; });
  EM(k, "😴", { x: 1560, y: 330, s: 180, t: W("pr2", "waiting") + .1, wob: 4 });
});
S("pr2b", W("pr2", "no"), "ink", 11, k => {
  L(k, "NO CPU", { x: 70, y: 140, size: 380, fit: 1700, t: W("pr2", "no") });
  L(k, "BILLED.", { x: 70, y: 500, size: 380, fit: 1500, c: "var(--ac)", t: W("pr2", "billed") });
  mono(k, "// CPU isn't billed during model / tool I/O wait", { x: 1000, y: 190, size: 26, c: "var(--dim)", t: W("pr2", "billed") + .1 });
  mono(k, "// memory is still billed while the session runs", { x: 1000, y: 240, size: 26, c: "var(--dim)", t: W("pr2", "billed") + .2 });
});
S("pr3a", LS("pr3"), "paper", 11, k => {
  L(k, "THE HARNESS", { x: 70, y: 150, size: 330, fit: 1720, t: W("pr3", "the") }); L(k, "FEE?", { x: 70, y: 470, size: 400, fit: 1000, t: W("pr3", "fee") });
  EM(k, "🤔", { x: 1500, y: 500, s: 280, t: W("pr3", "fee") + .1, wob: 4 });
});
S("pr3b", W("pr3", "zero"), "orange", 11, k => {
  L(k, "$0", { x: 60, y: 90, size: 940, t: W("pr3", "zero") });
  L(k, "HARNESS FEE", { x: 1000, y: 300, size: 200, fit: 840, t: W("pr3", "dollars") - .1 });
  ST(k, "no additional harness charge", { x: 900, y: 600, r: -4, t: W("pr3", "dollars") + .1, size: 34 });
  mono(k, "// you pay for what it uses", { x: 1000, y: 700, size: 30, t: W("pr3", "dollars") + .2 });
});
// ---- 12 OPS
S("ops0", LS("ops1"), "ink", 12, k => {
  L(k, "OPS", { x: 70, y: 100, size: 640, fit: 1100, c: "var(--ac)", t: LS("ops1") });
  L(k, "is built in.", { f: "serif", x: 90, y: 700, size: 170, t: W("ops1", "built") });
});
const vbox = (k, i, t, o = {}) => PN(k, { x: 100 + i * 560, y: o.y ?? 520, w: 500, h: o.h ?? 260, bg: o.bg, c: o.c, bd: "4px solid var(--fg)", r: 10, t, html: `<div style="font:800 100px/${o.h ?? 260}px 'Anton';text-align:center;text-transform:uppercase">V${i + 1}</div>` });
S("versions", W("ops1", "versions"), "paper", 12, k => {
  L(k, "VERSIONS", { x: 70, y: 150, size: 330, fit: 1740, t: W("ops1", "versions") });
  [0, 1, 2].forEach(i => { vbox(k, i, k.t0 + .1 + i * .12); IC(k, "l:lock", { x: 100 + i * 560 + 420, y: 540, s: 60, sw: 2, t: k.t0 + .25 + i * .12, pop: false }); });
  ST(k, "every update = immutable version", { x: 100, y: 830 - 30, r: -2, t: k.t0 + .5, size: 30 });
});
S("rollbacks", W("ops1", "rollbacks"), "orange", 12, k => {
  L(k, "ROLLBACKS", { x: 70, y: 150, size: 330, fit: 1740, t: k.t0 });
  [0, 1, 2].forEach(i => vbox(k, i, k.t0 + .1 + i * .08, { y: 560, h: 200, bg: i === 2 ? "var(--fg)" : "transparent", c: i === 2 ? "var(--bg)" : "var(--fg)" }));
  const pill = PN(k, { x: 1150, y: 800 - 20, w: 420, h: 70, bg: "var(--fg)", c: "var(--bg)", r: 40, t: k.t0 + .35, html: `<div style="font:800 26px/66px 'JetBrains Mono';text-align:center">▲ prod endpoint</div>` });
  k.tl.to(pill, { x: -560, duration: .4, ease: "power3.inOut", immediateRender: false }, k.t0 + .85); cue("whoosh", k.t0 + .85, .5);
  IC(k, "l:undo-2", { x: 1600, y: 560, s: 160, t: k.t0 + .9 });
});
S("evals", W("ops1", "evals"), "ink", 12, k => {
  L(k, "EVALS", { x: 70, y: 130, size: 340, fit: 1000, t: k.t0 });
  ["helpfulness", "faithfulness", "safety"].forEach((x, i) => { const y = 540 + i * 110;
    mono(k, x, { x: 80, y: y + 20, size: 34, t: k.t0 + .1 + i * .1 });
    PN(k, { x: 480, y: y, w: 900, h: 70, bd: "3px solid var(--fg)", t: k.t0 + .1 + i * .1, wipe: true, snd: false, html: `<div style="height:100%;width:${[86, 78, 94][i]}%;background:var(--ac)"></div>` });
    IC(k, "l:check", { x: 1420, y: y - 5, s: 80, c: "var(--ac)", sw: 3, t: k.t0 + .35 + i * .1, pop: i === 0 }); });
  ST(k, "LLM-as-a-judge", { x: 1150, y: 200, r: 4, t: k.t0 + .3, size: 36 });
});
S("ab", W("ops1", "ab"), "paper", 12, k => {
  PN(k, { x: 0, y: 100, w: 960, h: 890, bg: "var(--fg)", c: "var(--bg)", snd: false, t: k.t0, wipe: true, html: "" });
  L(k, "A", { x: 190, y: 180, size: 760, c: "var(--bg)", t: k.t0 + .05 }); L(k, "B", { x: 1140, y: 180, size: 760, c: "var(--fg)", t: k.t0 + .12 });
  const bx = PN(k, { x: 1000, y: 800 - 40, w: 0, h: 0, html: "" }); void bx;
  ST(k, "A/B TESTS", { x: 700, y: 140, r: -3, t: k.t0 + .2, size: 44 });
  ST(k, "statistical significance", { x: 560, y: 830 - 30, r: 3, t: k.t0 + .35, size: 30 });
});
S("outgrow", LS("ops2"), "ink", 12, k => {
  L(k, "Outgrow", { f: "serif", x: 80, y: 190, size: 300, fit: 1700, t: LS("ops2") });
  L(k, "CONFIG?", { x: 70, y: 500, size: 400, fit: 1700, c: "var(--ac)", t: W("ops2", "config") });
});
S("export", W("ops2", "export"), "orange", 12, k => {
  L(k, "EXPORT TO CODE.", { x: 70, y: 140, size: 260, fit: 1740, t: W("ops2", "export") });
  PN(k, { x: 100, y: 480, w: 620, h: 300, bg: "#151517", bd: "3px solid var(--fg)", t: W("ops2", "export") + .1, html: `<div class="code" style="font-size:28px;padding:26px 30px;color:#EEE8DD"><span class="c-c"># config</span>\n<span class="c-k">model:</span> …\n<span class="c-k">tools:</span> …\n<span class="c-k">skills:</span> …</div>` });
  PN(k, { x: 1200, y: 480, w: 620, h: 300, bg: "#EEE8DD", c: "#0B0B0C", bd: "3px solid var(--fg)", t: W("ops2", "code") + .05, html: `<div class="code" style="font-size:28px;padding:26px 30px;color:#0B0B0C"><b>agent.py</b>\n<span style="color:#c26a00">from</span> strands <span style="color:#c26a00">import</span> Agent\n…</div>` });
  const ar = box(k, { left: 0, top: 0 }, `<svg width="1920" height="1080"><path d="M740 630 L1170 630 M1120 590 L1170 630 L1120 670" pathLength="1" stroke="#0B0B0C" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1 1"/></svg>`);
  k.tl.fromTo(ar.querySelector("path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .4, ease: "power2.inOut" }, W("ops2", "code")); cue("whoosh", W("ops2", "code"), .5);
  ST(k, "Strands Agents", { x: 1330, y: 800 - 10, r: -3, t: W("ops2", "code") + .3, size: 32 });
});
S("keep", W("ops2", "keep"), "paper", 12, k => {
  mono(k, "// keep", { x: 1000, y: 190, size: 40, t: k.t0 });
  [["MODEL", "model"], ["PROMPT", "prompt"], ["TOOLS", "tools"]].forEach(([t, w], i) => { L(k, t, { x: 70, y: 180 + i * 235, size: 240, t: W("ops2", w) });
    IC(k, "l:check", { x: 760 + (i === 1 ? 60 : 0), y: 190 + i * 235, s: 200, c: "var(--ac)", sw: 3.2, t: W("ops2", w) + .1, pop: false }); cue("stamp", W("ops2", w) + .1, .6); });
  ST(k, "+ memory wiring, skills, container env", { x: 1000, y: 720, r: 3, t: W("ops2", "tools") + .2, size: 26 });
});
// ---- 13 SCOREBOARD
S("sc0", LS("sc1"), "ink", 13, k => {
  L(k, "SCORE", { x: 70, y: 130, size: 380, fit: 1760, t: LS("sc1") }); L(k, "BOARD.", { x: 70, y: 480, size: 380, fit: 1760, c: "var(--ac)", t: LS("sc1") + .1 });
}, { cut: "whoosh" });
const ROWS = [["SETUP", "glue code + infra", "2 API calls", "setup"], ["SCALE", "build your own isolation", "1 session = 1 microVM", "scale"], ["SECURITY", "roll your own", "microVM + token vault", "security"], ["OBSERVABILITY", "9 log-group tabs", "traces, automatic", "observability"]];
const board = (k, upTo, tline) => {
  const c2 = 560, c3 = 1190;
  L(k, "DIY STACK", { x: c2, y: 120, size: 90, fit: 600, t: k.t0 }); L(k, "AGENTCORE HARNESS", { x: c3, y: 120, size: 90, fit: 640, c: "var(--ac)", t: k.t0 + .06 });
  RL(k, { x: 80, y: 250, w: 1760, h: 6, t: k.t0, snd: false });
  ROWS.forEach((r, i) => { const y = 290 + i * 150;
    L(k, r[0], { x: 80, y, size: 64, fit: 440, t: k.t0 + .05 * i });
    if (i > upTo) return;
    const cur = i === upTo && tline, tt = cur ? W("sc2", r[3]) : null, at = cur ? tt + .05 : k.t0;
    const d = box(k, { left: c2, top: y + 8, width: 600, fontSize: 32 }, r[1], "f-mono");
    const h = box(k, { left: c3, top: y + 4, width: 640, fontSize: 36 }, r[2], "f-mono b");
    const stk = box(k, { left: c2 - 10, top: y + 30, width: 60 + r[1].length * 18.2, height: 8, background: "var(--fg)", transformOrigin: "0 50%" });
    const stamp = box(k, { left: c3 + 590, top: y - 10 }, `<div style="width:84px;height:84px;border-radius:50%;background:var(--ac);color:#0B0B0C;border:4px solid var(--fg);text-align:center;font:800 54px/74px 'JetBrains Mono'">✓</div>`);
    if (cur) { FADE(k, d, at, .12); FADE(k, h, at + .12, .12); k.tl.fromTo(stk, { scaleX: 0 }, { scaleX: 1, duration: .25, ease: "expo.out" }, at + .2); cue("scribble", at + .2, .6);
      k.tl.fromTo(stamp, { scale: 2.4, opacity: 0, rotation: 20 }, { scale: 1, opacity: 1, rotation: -10, duration: .22, ease: "power4.in" }, at + .38); cue("stamp", at + .55); }
    else { k.tl.set(stamp, { rotation: -10 }, 0); } });
};
S("scT", W("sc1", "diy"), "paper", 13, k => board(k, -1, false));
S("scA", W("sc2", "setup"), "ink", 13, k => board(k, 0, true));
S("scB", W("sc2", "scale"), "paper", 13, k => board(k, 1, true));
S("scC", W("sc2", "security"), "ink", 13, k => board(k, 2, true));
S("scD", W("sc2", "observability"), "paper", 13, k => board(k, 3, true));
S("nec", LS("sc3"), "ink", 13, k => {
  L(k, "NOT EVEN", { x: 70, y: 130, size: 380, fit: 1740, t: W("sc3", "not") }); L(k, "CLOSE.", { x: 70, y: 490, size: 400, fit: 1300, c: "var(--ac)", t: W("sc3", "close") });
  L(k, "4 – 0", { f: "serif", x: 1230, y: 560, size: 300, t: W("sc3", "close") + .15 }); cue("crash", W("sc3", "close"), .8);
});
// ---- 14 VERDICT
S("v1a", LS("v1"), "orange", 14, k => { L(k, "YOUR JOB IS", { x: 70, y: 280, size: 460, fit: 1780, t: LS("v1") }); }, { cut: "whoosh" });
S("v1b", W("v1", "shipping"), "ink", 14, k => {
  L(k, "SHIPPING", { x: 70, y: 130, size: 400, fit: 1500, t: W("v1", "shipping") }); L(k, "AGENTS.", { x: 70, y: 500, size: 400, fit: 1500, c: "var(--ac)", t: W("v1", "agents") });
  IC(k, "l:rocket", { x: 1480, y: 470, s: 300, c: "var(--ac)", sw: 1.3, t: W("v1", "agents") + .05 });
});
S("v1c", W("v1", "not"), "paper", 14, k => {
  L(k, "NOT BABYSITTING", { x: 70, y: 150, size: 300, fit: 1740, t: W("v1", "not") }); L(k, "INFRASTRUCTURE", { x: 70, y: 450, size: 300, fit: 1740, t: W("v1", "infrastructure") });
  RL(k, { x: 60, y: 300, w: 1760, h: 22, c: "var(--ac)", t: W("v1", "babysitting") + .35 }); RL(k, { x: 60, y: 610, w: 1500, h: 22, c: "var(--ac)", t: W("v1", "infrastructure") + .45 });
  EM(k, "🍼", { x: 1620, y: 640, s: 190, t: W("v1", "babysitting") + .2, wob: 5 });
});
S("gob", LS("v2"), "orange", 14, k => {
  L(k, "GO BUILD.", { x: 50, y: 190, size: 700, fit: 1790, t: LS("v2") }); cue("crash", LS("v2"), .9);
}, { cut: "none", flash: true });
S("cover", LS("v2") + .85, "paper", 14, k => {
  const t = k.t0;
  const mast = L(k, "AGENTCORE", { x: 40, y: 70, size: 420, fit: 1840, t }); mast.style.letterSpacing = "-.01em";
  L(k, "the Harness issue", { f: "serif", x: 90, y: 465, size: 100, t: t + .1 });
  L(k, "GO BUILD.", { x: 70, y: 590, size: 280, fit: 1200, c: "var(--ac)", t: t + .15 });
  mono(k, "BY YUVAL AVIDANI — AWS GEN AI SUPERSTAR · YUV.AI", { x: 80, y: 860, size: 30, t: t + .3 });
  const r = rnd(99); let bars = ""; for (let i = 0, x = 0; x < 300; i++) { const w = 3 + Math.floor(r() * 9); bars += `<rect x="${x}" y="0" width="${w}" height="120" fill="#0B0B0C"/>`; x += w + 3 + Math.floor(r() * 7); }
  PN(k, { x: 1440, y: 590, w: 380, h: 250, bg: "#EEE8DD", bd: "3px solid var(--fg)", t: t + .25, rot: 0, html: `<svg width="320" height="120" style="margin:26px 30px 0">${bars}</svg><div class="f-mono" style="font:700 20px 'JetBrains Mono';text-align:center;margin-top:14px;color:#0B0B0C">ISSUE Nº01 · 29 SEP 2026</div><div class="f-mono" style="font:700 16px 'JetBrains Mono';text-align:center;margin-top:8px;color:#5a5a5a">docs.aws.amazon.com/bedrock-agentcore</div>` });
  ST(k, "SOURCES IN README", { x: 1080, y: 500, r: 4, t: t + .5, size: 24 });
}, { cut: "none" });

// ================= BOOT: assemble timeline + per-frame fx() + seek() =================
await Promise.all(['400 100px Anton', 'italic 400 100px "Instrument Serif"', '400 20px "JetBrains Mono"', '700 20px "JetBrains Mono"', '800 20px "JetBrains Mono"', '40px "Noto Color Emoji"'].map(f => document.fonts.load(f, "AaÑ✓🔥")));
await document.fonts.ready;
const PAGES = ["HOOK", "THE PAIN", "THE DROP", "THE ANALOGY", "HOW IT WORKS", "BUILT-INS", "THE PILLARS", "01 SCALE", "02 SECURITY", "03 OBSERVABILITY", "PRICING", "OPS", "SCOREBOARD", "VERDICT"];
const END = LE("v2") + 3.5, DROP = LS("drop1"), BREAK = LS("sc3"), REDROP = LS("v2"), BEAT = 60 / 140;
SHOTS.sort((a, b) => a.t0 - b.t0);
SHOTS.forEach((s, i) => s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : END);
const tl = gsap.timeline({ paused: true });
for (const s of SHOTS) {
  const el = document.createElement("div"); el.className = `shot t-${s.theme}`; el.style.display = "block"; world.appendChild(el); s.el = el;
  s.fn({ el, tl, t0: s.t0, t1: s.t1, id: s.id });
  el.style.display = "none";
  const cut = s.o.cut || "tick"; CUTS.push({ t: s.t0, id: s.id, theme: s.theme }); if (cut !== "none") cue(cut, s.t0, cut === "whoosh" ? .9 : 1);
}
tl.to({}, { duration: END + .5 }, 0);
// logos in chrome
document.getElementById("lg-d").innerHTML = logoSVG("default", 28); document.getElementById("lg-r").innerHTML = logoSVG("reversed", 28); document.getElementById("lg-m").innerHTML = logoSVG("mono", 28);
// captions: 3-5 words per chunk, from script-anchored word timings
const capsEl = document.getElementById("caps"), CHUNKS = [];
for (const key of Object.keys(WD).sort((a, b) => WD[a].start - WD[b].start)) {
  const toks = WD[key].disp; let cur = [];
  const flush = () => { if (cur.length) { CHUNKS.push({ words: cur }); cur = []; } };
  toks.forEach((w, i) => { cur.push(w); const end = /[.?!:,]$/.test(w.t); if ((cur.length >= 3 && end) || cur.length >= 5) flush(); });
  if (cur.length) { if (cur.length < 2 && CHUNKS.length && CHUNKS[CHUNKS.length - 1].line === key && CHUNKS[CHUNKS.length - 1].words.length < 5) CHUNKS[CHUNKS.length - 1].words.push(...cur); else flush(); }
  CHUNKS.slice(-8).forEach(c => c.line = c.line || key);
}
CHUNKS.forEach((c, i) => { const nx = CHUNKS[i + 1], last = c.words[c.words.length - 1];
  c.s = c.words[0].s - .05; c.e = (nx && nx.words[0].s - last.e < .45) ? nx.words[0].s - .04 : last.e + .4;
  const d = document.createElement("div"); d.className = "ch"; d.innerHTML = "&gt; " + c.words.map(w => `<span class="w">${w.t}</span>`).join(" "); capsEl.appendChild(d); c.el = d; c.ws = [...d.querySelectorAll(".w")]; });
const pad = n => String(n).padStart(2, "0"); let lastShot = -1, lastCh = -1;
const grain = document.getElementById("grain"), flash = document.getElementById("flash"), cSec = document.getElementById("c-sec"), cTc = document.getElementById("c-tc"), cPg = document.getElementById("c-pg");
const FLASH = SHOTS.filter(s => s.o.flash).map(s => s.t0);
function fx(t, frame) {
  let idx = SHOTS.findIndex(s => t >= s.t0 && t < s.t1); if (idx < 0) idx = t < SHOTS[0].t0 ? 0 : SHOTS.length - 1;
  const s = SHOTS[idx];
  if (idx !== lastShot) { SHOTS.forEach((q, i) => q.el.style.display = i === idx ? "block" : "none"); lastShot = idx; stage.dataset.theme = s.theme;
    cSec.textContent = `AGENTCORE — ISSUE Nº01 · § ${pad(s.page)} ${PAGES[s.page - 1]}`; cPg.textContent = `P. ${pad(s.page)} / 14`; }
  const p = Math.max(0, 1 - (t - s.t0) / .26); s.el.style.transform = `scale(${1 + .05 * p * p})`;
  if (t >= DROP && t < END) { const ph = ((t - DROP) / BEAT) % 1, amp = (t >= BREAK && t < REDROP) ? .005 : .014; world.style.transform = `scale(${1 + amp * Math.exp(-5 * ph)})`; } else world.style.transform = "none";
  for (const y of TYPERS) { const n = Math.max(0, Math.min(y.text.length, Math.floor((t - y.t0) * y.cps))); y.tx.textContent = y.text.slice(0, n); y.caret.style.opacity = t < y.t0 - .05 ? 0 : (n < y.text.length ? 1 : (Math.floor(t * 2.2) % 2 ? 0 : 1)); }
  for (const c of COUNTERS) { const q = Math.max(0, Math.min(1, (t - c.t0) / c.dur)); c.el.textContent = c.fmt(c.a + (c.b - c.a) * ease.out3(q)); }
  for (const w of WOB) w.el.style.rotate = (w.amp * Math.sin(t * 2.6 + w.ph)) + "deg";
  for (const f of LIVE) f(t);
  let ci = CHUNKS.findIndex(c => t >= c.s && t < c.e);
  if (ci !== lastCh) { CHUNKS.forEach((c, i) => c.el.style.display = i === ci ? "block" : "none"); lastCh = ci; }
  if (ci >= 0) { const c = CHUNKS[ci]; let cw = -1; c.words.forEach((w, i) => { if (t >= w.s - .02) cw = i; }); c.ws.forEach((e, i) => e.classList.toggle("on", i === cw)); }
  const f0 = FLASH.find(x => t >= x && t < x + .22) ?? null; const fr = f0 !== null ? (t >= REDROP ? .0 : 1 - (t - f0) / .22) : 0; flash.style.opacity = f0 !== null ? (.9 * fr) : 0;
  grain.style.backgroundImage = `url(grain_${frame % 4}.png)`; grain.style.backgroundPosition = `${(frame * 97) % 640}px ${(frame * 57) % 360}px`;
  const ff = Math.round(t * 30), sec = Math.floor(ff / 30); cTc.textContent = `TC ${pad(Math.floor(sec / 60))}:${pad(sec % 60)}:${pad(ff % 30)}`;
}
window.seek = (t, frame) => { tl.time(t, false); fx(t, frame ?? Math.round(t * 30)); };
window.CUES = CUES; window.CUTS = CUTS;
window.TIMING = { END, DROP, BREAK, REDROP, BEAT, FLASH, SHOTS: SHOTS.map(s => ({ id: s.id, t0: s.t0, t1: s.t1, theme: s.theme })) };
window.READY = true;


}catch(e){window.BUILD_ERROR=String(e.stack||e);console.error(e)}})();