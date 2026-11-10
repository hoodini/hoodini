// v4 "Home by 6" — every timing comes from spoken-word timestamps (W/WE/L/LE).
const DROP = W('reveal','GitHub');
const HIDECAP = t => t > LE('cta') + .3;
const SRC = t => `<div class="foot">${t}</div>`;
const DRAMA = SRC('Dramatization · Dana and Mia are fictional · app UI is illustrative');

/* reusable scene pieces */
const DESK_NIGHT = (danaId) => `${ROOM('night')}
  <div class="abs" style="left:640px;top:170px;transform:scale(1.12);transform-origin:50% 0">${DANA(danaId)}</div>
  <div class="abs lap" style="left:590px;top:600px;transform:scale(1.08);transform-origin:50% 0">${LAPTOP(true)}</div>
  <div class="abs" style="left:1130px;top:640px">${DUCK(.72)}</div>`;
function clockAt(q,t,t1,h,m,h2,m2){ // hands from h:m to h2:m2 over the shot
  const a=q('.clk .hh'),b=q('.clk .mh');const H=(h%12+m/60)*30,M=m*6;const H2=h2==null?H+2:((h2%12+m2/60)*30+(h2<h?360:0)),M2=m2==null?M+24:(m2*6+((h2-h)*360));
  tl.fromTo(a,{rotation:H,svgOrigin:'0 0'},{rotation:H2,duration:t1-t,ease:'none',immediateRender:false},t);
  tl.fromTo(b,{rotation:M,svgOrigin:'0 0'},{rotation:M2,duration:t1-t,ease:'none',immediateRender:false},t)}
function danaIdle(q,t,t1){const eyes=q('.eye');for(let k=t+.8;k<t1-.2;k+=2.3)blink(k,eyes)}
function mouth(q,t,which){['.m-flat','.m-worry','.m-smile'].forEach(m=>tl.set(q(m),{opacity:m==='.m-'+which?1:0},t))}

/* ================= ACT 1 · 11:47 PM ================= */
SHOT('open',0,W('open','Dana'),'bg-night',DESK_NIGHT('d1')+`
  <div class="c h1" style="top:70px;color:#fff;z-index:5"><span class="mask"><span class="tt">11:47 PM</span></span></div>`,
 (q,t,t1)=>{clockAt(q,t,t1,11,47,11,47.4);reveal(t+.15,q('.tt'));tl.to(q('.tt'),{opacity:0,duration:.3,immediateRender:false},t1-.35);danaIdle(q,t,t1);mouth(q,t,'flat');cue(t,'tick',{d:t1-t})},{push:.05});

SHOT('open',W('open','Dana'),W('open','two'),'bg-night',`${ROOM('night')}
  <div class="abs" style="left:660px;top:190px;transform:scale(1.5);transform-origin:50% 0">${DANA('d2')}</div>
  <div class="abs" style="left:560px;top:760px;transform:scale(1.4);transform-origin:50% 0">${LAPTOP(true)}</div>
  <div class="lower lw"><b>Dana</b><span>Lead developer · does everything herself</span></div>${DRAMA}`,
 (q,t,t1)=>{clockAt(q,t,t1,11,47.4);slideIn(t+.1,q('.lw'),-60);danaIdle(q,t,t1);mouth(q,t,'flat')});

const NOTI=['Review requested · #1284','Build failed · main','3 new comments on #1279','Merge conflict · feat/checkout','Mentioned you in #1271','Build failed · release/2.4','Review requested · #1290','Deploy blocked'];
SHOT('open',W('open','two'),W('open','release'),'bg-night',DESK_NIGHT('d3')+`
  <div class="abs tower" style="left:1230px;top:120px;width:470px">${NOTI.map((n,i)=>`<div class="card nt" style="position:relative;margin-top:14px;padding:18px 22px;border-radius:16px;font-weight:600;font-size:22px;display:flex;gap:14px;align-items:center;transform:rotate(${[-2,1.5,-1,2,-1.5,1,-2,1.2][i]}deg)"><i style="width:14px;height:14px;border-radius:50%;background:${i%3===1?C.co:C.pu};flex:none"></i>${n}</div>`).join('')}</div>
  <div class="abs cnt" style="left:1300px;top:40px;background:${C.coS};color:#fff;border-radius:999px;padding:10px 28px;font-weight:800;font-size:44px;min-width:180px;text-align:center;height:72px"><span class="cv" style="position:relative;display:block;height:56px"></span></div>`,
 (q,t,t1)=>{const nts=[...q('.nt')].reverse();tl.fromTo(nts,{y:-600,opacity:0},{y:0,opacity:1,duration:.4,ease:'power2.in',stagger:(t1-t-.6)/8,immediateRender:false},t);for(let i=0;i<8;i++)cue(t+i*(t1-t-.6)/8+.35,'ping');
  counter(t,q('.cv')[0],[12,48,97,140,176,212],t1-t-.4);pop(t,q('.cnt'),0,null);
  tl.set(q('.duck .sweat'),{opacity:1},t+.9);mouth(q,t+.5,'worry');tl.fromTo(q('#d3 .browL'),{rotation:0},{rotation:-12,svgOrigin:'173 163',duration:.3,immediateRender:false},t+.5);tl.fromTo(q('#d3 .browR'),{rotation:0},{rotation:12,svgOrigin:'247 163',duration:.3,immediateRender:false},t+.5);clockAt(q,t,t1,11,47.6)});

SHOT('open',W('open','release'),W('open','promise'),'bg-cream',`
  <div class="card cal" style="left:560px;top:250px;width:800px;padding:0;overflow:hidden">
   <div style="background:${C.pu};color:#fff;padding:22px 34px;font-weight:700;font-size:28px;letter-spacing:.08em">FRIDAY</div>
   <div style="padding:34px"><div class="eyebrow" style="color:${C.co}">9:00 AM</div><div class="h3" style="margin-top:8px">Release 2.4 ships</div><div class="body" style="margin-top:8px">14 open pull requests · 3 failing builds</div></div></div>`,
 (q,t)=>{pop(t,q('.cal'))},{push:.02});

SHOT('open',W('open','promise'),L('promise')-.05,'bg-night',DESK_NIGHT('d5')+`
  <div class="abs note" style="left:770px;top:520px;width:300px;height:250px;background:${C.su};border-radius:6px;transform:rotate(-4deg);padding:26px 24px;box-shadow:0 14px 30px rgba(0,0,0,.25);z-index:6">
   <div class="hand" style="font-size:44px;line-height:1.05;color:${C.ink}">Mia's recital<br>Fri · 6 PM</div><div style="font-weight:800;font-size:30px;margin-top:10px;color:${C.co}">FRONT ROW ♥</div></div>`,
 (q,t,t1)=>{tl.fromTo(q('.cam'),{scale:1,x:0,y:0},{scale:1.9,x:-130,y:-420,duration:t1-t,ease:'power2.inOut',immediateRender:false},t);pop(t,q('.note'),0,'paper')},{push:0});

