// Copies the real screenshot loop out of render.mjs (between the evidence markers) for shot WPT 6.
import fs from 'node:fs';
import path from 'node:path';
import { SRC } from './lib.mjs';

const src = fs.readFileSync(path.join(SRC, 'render.mjs'), 'utf8').split('\n');
const a = src.findIndex((l) => l.includes('// <evidence>')), b = src.findIndex((l) => l.includes('// </evidence>'));
const body = src.slice(a + 1, b);
const indent = Math.min(...body.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
const lines = body.map((l) => l.slice(indent));
if (lines.length > 6 || lines.some((l) => l.length > 29)) throw new Error('evidence must be ≤ 6 lines of ≤ 29 chars:\n' + lines.join('\n'));
fs.mkdirSync(path.join(SRC, 'gen'), { recursive: true });
fs.writeFileSync(path.join(SRC, 'gen', 'evidence.json'), JSON.stringify({ file: 'render.mjs', lines }, null, 1));
console.log(lines.join('\n'));
