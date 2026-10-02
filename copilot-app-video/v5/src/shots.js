// v5 "Home by 6" — final cut. Illustrated story + the REAL GitHub Copilot app UI (official GitHub screenshot).
const DROP = W('reveal','GitHub');
const HIDECAP = t => t > LE('cta') + .3;
const SRC = t => `<div class="foot">${t}</div>`;
const DRAMA = SRC('Dramatization · Dana and Mia are fictional');
const REALSRC = `<div class="foot fr">Real product UI · official GitHub screenshot (Changelog, Jun 2 2026)</div>`;

/* ---------- real app window (1718×985 official screenshot) with camera focus + highlight rings ---------- */
const RW = 1718, RH = 985;
const EXT = 640;   // for bottom-row close-ups: continue the app's own background below the screenshot (no edge in frame)
const REAL = (extra='',ext=false) => `<div class="rwrap"${ext?' data-ext="1"':''} style="position:absolute;left:0;top:0;width:${RW}px;height:${RH}px;transform-origin:0 0">
  <div style="position:absolute;inset:-2px;border-radius:18px;box-shadow:0 60px 120px rgba(31,27,58,.35),0 0 0 2px rgba(31,27,58,.08)"></div>
  ${ext?`<div style="position:absolute;left:0;top:${RH-4}px;width:${RW}px;height:${EXT}px;background:linear-gradient(to right,rgb(20,27,35) 0 320px,rgb(42,49,59) 320px 321px,rgb(14,17,24) 321px 989px,rgb(39,46,54) 989px 990px,rgb(14,17,24) 990px)"></div>`:''}
  <img src="assets/official/app_window.png" width="${RW}" height="${RH}" style="position:absolute;left:0;top:0;border-radius:${ext?'16px 16px 0 0':'16px'};display:block">${extra}</div>`;
const RING = (cls,x,y,w,h,col=C.su) => `<div class="ring ${cls}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:6px solid ${col};border-radius:14px;box-shadow:0 0 0 6px ${col}33;opacity:0"></div>`;
// camera: fit region [x,y,w,h] of the screenshot into a target box on screen
function camTo(el,x,y,w,h,box=[160,110,1600,760],clamp=true){const s=Math.min(box[2]/w,box[3]/h);let X=box[0]+box[2]/2-(x+w/2)*s,Y=box[1]+box[3]/2-(y+h/2)*s;
  // when zoomed past full-bleed, never let the screenshot's edge enter the frame
  if(clamp&&RW*s>=1920)X=Math.min(0,Math.max(1920-RW*s,X));const H=RH+(el&&el[0]&&el[0].dataset&&el[0].dataset.ext?EXT:0);if(clamp&&H*s>=1080)Y=Math.min(0,Math.max(1080-H*s,Y));return {scale:s,x:X,y:Y}}
const FULL=[0,0,RW,RH];
function camMove(t,d,el,from,to,ease='power2.inOut',box,clamp=true){const a=camTo(el,...from,box,clamp),b=camTo(el,...to,box,clamp);tl.fromTo(el,a,Object.assign({},b,{duration:d,ease,immediateRender:false}),t)}
const ringIn=(t,els)=>{tl.fromTo(els,{opacity:0,scale:1.25},{opacity:1,scale:1,duration:.4,ease:E_POP,immediateRender:false},t);cue(t,'pop')};
const CALL=(cls,x,y,txt,bg=C.pu)=>`<div class="call ${cls}" style="position:absolute;left:${x}px;top:${y}px;background:${bg};color:#fff;border-radius:14px;padding:12px 22px;font-weight:700;font-size:30px;white-space:nowrap;opacity:0;box-shadow:0 12px 30px rgba(31,27,58,.25)">${txt}</div>`;

/* reusable illustrated pieces */
const DESK_NIGHT = (id) => `${ROOM('night')}
  <div class="abs" style="left:640px;top:170px;transform:scale(1.12);transform-origin:50% 0">${DANA(id)}</div>
  <div class="abs lap" style="left:590px;top:600px;transform:scale(1.08);transform-origin:50% 0">${LAPTOP(true)}</div>
  <div class="abs dk" style="left:1130px;top:640px">${DUCK(.72)}</div>`;
function clockAt(q,t,t1,h,m,h2,m2){const a=q('.clk .hh'),b=q('.clk .mh');const H=(h%12+m/60)*30,M=m*6;const H2=h2==null?H+2:((h2%12+m2/60)*30+(h2<h?360:0)),M2=m2==null?M+24:(m2*6+((h2-h)*360));
  tl.fromTo(a,{rotation:H,svgOrigin:'0 0'},{rotation:H2,duration:t1-t,ease:'none',immediateRender:false},t);tl.fromTo(b,{rotation:M,svgOrigin:'0 0'},{rotation:M2,duration:t1-t,ease:'none',immediateRender:false},t)}
// acting: blink + breathing + duck bob (secondary motion everywhere Dana appears)
function alive(q,t,t1){const eyes=q('.eye');for(let k=t+.7;k<t1-.2;k+=2.1)blink(k,eyes);
  const n=Math.max(1,Math.floor((t1-t)/1.6));tl.fromTo(q('.body'),{scaleY:1},{scaleY:1.012,transformOrigin:'50% 100%',duration:.8,yoyo:true,repeat:n*2-1,ease:'sine.inOut',immediateRender:false},t);
  tl.fromTo(q('.head'),{y:0},{y:3,duration:.8,yoyo:true,repeat:n*2-1,ease:'sine.inOut',immediateRender:false},t);
  if(q('.dk .duck').length)tl.fromTo(q('.dk .duck'),{rotation:-3},{rotation:3,transformOrigin:'50% 100%',duration:.6,yoyo:true,repeat:Math.max(1,Math.floor((t1-t)/.6)),ease:'sine.inOut',immediateRender:false},t)}