/* ================= the promise (warm) ================= */
SHOT('promise',L('promise')-.05,W('promise','Her'),'bg-su',`
  <div class="c h1" style="top:330px"><span class="mask"><span class="p1">6:00 PM.</span></span><span class="mask"><span class="p2" style="color:${C.co}">Front row.</span></span></div>`,
 (q,t)=>{iris(t,C.su,.6);reveal(t+.1,q('.p1'));reveal(W('promise','Front'),q('.p2'))});

SHOT('promise',W('promise','Her'),L('habit')-.05,'bg-cream',`
  <div class="abs" style="left:0;right:0;top:720px;bottom:0;background:${C.suT}"></div>
  <div class="abs mia" style="left:640px;top:420px;transform:scale(1.5);transform-origin:0 0">${MIA()}</div>
  <div class="abs nq" style="left:1180px;top:300px;font-weight:800;font-size:90px;color:${C.co}">♪?</div>
  <div class="c h3" style="top:150px">Her <span style="color:${C.pu}">very first</span> piano recital</div>`,
 (q,t,t1)=>{rise(t,q('.h3'));tl.fromTo(q('.mia .arm'),{rotation:0},{rotation:-10,svgOrigin:'100 159',duration:.18,yoyo:true,repeat:Math.floor((t1-t)/.36),immediateRender:false},t);
  pop(W('promise','piano'),q('.nq'),0,'clunk');tl.set(q('.kmouth'),{attr:{d:'M64,112 C70,106 78,106 84,112'}},W('promise','piano')+.05)});

/* ================= ACT 1b · the habit ================= */
const JUG=`<div class="abs jg" style="left:0;top:0">${[0,1,2].map(i=>`<div class="abs ball b${i}" style="left:${820+i*90}px;top:260px;width:84px;height:84px;border-radius:50%;background:${[C.pu,C.mi,C.su][i]};color:#fff;display:flex;align-items:center;justify-content:center">${ICO('git-branch')}</div>`).join('')}</div>`;
SHOT('habit',L('habit')-.05,W('habit','branch'),'bg-night',DESK_NIGHT('d7')+JUG,
 (q,t,t1)=>{iris(t,C.night,.6);[0,1,2].forEach(i=>tl.fromTo(q('.b'+i),{y:0},{y:-150,duration:.32,yoyo:true,repeat:Math.ceil((t1-t)/.64)+2,ease:'sine.out',immediateRender:false},t+i*.2));mouth(q,t,'worry');danaIdle(q,t,t1)});

SHOT('habit',W('habit','branch'),W('habit','review'),'bg-night',DESK_NIGHT('d8')+JUG,
 (q,t,t1)=>{[0,1,2].forEach(i=>tl.fromTo(q('.b'+i),{y:0},{y:-150,duration:.3,yoyo:true,repeat:Math.ceil((t1-t)/.6)+1,ease:'sine.out',immediateRender:false},t+i*.1));mouth(q,t,'worry')});

SHOT('habit',W('habit','review'),W('habit','failing'),'bg-night',DESK_NIGHT('d9')+`<div class="abs pile" style="left:560px;top:200px;width:620px">${Array.from({length:9},(_,i)=>`<div class="card rp" style="position:relative;margin-top:-8px;padding:16px 22px;border-radius:14px;font-weight:600;font-size:22px;transform:rotate(${(i%2?1:-1)*(1+i%3)}deg)">Review requested · #${1290-i*3}</div>`).join('')}</div>`,
 (q,t,t1)=>{tl.fromTo([...q('.rp')].reverse(),{y:-500,opacity:0},{y:0,opacity:1,duration:.3,stagger:(t1-t-.3)/9,ease:'power2.in',immediateRender:false},t);cue(t+.2,'paper')});

SHOT('habit',W('habit','failing'),W('habit','Because'),'bg-night',DESK_NIGHT('d10')+`${[[520,230],[1160,200],[430,520],[1300,470],[840,160]].map(([x,y],i)=>`<div class="abs fx${i}" style="left:${x}px;top:${y}px;background:${C.co};color:#fff;border-radius:999px;padding:12px 22px;font-weight:700;font-size:24px;display:flex;gap:10px;align-items:center">${ICO('x-circle-fill')} test failed</div>`).join('')}`,
 (q,t,t1)=>{[0,1,2,3,4].forEach(i=>pop(t+i*(t1-t-.3)/5,q('.fx'+i),0,'error'));mouth(q,t,'worry')});

SHOT('habit',W('habit','Because'),W('habit','yeah'),'bg-night',`${ROOM('night')}
  <div class="abs" style="left:740px;top:430px;transform:scale(2.1);transform-origin:0 0">${DUCK(1)}</div>
  <div class="card fb" style="left:260px;top:170px;width:520px;padding:22px;background:${C.night3};color:#fff">
   <div class="eyebrow" style="color:${C.su}">That one time…</div>
   <svg viewBox="0 0 460 240" width="460" height="240" style="margin-top:12px"><rect x="120" y="20" width="220" height="210" rx="16" fill="#1A1740"/>${[0,1,2,3].map(i=>`<rect x="140" y="${40+i*46}" width="180" height="34" rx="8" fill="${C.night}"/><circle cx="300" cy="${57+i*46}" r="6" fill="${i===2?C.co:C.mi}"/>`).join('')}<path d="M300,110 C290,90 306,78 300,60 C318,76 322,96 312,110 Z" fill="${C.co}"/><path d="M300,110 C296,98 304,92 302,82 C310,92 312,102 306,110 Z" fill="${C.su}"/></svg></div>`,
 (q,t)=>{pop(t+.1,q('.fb'),0,'paper');tl.set(q('.duck .sweat'),{opacity:1},t+.4);tl.fromTo(q('.duck .deye'),{scale:1},{scale:1.5,transformOrigin:'50% 50%',duration:.2,immediateRender:false},t+.3)},{push:.06});

