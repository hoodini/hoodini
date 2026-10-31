// Render a footage-driven kit film. Like kit/render/render.js, but awaits window.prepare(t) before every frame
// so the footage frames each subframe needs are decoded first (seek stays pure; loading is outside it).
// usage: node render_edit.cjs film.html frames <f0> <f1> out.mp4 [subframes=6]
//        node render_edit.cjs film.html stills <t1,t2,...> outDir
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const [, , film, mode, a1, a2, a3, subs] = process.argv;
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const LAY = process.env.LAYOUT || 'h', VP = LAY === 'v' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };   // LAYOUT=v renders the 9:16 cut
  const page = await browser.newPage({ viewport: VP, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  await page.goto('file://' + path.resolve(film) + '?L=' + LAY);
  await page.evaluate(() => window.__ready);
  const ok = await page.evaluate(() => ['700 100px Karantina', '700 40px Assistant', '400 100px Anton', '700 30px "JetBrains Mono"', '400 60px "Gveret Levin"'].every(f => document.fonts.check(f, 'אבג abc')));
  if (!ok) { console.error('FONTS NOT LOADED - abort'); process.exit(2); }
  if (mode === 'stills') {
    fs.mkdirSync(a2, { recursive: true });
    for (const s of a1.split(',')) {
      const t = +s; await page.evaluate(t => window.prepare(t, 1), t); await page.evaluate(t => window.renderFrame(t, 1), t);
      await page.screenshot({ path: path.join(a2, `t${t.toFixed(2).padStart(7, '0')}.png`) });
    }
    await browser.close(); return;
  }
  const f0 = +a1, f1 = +a2, out = a3, SUB = +(subs || 6);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', '60', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', out]);
  ff.stderr.on('data', d => process.stderr.write(d));
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    const t = f / 60;
    await page.evaluate(([t, n]) => window.prepare(t, n), [t, SUB]);
    await page.evaluate(([t, n]) => window.renderFrame(t, n, 0.5, 60), [t, SUB]);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 120 === 0) console.log(`frame ${f}/${f1} · ${((f - f0 + 1) / ((Date.now() - t0) / 1000)).toFixed(1)} fps`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('DONE', out, ((Date.now() - t0) / 1000).toFixed(1) + 's');
})().catch(e => { console.error(e); process.exit(1); });
