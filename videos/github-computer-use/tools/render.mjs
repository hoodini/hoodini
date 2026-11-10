// Renders frames [f0, f1) of the film into an H.264 segment.
// master: 60 fps, 6 subframes across half a frame (180-degree shutter) blended by ffmpeg tmix, BT.709.
// draft:  30 fps, half resolution, 1 subframe.
// usage: node tools/render.mjs <film.html> <h|v> <f0> <f1> <out.mp4> <master|draft>
// Chromium flags: on Yuval's Windows GPU use --use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist; in the cloud: software raster.
const { chromium } = (await import(process.env.PW_PATH || 'playwright')).default ?? (await import(process.env.PW_PATH || 'playwright'));
import { spawn } from 'child_process'; import path from 'path';
const [film, L, f0s, f1s, out, mode = 'master'] = process.argv.slice(2);
const f0 = +f0s, f1 = +f1s, M = mode === 'master';
const FPS = M ? 60 : 30, SUB = M ? 6 : 1, SCALE = M ? 1 : 0.5, SHUTTER = 0.5;
const W = (L === 'h' ? 1920 : 1080) * SCALE, H = (L === 'h' ? 1080 : 1920) * SCALE;
const args = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] : ['--disable-gpu'];
const b = await chromium.launch({ args });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
p.on('pageerror', e => { console.error('PAGEERROR', e.message); process.exit(3); });
await p.goto('file://' + path.resolve(film) + `?L=${L}&scale=${SCALE}`);
if (!(await p.evaluate(() => window.__ready))) { console.error('FONTS NOT LOADED - abort'); process.exit(2); }
const cdp = await p.context().newCDPSession(p);
const vf = (M ? `tmix=frames=${SUB}:weights='${Array(SUB).fill(1).join(' ')}',select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${FPS}*TB),` : '') + 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p';
const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-c:v', 'png', '-i', '-', '-vf', vf, '-r', String(FPS),
  '-c:v', 'libx264', '-preset', M ? 'medium' : 'veryfast', '-crf', M ? '14' : '20', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', out]);
ff.stderr.on('data', d => process.stderr.write(d));
const t0 = Date.now();
for (let f = f0; f < f1; f++) {
  const tf = f / FPS;
  for (let i = 0; i < SUB; i++) {
    const ts = SUB === 1 ? tf : tf - SHUTTER / FPS / 2 + SHUTTER / FPS * (i + 0.5) / SUB;
    await p.evaluate(([t, tf]) => window.seek(t, tf), [ts, tf]);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
    const buf = Buffer.from(data, 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  if ((f - f0) % 60 === 0) console.log(`${L} frame ${f}/${f1} · ${((f - f0 + 1) / ((Date.now() - t0) / 1000)).toFixed(2)} fps`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
console.log('DONE', out, ((Date.now() - t0) / 1000).toFixed(1) + 's');
