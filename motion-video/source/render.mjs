import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs';
import {spawn} from 'child_process';import path from 'path';import fs from 'fs';import {fileURLToPath} from 'url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const [,, wIdx, wN, f0s, f1s]=process.argv; // worker index, count, optional frame range
const FPS=30;
const a=f0s?+f0s:0,bEnd=f1s?+f1s:Math.round(119.66*FPS);
const per=Math.ceil((bEnd-a)/+wN),s=a+ +wIdx*per,e=Math.min(bEnd,s+per);
const out=`${dir}/chunks/c${wIdx}.mp4`;fs.mkdirSync(dir+'/chunks',{recursive:true});
const ff=spawn(dir+'/node_modules/ffmpeg-static/ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709',out],{stdio:['pipe','inherit','inherit']});
const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox','--force-color-profile=srgb']});
const pg=await br.newPage({viewport:{width:1080,height:1440}});
await pg.goto('file://'+dir+'/site/index.html');await pg.waitForFunction('window.__ready===true');
for(let f=s;f<e;f++){
  await pg.evaluate(t=>window.seek(t),f/FPS);
  const buf=await pg.screenshot({type:'jpeg',quality:93});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if(f%100===0)console.log('w'+wIdx,f,'/',e);
}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await br.close();console.log('done',wIdx);
