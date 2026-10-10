// v3 "STORY" — Dana's night → GitHub's scale → the app → shipping velocity → 5 PM.
// Every timing is derived from spoken-word timestamps via W()/WE()/L()/LE().
const DROP = W('reveal','GitHub');
const BREAK0 = LE('turn')+.05, BREAK1 = L('reveal')-.8;
const HIDECAP = t => t > LE('end')+.25;
const FACT = (txt,extra='')=>`<div class="mono" style="position:absolute;left:60px;bottom:40px;font-size:18px;color:rgba(255,255,255,.9);background:rgba(0,0,0,.6);padding:6px 14px;border-radius:8px;z-index:61;${extra}">${txt}</div>`;
const ILLUS = FACT('illustrative UI · not a real screenshot');
const DRAMA = FACT('dramatization · Dana is a fictional developer');
const STAMP = (txt)=>`<div class="stampchip" style="position:absolute;left:60px;top:92px;z-index:61;font-family:'Monaspace Neon';font-size:24px;font-weight:700;letter-spacing:.08em;background:#FFE600;color:#07030F;padding:8px 18px;border-radius:6px;box-shadow:5px 5px 0 #000">${txt}</div>`;
// live-stream style emoji reactions rising on the right
function reactions(t,d,list='😂🤣💀🔥😭',n=14){const L=[...list];for(let i=0;i<n;i++){const e=document.createElement('div');e.className='pt';e.textContent=L[i%L.length];
  e.style.cssText+=`left:${1640+rnd()*180}px;top:980px;font-size:${46+rnd()*30}px;opacity:0;border-radius:0;`;fx.appendChild(e);const t0=t+rnd()*d;
  tl.fromTo(e,{y:0,x:0,opacity:1,scale:.6},{y:-(520+rnd()*260),x:(rnd()-.5)*140,opacity:0,scale:1.2,duration:1.4+rnd()*.6,ease:'power1.out',immediateRender:false},t0)}}

/* ---------- b-roll scene builders (synthesized) ---------- */
const SKY=(night)=>night?'linear-gradient(#050816,#131A4A 70%,#2B1D63)':'linear-gradient(#FF7A18,#FF2E88 55%,#7C3AED)';
function ROOM(night){
  const win=`<div style="position:absolute;left:1180px;top:130px;width:580px;height:420px;border:16px solid ${night?'#2a2350':'#5b2a6b'};border-radius:14px;background:${SKY(night)};overflow:hidden">
    ${night?'<div style="position:absolute;left:420px;top:40px;width:80px;height:80px;border-radius:50%;background:#FFF7D6;box-shadow:0 0 60px #FFF7D6"></div>':'<div class="sun" style="position:absolute;left:230px;top:250px;width:140px;height:140px;border-radius:50%;background:#FFE08A;box-shadow:0 0 120px #FFD166"></div>'}
    ${Array.from({length:9},(_,i)=>`<div style="position:absolute;left:${i*66}px;bottom:0;width:58px;height:${120+((i*53)%180)}px;background:${night?'#0B0F2A':'#3B0F4F'}">${Array.from({length:8},(_,k)=>`<i style="position:absolute;left:${8+(k%3)*16}px;top:${12+Math.floor(k/3)*22}px;width:8px;height:10px;background:${((i+k)*7)%3?'transparent':'#FFD166'}"></i>`).join('')}</div>`).join('')}</div>`;
  const desk=`<div style="position:absolute;left:0;right:0;top:760px;height:320px;background:${night?'#140E2E':'#3a1640'}"></div>
    <div style="position:absolute;left:330px;top:300px;width:760px;height:440px;border-radius:18px;background:#0b0b12;border:12px solid #25233a;box-shadow:0 0 ${night?160:40}px ${night?'#22D3EE':'#000'}">
     <div class="mon" style="position:absolute;inset:0;padding:22px;font:500 22px 'Monaspace Neon';line-height:1.6;color:${night?'#A3E635':'#555'};background:${night?'#07121a':'#111'}">${night?`<div>$ npm test</div><div style="color:#FF4D4D">✗ 23 failing</div><div>$ git pull</div><div style="color:#FF4D4D">CONFLICT (content): src/auth.ts</div><div>$ <span class="cur">▍</span></div>`:'<div style="text-align:center;margin-top:150px;font-size:34px">💤 logged off</div>'}</div></div>
    <div style="position:absolute;left:660px;top:740px;width:100px;height:40px;background:#25233a"></div>`;
  const clock=`<div style="position:absolute;left:150px;top:150px;padding:14px 26px;border-radius:14px;background:#000;border:3px solid #333;font:900 90px 'Monaspace Neon';color:${night?'#FF2E4D':'#A3E635'};text-shadow:0 0 24px currentColor">${night?'2:07':'5:00'}<span style="font-size:40px"> ${night?'AM':'PM'}</span></div>`;
  const mug=`<div style="position:absolute;left:1130px;top:640px;font-size:120px">☕</div>${night?'<svg class="hand steam" style="left:1150px;top:520px" width="120" height="140"><path pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="rgba(255,255,255,.6)" stroke-width="6" d="M30,130 C0,90 60,70 30,30 M80,130 C50,90 110,70 80,30"/></svg>':''}`;
  return `<div style="position:absolute;inset:0;background:${night?'#0A0820':'#2a0f3a'}"></div>${win}${desk}${clock}${mug}`;
}

/* ============ 01 COLD OPEN — 2:07 AM ============ */
SHOT('cold', 0, W('cold','Four'), 'black', ROOM(true)+`<div class="dana" style="position:absolute;left:560px;top:560px;font-size:260px;z-index:5">🧑‍💻</div>${STAMP('📍 DANA\'S APARTMENT · 2:07 AM')}${DRAMA}
  <div class="nm" style="position:absolute;left:830px;top:600px;z-index:6"><span class="chip" style="color:#FFE600;font-size:30px">this is Dana 👋</span></div>`,
 (q,t,t1)=>{fade(t,q('.punch > div'),.4);pop(W('cold','Dana'),q('.nm'));draw(t+.3,q('.steam path'),1.2);tl.fromTo(q('.dana'),{y:20},{y:0,duration:t1-t,ease:'sine.inOut',immediateRender:false},t);cue(t,'riser_s',{d:1})},{nojump:true});

