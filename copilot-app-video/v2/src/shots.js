// v2 "NEON" — every timing comes from spoken-word timestamps via W()/WE()/L()/LE().
const DROP = W('reveal','GitHub');
const BREAK0 = LE('proof')+.05, BREAK1 = L('demo');
const HIDECAP = t => t > LE('cta')+.25;
const FACT = (txt)=>`<div class="mono" style="position:absolute;left:60px;bottom:40px;font-size:18px;color:rgba(255,255,255,.85);background:rgba(0,0,0,.55);padding:6px 14px;border-radius:8px;z-index:61">${txt}</div>`;
const ILLUS = FACT('illustrative UI · not a real screenshot');

/* ============ 01 HOOK — pattern interrupt ============ */
SHOT('hook', 0, W('hook','Fourteen'), 'matrix', `
  <div class="c disp" style="top:300px;font-size:230px;line-height:.95">${glitch('STOP')}<br>${glitch('<span class="grad">SCROLLING.</span>')}</div>`,
 (q,t,t1)=>{slam(t+.02,q('.disp'));glitchAnim(t,t1-t,q,22);flash(t,'#fff',1);cue(t,'boom');burst(t+.05,960,520,40)},{rain:true});

const TABN=['PR #41','CI logs','Jira-ish','docs','StackOvf','Azure','staging','Slack','issue #9','dashb.','diff','prod??','reviews','tab 14'];
SHOT('hook', W('hook','Fourteen'), W('hook','Three'), 'neon', `
  <div class="scene"><div class="rig" style="left:960px;top:520px">
  ${TABN.map((n,i)=>{const a=i/14*Math.PI*2;return `<div class="tb" style="position:absolute;left:${Math.cos(a)*620-150}px;top:${Math.sin(a)*330-40}px;width:300px;height:80px;border-radius:14px;background:rgba(20,16,36,.9);border:2px solid ${NEON[i%5]};box-shadow:0 0 24px ${NEON[i%5]};font:700 24px 'Monaspace Neon';padding:24px 18px;white-space:nowrap">◉ ${n}</div>`}).join('')}</div></div>
  <div class="c disp" style="top:330px;font-size:360px"><span class="n grad">0</span></div>
  <div class="c serif" style="top:700px;font-size:90px">tabs</div>`,
 (q,t)=>{fly3d(t,q('.tb'),{z:-2400},.6);cue(t,'pop');count(t,q('.n')[0],0,14,.5)});

SHOT('hook', W('hook','Three'), W('hook','Two'), 'matrix', `
  <div class="scene"><div class="rig" style="left:360px;top:170px">
  ${[0,1,2].map(i=>`<div class="mac tm" style="left:${i*170}px;top:${i*140}px;width:1000px;height:330px"><div class="mbar">${TL3.map(c=>`<i style="background:${c}"></i>`).join('')}<span>zsh — ${['api','web','infra'][i]}</span></div><div class="term"><span class="tt"></span></div></div>`).join('')}</div></div>
  <div class="disp" style="position:absolute;right:120px;top:260px;font-size:300px;color:var(--cy)" >3</div>`,
 (q,t)=>{fly3d(t,q('.tm'),{rotationY:50,z:-1200},.55);const c=['$ git checkout feat/login','$ git stash && git pull','error: merge conflict 💥'];q('.tt').forEach((e,i)=>{if(i===2)e.style.color='#FF4D4D';type(t+.1+i*.1,e,c[i],.45)})},{rain:true});

SHOT('hook', W('hook','Two'), W('hook','fighting'), 'neon', `
  <div class="orb o1" style="left:300px;top:540px;background:var(--pu);box-shadow:0 0 60px 20px var(--pu)"></div>
  <div class="orb o2" style="left:1620px;top:540px;background:var(--cy);box-shadow:0 0 60px 20px var(--cy)"></div>
  <div class="c disp" style="top:220px;font-size:110px">agent-A <span class="serif" style="font-weight:400">vs</span> agent-B</div>
  <div class="c" style="top:640px"><span class="chip br" style="font-size:44px;color:#fff;border-color:var(--rd);box-shadow:0 0 30px var(--rd)">${I('git-branch')} main</span></div>`,
 (q,t,t1)=>{tl.fromTo(q('.o1'),{x:0},{x:560,duration:t1-t,ease:'power2.in',immediateRender:false},t);tl.fromTo(q('.o2'),{x:0},{x:-560,duration:t1-t,ease:'power2.in',immediateRender:false},t);slam(t+.1,q('.disp'));pop(t+.3,q('.br'));cue(t,'riser_s',{d:t1-t})});

SHOT('hook', W('hook','fighting'), L('promise')-.05, 'hot', `
  <div class="c disp" style="top:250px;font-size:210px;color:#fff">${glitch('MERGE')}<br>${glitch('CONFLICT')}</div>
  <div class="sticker" style="left:1080px;top:720px">merge conflict? never heard of her</div>`,
 (q,t,t1,el)=>{slam(t,q('.disp'));glitchAnim(t,t1-t,q,12);flash(t,'#fff',.9);burst(t,960,500,50,['#fff','#FFD1E8','#22D3EE']);cue(t,'buzz');shake(t,el.querySelector('.punch'),30,.5);sticker(t+.35,q('.sticker')[0],-5)});

/* ============ 02 PROMISE — open loop ============ */
SHOT('promise', L('promise')-.05, W('promise','show'), 'purple', `
  <svg style="position:absolute;left:660px;top:180px" width="600" height="600" viewBox="-300 -300 600 600"><circle r="250" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="26"/><circle class="ring" r="250" fill="none" stroke="#A3E635" stroke-width="26" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" transform="rotate(-90)"/></svg>
  <div class="c disp" style="top:360px;font-size:260px"><span class="n">90</span><span style="font-size:110px">s</span></div>`,
 (q,t,t1)=>{slam(t,q('.disp'));tl.fromTo(q('.ring'),{strokeDashoffset:0},{strokeDashoffset:.08,duration:t1-t,ease:'none',immediateRender:false},t);count(t,q('.n')[0],90,88,t1-t)});

SHOT('promise', W('promise','show'), W('promise','build'), 'neon', `
  <div class="scene"><div class="rig tz" style="left:360px;top:200px">${MAC('████████ app','<div class="main" style="left:0"></div>',1200,640,'filter:blur(14px)')}</div></div>
  <div class="c disp" style="top:380px;font-size:120px"><span class="mask"><span class="m1">the app that <span class="grad">ends this</span></span></span></div>
  <div class="sticker am" style="left:1300px;top:170px">🔒 reveal in 3…</div>`,
 (q,t)=>{fly3d(t,q('.tz'),{rotationY:30});up(W('promise','app'),q('.m1'));sticker(t+.3,q('.sticker')[0],6)});

SHOT('promise', W('promise','build'), L('reveal')-.8, 'black', `
  <div class="scene"><div class="rig bx" style="left:760px;top:250px;width:400px;height:400px">
   <div style="position:absolute;inset:0;border-radius:40px;background:linear-gradient(135deg,#22D3EE,#A855F7,#FF2E88);box-shadow:0 0 120px #A855F7;display:flex;align-items:center;justify-content:center;font-size:180px">📱</div></div></div>
  <div class="c disp" style="top:120px;font-size:84px">+ a build at the end</div>
  <div class="c serif" style="top:700px;font-size:90px">you'll want to <span class="grad" style="font-family:'Mona Sans';font-weight:900;font-style:normal">STEAL</span></div>
  <div class="sticker li" style="left:1320px;top:560px">don't skip 👀</div>`,
 (q,t,t1)=>{tl.fromTo(q('.bx'),{rotationY:-40,rotationX:20,scale:.4},{rotationY:320,rotationX:-10,scale:1,duration:t1-t+.2,ease:'power2.out',immediateRender:false},t);slam(t,q('.disp'));sticker(W('promise','steal'),q('.sticker')[0],-6)});

