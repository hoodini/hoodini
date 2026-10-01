// Deterministic frame render: Playwright screenshots → ffmpeg, split across parallel workers.
// usage: node build/render.mjs <h|v> [workers] [fromFrame] [toFrame]
import fs from 'fs';
import os from 'os';
import { spawn, execFileSync } from 'child_process';
import { launch, openPage, ROOT } from './common.mjs';
const fmt = process.argv[2] || 'h';
const workers = +(process.argv[3] || os.cpus().length);
const T = JSON.parse(fs.readFileSync(`${ROOT}/build/timing-${fmt}.json`));
const from = +(process.argv[4] || 0), to = +(process.argv[5] || T.FRAMES);
const tmp = `${ROOT}/build/tmp/${fmt}`; fs.mkdirSync(tmp, { recursive: true });
const per = Math.ceil((to - from) / workers);
const t0 = Date.now();
async function worker(w) {
  const a = from + w * per, b = Math.min(to, a + per); if (a >= b) return null;
  const out = `${tmp}/seg${String(w).padStart(2, '0')}.mp4`;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(T.FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '10', '-pix_fmt', 'yuv420p', '-r', String(T.FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
  const browser = await launch(); const page = await openPage(browser, fmt);
  for (let f = a; f < b; f++) {
    await page.evaluate(([t, f]) => window.seek(t, f), [f / T.FPS, f]);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (w === 0 && (f - a) % 60 === 0) console.log(`[${fmt}] w0 ${f - a}/${b - a}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await done; await browser.close(); return out;
}
const segs = (await Promise.all([...Array(workers).keys()].map(worker))).filter(Boolean);
fs.writeFileSync(`${tmp}/list.txt`, segs.map(s => `file '${s}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${tmp}/list.txt`, '-c', 'copy', `${tmp}/video.mp4`]);
console.log(`[${fmt}] rendered ${to - from} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s → ${tmp}/video.mp4`);