SHOT('habit',W('habit','yeah'),L('scale')-.05,'bg-night',`${ROOM('night')}
  <div class="abs" style="left:740px;top:430px;transform:scale(2.1);transform-origin:0 0">${DUCK(1)}</div>
  <div class="c h2" style="top:170px;color:#fff"><span class="mask"><span class="wt">We don't talk about that time.</span></span></div>`,
 (q,t)=>{reveal(W('habit','We'),q('.wt'));tl.fromTo(q('.duck .wing'),{rotation:0,x:0,y:0},{rotation:-70,x:30,y:-58,svgOrigin:'80 112',duration:.35,ease:E_POP,immediateRender:false},t+.1);cue(t+.1,'squeak')});

/* ================= ACT 2 · GitHub has seen this night before ================= */
const BUILD=(w,h,lit,seed=1)=>`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${Array.from({length:Math.floor(w/80)},(_,i)=>{const bh=h*.45+((i*97+seed*31)%Math.floor(h*.5));return `<rect x="${i*80}" y="${h-bh}" width="72" height="${bh}" fill="#1A1740"/>`+Array.from({length:Math.floor(bh/40)*2},(_,k)=>{const on=((i*13+k*7+seed)%lit)===0;return `<rect class="${on?'lw':''}" x="${i*80+12+(k%2)*30}" y="${h-bh+14+Math.floor(k/2)*40}" width="18" height="20" rx="3" fill="${on?C.su:'#2B2660'}"/>`}).join('')}).join('')}</svg>`;
SHOT('scale',L('scale')-.05,W('scale','More'),'bg-night',`<div class="abs city" style="left:-200px;top:180px;transform-origin:1130px 500px">${BUILD(2320,900,4,3)}</div>
  <div class="c h2" style="top:120px;color:#fff"><span class="mask"><span class="na">But Dana's not alone.</span></span></div>`,
 (q,t,t1)=>{tl.fromTo(q('.city'),{scale:2.4},{scale:1,duration:t1-t,ease:'power2.inOut',immediateRender:false},t);reveal(W('scale','not'),q('.na'));cue(t,'whoosh')},{push:0});

SHOT('scale',W('scale','More'),W('scale','So'),'bg-night',`<div class="abs" style="left:-200px;top:320px;opacity:.9">${BUILD(2320,760,2,7)}</div>
  <div class="c" style="top:120px"><div class="h1" style="color:#fff;font-size:190px"><span class="cv" style="position:relative;display:inline-block;width:720px;height:200px"></span></div><div class="h3" style="color:${C.su};margin-top:12px">developers build on GitHub</div></div>
  ${SRC('Source: GitHub Octoverse 2025 (Oct 28, 2025) — “180 million-plus developers”')}`,
 (q,t,t1)=>{counter(W('scale','More'),q('.cv')[0],['0','30M','75M','120M','160M','180M+'],WE('scale','developers')-t-.2);rise(W('scale','developers'),q('.h3'));tl.fromTo(q('.lw'),{opacity:0},{opacity:1,duration:.05,stagger:{each:.004,from:'random'},immediateRender:false},t)});

const MINI=(i)=>`<svg viewBox="0 0 160 130" width="160" height="130"><rect width="160" height="130" rx="14" fill="${C.night3}"/><circle cx="80" cy="52" r="20" fill="${C.skin}"/><path d="M60,46 C60,30 100,30 100,46 C92,38 70,38 60,46 Z" fill="${C.hair}"/><path d="M44,130 C44,96 60,84 80,84 C100,84 116,96 116,130 Z" fill="${C.pu}"/><rect x="40" y="98" width="80" height="32" rx="6" fill="#DCDDEA"/><circle cx="138" cy="18" r="6" fill="${C.su}"/></svg>`;
SHOT('scale',W('scale','So'),L('reveal')-.05,'bg-night',`<div class="abs grid" data-layout-allow-overlap style="left:0;top:0;width:1920px;height:1080px">${Array.from({length:84},(_,i)=>`<div class="abs mn" style="left:${(i%12)*160}px;top:${Math.floor(i/12)*150+20}px;transform:scale(.92)">${MINI(i)}</div>`).join('')}</div>
  <div class="abs" style="left:0;right:0;top:360px;height:300px;background:linear-gradient(transparent,rgba(43,38,96,.92) 30%,rgba(43,38,96,.92) 70%,transparent)"></div>
  <div class="c h2" style="top:420px;color:#fff"><span class="mask"><span class="sn">GitHub has seen this night before.</span></span></div>`,
 (q,t,t1)=>{const mn=[...q('.mn')];tl.fromTo(mn,{opacity:0,scale:.5},{opacity:1,scale:.92,duration:.3,stagger:{each:.012,from:'center',grid:[7,12]},ease:E_POP,immediateRender:false},t);reveal(W('scale','seen')-.2,q('.sn'));tl.fromTo(q('.grid'),{scale:1.6},{scale:1,duration:t1-t,ease:'power2.out',immediateRender:false},t);cue(W('scale','Many'),'pop');cue(W('scale','many',2),'pop')},{push:0});

/* ================= ACT 2b · the reveal ================= */
SHOT('reveal',L('reveal')-.05,DROP,'bg-night',`<div class="c h2" style="top:420px;color:#fff"><span class="mask"><span class="wb">That's why they built…</span></span></div>`,(q,t)=>{reveal(t,q('.wb'));cue(t,'riser',{d:DROP-t})});

const APPWIN=(inner,w=1300,h=720)=>WIN('GitHub Copilot app',inner,w,h);
SHOT('reveal',DROP,W('reveal','desktop'),'bg-pu',`
  <div class="c lg" style="top:250px"><span style="display:inline-block;width:150px;height:150px">${ICON['mark-github'].replace('<svg','<svg style="width:150px;height:150px;fill:#fff"')}</span></div>
  <div class="c h1" style="top:450px"><span class="mask"><span class="wm">GitHub Copilot app</span></span></div>
  <div class="c" style="top:620px"><span class="pill tp" style="background:rgba(255,255,255,.18);color:#fff;font-size:26px">Technical preview</span></div>`,
 (q,t)=>{iris(t,C.pu,.5);pop(t+.05,q('.lg'),0,null);reveal(t+.15,q('.wm'));rise(t+.4,q('.tp'));cue(t,'hit')});

