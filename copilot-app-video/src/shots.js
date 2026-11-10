// Every timing is derived from spoken-word timestamps via W()/WE()/L()/LE(). No hardcoded seconds.
const DROP = W('reveal','GitHub');            // music drop on the logo
const MUSIC_T0 = DROP - 8*4*beat;             // music starts 8 bars before the drop (bar-aligned)
const BREAK0 = LE('honest')+.1, BREAK1 = W('score','Tab');   // breakdown before the verdict
const G = (a,b)=>Math.max(a,b);
const tabs = n=>Array.from({length:n},(_,i)=>`<div class="tabx" style="position:absolute;left:${100+i*118}px;top:${150+(i%3)*8}px;width:170px;height:54px;background:${i%2?'#161B22':'#1c2430'};border:1.5px solid #30363D;border-radius:10px 10px 0 0;font:500 17px 'Monaspace Neon';color:#8B949E;padding:14px 12px;white-space:nowrap;overflow:hidden">${['PR #41','CI logs','Jira-ish','docs','Stack O.','Azure','staging','Slack','issue #9','dashb.','diff','prod?','reviews','tab 14'][i]}</div>`).join('');

/* ============ 01 HOOK ============ */
SHOT('hook', 0, W('hook','fourteen'), 'dark', `
  <div class="c disp" style="top:300px;font-size:300px"><span class="mask"><span class="a1">POV:</span></span></div>
  <div class="c serif muted a2" style="top:680px;font-size:64px">a normal Tuesday, apparently</div>`,
 (q,t)=>{up(t+.05,q('.a1'));fade(t+.5,q('.a2'))});

SHOT('hook', W('hook','fourteen'), W('hook','three'), 'dark', `
  ${tabs(14)}
  <div class="c disp" style="top:360px;font-size:340px"><span class="n">0</span><span class="serif" style="font-size:150px;font-weight:400"> tabs</span></div>`,
 (q,t,t1)=>{pop(t,q('.tabx'),.035,false);cue(t,'pop');count(t,q('.n')[0],0,14,.45)});

SHOT('hook', W('hook','three'), W('hook','two'), 'dark', `
  ${[0,1,2].map(i=>`<div class="win w${i}" style="left:${140+i*300}px;top:${170+i*120}px;width:1040px;height:330px"><div class="bar"><i></i><i></i><i></i>&nbsp;zsh — ${['api','web','infra'][i]}</div><div class="term"><span class="tt"></span></div></div>`).join('')}
  <div class="disp" style="position:absolute;right:120px;top:300px;font-size:260px">3<span class="serif" style="font-size:90px;font-weight:400;display:block">terminals</span></div>`,
 (q,t)=>{slideX(t,q('.win'),-200,.07);const c=['$ git checkout feat/login','$ git stash && git pull','$ npm test  # again??'];q('.tt').forEach((e,i)=>type(t+.08+i*.07,e,c[i],.5))});

SHOT('hook', W('hook','two'), W('hook','fighting'), 'dark', `
  <div class="card ag1" style="left:180px;top:250px;width:470px"><div class="kicker p">agent-A</div><div style="font-size:40px;font-weight:700;margin-top:8px">"refactoring auth"</div></div>
  <div class="card ag2" style="right:180px;top:250px;width:470px"><div class="kicker g">agent-B</div><div style="font-size:40px;font-weight:700;margin-top:8px">"also auth, lol"</div></div>
  <div class="c" style="top:560px"><span class="pill br" style="background:#161B22;border:2px solid #F85149;font-size:44px;padding:14px 34px">${I('git-branch')}&nbsp;main</span></div>
  <svg class="hand" style="left:0;top:0" width="1920" height="1080"><path class="l1" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#A371F7" d="M420,380 C520,520 800,560 900,590"/><path class="l2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#3FB950" d="M1500,380 C1400,520 1120,560 1020,590"/></svg>`,
 (q,t)=>{pop(t,q('.card'),.12);draw(t+.25,q('.l1,.l2'),.45);slam(t+.55,q('.br'))});

SHOT('hook', W('hook','fighting'), W('hook','same'), 'red', `
  <div class="win cf" style="left:260px;top:170px;width:1400px;height:540px"><div class="bar"><i></i><i></i><i></i>&nbsp;src/auth.ts — CONFLICT</div>
  <div class="term" style="font-size:30px"><span class="r">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (agent-A)</span>
const session = await refresh(token)
<span class="muted">=======</span>
const session = await login(user) <span class="muted">// agent-B was here</span>
<span class="r">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feat/auth (agent-B)</span></div></div>
  <div class="sticker s1" style="left:1080px;top:640px">merge conflict? never heard of her</div>`,
 (q,t,t1,el)=>{slam(t,q('.cf'),.25);cue(t,'buzz');flash(t,'#F85149',.5);sticker(t+.3,q('.s1')[0],-5)});

SHOT('hook', W('hook','same'), L('reveal')-.95, 'black', `
  <div class="c disp r" style="top:330px;font-size:230px;font-stretch:75%"><span class="mask"><span class="z">SAME. BRANCH.</span></span></div>
  <div class="c mono muted zz" style="top:640px;font-size:32px">error: Your local changes would be overwritten by merge. Aborting.</div>`,
 (q,t)=>{up(t,q('.z'));fade(t+.25,q('.zz'),.15);cue(t+.1,'buzz')});

/* ============ 02 REVEAL ============ */
// contribution-graph wipe (riser)
const GRID = (()=>{let h='';const cols=['#0e4429','#006d32','#26a641','#39d353'];for(let x=0;x<33;x++)for(let y=0;y<17;y++){h+=`<div class="sq cg" data-x="${x}" style="left:${24+x*57.5}px;top:${58+y*57.5}px;background:${cols[Math.floor(rnd()*4)]}"></div>`}return h})();
SHOT('reveal', L('reveal')-.95, W('reveal','Meet'), 'black', GRID,
 (q,t,t1)=>{const sq=[...q('.cg')];tl.fromTo(sq,{scale:0},{scale:1,duration:.22,ease:'back.out(2)',immediateRender:false,stagger:{each:.0012,from:'start',grid:[17,33],axis:'x'}},t);cue(t,'riser',{d:DROP-t})});

SHOT('reveal', W('reveal','Meet'), DROP, 'black', `
  <div class="c serif" style="top:400px;font-size:120px"><span class="mask"><span class="m1">meet the…</span></span></div>`,
 (q,t)=>up(t,q('.m1')));

