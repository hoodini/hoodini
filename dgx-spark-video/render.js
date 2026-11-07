// Deterministic frame renderer: Playwright Chromium screenshots -> ffmpeg, split across parallel workers.
// usage: node render.js [--workers 4] [--fps 30] [--from s] [--to s] [--stills t1,t2,...] [--out dir]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
  if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
  return a;
}, []));
const FPS = +(args.fps || 30);
const WORKERS = +(args.workers || 4);
const OUT = args.out || path.join(__dirname, 'render');
const PAGE = 'file://' + path.join(__dirname, 'page', 'index.html');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto(PAGE);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  return page;
}

async function stills(times) {
  const browser = await chromium.launch();
  const page = await openPage(browser);
  fs.mkdirSync(OUT, { recursive: true });
  for (const t of times) {
    await page.evaluate(([t, f]) => window.seek(t, f), [t, Math.round(t * FPS)]);
    await page.screenshot({ path: path.join(OUT, `still_${t.toFixed(2).padStart(7, '0')}.png`) });
  }
  await browser.close();
}

async function worker(id, f0, f1) {
  const browser = await chromium.launch();
  const page = await openPage(browser);
  const file = path.join(OUT, `part_${String(id).padStart(2, '0')}.mkv`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '10', '-pix_fmt', 'yuv420p', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = f0; f < f1; f++) {
    await page.evaluate(([t, f]) => window.seek(t, f), [f / FPS, f]);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 150 === 0) console.log(`w${id} ${f - f0}/${f1 - f0}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  return file;
}

(async () => {
  if (args.stills) return stills(String(args.stills).split(',').map(Number));
  const probe = await chromium.launch();
  const p = await openPage(probe);
  const meta = await p.evaluate(() => ({ duration: window.DURATION, cues: window.CUES, cuts: window.CUTS }));
  await probe.close();
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'audio', 'cues.json'), JSON.stringify(meta, null, 1));
  if (args.cuesOnly) return console.log('cues written', meta.cues.length, 'dur', meta.duration);
  const from = Math.round((+(args.from || 0)) * FPS), to = Math.round((+(args.to || meta.duration)) * FPS);
  const per = Math.ceil((to - from) / WORKERS);
  const jobs = [];
  for (let i = 0; i < WORKERS; i++) {
    const a = from + i * per, b = Math.min(to, a + per);
    if (a < b) jobs.push(worker(i, a, b));
  }
  const parts = await Promise.all(jobs);
  fs.writeFileSync(path.join(OUT, 'parts.txt'), parts.map(f => `file '${f}'`).join('\n'));
  console.log('done', parts.length, 'parts');
})();