const SIDEBAR=`<div class="abs" style="left:0;top:0;bottom:0;width:270px;background:#FBF7F1;border-right:1.5px solid #EFE6D8;padding:26px 18px">${[['copilot','My Work',1],['git-branch','Sessions'],['issue-opened','Issues'],['git-pull-request','Pull requests'],['check-circle-fill','Automations']].map(([i,n,on])=>`<div style="display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:12px;font-weight:600;font-size:22px;${on?`background:${C.puT};color:${C.puS}`:`color:${C.ink2}`}">${ICO(i)}${n}</div>`).join('')}<div class="eyebrow" style="font-size:15px;color:${C.ink2};margin:26px 14px 8px">Repos</div>${['acme/web','acme/api','acme/mobile'].map(r=>`<div class="rp2" style="padding:8px 14px;font-weight:600;font-size:20px;color:${C.ink2}">● ${r}</div>`).join('')}</div>`;
const COLS=[['Agent sessions',C.pu,['Fix checkout on Safari','Bump dependencies','Release notes']],['Issues',C.mi,['#1284 Checkout 500s','#1279 Flaky e2e','#1271 Dark mode']],['Pull requests',C.co,['#1290 Payment retries','#1288 Cache headers','#1286 Docs']],['Automations',C.suS,['Nightly triage','Weekly deps','Release notes · Fri']]];
const MYWORK=`${SIDEBAR}<div class="abs" style="left:300px;right:28px;top:28px;bottom:28px;display:flex;gap:18px">${COLS.map((c,i)=>`<div class="col col${i}" style="flex:1;border-radius:18px;background:#FBF7F1;padding:16px"><div style="font-weight:800;font-size:22px;color:${c[1]};margin:4px 6px 14px">${c[0]}</div>${c[2].map(x=>`<div class="it it${i}" style="background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;font-weight:600;font-size:19px;box-shadow:0 4px 12px rgba(31,27,58,.06)">${x}<div style="margin-top:10px;height:6px;border-radius:3px;background:${c[1]};width:60%;opacity:.8"></div></div>`).join('')}</div>`).join('')}</div>`;
SHOT('reveal',W('reveal','desktop'),L('mywork')-.05,'bg-cream',`
  <div class="c h2" style="top:110px"><span class="mask"><span class="dh">A desktop home for your <span style="color:${C.pu}">coding agents</span></span></span></div>
  <div class="abs aw" style="left:310px;top:300px">${APPWIN(MYWORK,1300,640)}</div>${SRC('Illustrative UI')}`,
 (q,t)=>{reveal(t,q('.dh'));tl.fromTo(q('.aw'),{y:300,opacity:0},{y:0,opacity:1,duration:.8,ease:E_IN,immediateRender:false},t+.1);cue(t+.1,'whoosh')});

/* ================= ACT 3 · My Work ================= */
SHOT('mywork',L('mywork')-.05,W('mywork','My'),'bg-cream',`
  <div class="abs aw" style="left:310px;top:220px">${APPWIN(`${SIDEBAR}<div class="abs" style="left:300px;right:28px;top:28px;bottom:28px;border-radius:18px;background:#FBF7F1"></div>`,1300,700)}</div>
  <div class="abs" data-layout-allow-overlap style="left:0;top:0">${NOTI.concat(NOTI).map((n,i)=>`<div class="card nf" style="left:${200+(i*211)%1500}px;top:${60+(i*67)%260}px;padding:14px 20px;border-radius:14px;font-weight:600;font-size:20px;white-space:nowrap;display:flex;gap:12px;align-items:center"><i style="width:12px;height:12px;border-radius:50%;background:${i%3===1?C.co:C.pu}"></i>${n}</div>`).join('')}</div>`,
 (q,t,t1)=>{const nf=[...q('.nf')];tl.fromTo(nf,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.25,stagger:.05,immediateRender:false},t);
  tl.to(nf,{x:(i,e)=>1020-parseFloat(e.style.left),y:(i,e)=>560-parseFloat(e.style.top),scale:.2,opacity:0,duration:.55,ease:'power3.in',stagger:.03,immediateRender:false},W('mywork','calm')-.3);cue(W('mywork','calm')-.1,'whoosh')});

SHOT('mywork',W('mywork','My'),W('mywork','every'),'bg-cream',`
  <div class="eyebrow abs" style="left:310px;top:120px">My Work</div><div class="h3 abs" style="left:310px;top:158px">Everything in motion, in one calm place</div>
  <div class="abs aw" style="left:310px;top:260px">${APPWIN(MYWORK,1300,680)}</div>${SRC('Illustrative UI')}`,
 (q,t)=>{rise(t,q('.eyebrow,.h3'));tl.set(q('.col'),{opacity:.25},t);[W('mywork','Agent'),W('mywork','issues'),W('mywork','pull'),W('mywork','automations')].forEach((x,i)=>{tl.to(q('.col'+i),{opacity:1,duration:.2,immediateRender:false},x);rise(x,q('.it'+i),.06,.45);cue(x,'pop')})},{push:.02});

SHOT('mywork',W('mywork','every'),L('handoff')-.05,'bg-cream',`
  <div class="abs aw" style="left:310px;top:220px;transform:scale(1.35);transform-origin:0 0">${APPWIN(MYWORK,1300,680)}</div>
  <div class="abs" style="left:1440px;top:140px">${['acme/web','acme/api','acme/mobile'].map((r,i)=>`<div class="card rc" style="position:relative;margin-bottom:18px;padding:16px 24px;font-weight:700;font-size:26px;display:flex;gap:12px;align-items:center"><span style="width:14px;height:14px;border-radius:50%;background:${[C.pu,C.mi,C.co][i]}"></span>${r}</div>`).join('')}</div>`,
 (q,t)=>{slideIn(t,q('.rc'),120,.1);cue(t,'pop')},{push:.03});

/* ================= ACT 3b · the handoff (the turn begins) ================= */
SHOT('handoff',L('handoff')-.05,W('handoff','hands'),'bg-night',`${ROOM('night')}
  <div class="abs" style="left:660px;top:190px;transform:scale(1.5);transform-origin:50% 0">${DANA('d20')}</div>
  <div class="abs" style="left:560px;top:760px;transform:scale(1.4);transform-origin:50% 0">${LAPTOP(true)}</div>`,
 (q,t,t1)=>{mouth(q,t,'flat');tl.fromTo(q('#d20 .browR'),{y:0},{y:-10,duration:.25,immediateRender:false},W('handoff','something'));danaIdle(q,t,t1)});

const ISSUE=`<div class="card is" style="left:460px;top:240px;width:1000px;padding:36px 40px">
   <div style="display:flex;gap:14px;align-items:center"><span style="color:${C.mi}">${ICO('issue-opened')}</span>${PILL('Open',C.miT,C.miS)}<span style="font-weight:600;font-size:24px;color:${C.ink2}">#1284</span></div>
   <div class="h3" style="margin-top:18px">Checkout fails on Safari</div>
   <div class="body" style="margin-top:8px;font-size:28px">Customers can't pay on iOS. Needs a fix before Friday.</div>
   <div style="margin-top:30px;display:flex;gap:16px;align-items:center"><span class="btn asg" style="background:${C.pu};color:#fff">${ICO('copilot')} Assign to Copilot</span><span class="btn" style="background:#F4EFE6;color:${C.ink2}">Do it myself</span></div></div>`;
