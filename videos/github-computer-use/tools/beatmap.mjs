// writes out/beatmap.md + out/cues.json from the single timeline source
import fs from 'fs';
import { MAP, cues, B, DUR, SONG_S0 } from '../src/timeline.js';
const grid = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const C = cues();
const sfxAt = k => C.filter(c => c[1] >= k * B - 1e-3 && c[1] < (k + 1) * B - 1e-3).map(c => c[0]);
const count = a => Object.entries(a.reduce((m, n) => (m[n] = (m[n] || 0) + 1, m), {})).map(([n, c]) => c > 1 ? `${n} x${c}` : n).join(', ');
let md = `# Beat map: GitHub Copilot · Computer Use\n\nTrack: **${grid.title}** by ${grid.artist} (Mixkit #190, ${grid.license}).  \n` +
  `Tempo **${grid.bpm.toFixed(3)} BPM**, beat ${grid.beat.toFixed(6)} s. Grid fitted to ${'the measured kick hits'} (residual ${grid.resid_ms.toFixed(2)} ms rms); the automatic onset grid sat ${grid.auto_offset_ms.toFixed(1)} ms early and was corrected.  \n` +
  `Drop = song beat ${grid.song_drop_beat} (${grid.hit128.toFixed(3)} s) = film beat ${grid.film_drop_beat} (${(32 * B).toFixed(3)} s). Music offset S0 = ${SONG_S0.toFixed(4)} s. Film length ${DUR.toFixed(3)} s.\n\n` +
  `| beat | time | bar | scene | what happens | made out of | SFX (peak on the event) |\n|---:|---:|---:|---|---|---|---|\n`;
for (const [k, sc, what, from] of MAP) md += `| ${k} | ${(k * B).toFixed(2)} | ${Math.floor(k / 4)}${k % 4 === 0 ? ' ▼' : ''} | ${sc} | ${what} | ${from} | ${count(sfxAt(k)) || '(music)'} |\n`;
md += `\n▼ = downbeat. Every scene change sits on a downbeat (b12, b20, b32, b36, b52, b56, b60). ${C.length} SFX cues in total.\n`;
fs.writeFileSync('out/beatmap.md', md);
fs.writeFileSync('out/cues.json', JSON.stringify({ dur: +DUR.toFixed(4), music: { file: '190.mp3', S0: +SONG_S0.toFixed(4), gain: -2 }, cues: C }, null, 1));
console.log('beatmap rows', MAP.length, 'cues', C.length);
