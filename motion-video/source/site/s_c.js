// ============ S6 RULES 53.5 -> 59.5
scene('rules',53.5,59.5,C.tom,C.ink,({tl,z1,z2,z3})=>{
  const three=big(z1,'3',{s:1500,c:C.ink,top:-60,op:.13,left:280,w:800});
  const rl=big(z3,'RULES',{s:150,c:C.cream,top:100,left:60,w:600,align:'left',sh:`6px 6px 0 ${C.ink}`,rot:-3});
  const rows=[
    ['EASE EVERYTHING','איזינג לכל תנועה','activity'],
    ['ONE HERO PER BEAT','גיבור אחד בכל רגע','crosshair'],
    ['KEEP THE RHYTHM','קצב קבוע — חיתוך כל ~2 שניות','timer']];
  const els=rows.map((r,i)=>{
    const y=290+i*300;
    const row=$('div','card',null,z2,{position:'absolute',left:60,top:y,width:960,height:250,background:C.cream,display:'flex',overflow:'hidden'});
    const nb=$('div','A',String(i+1),row,{width:200,height:'100%',background:C.ink,color:C.sun,fontSize:'230px',lineHeight:'250px',textAlign:'center'});
    const tx=$('div','',null,row,{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'0 10px'});
    $('div','A',r[0],tx,{fontSize:'74px',color:C.ink});
    $('div','HT',r[1],tx,{fontSize:'42px',color:C.ink,marginTop:'6px'});
    const ic=$('div','',ico(r[2],90,C.tom,2.4),row,{width:150,display:'flex',alignItems:'center',justifyContent:'center'});
    return {row,ic,nb};
  });
  slam(tl,rl,.05,{st:.05});
  els.forEach((e,i)=>{
    tl.fromTo(e.row,{xPercent:i%2?120:-120,rotate:i%2?4:-4},{xPercent:0,rotate:0,duration:.7,ease:'expo.out'},.4+i*.5);
    tl.fromTo(e.ic.querySelector('svg'),{scale:0,rotate:-90},{scale:1,rotate:0,duration:.5,ease:'back.out(2.5)'},.9+i*.5);
  });
  tl.fromTo(els[2].ic.querySelector('svg'),{y:0},{y:-10,duration:.25,yoyo:true,repeat:9,ease:'sine.inOut'},1.8);
  tl.to(three,{rotate:6,duration:6,ease:'none'},0);
});
cue(53.7,59.3,'שלושה חוקים: <b>איזינג</b>, <b>גיבור אחד</b>, <b>קצב</b>.','Three rules: <b>ease</b> it, <b>one hero</b>, <b>keep rhythm</b>.',C.sun);

// ============ S7 BRIDGE 59.5 -> 64.5
scene('bridge',59.5,64.5,C.ink,C.cream,({tl,z1,z2,z3})=>{
  const pr=big(z1,'PROMPT',{s:380,c:C.cream,top:120,op:.1});
  const hp=big(z1,'פרומפט',{cls:'H',s:250,c:C.tom,top:900,split:false,op:.9});
  const cl=$('div','',brand('claude',560,'#D97757'),z2,{position:'absolute',left:260,top:330,width:560,height:560});
  const ring=$('div','',null,z2,{position:'absolute',left:190,top:260,width:700,height:700,borderRadius:'50%',border:`3px dashed ${C.cream}`,opacity:.35});
  const t1=$('div','',null,z3,{position:'absolute',left:70,top:250,padding:'6px 26px',background:C.sun,color:C.ink,border:`5px solid ${C.cream}`,transform:'rotate(-6deg)',boxShadow:`8px 8px 0 ${C.tom}`});
  t1.innerHTML=`<span class="A" style="font-size:84px">OPUS 5.5</span>`;
  const t2=$('div','',null,z3,{position:'absolute',left:560,top:830,padding:'6px 26px',background:C.cream,color:C.ink,border:`5px solid ${C.ink}`,transform:'rotate(5deg)',boxShadow:`8px 8px 0 ${C.cob}`});
  t2.innerHTML=`<span class="A" style="font-size:84px">SONNET 5.5</span>`;
  const an=$('div','',brand('anthropic',60,C.cream),z3,{position:'absolute',left:60,top:1060,opacity:.9});
  const anl=$('div','M','BY ANTHROPIC',z3,{position:'absolute',left:135,top:1076,fontSize:'24px',fontWeight:700,letterSpacing:'.14em'});
  slam(tl,pr,.05,{st:.06,d:.9});
  tl.fromTo(hp,{autoAlpha:0,x:-200},{autoAlpha:.9,x:0,duration:.7},.3);
  tl.fromTo(cl,{scale:0,rotate:-270},{scale:1,rotate:0,duration:1.0,ease:'back.out(1.4)'},.3);
  tl.to(cl,{rotate:90,duration:4.2,ease:'sine.inOut'},1.3);
  tl.fromTo(ring,{scale:.5,autoAlpha:0},{scale:1,autoAlpha:.35,duration:.8},.6).to(ring,{rotate:-90,duration:4.5,ease:'none'},.6);
  tl.fromTo(t1,{x:-600,autoAlpha:0},{x:0,autoAlpha:1,duration:.6,ease:'expo.out'},1.3);
  tl.fromTo(t2,{x:600,autoAlpha:0},{x:0,autoAlpha:1,duration:.6,ease:'expo.out'},1.55);
  tl.fromTo([an,anl],{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.5,stagger:.1},2.1);
});
cue(59.7,64.3,'עכשיו הקטע החשוב: איך מבקשים את זה מ<b>קלוד</b>.','Now the real trick: how to ask <b>Claude</b> for it.',C.tom);

