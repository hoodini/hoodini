// Shared helpers: a tiny static server for the page and a Playwright launcher.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SRC = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(SRC, '..');
export const BUILD = path.join(ROOT, 'build');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.css': 'text/css' };

export function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const p = path.join(SRC, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(SRC) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' });
      if (req.method === 'HEAD') return res.end();
      fs.createReadStream(p).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }));
  });
}

export async function launch() {
  const exe = '/opt/pw-browsers/chromium';
  const opts = { args: ['--font-render-hinting=none', '--disable-gpu-vsync', '--force-color-profile=srgb'] };
  try { return await chromium.launch(opts); }
  catch (e) {
    if (fs.existsSync(exe)) return chromium.launch({ ...opts, executablePath: fs.statSync(exe).isDirectory() ? undefined : exe });
    throw e;
  }
}

export async function openPage(browser, url, clip) {
  const fmtB = /fmt=B/.test(url);
  const pg = await browser.newPage({ viewport: { width: fmtB ? 1080 : 1920, height: fmtB ? 1920 : 1080 }, deviceScaleFactor: 1 });
  pg.on('pageerror', (e) => console.error('[page error]', e.message));
  pg.on('console', (m) => { if (m.type() === 'error') console.error('[console]', m.text()); });
  await pg.goto(url);
  await pg.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  return pg;
}
