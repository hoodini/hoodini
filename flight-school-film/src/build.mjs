// Generates the two native compositions (16:9 + 9:16) from one source.
// Same scenes, same clip times, same timeline code; only copy line breaks
// and layout tokens differ per aspect ratio.
//   node src/build.mjs
import { mkdirSync, writeFileSync, readFileSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const AR = {
  "16x9": { w: 1920, h: 1080, dir: "film-16x9" },
  "9x16": { w: 1080, h: 1920, dir: "film-9x16" },
};

// ---- copy helpers -------------------------------------------------------
// Copy is authored per AR as an array of lines (manual, balanced breaks).
// Tokens in {braces} are isolated with <bdi> (numbers, Latin, punctuation runs).
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const word = (w) =>
  `<span class="w">${esc(w).replace(/\{([^}]+)\}/g, "<bdi>$1</bdi>")}</span>`;
const lines = (arr) =>
  arr.map((l) => `<span class="ln">${l.split(" ").map(word).join(" ")}</span>`).join("");
const iso = (s) => esc(s).replace(/\{([^}]+)\}/g, "<bdi>$1</bdi>");

// ---- deterministic seeded PRNG (mulberry32) -----------------------------
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 247 license cards; exactly one lit in every group of four.
function licenseCards() {
  const r = rng(247);
  const out = [];
  for (let g = 0; g < 247; g += 4) {
    const n = Math.min(4, 247 - g);
    const lit = Math.floor(r() * n);
    for (let i = 0; i < n; i++) out.push(i === lit ? "on" : "off");
  }
  return out.map((s, i) => `<i class="card ${s}" data-i="${i}"></i>`).join("");
}

const COPY = {
  s2: { "16x9": ["רק {1} מכל {4}", "באמת משתמש."], "9x16": ["רק {1} מכל {4}", "באמת משתמש."] },
  s3: { "16x9": ["המטוסים עומדים", "על המסלול."], "9x16": ["המטוסים", "עומדים", "על המסלול."] },
  s6: { "16x9": ["מבחן גובה טיסה.", "{5} דקות."], "9x16": ["מבחן גובה טיסה.", "{5} דקות."] },
  s9: { "16x9": ["מודדים אימוץ. לא צפיות."], "9x16": ["מודדים אימוץ.", "לא צפיות."] },
};

