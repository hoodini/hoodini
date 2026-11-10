// stills + contact sheets. usage: node tools/stills.mjs <film.html> <beats|sheet> <h,v> <scale> <outdir> [label]
const { chromium } = (await import(process.env.PW_PATH || 'playwright')).default ?? (await import(process.env.PW_PATH || 'playwright'));
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
const [film, which, lays = 'h,v', scaleS = '0.5', out = 'out/stills', label = ''] = process.argv.slice(2);
const scale = +scaleS; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--disable-gpu'] });
const errs = [];
for (const L of lays.split(',')) {
  const W = L === 'h' ? 1920 : 1080, H = L === 'h' ? 1080 : 1920;
  const p = await b.newPage({ viewport: { width: Math.round(W * scale), height: Math.round(H * scale) } });
  p.on('pageerror', e => errs.push(L + ' ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(L + ' ' + m.text()); });
  await p.goto('file://' + path.resolve(film) + `?L=${L}&scale=${scale}`);
  const ok = await p.evaluate(() => window.__ready); if (!ok) errs.push(L + ' fonts not ready');
  const F = await p.evaluate(() => window.FILM);
  const beats = which === 'sheet' ? Array.from({ length: F.NB + 1 }, (_, k) => k + 0.35) : which.split(',').map(Number);
  const files = [];
  for (const k of beats) {
    const t = Math.min(k * F.B, F.DUR - 0.01); await p.evaluate(t => window.seek(t, t), t);
    const f = path.join(out, `${L}_${String(k.toFixed(2)).padStart(6, '0')}${label}.png`); await p.screenshot({ path: f }); files.push(f);
  }
  // grid via ffmpeg tile
  const cols = which === 'sheet' ? (L === 'h' ? 6 : 10) : (L === 'h' ? 2 : 4);
  const rows = Math.ceil(files.length / cols);
  const list = path.join(out, `list_${L}.txt`); fs.writeFileSync(list, files.map(f => `file '${path.resolve(f)}'`).join('\n'));
  const grid = path.join(out, `${which === 'sheet' ? 'sheet' : 'grid'}_${L}${label}.jpg`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-vf', `tile=${cols}x${rows}:padding=6:color=white`, '-frames:v', '1', '-q:v', '3', grid]);
  console.log(L, files.length, 'stills ->', grid);
  await p.close();
}
await b.close();
console.log('ERRORS:', errs.length ? errs : 'none');