SHOT('reveal', DROP, W('reveal','The',2), 'dark', `
  <div class="c logo" style="top:190px"><span style="display:inline-block;width:300px;height:300px">${ICON['mark-github'].replace('<svg','<svg style="width:300px;height:300px;fill:#fff"')}</span></div>
  <div class="c disp t1" style="top:560px;font-size:150px">GitHub Copilot app</div>
  <div class="c kicker muted t2" style="top:750px">technical preview · Microsoft Build 2026</div>`,
 (q,t)=>{tl.fromTo(q('.logo'),{y:-700},{y:0,duration:.45,ease:'bounce.out',immediateRender:false},t-.3);flash(t,'#fff',.95);cue(t,'boom');slam(t+.12,q('.t1'));fade(t+.5,q('.t2'))});

SHOT('reveal', W('reveal','The',2), L('mywork')-.05, 'white', `
  <div class="c kicker" style="top:250px;color:#59636E">the</div>
  <div class="c disp" style="top:330px;font-size:190px"><span class="mask"><span class="h1">desktop <span class="serif" style="font-weight:400;color:#8250DF">home</span></span></span></div>
  <div class="c disp" style="top:560px;font-size:120px;font-stretch:100%"><span class="mask"><span class="h2">for your agents.</span></span></div>`,
 (q,t)=>{up(t,q('.h1'));up(W('reveal','for'),q('.h2'))});

/* ============ 03 MY WORK ============ */
SHOT('mywork', L('mywork')-.05, W('mywork','agent'), 'purple', `
  <div class="c kicker" style="top:220px">one view to rule them all</div>
  <div class="c disp" style="top:320px;font-size:280px"><span class="mask"><span class="mw">MY WORK</span></span></div>`,
 (q,t)=>{up(t,q('.mw'));cue(t,'whoosh')});

const COLS=[['Agent sessions','copilot',['fix: checkout 500','chore: bump deps','docs: release notes']],['Issues','issue-opened',['#41 Safari checkout','#57 flaky e2e','#60 dark-mode bug']],['Pull requests','git-pull-request',['#42 Fix checkout','#43 Bump deps','#39 Refactor auth']],['Automations','git-branch',['triage · nightly','release notes · Fri','dep updates · weekly']]];
SHOT('mywork', W('mywork','agent'), W('mywork','across'), 'dark', `
  <div class="win" style="left:100px;top:110px;width:1720px;height:740px"><div class="bar"><i></i><i></i><i></i>&nbsp;GitHub Copilot app — My Work <span style="margin-left:auto" class="lab">illustrative UI</span></div>
  <div style="display:flex;gap:20px;padding:22px">
  ${COLS.map((c,i)=>`<div class="col col${i}" style="flex:1;background:#0D1117;border:1.5px solid #30363D;border-radius:12px;min-height:600px">
   <div style="display:flex;gap:10px;align-items:center;padding:18px;font-weight:800;font-size:28px;border-bottom:1.5px solid #30363D"><span class="${['p','g','g','a'][i]}">${I(c[1])}</span>${c[0]}</div>
   ${c[2].map((x,j)=>`<div class="it it${i}" style="margin:14px;padding:16px;border:1.5px solid #30363D;border-radius:10px;font-size:22px;font-family:'Monaspace Neon'">${x}<div style="margin-top:8px;height:6px;border-radius:3px;background:${['#A371F7','#3FB950','#3FB950','#D29922'][i]};width:${40+j*20}%"></div></div>`).join('')}</div>`).join('')}
  </div></div>`,
 (q,t)=>{const ts=[W('mywork','agent'),W('mywork','issues'),W('mywork','pull'),W('mywork','background')];ts.forEach((x,i)=>{pop(x,q('.col'+i),0,true);pop(x+.12,q('.it'+i),.06,false)})});

SHOT('mywork', W('mywork','across'), W('mywork','Basically'), 'dark', `
    <div class="card hubc" style="z-index:2;left:760px;top:400px;width:400px;text-align:center;font-size:40px;font-weight:800;border-color:#A371F7">My Work</div>
  ${['org/api','org/web','org/infra','org/mobile','org/docs'].map((r,i)=>`<div class="lab repo" style="position:absolute;left:${[180,1480,200,1460,820][i]}px;top:${[260,260,640,640,720][i]}px;font-size:30px;padding:10px 24px;color:#F0F6FC;border-color:#30363D;background:#161B22;z-index:2">${r}</div>`).join('')}
  <svg class="hand" style="left:0;top:0;z-index:0" width="1920" height="1080">${[[330,300],[1560,300],[350,670],[1540,670],[960,730]].map(([x,y])=>`<path class="ln" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#30363D" stroke-width="4" d="M${x},${y} L960,450"/>`).join('')}</svg>`,
 (q,t)=>{pop(t,q('.hubc'));pop(t+.1,q('.repo'),.06);draw(t+.25,q('.ln'),.4)});

SHOT('mywork', W('mywork','Basically'), L('worktree')-.05, 'black', `
  <svg style="position:absolute;left:560px;top:120px" width="800" height="800" viewBox="-400 -400 800 800">
   ${[120,220,320].map(r=>`<circle r="${r}" fill="none" stroke="#1f6f3a" stroke-width="2"/>`).join('')}
   <line x1="-390" y1="0" x2="390" y2="0" stroke="#1f6f3a"/><line y1="-390" x1="0" y2="390" x2="0" stroke="#1f6f3a"/>
   <g class="sweep"><path d="M0,0 L0,-360 A360,360 0 0,1 180,-312 Z" fill="rgba(63,185,80,.25)"/></g>
   ${[[140,-90,'agent-A'],[-200,60,'agent-B'],[80,210,'agent-C'],[-120,-230,'agent-D']].map(([x,y,n])=>`<g class="blip" transform="translate(${x},${y})"><circle r="12" fill="#A371F7"/><text x="20" y="8" font-family="Monaspace Neon" font-size="22" fill="#F0F6FC">${n}</text></g>`).join('')}
  </svg>
  <div class="disp" style="position:absolute;left:100px;top:170px;font-size:110px;line-height:.95"><span class="mask"><span class="atc">air-traffic<br>control</span></span><span class="serif muted" style="font-size:70px;font-weight:400;display:block">for agents</span></div>
  <div class="sticker ye pm" style="right:140px;top:700px">your PM: 👀</div>`,
 (q,t,t1)=>{tl.fromTo(q('.sweep'),{rotation:0,svgOrigin:'0 0'},{rotation:720,duration:t1-t,ease:'none',immediateRender:false},t);pop(t+.2,q('.blip'),.12);up(t,q('.atc'));sticker(W('mywork','agents'),q('.pm')[0],5)});