const CUR=`<svg class="abs cur" viewBox="0 0 24 24" width="54" height="54" style="left:0;top:0;z-index:20"><path d="M4 2l7 19 2.5-7.5L21 11z" fill="${C.ink}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
SHOT('handoff',W('handoff','hands'),W('handoff','Just'),'bg-cream',ISSUE+CUR+SRC('Illustrative UI'),
 (q,t,t1)=>{pop(t,q('.is'),0,null);const c=q('.cur');tl.fromTo(c,{x:1500,y:900},{x:640,y:700,duration:.6,ease:'power2.inOut',immediateRender:false},t+.2);
  tl.to(c,{x:1010,y:690,duration:.45,ease:'power2.inOut',immediateRender:false},t+.95);tl.to(c,{x:650,y:700,duration:.45,ease:'power2.inOut',immediateRender:false},t+1.5)});

SHOT('handoff',W('handoff','Just'),L('lanes')-.05,'bg-cream',ISSUE+CUR+`
  <div class="abs wk" style="left:500px;top:640px;opacity:0">${PILL(`${ICO('copilot')} Copilot is working on it`,C.puT,C.puS)}</div>
  <div class="abs dk" style="left:1560px;top:820px;transform:scale(1.1);transform-origin:0 0">${DUCK(1)}</div>${SRC('Illustrative UI')}`,
 (q,t,t1)=>{const c=q('.cur');tl.fromTo(c,{x:650,y:700},{x:600,y:705,duration:.5,ease:'power1.inOut',immediateRender:false},t);
  const ck=W('handoff','carefully');tl.fromTo(q('.asg'),{scale:1},{scale:.93,duration:.08,yoyo:true,repeat:1,immediateRender:false},ck);cue(ck,'click');
  tl.to(q('.asg'),{opacity:.4,duration:.2,immediateRender:false},ck+.1);tl.to(q('.wk'),{opacity:1,duration:.3,immediateRender:false},ck+.2);
  tl.fromTo(q('.dk'),{y:260},{y:0,duration:.5,ease:E_POP,immediateRender:false},W('handoff','Very'));cue(W('handoff','Very'),'squeak')});

/* ================= ACT 4 · lanes (worktrees) ================= */
const ROAD=(y,col,label,car,i)=>`<path class="ln ln${i}" d="M140,540 C420,540 480,${y} 760,${y} L1840,${y}" stroke="${col}" stroke-width="62" fill="none" stroke-linecap="round" opacity=".22" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
  <path d="M760,${y} L1840,${y}" stroke="#fff" stroke-width="5" stroke-dasharray="26 26" opacity=".7"/>`;
const LANES=[[250,C.pu,'agent · fix/safari-checkout'],[430,C.mi,'agent · chore/bump-deps'],[650,C.su,'agent · docs/release-notes'],[840,C.co,'Dana · her own branch']];
SHOT('lanes',L('lanes')-.05,W('lanes','never'),'bg-cream',`
  <svg class="abs" style="left:0;top:0" width="1920" height="1080">${LANES.map(([y,c,l],i)=>ROAD(y,c,l,1,i)).join('')}<circle cx="140" cy="540" r="44" fill="${C.ink}"/></svg>
  <div class="abs" style="left:52px;top:504px;width:176px;text-align:center;font-weight:800;font-size:22px;color:#fff">main</div>
  ${LANES.map(([y,c,l],i)=>`<div class="abs lb lb${i}" style="left:800px;top:${y-86}px;font-weight:700;font-size:24px;color:${i===3?C.coS:C.ink}">${l}</div>
   <div class="abs car car${i}" style="left:780px;top:${y-28}px;width:110px;height:56px;border-radius:16px;background:${c};display:flex;align-items:center;justify-content:center;color:#fff">${i===3?'<span style="font-size:0">.</span>'+DUCK(.28):ICO('copilot')}</div>`).join('')}
  <div class="abs eyebrow" style="left:120px;top:120px">One git worktree per session</div>`,
 (q,t,t1)=>{tl.fromTo(q('.ln'),{strokeDashoffset:1},{strokeDashoffset:0,duration:.8,stagger:.12,ease:E_IN,immediateRender:false},t);fadeIn(t+.4,q('.lb'),.3);rise(t,q('.eyebrow'));
  q('.car').forEach((c,i)=>tl.fromTo(c,{x:0,opacity:0},{x:(i===3?520:880-i*90),opacity:1,duration:(t1-t)+2.5,ease:'power1.inOut',immediateRender:false},t+.3));cue(t,'whoosh')},{push:.02});

SHOT('lanes',W('lanes','never'),L('merge')-.05,'bg-cream',`
  <svg class="abs" style="left:0;top:0" width="1920" height="1080">${LANES.map(([y,c])=>`<path d="M-100,${y} L2020,${y}" stroke="${c}" stroke-width="62" opacity=".22" stroke-linecap="round"/><path d="M-100,${y} L2020,${y}" stroke="#fff" stroke-width="5" stroke-dasharray="26 26" opacity=".7"/>`).join('')}</svg>
  ${LANES.map(([y,c],i)=>`<div class="abs car2 cc${i}" style="left:${300+i*160}px;top:${y-28}px;width:110px;height:56px;border-radius:16px;background:${c};display:flex;align-items:center;justify-content:center;color:#fff">${i===3?DUCK(.28):ICO('copilot')}</div>`).join('')}
  <div class="c h2" style="top:100px"><span class="mask"><span class="nv">Never on each other's toes.</span></span></div>
  <div class="abs hers" style="left:1180px;top:890px;font-weight:800;font-size:40px;color:${C.coS};opacity:0">Or on hers. 🦆</div>`,
 (q,t,t1)=>{reveal(t,q('.nv'));q('.car2').forEach((c,i)=>tl.fromTo(c,{x:0},{x:1000-i*60,duration:t1-t,ease:'none',immediateRender:false},t));tl.to(q('.hers'),{opacity:1,duration:.3,immediateRender:false},W('lanes','Or'));cue(W('lanes','Or'),'squeak')},{push:0});

/* ================= ACT 5 · Agent Merge (the part nobody enjoys) ================= */
const CHECK=`<div class="card ck" style="left:460px;top:250px;width:1000px;padding:12px 40px 30px">
  ${[['Tests','te'],['Reviewers','rv'],['Failing check fixed','fx']].map(([n,c])=>`<div class="row ${c}"><span class="xo" style="color:${C.co}">${ICO('x-circle-fill')}</span><span class="ok" style="color:${C.mi};display:none">${ICO('check-circle-fill')}</span><span style="flex:1">${n}</span><span class="st" style="font-weight:700;font-size:26px;color:${C.ink2}"><span class="sa">${{te:'2 failing',rv:'0 of 2',fx:'build broken'}[c]}</span><span class="sb" style="display:none;color:${C.miS}">${{te:'all passing',rv:'2 of 2',fx:'fixed by agent'}[c]}</span></span></div>`).join('')}
  <div style="margin-top:28px;display:flex;justify-content:flex-end"><span class="btn mg" style="background:#F4EFE6;color:${C.ink2}">${ICO('git-merge')} <span class="m1">Merge when rules are met</span><span class="m2" style="display:none">Merged</span></span></div></div>`;
SHOT('merge',L('merge')-.05,W('merge','watches'),'bg-cream',`
  <div class="c" style="top:360px"><div class="eyebrow">Agent Merge</div><div class="h1" style="margin-top:14px"><span class="mask"><span class="am">the part nobody enjoys</span></span></div></div>`,
 (q,t)=>{rise(t,q('.eyebrow'));reveal(W('merge','nobody')-.2,q('.am'))});

SHOT('merge',W('merge','watches'),W('merge','merges'),'bg-cream',CHECK+`<div class="abs" style="left:120px;top:140px"><div class="eyebrow">Agent Merge · PR #1291</div></div>${SRC('Illustrative UI')}`,
 (q,t,t1)=>{pop(t,q('.ck'),0,null);const pass=(row,tt)=>{tl.set(q(`.${row} .xo, .${row} .sa`),{display:'none'},tt);tl.set(q(`.${row} .ok`),{display:'block'},tt);tl.set(q(`.${row} .sb`),{display:'inline'},tt);pop(tt,q(`.${row} .ok`),0,'ding')};
  pass('te',WE('merge','tests'));pass('rv',WE('merge','reviewers'));pass('fx',WE('merge','breaks'))});

