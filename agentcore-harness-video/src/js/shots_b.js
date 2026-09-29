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