function mouth(q,t,which){['.m-flat','.m-worry','.m-smile'].forEach(m=>tl.set(q(m),{opacity:m==='.m-'+which?1:0},t))}
function worry(q,t){mouth(q,t,'worry');tl.fromTo(q('.browL'),{rotation:0},{rotation:-12,svgOrigin:'173 163',duration:.25,immediateRender:false},t);tl.fromTo(q('.browR'),{rotation:0},{rotation:12,svgOrigin:'247 163',duration:.25,immediateRender:false},t)}

/* ================= ACT 1 · 11:47 PM ================= */
SHOT('open',0,W('open','Two'),'bg-night',DESK_NIGHT('d1')+`
  <div class="c h1" style="top:70px;color:#fff;z-index:5"><span class="mask"><span class="tt">11:47 PM</span></span></div>${DRAMA}`,
 (q,t,t1)=>{clockAt(q,t,t1,11,47,11,47.4);reveal(t+.15,q('.tt'));alive(q,t,t1);mouth(q,t,'flat');cue(t,'tick',{d:t1-t})},{push:.05});

const NOTI=['Review requested · #1284','Build failed · main','3 new comments on #1279','Merge conflict · feat/checkout','Mentioned you in #1271','Build failed · release/2.4','Review requested · #1290','Deploy blocked'];
SHOT('open',W('open','Two'),W('open','release'),'bg-night',DESK_NIGHT('d2')+`
  <div class="abs tower" style="left:1230px;top:120px;width:470px">${NOTI.map((n,i)=>`<div class="card nt" style="position:relative;margin-top:14px;padding:18px 22px;border-radius:16px;font-weight:600;font-size:22px;display:flex;gap:14px;align-items:center;transform:rotate(${[-2,1.5,-1,2,-1.5,1,-2,1.2][i]}deg)"><i style="width:14px;height:14px;border-radius:50%;background:${i%3===1?C.co:C.pu};flex:none"></i>${n}</div>`).join('')}</div>
  <div class="abs cnt" style="left:1300px;top:40px;background:${C.coS};color:#fff;border-radius:999px;padding:10px 28px;font-weight:800;font-size:44px;min-width:180px;text-align:center;height:72px"><span class="cv" style="position:relative;display:block;height:56px"></span></div>`,
 (q,t,t1)=>{const nts=[...q('.nt')].reverse();tl.fromTo(nts,{y:-600,opacity:0},{y:0,opacity:1,duration:.35,ease:'power2.in',stagger:(t1-t-.5)/8,immediateRender:false},t);for(let i=0;i<8;i++)cue(t+i*(t1-t-.5)/8+.3,'ping');
  counter(t,q('.cv')[0],[12,48,97,140,176,200],t1-t-.3);pop(t,q('.cnt'),0,null);tl.set(q('.duck .sweat'),{opacity:1},t+.7);worry(q,t+.4);alive(q,t,t1)});

SHOT('open',W('open','release'),W('open','promise'),'bg-cream',`
  <div class="card cal" style="left:560px;top:250px;width:800px;padding:0;overflow:hidden">
   <div style="background:${C.pu};color:#fff;padding:22px 34px;font-weight:700;font-size:28px;letter-spacing:.08em">FRIDAY</div>
   <div style="padding:34px"><div class="eyebrow" style="color:${C.coS}">9:00 AM</div><div class="h3" style="margin-top:8px">Release 2.4 ships</div><div class="body" style="margin-top:8px">14 open pull requests · 3 failing builds</div></div></div>`,
 (q,t)=>{pop(t,q('.cal'))},{push:.02});

SHOT('open',W('open','promise'),L('promise')-.05,'bg-night',DESK_NIGHT('d4')+`
  <div class="abs note" style="left:770px;top:520px;width:300px;height:250px;background:${C.su};border-radius:6px;transform:rotate(-4deg);padding:26px 24px;box-shadow:0 14px 30px rgba(0,0,0,.25);z-index:6">
   <div class="hand" style="font-size:44px;line-height:1.05;color:${C.ink}">Mia's recital<br>Fri · 6 PM</div><div style="font-weight:800;font-size:30px;margin-top:10px;color:${C.coS}">FRONT ROW ♥</div></div>`,
 (q,t,t1)=>{tl.fromTo(q('.cam'),{scale:1,x:0,y:0},{scale:1.9,x:-130,y:-420,duration:t1-t,ease:'power2.inOut',immediateRender:false},t);pop(t,q('.note'),0,'paper');alive(q,t,t1)},{push:0});

SHOT('promise',L('promise')-.05,W('promise','Her'),'bg-su',`
  <div class="c h1" style="top:330px"><span class="mask"><span class="p1">6:00 PM.</span></span><span class="mask"><span class="p2" style="color:${C.coS}">Front row.</span></span></div>`,
 (q,t)=>{iris(t,C.su,.6);reveal(t+.1,q('.p1'));reveal(W('promise','Front'),q('.p2'))});