SHOT('merge',W('merge','merges'),L('control')-.05,'bg-cream',CHECK+`<div class="abs mini" style="left:1560px;top:120px">${CLOCK('clk')}</div><div class="abs" style="left:1520px;top:300px;width:250px;text-align:center;font-weight:700;font-size:24px;color:${C.ink2}">Friday</div>${SRC('Illustrative UI')}`,
 (q,t,t1)=>{['te','rv','fx'].forEach(r=>{tl.set(q(`.${r} .xo, .${r} .sa`),{display:'none'},t);tl.set(q(`.${r} .ok`),{display:'block'},t);tl.set(q(`.${r} .sb`),{display:'inline'},t)});
  const mg=q('.mg');tl.to(mg,{backgroundColor:C.pu,color:'#fff',duration:.3,immediateRender:false},W('merge','rules'));tl.set(q('.mg .m1'),{display:'none'},W('merge','met'));tl.set(q('.mg .m2'),{display:'inline'},W('merge','met'));pop(W('merge','met'),mg,0,'stamp');
  clockAt(q,t,t1,9,0,16,0)});

/* ================= ACT 6 · letting go ≠ losing control ================= */
SHOT('control',L('control')-.05,W('control','sandbox'),'bg-mi',`
  <svg class="abs" style="left:0;top:0" width="1920" height="1080"><path class="str" d="M560,980 C700,760 1000,520 1300,300" stroke="${C.ink}" stroke-width="4" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
  <svg class="abs kite" style="left:1210px;top:150px" width="200" height="260" viewBox="0 0 200 260"><path d="M100,0 L190,110 L100,200 L10,110 Z" fill="${C.pu}"/><path d="M100,0 L100,200 L10,110 Z" fill="${C.puS}"/><path d="M100,200 C90,220 110,230 100,250" stroke="${C.ink}" stroke-width="4" fill="none"/></svg>
  <div class="abs" style="left:120px;top:160px;width:900px"><div class="h1" style="color:${C.ink}"><span class="mask"><span class="lg1">Letting go</span></span><span class="mask"><span class="lg2" style="color:#fff">≠ losing control.</span></span></div></div>`,
 (q,t,t1)=>{draw0(t,q('.str'));reveal(t,q('.lg1'));reveal(W('control','control'),q('.lg2'));tl.fromTo(q('.kite'),{y:40,rotation:-6},{y:-20,rotation:6,duration:(t1-t)/2,yoyo:true,repeat:1,ease:'sine.inOut',transformOrigin:'50% 80%',immediateRender:false},t)});
function draw0(t,el){tl.fromTo(el,{strokeDashoffset:1},{strokeDashoffset:0,duration:.8,ease:E_IN,immediateRender:false},t)}

SHOT('control',W('control','sandbox'),W('control','autopilot'),'bg-cream',`
  <div class="card sb" style="left:200px;top:250px;width:680px;height:520px">
   <div class="eyebrow">Sandbox</div><div class="h3" style="margin-top:10px">Local or cloud</div>
   <div style="position:absolute;left:40px;right:40px;top:200px;bottom:40px;border:4px dashed ${C.pu};border-radius:22px;display:flex;align-items:center;justify-content:center;background:${C.puT}"><span style="color:${C.pu};transform:scale(3)">${ICO('copilot')}</span></div></div>
  <div class="card pm" style="left:980px;top:330px;width:740px">
   <div class="eyebrow" style="color:${C.coS}">Cloud agent · asks first</div><div class="h3" style="margin-top:12px;font-size:44px">Allow Copilot to edit <span class="mono" style="font-size:38px">checkout.ts</span>?</div>
   <div style="display:flex;gap:16px;margin-top:26px"><span class="btn al" style="background:${C.mi};color:#fff">Allow</span><span class="btn" style="background:#F4EFE6;color:${C.ink2}">Deny</span></div></div>
  ${CUR}${SRC('Illustrative UI')}`,
 (q,t)=>{pop(t,q('.sb'),0,'pop');pop(W('control','cloud'),q('.pm'),0,'pop');const c=q('.cur');tl.fromTo(c,{x:1700,y:950},{x:1040,y:640,duration:.5,ease:'power2.inOut',immediateRender:false},W('control','change')-.5);tl.fromTo(q('.al'),{scale:1},{scale:.92,duration:.08,yoyo:true,repeat:1,immediateRender:false},W('control','change'));cue(W('control','change'),'click')});

