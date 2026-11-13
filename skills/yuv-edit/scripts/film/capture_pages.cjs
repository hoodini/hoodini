// real pages for B-roll: full-page PNG + DOM rects (source px, x1.5) of the elements to spotlight
// usage: node capture_pages.cjs pages.json   with [[name, url, [selectors...]], ...]  -> web/<name>.png + web/rects2.json
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const pages = JSON.parse(fs.readFileSync(process.argv[2]));
  const R = fs.existsSync('web/rects2.json') ? JSON.parse(fs.readFileSync('web/rects2.json')) : {};
  for (const [n, url, sels] of pages) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
    try {
      await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); await p.waitForTimeout(2500);
      for (const t of ['Accept', 'Accept all', 'Got it', 'OK', 'Accept All Cookies']) { const el = p.getByRole('button', { name: t }); if (await el.count()) await el.first().click().catch(() => {}); }
      await p.waitForTimeout(800);
      await p.screenshot({ path: `web/${n}.png`, fullPage: true });
      const dims = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
      const r = { W: dims[0] * 1.5, H: dims[1] * 1.5 };
      for (const s of sels) { const el = p.locator(s).first(); if (await el.count()) { const bb = await el.boundingBox().catch(() => null); if (bb) r[s] = [bb.x, bb.y + await p.evaluate(() => scrollY), bb.width, bb.height].map(v => Math.round(v * 1.5)); } }
      R[n] = r; console.log(n, JSON.stringify(r));
    } catch (e) { console.log(n, 'FAILED', e.message.slice(0, 120)); }
    await p.close();
  }
  fs.writeFileSync('web/rects2.json', JSON.stringify(R, null, 1)); await b.close();
})();
