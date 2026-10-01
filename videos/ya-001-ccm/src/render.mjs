// Render the page frame by frame with Playwright Chromium and pipe PNGs into ffmpeg.
// Usage: node render.mjs --fmt A [--workers 4] [--from 0 --to N]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { serve, launch, openPage, BUILD } from './lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((a) => a.trim().split(/\s+/)));
const FMT = (args.fmt || 'A').toUpperCase();
const WORKERS = Number(args.workers || os.cpus().length);
fs.mkdirSync(BUILD, { recursive: true });

const SEEK = (f) => window.seek(f / 30, f);
const CAP = 'Page.captureScreenshot';
const SHOT = { format: 'png', optimizeForSpeed: true };
const png = (r) => Buffer.from(r.data, 'base64');

async function renderChunk(browser, url, a, b, out, clip) {
  const pg = await openPage(browser, url, clip);
  const cdp = await pg.context().newCDPSession(pg);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '10', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  // <evidence>
  for (let f = a; f < b; f++) {
    await pg.evaluate(SEEK, f);
    const r = await cdp
      .send(CAP, SHOT);
    ff.stdin.write(png(r));
  }
  // </evidence>
  ff.stdin.end();
  await done;
  await pg.close();
}

const t0 = Date.now();
const { server, url } = await serve();
const browser = await launch();
const probe = await openPage(browser, `${url}/index.html?fmt=${FMT}`, null);
const TIMING = await probe.evaluate(() => window.TIMING);
const CUES = await probe.evaluate(() => window.CUES);
const CUTS = await probe.evaluate(() => window.CUTS);
await probe.close();
fs.writeFileSync(path.join(BUILD, `timing_${FMT}.json`), JSON.stringify({ ...TIMING, cues: CUES, cuts: CUTS }, null, 1));
const clip = { x: 0, y: 0, width: TIMING.width, height: TIMING.height };
const from = Number(args.from || 0), to = Number(args.to || TIMING.frames);
const n = to - from, per = Math.ceil(n / WORKERS);
console.log(`[render ${FMT}] ${TIMING.width}x${TIMING.height} frames ${from}-${to} (${TIMING.duration.toFixed(3)} s) on ${WORKERS} workers`);
const chunks = [];
const jobs = [];
for (let k = 0; k < WORKERS; k++) {
  const a = from + k * per, b = Math.min(to, a + per);
  if (a >= b) break;
  const out = path.join(BUILD, `chunk_${FMT}_${k}.mp4`);
  chunks.push(out);
  jobs.push(renderChunk(browser, `${url}/index.html?fmt=${FMT}`, a, b, out, clip));
}
await Promise.all(jobs);
await browser.close();
server.close();
const list = path.join(BUILD, `chunks_${FMT}.txt`);
fs.writeFileSync(list, chunks.map((c) => `file '${path.resolve(c)}'`).join('\n'));
const video = path.join(BUILD, `video_${FMT}.mp4`);
await new Promise((res, rej) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', video], { stdio: 'inherit' })
  .on('close', (c) => (c === 0 ? res() : rej(new Error('concat ' + c)))));
const info = { fmt: FMT, frames: n, workers: chunks.length, seconds: (Date.now() - t0) / 1000 };
fs.writeFileSync(path.join(BUILD, `render_${FMT}.json`), JSON.stringify(info, null, 1));
console.log(`[render ${FMT}] done in ${info.seconds.toFixed(1)} s → ${video}`);
