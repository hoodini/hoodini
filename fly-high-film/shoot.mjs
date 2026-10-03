// usage: node shoot.mjs page.html "t1,t2,..." W H outprefix
import { chromium } from 'playwright-core';
const [,, page='index.html', times='0', W='1280', H='720', out='shots/s'] = process.argv;
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p = await b.newPage({viewport:{width:+W,height:+H}});
p.on('console', m => console.log('[page]', m.text()));
p.on('pageerror', e => console.log('[err]', e.message));
await p.goto(`http://localhost:8123/${page.split("#")[0]}?w=${W}&h=${H}${page.includes("#") ? "#" + page.split("#")[1] : ""}`);
await p.waitForFunction(() => window.__ready === true, null, {timeout: 120000});
for (const t of times.split(',')) {
  const t0 = Date.now();
  await p.evaluate(tt => window.renderAt(+tt), t);
  await p.screenshot({path:`${out}_${t}.jpg`, type:'jpeg', quality:90});
  console.log('t', t, (Date.now()-t0)+'ms');
}
await b.close();
