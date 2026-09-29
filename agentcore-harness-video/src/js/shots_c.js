// ================= v2: CALMER EDIT — ~60 shots, grouped by idea, word-synced reveals inside each shot =================
const mono = (k, txt, o) => L(k, txt, { f: "mono", cls: "b", size: 34, ...o });
const CODE = [["c-c", "# simplified for the screen"], ["", `<span class="c-k">harness:</span> my-agent`], ["", `<span class="c-k">model:</span>        <span class="c-s">bedrock/claude-sonnet-4-6</span>`],
  ["", `<span class="c-k">tools:</span>        [<span class="c-n">browser, code_interpreter, gateway</span>]`], ["", `<span class="c-k">skills:</span>       [<span class="c-n">awsSkills</span>]`], ["", `<span class="c-k">instructions:</span> <span class="c-s">"You are a research agent."</span>`]];
const term = (k, o) => { PN(k, { x: 80, y: 530, w: 1760, h: o.h || 300, bg: o.bg, bd: "3px solid var(--fg)", t: o.t, wipe: true, html: "" });
  TY(k, { x: 116, y: 560, size: 30, c: o.fg, text: o.text, t: o.t + .1, cps: o.cps || 70 }); };
const vbox = (k, i, t, o = {}) => PN(k, { x: 100 + i * 560, y: o.y ?? 520, w: 500, h: o.h ?? 260, bg: o.bg, c: o.c, bd: "4px solid var(--fg)", r: 10, t, html: `<div style="font:800 100px/${o.h ?? 260}px 'Anton';text-align:center;text-transform:uppercase">V${i + 1}</div>` });
// ---- 01 HOOK
S("cold", 0, "ink", 1, k => {
  TY(k, { x: 80, y: 300, size: 46, text: "$ ./agent --env local", t: .05, cps: 40, c: "var(--fg)" });
  ST(k, "localhost:3000", { x: 1220, y: 420, r: 5, t: .3, size: 34 });
});
S("h1a", W("h1", "pov"), "paper", 1, k => {
  mono(k, "POV:", { x: 80, y: 150, size: 46, t: W("h1", "pov") });
  L(k, "YOUR AI", { x: 70, y: 205, size: 280, fit: 1300, t: W("h1", "your") });
  L(k, "AGENT", { x: 70, y: 445, size: 400, fit: 1250, t: W("h1", "agent") });
  IC(k, "l:laptop", { x: 1360, y: 250, s: 400, sw: 1.3, t: W("h1", "agent") + .1 });
});
S("h1b", W("h1", "works"), "ink", 1, k => {
  L(k, "WORKS", { x: 70, y: 140, size: 300, fit: 1100, t: W("h1", "works") });
  L(k, "PERFECTLY.", { x: 70, y: 400, size: 300, fit: 1500, t: W("h1", "perfectly") });
  IC(k, "l:badge-check", { x: 1440, y: 150, s: 260, c: "var(--ac)", sw: 1.5, t: W("h1", "works") + .12 });
  L(k, "on your laptop.", { f: "serif", x: 80, y: 700, size: 170, c: "var(--ac)", t: W("h1", "on") });
  EM(k, "💻", { x: 1520, y: 660, s: 200, t: W("h1", "laptop") + .05, r: 8 });
  AR(k, { p: [1500, 700, 1300, 800], t: W("h1", "laptop") + .3, label: "famous last words.", lx: 1200, ly: 590, ls: 56, bend: 30, bend2: 30 });
});
S("h2", LS("h2"), "paper", 1, k => {
  mono(k, "BOSS SAYS:", { x: 80, y: 150, size: 40, t: LS("h2") });
  L(k, "SHIP IT.", { x: 70, y: 210, size: 440, fit: 1700, t: W("h2", "ship") });
  PN(k, { x: 1000, y: 730, w: 470, h: 100, bg: "var(--fg)", c: "var(--bg)", html: `<div style="font:800 34px/100px 'JetBrains Mono';text-align:center">DEPLOY TO PROD</div>`, t: W("h2", "ship") + .2 });
  CU(k, [{ x: 1600, y: 500, t: W("h2", "ship") + .1 }, { x: 1180, y: 770, t: W("h2", "it") + .25, click: true }]);
  ST(k, "friday 4:59 PM", { x: 80, y: 800, r: -4, t: W("h2", "ship") + .3, size: 32 });
});
S("probs", LS("h3"), "ink", 1, k => {
  L(k, "COOL.", { x: 70, y: 150, size: 260, fit: 640, t: LS("h3") });
  L(k, "now it needs…", { f: "serif", x: 80, y: 420, size: 90, c: "var(--ac)", t: W("h3", "now") });
  [["SANDBOXES", "l:box", "sandboxes"], ["MEMORY", "l:brain", "memory"], ["AUTH", "l:key-round", "auth"], ["LOGS", "l:scroll-text", "logs"], ["SCALING", "l:trending-up", "scaling"]].forEach(([w, ic, tok], i) => {
    const y = 140 + i * 150, t = W("h3", tok); IC(k, ic, { x: 820, y: y + 10, s: 110, c: "var(--ac)", sw: 1.6, t }); L(k, w, { x: 970, y, size: 150, fit: 860, t: t + .05 }); });
  TO(k, { t: W("h3", "auth") + .1, icon: "🚫", title: "401", msg: "unauthorized", x: 80, y: 560, w: 600, snd: "err", dur: 1.3 });
  TO(k, { t: W("h3", "scaling") + .1, icon: "🔥", title: "503", msg: "service unavailable", x: 80, y: 560, w: 600, snd: "err", dur: 1.4 });
});
S("ther", LS("h4"), "orange", 1, k => {
  L(k, "And", { f: "serif", x: 80, y: 190, size: 200, t: LS("h4") });
  L(k, "therapy.", { f: "serif", x: 70, y: 330, size: 560, fit: 1400, t: W("h4", "therapy") });
  EM(k, "🛋️", { x: 1500, y: 330, s: 290, t: W("h4", "therapy") + .05, r: -6 });
  SC(k, { x: 40, y: 350, w: 1440, h: 470, t: W("h4", "therapy") + .3 }); cue("scratch", W("h4", "therapy") - .02);
}, { cut: "none" });
// ---- 02 PAIN
S("diy1", LS("pain1"), "paper", 2, k => {
  mono(k, "SO YOU", { x: 80, y: 150, size: 44, t: LS("pain1") });
  L(k, "DUCT-TAPE", { x: 70, y: 210, size: 230, fit: 800, t: W("pain1", "duct") });
  const tp = box(k, { left: 160, top: 300, width: 560, height: 60, background: "#b9b3a6", transform: "rotate(-5deg)", transformOrigin: "0 50%" });
  k.tl.fromTo(tp, { scaleX: 0 }, { scaleX: 1, duration: .3, ease: "power3.out" }, W("pain1", "tape")); cue("tape", W("pain1", "tape") - .02);
  L(k, "6 SERVICES", { x: 70, y: 470, size: 260, fit: 800, t: W("pain1", "six") });
  [["aws:lambda", "compute"], ["aws:ecs", "sandbox"], ["aws:dynamodb", "memory"], ["aws:cognito", "auth"], ["aws:cloudwatch", "logs"], ["aws:secrets", "secrets"]].forEach((it, i) => {
    const rot = [-4, 3, -2, 4, -3, 2][i];
    const p = PN(k, { x: 900 + (i % 3) * 300, y: 170 + Math.floor(i / 3) * 320, w: 250, h: 290, bg: "var(--ac)", bd: "3px solid var(--fg)", r: 18, sh: "8px 8px 0 var(--fg)", rot, t: W("pain1", "six") + .1 + i * .12, snd: i < 2,
      html: `<div style="margin:22px auto 0;width:150px">${svgI(it[0], 150)}</div><div style="font:800 26px 'JetBrains Mono';text-align:center;margin-top:18px">${it[1]}</div>` }); });
  ST(k, "held together by hope", { x: 900, y: 830, r: -3, t: W("pain1", "services") + .3, size: 30 });
});
S("diy2", LS("pain2"), "ink", 2, k => {
  L(k, "12", { x: 70, y: 120, size: 400, c: "var(--ac)", t: LS("pain2") });
  L(k, "DASHBOARDS", { x: 70, y: 540, size: 120, fit: 800, t: W("pain2", "dashboards") });
  L(k, "0 SLEEP", { x: 70, y: 700, size: 200, fit: 800, c: "var(--ac)", t: W("pain2", "zero") });
  SC(k, { x: 30, y: 690, w: 850, h: 230, t: W("pain2", "sleep") + .05, c: "var(--fg)", seed: 4 });
  const r = rnd(5);
  for (let i = 0; i < 12; i++) { let bars = ""; for (let b = 0; b < 5; b++) bars += `<div style="display:inline-block;width:20px;margin-right:9px;background:var(--ac);height:${20 + Math.floor(r() * 70)}px;vertical-align:bottom"></div>`;
    PN(k, { x: 900 + (i % 4) * 232, y: 170 + Math.floor(i / 4) * 230, w: 210, h: 200, bd: "3px solid var(--fg)", r: 8, rot: (i % 3 - 1) * 2, t: LS("pain2") + .1 + i * .07, snd: false, html: `<div style="font:700 18px 'JetBrains Mono';padding:12px">dash_${i + 1}</div><div style="padding:0 16px;height:110px;display:flex;align-items:flex-end">${bars}</div>` }); }
});
S("fire", LS("pain3"), "orange", 2, k => {
  L(k, "PROD IS ON FIRE.", { x: 70, y: 150, size: 250, fit: 1760, t: LS("pain3") });
  L(k, "again.", { f: "serif", x: 70, y: 400, size: 380, t: W("pain3", "again") });
  TO(k, { t: W("pain3", "on") + .05, icon: "🔔", title: "PAGER", msg: "prod is on fire. again.", x: 1180, y: 440, snd: "err", dur: 1.4 });
  EM(k, "🔥", { x: 1500, y: 660, s: 260, t: W("pain3", "fire"), wob: 3 });
});
S("riser", LE("pain3") + .05, "paper", 2, k => {
  cue("riser", k.t0);
  TY(k, { x: 80, y: 330, size: 58, text: "$ pip install sanity", t: k.t0, cps: 20 });
  TY(k, { x: 80, y: 470, size: 40, text: "ERROR: no matching distribution\nfound for sanity", t: k.t0 + .55, cps: 50, c: "#c26a00" });
}, { cut: "none" });
// ---- 03 THE DROP
S("slam", LS("drop1"), "orange", 3, k => {
  const tA = W("drop1", "amazon");
  const lg = box(k, { left: 660, top: 330 }, logoSVG("mono", 330)); st(lg, { transformOrigin: "50% 50%" });
  k.tl.fromTo(lg, { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: .14, ease: "expo.out" }, k.t0);
  k.tl.to(lg, { scale: .42, x: -560, y: -250, duration: .4, ease: "expo.inOut", immediateRender: false }, tA - .05);
  mono(k, "MEET", { x: 80, y: 150, size: 46, t: k.t0 + .05 });
  L(k, "AMAZON", { x: 70, y: 360, size: 560, fit: 1760, t: tA }); cue("boom", k.t0);
}, { cut: "none", flash: true });
S("name", W("drop1", "bedrock"), "paper", 3, k => {
  L(k, "BEDROCK", { x: 70, y: 150, size: 300, fit: 1700, t: W("drop1", "bedrock") });
  L(k, "AGENTCORE", { x: 70, y: 450, size: 300, fit: 1700, c: "var(--ac)", t: W("drop1", "agentcore") });
  IC(k, "aws:bedrock", { x: 80, y: 770, s: 130, t: W("drop1", "bedrock") + .1 }); IC(k, "aws:agentcore", { x: 240, y: 770, s: 130, t: W("drop1", "agentcore") + .1 });
  EM(k, "🪨", { x: 1600, y: 700, s: 180, t: W("drop1", "bedrock") + .3, r: 10 });
});
S("main", LS("drop2"), "orange", 3, k => {
  L(k, "main character:", { f: "serif", x: 80, y: 120, size: 140, t: LS("drop2") });
  L(k, "THE HARNESS", { x: 60, y: 280, size: 450, fit: 1760, t: W("drop2", "harness") });
  IC(k, "aws:agentcore", { x: 1560, y: 100, s: 170, t: W("drop2", "harness") + .1 });
  ST(k, "harness GA · 18 JUN 2026", { x: 80, y: 780, r: -2, t: W("drop2", "harness") + .3, size: 32 });
});
S("def", LS("def"), "ink", 3, k => {
  mono(k, "// harness =", { x: 80, y: 140, size: 40, c: "var(--ac)", t: LS("def") });
  L(k, "A MANAGED RUNTIME", { x: 70, y: 200, size: 230, fit: 1760, t: W("def", "managed") });
  L(k, "THAT RUNS YOUR AGENT.", { x: 70, y: 450, size: 230, fit: 1760, c: "var(--ac)", t: W("def", "runs") });
  L(k, "so you don't have to.", { f: "serif", x: 80, y: 700, size: 130, t: W("def", "so") });
});
// ---- 04 ANALOGY
S("rest", LS("an1"), "paper", 4, k => {
  L(k, "think", { f: "serif", x: 80, y: 130, size: 160, t: LS("an1") });
  L(k, "RESTAURANT.", { x: 70, y: 280, size: 250, fit: 900, t: W("an1", "restaurant") });
  EM(k, "🍽️", { x: 80, y: 600, s: 190, t: W("an1", "restaurant") + .1, r: 8 });
  const items = ["model", "tools", "skills", "instructions"];
  PN(k, { x: 1000, y: 150, w: 800, h: 620, bg: "var(--ac)", bd: "4px dashed var(--fg)", rot: -3, t: W("an1", "recipe") - .1,
    html: `<div class="f-serif" style="font-size:96px;padding:30px 44px 0">Recipe</div><div class="f-mono" style="font:700 38px/1.9 'JetBrains Mono';padding:10px 54px">${items.map(x => "▢ " + x).join("<br>")}</div>` });
  ST(k, "grandma approved", { x: 400, y: 700, r: -4, t: W("an1", "recipe") + .3, size: 32 });
});
S("config", W("an1", "thats"), "ink", 4, k => {
  L(k, "THAT'S YOUR", { x: 70, y: 190, size: 200, fit: 650, t: W("an1", "thats") });
  L(k, "CONFIG.", { x: 70, y: 430, size: 300, fit: 650, c: "var(--ac)", t: W("an1", "config") });
  PN(k, { x: 780, y: 160, w: 1040, h: 620, bg: "#151517", bd: "3px solid var(--fg)", t: W("an1", "thats"), wipe: true, html: `<div class="f-mono" style="font:700 24px 'JetBrains Mono';color:#7d786f;padding:14px 26px;border-bottom:2px solid #333">config.yaml</div>` });
  TY(k, { x: 810, y: 250, size: 32, c: "#EEE8DD", text: "# recipe = config\nmodel: …\ntools: …\nskills: …\ninstructions: …", t: W("an1", "thats") + .2, cps: 30 });
});
S("kitchen", LS("an2"), "paper", 4, k => {
  const lg = box(k, { left: 80, top: 150 }, logoSVG("default", 200)); FADE(k, lg, LS("an2"), .2);
  L(k, "RUNS THE ENTIRE", { x: 70, y: 400, size: 200, fit: 1000, t: W("an2", "runs") });
  L(k, "KITCHEN.", { x: 70, y: 590, size: 300, fit: 1000, c: "var(--ac)", t: W("an2", "kitchen") });
  ["environment", "compute", "memory", "identity", "networking", "observability"].forEach((x, i) =>
    PN(k, { x: 1230, y: 150 + i * 105, w: 560, h: 82, bd: "3px solid var(--fg)", r: 40, t: W("an2", "kitchen") + .1 + i * .12, snd: i < 2, html: `<div style="font:700 32px/76px 'JetBrains Mono';text-align:center">${x}</div>` }));
  ST(k, "dishes: not your problem", { x: 1230, y: 790, r: -3, t: W("an2", "kitchen") + .9, size: 28 });
});
// ---- 05 HOW IT WORKS
S("how1", LS("how1"), "ink", 5, k => {
  const T = [null, null, ["model", "model"], ["tools", "tools"], ["skills", "skills"], ["instructions", "instructions"]];
  PN(k, { x: 80, y: 150, w: 1180, h: 500, bg: "#151517", bd: "3px solid var(--fg)", snd: false, t: k.t0, wipe: true, html: "" });
  CODE.forEach((c, i) => { const y = 190 + i * 72, hl = box(k, { left: 92, top: y - 8, width: 1156, height: 60, background: "var(--ac)", opacity: 0 });
    if (T[i]) { const a = W("how1", T[i][1]), nx = T[i + 1] ? W("how1", T[i + 1][1]) : LE("how1") + .3; k.tl.fromTo(hl, { opacity: 0 }, { opacity: .3, duration: .1 }, a); k.tl.to(hl, { opacity: 0, duration: .1, immediateRender: false }, nx); }
    const d = box(k, { left: 118, top: y }, c[0] ? `<span class="${c[0]}">${c[1]}</span>` : c[1], "code"); st(d, { fontSize: 28 }); FADE(k, d, k.t0 + .05 + i * .05, .15); });
  [["MODEL", "model", 0], ["TOOLS", "tools", 1], ["SKILLS", "skills", 2], ["INSTRUCTIONS", "instructions", 3]].forEach(([t, w, i]) => L(k, t, { x: 1300, y: 150 + i * 150, size: 130, fit: 540, c: i % 2 ? "var(--ac)" : undefined, t: W("how1", w) }));
  mono(k, "// a config is…", { x: 90, y: 720, size: 40, c: "var(--dim)", t: LS("how1") });
  ST(k, "config, not code", { x: 90, y: 790, r: -3, t: W("how1", "instructions") + .2, size: 34 });
});
S("two", LS("how2"), "orange", 5, k => {
  L(k, "2", { x: 70, y: 110, size: 800, t: LS("how2") });
  L(k, "API", { x: 620, y: 200, size: 340, t: W("how2", "api") }); L(k, "CALLS", { x: 620, y: 500, size: 340, fit: 1100, t: W("how2", "calls") });
  SC(k, { x: 20, y: 140, w: 560, h: 830, t: W("how2", "calls") + .1, seed: 9 });
  AR(k, { p: [1500, 220, 1220, 340], t: W("how2", "calls") + .3, label: "yes, two.", lx: 1400, ly: 130, ls: 78, c: "var(--fg)", bend: 40, bend2: 40 });
});
S("create", W("how2", "createharness"), "ink", 5, k => {
  mono(k, "01", { x: 80, y: 130, size: 50, c: "var(--ac)", t: k.t0 });
  L(k, "CREATEHARNESS", { x: 70, y: 200, size: 300, fit: 1740, t: k.t0 + .03 });
  term(k, { t: k.t0 + .12, bg: "#151517", fg: "#EEE8DD", text: `$ aws bedrock-agentcore-control create-harness \\\n    --harness-name "MyHarness" \\\n    --execution-role-arn "arn:aws:iam::123456789012:role/MyHarnessRole"` });
  ST(k, "from the official docs", { x: 1380, y: 490, r: 3, t: k.t0 + .5, size: 26 });
});
S("invoke", W("how2", "invokeharness"), "paper", 5, k => {
  mono(k, "02", { x: 80, y: 130, size: 50, c: "#c26a00", t: k.t0 });
  L(k, "INVOKEHARNESS", { x: 70, y: 200, size: 300, fit: 1740, t: k.t0 + .03 });
  term(k, { t: k.t0 + .12, bg: "#0B0B0C", fg: "#EEE8DD", h: 340, text: `response = client.invoke_harness(\n    harnessArn=HARNESS_ARN,\n    runtimeSessionId=SESSION_ID,\n    messages=[{"role": "user", "content": [{"text": "hi"}]}],\n)`, cps: 60 });
  ST(k, "boto3 · bedrock-agentcore", { x: 1250, y: 490, r: 3, t: k.t0 + .5, size: 26 });
});
S("thatsit", W("how2", "thats"), "orange", 5, k => {
  L(k, "THAT'S IT.", { x: 70, y: 260, size: 560, fit: 1760, t: W("how2", "thats") });
  EM(k, "🎤", { x: 1500, y: 640, s: 210, t: W("how2", "it") + .05, r: 12 });
});
// ---- 06 BUILT-INS
S("tools", LS("b1"), "paper", 6, k => {
  mono(k, "// BUILT IN:", { x: 80, y: 115, size: 36, t: LS("b1") });
  [["l:globe", "BROWSER", "agentcore_browser", "browser"], ["l:square-code", "CODE INTERPRETER", "agentcore_code_interpreter", "code"], ["l:square-terminal", "SHELL", "shell", "shell"], ["l:folder-open", "FILE SYSTEM", "file_operations", "file"]].forEach(([ic, lab, id, w], i) => {
    const x = 80 + (i % 2) * 900, y = 170 + Math.floor(i / 2) * 360, t = W("b1", w);
    PN(k, { x, y, w: 860, h: 330, bd: "3px solid var(--fg)", t, wipe: true, html: "" }); IC(k, ic, { x: x + 30, y: y + 60, s: 200, sw: 1.4, t: t + .1, pop: false });
    L(k, lab, { x: x + 260, y: y + 70, size: 110, fit: 560, t: t + .1 }); mono(k, id, { x: x + 260, y: y + 240, size: 26, c: "var(--dim)", t: t + .25 }); });
});
S("gw", LS("b2"), "ink", 6, k => {
  L(k, "GATEWAY", { x: 70, y: 140, size: 250, fit: 900, t: W("b2", "gateway") });
  const nd = (x, y, w, h, txt, t, inv) => PN(k, { x, y, w, h, bg: inv ? "var(--fg)" : "var(--bg)", c: inv ? "var(--bg)" : "var(--fg)", bd: "3px solid var(--fg)", t, r: 10, html: `<div style="font:800 32px/${h}px 'JetBrains Mono';text-align:center">${txt}</div>` });
  nd(100, 500, 300, 140, "AGENT", W("b2", "gateway") + .05, false); nd(700, 470, 420, 200, "GATEWAY", W("b2", "plugs"), true);
  const outs = ["OpenAPI", "Smithy", "Lambda", "MCP servers"]; outs.forEach((o, i) => nd(1420, 300 + i * 130, 400, 100, o, W("b2", i < 2 ? "apis" : "mcp") + .05 + (i % 2) * .1, false));
  const ln = (x1, y1, x2, y2, t) => { const d = box(k, { left: 0, top: 0 }, `<svg width="1920" height="1080"><path d="M${x1} ${y1} L${x2} ${y2}" pathLength="1" stroke="var(--fg)" stroke-width="5" fill="none" style="stroke-dasharray:1 1"/></svg>`);
    k.tl.fromTo(d.querySelector("path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .25 }, t); };
  ln(400, 570, 700, 570, W("b2", "plugs")); outs.forEach((_, i) => ln(1120, 570, 1420, 350 + i * 130, W("b2", i < 2 ? "apis" : "mcp") + .1));
});
S("usb", LS("b2b"), "orange", 6, k => {
  L(k, "MCP", { x: 70, y: 130, size: 620, fit: 1000, t: W("b2b", "mcp") }); L(k, "IS USB-C", { x: 70, y: 660, size: 240, fit: 1000, t: W("b2b", "usbc") - .2 });
  IC(k, "l:cable", { x: 1360, y: 130, s: 360, sw: 1.3, t: W("b2b", "usbc") });
  ST(k, "MCP = USB-C for AI tools", { x: 1000, y: 620, r: -5, t: W("b2b", "tools") - .3, size: 44 });
});
S("mem1", LS("b3"), "ink", 6, k => {
  IC(k, "l:brain", { x: 80, y: 170, s: 380, c: "var(--ac)", sw: 1.3, t: LS("b3") }); L(k, "MEMORY", { x: 560, y: 190, size: 440, fit: 1260, t: W("b3", "memory") });
  ["prefers dark mode", "last session: 3 days ago", "name: Yuval"].forEach((x, i) => PN(k, { x: 560, y: 560 + i * 90, w: 640 + i * 30, h: 70, bd: "3px solid var(--fg)", r: 40, t: W("b3", "remembers") + i * .15, snd: i === 0, html: `<div style="font:700 30px/64px 'JetBrains Mono';text-align:center">${x}</div>` }));
  mono(k, "// short-term + long-term", { x: 1300, y: 600, size: 30, c: "var(--dim)", t: W("b3", "remembers") + .3 });
});
S("ex", W("b3", "unlike"), "paper", 6, k => {
  EM(k, "💔", { x: 80, y: 170, s: 480, t: W("b3", "unlike"), r: -6 });
  L(k, "unlike your", { f: "serif", x: 660, y: 190, size: 190, t: W("b3", "unlike") }); L(k, "ex.", { f: "serif", x: 660, y: 340, size: 600, c: "var(--ac)", t: W("b3", "ex") });
  SC(k, { x: 630, y: 360, w: 620, h: 470, t: W("b3", "ex") + .25, c: "var(--fg)" });
  TO(k, { t: W("b3", "ex") + .3, icon: "💬", title: "ex", msg: "we need to talk (read 2019)", x: 1240, y: 640, w: 590 });
});
S("anymodel", LS("b4"), "orange", 6, k => {
  L(k, "ANY MODEL.", { x: 70, y: 140, size: 300, fit: 1700, t: LS("b4") });
  ["Anthropic Claude", "Amazon Nova", "Meta Llama", "DeepSeek", "Qwen", "Kimi", "MiniMax", "Cohere", "Mistral", "OpenAI", "Google Gemini", "LiteLLM"].forEach((x, i) =>
    PN(k, { x: 80 + (i % 4) * 440, y: 470 + Math.floor(i / 4) * 120, w: 410, h: 92, bd: "3px solid var(--fg)", r: 46, bg: i % 5 == 0 ? "var(--fg)" : "transparent", c: i % 5 == 0 ? "var(--bg)" : "var(--fg)", t: LS("b4") + .2 + i * .07, snd: i % 4 == 0,
      html: `<div style="font:800 28px/86px 'JetBrains Mono';text-align:center">${x}</div>` }));
});
S("switch", W("b4", "switch"), "ink", 6, k => {
  PN(k, { x: 80, y: 150, w: 1120, h: 690, bd: "3px solid var(--fg)", t: k.t0, wipe: true, html: "" });
  PN(k, { x: 880, y: 170, w: 300, h: 60, bd: "3px solid var(--fg)", r: 30, t: k.t0 + .1, snd: false, html: `<div style="font:800 26px/54px 'JetBrains Mono';text-align:center">MODEL A ▾</div>` });
  const b2 = PN(k, { x: 880, y: 170, w: 300, h: 60, bg: "var(--ac)", c: "#0B0B0C", bd: "3px solid var(--fg)", r: 30, snd: false, html: `<div style="font:800 26px/54px 'JetBrains Mono';text-align:center">MODEL B ▾</div>` });
  k.tl.fromTo(b2, { opacity: 0 }, { opacity: 1, duration: .05 }, W("b4", "switch") + .75);
  const msg = (y, t, txt, me) => PN(k, { x: me ? 560 : 110, y, w: 600, h: 90, bg: me ? "var(--fg)" : "transparent", c: me ? "var(--bg)" : "var(--fg)", bd: "3px solid var(--fg)", r: 18, t, snd: false, html: `<div style="font:600 27px/86px 'JetBrains Mono';padding:0 22px">${txt}</div>` });
  msg(270, k.t0 + .25, "Plan a 5-day Tokyo trip", true); msg(390, k.t0 + .5, "Day 1: Asakusa, then…", false); msg(540, W("b4", "switch") + .95, "Add a day trip to Kyoto", true); msg(660, W("b4", "keep") + .05, "Sure — day 6: Kyoto ✓", false);
  CU(k, [{ x: 1400, y: 560, t: W("b4", "switch") - .05 }, { x: 1040, y: 205, t: W("b4", "switch") + .7, click: true }]);
  L(k, "SWITCH", { x: 1290, y: 190, size: 260, fit: 560, t: W("b4", "switch") }); L(k, "MID-SESSION", { x: 1290, y: 400, size: 100, fit: 560, c: "var(--ac)", t: W("b4", "mid") });
  ST(k, "context kept ✓", { x: 1240, y: 640, r: 4, t: W("b4", "context"), size: 34 });
});
S("cli", LS("b5"), "paper", 6, k => {
  L(k, "DEPLOY FROM THE CLI.", { x: 70, y: 150, size: 300, fit: 1720, t: LS("b5") });
  PN(k, { x: 80, y: 470, w: 1300, h: 340, bg: "#0B0B0C", bd: "3px solid var(--fg)", t: W("b5", "cli"), wipe: true, html: "" });
  TY(k, { x: 116, y: 505, size: 38, c: "#EEE8DD", text: "$ agentcore deploy\n⠿ creating harness…\n✔ deployed", t: W("b5", "cli") + .1, cps: 16 });
  ST(k, "npm i -g @aws/agentcore", { x: 1080, y: 800, r: 3, t: W("b5", "cli") + .8, size: 28 });
});
S("grass", W("b5", "now"), "orange", 6, k => {
  L(k, "NOW GO", { x: 70, y: 150, size: 300, fit: 1300, t: W("b5", "now") }); L(k, "TOUCH GRASS.", { x: 70, y: 430, size: 420, fit: 1700, t: W("b5", "touch") });
  EM(k, "🌱", { x: 1460, y: 150, s: 260, t: W("b5", "grass") + .1, wob: 3 });
});
// ---- 07-10 PILLARS
S("p0", LS("p0"), "ink", 7, k => {
  L(k, "NOW THE PART", { x: 70, y: 140, size: 190, fit: 1300, t: W("p0", "now") }); L(k, "THAT MAKES", { x: 70, y: 320, size: 190, fit: 1300, t: W("p0", "that") });
  L(k, "OTHER SETUPS", { x: 70, y: 500, size: 190, fit: 1300, c: "var(--ac)", t: W("p0", "other") }); L(k, "SWEAT.", { x: 70, y: 690, size: 190, fit: 1300, t: W("p0", "sweat") });
  EM(k, "😅", { x: 1450, y: 620, s: 250, t: W("p0", "sweat") + .05, wob: 3 }); EM(k, "💦", { x: 1650, y: 400, s: 170, t: W("p0", "sweat") + .2, wob: 4 });
}, { cut: "whoosh" });
S("scale", LS("p1a"), "paper", 8, k => {
  mono(k, "// PILLAR 1 OF 3", { x: 80, y: 120, size: 34, t: LS("p1a") });
  L(k, "01", { x: 60, y: 170, size: 500, t: W("p1a", "one") }); L(k, "SCALE", { x: 60, y: 620, size: 220, fit: 640, c: "var(--ac)", t: W("p1a", "scale") });
  PN(k, { x: 760, y: 150, w: 1060, h: 640, bd: "6px dashed var(--fg)", t: W("p1a", "hostel") - .2, wipe: true, html: `<div class="f-mono" style="font:800 30px 'JetBrains Mono';padding:14px 22px">HOSTEL · ONE BOX</div>` });
  const r = rnd(21); for (let i = 0; i < 32; i++) { const e = EM(k, "🧍", { x: 800 + (i % 8) * 125 + r() * 20, y: 230 + Math.floor(i / 8) * 130 + r() * 20, s: 96, t: W("p1a", "hostel") + .1 + i * .045, snd: false }); WOB.push({ el: e, ph: i, amp: 2 }); }
  ST(k, "one box.", { x: 1500, y: 820, r: -5, t: W("p1a", "box"), size: 44 });
}, { cut: "whoosh" });
S("hotel", LS("p1b"), "ink", 8, k => {
  L(k, "HOTEL", { x: 70, y: 130, size: 360, fit: 900, t: W("p1b", "hotel") });
  mono(k, "1 session = 1 private room", { x: 960, y: 190, size: 36, c: "var(--ac)", t: W("p1b", "guest") });
  for (let i = 0; i < 12; i++) { const x = 80 + (i % 6) * 292, y = 470 + Math.floor(i / 6) * 200;
    PN(k, { x, y, w: 270, h: 175, bd: "3px solid var(--fg)", r: 6, t: W("p1b", "guest") + i * .08, snd: i < 3, html: `<div class="f-mono" style="font:700 22px 'JetBrains Mono';padding:10px 14px;color:var(--dim)">ROOM ${101 + i}</div>` });
    IC(k, "l:lock", { x: x + 100, y: y + 60, s: 80, c: "var(--ac)", sw: 2, t: W("p1b", "locked") + i * .07, pop: false }); if (i < 4) cue("lock", W("p1b", "locked") + i * .07, .7); }
});
S("triple", LS("p1c"), "orange", 8, k => {
  [["ONE SESSION", "l:user-round", "a private room per user", W("p1c", "one")], ["ONE MICROVM", "l:server", "Firecracker microVM", W("p1c", "microvm")], ["UP TO 8 H", "l:clock", "max lifetime · default 28800 s", W("p1c", "up")]].forEach(([w, ic, sub, t], i) => {
    const y = 140 + i * 250; L(k, w, { x: 70, y, size: 210, fit: 1050, t }); mono(k, "// " + sub, { x: 80, y: y + 205, size: 28, t: t + .25 }); IC(k, ic, { x: 1250, y: y - 10, s: 190, sw: 1.4, t: t + .1 }); });
});
S("ten", LS("p1d"), "paper", 8, k => {
  CN(k, { x: 70, y: 110, size: 420, from: 10, to: 5000, t: LS("p1d") + .05, dur: W("p1d", "thousand") - LS("p1d") });
  L(k, "concurrent sessions", { f: "serif", x: 80, y: 500, size: 90, t: LS("p1d") + .1 });
  const sq = []; for (let i = 0; i < 100; i++) sq.push(box(k, { left: 80 + (i % 20) * 50, top: 640 + Math.floor(i / 20) * 24, width: 40, height: 14, background: "var(--fg)" }));
  k.tl.fromTo(sq, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: (W("p1d", "thousand") - LS("p1d")) / 110, duration: .12 }, LS("p1d") + .05);
  mono(k, "// default quota: active session workloads", { x: 80, y: 780, size: 22, c: "var(--dim)", t: W("p1d", "thousand") }); mono(k, "// us-east-1 / us-west-2 · adjustable", { x: 80, y: 812, size: 22, c: "var(--dim)", t: W("p1d", "thousand") + .1 });
  L(k, "0", { x: 1200, y: 110, size: 380, t: W("p1d", "zero") }); L(k, "SERVERS", { x: 1200, y: 470, size: 130, fit: 620, t: W("p1d", "servers") });
  mono(k, "// for you to run", { x: 1200, y: 610, size: 34, t: W("p1d", "run") }); ST(k, "scales on demand", { x: 1200, y: 700, r: -4, t: W("p1d", "run") + .1, size: 34 });
});
S("sec", LS("p2a"), "ink", 9, k => {
  mono(k, "// PILLAR 2 OF 3", { x: 80, y: 115, size: 34, t: LS("p2a") });
  L(k, "02", { x: 60, y: 150, size: 300, t: W("p2a", "two") }); L(k, "SECURITY", { x: 400, y: 150, size: 300, fit: 1300, c: "var(--ac)", t: W("p2a", "security") });
  IC(k, "l:shield-check", { x: 1640, y: 150, s: 180, t: W("p2a", "security") + .1 });
  L(k, "WHEN A SESSION ENDS,", { x: 70, y: 480, size: 200, fit: 1760, t: W("p2a", "when") }); ST(k, "session over.", { x: 80, y: 760, r: -3, t: W("p2a", "ends") + .2, size: 34 });
}, { cut: "whoosh" });
S("shatter", W("p2a", "microvm"), "orange", 9, k => {
  const tt = W("p2a", "terminated"), r = rnd(31);
  for (let i = 0; i < 18; i++) { const x = 520 + (i % 6) * 140, y = 470 + Math.floor(i / 6) * 140, q = box(k, { left: x, top: y, width: 132, height: 132, background: "var(--fg)", border: "3px solid var(--bg)" });
    k.tl.fromTo(q, { scale: 0 }, { scale: 1, duration: .25, ease: "back.out(2)" }, k.t0 + .03 * i);
    const ang = Math.atan2(y - 540, x - 960) + (r() - .5) * .8, d = 500 + r() * 800;
    k.tl.to(q, { x: Math.cos(ang) * d, y: Math.sin(ang) * d + 250, rotation: (r() - .5) * 720, opacity: 0, duration: .8, ease: "power2.in", immediateRender: false }, tt); }
  const lab = box(k, { left: 520, top: 585 }, `<div class="f-mono" style="font:800 46px 'JetBrains Mono';color:var(--bg);width:830px;text-align:center">microVM</div>`);
  k.tl.fromTo(lab, { opacity: 0 }, { opacity: 1, duration: .1 }, k.t0 + .3); k.tl.to(lab, { opacity: 0, duration: .05, immediateRender: false }, tt);
  L(k, "TERMINATED.", { x: 70, y: 150, size: 300, fit: 1720, t: tt }); cue("crash", tt);
});
S("wipe", W("p2a", "and"), "ink", 9, k => {
  L(k, "MEMORY", { x: 70, y: 150, size: 300, fit: 900, t: W("p2a", "memory") }); L(k, "WIPED.", { x: 70, y: 400, size: 400, fit: 1100, c: "var(--ac)", t: W("p2a", "wiped") - .1 });
  const t0 = W("p2a", "memory"), t1 = LE("p2a") + .15;
  for (let i = 0; i < 48; i++) { const cx = 80 + (i % 16) * 108, cy = 700 + Math.floor(i / 16) * 62, c = box(k, { left: cx, top: cy, width: 92, height: 46, background: "var(--fg)" }); FADE(k, c, k.t0 + .01 * i, .1);
    k.tl.to(c, { opacity: 0, scale: .2, duration: .12, immediateRender: false }, t0 + .25 + (cx / 1800) * (t1 - t0 - .3)); }
  const b = EM(k, "🧹", { x: -220, y: 640, s: 230, t: k.t0, snd: false }); k.tl.to(b, { x: 2150, duration: t1 - t0 - .3, ease: "none", immediateRender: false }, t0 + .25); cue("sweep", t0 + .25);
  mono(k, "// memory sanitized", { x: 1150, y: 480, size: 34, c: "var(--dim)", t: W("p2a", "wiped") });
});
S("vault", LS("p2b"), "paper", 9, k => {
  L(k, "API KEYS", { x: 70, y: 150, size: 400, fit: 1500, t: W("p2b", "api") });
  const key = IC(k, "l:key-round", { x: 100, y: 620, s: 200, sw: 1.6, t: LS("p2b") + .1 }); k.tl.to(key, { x: 1000, duration: .6, ease: "power3.inOut", immediateRender: false }, W("p2b", "sit") - .2);
  IC(k, "l:vault", { x: 1250, y: 470, s: 380, sw: 1.3, t: W("p2b", "sit") - .1 }); cue("lock", W("p2b", "vault"));
  ST(k, "AgentCore Identity token vault", { x: 80, y: 790, r: -2, t: W("p2b", "vault") + .1, size: 30 });
});
S("never", W("p2b", "the"), "ink", 9, k => {
  EM(k, "🙈", { x: 80, y: 170, s: 430, t: W("p2b", "the"), wob: 2 });
  L(k, "NEVER", { x: 640, y: 150, size: 480, fit: 1150, c: "var(--ac)", t: W("p2b", "never") }); L(k, "SEES THEM.", { x: 640, y: 560, size: 180, fit: 1150, t: W("p2b", "sees") });
  PN(k, { x: 640, y: 780, w: 800, h: 80, bd: "3px solid var(--fg)", t: W("p2b", "sees") + .15, html: `<div style="font:700 32px/74px 'JetBrains Mono';padding:0 24px">API_KEY = ████████████</div>` });
});
S("obs", LS("p3a"), "orange", 10, k => {
  mono(k, "// PILLAR 3 OF 3", { x: 80, y: 115, size: 34, t: LS("p3a") });
  L(k, "03", { x: 60, y: 150, size: 260, t: W("p3a", "three") }); L(k, "OBSERVABILITY", { x: 340, y: 150, size: 260, fit: 1480, t: W("p3a", "observability") });
  PN(k, { x: 100, y: 470, w: 720, h: 350, bg: "var(--ac)", c: "#0B0B0C", bd: "4px solid var(--fg)", r: 22, t: W("p3a", "think"), html: `<div style="font:800 32px 'JetBrains Mono';padding:22px 30px;letter-spacing:.06em">FLIGHT RECORDER</div>` });
  const bars = []; for (let i = 0; i < 40; i++) bars.push(box(k, { left: 140 + i * 16, top: 640, width: 10, height: 10, background: "#0B0B0C" }));
  const rec = box(k, { left: 610, top: 495 }, `<span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:#0B0B0C;margin-right:10px;vertical-align:-3px"></span><span style="font:800 32px 'JetBrains Mono'">REC</span>`);
  LIVE.push(t => { if (t < k.t0 || t > k.t1) return; bars.forEach((b, i) => { const h = 20 + 150 * Math.abs(Math.sin(t * 3 + i * .55) * Math.sin(t * 1.6 + i * .21)); b.style.height = h + "px"; b.style.top = (650 - h / 2) + "px"; }); rec.style.opacity = (Math.floor(t * 1.6) % 2) ? .3 : 1; });
  L(k, "BLACK", { x: 900, y: 440, size: 230, fit: 900, t: W("p3a", "flight") }); L(k, "BOX.", { x: 900, y: 640, size: 230, fit: 900, c: "var(--ac)", t: W("p3a", "black") });
}, { cut: "whoosh" });
S("wf", LS("p3b"), "paper", 10, k => {
  const row = (label, y, tt, bars, hh, bg) => { L(k, label, { x: 80, y: y + 20, size: 66, fit: 250, t: tt }); bars.forEach((b, i) => PN(k, { x: 360 + b[0], y: y + (110 - hh) / 2, w: b[1], h: hh, bg, bd: "3px solid var(--fg)", t: tt + .08 * i, wipe: true, snd: i === 0, html: "" })); };
  row("SESSION", 200, W("p3b", "session"), [[0, 1400]], 110, "var(--fg)"); row("TRACE", 380, W("p3b", "trace"), [[0, 440], [470, 520], [1020, 380]], 110, "var(--ac)");
  row("STEP", 560, W("p3b", "step"), [[0, 130], [150, 240], [400, 70], [490, 180], [690, 150], [860, 220], [1100, 110], [1230, 170]], 90, "var(--bg)");
  mono(k, "// session → trace → step", { x: 360, y: 150, size: 30, c: "var(--dim)", t: LS("p3b") }); ST(k, "traced automatically", { x: 1200, y: 740, r: 3, t: W("p3b", "step") + .4, size: 34 });
});
S("moves", W("p3b", "every"), "ink", 10, k => {
  L(k, "EVERY MOVE", { x: 70, y: 140, size: 350, fit: 1740, t: W("p3b", "every") }); L(k, "RECORDED.", { x: 70, y: 480, size: 290, fit: 1740, c: "var(--ac)", t: W("p3b", "recorded") });
  ["model call", "tool call", "memory op", "shell command"].forEach((x, i) => PN(k, { x: 80 + i * 440, y: 780, w: 410, h: 80, bd: "3px solid var(--fg)", r: 40, t: W("p3b", "move") + .1 + i * .15, snd: i === 0, html: `<div style="font:700 28px/74px 'JetBrains Mono';text-align:center">${x}</div>` }));
});
S("vs3", LS("p3c"), "orange", 10, k => {
  L(k, "versus you,", { f: "serif", x: 80, y: 130, size: 160, t: W("p3c", "you") }); L(k, "03:07 AM", { x: 60, y: 330, size: 420, fit: 1300, c: "var(--ac)", t: W("p3c", "3am") });
  EM(k, "😴", { x: 1480, y: 300, s: 240, t: W("p3c", "3am") + .1, wob: 3 }); EM(k, "☕", { x: 1600, y: 580, s: 160, t: W("p3c", "3am") + .3, wob: 3 });
  mono(k, "// prod is down. it is 3AM.", { x: 80, y: 780, size: 36, t: W("p3c", "3am") + .2 });
});
S("tabs", W("p3c", "hopping"), "paper", 10, k => {
  const tabs = []; for (let i = 0; i < 9; i++) tabs.push(PN(k, { x: 80 + i * 196, y: 170, w: 186, h: 70, bd: "3px solid var(--fg)", r: 8, t: k.t0 + i * .04, snd: false, html: `<div style="font:700 21px/64px 'JetBrains Mono';text-align:center">log-group-${i + 1}</div>` }));
  PN(k, { x: 80, y: 250, w: 1760, h: 520, bd: "3px solid var(--fg)", t: k.t0, wipe: true, html: `<div class="f-mono" style="font:600 28px 'JetBrains Mono';padding:26px 34px;color:var(--dim)">loading logs…<br>filter: ERROR | no results<br>time range: last 15 min<br>where is the request id???</div>` });
  const r = rnd(77), order = []; let prev = 0; for (let i = 0; i < 8; i++) { let n; do n = Math.floor(r() * 9); while (n === prev); order.push(n); prev = n; }
  const dur = Math.max(1.5, k.t1 - k.t0 - .8), hop = dur / 7, pts = [{ x: 900, y: 500, t: k.t0 + .1 }];
  order.forEach((n, i) => { const tt = k.t0 + .3 + i * hop; pts.push({ x: 80 + n * 196 + 80, y: 200, t: tt, click: true }); k.tl.set(tabs[n], { backgroundColor: "#FF9900" }, tt); if (i > 0) k.tl.set(tabs[order[i - 1]], { backgroundColor: "rgba(0,0,0,0)" }, tt); });
  CU(k, pts); ST(k, "9 tabs. no root cause.", { x: 1180, y: 800, r: 3, t: W("p3c", "groups") - .2, size: 32 });
});
// ---- 11 PRICING
S("pr1", LS("pr1"), "ink", 11, k => {
  L(k, "PRICING.", { x: 70, y: 130, size: 260, fit: 860, t: LS("pr1") }); L(k, "ACTIVE CPU", { x: 950, y: 170, size: 200, fit: 880, c: "var(--ac)", t: W("pr1", "active") });
  bar(k, 470, false); mono(k, "// you pay for the busy bits", { x: 80, y: 670, size: 40, t: W("pr1", "cpu") }); ST(k, "per-second billing", { x: 1300, y: 660, r: 3, t: W("pr1", "cpu") + .2, size: 34 });
}, { cut: "whoosh" });
S("pr2", LS("pr2"), "orange", 11, k => {
  L(k, "WAITING ON THE MODEL?", { x: 70, y: 130, size: 170, fit: 1760, t: LS("pr2") });
  mono(k, "// memory is still billed while the session runs", { x: 80, y: 320, size: 24, c: "var(--dim)", t: W("pr2", "billed") });
  const segs = bar(k, 400, true), a = W("pr2", "model"), b = W("pr2", "billed") + .3;
  const ph = box(k, { left: 80, top: 375, width: 6, height: 210, background: "var(--fg)" }), cnt = box(k, { left: 1000, top: 590, fontSize: 44, width: 840, textAlign: "right" }, "", "f-mono b");
  LIVE.push(t => { const p = Math.min(1, Math.max(0, (t - a) / (b - a))); ph.style.left = (80 + 1760 * p) + "px"; let billed = 0; segs.forEach(s => { if (s.ty === "b") billed += Math.max(0, Math.min(p, s.x0 + s.w) - s.x0); }); cnt.textContent = `cpu-seconds billed: ${(billed * 20).toFixed(1)}`; });
  L(k, "NO CPU BILLED.", { x: 70, y: 660, size: 240, fit: 1760, t: W("pr2", "no") }); EM(k, "😴", { x: 1620, y: 130, s: 150, t: W("pr2", "waiting") + .1, wob: 3 });
});
S("pr3", LS("pr3"), "paper", 11, k => {
  L(k, "THE HARNESS FEE?", { x: 70, y: 150, size: 200, fit: 1760, t: W("pr3", "the") });
  L(k, "$0", { x: 60, y: 350, size: 560, c: "var(--ac)", t: W("pr3", "zero") }); ST(k, "no additional harness charge", { x: 900, y: 500, r: -4, t: W("pr3", "dollars") + .1, size: 34 });
  mono(k, "// you pay for what it uses", { x: 900, y: 620, size: 32, t: W("pr3", "dollars") + .25 });
});
// ---- 12 OPS
S("opsA", LS("ops1"), "ink", 12, k => {
  L(k, "OPS IS BUILT IN.", { x: 70, y: 130, size: 150, fit: 1760, t: LS("ops1") });
  L(k, "VERSIONS", { x: 80, y: 310, size: 150, c: "var(--ac)", t: W("ops1", "versions") }); L(k, "ROLLBACKS", { x: 900, y: 310, size: 150, c: "var(--ac)", t: W("ops1", "rollbacks") });
  [0, 1, 2].forEach(i => { vbox(k, i, W("ops1", "versions") + .1 + i * .15, { y: 520, h: 200, bg: i === 2 ? "var(--fg)" : "transparent", c: i === 2 ? "var(--bg)" : "var(--fg)" }); IC(k, "l:lock", { x: 100 + i * 560 + 430, y: 535, s: 56, sw: 2, c: i === 2 ? "var(--bg)" : "var(--fg)", t: W("ops1", "versions") + .3 + i * .15, pop: false }); });
  const pill = PN(k, { x: 1230, y: 760, w: 420, h: 70, bg: "var(--ac)", c: "#0B0B0C", r: 40, t: W("ops1", "versions") + .6, html: `<div style="font:800 26px/66px 'JetBrains Mono';text-align:center">▲ prod endpoint</div>` });
  k.tl.to(pill, { x: -560, duration: .5, ease: "power3.inOut", immediateRender: false }, W("ops1", "rollbacks") + .5); cue("whoosh", W("ops1", "rollbacks") + .5, .5);
});
S("opsB", W("ops1", "evals"), "paper", 12, k => {
  RL(k, { x: 958, y: 130, w: 6, h: 700, t: k.t0, snd: false }); k.el.lastChild.style.transformOrigin = "50% 0";
  L(k, "EVALS", { x: 80, y: 140, size: 200, t: W("ops1", "evals") });
  ["helpfulness", "faithfulness", "safety"].forEach((x, i) => { const y = 430 + i * 130; mono(k, x, { x: 80, y: y + 15, size: 30, t: W("ops1", "evals") + .15 + i * .12 });
    PN(k, { x: 380, y, w: 500, h: 60, bd: "3px solid var(--fg)", t: W("ops1", "evals") + .15 + i * .12, wipe: true, snd: false, html: `<div style="height:100%;width:${[86, 78, 94][i]}%;background:var(--ac)"></div>` }); });
  mono(k, "// LLM-as-a-judge", { x: 80, y: 340, size: 30, c: "var(--dim)", t: W("ops1", "evals") + .1 });
  L(k, "A/B TESTS", { x: 1010, y: 140, size: 200, fit: 800, t: W("ops1", "ab") });
  ["A", "B"].forEach((x, i) => PN(k, { x: 1010 + i * 400, y: 420, w: 360, h: 360, bg: i ? "var(--ac)" : "var(--fg)", c: i ? "#0B0B0C" : "var(--bg)", bd: "4px solid var(--fg)", t: W("ops1", "ab") + .15 + i * .15, html: `<div style="font:400 300px/360px 'Anton';text-align:center">${x}</div>` }));
  mono(k, "// statistical significance", { x: 1010, y: 810, size: 30, c: "var(--dim)", t: W("ops1", "ab") + .5 });
});
S("export", LS("ops2"), "orange", 12, k => {
  L(k, "OUTGROW CONFIG?", { x: 70, y: 130, size: 170, fit: 1760, t: LS("ops2") }); L(k, "EXPORT TO CODE.", { x: 70, y: 330, size: 170, fit: 1760, t: W("ops2", "export") });
  PN(k, { x: 100, y: 570, w: 620, h: 260, bg: "#151517", bd: "3px solid var(--fg)", t: W("ops2", "export") + .1, html: `<div class="code" style="font-size:28px;padding:22px 30px;color:#EEE8DD"><span class="c-c"># config</span>\n<span class="c-k">model:</span> …\n<span class="c-k">tools:</span> …\n<span class="c-k">skills:</span> …</div>` });
  PN(k, { x: 1200, y: 570, w: 620, h: 260, bg: "#EEE8DD", c: "#0B0B0C", bd: "3px solid var(--fg)", t: W("ops2", "code") + .05, html: `<div class="code" style="font-size:28px;padding:22px 30px;color:#0B0B0C"><b>agent.py</b>\n<span style="color:#c26a00">from</span> strands <span style="color:#c26a00">import</span> Agent\n…</div>` });
  const ar = box(k, { left: 0, top: 0 }, `<svg width="1920" height="1080"><path d="M740 700 L1170 700 M1120 660 L1170 700 L1120 740" pathLength="1" stroke="#0B0B0C" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1 1"/></svg>`);
  k.tl.fromTo(ar.querySelector("path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .4, ease: "power2.inOut" }, W("ops2", "code")); cue("whoosh", W("ops2", "code"), .5);
  ST(k, "Strands Agents", { x: 1330, y: 850, r: -3, t: W("ops2", "code") + .3, size: 30 });
});
S("keep", W("ops2", "keep"), "paper", 12, k => {
  mono(k, "// keep", { x: 1000, y: 190, size: 40, t: k.t0 });
  [["MODEL", "model"], ["PROMPT", "prompt"], ["TOOLS", "tools"]].forEach(([t, w], i) => { L(k, t, { x: 70, y: 180 + i * 235, size: 240, t: W("ops2", w) }); IC(k, "l:check", { x: 760 + (i === 1 ? 60 : 0), y: 190 + i * 235, s: 200, c: "var(--ac)", sw: 3.2, t: W("ops2", w) + .1, pop: false }); cue("stamp", W("ops2", w) + .1, .6); });
  ST(k, "+ memory wiring, skills, container env", { x: 1000, y: 720, r: 3, t: W("ops2", "tools") + .3, size: 26 });
});
// ---- 13 SCOREBOARD (one continuous table, rows land on the spoken word)
const ROWS = [["SETUP", "glue code + infra", "2 API calls", "setup"], ["SCALE", "build your own isolation", "1 session = 1 microVM", "scale"], ["SECURITY", "roll your own", "microVM + token vault", "security"], ["OBSERVABILITY", "9 log-group tabs", "traces, automatic", "observability"]];
S("board", LS("sc1"), "ink", 13, k => {
  const c2 = 560, c3 = 1190;
  L(k, "DIY STACK", { x: c2, y: 130, size: 90, fit: 600, t: W("sc1", "diy") }); L(k, "AGENTCORE HARNESS", { x: c3, y: 130, size: 90, fit: 640, c: "var(--ac)", t: W("sc1", "agentcore") });
  mono(k, "// scoreboard", { x: 80, y: 150, size: 40, t: LS("sc1") }); RL(k, { x: 80, y: 260, w: 1760, h: 6, t: W("sc1", "diy"), snd: false });
  ROWS.forEach((r, i) => { const y = 300 + i * 150, at = W("sc2", r[3]);
    L(k, r[0], { x: 80, y, size: 64, fit: 440, t: at });
    const d = box(k, { left: c2, top: y + 8, width: 600, fontSize: 32 }, r[1], "f-mono"), h = box(k, { left: c3, top: y + 4, width: 640, fontSize: 36 }, r[2], "f-mono b");
    const stk = box(k, { left: c2 - 10, top: y + 30, width: 60 + r[1].length * 19, height: 8, background: "var(--fg)", transformOrigin: "0 50%" });
    const stamp = box(k, { left: c3 + 590, top: y - 10 }, `<div style="width:84px;height:84px;border-radius:50%;background:var(--ac);color:#0B0B0C;border:4px solid var(--fg);text-align:center;font:800 54px/74px 'JetBrains Mono'">✓</div>`);
    FADE(k, d, at + .1, .2); FADE(k, h, at + .35, .2); k.tl.fromTo(stk, { scaleX: 0 }, { scaleX: 1, duration: .3, ease: "expo.out" }, at + .55); cue("scribble", at + .55, .6);
    k.tl.fromTo(stamp, { scale: 2.4, opacity: 0, rotation: 20 }, { scale: 1, opacity: 1, rotation: -10, duration: .25, ease: "power4.in" }, at + .8); cue("stamp", at + 1.0); });
}, { cut: "whoosh" });
S("nec", LS("sc3"), "paper", 13, k => {
  L(k, "NOT EVEN", { x: 70, y: 130, size: 380, fit: 1740, t: W("sc3", "not") }); L(k, "CLOSE.", { x: 70, y: 490, size: 400, fit: 1300, c: "var(--ac)", t: W("sc3", "close") });
  L(k, "4 – 0", { f: "serif", x: 1230, y: 560, size: 300, t: W("sc3", "close") + .15 }); cue("crash", W("sc3", "close"), .8);
});
S("recap", LS("rc1"), "orange", 13, k => {
  mono(k, "// WHAT YOU TAKE HOME", { x: 80, y: 130, size: 40, t: LS("rc1") });
  [["2 API CALLS TO SHIP", W("rc2", "two")], ["1 PRIVATE MICROVM PER SESSION", W("rc2", "one")], ["EVERY STEP TRACED", W("rc3", "every")], ["$0 HARNESS FEE", W("rc3", "no")]].forEach(([t, at], i) => {
    mono(k, "0" + (i + 1), { x: 80, y: 250 + i * 160, size: 44, t: at }); L(k, t, { x: 220, y: 200 + i * 160, size: 130, fit: 1600, t: at + .05 }); cue("stamp", at + .3, .5); });
});
// ---- 14 VERDICT
S("v1a", LS("v1"), "ink", 14, k => {
  L(k, "your job is", { f: "serif", x: 80, y: 130, size: 150, t: LS("v1") }); L(k, "SHIPPING", { x: 70, y: 280, size: 300, fit: 1500, t: W("v1", "shipping") });
  L(k, "AGENTS.", { x: 70, y: 540, size: 300, fit: 1500, c: "var(--ac)", t: W("v1", "agents") }); IC(k, "l:rocket", { x: 1480, y: 470, s: 300, c: "var(--ac)", sw: 1.3, t: W("v1", "agents") + .05 });
}, { cut: "whoosh" });
S("v1c", W("v1", "not"), "paper", 14, k => {
  L(k, "NOT BABYSITTING", { x: 70, y: 150, size: 300, fit: 1740, t: W("v1", "not") }); L(k, "INFRASTRUCTURE", { x: 70, y: 450, size: 300, fit: 1740, t: W("v1", "infrastructure") });
  RL(k, { x: 60, y: 300, w: 1760, h: 22, c: "var(--ac)", t: W("v1", "babysitting") + .35 }); RL(k, { x: 60, y: 610, w: 1500, h: 22, c: "var(--ac)", t: W("v1", "infrastructure") + .45 });
  EM(k, "🍼", { x: 1620, y: 640, s: 190, t: W("v1", "babysitting") + .2, wob: 3 });
});
S("gob", LS("v2"), "orange", 14, k => { L(k, "GO BUILD.", { x: 50, y: 190, size: 700, fit: 1790, t: LS("v2") }); cue("crash", LS("v2"), .9); }, { cut: "none" });
S("cover", LS("v2") + .95, "paper", 14, k => {
  const t = k.t0; const mast = L(k, "AGENTCORE", { x: 40, y: 70, size: 420, fit: 1840, t }); mast.style.letterSpacing = "-.01em";
  L(k, "the Harness issue", { f: "serif", x: 90, y: 465, size: 100, t: t + .1 }); L(k, "GO BUILD.", { x: 70, y: 590, size: 280, fit: 1200, c: "var(--ac)", t: t + .15 });
  mono(k, "BY YUVAL AVIDANI — AWS GEN AI SUPERSTAR · YUV.AI", { x: 80, y: 860, size: 30, t: t + .3 });
  const r = rnd(99); let bars = ""; for (let i = 0, x = 0; x < 300; i++) { const w = 3 + Math.floor(r() * 9); bars += `<rect x="${x}" y="0" width="${w}" height="120" fill="#0B0B0C"/>`; x += w + 3 + Math.floor(r() * 7); }
  PN(k, { x: 1440, y: 590, w: 380, h: 250, bg: "#EEE8DD", bd: "3px solid var(--fg)", t: t + .25, html: `<svg width="320" height="120" style="margin:26px 30px 0">${bars}</svg><div class="f-mono" style="font:700 20px 'JetBrains Mono';text-align:center;margin-top:14px;color:#0B0B0C">ISSUE Nº01 · 29 SEP 2026</div><div class="f-mono" style="font:700 16px 'JetBrains Mono';text-align:center;margin-top:8px;color:#5a5a5a">docs.aws.amazon.com/bedrock-agentcore</div>` });
  ST(k, "SOURCES IN README", { x: 1080, y: 500, r: 4, t: t + .5, size: 24 });
}, { cut: "none" });
// pricing bar (used by pr1/pr2)
function bar(k, y, showIdle) { const SEG = [["b", .12], ["i", .16], ["b", .1], ["i", .2], ["b", .08], ["i", .22], ["b", .12]]; let x = 0; const out = [];
  SEG.forEach(([ty, w], i) => { const W_ = w * 1760;
    PN(k, { x: 80 + x, y, w: W_ - 6, h: 150, bg: ty === "b" ? "var(--ac)" : "transparent", bd: "3px solid var(--fg)", t: k.t0 + .12 + .07 * i, wipe: true, snd: false,
      html: (ty === "i" ? `<div style="position:absolute;inset:0;background:repeating-linear-gradient(135deg,var(--fg) 0 3px,transparent 3px 16px);opacity:.28"></div>` : "") + `<div class="f-mono" style="position:relative;font:800 24px/150px 'JetBrains Mono';text-align:center;${ty === "b" ? "color:#0B0B0C" : ""}">${ty === "b" ? "CPU busy" : (showIdle ? "waiting on model" : "")}</div>` });
    out.push({ ty, x0: x / 1760, w }); x += W_; }); return out; }