SHOT('cold', W('cold','Four'), W('cold','Ninety'), 'neon', `
  <div class="scene"><div class="rig ph" style="left:760px;top:130px;width:400px;height:780px;border-radius:56px;background:#0b0b10;border:12px solid #2a2a33;box-shadow:0 0 80px #FF2E88;overflow:hidden">
   <div style="position:absolute;inset:0;background:linear-gradient(#1E1B4B,#07030F)"></div>
   ${['🔴 CI failed · main','💬 @dana review requested','🔴 CI failed · feat/auth','👀 3 new comments on #88','⚠ merge conflict · #91','💬 @dana "quick q"','🔴 deploy blocked'].map((n,i)=>`<div class="nt" style="position:absolute;left:14px;right:14px;top:${40+i*98}px;padding:14px;border-radius:16px;background:rgba(255,255,255,.12);font:600 20px 'Mona Sans'">${n}</div>`).join('')}</div></div>
  <div class="disp" style="position:absolute;left:90px;top:300px;font-size:220px;color:#FF2E88;text-shadow:0 0 40px #FF2E88"><span class="n">0</span></div>
  <div class="serif" style="position:absolute;left:100px;top:540px;font-size:80px">notifications</div>`,
 (q,t,t1,el)=>{count(t,q('.n')[0],0,400,t1-t);tl.fromTo(q('.nt'),{y:-120,opacity:0},{y:0,opacity:1,duration:.25,stagger:(t1-t)/8,ease:'back.out(2)',immediateRender:false},t);
  const o={p:0};tl.fromTo(o,{p:0},{p:1,duration:t1-t,ease:'none',immediateRender:false,onUpdate:()=>{q('.ph')[0].style.translate=`${Math.sin(o.p*140)*6}px 0`}},t);cue(t,'buzz_s');cue(t+.4,'buzz_s')},{nojump:true});

SHOT('cold', W('cold','Ninety'), W('cold','One'), 'black', `
  <div class="c disp" style="top:230px;font-size:330px;color:#22D3EE;text-shadow:0 0 40px #22D3EE"><span class="n">0</span></div>
  <div class="c disp" style="top:600px;font-size:90px">open pull requests</div>
  <div class="sticker am" style="left:1300px;top:200px">send help 🆘</div>`,
 (q,t,t1)=>{count(t,q('.n')[0],0,97,.7);slam(W('cold','open'),q('.c.disp')[1]);sticker(t+.5,q('.sticker')[0],6)});

const BUB=(()=>{let h='';for(let i=0;i<44;i++)h+=`<div class="cb" style="position:absolute;left:${80+rnd()*1700}px;top:${120+rnd()*700}px;padding:8px 14px;border-radius:16px 16px 16px 4px;background:${NEON[i%5]};color:#07030F;font:700 20px 'Mona Sans'">${['nit:','why?','+1','LGTM?','see above','🤔','rebase pls','nit 2','can we…','wontfix?','✅','bikeshed'][i%12]}</div>`;return h})();
SHOT('cold', W('cold','One'), L('pain')-.05, 'neon', BUB+`
  <div class="card pr" style="left:410px;top:300px;width:1100px;z-index:5;border-color:#FF2E88;box-shadow:0 0 70px #FF2E88">
   <div style="display:flex;gap:14px;align-items:center"><span class="chip" style="color:#A3E635;font-size:22px">Open</span><span class="mono" style="opacity:.6;font-size:24px">#88</span></div>
   <div style="font:900 90px 'Mona Sans';margin:14px 0">"quick fix"</div>
   <div style="font:800 46px 'Mona Sans'">💬 <span class="n" style="color:#FF2E88">0</span> comments</div></div>
  <div class="sticker li" style="left:1260px;top:720px;z-index:6">LGTM 👍 (didn't read)</div>`,
 (q,t,t1)=>{pop(t,q('.pr'));count(W('cold','three'),q('.n')[0],0,347,.9);tl.fromTo(q('.cb'),{scale:0,opacity:0},{scale:1,opacity:1,duration:.2,stagger:(t1-t-.3)/44,ease:'back.out(3)',immediateRender:false},t+.2);cue(W('cold','comments'),'buzz');sticker(W('cold','comments'),q('.sticker')[0],-6);reactions(W('cold','comments'),1.2)},{nojump:true});

/* ============ 02 PAIN ============ */
const TABN=['PR #88','CI logs','Jira-ish','docs','StackOvf','Azure','staging','chat','issue #9','dashb.','diff','prod??','reviews','tab 400'];
SHOT('pain', L('pain')-.05, W('pain','Two'), 'neon', `
  <div class="scene"><div class="rig" style="left:960px;top:520px">${Array.from({length:28},(_,i)=>{const a=i/28*Math.PI*2,r=380+(i%3)*150;return `<div class="tb" style="position:absolute;left:${Math.cos(a)*r*1.5-140}px;top:${Math.sin(a)*r*.7-35}px;width:280px;height:70px;border-radius:14px;background:rgba(20,16,36,.92);border:2px solid ${NEON[i%5]};box-shadow:0 0 20px ${NEON[i%5]};font:700 22px 'Monaspace Neon';padding:20px 16px;white-space:nowrap;transform:rotate(${(rnd()-.5)*30}deg)">◉ ${TABN[i%14]}</div>`}).join('')}</div></div>
  <div class="c disp" style="top:400px;font-size:170px">TABS.<br><span class="serif" style="font-size:110px;font-weight:400">everywhere.</span></div>`,
 (q,t)=>{fly3d(t,q('.tb'),{z:-2600},.5);slam(t,q('.c.disp'))},{nojump:true});

SHOT('pain', W('pain','Two'), W('pain','And'), 'hot', `
  <div class="orb o1" style="left:320px;top:540px;background:#A855F7;box-shadow:0 0 70px 24px #A855F7"></div>
  <div class="orb o2" style="left:1600px;top:540px;background:#22D3EE;box-shadow:0 0 70px 24px #22D3EE"></div>
  <div class="c disp" style="top:220px;font-size:100px">2 agents · 1 branch</div>
  <div class="c" style="top:640px"><span class="chip br" style="font-size:46px;color:#fff;border-color:#fff">${I('git-branch')} main</span></div>
  <div class="sticker" style="left:960px;top:780px">merge conflict? never heard of her</div>`,
 (q,t,t1,el)=>{tl.fromTo(q('.o1'),{x:0},{x:590,duration:t1-t-.2,ease:'power2.in',immediateRender:false},t);tl.fromTo(q('.o2'),{x:0},{x:-590,duration:t1-t-.2,ease:'power2.in',immediateRender:false},t);slam(t,q('.c.disp'));
  burst(t1-.2,960,560,50,['#fff','#FFE600','#22D3EE']);flash(t1-.2,'#fff',.8);cue(t1-.2,'slam');shake(t1-.2,el.querySelector('.punch'),24);sticker(W('pain','same'),q('.sticker')[0],-4)},{nojump:true});