/* ============ 04 WORKTREES ============ */
SHOT('worktree', L('worktree')-.05, W('worktree','Parallel'), 'dark', `
  <div class="c disp" style="top:170px;font-size:130px"><span class="mask"><span class="w1">1 session =</span></span></div>
  <div class="c disp g" style="top:320px;font-size:130px"><span class="mask"><span class="w2">1 git worktree</span></span></div>
  <div class="win" style="left:360px;top:540px;width:1200px;height:190px"><div class="bar"><i></i><i></i><i></i>&nbsp;what the app does for you</div><div class="term"><span class="tt"></span></div></div>`,
 (q,t)=>{up(t,q('.w1'));up(W('worktree','git'),q('.w2'));type(t+.3,q('.tt')[0],'$ git worktree add ../agent-a -b feat/checkout',.9)});

SHOT('worktree', W('worktree','Parallel'), W('worktree','zero'), 'black', `
  <svg class="hand" style="left:0;top:0" width="1920" height="1080">
   <path class="m" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#8B949E" d="M120,540 L1800,540"/>
   <path class="b" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#A371F7" d="M300,540 C520,540 520,260 760,260 L1800,260"/>
   <path class="b" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#3FB950" d="M420,540 C640,540 640,400 880,400 L1800,400"/>
   <path class="b" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#D29922" d="M540,540 C760,540 760,720 1000,720 L1800,720"/>
  </svg>
  ${[[260,'agent-A · feat/checkout','p'],[400,'agent-B · chore/deps','g'],[720,'agent-C · docs/release','a']].map(([y,n,c])=>`<div class="lab lane ${c}" style="position:absolute;left:1180px;top:${y-58}px;font-size:26px;background:#0D1117">${n}</div>`).join('')}
  <div class="lab" style="position:absolute;left:130px;top:560px;font-size:24px;color:#8B949E">main</div>
  <div class="disp" style="position:absolute;left:120px;top:110px;font-size:90px"><span class="mask"><span class="pl">parallel lanes</span></span></div>`,
 (q,t)=>{draw(t,q('.m'),.35);draw(t+.2,q('.b'),.7);pop(W('worktree','separate'),q('.lane'),.1);up(t,q('.pl'))});

SHOT('worktree', W('worktree','zero'), W('worktree','No'), 'purple', `
  <div class="c disp" style="top:200px;font-size:420px;line-height:1"><span class="z">0</span></div>
  <div class="c serif" style="top:680px;font-size:90px">branch juggling 🤹</div>`,
 (q,t)=>{slam(t,q('.z'));flash(t,'#fff',.4)});

SHOT('worktree', W('worktree','No'), L('pipeline')-.05, 'dark', `
  <div class="c disp" style="top:300px;font-size:150px;font-stretch:90%"><span class="q1">who touched my branch?</span></div>
  <svg class="hand" style="left:170px;top:360px" width="1580" height="120"><path class="x" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" stroke="#F85149" stroke-width="14" d="M10,60 C400,40 1100,80 1570,50"/></svg>
  <div class="sticker gr wm" style="left:640px;top:600px">works on my branch™</div>`,
 (q,t)=>{fade(t,q('.q1'),.15);draw(W('worktree','branch',2),q('.x'),.3);sticker(W('worktree','branch',2)+.25,q('.wm')[0],4)});

/* ============ 05 ISSUE → PR → AGENT MERGE ============ */
SHOT('pipeline', L('pipeline')-.05, W('pipeline','agent'), 'dark', `
  <div class="card is" style="left:360px;top:260px;width:1200px">
   <div style="display:flex;gap:16px;align-items:center"><span class="g">${I('issue-opened')}</span><span class="pill" style="background:#1f6f3a;font-size:22px">Open</span><span class="muted mono" style="font-size:22px">#41</span></div>
   <div style="font-size:58px;font-weight:800;margin-top:18px">Checkout button 500s on Safari</div>
   <div style="margin-top:22px;display:flex;gap:12px"><span class="lab r">bug</span><span class="lab a">p1</span><span class="lab p">assign: Copilot</span></div></div>
  <div class="c kicker muted" style="top:170px">step 1 · start from an issue</div>`,
 (q,t)=>{pop(t,q('.is'))});

SHOT('pipeline', W('pipeline','agent'), W('pipeline','you'), 'dark', `
  <div class="win" style="left:260px;top:150px;width:1400px;height:600px"><div class="bar"><i></i><i></i><i></i>&nbsp;session · fix/checkout-safari · worktree</div>
  <div class="term" style="font-size:28px">${['<span class="muted">@@ checkout.ts @@</span>','<span class="r">- const res = fetch(url, {keepalive: true})</span>','<span class="g">+ const res = await fetch(url, {</span>','<span class="g">+   method: "POST", credentials: "include" })</span>','<span class="g">+ if (!res.ok) throw new CheckoutError(res)</span>','<span class="muted">  ✓ 18 tests passed locally</span>'].map(l=>`<div class="dl">${l}</div>`).join('')}</div></div>
  <div class="c kicker muted" style="top:790px">step 2 · the agent does the work</div>`,
 (q,t)=>{slideX(t,q('.dl'),-60,.12);cue(t,'keys',{d:.7})});

SHOT('pipeline', W('pipeline','you'), W('pipeline','Agent',2), 'dark', `
  <div class="card pr" style="left:260px;top:230px;width:1400px">
   <div style="font-size:60px;font-weight:800">Fix checkout on Safari <span class="muted" style="font-weight:400">#42</span></div>
   <div style="margin-top:20px;display:flex;gap:16px;align-items:center"><span class="pill" style="background:#238636">${I('git-pull-request')} Open</span><span class="muted" style="font-size:28px">Copilot wants to merge 1 commit into <span class="mono lab" style="color:#58A6FF">main</span> from <span class="mono lab" style="color:#58A6FF">fix/checkout-safari</span></span></div></div>
  <div class="toast tt">${I('copilot','p')} Copilot opened PR #42</div>
  <div class="c kicker muted" style="top:560px">step 3 · you review the PR</div>`,
 (q,t)=>{pop(t,q('.pr'));toast(t+.2,q('.tt')[0])});

