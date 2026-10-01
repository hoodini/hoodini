import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
export const { chromium } = pw;
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PAGE = fmt => 'file://' + path.join(ROOT, 'src/index.html') + '?fmt=' + fmt;
export const SIZE = fmt => fmt === 'v' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
export async function openPage(browser, fmt) {
  const page = await browser.newPage({ viewport: SIZE(fmt), deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto(PAGE(fmt), { waitUntil: 'load' });
  await page.evaluate(() => window.READY);
  return page;
}
export const launch = () => chromium.launch({ args: ['--allow-file-access-from-files', '--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb'] });