/* ============ 03 REVEAL — the drop ============ */
const TUN=(()=>{let h='';for(let i=0;i<120;i++){const a=rnd()*Math.PI*2,r=150+rnd()*900;h+=`<div class="sq tn" style="left:${960+Math.cos(a)*r-30}px;top:${540+Math.sin(a)*r-30}px;width:110px;height:110px;background:${['#0e4429','#006d32','#26a641','#39d353','#A3E635'][i%5]};box-shadow:0 0 20px #39d353"></div>`}return h})();
SHOT('reveal', L('reveal')-.8, W('reveal','This'), 'black', `<div class="scene">${TUN}</div>`,
 (q,t,t1)=>{tl.fromTo(q('.tn'),{z:-3000,opacity:0},{z:1600,opacity:1,duration:t1-t+.1,ease:'power2.in',stagger:.006,immediateRender:false},t);cue(t,'riser',{d:DROP-t})},{nojump:true});

SHOT('reveal', W('reveal','This'), DROP, 'black', `<div class="c disp" style="top:420px;font-size:150px"><span class="mask"><span class="m1">THIS IS…</span></span></div>`, (q,t)=>up(t,q('.m1')));

const MYWORK_UI=(big=false)=>`${SIDE('My Work')}<div class="main"><div style="display:flex;gap:16px;height:100%">${[['Sessions','#A855F7',['fix: checkout 500','chore: deps','docs: release']],['Issues','#A3E635',['#41 Safari bug','#57 flaky e2e','#60 dark mode']],['Pull requests','#22D3EE',['#42 Fix checkout','#43 Bump deps','#39 Refactor']],['Automations','#FBBF24',['triage · nightly','notes · Fri','deps · weekly']]].map((c,i)=>`<div class="col col${i}" style="flex:1;border-radius:14px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);padding:12px"><div style="font-weight:800;font-size:${big?26:22}px;color:${c[1]};margin:6px 4px 12px">${c[0]}</div>${c[2].map((x,j)=>`<div class="ncard it${i}" style="margin-bottom:12px">${x}<div style="margin-top:10px;height:7px;border-radius:4px;background:${c[1]};width:${40+j*22}%;box-shadow:0 0 10px ${c[1]}"></div></div>`).join('')}</div>`).join('')}</div></div>`;
SHOT('reveal', DROP, W('reveal','Your'), 'neon', `
  <div class="scene"><div class="rig rv" style="left:460px;top:330px">${MAC('GitHub Copilot app',MYWORK_UI(),1000,520)}</div></div>
  <div class="c lg" style="top:80px"><span style="display:inline-block;width:130px;height:130px">${ICON['mark-github'].replace('<svg','<svg style="width:130px;height:130px;fill:#fff;filter:drop-shadow(0 0 30px #A855F7)"')}</span></div>
  <div class="c disp t1" style="top:220px;font-size:86px;z-index:5;text-shadow:0 6px 30px #000">GitHub Copilot app</div>`,
 (q,t,t1)=>{flash(t,'#fff',1);cue(t,'boom');burst(t,960,560,70,NEON,900,[10,28]);fly3d(t-.05,q('.rv'),{rotationY:-70,rotationX:30,z:-2600},.9);
  tl.fromTo(q('.rv'),{rotationY:0},{rotationY:-14,rotationX:8,duration:t1-t,ease:'sine.inOut',immediateRender:false},t+.9);slam(t+.1,q('.t1'));pop(t,q('.lg'))},{nojump:true});

SHOT('reveal', W('reveal','Your'), L('mywork')-.05, 'purple', `
  <div class="c disp" style="top:250px;font-size:130px"><span class="mask"><span class="h1">your agents finally</span></span></div>
  <div class="c disp ext" style="top:430px;font-size:300px"><span class="h2">HOME.</span></div>`,
 (q,t)=>{up(t,q('.h1'));slam(W('reveal','home'),q('.h2'));burst(W('reveal','home'),960,600,40)});

/* ============ 04 MY WORK ============ */
SHOT('mywork', L('mywork')-.05, W('mywork','every'), 'neon', `
  <div class="c disp ext" style="top:300px;font-size:300px"><span class="mw">MY WORK</span></div>
  <div class="c kicker" style="top:680px">one view · every repo</div>`,
 (q,t)=>{slam(t+.05,q('.mw'));burst(t+.05,960,480,30)});

SHOT('mywork', W('mywork','every'), W('mywork','across'), 'neon', `
  <div class="scene"><div class="rig mw" style="left:260px;top:120px">${MAC('GitHub Copilot app — My Work',MYWORK_UI(true),1400,720)}</div></div>${ILLUS}`,
 (q,t,t1)=>{tl.fromTo(q('.mw'),{rotationY:22,rotationX:10},{rotationY:-10,rotationX:4,duration:t1-t,ease:'sine.inOut',immediateRender:false},t);
  const ts=[W('mywork','agent'),W('mywork','issue'),W('mywork','pull'),W('mywork','automation')];ts.forEach((x,i)=>{pop(x,q('.col'+i),0,true);tl.fromTo(q('.it'+i),{z:0,scale:0},{z:0,scale:1,duration:.35,ease:'back.out(2.4)',stagger:.07,immediateRender:false},x+.08)})},{nojump:true});

SHOT('mywork', W('mywork','across'), W('mywork','Mission'), 'matrix', `
  <div class="scene"><div class="rig" style="left:960px;top:500px">${['org/api','org/web','org/mobile','org/infra','org/docs','org/ml'].map((r,i)=>{const a=i/6*Math.PI*2;return `<div class="mac mn" style="left:${Math.cos(a)*560-170}px;top:${Math.sin(a)*300-90}px;width:340px;height:180px"><div class="mbar">${TL3.map(c=>`<i style="background:${c}"></i>`).join('')}<span>${r}</span></div><div style="padding:16px;display:flex;gap:8px">${[0,1,2,3,4].map(k=>`<div style="flex:1;height:${30+((i+k)*17)%60}px;border-radius:6px;background:${NEON[(i+k)%5]}"></div>`).join('')}</div></div>`}).join('')}
  <div class="mac hubm" style="left:-190px;top:-70px;width:380px;height:140px;border-color:#A3E635;box-shadow:0 0 80px #A3E635"><div style="font:900 44px 'Mona Sans';padding:44px;text-align:center">My Work</div></div></div></div>`,
 (q,t)=>{fly3d(t,q('.mn'),{z:-1600,rotationY:0,rotationX:0},.6);pop(t+.2,q('.hubm'))},{rain:true});