SHOT('pipeline', W('pipeline','Agent',2), W('pipeline','watches'), 'purple', `
  <div class="c disp" style="top:300px;font-size:210px;white-space:nowrap"><span class="mask"><span class="am">AGENT MERGE</span></span></div>
  <div class="c serif" style="top:600px;font-size:90px">takes over.</div>`,
 (q,t)=>{up(t,q('.am'));flash(t,'#fff',.35)});

const CHECKS=['ci / unit-tests','ci / e2e (safari)','lint','Required review · 1 of 1'];
const checksHTML=`<!--NOJUMP--><div class="win ck" style="left:310px;top:140px;width:1300px"><div class="bar"><i></i><i></i><i></i>&nbsp;PR #42 · checks & reviews</div>
  ${CHECKS.map((c,i)=>`<div class="row" style="position:relative;font-family:'Monaspace Neon';font-size:38px;padding:30px 30px"><span class="xx r" style="position:relative">${I('x-circle-fill')}</span><span class="vv g" style="position:absolute;left:30px">${I('check-circle-fill')}</span><span style="flex:1">${c}</span><span class="st st${i} mono" style="font-size:22px"></span></div>`).join('')}</div>`;
SHOT('pipeline', W('pipeline','watches'), W('pipeline','fixes'), 'dark', checksHTML+`
  <div class="c mono muted" style="top:660px;font-size:30px">watching CI · tracking required reviewers</div>
  <div class="sticker rr" style="left:1260px;top:730px;background:#F85149;color:#fff">3 failing, 1 pending 💀</div>`,
 (q,t)=>{const vv=q('.vv');tl.set(vv,{opacity:0},t);pop(t,q('.row'),.08,false);[0,1,2].forEach(i=>cue(t+.1+i*.12,'buzz_s'));sticker(W('pipeline','tracks'),q('.rr')[0],-4)});

SHOT('pipeline', W('pipeline','fixes'), W('pipeline','merges'), 'dark', checksHTML+`
  <div class="toast t2" style="top:720px;right:120px">✅ All checks have passed</div>`,
 (q,t,t1)=>{const xx=q('.xx'),vv=q('.vv'),rows=q('.row');tl.set(vv,{opacity:0},t);const step=(t1-t-.5)/4;
  [0,1,2,3].forEach(i=>{const ti=t+.15+i*step;tl.fromTo(xx[i],{opacity:1},{opacity:0,duration:.08,immediateRender:false},ti);tl.fromTo(vv[i],{scale:0,opacity:0},{scale:1,opacity:1,duration:.3,ease:'back.out(3)',immediateRender:false},ti);tl.fromTo(rows[i],{backgroundColor:'rgba(248,81,73,.12)'},{backgroundColor:'rgba(63,185,80,.14)',duration:.2,immediateRender:false},ti);cue(ti,'ding',{n:i})});
  tl.set(rows,{backgroundColor:'rgba(248,81,73,.12)'},t);toast(t1-.45,q('.t2')[0])});

SHOT('pipeline', W('pipeline','merges'), W('pipeline','It',2), 'dark', `
  <div class="card" style="left:360px;top:230px;width:1200px;height:380px">
   <div style="font-size:44px;font-weight:800">Fix checkout on Safari #42</div>
   <div class="g" style="font-size:28px;margin-top:14px">✓ All checks have passed · ✓ Approved</div>
   <div class="mb" style="position:absolute;left:26px;bottom:30px;background:#238636;color:#fff;font-size:34px;font-weight:700;padding:18px 34px;border-radius:12px">Merge pull request</div></div>
  <div class="cursor cu">${CURSOR}</div>
  <div class="stamp st" style="left:620px;top:360px">${ICON['git-merge']} Merged</div><!--NOJUMP-->`,
 (q,t,t1)=>{const cu=q('.cu')[0];tl.fromTo(cu,{left:1500,top:900},{left:560,top:560,duration:.55,ease:'power3.inOut',immediateRender:false},t);
  tl.fromTo(q('.mb'),{scale:1},{scale:.92,duration:.08,yoyo:true,repeat:1,immediateRender:false},t+.55);cue(t+.55,'click');
  tl.fromTo(q('.st'),{scale:2.6,opacity:0},{scale:1,opacity:1,duration:.22,ease:'power4.in',immediateRender:false},t+.7);cue(t+.9,'stamp');shake(t+.92,q('.punch')[0].parentNode,18)});

SHOT('pipeline', W('pipeline','It',2), L('models')-.05, 'green', `
  <div class="c disp" style="top:250px;font-size:150px;line-height:1"><span class="mask"><span class="b1">it babysits CI</span></span><span class="mask"><span class="b2 serif" style="font-weight:400">so you don't.</span></span></div>
  <div class="sticker tg" style="left:1150px;top:680px">CI is green 🟢 touch grass</div>`,
 (q,t)=>{up(t,q('.b1'));up(W('pipeline','so'),q('.b2'));sticker(W('pipeline','so')+.15,q('.tg')[0],-3)});

/* ============ 06 MODELS (verified: docs.github.com agent-sessions + BYOK) ============ */
const MODELS=['Auto','GitHub-hosted models','Your provider · BYOK'];
SHOT('models', L('models')-.05, W('models','Auto'), 'dark', `
  <div class="win" style="left:260px;top:150px;width:1400px;height:640px"><div class="bar"><i></i><i></i><i></i>&nbsp;new session <span style="margin-left:auto" class="lab">illustrative UI</span></div>
   <div style="margin:28px;padding:24px;border:1.5px solid #30363D;border-radius:12px;font-size:32px;color:#8B949E" class="mono">fix #41 and add a regression test_</div>
   <div style="display:flex;gap:18px;margin:0 28px">
    <div class="dd d1" style="flex:1;border:1.5px solid #A371F7;border-radius:12px;padding:18px"><div class="kicker muted" style="font-size:18px">model</div>${MODELS.map((m,i)=>`<div class="mi" style="font-size:30px;font-weight:700;padding:10px 0">${i?'':'★ '}${m}</div>`).join('')}</div>
    <div class="dd d2" style="width:420px;border:1.5px solid #30363D;border-radius:12px;padding:18px"><div class="kicker muted" style="font-size:18px">reasoning effort</div>${['low','medium','high'].map((m,i)=>`<div class="re" style="font-size:30px;font-weight:700;padding:10px 0;${i==2?'color:#A371F7':''}">${m}</div>`).join('')}</div>
   </div></div>`,
 (q,t)=>{pop(W('models','model'),q('.d1'));pop(W('models','model')+.1,q('.mi'),.08,false);pop(W('models','reasoning'),q('.d2'));pop(W('models','reasoning')+.1,q('.re'),.08,false)});