SHOT('pain', W('pain','And'), L('turn')-.05, 'matrix', `
  <div class="scene"><div class="rig gb" style="left:260px;top:220px">${MAC('zsh — ~/checkout','<div class="term" style="font-size:36px"><span class="tt"></span><br><span class="out" style="color:#FBBF24"></span></div>',1400,380)}</div></div>
  <div class="c disp" style="top:680px;font-size:110px;color:#FF2E88;text-shadow:0 0 30px #FF2E88"><span class="iw">IT WAS YOU 😭</span></div>
  <div class="sticker cy" style="left:1340px;top:120px">git blame, git shame</div>${DRAMA}`,
 (q,t)=>{fly3d(t,q('.gb'),{rotationX:40});type(t+.1,q('.tt')[0],'$ git blame checkout.ts',.5);type(W('pain','says'),q('.out')[0],'a1f3c9e (Dana, 2 years ago) // TODO: fix later',.6);slam(W('pain','Dana'),q('.iw'));reactions(W('pain','Dana'),1.3,'😂🤣💀😭🫠');sticker(W('pain','git',2),q('.sticker')[0],5)},{rain:true,nojump:true});

/* ============ 03 PLOT TWIST — GitHub's scale (Octoverse 2025) ============ */
SHOT('turn', L('turn')-.05, W('turn','hundred'), 'black', `
  <div class="c" style="top:190px;font-size:260px"><span class="clap" style="display:inline-block;transform-origin:10% 90%">🎬</span></div>
  <div class="c disp" style="top:520px;font-size:100px">GitHub has seen<br><span class="grad">this movie before.</span></div>`,
 (q,t)=>{tl.fromTo(q('.clap'),{rotation:-25},{rotation:0,duration:.25,ease:'power4.in',immediateRender:false},W('turn','GitHub')-.1);cue(W('turn','GitHub')+.15,'click');up(W('turn','seen'),q('.c.disp'))});

const GLOBE=(()=>{let h='';for(let la=-80;la<=80;la+=10)for(let lo=0;lo<360;lo+=9){h+=`<div class="gd" data-la="${la}" data-lo="${lo}" style="position:absolute;width:12px;height:12px;border-radius:50%;background:${NEON[(la/10+lo/9+20)%5|0]}"></div>`}return h})();
const STATS=[['developers','fortythree',0],['',0,0]];
const SRC_OCT=FACT('source: GitHub Octoverse 2025 (Oct 28, 2025)');
SHOT('turn', W('turn','hundred'), W('turn','Six'), 'neon', `<div class="globe" style="position:absolute;left:560px;top:560px">${GLOBE}</div>
  <div style="position:absolute;left:1020px;top:300px"><div class="disp" style="font-size:210px;color:#A3E635;text-shadow:0 0 40px #A3E635"><span class="n0">0</span>M+</div><div class="kicker" style="font-size:34px">developers on GitHub</div></div>
  <div class="sticker cy" style="left:1100px;top:720px">1+ new dev every second 👶</div>${SRC_OCT}`,
 (q,t,t1)=>{const ds=[...q('.gd')];const o={r:0};tl.fromTo(o,{r:0},{r:1,duration:t1-t,ease:'none',immediateRender:false,onUpdate:()=>{ds.forEach(d=>{const la=d.dataset.la*Math.PI/180,lo=(+d.dataset.lo+o.r*120)*Math.PI/180;const x=Math.cos(la)*Math.sin(lo)*380,y=Math.sin(la)*380,z=Math.cos(la)*Math.cos(lo);d.style.transform=`translate(${x}px,${y}px) scale(${.5+z*.7})`;d.style.opacity=z>0?1:.12})}},t);
  count(t,q('.n0')[0],0,180,.8);cue(t,'slam');sticker(W('turn','developers'),q('.sticker')[0],-4)},{nojump:true});
const REPOW=(()=>{let h='';for(let i=0;i<96;i++)h+=`<div class="rw" style="position:absolute;left:${(i%16)*116+30}px;top:${Math.floor(i/16)*150+120}px;width:100px;height:130px;border-radius:12px;background:rgba(20,16,36,.9);border:2px solid ${NEON[i%5]};box-shadow:0 0 16px ${NEON[i%5]}"><div style="margin:14px;height:10px;border-radius:5px;background:${NEON[(i+2)%5]}"></div><div style="margin:0 14px;height:8px;width:50%;border-radius:4px;background:rgba(255,255,255,.4)"></div></div>`;return h})();
SHOT('turn', W('turn','Six'), W('turn','Forty'), 'black', `<div class="scene"><div class="rig wall" style="left:0;top:0;width:1920px;height:1080px">${REPOW}</div></div>
  <div class="c" style="top:330px;z-index:5"><div class="disp" style="font-size:250px;color:#22D3EE;text-shadow:0 0 50px #22D3EE,0 8px 0 #000"><span class="n1">0</span>M</div><div class="kicker" style="font-size:36px;text-shadow:0 2px 8px #000">repositories</div></div>${SRC_OCT}`,
 (q,t,t1)=>{tl.fromTo(q('.rw'),{z:-1600,opacity:0},{z:0,opacity:.55,duration:.5,stagger:{each:.006,from:'center'},ease:'expo.out',immediateRender:false},t);tl.fromTo(q('.wall'),{rotationX:0},{rotationX:18,duration:t1-t,ease:'sine.inOut',immediateRender:false},t);count(t,q('.n1')[0],0,630,.8);cue(t,'slam')},{nojump:true});
SHOT('turn', W('turn','Forty'), BREAK0, 'neon', `${Array.from({length:40},(_,i)=>`<div class="mg" style="position:absolute;left:${40+(i*47)%1840}px;top:-120px;color:#A855F7;opacity:.9">${ICON['git-merge'].replace('<svg','<svg style="width:70px;height:70px;fill:#A855F7;filter:drop-shadow(0 0 12px #A855F7)"')}</div>`).join('')}
  <div class="c" style="top:300px;z-index:5"><div class="disp" style="font-size:250px;color:#FF2E88;text-shadow:0 0 50px #FF2E88,0 8px 0 #000"><span class="n2">0</span>M</div><div class="kicker" style="font-size:36px">pull requests merged · every month</div></div>
  <div class="sticker li" style="left:1000px;top:740px">they've seen EVERY merge conflict 🫡</div>${FACT('source: GitHub Octoverse 2025 — 43.2M PRs merged per month on average (2025)')}`,
 (q,t,t1)=>{q('.mg').forEach((m,i)=>tl.fromTo(m,{y:0,rotation:0},{y:1300,rotation:(i%2?1:-1)*180,duration:1.2+(i%5)*.25,ease:'none',repeat:3,immediateRender:false},t+(i%10)*.08));count(t,q('.n2')[0],0,43.2,.8,x=>x.toFixed(1));cue(t,'slam');sticker(W('turn','month'),q('.sticker')[0],-5)},{nojump:true});