SHOT('mywork', W('mywork','Mission'), L('worktree')-.05, 'black', `
  <svg style="position:absolute;left:560px;top:110px" width="800" height="800" viewBox="-400 -400 800 800">
   ${[120,220,320].map(r=>`<circle r="${r}" fill="none" stroke="#22D3EE" stroke-opacity=".5" stroke-width="3"/>`).join('')}
   <g class="sweep"><path d="M0,0 L0,-360 A360,360 0 0,1 200,-300 Z" fill="rgba(34,211,238,.35)"/></g>
   ${[[140,-90,'agent-A','#A855F7'],[-200,60,'agent-B','#FF2E88'],[80,210,'agent-C','#A3E635'],[-120,-230,'agent-D','#FBBF24']].map(([x,y,n,c])=>`<g class="blip" transform="translate(${x},${y})"><circle r="16" fill="${c}"/><text x="24" y="8" font-family="Monaspace Neon" font-size="26" fill="#fff">${n}</text></g>`).join('')}
  </svg>
  <div class="disp" style="position:absolute;left:90px;top:180px;font-size:130px;line-height:.95;color:#22D3EE" class="glow"><span class="mask"><span class="mc">MISSION<br>CONTROL</span></span><span class="serif" style="font-size:80px;font-weight:400;color:#fff;display:block">for code</span></div>
  <div class="sticker am" style="right:140px;top:700px">your PM: 👀</div>`,
 (q,t,t1)=>{tl.fromTo(q('.sweep'),{rotation:0,svgOrigin:'0 0'},{rotation:720,duration:t1-t,ease:'none',immediateRender:false},t);pop(t+.15,q('.blip'),.1);up(t,q('.mc'));sticker(W('mywork','code'),q('.sticker')[0],5)});

/* ============ 05 WORKTREES ============ */
SHOT('worktree', L('worktree')-.05, W('worktree','Five'), 'matrix', `
  <div class="scene"><div class="rig tw" style="left:310px;top:320px">${MAC('Terminal','<div class="term" style="font-size:34px"><span class="tt"></span></div>',1300,300)}</div></div>
  <div class="c disp" style="top:140px;font-size:110px">1 session = <span class="grad">1 worktree</span></div>`,
 (q,t)=>{fly3d(t,q('.tw'),{rotationX:40});type(t+.2,q('.tt')[0],'$ git worktree add ../agent-a -b feat/checkout ✓',.9);slam(W('worktree','git'),q('.disp'))},{rain:true});

const LANES=[[180,'#A855F7','agent-1 · feat/checkout'],[330,'#22D3EE','agent-2 · chore/deps'],[480,'#A3E635','agent-3 · fix/e2e'],[630,'#FBBF24','agent-4 · docs/release'],[780,'#FF2E88','agent-5 · perf/cache']];
SHOT('worktree', W('worktree','Five'), W('worktree','Zero'), 'black', `
  <svg class="hand" style="left:0;top:0;z-index:1" width="1920" height="1080"><path class="m" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#fff" stroke-opacity=".6" d="M60,480 L1860,480"/>
  ${LANES.map(([y,c],i)=>`<path class="b b${i}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="${c}" style="filter:drop-shadow(0 0 10px ${c})" d="M${200+i*90},480 C${420+i*90},480 ${420+i*90},${y} ${640+i*90},${y} L1860,${y}"/>`).join('')}</svg>
  ${LANES.map(([y,c,n],i)=>`<div class="orb lo lo${i}" style="left:${640+i*90}px;top:${y}px;background:${c};box-shadow:0 0 40px 12px ${c};z-index:3"></div><div class="chip ln" style="position:absolute;left:1230px;top:${y-62}px;font-size:22px;color:${c};z-index:4">${n}</div>`).join('')}
  <div class="disp" style="position:absolute;left:80px;top:70px;font-size:90px;z-index:5"><span class="n5">5 agents</span> · <span class="n6" style="color:#A3E635">5 lanes</span></div>`,
 (q,t,t1)=>{draw(t,q('.m'),.3);draw(t+.1,q('.b'),.6);q('.lo').forEach((o,i)=>tl.fromTo(o,{x:0,scale:0},{x:900-i*60,scale:1,duration:t1-t-.3,ease:'power1.inOut',immediateRender:false},t+.4));pop(W('worktree','lanes'),q('.ln'),.06);slam(t,q('.n5'));slam(W('worktree','Five',2),q('.n6'))},{nojump:true});

SHOT('worktree', W('worktree','Zero'), L('merge')-.05, 'lime', `
  <div class="c disp" style="top:170px;font-size:440px;line-height:1"><span class="z">0</span></div>
  <div class="c disp" style="top:640px;font-size:110px">COLLISIONS</div>
  <div class="sticker" style="left:1260px;top:250px">works on my branch™</div>`,
 (q,t)=>{slam(t,q('.z'));flash(t,'#fff',.6);burst(t,960,420,40,['#07030F','#fff','#A855F7']);sticker(W('worktree','collisions'),q('.sticker')[0],7)});

/* ============ 06 AGENT MERGE ============ */
SHOT('merge', L('merge')-.05, W('merge','agent'), 'neon', `
  <div class="scene"><div class="rig is" style="left:360px;top:280px"><div class="card" style="position:relative;width:1200px;border-color:#A3E635;box-shadow:0 0 60px rgba(163,230,53,.4)">
   <div style="display:flex;gap:16px;align-items:center"><span style="color:#A3E635">${I('issue-opened')}</span><span class="chip" style="font-size:22px;color:#A3E635;padding:4px 14px">Open</span><span class="mono" style="font-size:24px;opacity:.6">#41</span></div>
   <div style="font-size:62px;font-weight:900;margin-top:18px">Checkout button 500s on Safari</div>
   <div style="margin-top:22px;display:flex;gap:12px"><span class="lab" style="color:#FF4D4D">bug</span><span class="lab" style="color:#FBBF24">p1</span><span class="lab" style="color:#A855F7">assign: Copilot</span></div></div></div></div>`,
 (q,t)=>fly3d(t,q('.is'),{rotationX:-50,z:-1400}));

SHOT('merge', W('merge','agent'), W('merge','Then'), 'matrix', `
  <div class="scene"><div class="rig dv" style="left:260px;top:140px">${MAC('session · fix/checkout-safari · worktree',`<div class="term" style="font-size:30px">${['<span style="opacity:.5">@@ checkout.ts @@</span>','<span style="color:#FF4D4D">- const res = fetch(url, {keepalive: true})</span>','<span style="color:#A3E635">+ const res = await fetch(url, {</span>','<span style="color:#A3E635">+   method: "POST", credentials: "include" })</span>','<span style="color:#A3E635">+ if (!res.ok) throw new CheckoutError(res)</span>','<span style="color:#22D3EE">  ✓ 18 tests passed locally</span>'].map(l=>`<div class="dl">${l}</div>`).join('')}</div>`,1400,560)}</div></div>
  <div class="toast tt">${I('copilot')} Copilot opened PR #42</div>`,
 (q,t)=>{fly3d(t,q('.dv'),{rotationY:40,z:-900},.5);slideX(t+.15,q('.dl'),-80,.1);cue(t,'keys',{d:.7});toast(W('merge','opens'),q('.tt')[0])},{rain:true});

SHOT('merge', W('merge','Then'), W('merge','babysits'), 'purple', `
  <div class="c disp ext" style="top:280px;font-size:185px;white-space:nowrap"><span class="am">AGENT MERGE</span></div>
  <div class="c serif" style="top:600px;font-size:90px">takes the wheel.</div>`,
 (q,t)=>{slam(W('merge','Agent',2),q('.am'));burst(W('merge','Agent',2),960,400,50);flash(W('merge','Agent',2),'#fff',.5)});