SHOT('models', W('models','Auto'), W('models','Change'), 'purple', `
  <div class="c disp" style="top:290px;font-size:330px"><span class="au">AUTO</span></div>
  <div class="c serif" style="top:690px;font-size:70px">lets the app pick for the task</div>`,
 (q,t)=>slam(t,q('.au')));

SHOT('models', W('models','Change'), W('models','Bring'), 'dark', `
  <div class="c disp" style="top:200px;font-size:120px">swap mid-task</div>
  <div class="tg" style="position:absolute;left:760px;top:430px;width:400px;height:200px;border-radius:100px;background:#30363D"><div class="kn" style="position:absolute;left:20px;top:20px;width:160px;height:160px;border-radius:50%;background:#F0F6FC"></div></div>
  <div class="c mono muted" style="top:700px;font-size:30px">model + effort · change any time during a session</div>`,
 (q,t)=>{const tt=W('models','time');tl.fromTo(q('.kn'),{x:0},{x:200,duration:.25,ease:'back.out(2)',immediateRender:false},tt);tl.fromTo(q('.tg'),{backgroundColor:'#30363D'},{backgroundColor:'#8250DF',duration:.2,immediateRender:false},tt);cue(tt,'click')});

SHOT('models', W('models','Bring'), L('canvas')-.05, 'white', `
  <div class="c" style="top:200px;font-size:220px">🔑</div>
  <div class="c disp" style="top:500px;font-size:150px"><span class="mask"><span class="by">BYOK</span></span></div>
  <div class="c serif" style="top:680px;font-size:64px;color:#59636E">bring your own key, too</div>`,
 (q,t)=>{up(t,q('.by'))});

/* ============ 07 CANVASES ============ */
SHOT('canvas', L('canvas')-.05, W('canvas','plans'), 'dark', `
  <div class="c disp" style="top:250px;font-size:250px"><span class="mask"><span class="cv">CANVASES</span></span></div>
  <div class="c serif p" style="top:560px;font-size:90px">shared work surfaces</div>
  <div class="c kicker muted" style="top:720px">human ⇄ agent · bidirectional</div>`,
 (q,t)=>{up(t,q('.cv'));fade(W('canvas','shared'),q('.serif'))});

const PANES=[['plan','☐ repro on Safari<br>☑ patch fetch()<br>☐ add e2e test'],['terminal','$ npm run e2e<br><span class="g">✓ 42 passed</span>'],['browser','localhost:3000/checkout<br><span class="g">● 200 OK</span>'],['deployment','staging · rollout 60%<br><span class="a">▮▮▮▮▮▮▯▯▯▯</span>']];
SHOT('canvas', W('canvas','plans'), W('canvas','You'), 'dark', `
  <div style="position:absolute;left:100px;top:110px;right:100px;bottom:180px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
  ${PANES.map((p,i)=>`<div class="win pn pn${i}" style="position:relative"><div class="bar"><i></i><i></i><i></i>&nbsp;canvas · ${p[0]}</div><div class="term" style="font-size:30px;white-space:normal">${p[1]}</div></div>`).join('')}</div>`,
 (q,t)=>{['plans','terminals','browsers','deployments'].forEach((w,i)=>pop(W('canvas',w),q('.pn'+i)))});

SHOT('canvas', W('canvas','You'), W('canvas','Same'), 'dark', `
  <div class="win" style="left:360px;top:150px;width:1200px;height:600px"><div class="bar"><i></i><i></i><i></i>&nbsp;canvas · plan.md</div>
   <div style="padding:30px;font-size:40px;line-height:1.8">
    <div>☑ patch fetch()</div><div><span class="e1"></span></div><div class="p"><span class="e2"></span></div></div></div>
  <div class="lab" style="position:absolute;left:1340px;top:300px;color:#3FB950;font-size:26px;background:#0D1117">✎ you</div>
  <div class="lab" style="position:absolute;left:1340px;top:372px;color:#A371F7;font-size:26px;background:#0D1117">✎ agent</div>`,
 (q,t)=>{type(t,q('.e1')[0],'☐ also test Firefox pls',.6);type(W('canvas','agent'),q('.e2')[0],'☑ added firefox to e2e matrix',.6)});

SHOT('canvas', W('canvas','Same'), L('azure')-.05, 'white', `
  <div class="c disp" style="top:320px;font-size:190px"><span class="mask"><span class="sp">same page,</span></span></div>
  <div class="c serif" style="top:560px;font-size:130px;color:#8250DF"><span class="mask"><span class="li">literally.</span></span></div>`,
 (q,t)=>{up(t,q('.sp'));up(W('canvas','literally'),q('.li'))});

/* ============ 08 AZURE ============ */
SHOT('azure', L('azure')-.05, W('azure','Azure',2), 'dark', `
  <div class="c kicker muted" style="top:250px">calling all</div>
  <div class="c disp" style="top:330px;font-size:260px;color:#58A6FF"><span class="az">AZURE SHOPS</span></div>`,
 (q,t)=>slam(t+.05,q('.az')));

SHOT('azure', W('azure','Azure',2), W('azure','community'), 'dark', `
  <div class="win" style="left:260px;top:120px;width:1400px;height:660px"><div class="bar"><i></i><i></i><i></i>&nbsp;My Work · Azure DevOps extension <span style="margin-left:auto" class="lab">illustrative UI</span></div>
  ${[['AB#1203','Work item','Checkout retries on 502','a'],['AB#1207','Work item','Rotate storage keys','a'],['PR 318','Pull request','Payments: idempotency keys','g'],['PR 322','Pull request','Bump Functions runtime','g']].map(r=>`<div class="row adr"><span class="lab ${r[3]}">${r[1]}</span><span class="mono muted">${r[0]}</span><span>${r[2]}</span></div>`).join('')}
  <div class="row mono muted" style="font-size:22px;border:0">view · open · edit work items · edit & complete PRs</div></div>`,
 (q,t)=>{pop(W('azure','work'),q('.adr'),.1)});

SHOT('azure', W('azure','community'), W('azure','Functions'), 'purple', `
  <div class="c disp" style="top:260px;font-size:150px"><span class="mask"><span class="ce">canvas extensions</span></span></div>
  <div class="c" style="top:520px"><span class="lab" style="font-size:34px;padding:10px 28px">community-built · awesome-copilot</span></div>`,
 (q,t)=>{up(t,q('.ce'))});

