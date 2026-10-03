// fast low-res motion preview: node preview.mjs W H fps out.mp4
import { chromium } from 'playwright-core'; import { spawn } from 'child_process';
const [,, W, H, FPS, OUT] = process.argv; const fps = +FPS;
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p = await b.newPage({viewport:{width:+W,height:+H}});
p.on('pageerror', e => console.log('[err]', e.message));
await p.goto(`http://localhost:8123/film2.html?w=${W}&h=${H}`); await p.waitForFunction(() => window.__ready === true, null, {timeout: 300000});
const N = Math.round(81 * fps);
const ff = spawn('ffmpeg', ['-loglevel','error','-y','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p',OUT]);
for (let f = 0; f < N; f++) { const url = await p.evaluate(t => window.capture(t), f / fps); const buf = Buffer.from(url.split(',')[1], 'base64'); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (f % 120 === 0) console.log('frame', f, '/', N); }
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('DONE');