const CHECKS=['ci / unit-tests','ci / e2e (safari)','lint','Required review · 1 of 1'];
const checksHTML=`<div class="scene"><div class="rig ck" style="left:310px;top:120px"><div class="mac" style="position:relative;width:1300px"><div class="mbar">${TL3.map(c=>`<i style="background:${c}"></i>`).join('')}<span>PR #42 · checks & reviews</span></div>
  ${CHECKS.map((c,i)=>`<div class="row" style="position:relative"><span class="xx" style="position:relative;color:#FF4D4D">${I('x-circle-fill')}</span><span class="vv" style="position:absolute;left:26px;color:#A3E635">${I('check-circle-fill')}</span><span style="flex:1">${c}</span></div>`).join('')}</div></div></div>`;
SHOT('merge', W('merge','babysits'), W('merge','fixes'), 'black', checksHTML+`<div class="sticker pk" style="left:1250px;top:700px">3 failing 💀</div>`,
 (q,t,t1,el)=>{tl.set(q('.vv'),{opacity:0},t);tl.set(q('.row'),{backgroundColor:'rgba(255,77,77,.14)'},t);pop(t,q('.row'),.07,false);[0,1,2].forEach(i=>cue(t+.1+i*.1,'buzz_s'));shake(t+.3,el.querySelector('.punch'),14,.35);sticker(t+.4,q('.sticker')[0],-4)},{nojump:true});

SHOT('merge', W('merge','fixes'), W('merge','merges'), 'black', checksHTML+`<div class="toast t2" style="top:720px;right:260px">✅ All checks have passed</div>`,
 (q,t,t1)=>{const xx=q('.xx'),vv=q('.vv'),rows=q('.row');tl.set(vv,{opacity:0},t);tl.set(rows,{backgroundColor:'rgba(255,77,77,.14)'},t);const step=(t1-t-.45)/4;
  [0,1,2,3].forEach(i=>{const ti=t+.1+i*step;tl.fromTo(xx[i],{opacity:1},{opacity:0,duration:.06,immediateRender:false},ti);tl.fromTo(vv[i],{scale:0,opacity:0},{scale:1,opacity:1,duration:.3,ease:'back.out(3)',immediateRender:false},ti);tl.fromTo(rows[i],{backgroundColor:'rgba(255,77,77,.14)'},{backgroundColor:'rgba(163,230,53,.22)',duration:.2,immediateRender:false},ti);cue(ti,'ding',{n:i});burst(ti,360,250+i*96,10,['#A3E635','#fff'],160,[6,12])});
  toast(t1-.4,q('.t2')[0])},{nojump:true});

SHOT('merge', W('merge','merges'), W('merge','You'), 'neon', `
  <div class="card" style="left:360px;top:250px;width:1200px;height:360px">
   <div style="font-size:48px;font-weight:900">Fix checkout on Safari #42</div>
   <div style="font-size:30px;margin-top:14px;color:#A3E635">✓ All checks have passed · ✓ Approved</div>
   <div class="mb" style="position:absolute;left:26px;bottom:30px;background:#238636;font-size:36px;font-weight:800;padding:18px 34px;border-radius:14px">Merge pull request</div></div>
  <div class="cursor cu">${CURSOR}</div>
  <div class="stamp st" style="left:560px;top:380px">${ICON['git-merge']} MERGED</div>`,
 (q,t,t1,el)=>{const cu=q('.cu')[0];tl.fromTo(cu,{left:1500,top:950},{left:560,top:580,duration:.5,ease:'power3.inOut',immediateRender:false},t);
  tl.fromTo(q('.mb'),{scale:1},{scale:.9,duration:.08,yoyo:true,repeat:1,immediateRender:false},t+.5);cue(t+.5,'click');
  tl.fromTo(q('.st'),{scale:3,opacity:0},{scale:1,opacity:1,duration:.2,ease:'power4.in',immediateRender:false},t+.62);cue(t+.8,'stamp');shake(t+.82,el.querySelector('.punch'),22);confetti(t+.8,110);flash(t+.82,'#FF2E88',.4)},{nojump:true});

SHOT('merge', W('merge','You'), L('models')-.05, 'lime', `
  <div class="c disp" style="top:200px;font-size:170px"><span class="mask"><span class="y1">YOU?</span></span></div>
  <div class="c disp" style="top:420px;font-size:170px"><span class="mask"><span class="y2">GO TOUCH GRASS 🌱</span></span></div>
  <div class="sticker" style="left:1180px;top:700px">CI is green 🟢</div>`,
 (q,t)=>{up(t,q('.y1'));up(W('merge','touch'),q('.y2'));sticker(W('merge','touch')+.2,q('.sticker')[0],-4);for(let i=0;i<24;i++){}})

/* ============ 07 MODELS (verified: model + effort pickers, Auto, change mid-session, BYOK) ============ */
const MOD=['Model A','Model B','Auto ✦','Model C','BYOK 🔑','Model D'];
SHOT('models', L('models')-.05, W('models','Auto'), 'neon', `
  <div class="scene"><div class="rig car" style="left:960px;top:470px">${MOD.map((m,i)=>`<div class="card" style="left:-190px;top:-120px;width:380px;height:240px;transform:rotateY(${i*60}deg) translateZ(560px);display:flex;flex-direction:column;justify-content:center;align-items:center;border:2px solid ${NEON[i%5]};box-shadow:0 0 40px ${NEON[i%5]};backface-visibility:hidden"><div style="font:900 50px 'Mona Sans'">${m}</div><div class="mono" style="font-size:20px;opacity:.7;margin-top:10px">reasoning: ${['low','med','auto','high','yours','max'][i]}</div></div>`).join('')}</div></div>
  <div class="c disp" style="top:90px;font-size:80px">pick a model <span class="serif" style="font-weight:400">+</span> effort</div>${FACT('model names are placeholders · per GitHub Docs: model + effort pickers, Auto, BYOK')}`,
 (q,t,t1)=>{tl.fromTo(q('.car'),{rotationY:0,rotationX:-8},{rotationY:-240,rotationX:-8,duration:t1-t,ease:'power2.inOut',immediateRender:false},t);slam(t,q('.disp'));cue(t,'whoosh')},{nojump:true});

SHOT('models', W('models','Auto'), W('models','Switch'), 'purple', `<div class="c disp ext" style="top:300px;font-size:360px"><span class="au">AUTO</span></div>`, (q,t)=>{slam(t,q('.au'));burst(t,960,480,40)});

SHOT('models', W('models','Switch'), W('models','bring'), 'black', `
  <div class="scene"><div class="rig fl" style="left:660px;top:280px;width:600px;height:340px;transform-style:preserve-3d">
   <div class="card" style="left:0;top:0;width:600px;height:340px;backface-visibility:hidden;border-color:#22D3EE;box-shadow:0 0 50px #22D3EE"><div class="kicker">session · fix #41</div><div style="font:900 70px 'Mona Sans';margin-top:40px">Model A</div></div>
   <div class="card" style="left:0;top:0;width:600px;height:340px;backface-visibility:hidden;transform:rotateY(180deg);border-color:#FF2E88;box-shadow:0 0 50px #FF2E88"><div class="kicker">session · fix #41</div><div style="font:900 70px 'Mona Sans';margin-top:40px">Model B</div></div></div></div>
  <div class="c disp" style="top:100px;font-size:100px">switch <span class="grad">mid-task</span></div>
  <div class="c mono" style="top:700px;font-size:30px;opacity:.8">same session · progress kept</div>`,
 (q,t)=>{const tt=W('models','mid');tl.fromTo(q('.fl'),{rotationY:0},{rotationY:180,duration:.5,ease:'back.inOut(1.6)',immediateRender:false},tt);cue(tt,'whoosh');slam(t,q('.disp'))});