SHOT('azure', W('azure','Functions'), W('azure','even'), 'dark', `
  <div class="card f1" style="left:120px;top:150px;width:820px;height:560px"><div class="kicker" style="color:#58A6FF">Azure Functions Hosted Skills</div>
   <div class="term" style="font-size:26px;padding:20px 0">$ func start<br><span class="g">Functions:</span><br>  triage-skill: [POST] /api/triage<br><span class="muted">build · run · debug locally</span></div></div>
  <div class="card f2" style="left:980px;top:150px;width:820px;height:560px"><div class="kicker" style="color:#58A6FF">Azure Resources Query</div>
   <div class="term" style="font-size:24px;padding:20px 0">resources<br>| where type =~ "microsoft.web/sites"<br>| project name, location<br><span class="muted">read-only Resource Graph</span></div></div>`,
 (q,t)=>{pop(t,q('.f1'));pop(W('azure','Resource'),q('.f2'))});

const BARS=[38,44,41,52,60,57,72,66,80,74,88,95];
SHOT('azure', W('azure','even'), W('azure','Finally'), 'dark', `
  <div class="win" style="left:260px;top:120px;width:1400px;height:660px"><div class="bar"><i></i><i></i><i></i>&nbsp;canvas · Azure Cost Health Check <span style="margin-left:auto" class="lab">sample data</span></div>
  <div style="position:absolute;left:60px;top:90px;font-size:30px" class="muted">month-to-date spend</div>
  <div style="position:absolute;left:60px;top:130px;font-size:96px;font-weight:900" class="disp">$<span class="cn">0</span></div>
  <div style="position:absolute;left:60px;right:60px;bottom:60px;height:330px;display:flex;align-items:flex-end;gap:18px">${BARS.map((b,i)=>`<div class="bar_" style="flex:1;height:${b*3.3}px;background:${i>9?'#D29922':'#58A6FF'};border-radius:6px 6px 0 0;transform-origin:bottom"></div>`).join('')}</div>
  <div class="lab a" style="position:absolute;right:60px;top:110px;font-size:24px">budget alert · 90%</div></div>`,
 (q,t)=>{tl.fromTo(q('.bar_'),{scaleY:0},{scaleY:1,duration:.5,ease:'power3.out',stagger:.03,immediateRender:false},t);count(t,q('.cn')[0],0,1284,.8,v=>Math.round(v).toLocaleString('en-US'));cue(t,'whoosh')});

SHOT('azure', W('azure','Finally'), L('safety')-.05, 'dark', `
  <div style="position:absolute;left:0;top:0;width:960px;height:1080px;background:#161B22"></div>
  <div class="term sc" style="position:absolute;left:100px;top:220px;font-size:30px"><span class="p">export</span> async function checkout() {<br>  <span class="muted">// ...</span><br>}</div>
  <div class="disp sb" style="position:absolute;left:1060px;top:220px;font-size:110px;color:#D29922">$1,284<div class="serif" style="font-size:50px;color:#F0F6FC;font-weight:400">cloud bill (sample)</div></div>
  <div class="c disp" style="top:620px;font-size:90px"><span class="mask"><span class="fn">finally, next to the code.</span></span></div>`,
 (q,t)=>{slideX(t,q('.sc'),-200);slideX(t+.1,q('.sb'),200);up(W('azure','next'),q('.fn'))});

/* ============ 09 SAFETY ============ */
SHOT('safety', L('safety')-.05, W('safety','The'), 'dark', `
  <div class="card sb1" style="left:160px;top:180px;width:760px;height:540px"><div style="font-size:120px">💻</div><div class="disp" style="font-size:80px">LOCAL</div><div class="mono muted" style="font-size:24px;margin-top:18px;line-height:1.6">sandbox restricts filesystem,<br>network & credential access</div></div>
  <div class="card sb2" style="left:1000px;top:180px;width:760px;height:540px;border-color:#A371F7"><div style="font-size:120px">☁️</div><div class="disp" style="font-size:80px">CLOUD</div><div class="mono muted" style="font-size:24px;margin-top:18px;line-height:1.6">isolated, ephemeral Linux<br>environment hosted by GitHub</div></div>`,
 (q,t)=>{pop(W('safety','local'),q('.sb1'));pop(W('safety','cloud'),q('.sb2'))});

SHOT('safety', W('safety','The'), W('safety','until'), 'dark', `
  <div class="card dlg" style="left:460px;top:220px;width:1000px;border-color:#D29922">
   <div class="kicker a">cloud agent · permission request</div>
   <div style="font-size:46px;font-weight:700;margin:22px 0">Write to <span class="mono">src/checkout.ts</span>?</div>
   <div style="display:flex;gap:20px"><span class="pill al" style="background:#238636">Allow</span><span class="pill" style="background:#30363D">Deny</span></div></div>
  <div class="cursor cu">${CURSOR}</div>
  <div class="sticker ye" style="left:1220px;top:620px" >asks first. every write.</div>`,
 (q,t,t1)=>{pop(t,q('.dlg'));tl.fromTo(q('.cu'),{left:1600,top:950},{left:540,top:520,duration:.6,ease:'power3.inOut',immediateRender:false},t+.2);cue(t+.85,'click');sticker(W('safety','every'),q('.sticker')[0],3)});

SHOT('safety', W('safety','until'), W('safety','And'), 'purple', `
  <div class="c disp" style="top:180px;font-size:80px">permission-first <span class="serif" style="font-weight:400">→</span> autopilot</div>
  <div class="tg" style="position:absolute;left:720px;top:360px;width:480px;height:240px;border-radius:120px;background:rgba(0,0,0,.35)"><div class="kn" style="position:absolute;left:20px;top:20px;width:200px;height:200px;border-radius:50%;background:#fff"></div></div>
  <div class="sticker" style="left:1180px;top:680px">trust issues: resolved</div>`,
 (q,t)=>{const tt=W('safety','autopilot');tl.fromTo(q('.kn'),{x:0},{x:240,duration:.3,ease:'back.out(2)',immediateRender:false},tt);tl.fromTo(q('.tg'),{backgroundColor:'rgba(0,0,0,.35)'},{backgroundColor:'#1A7F37',duration:.2,immediateRender:false},tt);cue(tt,'click');sticker(tt+.3,q('.sticker')[0],-4)});

SHOT('safety', W('safety','And'), L('money')-.05, 'dark', `
  <div class="win" style="left:260px;top:170px;width:1400px;height:520px"><div class="bar"><i></i><i></i><i></i>&nbsp;Copilot code review</div>
  <div class="term" style="font-size:40px"><span class="p">&gt;</span> <span class="sr"></span>
<span class="muted s2">  security-focused evaluation of PR #42 ▸ running…</span></div></div>`,
 (q,t)=>{type(W('safety','slash'),q('.sr')[0],'/security-review',.5);fade(W('safety','adds'),q('.s2'))});