/* ============ 04 REVEAL ============ */
const TUN=(()=>{let h='';for(let i=0;i<120;i++){const a=rnd()*Math.PI*2,r=150+rnd()*900;h+=`<div class="sq tn" style="left:${960+Math.cos(a)*r-55}px;top:${540+Math.sin(a)*r-55}px;width:110px;height:110px;background:${['#0e4429','#006d32','#26a641','#39d353','#A3E635'][i%5]};box-shadow:0 0 20px #39d353"></div>`}return h})();
SHOT('reveal', BREAK1, W('reveal','GitHub'), 'black', `<div class="scene">${TUN}</div><div class="c disp" style="top:440px;font-size:120px;z-index:5"><span class="mask"><span class="m1">so they built…</span></span></div>`,
 (q,t,t1)=>{tl.fromTo(q('.tn'),{z:-3000,opacity:0},{z:1600,opacity:1,duration:t1-t+.1,ease:'power2.in',stagger:.004,immediateRender:false},t);cue(t,'riser',{d:DROP-t});up(W('reveal','So'),q('.m1'))},{nojump:true});

const MYWORK_UI=(big=false)=>`${SIDE('My Work')}<div class="main"><div style="display:flex;gap:16px;height:100%">${[['Sessions','#A855F7',['fix: checkout 500','chore: deps','docs: release']],['Issues','#A3E635',['#41 Safari bug','#57 flaky e2e','#60 dark mode']],['Pull requests','#22D3EE',['#88 quick fix','#43 Bump deps','#39 Refactor']],['Automations','#FBBF24',['triage · nightly','notes · Fri','deps · weekly']]].map((c,i)=>`<div class="col col${i}" style="flex:1;border-radius:14px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);padding:12px"><div style="font-weight:800;font-size:${big?26:22}px;color:${c[1]};margin:6px 4px 12px">${c[0]}</div>${c[2].map((x,j)=>`<div class="ncard it${i}" style="margin-bottom:12px">${x}<div style="margin-top:10px;height:7px;border-radius:4px;background:${c[1]};width:${40+j*22}%;box-shadow:0 0 10px ${c[1]}"></div></div>`).join('')}</div>`).join('')}</div></div>`;
SHOT('reveal', DROP, L('mywork')-.05, 'neon', `
  <div class="scene"><div class="rig rv" style="left:460px;top:330px">${MAC('GitHub Copilot app',MYWORK_UI(),1000,520)}</div></div>
  <div class="c lg" style="top:80px"><span style="display:inline-block;width:130px;height:130px">${ICON['mark-github'].replace('<svg','<svg style="width:130px;height:130px;fill:#fff;filter:drop-shadow(0 0 30px #A855F7)"')}</span></div>
  <div class="c disp t1" style="top:220px;font-size:86px;z-index:5;text-shadow:0 6px 30px #000">GitHub Copilot app</div>
  <div class="sticker li" style="left:1240px;top:800px;z-index:6">a home for your agents 🏠</div>`,
 (q,t,t1)=>{flash(t,'#fff',1);cue(t,'boom');burst(t,960,560,70,NEON,900,[10,28]);fly3d(t-.05,q('.rv'),{rotationY:-70,rotationX:30,z:-2600},.9);
  tl.fromTo(q('.rv'),{rotationY:0},{rotationY:-12,rotationX:6,duration:t1-t,ease:'sine.inOut',immediateRender:false},t+.9);slam(t+.1,q('.t1'));pop(t,q('.lg'));sticker(W('reveal','home'),q('.sticker')[0],-5)},{nojump:true});

/* ============ 05 MY WORK — 400 tabs → 1 window ============ */
SHOT('mywork', L('mywork')-.05, W('mywork','across'), 'neon', `
  <div class="scene"><div class="rig mw" style="left:260px;top:120px">${MAC('GitHub Copilot app — My Work',MYWORK_UI(true),1400,720)}</div></div>${ILLUS}`,
 (q,t,t1)=>{tl.fromTo(q('.mw'),{rotationY:22,rotationX:10},{rotationY:-8,rotationX:4,duration:t1-t,ease:'sine.inOut',immediateRender:false},t);
  [W('mywork','Sessions'),W('mywork','issues'),W('mywork','pull'),W('mywork','automations')].forEach((x,i)=>{pop(x,q('.col'+i),0,true);tl.fromTo(q('.it'+i),{scale:0},{scale:1,duration:.35,ease:'back.out(2.4)',stagger:.07,immediateRender:false},x+.08)})},{nojump:true});

SHOT('mywork', W('mywork','across'), L('worktree')-.05, 'matrix', `
  ${Array.from({length:40},(_,i)=>`<div class="tb2" style="position:absolute;left:${(i%8)*235+20}px;top:${Math.floor(i/8)*170+90}px;width:210px;height:56px;border-radius:12px;background:rgba(20,16,36,.92);border:2px solid ${NEON[i%5]};font:700 19px 'Monaspace Neon';padding:16px 12px;white-space:nowrap">◉ ${TABN[i%14]}</div>`).join('')}
  <div class="scene"><div class="rig one" style="left:660px;top:330px">${MAC('GitHub Copilot app','<div style="font:900 70px Mona Sans;text-align:center;margin-top:110px">1 window ✨</div>',600,380,'border-color:#A3E635;box-shadow:0 0 90px #A3E635')}</div></div>
  <div class="c disp" style="top:120px;font-size:110px;z-index:5;text-shadow:0 6px 30px #000"><span class="fh">400 tabs → 1 window</span></div>`,
 (q,t,t1)=>{const tt=W('mywork','One',2);tl.fromTo(q('.tb2'),{x:0,y:0,scale:1,opacity:1},{x:(i,e)=>960-(parseFloat(e.style.left)+105),y:(i,e)=>520-(parseFloat(e.style.top)+28),scale:0,opacity:0,duration:.5,ease:'power3.in',stagger:.008,immediateRender:false},tt-.5);
  pop(tt,q('.one'));cue(tt,'slam');burst(tt,960,520,40);slam(W('mywork','Dana'),q('.fh'))},{rain:true,nojump:true});

