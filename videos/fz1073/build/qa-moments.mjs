import { execFileSync } from 'child_process';
import { launch, openPage, ROOT } from './common.mjs';
const fmt = process.argv[2] || 'h', ts = process.argv.slice(3).map(Number);
const b = await launch(); const p = await openPage(b, fmt); const files = [];
for (const t of ts) { await p.evaluate(([t]) => window.seek(t, Math.round(t * 30)), [t]); const f = `${ROOT}/qa/frames/m-${fmt}-${t}.png`; await p.screenshot({ path: f }); files.push(f); }
await b.close();
const cols = 3, [w, h] = fmt === 'v' ? [270, 480] : [640, 360];
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...files.flatMap(f => ['-i', f]), '-filter_complex', files.map((_, i) => `[${i}:v]scale=${w}:${h}[s${i}]`).join(';') + ';' + files.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=${files.length}:layout=` + files.map((_, i) => `${(i % cols) * w}_${Math.floor(i / cols) * h}`).join('|') + ':fill=black', `${ROOT}/qa/moments-${fmt}.png`]);