/* ============ 10 MONEY ============ */
SHOT('money', L('money')-.05, W('money','Since'), 'white', `
  <div class="c disp" style="top:260px;font-size:300px;color:#1A7F37"><span class="mo">$$$</span></div>
  <div class="c serif" style="top:640px;font-size:90px">money talk</div>`,
 (q,t)=>{slam(W('money','money'),q('.mo'))});

SHOT('money', W('money','Since'), W('money','Every'), 'dark', `
  <div class="c kicker muted" style="top:170px">since</div>
  <div class="c disp" style="top:230px;font-size:170px"><span class="mask"><span class="d1">JUNE 1, 2026</span></span></div>
  <div class="c disp g" style="top:460px;font-size:120px;font-stretch:100%"><span class="mask"><span class="d2">GitHub AI Credits</span></span></div>
  <div class="c mono muted d3" style="top:660px;font-size:36px">1 credit = $0.01 · metered on tokens at each model's API rate</div>`,
 (q,t)=>{up(t,q('.d1'));up(W('money','GitHub'),q('.d2'));fade(W('money','Credits'),q('.d3'))});

const PLANS=[['Pro','$10','/mo'],['Pro+','$39','/mo'],['Business','$19','/user/mo'],['Enterprise','$39','/user/mo']];
SHOT('money', W('money','Every'), W('money','single'), 'dark', `
  <div class="c kicker muted" style="top:150px">included monthly AI Credits</div>
  <div style="position:absolute;left:120px;right:120px;top:260px;display:flex;gap:28px">${PLANS.map(p=>`<div class="card pl" style="position:relative;flex:1;text-align:center;padding:40px 10px"><div class="kicker">${p[0]}</div><div class="disp" style="font-size:120px;margin:22px 0">${p[1]}</div><div class="mono muted" style="font-size:24px">${p[2]} in credits</div></div>`).join('')}</div>`,
 (q,t)=>{pop(W('money','includes'),q('.pl'),.1)});

// fuel gauge: pool
const gaugeSVG=(cap)=>`<svg style="position:absolute;left:560px;top:60px" width="800" height="520" viewBox="-400 -420 800 520">
  <path class="gauge-arc" stroke="#30363D" d="M-320,0 A320,320 0 0,1 320,0"/>
  <path class="gauge-arc gf" pathLength="1" stroke-dasharray="1" stroke="#3FB950" d="M-320,0 A320,320 0 0,1 320,0"/>
  ${cap?`<g class="cap"><line x1="0" y1="-270" x2="0" y2="-380" stroke="#F85149" stroke-width="12" transform="rotate(54)"/><text x="0" y="-395" transform="rotate(54)" text-anchor="middle" font-family="Monaspace Neon" font-weight="700" font-size="30" fill="#F85149">CAP</text></g>`:''}
  <g class="ndl"><line x1="0" y1="0" x2="0" y2="-280" stroke="#F0F6FC" stroke-width="10" stroke-linecap="round"/><circle r="22" fill="#F0F6FC"/></g>
  <text x="-320" y="60" text-anchor="middle" font-family="Monaspace Neon" font-size="30" fill="#8B949E">E</text><text x="320" y="60" text-anchor="middle" font-family="Monaspace Neon" font-size="30" fill="#8B949E">F</text></svg>`;
SHOT('money', W('money','single'), W('money','with'), 'dark', gaugeSVG(false)+`
  ${['model A','model B','model C','Auto'].map((m,i)=>`<div class="lab md" style="position:absolute;left:${220+i*420}px;top:730px;font-size:30px;padding:10px 26px;color:#A371F7">${m} →</div>`).join('')}
  <div class="c disp" style="top:610px;font-size:60px">one credit pool · all models</div>`,
 (q,t)=>{tl.fromTo(q('.gf'),{strokeDashoffset:1},{strokeDashoffset:0,duration:.9,ease:'power2.out',immediateRender:false},t);tl.fromTo(q('.ndl'),{rotation:-90,svgOrigin:'0 0'},{rotation:90,duration:.9,ease:'power2.out',immediateRender:false},t);pop(W('money','pool'),q('.md'),.08);cue(t,'riser_s',{d:.9})});

SHOT('money', W('money','with'), W('money','Completions'), 'dark', gaugeSVG(true)+`
  <div class="c disp" style="top:600px;font-size:70px">budgets & hard caps</div>
  <div style="position:absolute;left:0;right:0;top:700px;display:flex;justify-content:center;gap:26px">${['user','cost center','enterprise'].map(x=>`<span class="lab lv" style="font-size:32px;padding:10px 28px">${x}</span>`).join('')}</div>
  <div class="c mono muted pv" style="top:790px;font-size:28px;color:#D29922">+ a preview bill before it lands</div>`,
 (q,t,t1)=>{tl.fromTo(q('.gf'),{strokeDashoffset:0},{strokeDashoffset:.7,duration:t1-t-.2,ease:'none',immediateRender:false},t);tl.fromTo(q('.ndl'),{rotation:90,svgOrigin:'0 0'},{rotation:-36,duration:t1-t-.2,ease:'none',immediateRender:false},t);
  tl.fromTo(q('.cap'),{scale:3,opacity:0,svgOrigin:'0 0'},{scale:1,opacity:1,duration:.25,ease:'power4.in',immediateRender:false},W('money','caps'));cue(W('money','caps')+.25,'snap');
  pop(W('money','user'),q('.lv')[0]);pop(W('money','cost'),q('.lv')[1]);pop(W('money','enterprise'),q('.lv')[2]);fade(W('money','enterprise')+.4,q('.pv'))});

SHOT('money', W('money','Completions'), L('honest')-.05, 'green', `
  <div class="c kicker" style="top:220px">code completions + Next Edit Suggestions</div>
  <div class="c disp" style="top:320px;font-size:300px"><span class="z0">0</span><span class="serif" style="font-size:120px;font-weight:400"> credits</span></div>`,
 (q,t)=>slam(W('money','burn'),q('.z0')));

