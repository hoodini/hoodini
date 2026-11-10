// bundles src/film.js + octicons + brand PNG + local fonts (base64) into ONE self-contained out/film.html
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
const r = await build({ entryPoints: ['src/film.js'], bundle: true, format: 'iife', minify: true, write: false, loader: { '.png': 'dataurl' }, target: 'chrome120', logLevel: 'warning' });
const js = r.outputFiles[0].text; if (js.includes('</script')) throw new Error('bundle contains </script');
const F = 'node_modules/@fontsource';
const faces = [['Anton', 'anton/files/anton-latin-400-normal.woff2', 400], ['Inter', 'inter/files/inter-latin-500-normal.woff2', 500], ['Inter', 'inter/files/inter-latin-600-normal.woff2', 600], ['Inter', 'inter/files/inter-latin-700-normal.woff2', 700], ['Inter', 'inter/files/inter-latin-800-normal.woff2', 800], ['JetBrains Mono', 'jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2', 500], ['JetBrains Mono', 'jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2', 700]]
  .map(([fam, f, w]) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${readFileSync(`${F}/${f}`).toString('base64')}) format('woff2');}`).join('\n');
const html = `<!doctype html>
<html lang="en" dir="ltr">
<head><meta charset="utf-8"><title>GitHub Copilot Computer Use, YUV.AI motion</title>
<style>${faces}
html,body{margin:0;background:#12163F;overflow:hidden}canvas{display:block}</style>
</head>
<body><canvas id="c"></canvas>
<script>${js}</script>
</body></html>`;
writeFileSync('out/film.html', html);
console.log('built out/film.html', (html.length / 1024).toFixed(0) + ' KB');