/* ============ 06 WORKTREES ============ */
const LANES=[[180,'#A855F7','agent-1 · fix/checkout'],[330,'#22D3EE','agent-2 · chore/deps'],[480,'#A3E635','agent-3 · fix/e2e'],[630,'#FBBF24','agent-4 · docs/release'],[780,'#FF2E88','agent-5 · perf/cache']];
SHOT('worktree', L('worktree')-.05, W('worktree','Zero'), 'black', `
  <svg class="hand" style="left:0;top:0;z-index:1" width="1920" height="1080"><path class="m" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#fff" stroke-opacity=".6" d="M60,480 L1860,480"/>
  ${LANES.map(([y,c],i)=>`<path class="b" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="${c}" style="filter:drop-shadow(0 0 10px ${c})" d="M${200+i*90},480 C${420+i*90},480 ${420+i*90},${y} ${640+i*90},${y} L1860,${y}"/>`).join('')}</svg>
  ${LANES.map(([y,c,n],i)=>`<div class="orb lo" style="left:${640+i*90}px;top:${y}px;background:${c};box-shadow:0 0 40px 12px ${c};z-index:3"></div><div class="chip ln" style="position:absolute;left:1230px;top:${y-62}px;font-size:22px;color:${c};z-index:4">${n}</div>`).join('')}
  <div class="disp" style="position:absolute;left:80px;top:70px;font-size:84px;z-index:5"><span class="n5">1 agent = 1 worktree</span></div>`,
 (q,t,t1)=>{draw(t,q('.m'),.3);draw(W('worktree','Five'),q('.b'),.6);q('.lo').forEach((o,i)=>tl.fromTo(o,{x:0,scale:0},{x:900-i*60,scale:1,duration:t1-t-.8,ease:'power1.inOut',immediateRender:false},W('worktree','Five')+.2));pop(W('worktree','lanes'),q('.ln'),.06);slam(W('worktree','git'),q('.n5'))},{nojump:true});

SHOT('worktree', W('worktree','Zero'), L('merge')-.05, 'lime', `
  <div class="c disp" style="top:170px;font-size:130px">ZERO</div>
  <div class="c disp" style="top:360px;font-size:110px"><span class="wq">"who touched my branch?"</span></div>
  <svg class="hand" style="left:210px;top:410px" width="1500" height="120"><path class="x" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#FF2E88" stroke-width="16" d="M10,60 C400,40 1000,80 1490,50"/></svg>
  <div class="sticker" style="left:1180px;top:640px">works on my branch™</div>`,
 (q,t)=>{slam(t,q('.c.disp')[0]);fade(W('worktree','who'),q('.wq'),.15);draw(W('worktree','branch'),q('.x'),.3);sticker(W('worktree','branch')+.2,q('.sticker')[0],5);reactions(W('worktree','branch'),1,'😂🔥💜')});

/* ============ 07 AGENT MERGE — the 347-comment PR ============ */
SHOT('merge', L('merge')-.05, W('merge','agent'), 'neon', `
  <div class="scene"><div class="rig is" style="left:360px;top:280px"><div class="card" style="position:relative;width:1200px;border-color:#A3E635;box-shadow:0 0 60px rgba(163,230,53,.4)">
   <div style="display:flex;gap:16px;align-items:center"><span style="color:#A3E635">${I('issue-opened')}</span><span class="chip" style="font-size:22px;color:#A3E635;padding:4px 14px">Open</span><span class="mono" style="font-size:24px;opacity:.6">#41</span></div>
   <div style="font-size:62px;font-weight:900;margin-top:18px">Checkout button 500s on Safari</div>
   <div style="margin-top:22px;display:flex;gap:12px"><span class="lab" style="color:#FF4D4D">bug</span><span class="lab" style="color:#FBBF24">p1</span><span class="lab" style="color:#A855F7">assign: Copilot</span></div></div></div></div>
  <div class="cursor cu">${CURSOR}</div><div style="position:absolute;left:1500px;top:180px;font-size:120px" class="dn">🧑‍💻</div>`,
 (q,t)=>{fly3d(t,q('.is'),{rotationX:-50,z:-1400});tl.fromTo(q('.cu'),{left:1600,top:950},{left:1300,top:640,duration:.5,ease:'power3.inOut',immediateRender:false},t+.3);cue(W('merge','issue'),'click');pop(t,q('.dn'))});

SHOT('merge', W('merge','agent'), W('merge','Then'), 'matrix', `
  <div class="scene"><div class="rig dv" style="left:260px;top:140px">${MAC('session · fix/checkout-safari · worktree',`<div class="term" style="font-size:30px">${['<span style="opacity:.5">@@ checkout.ts @@</span>','<span style="color:#FF4D4D">- const res = fetch(url, {keepalive: true})</span>','<span style="color:#A3E635">+ const res = await fetch(url, {</span>','<span style="color:#A3E635">+   method: "POST", credentials: "include" })</span>','<span style="color:#A3E635">+ if (!res.ok) throw new CheckoutError(res)</span>','<span style="color:#22D3EE">  ✓ 18 tests passed locally</span>'].map(l=>`<div class="dl">${l}</div>`).join('')}</div>`,1400,560)}</div></div>
  <div class="toast tt">${I('copilot')} Copilot opened PR #42</div>`,
 (q,t)=>{fly3d(t,q('.dv'),{rotationY:40,z:-900},.5);slideX(t+.15,q('.dl'),-80,.1);cue(t,'keys',{d:.7});toast(W('merge','opens'),q('.tt')[0])},{rain:true});

const CHECKS=['ci / unit-tests','ci / e2e (safari)','lint','Required review · 1 of 1'];
const checksHTML=`<div class="scene"><div class="rig ck" style="left:310px;top:120px"><div class="mac" style="position:relative;width:1300px"><div class="mbar">${TL3.map(c=>`<i style="background:${c}"></i>`).join('')}<span>PR #42 · checks & reviews</span></div>
  ${CHECKS.map((c,i)=>`<div class="row" style="position:relative"><span class="xx" style="position:relative;color:#FF4D4D">${I('x-circle-fill')}</span><span class="vv" style="position:absolute;left:26px;color:#A3E635">${I('check-circle-fill')}</span><span style="flex:1">${c}</span></div>`).join('')}</div></div></div>`;
SHOT('merge', W('merge','Then'), W('merge','fixes'), 'purple', `
  <div class="c disp ext" style="top:250px;font-size:185px;white-space:nowrap"><span class="am">AGENT MERGE</span></div>
  <div class="c serif" style="top:560px;font-size:90px">the CI babysitter you deserve 🍼</div>`,
 (q,t)=>{slam(W('merge','Agent',2),q('.am'));burst(W('merge','Agent',2),960,380,50);flash(W('merge','Agent',2),'#fff',.5);fade(W('merge','babysits'),q('.serif'))});

SHOT('merge', W('merge','fixes'), W('merge','merges'), 'black', checksHTML+`<div class="toast t2" style="top:700px;right:360px">✅ All checks have passed</div>`,
 (q,t,t1)=>{const xx=q('.xx'),vv=q('.vv'),rows=q('.row');tl.set(vv,{opacity:0},t);tl.set(rows,{backgroundColor:'rgba(255,77,77,.14)'},t);cue(t,'buzz_s');const step=(t1-t-.45)/4;
  [0,1,2,3].forEach(i=>{const ti=t+.15+i*step;tl.fromTo(xx[i],{opacity:1},{opacity:0,duration:.06,immediateRender:false},ti);tl.fromTo(vv[i],{scale:0,opacity:0},{scale:1,opacity:1,duration:.3,ease:'back.out(3)',immediateRender:false},ti);tl.fromTo(rows[i],{backgroundColor:'rgba(255,77,77,.14)'},{backgroundColor:'rgba(163,230,53,.22)',duration:.2,immediateRender:false},ti);cue(ti,'ding',{n:i});burst(ti,360,250+i*96,10,['#A3E635','#fff'],160,[6,12])});
  toast(t1-.4,q('.t2')[0])},{nojump:true});

