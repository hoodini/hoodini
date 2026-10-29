// Real B-roll from the web: full-page captures of the actual pages he talks about + DOM rects of what to highlight.
// The scroll / zoom / spotlight happen in the film (browserCard), so motion stays smooth at 60 fps.
// usage: node capture_web.cjs pages.json outDir
//   pages.json: [{"name": "pricing", "url": "https://claude.com/pricing", "height": 2400,
//                 "find": {"apiTab": "^API$", "pro": "^Pro$"}}]          (find = leaf-text regex -> rect)
// writes outDir/<name>.png (1440 css px wide, device scale 1.5) and outDir/rects.json {name: {W, H, key: [x,y,w,h]}}
// Check every rect on a crop of the image: live pages change, and a regex can match the nav instead of the tab.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , cfg, out] = process.argv; const S = 1.5;
(async () => {
  const jobs = JSON.parse(fs.readFileSync(cfg, 'utf8')); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const R = {};
  for (const j of jobs) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: S });
    await p.goto(j.url, { waitUntil: 'networkidle', timeout: 60000 }); await p.waitForTimeout(2500);
    await p.keyboard.press('Escape').catch(() => {});
    const rects = await p.evaluate((find) => {
      const o = {};
      for (const [k, re] of Object.entries(find || {})) {
        const R = new RegExp(re), el = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && R.test(e.textContent.trim()));
        o[k] = el.map(e => { const q = e.getBoundingClientRect(); return [q.x + scrollX, q.y + scrollY, q.width, q.height]; });
      }
      const h1 = document.querySelector('h1'); if (h1) { const q = h1.getBoundingClientRect(); o.h1 = [[q.x + scrollX, q.y + scrollY, q.width, q.height]]; }
      return o;
    }, j.find);
    const H = Math.min(j.height || 2400, await p.evaluate(() => document.documentElement.scrollHeight));
    await p.screenshot({ path: path.join(out, j.name + '.png'), fullPage: true, clip: { x: 0, y: 0, width: 1440, height: H } });
    R[j.name] = { W: 1440 * S, H: H * S };
    for (const [k, list] of Object.entries(rects)) R[j.name][k] = list.map(r => r.map(v => Math.round(v * S)));
    console.log(j.name, JSON.stringify(R[j.name])); await p.close();
  }
  fs.writeFileSync(path.join(out, 'rects.json'), JSON.stringify(R, null, 1)); await b.close();
})();
