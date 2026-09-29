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
  const p = Math.max(0, 1 - (t - s.t0) / .2); s.el.style.transform = `scale(${1 + .018 * p * p})`;   // gentle punch-in (calmer edit)
  if (t >= DROP && t < END) { const ph = ((t - DROP) / BEAT) % 1, amp = (t >= BREAK && t < REDROP) ? 0 : .004; world.style.transform = `scale(${1 + amp * Math.exp(-5 * ph)})`; } else world.style.transform = "none";
  for (const y of TYPERS) { const n = Math.max(0, Math.min(y.text.length, Math.floor((t - y.t0) * y.cps))); y.tx.textContent = y.text.slice(0, n); y.caret.style.opacity = t < y.t0 - .05 ? 0 : (n < y.text.length ? 1 : (Math.floor(t * 2.2) % 2 ? 0 : 1)); }
  for (const c of COUNTERS) { const q = Math.max(0, Math.min(1, (t - c.t0) / c.dur)); c.el.textContent = c.fmt(c.a + (c.b - c.a) * ease.out3(q)); }
  for (const w of WOB) w.el.style.rotate = (.4 * w.amp * Math.sin(t * 1.6 + w.ph)) + "deg";
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
