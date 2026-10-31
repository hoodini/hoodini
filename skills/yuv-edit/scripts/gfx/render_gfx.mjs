// Render gfx jobs to transparent PNG sequences (and optional ProRes 4444 .mov for the NLE timeline).
// usage: node render_gfx.mjs jobs.json outDir [--mov]
// jobs.json: [{id, template, props, dur, fps, w, h, still?:true}]
//   still:true renders ONE frame at props.t (default 0) -> outDir/<id>.png (captions, static cards)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const [, , jobsPath, outDir, ...flags] = process.argv;
const wantMov = flags.includes('--mov');
const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const pages = Math.max(1, Number((flags.find((f) => f.startsWith('--pages=')) || '--pages=4').split('=')[1]));

async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(here, 'page.html'));
  const fonts = await page.evaluate(() => window.fontsOk());
  const missing = fonts.filter(([, ok]) => !ok).map(([f]) => f);
  if (missing.length) {
    console.error('FONTS NOT LOADED:', missing.join(', '), '- brand type would be wrong; aborting.');
    process.exit(2);
  }
  return page;
}

// a job is skipped when its spec is unchanged and its output exists (fast re-renders after an EDL tweak)
import crypto from 'node:crypto';
const codeHash = crypto.createHash('sha1').update(fs.readFileSync(path.join(here, 'gfx.js'))).update(fs.readFileSync(path.join(here, 'page.html'))).digest('hex');
const sig = (j) => codeHash + JSON.stringify(j); // template code changes invalidate the cache too
function upToDate(j) {
  const stamp = path.join(outDir, `${j.id}.job.json`);
  const out = j.still ? path.join(outDir, `${j.id}.png`) : path.join(outDir, j.id, '00000.png');
  return fs.existsSync(stamp) && fs.existsSync(out) && fs.readFileSync(stamp, 'utf8') === sig(j);
}

async function run(page, j) {
  const { id, template, props = {}, dur = 3, fps = 30, w = 1920, h = 1080 } = j;
  await page.setViewportSize({ width: w, height: h });
  await page.evaluate(([W, H]) => window.setup(W, H), [w, h]);
  const canvas = await page.$('#c');
  fs.mkdirSync(path.dirname(path.join(outDir, id)), { recursive: true });
  if (j.still) {
    await page.evaluate(([tp, t, p]) => window.draw(tp, t, p), [template, props.t ?? 0, { ...props, dur }]);
    await canvas.screenshot({ path: path.join(outDir, `${id}.png`), omitBackground: true });
  } else {
    const dir = path.join(outDir, id);
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const frames = Math.round(dur * fps);
    for (let f = 0; f < frames; f++) {
      await page.evaluate(([tp, t, p]) => window.draw(tp, t, p), [template, f / fps, { ...props, dur }]);
      await canvas.screenshot({ path: path.join(dir, String(f).padStart(5, '0') + '.png'), omitBackground: true });
    }
    if (wantMov) {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(dir, '%05d.png'),
        '-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', path.join(outDir, `${id}.mov`)]);
    }
    console.log(`gfx ${id}: ${template} ${frames}f`);
  }
  fs.writeFileSync(path.join(outDir, `${j.id}.job.json`), sig(j));
}

const todo = jobs.filter((j) => !upToDate(j));
const queue = [...todo];
await Promise.all(Array.from({ length: Math.min(pages, queue.length || 1) }, async () => {
  const page = await openPage();
  while (queue.length) await run(page, queue.shift());
}));
await browser.close();
console.log(`done: ${todo.length} rendered, ${jobs.length - todo.length} unchanged`);