SHOT('models', W('models','bring'), L('canvas')-.05, 'white', `
  <div class="scene"><div class="rig ky" style="left:810px;top:160px;font-size:280px">🔑</div></div>
  <div class="c disp" style="top:560px;font-size:200px"><span class="mask"><span class="by">BYOK</span></span></div>`,
 (q,t,t1)=>{tl.fromTo(q('.ky'),{rotationY:0},{rotationY:540,duration:t1-t,ease:'power2.out',immediateRender:false},t);up(t,q('.by'))});

/* ============ 08 CANVASES ============ */
SHOT('canvas', L('canvas')-.05, W('canvas','Plans'), 'neon', `
  <div class="c disp ext" style="top:170px;font-size:240px"><span class="cv">CANVASES</span></div>
  <div class="card" style="left:460px;top:520px;width:1000px;height:260px;font-size:40px;line-height:1.6"><div>☑ patch fetch()</div><div><span class="e1"></span></div><div style="color:#A855F7"><span class="e2"></span></div></div>
  <div class="chip" style="position:absolute;left:1490px;top:585px;color:#A3E635;font-size:22px">✎ you</div><div class="chip" style="position:absolute;left:1490px;top:650px;color:#A855F7;font-size:22px">✎ agent</div>`,
 (q,t)=>{slam(t,q('.cv'));type(W('canvas','you'),q('.e1')[0],'☐ also test Firefox pls',.6);type(W('canvas','agent'),q('.e2')[0],'☑ added firefox to e2e matrix',.7)},{nojump:true});

const PANES=[['plan','☐ repro on Safari<br>☑ patch fetch()<br>☐ e2e test','#A855F7'],['terminal','$ npm run e2e<br><span style="color:#A3E635">✓ 42 passed</span>','#A3E635'],['browser','localhost:3000/checkout<br><span style="color:#A3E635">● 200 OK</span>','#22D3EE'],['deployment','staging · rollout 60%<br><span style="color:#FBBF24">▮▮▮▮▮▮▯▯▯▯</span>','#FBBF24']];
SHOT('canvas', W('canvas','Plans'), W('canvas','Azure'), 'matrix', `
  <div class="scene"><div class="rig" style="left:960px;top:470px">${PANES.map((p,i)=>`<div class="mac pn pn${i}" style="left:${-880+i*450}px;top:-200px;width:420px;height:400px;transform:rotateY(${(i-1.5)*-18}deg) translateZ(${Math.abs(i-1.5)*-120}px);border-color:${p[2]};box-shadow:0 0 50px ${p[2]}"><div class="mbar">${TL3.map(c=>`<i style="background:${c}"></i>`).join('')}<span>canvas · ${p[0]}</span></div><div class="term" style="font-size:26px;white-space:normal">${p[1]}</div></div>`).join('')}</div></div>`,
 (q,t)=>{['Plans','terminals','browsers','deployments'].forEach((w,i)=>pop(W('canvas',w),q('.pn'+i)))},{rain:true,nojump:true});

SHOT('canvas', W('canvas','Azure'), L('safety')-.05, 'neon', `
  <div class="scene"><div class="rig az" style="left:310px;top:160px">${MAC('My Work · Azure DevOps',`${SIDE('My Work')}<div class="main">${[['AB#1203','Work item','Checkout retries on 502','#FBBF24'],['AB#1207','Work item','Rotate storage keys','#FBBF24'],['PR 318','Pull request','Payments: idempotency','#22D3EE'],['PR 322','Pull request','Bump Functions runtime','#22D3EE']].map(r=>`<div class="ncard adr" style="margin-bottom:14px;display:flex;gap:16px;align-items:center;font-size:24px"><span class="lab" style="color:${r[3]}">${r[1]}</span><span style="opacity:.6">${r[0]}</span><span>${r[2]}</span></div>`).join('')}</div>`,1300,560)}</div></div>
  <div class="disp" style="position:absolute;left:0;right:0;top:760px;text-align:center;font-size:70px;color:#3B82F6;text-shadow:0 0 30px #3B82F6">Azure DevOps → My Work</div>${ILLUS}`,
 (q,t,t1)=>{fly3d(t,q('.az'),{rotationY:-40});slideX(W('canvas','plugs'),q('.adr'),300,.08);slam(W('canvas','My'),q('.disp'))});

/* ============ 09 SANDBOXES ============ */
const CUBE=(x,label,emo,col)=>`<div class="rig cb" style="left:${x}px;top:420px;width:300px;height:300px">${['rotateY(0deg)','rotateY(90deg)','rotateY(180deg)','rotateY(-90deg)','rotateX(90deg)','rotateX(-90deg)'].map(r=>`<div style="position:absolute;width:300px;height:300px;transform:${r} translateZ(150px);border:3px solid ${col};background:${col}22;box-shadow:inset 0 0 40px ${col}"></div>`).join('')}<div style="position:absolute;left:0;top:70px;width:300px;text-align:center;font-size:130px;transform:translateZ(0)">${emo}</div></div><div class="disp" style="position:absolute;left:${x-50}px;top:820px;width:400px;text-align:center;font-size:64px;color:${col}">${label}</div>`;
SHOT('safety', L('safety')-.05, W('safety','The'), 'neon', `<div class="scene" style="perspective:1400px">${CUBE(400,'LOCAL','💻','#22D3EE')}${CUBE(1220,'CLOUD','☁️','#A855F7')}</div>
  <div class="c disp" style="top:120px;font-size:100px">your sandbox, your call</div>`,
 (q,t,t1)=>{tl.fromTo(q('.cb'),{rotationY:0,rotationX:-18},{rotationY:160,rotationX:-18,duration:t1-t,ease:'power1.inOut',immediateRender:false},t);pop(W('safety','Local'),q('.cb')[0]);pop(W('safety','cloud'),q('.cb')[1]);slam(t,q('.c.disp'))},{nojump:true});

SHOT('safety', W('safety','The'), W('safety','until'), 'black', `
  <div class="scene"><div class="rig dlg" style="left:460px;top:250px"><div class="card" style="position:relative;width:1000px;border-color:#FBBF24;box-shadow:0 0 60px rgba(251,191,36,.5)">
   <div class="kicker" style="color:#FBBF24">cloud agent · permission request</div>
   <div style="font-size:52px;font-weight:800;margin:24px 0">Write to <span class="mono">src/checkout.ts</span>?</div>
   <div style="display:flex;gap:20px"><span class="chip al" style="color:#A3E635">Allow</span><span class="chip" style="color:#fff">Deny</span></div></div></div></div>
  <div class="cursor cu">${CURSOR}</div>
  <div class="sticker am" style="left:1200px;top:680px">asks first. every write.</div>`,
 (q,t)=>{fly3d(t,q('.dlg'),{rotationX:50});tl.fromTo(q('.cu'),{left:1600,top:950},{left:560,top:560,duration:.6,ease:'power3.inOut',immediateRender:false},t+.2);cue(t+.85,'click');sticker(W('safety','every'),q('.sticker')[0],3)});

