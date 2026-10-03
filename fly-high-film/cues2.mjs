import { chromium } from 'playwright-core'; import fs from 'fs';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p = await b.newPage({viewport:{width:640,height:360}});
await p.goto('http://localhost:8123/film2.html?w=640&h=360'); await p.waitForFunction(() => window.__ready === true, null, {timeout: 180000});
const c = await p.evaluate(() => window.audioCues()); fs.writeFileSync('cues2.json', JSON.stringify(c)); console.log(c.pen.length, 'pen segs', c.steps.length, 'steps'); await b.close();
