// QA: one still per shot, sampled late in the shot (+ optional explicit times)
import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage({viewport:{width:1920,height:1080}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:8765/v2/src/index.html'); await p.evaluate(()=>window.READY);
const cuts = await p.evaluate(()=>CUTS.map(c=>[c.t,c.t1,c.sec]));
const frac = +(process.argv[2]||0.8);
console.log('shots', cuts.length, 'duration', await p.evaluate(()=>DURATION), errs);
for (let i=0;i<cuts.length;i++){ const [a,z]=cuts[i]; const t=a+(z-a)*frac;
  await p.evaluate(([t])=>seek(t,Math.round(t*30)),[t]);
  await p.screenshot({path:`qa/shot_${String(i+1).padStart(2,'0')}.jpg`,quality:70,type:'jpeg'}); }
const short = cuts.map((c,i)=>[i+1,+(c[1]-c[0]).toFixed(2)]).filter(x=>x[1]<0.3||x[1]>3.2);
console.log('short/long shots', JSON.stringify(short)); console.log('errors', errs);
await b.close();