const CURSOR = `<svg class="cursor" viewBox="0 0 24 32" aria-hidden="true"><path d="M2 2 L2 26 L8.5 20 L13 30 L17 28 L12.5 18.5 L21 18.5 Z" fill="#111418" stroke="#FBFAF6" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

function flightPath(ar) {
  // Starts exactly where the beat-3 runway sat (match cut), flat, then climbs
  // right-to-left (the RTL direction of progress).
  if (ar === "16x9")
    return `<svg class="path-svg" viewBox="0 0 1920 1080" aria-hidden="true">
      <path id="s5-path" d="M1920 766 L1180 766 C 900 766 700 700 520 520 S 260 190 170 150" fill="none" stroke="#111418" stroke-width="2"/>
      <path id="s5-head" d="M0 0 L-30 -11 L-30 11 Z" fill="#FF6A3D" transform="translate(170 150) rotate(-156)"/>
      <line x1="0" y1="767" x2="1920" y2="767" stroke="#D9D4C7" stroke-width="1"/>
    </svg>`;
  return `<svg class="path-svg" viewBox="0 0 1080 1920" aria-hidden="true">
      <path id="s5-path" d="M1080 1300 L760 1300 C 560 1300 420 1240 300 1100 S 150 860 110 800" fill="none" stroke="#111418" stroke-width="2"/>
      <path id="s5-head" d="M0 0 L-30 -11 L-30 11 Z" fill="#FF6A3D" transform="translate(110 800) rotate(-122)"/>
      <line x1="0" y1="1301" x2="1080" y2="1301" stroke="#D9D4C7" stroke-width="1"/>
    </svg>`;
}

function scenes(ar) {
  const parkedCount = ar === "16x9" ? 9 : 10;
  const depts = [
    ["תפעול", 72, true],
    ["כספים", 58],
    ["משאבי אנוש", 49],
    ["מכירות", 38],
  ];
  return `
  <!-- Beats 1–2 · 0.0–5.0 s · license grid (light) -->
  <section id="s12" class="clip scene light" data-start="0" data-duration="5" data-track-index="0">
    <div class="frame">
      <div class="copy">
        <p class="hl" dir="rtl" id="s2-hl">${lines(COPY.s2[ar])}</p>
        <p class="src" id="s2-src">IBM CEO Study 2026</p>
      </div>
      <div class="grid-wrap">
        <div class="counter" dir="rtl"><span class="num" id="s1-num">247</span><span class="lbl">רישיונות <bdi>AI</bdi> בארגון</span></div>
        <div class="cards" id="s12-cards">${licenseCards()}</div>
      </div>
    </div>
  </section>

  <!-- Beat 3 · 5.0–7.5 s · dark switch, runway -->
  <section id="s3" class="clip scene dark" data-start="5" data-duration="2.5" data-track-index="0">
    <div class="frame">
      <div class="copy"><p class="hl" dir="rtl" id="s3-hl">${lines(COPY.s3[ar])}</p></div>
    </div>
    <div class="parked" id="s3-parked">${Array.from({ length: parkedCount }, () => `<i class="card"></i>`).join("")}</div>
    <div class="runway" id="s3-runway">
      <div class="edge" style="top:0"></div><div class="center"></div><div class="edge" style="bottom:0"></div>
      <div class="keys">${"<i></i>".repeat(6)}</div>
    </div>
  </section>

  <!-- Beat 5 · 10.0–12.5 s · light switch, wordmark -->
  <section id="s5" class="clip scene light" data-start="10" data-duration="2.5" data-track-index="0">
    ${flightPath(ar)}
    <div class="frame">
      <div class="copy">
        <p class="wordmark" dir="ltr" id="s5-wm"><span class="ln">YUV.AI</span><span class="ln">Flight School</span></p>
        <p class="sub" dir="rtl" id="s5-sub">${ar === "16x9" ? lines(["בית הספר לטיסה של עידן {ה-AI}"]) : lines(["בית הספר לטיסה", "של עידן {ה-AI}"])}</p>
      </div>
    </div>
  </section>

  <!-- Beat 6 · 12.5–15.0 s · Flight Check -->
  <section id="s6" class="clip scene light" data-start="12.5" data-duration="2.5" data-track-index="0">
    <div class="frame">
      <div class="copy"><p class="hl" dir="rtl" id="s6-hl">${lines(COPY.s6[ar])}</p></div>
      <div class="app" id="s6-app">
        <div class="app-h">
          <span class="app-title" dir="ltr">Flight Check</span>
          <span class="tag" dir="rtl"><span class="av">מ</span>מיכל · תפעול</span>
        </div>
        <div class="steps"><i class="done"></i><i class="done"></i><i class="done"></i><i class="now"></i><i></i><i></i><i></i><i></i></div>
        <p class="q" dir="rtl">איך את מסכמת היום פגישה של שעה?</p>
        <div class="opts">
          <div class="opt sel" id="s6-opt1" dir="rtl"><span class="rd"></span><span>מדביקה תמליל ומבקשת סיכום</span>${CURSOR}</div>
          <div class="opt" dir="rtl"><span class="rd"></span><span>תבנית קבועה: סיכום ומשימות</span></div>
          <div class="opt" dir="rtl"><span class="rd"></span><span>עוד לא ניסיתי</span></div>
        </div>
        <p class="hint" dir="rtl">אין תשובה לא נכונה.</p>
        <div class="result">
          <span class="r-lbl" dir="rtl">גובה הטיסה שלך<span class="chip sun" id="s6-chip" dir="ltr">FL100</span></span>
          <span class="ladder" dir="rtl"><bdi>FL000</bdi><bdi class="on">FL100</bdi><bdi>FL250</bdi><bdi>FL400</bdi></span>
        </div>
      </div>
    </div>
  </section>

  <!-- Beat 9 · 20.0–22.5 s · Mission Control -->
  <section id="s9" class="clip scene light" data-start="20" data-duration="2.5" data-track-index="0">
    <div class="frame">
      <div class="copy"><p class="hl" dir="rtl" id="s9-hl">${lines(COPY.s9[ar])}</p></div>
      <div class="app" id="s9-app">
        <div class="app-h">
          <span class="app-title" dir="ltr">Mission Control</span>
          <span class="tag" dir="rtl" style="font-weight:400;color:#5F5D57">המחשה</span>
        </div>
        <div class="tabs" dir="rtl"><span>הפעלה</span><span class="cur">בונים פעילים</span><span>תוצרים בשימוש</span><span>שעות שנחסכו</span></div>
        <div class="dash">
          <div class="kpi" dir="rtl">
            <span class="lbl" style="color:#111418;font-weight:600">בונים פעילים בשבוע</span>
            <span class="big" id="s9-val">61%</span>
            <div class="meter" id="s9-meter">
              <div class="track"><div class="fill" id="s9-fill"></div></div>
              <div class="mark" style="right:50%"><b>יעד <bdi>50%</bdi></b></div>
              <span class="base" style="right:25%"><bdi>25%</bdi></span>
            </div>
          </div>
          <div class="depts" dir="rtl">
            ${depts.map(([n, v, mine]) => `<div class="dept${mine ? " mine" : ""}"><span>${n}</span><span class="bar"><i style="width:${v}%"></i></span></div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Beat 12 · 27.5–30.0 s · end card -->
  <section id="s12e" class="clip scene light" data-start="27.5" data-duration="2.5" data-track-index="0">
    <div class="frame">
      <p class="fh" dir="ltr" id="s12-fh">${ar === "16x9" ? `<span class="ln">Fly High with AI</span>` : `<span class="ln">Fly High</span><span class="ln">with AI</span>`}</p>
      <div class="rule"></div>
      <div class="aud" dir="rtl">
        <span><span class="k">לעובדים:</span> <bdi>Pilot</bdi></span>
        <span><span class="k">לארגונים:</span> <bdi>Squadron</bdi></span>
      </div>
      <div class="act">
        <span class="cta" dir="rtl">בדקו את גובה הטיסה שלכם</span>
        <span class="url" dir="ltr">yuv.ai</span>
      </div>
    </div>
  </section>`;
}

function page(ar) {
  const { w, h } = AR[ar];
  return `<!doctype html>
<html lang="he" data-ar="${ar}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${w}, height=${h}" />
    <title>YUV.AI Flight School · ${ar}</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/film.css" />
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="30" data-width="${w}" data-height="${h}">
${scenes(ar)}
    </div>
    <script>
${readFileSync(join(ROOT, "src/film.js"), "utf8")}    </script>
  </body>
</html>
`;
}

for (const ar of Object.keys(AR)) {
  const out = join(ROOT, AR[ar].dir);
  mkdirSync(out, { recursive: true });
  cpSync(join(ROOT, "assets"), join(out, "assets"), { recursive: true });
  cpSync(join(ROOT, "src/film.css"), join(out, "assets/film.css"));
  for (const f of ["hyperframes.json", "package.json"]) cpSync(join(ROOT, f), join(out, f));
  writeFileSync(join(out, "index.html"), page(ar));
  console.log("built", AR[ar].dir);
}