SHOT('promise',W('promise','Her'),L('habit')-.05,'bg-cream',`
  <div class="abs" style="left:0;right:0;top:720px;bottom:0;background:${C.suT}"></div>
  <div class="abs mia" style="left:640px;top:420px;transform:scale(1.5);transform-origin:0 0">${MIA()}</div>
  <div class="abs nq" style="left:1180px;top:300px;font-weight:800;font-size:90px;color:${C.coS}">♪?</div>
  <div class="c h3" style="top:150px">Her <span style="color:${C.puS}">very first</span> piano recital</div>`,
 (q,t,t1)=>{rise(t,q('.h3'));tl.fromTo(q('.mia .arm'),{rotation:0},{rotation:-10,svgOrigin:'100 159',duration:.18,yoyo:true,repeat:Math.max(1,Math.floor((t1-t)/.36)),immediateRender:false},t);
  pop(W('promise','piano'),q('.nq'),0,'clunk');tl.set(q('.kmouth'),{attr:{d:'M64,112 C70,106 78,106 84,112'}},W('promise','piano')+.05)});

/* ================= the habit ================= */
const JUG=`<div class="abs jg">${[0,1,2].map(i=>`<div class="abs ball b${i}" style="left:${820+i*90}px;top:260px;width:84px;height:84px;border-radius:50%;background:${[C.pu,C.mi,C.su][i]};color:#fff;display:flex;align-items:center;justify-content:center">${ICO('git-branch')}</div>`).join('')}</div>`;
SHOT('habit',L('habit')-.05,W('habit','branch'),'bg-night',DESK_NIGHT('d7'),
 (q,t,t1)=>{iris(t,C.night,.6);alive(q,t,t1);mouth(q,t,'flat');tl.fromTo(q('#d7 .head'),{rotation:0},{rotation:-6,svgOrigin:'210 250',duration:.5,ease:'sine.inOut',immediateRender:false},W('habit','herself')-.3);cue(W('habit','herself'),'sigh')});
SHOT('habit',W('habit','branch'),W('habit','review'),'bg-night',DESK_NIGHT('d8')+JUG,
 (q,t,t1)=>{[0,1,2].forEach(i=>tl.fromTo(q('.b'+i),{y:0},{y:-150,duration:.3,yoyo:true,repeat:Math.ceil((t1-t)/.6)+1,ease:'sine.out',immediateRender:false},t+i*.1));worry(q,t);alive(q,t,t1)});
SHOT('habit',W('habit','review'),W('habit','failing'),'bg-night',DESK_NIGHT('d9')+`<div class="abs pile" style="left:560px;top:200px;width:620px">${Array.from({length:9},(_,i)=>`<div class="card rp" style="position:relative;margin-top:-8px;padding:16px 22px;border-radius:14px;font-weight:600;font-size:22px;transform:rotate(${(i%2?1:-1)*(1+i%3)}deg)">Review requested · #${1290-i*3}</div>`).join('')}</div>`,
 (q,t,t1)=>{tl.fromTo([...q('.rp')].reverse(),{y:-500,opacity:0},{y:0,opacity:1,duration:.28,stagger:(t1-t-.3)/9,ease:'power2.in',immediateRender:false},t);cue(t+.2,'paper');alive(q,t,t1)});
SHOT('habit',W('habit','failing'),L('scale')-.05,'bg-night',DESK_NIGHT('d10')+`${[[520,230],[1160,200],[430,520],[1300,470],[840,160]].map(([x,y],i)=>`<div class="abs fx${i}" style="left:${x}px;top:${y}px;background:${C.coS};color:#fff;border-radius:999px;padding:12px 22px;font-weight:700;font-size:24px;display:flex;gap:10px;align-items:center">${ICO('x-circle-fill')} test failed</div>`).join('')}`,
 (q,t,t1)=>{[0,1,2,3,4].forEach(i=>pop(t+i*Math.min(.3,(t1-t-.3)/5),q('.fx'+i),0,'error'));worry(q,t);alive(q,t,t1);tl.set(q('.duck .sweat'),{opacity:1},t+.3);tl.fromTo(q('.duck .wing'),{rotation:0,x:0,y:0},{rotation:-70,x:30,y:-58,svgOrigin:'80 112',duration:.35,ease:E_POP,immediateRender:false},t+1.1);cue(t+1.1,'squeak')});

/* ================= GitHub has seen this night before ================= */
const BUILD=(w,h,lit,seed=1)=>`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${Array.from({length:Math.floor(w/80)},(_,i)=>{const bh=h*.45+((i*97+seed*31)%Math.floor(h*.5));return `<rect x="${i*80}" y="${h-bh}" width="72" height="${bh}" fill="#1A1740"/>`+Array.from({length:Math.floor(bh/40)*2},(_,k)=>{const on=((i*13+k*7+seed)%lit)===0;return `<rect class="${on?'lw':''}" x="${i*80+12+(k%2)*30}" y="${h-bh+14+Math.floor(k/2)*40}" width="18" height="20" rx="3" fill="${on?C.su:'#2B2660'}"/>`}).join('')}).join('')}</svg>`;
SHOT('scale',L('scale')-.05,W('scale','And'),'bg-night',`<div class="abs city" style="left:-200px;top:320px;transform-origin:1130px 400px">${BUILD(2320,760,2,7)}</div>
  <div class="c" style="top:110px"><div class="h1" style="color:#fff;font-size:190px"><span class="cv" style="position:relative;display:inline-block;width:720px;height:200px"></span></div><div class="h3 dv" style="color:${C.su};margin-top:12px">developers build on GitHub</div></div>
  ${SRC('Source: GitHub Octoverse 2025')}`,
 (q,t,t1)=>{tl.fromTo(q('.city'),{scale:2.2},{scale:1,duration:t1-t,ease:'power2.inOut',immediateRender:false},t);counter(W('scale','more'),q('.cv')[0],['0','30M','75M','120M','160M','180M+'],Math.max(.6,WE('scale','developers')-W('scale','more')-.2));rise(W('scale','developers'),q('.dv'));tl.fromTo(q('.lw'),{opacity:0},{opacity:1,duration:.05,stagger:{each:.004,from:'random'},immediateRender:false},t);cue(t,'whoosh')},{push:0});

