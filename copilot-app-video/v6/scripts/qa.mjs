// QA: one still per shot (sampled late in the shot) + dumps CUES/CUTS for the audio mix
import { chromium } from '/home/user/hoodini/copilot-app-video/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const LOG='qa/qa.log'; fs.mkdirSync('qa',{recursive:true}); fs.writeFileSync(LOG,''); const log=(...a)=>fs.appendFileSync(LOG,a.join(' ')+'\n');
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage({viewport:{width:1920,height:1080}});
p.on('crash',()=>log('CRASH')); p.on('pageerror',e=>log('ERR',e.message));
await p.goto('http://127.0.0.1:8765/v6/index.html',{waitUntil:'commit'}); await p.waitForTimeout(1500);
const cuts = await p.evaluate(()=>CUTS.map(c=>[c.t,c.t1])); log('shots',cuts.length);
const frac=+(process.argv[2]||.75); const only=process.argv[3]?process.argv[3].split(',').map(Number):null;
for (let i=0;i<cuts.length;i++){ if(only&&!only.includes(i+1))continue; const t=cuts[i][0]+(cuts[i][1]-cuts[i][0])*frac;
  await p.evaluate(t=>{window.__timelines.main.seek(t);return 1},t);
  await p.screenshot({path:`qa/shot_${String(i+1).padStart(2,'0')}.jpg`,type:'jpeg',quality:70,timeout:15000}); log('ok',i+1,t.toFixed(2));}
const meta = await p.evaluate(()=>JSON.stringify({CUES,CUTS,DUR:TL.total}));
fs.writeFileSync('audio/cues.json', meta); log('done');
await b.close(); process.exit(0);
