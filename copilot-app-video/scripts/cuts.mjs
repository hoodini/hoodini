import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage(); await p.goto('http://127.0.0.1:8765/src/index.html'); await p.evaluate(()=>window.READY);
const c = await p.evaluate(()=>CUTS.map((c,i)=>`${i+1} ${c.sec} ${c.t.toFixed(2)}-${c.t1.toFixed(2)} (${(c.t1-c.t).toFixed(2)})`));
console.log(c.join('\n')); await b.close();