const MINI=()=>`<svg viewBox="0 0 160 130" width="160" height="130"><rect width="160" height="130" rx="14" fill="${C.night3}"/><circle cx="80" cy="52" r="20" fill="${C.skin}"/><path d="M60,46 C60,30 100,30 100,46 C92,38 70,38 60,46 Z" fill="${C.hair}"/><path d="M44,130 C44,96 60,84 80,84 C100,84 116,96 116,130 Z" fill="${C.pu}"/><rect x="40" y="98" width="80" height="32" rx="6" fill="#DCDDEA"/><circle cx="138" cy="18" r="6" fill="${C.su}"/></svg>`;
SHOT('scale',W('scale','And'),L('reveal')-.05,'bg-night',`<div class="abs grid" style="left:0;top:0;width:1920px;height:1080px">${Array.from({length:84},(_,i)=>`<div class="abs mn" style="left:${(i%12)*160}px;top:${Math.floor(i/12)*150+20}px;transform:scale(.92)">${MINI()}</div>`).join('')}</div>
  <div class="abs" style="left:0;right:0;top:360px;height:300px;background:linear-gradient(transparent,rgba(43,38,96,.95) 30%,rgba(43,38,96,.95) 70%,transparent)"></div>
  <div class="c h2" style="top:420px;color:#fff"><span class="mask"><span class="sn">GitHub has seen this night before.</span></span></div>`,
 (q,t,t1)=>{tl.fromTo(q('.mn'),{opacity:0,scale:.5},{opacity:1,scale:.92,duration:.3,stagger:{each:.01,from:'center',grid:[7,12]},ease:E_POP,immediateRender:false},t);reveal(W('scale','seen')-.2,q('.sn'));tl.fromTo(q('.grid'),{scale:1.6},{scale:1,duration:t1-t,ease:'power2.out',immediateRender:false},t)},{push:0});

/* ================= the reveal — the real app ================= */
SHOT('reveal',L('reveal')-.05,DROP,'bg-night',`<div class="c h2" style="top:420px;color:#fff"><span class="mask"><span class="wb">So they built…</span></span></div>`,(q,t)=>{reveal(t,q('.wb'));cue(t,'riser',{d:DROP-t})});

SHOT('reveal',DROP,W('reveal','desktop'),'bg-pu',`
  <div class="c lg" style="top:250px"><span style="display:inline-block;width:150px;height:150px">${ICON['mark-github'].replace('<svg','<svg style="width:150px;height:150px;fill:#fff"')}</span></div>
  <div class="c h1" style="top:450px"><span class="mask"><span class="wm">GitHub Copilot app</span></span></div>
  <div class="c" style="top:620px"><span class="pill tp" style="background:rgba(255,255,255,.18);color:#fff;font-size:26px">Technical preview</span></div>`,
 (q,t)=>{iris(t,C.pu,.5);pop(t+.05,q('.lg'),0,null);reveal(t+.15,q('.wm'));rise(t+.4,q('.tp'));cue(t,'hit')});

SHOT('reveal',W('reveal','desktop'),L('mywork')-.05,'bg-cream',`
  <div class="c h2" style="top:70px;z-index:3"><span class="mask"><span class="dh">A desktop home for your <span style="color:${C.puS}">coding agents</span></span></span></div>
  <div class="abs rv">${REAL()}</div>${REALSRC}`,
 (q,t,t1)=>{reveal(t,q('.dh'));const r=q('.rwrap');tl.fromTo(r,Object.assign(camTo(r,...FULL,[210,210,1500,760]),{y:camTo(r,...FULL,[210,210,1500,760]).y+500,opacity:0}),Object.assign(camTo(r,...FULL,[210,210,1500,760]),{opacity:1,duration:.9,ease:E_IN,immediateRender:false}),t);cue(t,'whoosh')},{push:.02});

/* ================= My Work — the notification tower pours into the real sidebar ================= */
SHOT('mywork',L('mywork')-.05,L('handoff')-.05,'bg-cream',`
  <div class="abs cv2">${REAL(RING('r1',8,130,300,140,C.su)+RING('r2',8,300,300,660,C.pu))}</div>
  <div class="abs" data-layout-allow-overlap style="left:0;top:0">${NOTI.map((n,i)=>`<div class="card nf" style="left:${1100+(i%2)*330}px;top:${120+i*85}px;padding:14px 20px;border-radius:14px;font-weight:600;font-size:22px;white-space:nowrap;display:flex;gap:12px;align-items:center;z-index:5"><i style="width:12px;height:12px;border-radius:50%;background:${i%3===1?C.co:C.pu}"></i>${n}</div>`).join('')}</div>
  ${CALL('c1',1180,240,'My work · every repo')}${CALL('c2',1180,340,'Sessions · issues · pull requests',C.ink)}${REALSRC}`,
 (q,t,t1)=>{const r=q('.rwrap');camMove(t,t1-t,r,[0,0,1000,985],[0,60,760,880]);
  const nf=[...q('.nf')];tl.fromTo(nf,{opacity:0,x:120},{opacity:1,x:0,duration:.3,stagger:.06,immediateRender:false},t);
  tl.to(nf,{x:(i,e)=>200-parseFloat(e.style.left),y:(i,e)=>520-parseFloat(e.style.top),scale:.25,opacity:0,duration:.5,ease:'power3.in',stagger:.035,immediateRender:false},W('mywork','every',2)-.3);cue(W('mywork','every',2)-.1,'whoosh');
  ringIn(W('mywork','calm')-.3,q('.r1'));ringIn(W('mywork','calm'),q('.r2'));tl.fromTo(q('.c1,.c2'),{opacity:0,x:40},{opacity:1,x:0,duration:.4,stagger:.15,ease:E_IN,immediateRender:false},W('mywork','calm'))});

