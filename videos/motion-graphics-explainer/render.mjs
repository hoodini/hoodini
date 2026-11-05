// Usage: node render.mjs stills 1,5,20   |   node render.mjs video out.mp4 [audio.wav]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const [mode = 'video', arg = 'motion-graphics-explainer.mp4', audio] = process.argv.slice(2);
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
await page.goto(pathToFileURL(path.resolve('index.html')).href);
await page.evaluate(() => window.__ready);
await page.waitForTimeout(300);
const FPS = 30;
const total = await page.evaluate(() => window.TOTAL_FRAMES);

if (mode === 'stills') {
  fs.mkdirSync('stills', { recursive: true });
  for (const s of arg.split(',').map(Number)) {
    await page.evaluate(f => renderFrame(f), Math.round(s * FPS));
    await page.screenshot({ path: `stills/t${String(s).padStart(5, '0')}.png` });
  }
} else {
  const args = ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
  if (audio) args.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', arg);
  const ff = spawn(FFMPEG, args, { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < total; f++) {
    await page.evaluate(f => renderFrame(f), f);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.error(`frame ${f}/${total}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}
await browser.close();
