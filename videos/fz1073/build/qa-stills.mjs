// One still per shot, late in its hold, plus contact sheets and a font audit.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { launch, openPage, ROOT } from './common.mjs';
const out = `${ROOT}/qa`; fs.mkdirSync(`${out}/frames`, { recursive: true });
const b = await launch();
const report = {};
for (const fmt of (process.argv[2] ? [process.argv[2]] : ['h', 'v'])) {
  const p = await openPage(b, fmt);
  const T = await p.evaluate(() => window.TIMING);
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const files = [];
  const fonts = {};
  for (const c of T.CUTS) {
    const t = c.end - 0.15, frame = Math.round(t * T.FPS);
    await p.evaluate(([t, f]) => window.seek(t, f), [t, frame]);
    const f = `${out}/frames/${fmt}-${c.id}.png`;
    await p.screenshot({ path: f }); files.push(f);
    // font audit: every visible text element
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '.w, .tag, .date, .strip span, .strip bdi, .tc, .wm span, .code .card-body, .legend span, .sources, .credit, .xpdr .hdr span, #alt .lbl, text' });
    for (const id of nodeIds) {
      try { const r = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id }); r.fonts.forEach(x => { fonts[x.familyName] = (fonts[x.familyName] || 0) + x.glyphCount; }); } catch {}
    }
    // overflow / safe-zone audit
    const issues = await p.evaluate(fmt => {
      const W = innerWidth, H = innerHeight, bad = [];
      const safe = fmt === 'v' ? { t: 220, b: H - 380, l: 0, r: W - 120 } : { t: 0, b: H, l: 0, r: W };
      document.querySelectorAll('.shot, .panel, .rule').forEach(sh => {
        if (+getComputedStyle(sh).opacity < 0.5) return;
        sh.querySelectorAll('.wi, .tag, .code, .legend, .sources, .credit, .sign, .xpdr, .wcard').forEach(el => {
          const r = el.getBoundingClientRect(); if (!r.width) return;
          if (r.top < safe.t - 1 || r.bottom > safe.b + 1 || r.left < safe.l - 1 || r.right > safe.r + 1) bad.push(`${el.className}:${el.textContent.slice(0, 24)} @${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}`);
        });
      });
      // card content overflow
      document.querySelectorAll('.slot-card, .slot-panel').forEach(s => { if (s.scrollHeight > s.clientHeight + 2 && +getComputedStyle(s.closest('.shot,.panel')).opacity > .5) bad.push('overflow ' + (s.closest('.shot,.panel').id)); });
      return bad;
    }, fmt);
    if (issues.length) console.log(fmt, c.id, 'ISSUES', issues);
  }
  report[fmt] = fonts;
  const cols = fmt === 'v' ? 7 : 4, scale = fmt === 'v' ? '270:480' : '480:270';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...files.flatMap(f => ['-i', f]), '-filter_complex',
    files.map((_, i) => `[${i}:v]scale=${scale}[s${i}]`).join(';') + ';' + files.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=${files.length}:layout=` +
    files.map((_, i) => { const x = i % cols, y = Math.floor(i / cols); const [w, h] = scale.split(':'); return `${x * w}_${y * h}`; }).join('|') + ':fill=black',
    `${out}/contact-${fmt}.png`]);
  console.log(fmt, 'fonts used (family:glyphs):', JSON.stringify(fonts));
}
await b.close();
