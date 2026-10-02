buildGrain();buildCues();
// transitions
[[4.5,'L',C.sun],[15,'bars',C.ink],[22.5,'U',C.tom],[31.5,'iris',C.cream],[33.5,'L',C.ink]].forEach(a=>wipe(...a));
for(let i=1;i<10;i++){const t=33.5+i*2,nx=CARDS[i].bg;wipe(t,i%2?'R':'L',nx)}
[[53.5,'bars',C.tom],[59.5,'U',C.ink],[64.5,'iris',C.cream],[90.5,'L',C.cob],[97.5,'bars',C.ink]].forEach(a=>wipe(...a));
window.DURATION=DUR;
window.seek=t=>{MASTER.time(t,false);const f=Math.round(t*FPS);GR.style.transform=`translate(${(hashj(f)*80|0)}px,${(hashj(f+99)*80|0)}px)`};
document.fonts.load('400 40px Anton');document.fonts.load('800 40px Assistant');document.fonts.load('200 40px Assistant');document.fonts.load('700 40px JB');
document.fonts.ready.then(()=>{window.seek(0);window.__ready=true});