/* ============ 10b HONEST ============ */
SHOT('honest', L('honest')-.05, W('honest','Devs'), 'black', `
  <div class="c kicker muted" style="top:200px">fine print, said out loud</div>
  <div class="c disp" style="top:300px;font-size:130px"><span class="mask"><span class="h1">still tokens underneath.</span></span></div>
  <div class="c mono g" style="top:560px;font-size:64px">tokens: <span class="tk">0</span></div>`,
 (q,t,t1)=>{up(W('honest','still'),q('.h1'));count(t,q('.tk')[0],0,48213,t1-t,v=>Math.round(v).toLocaleString('en-US'));cue(t,'keys',{d:t1-t})});

SHOT('honest', W('honest','Devs'), W('honest','But'), 'dark', `
  <div class="card" style="left:360px;top:190px;width:1200px"><div class="mono muted" style="font-size:24px">github.com/orgs/community/discussions/192948</div>
   <div style="font-size:48px;font-weight:800;margin:18px 0">GitHub Copilot is moving to usage-based billing</div>
   <div style="display:flex;gap:30px;font-size:60px;font-weight:800"><span>👎 <span class="n1">0</span></span><span class="muted">👍 24</span></div></div>
  <div class="c mono muted" style="top:620px;font-size:24px">reactions on the announcement post, as fetched 2026-09-29</div>
  <div class="sticker" style="left:1180px;top:650px;background:#F85149;color:#fff">devs were… loud</div>`,
 (q,t)=>{count(t,q('.n1')[0],0,958,.6);sticker(W('honest','loud'),q('.sticker')[0],-5)});

SHOT('honest', W('honest','But'), BREAK0, 'white', `
  <div class="c disp" style="top:250px;font-size:220px"><span class="s1">SEE IT.</span></div>
  <div class="c disp" style="top:500px;font-size:220px;color:#8250DF"><span class="s2">CAP IT.</span></div>`,
 (q,t)=>{slam(W('honest','see'),q('.s1'));slam(W('honest','cap'),q('.s2'))});

/* ============ 11 SCOREBOARD ============ */
SHOT('score', BREAK0, W('score','Tab'), 'black', `
  <div class="c mono" style="top:470px;font-size:60px"><span class="g">&gt;</span> <span class="vd"></span></div>`,
 (q,t,t1)=>type(t+.15,q('.vd')[0],'git diff --verdict',Math.min(.7,t1-t-.2)));

const ROWS=[['Context switching','5+ apps & tabs','one My Work view','[1]'],['Parallel agents','branch juggling','worktree per session','[1]'],['CI babysitting','you, refreshing','Agent Merge','[1][2]'],['Cloud / Azure visibility','another portal','ADO + community canvases','[4][5]'],['Spend control','hope','credits · budgets · caps','[3]']];
const scoreHTML=`
  <div style="position:absolute;left:100px;right:100px;top:110px;display:grid;grid-template-columns:1fr 1fr 1.15fr .2fr;font-size:40px">
   <div></div><div class="hd1 disp r" style="font-size:38px;padding:10px 0;white-space:nowrap">TAB-HOPPING STACK</div><div class="hd2 disp p" style="font-size:38px;padding:10px 0;white-space:nowrap">COPILOT APP</div><div></div>
   ${ROWS.map((r,i)=>`<div class="sr sr${i}" style="display:contents"><div style="padding:22px 0;border-top:1.5px solid #30363D;font-weight:800">${r[0]}</div><div style="padding:22px 0;border-top:1.5px solid #30363D" class="muted">✗ ${r[1]}</div><div style="padding:22px 0;border-top:1.5px solid #30363D" class="g">✓ ${r[2]}</div><div style="padding:22px 0;border-top:1.5px solid #30363D;font-size:20px" class="mono muted">${r[3]}</div></div>`).join('')}
  </div>`;
SHOT('score', W('score','Tab'), W('score','Context'), 'dark', scoreHTML,
 (q,t)=>{slam(t,q('.hd1'));slam(W('score','Copilot'),q('.hd2'));tl.set(q('.sr > div'),{opacity:0},t)});
SHOT('score', W('score','Context'), L('cta')-.05, 'dark', scoreHTML+`<!--NOJUMP--><div class="c mono muted" style="top:770px;font-size:20px">sources [1]–[5] listed in the README · agent features are technical preview</div>`,
 (q,t)=>{['Context','parallel','CI','cloud','spend'].forEach((w,i)=>{const ti=Math.max(t+i*.05,W('score',w));tl.set(q('.sr'+i+' > div'),{opacity:0},t);tl.fromTo(q('.sr'+i+' > div'),{opacity:0,x:-40},{opacity:1,x:0,duration:.3,stagger:.06,ease:'power3.out',immediateRender:false},ti);cue(ti,'ding',{n:i})})});

/* ============ 12 CTA ============ */
SHOT('cta', L('cta')-.05, W('cta','Many'), 'dark', `<div class="c disp" style="top:360px;font-size:280px"><span class="k">ONE APP.</span></div>`, (q,t)=>slam(W('cta','One'),q('.k')));
SHOT('cta', W('cta','Many'), W('cta','Ship'), 'purple', `<div class="c disp" style="top:360px;font-size:250px"><span class="k">MANY AGENTS.</span></div>`, (q,t)=>slam(t,q('.k')));
SHOT('cta', W('cta','Ship'), W('cta','It\'s'), 'green', `<div class="c disp" style="top:330px;font-size:320px"><span class="k">SHIP IT.</span></div>`, (q,t)=>{slam(t,q('.k'));flash(t,'#fff',.6);cue(t,'boom')});
SHOT('cta', W('cta','It\'s'), END, 'dark', `
  <div class="c ec" style="top:130px"><span style="display:inline-block;width:150px;height:150px">${ICON['mark-github'].replace('<svg','<svg style="width:150px;height:150px;fill:#fff"')}</span></div>
  <div class="c disp e1" style="top:320px;font-size:84px;white-space:nowrap">ONE APP. MANY AGENTS. <span class="g">SHIP IT.</span></div>
  <div class="c e2" style="top:450px"><span class="lab a" style="font-size:32px;padding:10px 28px">GitHub Copilot app · technical preview — check your plan</span></div>
  <div class="c mono muted e4" style="top:570px;font-size:24px">github.blog · docs.github.com/copilot · sources in README</div>
  <div class="c hub e3" style="top:660px;font-size:44px;letter-spacing:.06em">BY YUVAL AVIDANI · <span class="p">YUV.AI</span></div>`,
 (q,t)=>{pop(t,q('.ec'));up(t+.1,q('.e1'));fade(W('cta','technical'),q('.e2'));fade(W('cta','check'),q('.e4'));pop(LE('cta')+.2,q('.e3'))});
