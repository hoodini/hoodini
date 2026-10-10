// Deterministic render: Playwright seeks the paused GSAP timeline frame by frame -> ffmpeg chunks
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const FPS=30, WORKERS=+(process.env.WORKERS||4), URL='http://127.0.0.1:8765/src/index.html';
const exe='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b0=await chromium.launch({executablePath:exe}); const p0=await b0.newPage({viewport:{width:1920,height:1080}});
await p0.goto(URL); await p0.evaluate(()=>window.READY);
const meta=await p0.evaluate(()=>({CUES,CUTS,META,DURATION}));
fs.writeFileSync('audio/cues.json',JSON.stringify(meta,null,1)); await b0.close();
const N=Math.ceil(meta.DURATION*FPS), per=Math.ceil(N/WORKERS);
const only=process.env.ONLY?+process.env.ONLY:null;
console.log('frames',N,'shots',meta.CUTS.length,'cues',meta.CUES.length);
async function worker(w){
  const a=w*per, z=Math.min(N,a+per); const out=`out/chunk_${w}.mp4`;
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','12','-pix_fmt','yuv420p',out]);
  const b=await chromium.launch({executablePath:exe}); const p=await b.newPage({viewport:{width:1920,height:1080}});
  await p.goto(URL); await p.evaluate(()=>window.READY);
  for(let f=a;f<z;f++){ await p.evaluate(([t,f])=>seek(t,f),[f/FPS,f]);
    const buf=await p.screenshot({type:'jpeg',quality:94}); if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
    if((f-a)%300===0) console.log(`w${w} ${f-a}/${z-a}`); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); return out;
}
const t0=Date.now();
const outs=await Promise.all([...Array(WORKERS).keys()].filter(w=>only===null||w===only).map(worker));
fs.writeFileSync('out/chunks.txt',outs.map(o=>`file '${o.replace('out/','')}'`).join('\n'));
console.log('done in',((Date.now()-t0)/1000).toFixed(0),'s');