SHOT('control',W('control','autopilot'),L('money')-.05,'bg-cream',`
  <div class="c" style="top:260px"><div class="eyebrow">Autopilot</div></div>
  <div class="abs tg" style="left:760px;top:340px;width:400px;height:200px;border-radius:100px;background:#E4DDD2"><div class="kn" style="position:absolute;left:20px;top:20px;width:160px;height:160px;border-radius:50%;background:#fff;box-shadow:0 8px 20px rgba(31,27,58,.2)"></div></div>
  <div class="c h2" style="top:600px">only when <span style="color:${C.pu}">you</span> say so.</div>
  <div class="c" style="top:760px"><span class="pill mp" style="background:${C.puT};color:${C.puS};font-size:26px">Model: Auto ▾ &nbsp;·&nbsp; or pick your own</span></div>`,
 (q,t)=>{rise(t,q('.c.h2'));const ts=W('control','say');tl.to(q('.kn'),{x:200,duration:.3,ease:E_POP,immediateRender:false},ts);tl.to(q('.tg'),{backgroundColor:C.mi,duration:.25,immediateRender:false},ts);cue(ts,'click');rise(ts+.3,q('.mp'))});

/* ================= ACT 7 · the honest part ================= */
const PLANS=[['Pro','$10','/ month'],['Pro+','$39','/ month'],['Business','$19','/ user / month'],['Enterprise','$39','/ user / month']];
SHOT('money',L('money')-.05,W('money','plan'),'bg-cream',`
  <div class="c" style="top:340px"><div class="eyebrow" style="color:${C.coS}">The honest part</div><div class="h1" style="margin-top:16px"><span class="mask"><span class="hp">It runs on AI credits.</span></span></div><div class="body" style="margin-top:22px">Usage is metered in tokens · 1 credit = $0.01</div></div>`,
 (q,t)=>{rise(t,q('.eyebrow'));reveal(W('money','credits')-.3,q('.hp'));rise(W('money','credits'),q('.body'))});

SHOT('money',W('money','plan'),W('money','hard'),'bg-cream',`
  <div class="c eyebrow" style="top:190px">Included credits every month</div>
  <div class="abs" style="left:190px;right:190px;top:290px;display:flex;gap:30px">${PLANS.map(([n,p,u],i)=>`<div class="card pl" style="position:relative;flex:1;text-align:center;padding:44px 20px"><div style="font-weight:700;font-size:28px;color:${[C.pu,C.puS,C.miS,C.coS][i]}">${n}</div><div class="h1" style="font-size:120px;margin:20px 0 6px">${p}</div><div class="body" style="font-size:24px">${u}</div></div>`).join('')}</div>
  ${SRC('Source: GitHub Blog, “GitHub Copilot is moving to usage-based billing” (Apr 27, 2026)')}`,
 (q,t)=>{rise(t,q('.eyebrow'));pop(t+.1,q('.pl'),.09)});

SHOT('money',W('money','hard'),L('listen')-.05,'bg-cream',`
  <div class="c eyebrow" style="top:230px">Budgets · user, cost center or enterprise</div>
  <div class="abs" style="left:360px;top:330px;width:1200px;height:90px;border-radius:45px;background:#EFE6D8;overflow:hidden"><div class="fill" style="width:0%;height:100%;border-radius:45px;background:${C.pu}"></div></div>
  <div class="abs capm" style="left:1330px;top:300px;width:12px;height:150px;border-radius:6px;background:${C.co}"></div>
  <div class="abs capl" style="left:1280px;top:470px;font-weight:800;font-size:34px;color:${C.coS}">Hard cap</div>
  <div class="c h2" style="top:620px"><span class="mask"><span class="ns">No surprise bills.</span></span></div>`,
 (q,t,t1)=>{rise(t,q('.eyebrow'));pop(W('money','cap'),q('.capm,.capl'),.05,'snap');tl.fromTo(q('.fill'),{width:'0%'},{width:'80%',duration:t1-t-.4,ease:'power2.out',immediateRender:false},t);reveal(W('money','bill'),q('.ns'))});

/* ================= ACT 8 · they keep shipping, and listening ================= */
SHOT('listen',L('listen')-.05,W('listen','Nineteen'),'bg-pu',`
  <div class="c h1" style="top:380px"><span class="mask"><span class="ks">And the team keeps shipping.</span></span></div>`,
 (q,t)=>{iris(t,C.pu,.55);reveal(t+.1,q('.ks'))});

const FEAT=['Canvases','Voice','Cloud sessions','Cloud automations','CLI sessions in My Work','Agentic browsing','Rubber duck','/chronicle'];
SHOT('listen',W('listen','Nineteen'),W('listen','feedback'),'bg-cream',`
  <div class="abs" style="left:190px;top:150px;display:grid;grid-template-columns:repeat(19,68px);gap:10px">${Array.from({length:19},(_,i)=>`<div class="dq" style="width:68px;height:68px;border-radius:14px;background:#EFE6D8"></div>`).join('')}</div>
  <div class="abs" style="left:190px;top:240px;font-weight:700;font-size:26px;color:${C.ink2}">May 14 · launch</div>
  <div class="abs" style="right:190px;top:240px;font-weight:700;font-size:26px;color:${C.puS}">Jun 2 · 8 new features</div>
  <div class="abs" style="left:190px;right:190px;top:390px;display:flex;flex-wrap:wrap;gap:20px;justify-content:center">${FEAT.map((f,i)=>`<span class="pill ft" style="font-size:34px;padding:16px 30px;background:${[C.puT,C.miT,C.suT,C.coT][i%4]};color:${[C.puS,C.miS,'#9A6A00',C.coS][i%4]}">${f}</span>`).join('')}</div>
  ${SRC('Source: GitHub Changelog — May 14 & Jun 2, 2026')}`,
 (q,t)=>{tl.to(q('.dq'),{backgroundColor:(i)=>['#9BE9A8','#40C463','#30A14E','#216E39'][i%4],duration:.08,stagger:.05,immediateRender:false},t);cue(t,'tick',{d:1});pop(W('listen','eight'),q('.ft'),.1)});

