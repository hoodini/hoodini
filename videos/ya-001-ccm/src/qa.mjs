// QA: one still per shot late in its hold + automated checks (fonts, overflow, safe zone, overlaps, min size).
// Usage: node qa.mjs --fmt A
import fs from 'node:fs';
import path from 'node:path';
import { serve, launch, openPage, ROOT } from './lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((a) => a.trim().split(/\s+/)));
const FMT = (args.fmt || 'A').toUpperCase();
const OUT = path.join(ROOT, 'qa', FMT);
fs.mkdirSync(OUT, { recursive: true });
const ALLOWED = new Set(['Assistant', 'Anton', 'Oswald', 'IBM Plex Mono']);

const { server, url } = await serve();
const browser = await launch();
const pg = await openPage(browser, `${url}/index.html?fmt=${FMT}`, null);
const TIMING = await pg.evaluate(() => window.TIMING);
const cdp = await pg.context().newCDPSession(pg);
await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
const issues = [];
const fontIssue = new Set();
const report = [];

for (const s of TIMING.shots) {
  const t = Math.max(s.start + 0.5, s.end - 0.25);
  const f = Math.round(t * 30);
  await pg.evaluate(([t, f]) => window.seek(t, f), [t, f]);
  const file = path.join(OUT, `shot_${String(TIMING.shots.indexOf(s) + 1).padStart(2, '0')}_${s.key}.png`);
  await pg.screenshot({ path: file });

  // fonts actually used to paint every visible text node
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '#stage .wi, #stage .ct, #stage .chip, #stage .mono, #stage .code, #stage .txt, #stage .wordmark span, #stage .lab, #stage .val' });
  const used = new Set();
  for (const id of nodeIds) {
    try {
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id });
      fonts.forEach((x) => { used.add(x.familyName); if (!x.isCustomFont || ![...ALLOWED].some((a) => x.familyName.startsWith(a))) issues.push(`[${s.key}] fallback font "${x.familyName}" (${x.glyphCount} glyphs)`); });
    } catch (e) { /* node without layout */ }
  }

  const res = await pg.evaluate((FMT) => {
    const W = FMT === 'A' ? 1920 : 1080, H = FMT === 'A' ? 1080 : 1920;
    const vis = (e) => e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && (() => { let o = 1; for (let n = e; n && n !== document.body; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o > 0.05; })();
    const out = { problems: [], boxes: [] };
    const texts = [...document.querySelectorAll('#stage .card, #stage .chip, #chrome .ct')].filter(vis);
    for (const e of texts) {
      const r = e.getBoundingClientRect();
      const name = (e.className + ' ' + (e.textContent || '').trim().slice(0, 24)).trim();
      if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > H + 1) out.problems.push(`off-stage: ${name} ${JSON.stringify([r.left, r.top, r.right, r.bottom].map(Math.round))}`);
      if (FMT === 'B' && (r.top < 219 || r.bottom > 1541 || r.right > W - 119 || r.left < 79)) out.problems.push(`outside 9:16 safe zone: ${name} ${JSON.stringify([r.left, r.top, r.right, r.bottom].map(Math.round))}`);
      if (e.classList.contains('card') && (e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 2)) out.problems.push(`overflow: ${name} ${e.scrollWidth}x${e.scrollHeight} > ${e.clientWidth}x${e.clientHeight}`);
      out.boxes.push({ name, r: [r.left, r.top, r.right, r.bottom], hl: e.matches('.hl, .notam'), inVis: !!e.closest('.vis') });
    }
    // headline / NOTAM cards must not overlap the visual column
    const hls = out.boxes.filter((b) => b.hl), vs = out.boxes.filter((b) => b.inVis);
    for (const a of hls) for (const b of vs) {
      const ix = Math.min(a.r[2], b.r[2]) - Math.max(a.r[0], b.r[0]), iy = Math.min(a.r[3], b.r[3]) - Math.max(a.r[1], b.r[1]);
      if (ix > 2 && iy > 2) out.problems.push(`overlap: ${a.name} × ${b.name}`);
    }
    // minimum text size and no italics
    for (const e of document.querySelectorAll('#stage .wi, #stage .chip, #stage .ct, #stage .code, #stage .txt, #stage .lab, #stage .val, #stage .mono')) {
      if (!vis(e) || !(e.textContent || '').trim()) continue;
      const cs = getComputedStyle(e);
      if (cs.fontStyle !== 'normal') out.problems.push(`italic: ${e.textContent.slice(0, 20)}`);
      if (FMT === 'B' && parseFloat(cs.fontSize) < 43.5) out.problems.push(`text < 44px (${cs.fontSize}): ${e.textContent.trim().slice(0, 24)}`);
    }
    return out;
  }, FMT);
  res.problems.forEach((p) => issues.push(`[${s.key}] ${p}`));
  report.push({ shot: s.id, key: s.key, t: +t.toFixed(3), still: path.relative(ROOT, file), fonts: [...used].sort() });
}
fs.writeFileSync(path.join(OUT, 'qa.json'), JSON.stringify({ fmt: FMT, issues, report }, null, 1));
await browser.close(); server.close();
console.log(`[qa ${FMT}] ${report.length} stills, ${issues.length} issues`);
issues.forEach((i) => console.log('  ' + i));
