// node render.mjs W H outdir [fps] [chunk]
import { chromium } from 'playwright-core'; import { spawn } from 'child_process'; import fs from 'fs';
const [,, W, H, out, FPS = '30', CH = '150'] = process.argv; const fps = +FPS, chunk = +CH, DUR = 70, N = Math.round(DUR * fps);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p = await b.newPage({viewport:{width:+W,height:+H}});
p.on('pageerror', e => console.log('[err]', e.message));
await p.goto(`http://localhost:8123/index.html?w=${W}&h=${H}`);
await p.waitForFunction(() => window.__ready === true, null, {timeout: 300000});
const t0 = Date.now(); let done = 0;
for (let s = 0; s < N; s += chunk) {
  const file = `${out}/seg_${String(s).padStart(5, '0')}.mp4`; if (fs.existsSync(file)) continue;
  const tmp = file + '.part.mp4';
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', tmp]);
  for (let f = s; f < Math.min(N, s + chunk); f++) {
    const url = await p.evaluate(t => { window.renderAt(t); return document.querySelector('canvas').toDataURL('image/jpeg', 0.96); }, f / fps);
    const buf = Buffer.from(url.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    done++;
    if (done % 30 === 0) { const el = (Date.now() - t0) / 1000; console.log(`${W}x${H} frame ${f}/${N}  ${(el / done).toFixed(2)}s/f  eta ${((N - f) * el / done / 60).toFixed(1)}min`); }
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); fs.renameSync(tmp, file);
}
console.log('DONE', W, H); await b.close();