// ============ S8 PROMPT 64.5 -> 90.5
const SEC=[
 {tag:'FORMAT',he:'פורמט',ico:'video',col:C.sun,lines:['1080x1440 · 30fps · ~60s · HTML + GSAP','one paused master timeline (seekable)'],hc:'<b>פורמט</b> — מידות, FPS וטכנולוגיה.',ec:'<b>Format</b> — size, fps, tech stack.'},
 {tag:'STYLE',he:'סגנון',ico:'type',col:C.tom,lines:['retro magazine · Gen Z pace','cream #F2EADB · ink #15120F · tomato #FF4B2B','Anton (EN) + Assistant thin/bold (HE)'],hc:'<b>סגנון</b> — צבעים, גופנים ווייב.',ec:'<b>Style</b> — colors, fonts, vibe.'},
 {tag:'STORYBOARD',he:'סטוריבורד',ico:'film',col:C.cob,lines:['0-4s   hook: giant type behind an object','4-15s  define: DESIGN + TIME = MOTION','15-22s keyframes on a real timeline UI'],hc:'<b>סטוריבורד</b> — סצנה אחר סצנה, עם שניות.',ec:'<b>Storyboard</b> — scene by scene, with seconds.'},
 {tag:'MOTION',he:'תנועה',ico:'activity',col:C.lil,lines:['entries: power3.out · pops: back.out(1.7)','stagger 0.06 · never linear'],hc:'<b>תנועה</b> — שמות איזינג ומספרים, לא "שיהיה חלק".',ec:'<b>Motion</b> — named eases &amp; numbers, not "make it smooth".'},
 {tag:'RHYTHM',he:'קצב',ico:'music',col:C.sun,lines:['a cut every ~2s · one hero per beat'],hc:'<b>קצב</b> — חיתוך כל ~2 שניות.',ec:'<b>Rhythm</b> — a cut every ~2 seconds.'},
 {tag:'CHECK',he:'בדיקה',ico:'check',col:C.tom,lines:['render frames, review them, fix','HE + EN captions, real logos'],hc:'<b>בדיקה</b> — מרנדרים פריימים, בודקים ומתקנים.',ec:'<b>Check</b> — render frames, review, then fix.'},
];
scene('prompt',64.5,90.5,C.cream,C.ink,({tl,z1,z2,z3})=>{
  const bgw=big(z1,'PROMPT',{s:420,c:C.ink,top:1060,op:.09});
  const hpw=big(z1,'פרומפט',{cls:'H',s:300,c:C.tom,top:850,split:false,op:.0});
  // terminal
  const term=$('div','card',null,z2,{position:'absolute',left:60,top:130,width:960,height:850,background:C.ink,borderColor:C.ink,boxShadow:`14px 14px 0 ${C.tom}`,overflow:'hidden'});
  const bar=$('div','',null,term,{position:'absolute',left:0,top:0,width:'100%',height:52,background:'#2a251f',display:'flex',alignItems:'center',gap:'10px',padding:'0 20px'});
  [C.tom,C.sun,C.lil].forEach(c=>$('div','',null,bar,{width:16,height:16,background:c,borderRadius:'50%'}));
  $('div','M','claude — ~/motion-explainer',bar,{color:C.cream,fontSize:'18px',opacity:.6,marginLeft:'14px',letterSpacing:'.06em'});
  const body=$('div','',null,term,{position:'absolute',left:28,top:74,right:28,bottom:20,color:C.cream});
  // --- bad prompt (0 -> 4)
  const bad=$('div','',null,body,{});
  const b1=typer(tl,bad,[['> ',C.tom,700],['make me a cool animation about motion graphics',C.cream,400]],.5,42,{whiteSpace:'pre-wrap'});
  const bo=$('div','M',null,bad,{fontSize:'24px',lineHeight:'33px',marginTop:'20px',color:'#8d857a',opacity:0});
  bo.innerHTML=`  ...generating\n  ...random gradient blob spins\n  ...generic "cool" text fades in\n  <span style="color:${C.tom};font-weight:700">done. it looks like every other AI video.</span>`;
  const stB=$('div','',null,z3,{position:'absolute',left:610,top:640,padding:'6px 22px',background:C.tom,color:C.cream,border:`5px solid ${C.ink}`,transform:'rotate(6deg)',boxShadow:`7px 7px 0 ${C.ink}`,display:'flex',alignItems:'center',gap:'12px'});
  stB.innerHTML=ico('x',56,C.cream,3)+`<span class="A" style="font-size:66px">GENERIC IN, GENERIC OUT</span>`;stB.style.width='auto';stB.style.left='150px';stB.style.top='700px';
  tl.fromTo(term,{y:300,autoAlpha:0,rotate:-2},{y:0,autoAlpha:1,rotate:0,duration:.7,ease:'expo.out'},.0);
  tl.fromTo(bo,{autoAlpha:0},{autoAlpha:1,duration:.4},2.3);
  tl.fromTo(stB,{scale:0,rotate:-20},{scale:1,rotate:-4,duration:.5,ease:'back.out(2.5)'},2.7);
  tl.to([bad,stB],{autoAlpha:0,duration:.2},3.85);
  // --- good prompt (4 -> 22)
  const good=$('div','',null,body,{});
  const y0=4;
  const hd=typer(tl,good,[['> ',C.tom,700],['Build a motion-graphics explainer video.',C.cream,700]],y0+.1,55);
  $('div','',null,good,{height:'35px'});
  const stickers=[],dots=[];
  const dotRow=$('div','',null,z3,{position:'absolute',left:60,top:1040,width:960,display:'flex',justifyContent:'space-between'});
  SEC.forEach((s,i)=>{
    const t=y0+.5+i*2.9;
    const ln=typer(tl,good,[[s.tag,s.col,700]],t,45);
    const kids=[];
    let tt=t+.25;
    s.lines.forEach(l=>{const r=typer(tl,good,[['  '+l,C.cream,400]],tt,58);tt=r.end+.02;});
    // sticker at right edge of terminal, aligned near its heading
    const st=$('div','',null,z3,{position:'absolute',left:0,top:0,padding:'2px 16px 2px 12px',background:s.col,color:C.ink,border:`5px solid ${C.ink}`,display:'flex',alignItems:'center',gap:'10px',boxShadow:`6px 6px 0 ${C.ink}`,opacity:0});
    st.innerHTML=ico(s.ico,40,C.ink,2.6)+`<span class="A" style="font-size:38px">${i+1}. ${s.tag}</span>`;
    stickers.push([st,t,i]);
    const d=$('div','',null,dotRow,{width:140,height:78,border:`5px solid ${C.ink}`,background:C.cream,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:`6px 6px 0 ${C.ink}`,opacity:.3});
    d.innerHTML=ico(s.ico,38,C.ink,2.4);dots.push([d,s,t]);
  });
  // heading fade-in
  // compute sticker line positions after layout: lines index
  let lineIdx=2;const posY=[];
  SEC.forEach(s=>{posY.push(lineIdx);lineIdx+=1+s.lines.length});
  stickers.forEach(([st,t,i])=>{
    const y=130+74+posY[i]*35-6;
    st.style.top=y+'px';st.style.left='auto';st.style.right='16px';
    tl.fromTo(st,{scale:0,rotate:i%2?8:-8,opacity:0},{scale:1,opacity:1,rotate:i%2?2.5:-2.5,duration:.5,ease:'back.out(2.4)'},t-.05);
  });
  dots.forEach(([d,s,t],i)=>{
    tl.fromTo(d,{opacity:.3,background:C.cream,y:0},{opacity:1,background:s.col,y:-10,duration:.3,ease:'back.out(3)'},t);
    if(i<5)tl.to(d,{y:0,duration:.25},t+2.7);
  });
  // swap bad->good containers
  tl.set(good,{display:'none'},0).set(good,{display:'block'},3.95).set(bad,{display:'none'},4.05);
  // ---- result (22 -> 26)
  const R=$('div','',null,z2,{position:'absolute',left:0,top:0,width:W,height:H,opacity:0});
  const ph=$('div','',null,R,{position:'absolute',left:250,top:170,width:580,height:773,border:`10px solid ${C.ink}`,background:C.cob,boxShadow:`16px 16px 0 ${C.tom}`,overflow:'hidden',borderRadius:36});
  const words=['MOTION','TIME','EASE','MOVE'],bgs=[C.cob,C.tom,C.sun,C.ink],fgs=[C.cream,C.ink,C.ink,C.cream];
  const fr=words.map((w,i)=>$('div','A',w,ph,{position:'absolute',inset:0,background:bgs[i],color:fgs[i],display:'flex',alignItems:'center',justifyContent:'center',fontSize:'170px',opacity:0}));
  const info=$('div','',null,R,{position:'absolute',left:60,top:990,width:960,height:180,background:C.ink,color:C.cream,padding:'22px 28px',border:`5px solid ${C.ink}`,boxShadow:`10px 10px 0 ${C.sun}`});
  const l1=$('div','M','$ node render.mjs --fps 30',info,{fontSize:'26px',fontWeight:700});
  const pb=$('div','',null,info,{position:'absolute',left:28,top:92,width:900,height:22,background:'#3a352f'});
  const pf=$('div','',null,pb,{width:'100%',height:'100%',background:C.tom,transformOrigin:'0 50%'});
  const fc=$('div','M','frame 0000 / 3090',info,{position:'absolute',left:28,top:128,fontSize:'24px',color:C.sun,fontWeight:700});
  const ok=$('div','M','',info,{position:'absolute',right:28,top:128,fontSize:'24px',color:C.cream});ok.textContent='out: explainer.mp4  ✓';
  const st2=$('div','',null,z3,{position:'absolute',left:610,top:150,padding:'4px 20px',background:C.sun,border:`5px solid ${C.ink}`,transform:'rotate(6deg)',boxShadow:`7px 7px 0 ${C.ink}`,opacity:0});
  st2.innerHTML=`<span class="A" style="font-size:60px">3:4 · 30FPS</span>`;
  const T0=22.05;
  tl.to(term,{x:-1200,rotate:-6,duration:.5,ease:'power3.in'},T0-.05);
  tl.to([dotRow,bgw],{autoAlpha:0,duration:.25},T0);
  stickers.forEach(([st])=>tl.to(st,{x:-1300,duration:.5,ease:'power3.in'},T0-.05));
  tl.fromTo(R,{opacity:0,y:120},{opacity:1,y:0,duration:.6,ease:'expo.out'},T0+.2);
  const cnt={n:0};
  tl.fromTo(pf,{scaleX:0},{scaleX:1,duration:2.4,ease:'power1.inOut'},T0+.5);
  tl.fromTo(cnt,{n:0},{n:3090,duration:2.4,ease:'power1.inOut',onUpdate(){fc.textContent='frame '+String(Math.round(cnt.n)).padStart(4,'0')+' / 3090'}},T0+.5);
  fr.forEach((f,i)=>{tl.set(f,{opacity:1},T0+.4+i*.55).fromTo(f.children.length?f:f,{scale:1.25},{scale:1,duration:.4,ease:'expo.out'},T0+.4+i*.55);if(i<3)tl.set(f,{opacity:0},T0+.4+(i+1)*.55+.02);});
  tl.fromTo(ok,{autoAlpha:0},{autoAlpha:1,duration:.2},T0+2.9);
  tl.fromTo(st2,{scale:0,opacity:1},{scale:1,rotate:6,duration:.5,ease:'back.out(2.5)'},T0+1.4);
});
cue(64.7,68.4,'פרומפט גנרי = <b>תוצאה גנרית</b>.','A generic prompt = <b>a generic result</b>.',C.tom);
SEC.forEach((s,i)=>{const t=64.5+4+.5+i*2.9;cue(t+.05,t+2.85,s.hc,s.ec,[C.sun,C.tom,C.lil,C.lil,C.sun,C.tom][i])});
cue(86.7,90.3,'תוצאה: <b>וידאו מוכן</b> בפורמט הנכון, בפעם הראשונה.','Result: <b>a finished video</b>, right format, first try.',C.sun);