const SPEED=(()=>{let h='';for(let i=0;i<60;i++){const a=rnd()*Math.PI*2;h+=`<div class="spd" style="position:absolute;left:960px;top:540px;width:${300+rnd()*500}px;height:4px;background:linear-gradient(90deg,transparent,${NEON[i%5]});transform-origin:0 50%;transform:rotate(${a}rad) translateX(${200+rnd()*300}px)"></div>`}return h})();
SHOT('safety', W('safety','until'), L('proof')-.05, 'black', `${SPEED}
  <div class="c disp" style="top:170px;font-size:80px">permission-first →</div>
  <div class="tg" style="position:absolute;left:720px;top:360px;width:480px;height:240px;border-radius:120px;background:#333"><div class="kn" style="position:absolute;left:20px;top:20px;width:200px;height:200px;border-radius:50%;background:#fff"></div></div>
  <div class="c disp grad ap" style="top:660px;font-size:170px">AUTOPILOT</div>`,
 (q,t)=>{const tt=W('safety','autopilot');tl.fromTo(q('.kn'),{x:0},{x:240,duration:.3,ease:'back.out(2)',immediateRender:false},tt);tl.fromTo(q('.tg'),{backgroundColor:'#333'},{backgroundColor:'#A3E635',duration:.2,immediateRender:false},tt);cue(tt,'click');slam(tt,q('.ap'));
  tl.fromTo(q('.spd'),{opacity:0,scaleX:.2},{opacity:1,scaleX:1.4,duration:.5,ease:'expo.out',immediateRender:false},tt);cue(tt,'whoosh')});

/* ============ 10 PROOF — social proof (sourced) ============ */
const GLOBE=(()=>{let h='';for(let la=-80;la<=80;la+=10)for(let lo=0;lo<360;lo+=9){h+=`<div class="gd" data-la="${la}" data-lo="${lo}" style="position:absolute;width:14px;height:14px;border-radius:50%;box-shadow:0 0 10px currentColor;background:${NEON[(la/10+lo/9+20)%5|0]}"></div>`}return h})();
SHOT('proof', L('proof')-.05, W('proof','GitHub'), 'black', `<div class="globe" style="position:absolute;left:960px;top:540px">${GLOBE}</div>
  <div class="c disp" style="top:120px;font-size:110px">the world is <span style="color:#FF2E88">NOT</span> waiting</div>`,
 (q,t,t1)=>{const ds=[...q('.gd')];const o={r:0};tl.fromTo(o,{r:0},{r:1,duration:t1-t,ease:'none',immediateRender:false,onUpdate:()=>{ds.forEach(d=>{const la=d.dataset.la*Math.PI/180,lo=(+d.dataset.lo+o.r*140)*Math.PI/180;const x=Math.cos(la)*Math.sin(lo)*380,y=Math.sin(la)*380,z=Math.cos(la)*Math.cos(lo);d.style.transform=`translate(${x}px,${y+60}px) scale(${.5+z*.6})`;d.style.opacity=z>0?1:.15})}},t);slam(W('proof','not'),q('.disp'))},{nojump:true});

SHOT('proof', W('proof','GitHub'), BREAK0, 'neon', `
  <div class="c kicker" style="top:130px">commits on GitHub, per month</div>
  <div class="c disp" style="top:220px;font-size:280px"><span class="grad"><span class="cn">0.0</span>B</span></div>
  <svg style="position:absolute;left:260px;top:560px" width="1400" height="260"><path class="ch" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="M0,240 C300,230 500,200 700,160 C900,120 1100,70 1400,10" fill="none" stroke="#A3E635" stroke-width="10" style="filter:drop-shadow(0 0 16px #A3E635)"/></svg>
  <div class="sticker li" style="left:1330px;top:400px">nearly 2× YoY 📈</div>
  ${FACT('source: github.blog · Jun 2, 2026 — “commits nearly doubled year over year, crossing 1.4 billion per month”')}`,
 (q,t)=>{count(W('proof','commits'),q('.cn')[0],0,1.4,.9,v=>v.toFixed(1));draw(W('proof','commits'),q('.ch'),.9);sticker(W('proof','doubled'),q('.sticker')[0],-5);cue(W('proof','billion'),'slam')},{nojump:true});

/* ============ 11 DEMO — concept build (labeled) ============ */
SHOT('demo', BREAK0, W('demo','One'), 'black', `
  <div class="c kicker" style="top:260px;color:#FBBF24">⚠ concept demo · illustrative</div>
  <div class="c disp" style="top:360px;font-size:160px;white-space:nowrap">${glitch('<span class="grad">CONCEPT BUILD</span>')}</div>`,
 (q,t,t1)=>{slam(W('demo','concept'),q('.disp'));glitchAnim(t,t1-t,q,16);cue(t,'riser',{d:W('demo','concept')-t})},{nojump:true});

SHOT('demo', W('demo','One'), W('demo','Five'), 'amber', `<div class="c disp" style="top:300px;font-size:260px"><span class="k">1 WEEKEND</span></div>`, (q,t)=>slam(t,q('.k')));

const AG=[['agent-1','android-capture','#A855F7','MediaProjection → H.264'],['agent-2','windows-client','#22D3EE','WinUI window + decoder'],['agent-3','stream-bridge','#A3E635','WebRTC data + video'],['agent-4','e2e-tests','#FBBF24','✓ 64 tests'],['agent-5','docs','#FF2E88','README + setup']];
const agHTML=`<div class="scene"><div class="rig ag" style="left:130px;top:150px">${AG.map((a,i)=>`<div class="card agc agc${i}" style="left:${(i%3)*570}px;top:${Math.floor(i/3)*340}px;width:530px;height:300px;border-color:${a[2]};box-shadow:0 0 40px ${a[2]}55">
  <div class="kicker" style="color:${a[2]};font-size:22px">${a[0]} · worktree</div><div style="font:900 44px 'Mona Sans';margin:12px 0">${a[1]}</div>
  <div class="mono" style="font-size:22px;opacity:.85">${a[3]}</div>
  <div style="position:absolute;left:26px;right:26px;bottom:34px;height:16px;border-radius:8px;background:rgba(255,255,255,.12)"><div class="pb pb${i}" style="height:100%;border-radius:8px;background:${a[2]};box-shadow:0 0 16px ${a[2]};width:0%"></div></div>
  <div class="dn dn${i}" style="position:absolute;right:24px;top:20px;color:#A3E635">${I('check-circle-fill')}</div></div>`).join('')}</div></div>`;
SHOT('demo', W('demo','Five'), W('demo','Phone'), 'matrix', agHTML+FACT('concept demo · illustrative'),
 (q,t)=>{fly3d(t,q('.agc'),{z:-1500,rotationY:0},.55);tl.set(q('.dn'),{opacity:0},t);cue(t,'pop')},{rain:true,nojump:true});
SHOT('demo', W('demo','Phone'), W('demo','Boom'), 'matrix', agHTML+FACT('concept demo · illustrative'),
 (q,t,t1)=>{tl.set(q('.dn'),{scale:0},t);[W('demo','Phone'),W('demo','Windows'),W('demo','streaming'),W('demo','tests'),W('demo','docs')].forEach((w,i)=>{tl.fromTo(q('.pb'+i),{width:'5%'},{width:'100%',duration:Math.max(.4,t1-w-.3),ease:'power1.inOut',immediateRender:false},t);tl.fromTo(q('.agc'+i),{scale:1},{scale:1.06,duration:.15,yoyo:true,repeat:1,immediateRender:false},w);cue(w,'pop')});
  q('.dn').forEach((d,i)=>{tl.fromTo(d,{scale:0},{scale:1,duration:.3,ease:'back.out(3)',immediateRender:false},t1-.35+i*.04);cue(t1-.35+i*.04,'ding',{n:i})})},{rain:true,nojump:true});