/* ================= the handoff (typed into the REAL prompt box) ================= */
SHOT('handoff',L('handoff')-.05,W('handoff','Just'),'bg-cream',`
  <div class="abs pr">${REAL(`<div style="position:absolute;left:352px;top:866px;width:620px;height:44px;background:rgb(14,17,24)"></div><div class="typ" style="position:absolute;left:362px;top:872px;font:500 26px 'Mona Sans';color:#E6EDF3;white-space:nowrap"></div>`+RING('r3',336,850,640,140,C.su),true)}</div>${REALSRC}`,
 (q,t,t1)=>{const r=q('.rwrap');camMove(t,t1-t,r,[300,700,760,285],[330,820,680,190]);typeOn(t+.3,q('.typ')[0],'Fix #1284: checkout fails on Safari',Math.min(1.6,t1-t-.6));ringIn(t+.1,q('.r3'))});

SHOT('handoff',W('handoff','Just'),L('models')-.05,'bg-night',`${ROOM('night')}
  <div class="abs" style="left:660px;top:190px;transform:scale(1.5);transform-origin:50% 0">${DANA('d20')}</div>
  <div class="abs" style="left:560px;top:760px;transform:scale(1.4);transform-origin:50% 0">${LAPTOP(true)}</div>
  <div class="abs dk2" style="left:1300px;top:640px;transform:scale(1.4);transform-origin:0 0">${DUCK(1)}</div>`,
 (q,t,t1)=>{mouth(q,t,'flat');alive(q,t,t1);tl.fromTo(q('#d20 .browR'),{y:0},{y:-12,duration:.25,immediateRender:false},W('handoff','Very'));tl.fromTo(q('.dk2 .deye'),{scale:1},{scale:1.6,transformOrigin:'50% 50%',duration:.2,immediateRender:false},W('handoff','carefully'));
  tl.fromTo(q('.dk2'),{x:0},{x:-40,duration:.4,ease:'power2.out',immediateRender:false},W('handoff','Very'));cue(W('handoff','carefully'),'squeak')});


/* ================= model picker (real UI) ================= */
SHOT('models',L('models')-.05,L('lanes')-.05,'bg-cream',`<div class="abs mp">${REAL(RING('r9',492,930,100,38,C.su),true)}</div>${CALL('k6',1040,200,'Pick the model for the job',C.puS)}${CALL('k7',1040,290,'…or let Auto decide',C.ink)}${REALSRC}`,
 (q,t,t1)=>{const r=q('.rwrap');camMove(t,t1-t,r,[330,700,700,285],[350,880,420,120]);ringIn(W('models','model'),q('.r9'));
  tl.fromTo(q('.k6'),{opacity:0,x:40},{opacity:1,x:0,duration:.4,ease:E_IN,immediateRender:false},W('models','model'));
  tl.fromTo(q('.k7'),{opacity:0,x:40},{opacity:1,x:0,duration:.4,ease:E_IN,immediateRender:false},W('models','Auto')-.1);cue(W('models','Auto')-.1,'pop')});