SHOT('listen',W('listen','feedback'),L('payoff')-.05,'bg-cream',`
  <div class="card th" style="left:410px;top:250px;width:1100px;padding:34px 40px">
   <div class="eyebrow">GitHub Community</div><div class="h3" style="margin-top:10px">Join the discussion</div>
   ${[['What should agents do next?',C.pu],['Canvases are 🔥 — more please',C.mi],['Can I cap spend per team?',C.co]].map(([m,c],i)=>`<div class="bb" style="display:flex;gap:16px;align-items:center;margin-top:24px"><span style="width:52px;height:52px;border-radius:50%;background:${c};flex:none"></span><span style="background:#F7F2EA;border-radius:18px;padding:16px 24px;font-weight:600;font-size:28px">${m}</span></div>`).join('')}</div>
  ${SRC('Open feedback thread linked from each changelog post · example comments are illustrative')}`,
 (q,t)=>{pop(t,q('.th'),0,null);rise(t+.3,q('.bb'),.3);cue(t+.3,'pop');cue(t+.6,'pop');cue(t+.9,'pop')});

/* ================= ACT 9 · 6:02 PM (peak) ================= */
SHOT('payoff',L('payoff')-.05,W('payoff','Front'),'bg-su',`
  <div class="c h1" style="top:360px;font-size:220px"><span class="mask"><span class="t6">6:02 PM</span></span></div>`,
 (q,t)=>{iris(t,C.su,.55);reveal(t+.1,q('.t6'));cue(t,'hit_soft')});

const STAGE=`<div class="abs" style="left:0;right:0;top:0;height:1080px;background:#3A1E3F"></div>
  <div class="abs" style="left:0;top:0;width:360px;height:760px;background:${C.co};border-radius:0 0 80px 0"></div><div class="abs" style="right:0;top:0;width:360px;height:760px;background:${C.co};border-radius:0 0 0 80px"></div>
  <div class="abs" style="left:0;right:0;top:0;height:90px;background:${C.coS}"></div>
  <div class="abs" style="left:0;right:0;top:640px;height:120px;background:#C9873C"></div>
  <svg class="abs" style="left:0;top:0" width="1920" height="1080"><path d="M860,0 L1060,0 L1320,760 L600,760 Z" fill="${C.suT}" opacity=".22"/></svg>
  <div class="abs" style="left:780px;top:360px">${MIA()}</div>
  <div class="abs" style="left:0;right:0;top:760px;bottom:0;background:#2A1530"></div>
  ${Array.from({length:7},(_,i)=>`<div class="abs" style="left:${80+i*260}px;top:820px;width:190px;height:240px;border-radius:95px 95px 0 0;background:#1C0E22"></div>`).join('')}`;
SHOT('payoff',W('payoff','Front'),W('payoff','Merged'),'bg-night',STAGE+`<div class="abs dn" style="left:810px;top:600px">${DANA_BACK()}</div><div class="abs" style="left:1070px;top:780px">${DUCK(.7)}</div>`,
 (q,t,t1)=>{tl.fromTo(q('.kid .arm'),{rotation:0},{rotation:-10,svgOrigin:'100 159',duration:.2,yoyo:true,repeat:Math.floor((t1-t)/.4),immediateRender:false},t);
  tl.fromTo(q('.clapL'),{x:0},{x:20,duration:.15,yoyo:true,repeat:6,immediateRender:false},W('payoff','release')-.2);tl.fromTo(q('.clapR'),{x:0},{x:-20,duration:.15,yoyo:true,repeat:6,immediateRender:false},W('payoff','release')-.2);cue(W('payoff','release')-.2,'applause',{d:1.6})},{push:.05});

SHOT('payoff',W('payoff','Merged'),L('cta')-.05,'bg-night',STAGE+`<div class="abs" style="left:810px;top:600px">${DANA_BACK()}</div>
  <div class="card ph" style="left:1180px;top:520px;width:560px;padding:26px 30px;display:flex;gap:16px;align-items:center"><span style="width:56px;height:56px;border-radius:14px;background:${C.pu};color:#fff;display:flex;align-items:center;justify-content:center">${ICO('git-merge')}</span><div><div style="font-weight:800;font-size:34px">PR #1291 merged</div><div class="body" style="font-size:24px">Friday · 4:00 PM · all checks passed</div></div></div>`,
 (q,t)=>{tl.fromTo(q('.ph'),{y:60,opacity:0},{y:0,opacity:1,duration:.5,ease:E_IN,immediateRender:false},t);cue(t,'ding',{n:4})},{push:.04});

/* ================= CTA ================= */
SHOT('cta',L('cta')-.05,W('cta','Let'),'bg-pu',`
  <div class="c lg" style="top:210px"><span style="display:inline-block;width:120px;height:120px">${ICON['mark-github'].replace('<svg','<svg style="width:120px;height:120px;fill:#fff"')}</span></div>
  <div class="c h1" style="top:380px">GitHub Copilot app</div>
  <div class="c" style="top:540px"><span class="pill" style="background:rgba(255,255,255,.18);color:#fff;font-size:28px">Technical preview · now</span></div>
  <div class="abs" style="left:0;right:0;top:660px;display:flex;gap:22px;justify-content:center">${['Pro','Pro+','Business','Enterprise'].map(p=>`<span class="pill pp" style="background:#fff;color:${C.puS};font-size:32px;padding:12px 28px">${p}</span>`).join('')}</div>`,
 (q,t)=>{iris(t,C.pu,.5);pop(t,q('.lg'),0,null);rise(t+.1,q('.c.h1'));const w=[W('cta','Pro'),W('cta','Pro',2),W('cta','Business'),W('cta','Enterprise')];q('.pp').forEach((e,i)=>pop(w[i],[e],0,'pop'))});

SHOT('cta',W('cta','Let'),END,'bg-cream',`
  <div class="c" style="top:250px"><div class="h1"><span class="mask"><span class="e1">Let your agents do the work.</span></span><span class="mask"><span class="e2" style="color:${C.puS}">Keep your evenings.</span></span></div></div>
  <div class="abs" style="left:1500px;top:640px">${DUCK(.9)}</div>
  <div class="c" style="top:720px;display:flex;justify-content:center;gap:18px;align-items:center"><span style="display:inline-block;width:56px;height:56px">${ICON['mark-github'].replace('<svg','<svg style="width:56px;height:56px;fill:#1F1B3A"')}</span><span class="h3" style="font-size:46px">GitHub Copilot app</span><span class="pill" style="background:${C.suT};color:#8A5A00">technical preview — check your plan</span></div>
  <div class="c by" style="top:880px;font-weight:800;font-size:30px;letter-spacing:.12em;color:${C.ink2}">BY YUVAL AVIDANI · <span style="color:${C.puS}">YUV.AI</span></div>`,
 (q,t)=>{reveal(t,q('.e1'));reveal(W('cta','Keep'),q('.e2'));rise(W('cta','Keep')+.4,q('.c[style*="720px"]'));rise(LE('cta')+.3,q('.by'));cue(LE('cta')+.3,'hit_soft')},{push:.02});