SHOT('demo', W('demo','Boom'), W('demo','Your'), 'hot', `<div class="c disp ext" style="top:300px;font-size:380px"><span class="bm">BOOM.</span></div>`,
 (q,t,t1,el)=>{slam(t,q('.bm'));flash(t,'#fff',1);cue(t,'boom');burst(t,960,520,80,NEON,1000,[10,30]);shake(t,el.querySelector('.punch'),30,.5)});

const PHONEUI=(sc=1)=>`<div style="position:absolute;inset:0;padding:${40*sc}px ${18*sc}px;background:linear-gradient(180deg,#1E1B4B,#07030F);font-family:'Mona Sans'">
  <div style="font-weight:900;font-size:${26*sc}px;margin-bottom:${14*sc}px">Messages</div>
  ${[['Hey! demo tonight?','#A855F7',0],['ship it 🚀','#22D3EE',1],['agents done ✅','#A3E635',0],['wait it mirrors?? 🤯','#FF2E88',1]].map(([m,c,r],i)=>`<div class="bub bub${i}" style="margin:${10*sc}px 0;display:flex;justify-content:${r?'flex-end':'flex-start'}"><span style="background:${c};color:${c==='#A3E635'?'#07030F':'#fff'};padding:${10*sc}px ${16*sc}px;border-radius:${18*sc}px;font-size:${20*sc}px;font-weight:700">${m}</span></div>`).join('')}</div>`;
SHOT('demo', W('demo','Your'), L('money')-.05, 'neon', `
  <div class="scene" style="perspective:1800px">
   <div class="rig ph" style="left:220px;top:190px;width:330px;height:660px;border-radius:52px;background:#0b0b10;border:10px solid #2a2a33;box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 60px #A855F7;overflow:hidden">${PHONEUI(1)}<div style="position:absolute;left:115px;top:10px;width:80px;height:22px;border-radius:12px;background:#000"></div></div>
   <div class="rig lp" style="left:760px;top:170px;width:980px;height:600px">
     <div style="position:absolute;left:0;top:0;width:980px;height:560px;border-radius:20px;background:#0b0b10;border:12px solid #2a2a33;overflow:hidden;box-shadow:0 0 70px #22D3EE">
       <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1e3a8a,#6d28d9 60%,#db2777)"></div>
       <div class="mac" style="left:300px;top:40px;width:340px;height:430px;border-radius:14px"><div class="mbar" style="height:36px;font-size:14px">${TL3.map(c=>`<i style="background:${c};width:11px;height:11px"></i>`).join('')}<span>PhoneMirror</span></div><div style="position:absolute;left:0;right:0;top:36px;bottom:0">${PHONEUI(.8).replace(/bub(\d)/g,'mb$1')}</div></div>
       <div style="position:absolute;left:0;right:0;bottom:0;height:44px;background:rgba(0,0,0,.55);display:flex;justify-content:center;align-items:center;gap:14px">${[0,1,2,3,4].map(i=>`<i style="width:26px;height:26px;border-radius:6px;background:${NEON[i]};display:inline-block"></i>`).join('')}</div></div>
     <div style="position:absolute;left:-60px;top:560px;width:1100px;height:34px;border-radius:0 0 30px 30px;background:linear-gradient(#3a3a44,#1a1a22)"></div></div>
   <svg class="hand" style="left:0;top:0;z-index:5" width="1920" height="1080"><path class="beam" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#22D3EE" stroke-width="10" style="filter:drop-shadow(0 0 14px #22D3EE)" d="M560,480 C680,380 820,380 1060,420"/></svg>
  </div>
  <div class="c disp" style="top:100px;font-size:72px">your phone → <span class="grad">live on Windows</span></div>
  ${FACT('concept demo · illustrative — not an official GitHub showcase')}`,
 (q,t,t1)=>{fly3d(t,q('.ph'),{rotationY:60,z:-1200},.6);fly3d(t+.1,q('.lp'),{rotationY:-50,z:-1400},.6);tl.fromTo(q('.ph'),{rotationY:0},{rotationY:18,duration:t1-t-.6,ease:'sine.inOut',immediateRender:false},t+.6);tl.fromTo(q('.lp'),{rotationY:0},{rotationY:-12,duration:t1-t-.6,ease:'sine.inOut',immediateRender:false},t+.7);
  draw(W('demo','live'),q('.beam'),.4);slam(t+.2,q('.c.disp'));
  const T0=W('demo','live');[0,1,2,3].forEach(i=>{const ti=T0-.4+i*.35;pop(ti,q('.bub'+i),0,false);pop(ti+.12,q('.mb'+i),0,false);cue(ti,'pop')});
  for(let k=0;k<14;k++){const p=document.createElement('div');p.className='pt';p.style.cssText+=`left:560px;top:480px;width:14px;height:14px;background:${NEON[k%5]};box-shadow:0 0 14px ${NEON[k%5]};opacity:0`;fx.appendChild(p);tl.fromTo(p,{x:0,y:0,opacity:1},{x:500,y:-60+((k*37)%40),opacity:0,duration:.6,ease:'power1.in',immediateRender:false},T0+.1+k*.08);tl.set(p,{opacity:0},T0+.1+k*.08-.001)}},{nojump:true});

/* ============ 12 MONEY — honest catch ============ */
SHOT('money', L('money')-.05, W('money','But'), 'hot', `
  <div class="c disp" style="top:200px;font-size:210px"><span class="ct">THE CATCH?</span></div>
  <div class="c disp" style="top:480px;font-size:90px"><span class="mask"><span class="c2">AI credits · metered in tokens</span></span></div>
  <div class="c mono" style="top:640px;font-size:30px">1 credit = $0.01 · since June 1, 2026</div>`,
 (q,t)=>{slam(W('money','catch'),q('.ct'));up(W('money','AI'),q('.c2'))});

const PLANS=[['Pro','$10','/mo','#22D3EE'],['Pro+','$39','/mo','#A855F7'],['Business','$19','/user/mo','#A3E635'],['Enterprise','$39','/user/mo','#FF2E88']];
SHOT('money', W('money','But'), W('money','hard'), 'neon', `
  <div class="c kicker" style="top:130px">included monthly AI Credits</div>
  <div class="scene"><div class="rig" style="left:960px;top:500px">${PLANS.map((p,i)=>`<div class="card pl" style="left:${-900+i*460}px;top:-200px;width:420px;height:400px;text-align:center;transform:rotateY(${(i-1.5)*-14}deg);border-color:${p[3]};box-shadow:0 0 50px ${p[3]}66"><div class="kicker" style="color:${p[3]}">${p[0]}</div><div class="disp" style="font-size:150px;margin:40px 0 20px">${p[1]}</div><div class="mono" style="font-size:24px;opacity:.8">${p[2]} in credits</div></div>`).join('')}</div></div>`,
 (q,t)=>{fly3d(W('money','includes'),q('.pl'),{z:-1400,rotationY:0},.5);cue(W('money','includes'),'pop')},{nojump:true});

