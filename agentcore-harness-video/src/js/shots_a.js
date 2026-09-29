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