/* ================= lanes (worktrees) → the real session list ================= */
const LANES=[[250,C.pu,'agent · fix/safari-checkout'],[430,C.mi,'agent · chore/bump-deps'],[650,C.su,'agent · docs/release-notes'],[840,C.co,'Dana · her own branch']];
SHOT('lanes',L('lanes')-.05,W('lanes','so'),'bg-cream',`
  <svg class="abs" style="left:0;top:0" width="1920" height="1080">${LANES.map(([y,c],i)=>`<path class="ln" d="M140,540 C420,540 480,${y} 760,${y} L1840,${y}" stroke="${c}" stroke-width="62" fill="none" stroke-linecap="round" opacity=".25" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M760,${y} L1840,${y}" stroke="#fff" stroke-width="5" stroke-dasharray="26 26" opacity=".8"/>`).join('')}<circle cx="140" cy="540" r="44" fill="${C.ink}"/></svg>
  <div class="abs" style="left:52px;top:504px;width:176px;text-align:center;font-weight:800;font-size:22px;color:#fff">main</div>
  ${LANES.map(([y,c,l],i)=>`<div class="abs lb" style="left:800px;top:${y-86}px;font-weight:700;font-size:24px;color:${i===3?C.coS:C.ink}">${l}</div><div class="abs car car${i}" style="left:780px;top:${y-28}px;width:110px;height:56px;border-radius:16px;background:${c};display:flex;align-items:center;justify-content:center;color:${i===2?C.ink:"#fff"}">${i===3?DUCK(.28):ICO('copilot')}</div>`).join('')}
  <div class="abs eyebrow" style="left:120px;top:120px">One git worktree per session</div>`,
 (q,t,t1)=>{tl.fromTo(q('.ln'),{strokeDashoffset:1},{strokeDashoffset:0,duration:.8,stagger:.12,ease:E_IN,immediateRender:false},t);fadeIn(t+.4,q('.lb'),.3);rise(t,q('.eyebrow'));q('.car').forEach((c,i)=>{tl.fromTo(c,{opacity:0},{opacity:1,duration:.25,immediateRender:false},t+.3+i*.08);tl.fromTo(c,{x:0},{x:(i===3?420:780-i*90),duration:(t1-t)+1.5,ease:'power1.inOut',immediateRender:false},t+.3)});cue(t,'whoosh')},{push:.02});

SHOT('lanes',W('lanes','so'),L('merge')-.05,'bg-cream',`<div class="abs sl">${REAL(RING('r4',8,470,300,200,C.mi))}</div>${CALL('c3',1000,420,'Parallel sessions · separate worktrees',C.miS)}${REALSRC}`,
 (q,t,t1)=>{const r=q('.rwrap');camMove(t,t1-t,r,[0,300,700,600],[0,420,560,300]);ringIn(t+.3,q('.r4'));tl.fromTo(q('.c3'),{opacity:0,x:40},{opacity:1,x:0,duration:.4,ease:E_IN,immediateRender:false},t+.4)});

/* ================= Agent Merge — the real PR panel ================= */
SHOT('merge',L('merge')-.05,W('merge','fixes'),'bg-cream',`<div class="abs pm">${REAL(RING('r5',1000,815,680,140,C.mi)+RING('r6',1575,36,100,52,C.su),true)}</div>
  ${CALL('k1',140,120,'✓ Watches the tests',C.miS)}${CALL('k2',140,200,'✓ Keeps an eye on reviewers',C.miS)}${REALSRC}`,
 (q,t,t1)=>{const r=q('.rwrap');camMove(t,t1-t,r,[980,0,738,985],[990,560,700,425],'power2.inOut');
  ringIn(W('merge','tests'),q('.r5'));tl.fromTo(q('.k1'),{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:E_IN,immediateRender:false},W('merge','tests'));cue(W('merge','tests'),'ding',{n:0});
  tl.fromTo(q('.k2'),{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:E_IN,immediateRender:false},W('merge','reviewers'));cue(W('merge','reviewers'),'ding',{n:1})},{push:0});

SHOT('merge',W('merge','fixes'),L('sandbox')-.05,'bg-cream',`<div class="abs pm2">${REAL(RING('r7',1575,36,100,52,C.su))}</div>
  ${CALL('k1b',140,56,'✓ Watches the tests',C.miS)}${CALL('k2b',520,56,'✓ Keeps an eye on reviewers',C.miS)}${CALL('k3',140,146,'✓ Fixes what breaks',C.miS)}${CALL('k4',520,146,'✓ Merges when her rules are met',C.puS)}
  <div class="abs clkw" style="left:1580px;top:40px">${CLOCK('clk')}</div>${REALSRC}`,
 (q,t,t1)=>{const r=q('.rwrap');camMove(t,t1-t,r,[1000,0,718,420],[1330,0,388,230],'power2.inOut',[900,260,900,560],false);tl.set(q('.k1b,.k2b'),{opacity:1},t);
  tl.fromTo(q('.k3'),{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:E_IN,immediateRender:false},t+.05);cue(t+.05,'ding',{n:2});
  ringIn(W('merge','merges'),q('.r7'));tl.fromTo(q('.k4'),{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:E_IN,immediateRender:false},W('merge','rules'));cue(W('merge','met'),'stamp');
  clockAt(q,t,t1,9,0,16,0)},{push:0});


/* ================= sandboxes ================= */
const CLOUD=`<svg viewBox="0 0 320 200" width="320" height="200"><path d="M80,170 C30,170 20,110 70,100 C70,50 140,30 170,70 C190,40 260,50 255,100 C310,105 300,170 250,170 Z" fill="#fff" stroke="${C.ink}" stroke-width="6"/></svg>`;
SHOT('sandbox',L('sandbox')-.05,L('control')-.05,'bg-cream',`
  <div class="c h2" style="top:110px"><span class="mask"><span class="sx">Every agent gets a <span style="color:${C.puS}">sandbox</span>.</span></span></div>
  <div class="card s1" style="left:230px;top:320px;width:660px;height:560px"><div class="eyebrow">On her laptop</div>
   <div class="bx" style="position:absolute;left:40px;right:40px;top:110px;bottom:40px;border:5px dashed ${C.pu};border-radius:24px;background:${C.puT};overflow:hidden">
    <div style="position:absolute;left:50%;top:48%;transform:translate(-50%,-50%) scale(.62)">${LAPTOP(false)}</div></div></div>
  <div class="card s2" style="left:1030px;top:320px;width:660px;height:560px"><div class="eyebrow">In the cloud</div>
   <div class="bx" style="position:absolute;left:40px;right:40px;top:110px;bottom:40px;border:5px dashed ${C.mi};border-radius:24px;background:${C.miT};display:flex;align-items:center;justify-content:center">
    <div style="position:relative">${CLOUD}<span style="position:absolute;left:50%;top:56%;transform:translate(-50%,-50%) scale(2.6);color:${C.pu}">${ICO('copilot')}</span></div></div></div>`,
 (q,t,t1)=>{reveal(t,q('.sx'));pop(t+.2,q('.s1'),0,'pop');pop(W('sandbox','cloud')-.15,q('.s2'),0,'pop');
  tl.fromTo(q('.bx'),{scale:1},{scale:1.02,duration:.6,yoyo:true,repeat:Math.max(1,Math.floor((t1-t)/.6)),ease:'sine.inOut',immediateRender:false},t)},{push:.03});

/* ================= control — letting go ≠ losing control ================= */
SHOT('control',L('control')-.05,W('control','And'),'bg-mi',`
  <svg class="abs" style="left:0;top:0" width="1920" height="1080"><path class="str" d="M560,980 C700,760 1000,520 1300,300" stroke="${C.ink}" stroke-width="4" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
  <svg class="abs kite" style="left:1210px;top:150px" width="200" height="260" viewBox="0 0 200 260"><path d="M100,0 L190,110 L100,200 L10,110 Z" fill="${C.pu}"/><path d="M100,0 L100,200 L10,110 Z" fill="${C.puS}"/><path d="M100,200 C90,220 110,230 100,250" stroke="${C.ink}" stroke-width="4" fill="none"/></svg>
  <div class="abs" style="left:120px;top:200px;width:1000px"><div class="h1" style="color:${C.ink}"><span class="mask"><span class="lg1">Letting go</span></span><span class="mask"><span class="lg2" style="color:#fff">≠ losing control.</span></span></div><div class="body lg3" style="color:${C.ink};margin-top:26px">In the cloud, the agent asks before every change.</div></div>`,
 (q,t,t1)=>{tl.fromTo(q('.str'),{strokeDashoffset:1},{strokeDashoffset:0,duration:.8,ease:E_IN,immediateRender:false},t);reveal(t,q('.lg1'));reveal(t+.35,q('.lg2'));rise(W('control','asks'),q('.lg3'));tl.fromTo(q('.kite'),{y:40,rotation:-6},{y:-20,rotation:6,duration:(t1-t)/2,yoyo:true,repeat:1,ease:'sine.inOut',transformOrigin:'50% 80%',immediateRender:false},t)});

SHOT('control',W('control','And'),L('ships')-.05,'bg-cream',`<div class="abs ap">${REAL(RING('r8',385,925,105,44,C.su),true)}</div>${CALL('k5',1060,180,'Autopilot: her call',C.puS)}${REALSRC}`,
 (q,t,t1)=>{const r=q('.rwrap');camMove(t,t1-t,r,[330,760,700,225],[350,880,400,110]);ringIn(W('control','autopilot'),q('.r8'));tl.fromTo(q('.k5'),{opacity:0,x:40},{opacity:1,x:0,duration:.4,ease:E_IN,immediateRender:false},W('control','call'))});

/* ================= ships fast ================= */
const FEAT=['Canvases','Voice','Cloud sessions','Cloud automations','CLI sessions in My Work','Agentic browsing','Rubber duck','/chronicle'];
SHOT('ships',L('ships')-.05,L('listen')-.05,'bg-cream',`
  <div class="c h2" style="top:110px"><span class="mask"><span class="sf">The team ships <span style="color:${C.puS}">fast.</span></span></span></div>
  <div class="abs" style="left:190px;top:280px;display:grid;grid-template-columns:repeat(19,68px);gap:10px">${Array.from({length:19},()=>`<div class="dq" style="width:68px;height:68px;border-radius:14px;background:#EFE6D8"></div>`).join('')}</div>
  <div class="abs" style="left:190px;top:370px;font-weight:700;font-size:26px;color:${C.ink2}">May 14 · launch</div>
  <div class="abs" style="right:190px;top:370px;font-weight:700;font-size:26px;color:${C.puS}">Jun 2 · 8 new features</div>
  <div class="abs" style="left:190px;right:190px;top:500px;display:flex;flex-wrap:wrap;gap:20px;justify-content:center">${FEAT.map((f,i)=>`<span class="pill ft" style="font-size:34px;padding:16px 30px;background:${[C.puT,C.miT,C.suT,C.coT][i%4]};color:${[C.puS,C.miS,'#8A5A00',C.coS][i%4]}">${f}</span>`).join('')}</div>
  ${SRC('Source: GitHub Changelog — May 14 & Jun 2, 2026')}`,
 (q,t)=>{reveal(t,q('.sf'));tl.to(q('.dq'),{backgroundColor:(i)=>['#9BE9A8','#40C463','#30A14E','#216E39'][i%4],duration:.08,stagger:.06,immediateRender:false},W('ships','Eight')-.4);cue(W('ships','Eight')-.4,'tick',{d:1.2});pop(W('ships','nineteen')-.2,q('.ft'),.09)});


/* ================= built in the open ================= */
SHOT('listen',L('listen')-.05,L('payoff')-.05,'bg-cream',`
  <div class="c h2" style="top:100px"><span class="mask"><span class="bo">Built <span style="color:${C.puS}">in the open.</span></span></span></div>
  <div class="card th" style="left:360px;top:300px;width:1200px;padding:40px 46px">
   <div style="display:flex;gap:18px;align-items:center"><span style="display:inline-block;width:54px;height:54px">${ICON['mark-github'].replace('<svg','<svg style="width:54px;height:54px;fill:#1F1B3A"')}</span><div><div class="eyebrow">GitHub Community</div><div class="h3" style="margin-top:4px">GitHub Copilot app · discussion</div></div>
    <span class="pill" style="margin-left:auto;background:${C.miT};color:${C.miS}">Open</span></div>
   ${[C.pu,C.mi,C.su,C.co].map((c,i)=>`<div class="bb" style="display:flex;gap:18px;align-items:center;margin-top:26px"><span style="width:52px;height:52px;border-radius:50%;background:${c};flex:none"></span><span style="flex:1;display:flex;flex-direction:column;gap:10px"><i style="display:block;height:16px;border-radius:8px;background:#EDE5D8;width:${[88,64,76,52][i]}%"></i><i style="display:block;height:16px;border-radius:8px;background:#F4EEE4;width:${[60,80,44,70][i]}%"></i></span></div>`).join('')}</div>
  ${SRC('Discussion linked from GitHub Changelog, Jun 2 2026')}`,
 (q,t)=>{reveal(t,q('.bo'));pop(t+.15,q('.th'),0,null);const b=[...q('.bb')];b.forEach((e,i)=>{rise(W('listen','discussion')-.4+i*.22,[e]);cue(W('listen','discussion')-.4+i*.22,'pop')})},{push:.03});

/* ================= 6:02 PM (peak) ================= */
SHOT('payoff',L('payoff')-.05,W('payoff','Front'),'bg-su',`<div class="c h1" style="top:360px;font-size:220px"><span class="mask"><span class="t6">6:02 PM</span></span></div>`,
 (q,t)=>{iris(t,C.su,.55);reveal(t+.1,q('.t6'))});
const STAGE=`<div class="abs" style="left:0;right:0;top:0;height:1080px;background:#3A1E3F"></div>
  <div class="abs" style="left:0;top:0;width:360px;height:760px;background:${C.co};border-radius:0 0 80px 0"></div><div class="abs" style="right:0;top:0;width:360px;height:760px;background:${C.co};border-radius:0 0 0 80px"></div>
  <div class="abs" style="left:0;right:0;top:0;height:90px;background:${C.coS}"></div>
  <div class="abs" style="left:0;right:0;top:640px;height:120px;background:#C9873C"></div>
  <svg class="abs" style="left:0;top:0" width="1920" height="1080"><path class="spot" d="M860,0 L1060,0 L1320,760 L600,760 Z" fill="${C.suT}" opacity=".22"/></svg>
  <div class="abs" style="left:780px;top:360px">${MIA()}</div>
  <div class="abs" style="left:0;right:0;top:760px;bottom:0;background:#2A1530"></div>
  ${Array.from({length:7},(_,i)=>`<div class="abs" style="left:${80+i*260}px;top:820px;width:190px;height:240px;border-radius:95px 95px 0 0;background:#1C0E22"></div>`).join('')}`;
SHOT('payoff',W('payoff','Front'),W('payoff','Merged'),'bg-night',STAGE+`<div class="abs" style="left:810px;top:600px">${DANA_BACK()}</div><div class="abs dk" style="left:1070px;top:780px">${DUCK(.7)}</div>`,
 (q,t,t1)=>{tl.fromTo(q('.kid .arm'),{rotation:0},{rotation:-10,svgOrigin:'100 159',duration:.2,yoyo:true,repeat:Math.max(1,Math.floor((t1-t)/.4)),immediateRender:false},t);tl.fromTo(q('.spot'),{opacity:.12},{opacity:.28,duration:t1-t,ease:'sine.inOut',immediateRender:false},t);
  const ct=W('payoff','release')-.2;tl.fromTo(q('.clapL'),{x:0},{x:20,duration:.15,yoyo:true,repeat:6,immediateRender:false},ct);tl.fromTo(q('.clapR'),{x:0},{x:-20,duration:.15,yoyo:true,repeat:6,immediateRender:false},ct);cue(ct,'applause',{d:1.6});
  tl.fromTo(q('.dk .duck'),{y:0},{y:-24,duration:.2,yoyo:true,repeat:5,ease:'sine.out',immediateRender:false},ct)},{push:.05});
SHOT('payoff',W('payoff','Merged'),L('cta')-.05,'bg-night',STAGE+`<div class="abs" style="left:810px;top:600px">${DANA_BACK()}</div>
  <div class="card ph" style="left:1180px;top:520px;width:560px;padding:26px 30px;display:flex;gap:16px;align-items:center"><span style="width:56px;height:56px;border-radius:14px;background:${C.pu};color:#fff;display:flex;align-items:center;justify-content:center">${ICO('git-merge')}</span><div><div style="font-weight:800;font-size:34px">PR #1291 merged</div><div class="body" style="font-size:24px">Friday · 4:00 PM · all checks passed</div></div></div>`,
 (q,t)=>{tl.fromTo(q('.ph'),{y:60,opacity:0},{y:0,opacity:1,duration:.5,ease:E_IN,immediateRender:false},t);cue(t,'ding',{n:4})},{push:.04});