SHOT('merge', W('merge','merges'), W('merge','That'), 'neon', `
  <div class="card" style="left:360px;top:250px;width:1200px;height:360px">
   <div style="font-size:48px;font-weight:900">Fix checkout on Safari #42</div>
   <div style="font-size:30px;margin-top:14px;color:#A3E635">✓ All checks have passed · ✓ Approved · ✓ rules met</div>
   <div class="mb" style="position:absolute;left:26px;bottom:30px;background:#238636;font-size:36px;font-weight:800;padding:18px 34px;border-radius:14px">Merge pull request</div></div>
  <div class="stamp st" style="left:560px;top:380px">${ICON['git-merge']} MERGED</div>`,
 (q,t,t1,el)=>{tl.fromTo(q('.st'),{scale:3,opacity:0},{scale:1,opacity:1,duration:.2,ease:'power4.in',immediateRender:false},t+.25);cue(t+.43,'stamp');shake(t+.45,el.querySelector('.punch'),22);confetti(t+.45,110);flash(t+.45,'#FF2E88',.35)},{nojump:true});

SHOT('merge', W('merge','That'), L('power')-.05, 'lime', `
  <div class="card" style="left:260px;top:170px;width:820px;background:#07030F;color:#fff;border-color:#07030F"><div style="font:900 64px 'Mona Sans'">"quick fix" #88</div><div style="font:800 40px 'Mona Sans';margin-top:10px">💬 347 comments</div><div class="mst" style="margin-top:20px"><span class="chip" style="color:#A855F7;font-size:34px">${I('git-merge')} Merged</span></div></div>
  <div style="position:absolute;left:1200px;top:160px;width:420px;height:420px;border-radius:50%;background:#fff;border:14px solid #07030F">
   <div class="hh" style="position:absolute;left:200px;top:90px;width:14px;height:120px;background:#07030F;transform-origin:50% 100%;border-radius:7px"></div>
   <div class="mh" style="position:absolute;left:203px;top:40px;width:8px;height:170px;background:#FF2E88;transform-origin:50% 100%;border-radius:4px"></div></div>
  <div class="c disp" style="top:680px;font-size:120px"><span class="ml">merged before lunch 🥪</span></div>`,
 (q,t,t1)=>{tl.fromTo(q('.mh'),{rotation:0},{rotation:1060,duration:t1-t,ease:'power2.out',immediateRender:false},t);tl.fromTo(q('.hh'),{rotation:60},{rotation:-6,duration:t1-t,ease:'power2.out',immediateRender:false},t);pop(W('merge','Merged'),q('.mst'));slam(W('merge','lunch'),q('.ml'));reactions(W('merge','lunch'),1.2,'🥪🔥😎💜')},{nojump:true});

/* ============ 08 POWER MOVES — montage ============ */
const MOD=['Model A','Model B','Auto ✦','Model C','BYOK 🔑','Model D'];
SHOT('power', L('power')-.05, W('power','Plan'), 'neon', `
  <div class="scene"><div class="rig car" style="left:960px;top:500px">${MOD.map((m,i)=>`<div class="card" style="left:-190px;top:-120px;width:380px;height:240px;transform:rotateY(${i*60}deg) translateZ(560px);display:flex;flex-direction:column;justify-content:center;align-items:center;border:2px solid ${NEON[i%5]};box-shadow:0 0 40px ${NEON[i%5]};backface-visibility:hidden"><div style="font:900 50px 'Mona Sans'">${m}</div></div>`).join('')}</div></div>
  <div class="c disp" style="top:100px;font-size:84px">pick your model <span class="serif" style="font-weight:400">or</span> <span class="grad au">let Auto decide</span></div>${FACT('model names are placeholders · per GitHub Docs: model + effort pickers, Auto, BYOK')}`,
 (q,t,t1)=>{tl.fromTo(q('.car'),{rotationY:0,rotationX:-8},{rotationY:-240,rotationX:-8,duration:t1-t,ease:'power2.inOut',immediateRender:false},t);slam(t,q('.c.disp'));cue(t,'whoosh')},{nojump:true});

SHOT('power', W('power','Plan'), W('power','Run'), 'matrix', `
  <div class="card" style="left:460px;top:250px;width:1000px;height:320px;font-size:44px;line-height:1.6;border-color:#A855F7;box-shadow:0 0 60px #A855F7"><div class="kicker" style="font-size:20px;color:#22D3EE">canvas · plan.md</div><div>☑ patch fetch()</div><div><span class="e1"></span></div><div style="color:#A855F7"><span class="e2"></span></div></div>
  <div class="chip" style="position:absolute;left:1490px;top:380px;color:#A3E635;font-size:22px">✎ Dana</div><div class="chip" style="position:absolute;left:1490px;top:450px;color:#A855F7;font-size:22px">✎ agent</div>
  <div class="c disp" style="top:110px;font-size:90px">plan <span class="grad">together</span></div>`,
 (q,t)=>{type(t+.05,q('.e1')[0],'☐ also test Firefox pls',.5);type(t+.6,q('.e2')[0],'☑ added firefox to e2e',.5);slam(t,q('.c.disp'))},{rain:true});

const CUBE=(x,label,emo,col)=>`<div class="rig cb" style="left:${x}px;top:360px;width:300px;height:300px">${['rotateY(0deg)','rotateY(90deg)','rotateY(180deg)','rotateY(-90deg)','rotateX(90deg)','rotateX(-90deg)'].map(r=>`<div style="position:absolute;width:300px;height:300px;transform:${r} translateZ(150px);border:3px solid ${col};background:${col}22;box-shadow:inset 0 0 40px ${col}"></div>`).join('')}<div style="position:absolute;left:0;top:70px;width:300px;text-align:center;font-size:130px">${emo}</div></div><div class="disp" style="position:absolute;left:${x-50}px;top:740px;width:400px;text-align:center;font-size:60px;color:${col}">${label}</div>`;
SHOT('power', W('power','Run'), W('power','until'), 'neon', `<div class="scene" style="perspective:1400px">${CUBE(400,'LOCAL','💻','#22D3EE')}${CUBE(1220,'CLOUD','☁️','#A855F7')}</div>
  <div class="c disp" style="top:110px;font-size:90px">sandboxed. <span class="serif" style="font-weight:400">asks first.</span></div>
  <div class="sticker am" style="left:760px;top:560px">Allow write? ✅ / ❌</div>`,
 (q,t,t1)=>{tl.fromTo(q('.cb'),{rotationY:0,rotationX:-18},{rotationY:160,rotationX:-18,duration:t1-t,ease:'power1.inOut',immediateRender:false},t);pop(t,q('.cb'));slam(t,q('.c.disp'));sticker(W('power','asks'),q('.sticker')[0],-3)},{nojump:true});