const gauge=`<svg style="position:absolute;left:560px;top:90px" width="800" height="520" viewBox="-400 -420 800 520">
  <path class="gauge-arc" stroke="rgba(255,255,255,.15)" d="M-320,0 A320,320 0 0,1 320,0"/>
  <path class="gauge-arc gf" pathLength="1" stroke-dasharray="1" stroke="url(#gg)" d="M-320,0 A320,320 0 0,1 320,0"/>
  <defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#A3E635"/><stop offset=".6" stop-color="#FBBF24"/><stop offset="1" stop-color="#FF2E88"/></linearGradient></defs>
  <g class="cap"><line x1="0" y1="-260" x2="0" y2="-390" stroke="#FF4D4D" stroke-width="16" transform="rotate(50)"/><text x="0" y="-400" transform="rotate(50)" text-anchor="middle" font-family="Monaspace Neon" font-weight="700" font-size="34" fill="#FF4D4D">CAP</text></g>
  <g class="ndl"><line x1="0" y1="0" x2="0" y2="-290" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle r="26" fill="#fff"/></g></svg>`;
SHOT('money', W('money','hard'), L('cta')-.05, 'black', gauge+`
  <div class="c disp" style="top:560px;font-size:110px">hard cap <span class="serif" style="font-weight:400">=</span> <span class="grad">no runaway bill</span></div>
  <div class="c" style="top:720px;font-size:120px"><span class="bill" style="display:inline-block">💸</span><span style="display:inline-block;width:18px;height:130px;background:#FF4D4D;margin-left:30px;box-shadow:0 0 30px #FF4D4D;vertical-align:middle"></span></div>
  ${FACT('budgets at user · cost center · enterprise level (GitHub Docs)')}`,
 (q,t,t1)=>{tl.fromTo(q('.gf'),{strokeDashoffset:1},{strokeDashoffset:.22,duration:.9,ease:'power2.out',immediateRender:false},t);tl.fromTo(q('.ndl'),{rotation:-90,svgOrigin:'0 0'},{rotation:50,duration:.9,ease:'power2.out',immediateRender:false},t);
  tl.fromTo(q('.cap'),{scale:3,opacity:0,svgOrigin:'0 0'},{scale:1,opacity:1,duration:.25,ease:'power4.in',immediateRender:false},W('money','cap'));cue(W('money','cap')+.25,'snap');
  tl.fromTo(q('.bill'),{x:-500},{x:0,duration:.5,ease:'power2.in',immediateRender:false},W('money','bill'));cue(W('money','bill')+.5,'stamp');slam(W('money','cap'),q('.c.disp'))},{nojump:true});

/* ============ 13 CTA — urgency (true) + identity ============ */
SHOT('cta', L('cta')-.05, W('cta','Pro'), 'purple', `
  <div class="c" style="top:200px"><span class="chip lv" style="font-size:40px;color:#fff;border-color:#FF2E4D;background:#FF2E4D">● LIVE NOW</span></div>
  <div class="c disp ext" style="top:360px;font-size:190px"><span class="tp">TECHNICAL<br>PREVIEW</span></div>`,
 (q,t)=>{pop(t,q('.lv'));slam(W('cta','technical'),q('.tp'))});

SHOT('cta', W('cta','Pro'), W('cta','The'), 'neon', `
  <div style="position:absolute;left:0;right:0;top:330px;display:flex;justify-content:center;gap:30px">${PLANS.map(p=>`<span class="chip pb" style="font-size:56px;padding:20px 40px;color:${p[3]};box-shadow:0 0 40px ${p[3]}">${p[0]}</span>`).join('')}</div>
  <div class="c kicker" style="top:220px">available to existing</div>`,
 (q,t)=>{const w=[W('cta','Pro'),W('cta','Pro',2),W('cta','Business'),W('cta','Enterprise')];q('.pb').forEach((e,i)=>pop(w[i],[e]))});

SHOT('cta', W('cta','The'), W('cta','One'), 'black', `
  <svg class="hand" style="left:0;top:0" width="1920" height="1080"><path d="M100,700 L1820,700" stroke="rgba(255,255,255,.25)" stroke-width="6" stroke-dasharray="30 20"/></svg>
  <div class="rn r1" style="position:absolute;left:100px;top:560px;font-size:120px;transform:scaleX(-1)">🏃</div>
  <div class="rn r2" style="position:absolute;left:100px;top:560px;font-size:120px;opacity:.5;transform:scaleX(-1)">🏃</div>
  <div class="c disp" style="top:170px;font-size:100px">devs who start today are</div>
  <div class="c disp grad" style="top:330px;font-size:170px"><span class="ah">ALREADY AHEAD</span></div>`,
 (q,t,t1)=>{tl.fromTo(q('.r1'),{x:0},{x:1500,duration:t1-t,ease:'power2.out',immediateRender:false},t);tl.fromTo(q('.r2'),{x:0},{x:380,duration:t1-t,ease:'power1.out',immediateRender:false},t);slam(t,q('.c.disp')[0]);slam(W('cta','already'),q('.ah'))},{nojump:true});

SHOT('cta', W('cta','One'), W('cta','Many'), 'neon', `<div class="c disp ext" style="top:340px;font-size:280px"><span class="k">ONE APP.</span></div>`, (q,t)=>{slam(t,q('.k'));burst(t,960,480,30)});
SHOT('cta', W('cta','Many'), W('cta','Ship'), 'hot', `<div class="c disp ext" style="top:340px;font-size:250px"><span class="k">MANY AGENTS.</span></div>`, (q,t)=>{slam(t,q('.k'));burst(t,960,480,30,['#fff','#22D3EE','#A3E635'])});
SHOT('cta', W('cta','Ship'), LE('cta')+.25, 'lime', `<div class="c disp ext" style="top:320px;font-size:340px"><span class="k">SHIP IT.</span></div>`, (q,t)=>{slam(t,q('.k'));flash(t,'#fff',.8);cue(t,'boom');confetti(t,140)});
SHOT('cta', LE('cta')+.25, END, 'neon', `
  <div class="scene"><div class="rig ec" style="left:560px;top:120px">${MAC('GitHub Copilot app',MYWORK_UI(),800,450)}</div></div>
  <div class="c lg" style="top:600px"><span style="display:inline-block;width:90px;height:90px">${ICON['mark-github'].replace('<svg','<svg style="width:90px;height:90px;fill:#fff"')}</span></div>
  <div class="c disp" style="top:705px;font-size:74px;white-space:nowrap">ONE APP. MANY AGENTS. <span style="color:#A3E635">SHIP IT.</span></div>
  <div class="c" style="top:800px"><span class="chip" style="color:#FBBF24;font-size:26px">GitHub Copilot app · technical preview — check your plan</span></div>
  <div class="c disp e3" style="top:880px;font-size:48px;letter-spacing:.06em">BY YUVAL AVIDANI · <span class="grad">YUV.AI</span></div>`,
 (q,t,t1)=>{fly3d(t,q('.ec'),{rotationY:-40});tl.fromTo(q('.ec'),{rotationY:0},{rotationY:-10,rotationX:6,duration:t1-t,ease:'sine.inOut',immediateRender:false},t+.8);pop(t+.1,q('.lg'));slam(t+.2,q('.c.disp')[0]);pop(t+.5,q('.e3'))},{nojump:true});