/* ================= CTA ================= */
SHOT('cta',L('cta')-.05,W('cta','Let'),'bg-pu',`
  <div class="abs cw" style="left:0;top:0">${REAL()}</div>
  <div class="c h1" style="top:140px"><span class="mask"><span class="ct1">GitHub Copilot app</span></span></div>`,
 (q,t,t1)=>{iris(t,C.pu,.5);const r=q('.rwrap');tl.fromTo(r,Object.assign(camTo(r,...FULL,[360,380,1200,620]),{opacity:0}),Object.assign(camTo(r,...FULL,[380,340,1160,600]),{opacity:1,duration:t1-t,ease:'power2.out',immediateRender:false}),t);reveal(t+.1,q('.ct1'))});
SHOT('cta',W('cta','Let'),END,'bg-cream',`
  <div class="c" style="top:250px"><div class="h1"><span class="mask"><span class="e1">Let your agents do the work.</span></span><span class="mask"><span class="e2" style="color:${C.puS}">Keep your evenings.</span></span></div></div>
  <div class="abs" style="left:1500px;top:640px">${DUCK(.9)}</div>
  <div class="c ln2" style="top:720px;display:flex;justify-content:center;gap:18px;align-items:center"><span style="display:inline-block;width:56px;height:56px">${ICON['mark-github'].replace('<svg','<svg style="width:56px;height:56px;fill:#1F1B3A"')}</span><span class="h3" style="font-size:46px">GitHub Copilot app</span><span class="pill" style="background:${C.suT};color:#8A5A00">technical preview — check your plan</span></div>
  <div class="c by" style="top:880px;font-weight:800;font-size:30px;letter-spacing:.12em;color:${C.ink2}">BY YUVAL AVIDANI · <span style="color:${C.puS}">YUV.AI</span></div>`,
 (q,t)=>{reveal(t,q('.e1'));reveal(W('cta','Keep'),q('.e2'));rise(W('cta','Keep')+.4,q('.ln2'));rise(LE('cta')+.3,q('.by'))},{push:.02});