const SPEED=(()=>{let h='';for(let i=0;i<60;i++){const a=rnd()*Math.PI*2;h+=`<div class="spd" style="position:absolute;left:960px;top:540px;width:${300+rnd()*500}px;height:4px;background:linear-gradient(90deg,transparent,${NEON[i%5]});transform-origin:0 50%;transform:rotate(${a}rad) translateX(${200+rnd()*300}px)"></div>`}return h})();
SHOT('power', W('power','until'), L('honest')-.05, 'black', `${SPEED}
  <div class="tg" style="position:absolute;left:720px;top:300px;width:480px;height:240px;border-radius:120px;background:#333"><div class="kn" style="position:absolute;left:20px;top:20px;width:200px;height:200px;border-radius:50%;background:#fff"></div></div>
  <div class="c disp grad ap" style="top:620px;font-size:170px">AUTOPILOT</div>
  <div class="c kicker" style="top:180px">when you trust it</div>`,
 (q,t)=>{const tt=W('power','autopilot');tl.fromTo(q('.kn'),{x:0},{x:240,duration:.3,ease:'back.out(2)',immediateRender:false},tt);tl.fromTo(q('.tg'),{backgroundColor:'#333'},{backgroundColor:'#A3E635',duration:.2,immediateRender:false},tt);cue(tt,'click');slam(tt,q('.ap'));
  tl.fromTo(q('.spd'),{opacity:0,scaleX:.2},{opacity:1,scaleX:1.4,duration:.5,ease:'expo.out',immediateRender:false},tt);cue(tt,'whoosh')});

/* ============ 09 HONEST CATCH ============ */
const gauge=`<svg style="position:absolute;left:560px;top:90px" width="800" height="520" viewBox="-400 -420 800 520">
  <path class="gauge-arc" stroke="rgba(255,255,255,.15)" d="M-320,0 A320,320 0 0,1 320,0"/>
  <path class="gauge-arc gf" pathLength="1" stroke-dasharray="1" stroke="url(#gg)" d="M-320,0 A320,320 0 0,1 320,0"/>
  <defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#A3E635"/><stop offset=".6" stop-color="#FBBF24"/><stop offset="1" stop-color="#FF2E88"/></linearGradient></defs>
  <g class="cap"><line x1="0" y1="-260" x2="0" y2="-390" stroke="#FF4D4D" stroke-width="16" transform="rotate(50)"/><text x="0" y="-400" transform="rotate(50)" text-anchor="middle" font-family="Monaspace Neon" font-weight="700" font-size="34" fill="#FF4D4D">CAP</text></g>
  <g class="ndl"><line x1="0" y1="0" x2="0" y2="-290" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle r="26" fill="#fff"/></g></svg>`;
SHOT('honest', L('honest')-.05, W('honest','Every'), 'hot', `
  <div class="c disp" style="top:220px;font-size:210px"><span class="ct">THE CATCH?</span></div>
  <div class="c disp" style="top:500px;font-size:90px"><span class="mask"><span class="c2">metered in AI credits</span></span></div>
  <div class="c mono" style="top:650px;font-size:30px">token-based · 1 credit = $0.01 · since June 1, 2026</div>`,
 (q,t)=>{slam(W('honest','catch'),q('.ct'));up(W('honest','metered'),q('.c2'))});
SHOT('honest', W('honest','Every'), L('next')-.05, 'black', gauge+`
  <div class="c disp" style="top:560px;font-size:100px">monthly credits <span class="serif" style="font-weight:400">+</span> <span class="grad">hard cap</span></div>
  <div class="c disp" style="top:700px;font-size:90px"><span class="bb">bill: boring 😴</span></div>
  ${FACT('Pro $10 · Pro+ $39 · Business $19/user · Enterprise $39/user in monthly credits · budgets at user / cost-center / enterprise level')}`,
 (q,t)=>{tl.fromTo(q('.gf'),{strokeDashoffset:1},{strokeDashoffset:.22,duration:.9,ease:'power2.out',immediateRender:false},t);tl.fromTo(q('.ndl'),{rotation:-90,svgOrigin:'0 0'},{rotation:50,duration:.9,ease:'power2.out',immediateRender:false},t);
  tl.fromTo(q('.cap'),{scale:3,opacity:0,svgOrigin:'0 0'},{scale:1,opacity:1,duration:.25,ease:'power4.in',immediateRender:false},W('honest','hard'));cue(W('honest','hard')+.25,'snap');slam(t,q('.c.disp')[0]);slam(W('honest','boring'),q('.bb'))},{nojump:true});

/* ============ 10 SHIPPING NEXT — velocity + feedback + GitHub Next ============ */
const FEAT=['Canvases','Voice','Cloud sessions','Cloud automations','CLI sync','Agentic browsing','Rubber duck','/chronicle'];
SHOT('next', L('next')-.05, W('next','Nineteen'), 'neon', `<div class="c disp ext" style="top:300px;font-size:190px"><span class="k">GitHub doesn't<br>sit still.</span></div>`,
 (q,t)=>{slam(t+.1,q('.k'));burst(t+.1,960,460,30)});

SHOT('next', W('next','Nineteen'), W('next','Meanwhile'), 'black', `
  <svg class="hand" style="left:0;top:0" width="1920" height="1080"><path class="tln" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#fff" stroke-width="6" d="M200,300 L1720,300"/></svg>
  <div class="chip d1" style="position:absolute;left:120px;top:210px;color:#22D3EE;font-size:28px">May 14 · launch</div>
  <div class="chip d2" style="position:absolute;left:1500px;top:210px;color:#A3E635;font-size:28px">Jun 2 · +8</div>
  <div class="disp" style="position:absolute;left:760px;top:110px;font-size:70px"><span class="n">0</span> days</div>
  <div style="position:absolute;left:140px;right:140px;top:400px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center">${FEAT.map((f,i)=>`<span class="chip ft" style="font-size:38px;padding:14px 30px;color:${NEON[i%5]};box-shadow:0 0 30px ${NEON[i%5]}">${f}</span>`).join('')}</div>
  <div class="card fb" style="left:560px;top:690px;width:800px;border-color:#22D3EE"><div style="font:800 34px 'Mona Sans'">💬 Join the discussion</div><div class="mono" style="font-size:20px;opacity:.8;margin-top:6px">GitHub Community · feedback thread per release</div></div>
  ${FACT('source: GitHub Changelog, May 14 & Jun 2, 2026')}`,
 (q,t,t1)=>{draw(t,q('.tln'),.6);pop(t,q('.d1'));count(t,q('.n')[0],0,19,.6);pop(t+.55,q('.d2'));const s=W('next','eight');tl.fromTo(q('.ft'),{scale:0,opacity:0},{scale:1,opacity:1,duration:.3,stagger:.12,ease:'back.out(2.6)',immediateRender:false},s);for(let i=0;i<8;i++)cue(s+i*.12,'pop');
  pop(W('next','feedback'),q('.fb'));reactions(W('next','feedback'),1.5,'💜👍🎉💬🚀')},{nojump:true});

