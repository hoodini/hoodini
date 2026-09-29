buildGrain();buildCues();
const KINDS=['L','bars','U','iris','R','L','bars','U','R','iris','L','U'];
const BG={hook:0,define:C.yel,position:C.off,scale:C.pink,rotation:C.off,opacity:C.blk,stagger:C.bone,mask:C.yel,camera:C.off,morph:C.blk,parallax:C.pink,prompt:C.bone,cta:C.pink};
SCRIPT.slice(0,-1).forEach((s,i)=>{const nx=SCRIPT[i+1];wipe(s.t0+s.D,KINDS[i%KINDS.length],[C.pink,C.yel,C.blk,C.off][i%4]);});
window.DURATION=TOTAL;
window.seek=t=>{MASTER.time(t,false);const f=Math.round(t*FPS);GR.style.transform=`translate(${(hashj(f)*80|0)}px,${(hashj(f+99)*80|0)}px)`};
document.fonts.load('400 40px Anton');document.fonts.load('800 40px Assistant');document.fonts.load('200 40px Assistant');document.fonts.load('700 40px JB');
document.fonts.ready.then(()=>{window.seek(0);window.__ready=true});