const PROTO=[['Chopin','real-time multiplayer agentic planning','Sep 2026','#A855F7'],['Autoloop','goal-driven research & dev loop','Apr 2026','#22D3EE'],['Agentic Workflows','natural-language GitHub Actions','Aug 2025','#A3E635']];
SHOT('next', W('next','Meanwhile'), L('end')-.05, 'matrix', `
  <div class="c disp" style="top:90px;font-size:96px">🧪 GitHub <span class="grad">Next</span></div>
  <div class="c kicker" style="top:210px">"investigates the future of software development"</div>
  <div class="scene"><div class="rig" style="left:960px;top:560px">${PROTO.map((p,i)=>`<div class="card pt3" style="left:${-840+i*580}px;top:-170px;width:520px;height:320px;transform:rotateY(${(i-1)*-16}deg);border-color:${p[3]};box-shadow:0 0 50px ${p[3]}"><div class="kicker" style="color:${p[3]};font-size:20px">prototype · ${p[2]}</div><div style="font:900 56px 'Mona Sans';margin:18px 0">${p[0]}</div><div class="mono" style="font-size:22px;opacity:.85">${p[1]}</div></div>`).join('')}</div></div>
  ${FACT('source: githubnext.com (research prototypes, not shipped features)')}`,
 (q,t)=>{slam(W('next','Next'),q('.c.disp'));fly3d(W('next','prototyping'),q('.pt3'),{z:-1600,rotationY:0},.6);fade(W('next','Next'),q('.kicker'))},{rain:true,nojump:true});

/* ============ 11 END — 5:00 PM ============ */
SHOT('end', L('end')-.05, W('end','The'), 'black', ROOM(false)+`<div class="dana" style="position:absolute;left:560px;top:560px;font-size:260px;z-index:5">🧑‍💻</div>${STAMP('📍 DANA\'S APARTMENT · 5:00 PM')}
  <div class="walk" style="position:absolute;left:560px;top:560px;font-size:260px;z-index:6;opacity:0">🚶</div>
  <div class="sticker li" style="left:1200px;top:640px;z-index:7">like, ACTUALLY 5 🕔</div>${DRAMA}`,
 (q,t,t1)=>{fade(t,q('.punch > div'),.3);const w=W('end','logs');tl.fromTo(q('.dana'),{opacity:1},{opacity:0,duration:.1,immediateRender:false},w+.3);tl.fromTo(q('.walk'),{opacity:0,x:0},{opacity:1,x:1500,duration:t1-w-.3,ease:'power1.in',immediateRender:false},w+.3);
  tl.fromTo(q('.sun'),{y:0},{y:120,duration:t1-t,ease:'none',immediateRender:false},t);sticker(W('end','actually'),q('.sticker')[0],-5);reactions(W('end','actually'),1.4,'😂🎉🙌💜🌅')},{nojump:true});

const PLANS=[['Pro','#22D3EE'],['Pro+','#A855F7'],['Business','#A3E635'],['Enterprise','#FF2E88']];
SHOT('end', W('end','The'), W('end','One'), 'purple', `
  <div class="c" style="top:190px"><span class="chip lv" style="font-size:40px;color:#fff;border-color:#FF2E4D;background:#FF2E4D">● TECHNICAL PREVIEW · LIVE NOW</span></div>
  <div style="position:absolute;left:0;right:0;top:400px;display:flex;justify-content:center;gap:30px">${PLANS.map(p=>`<span class="chip pb" style="font-size:56px;padding:20px 40px;color:${p[1]};box-shadow:0 0 40px ${p[1]}">${p[0]}</span>`).join('')}</div>`,
 (q,t)=>{pop(W('end','technical'),q('.lv'));const w=[W('end','Pro'),W('end','Pro',2),W('end','Business'),W('end','Enterprise')];q('.pb').forEach((e,i)=>pop(w[i],[e]))});
SHOT('end', W('end','One'), W('end','Many'), 'neon', `<div class="c disp ext" style="top:340px;font-size:280px"><span class="k">ONE APP.</span></div>`, (q,t)=>{slam(t,q('.k'));burst(t,960,480,30)});
SHOT('end', W('end','Many'), W('end','Go'), 'hot', `<div class="c disp ext" style="top:340px;font-size:250px"><span class="k">MANY AGENTS.</span></div>`, (q,t)=>{slam(t,q('.k'));burst(t,960,480,30,['#fff','#22D3EE','#A3E635'])});
SHOT('end', W('end','Go'), LE('end')+.25, 'lime', `<div class="c disp ext" style="top:300px;font-size:210px;line-height:1"><span class="k">GO HOME<br>ON TIME.</span></div>`, (q,t)=>{slam(t,q('.k'));flash(t,'#fff',.8);cue(t,'boom');confetti(t,140)});
SHOT('end', LE('end')+.25, END, 'neon', `
  <div class="scene"><div class="rig ec" style="left:560px;top:110px">${MAC('GitHub Copilot app',MYWORK_UI(),800,450)}</div></div>
  <div class="c lg" style="top:590px"><span style="display:inline-block;width:90px;height:90px">${ICON['mark-github'].replace('<svg','<svg style="width:90px;height:90px;fill:#fff"')}</span></div>
  <div class="c disp" style="top:695px;font-size:70px;white-space:nowrap">ONE APP. MANY AGENTS. <span style="color:#A3E635">GO HOME ON TIME.</span></div>
  <div class="c" style="top:790px"><span class="chip" style="color:#FBBF24;font-size:26px">GitHub Copilot app · technical preview — check your plan</span></div>
  <div class="c disp e3" style="top:875px;font-size:48px;letter-spacing:.06em">BY YUVAL AVIDANI · <span class="grad">YUV.AI</span></div>`,
 (q,t,t1)=>{fly3d(t,q('.ec'),{rotationY:-40});tl.fromTo(q('.ec'),{rotationY:0},{rotationY:-10,rotationX:6,duration:t1-t,ease:'sine.inOut',immediateRender:false},t+.8);pop(t+.1,q('.lg'));slam(t+.2,q('.c.disp')[0]);pop(t+.5,q('.e3'))},{nojump:true});
