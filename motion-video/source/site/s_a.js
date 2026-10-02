// ============ S0 HOOK 0 -> 4.5
scene('hook',0,4.5,C.cream,C.ink,({tl,z1,z2,z3})=>{
  $('div','',null,z1,{position:'absolute',right:-160,top:-140,width:760,height:760,backgroundImage:`radial-gradient(${C.tom} 30%,transparent 32%)`,backgroundSize:'28px 28px',
    webkitMaskImage:'radial-gradient(circle at 55% 45%,#000 0%,transparent 68%)',maskImage:'radial-gradient(circle at 55% 45%,#000 0%,transparent 68%)'});
  const he=big(z1,'מושן',{cls:'H',s:420,c:C.tom,top:110,split:false});
  const en=big(z1,'MOTION',{s:335,c:C.ink,top:445});
  const circ=$('div','',null,z2,{position:'absolute',left:190,top:640,width:700,height:700,borderRadius:'50%',background:C.cob,border:`8px solid ${C.ink}`,boxShadow:`14px 14px 0 ${C.ink}`});
  // orbit ring
  const ring=$('div','',null,z2,{position:'absolute',left:130,top:580,width:820,height:820,borderRadius:'50%',border:`3px dashed ${C.ink}`,opacity:.55});
  const gr=big(z3,'GRAPHICS',{s:262,c:C.sun,top:800,sh:`10px 10px 0 ${C.ink}`,rot:-4});
  const sub=big(z3,'מה זה בכלל?',{cls:'HT',s:104,c:C.cream,top:1085,split:false,mask:false});
  const q=$('div','',`<span class="A" style="font-size:210px;line-height:1">?</span>`,z3,{position:'absolute',left:800,top:650,width:230,height:230,borderRadius:'50%',background:C.sun,border:`7px solid ${C.ink}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`8px 8px 0 ${C.ink}`});
  const st=[0,1,2,3].map(i=>$('div','',ico('sparkles',54,C.ink,2.5),z3,{position:'absolute',left:[110,860,140,930][i],top:[520,1010,1000,830][i]}));
  slam(tl,en,.1,{st:.05});
  tl.fromTo(he,{x:260,autoAlpha:0},{x:0,autoAlpha:1,duration:.7,ease:'expo.out'},.25);
  tl.fromTo(circ,{scale:0},{scale:1,duration:.7,ease:'back.out(1.6)'},.45);
  tl.fromTo(ring,{scale:.4,autoAlpha:0},{scale:1,autoAlpha:.55,duration:.8,ease:'power3.out'},.6).to(ring,{rotate:120,duration:4,ease:'none'},.6);
  tl.fromTo(gr.querySelectorAll('.ch'),{xPercent:-140,rotate:-12,scale:1.5},{xPercent:0,rotate:0,scale:1,duration:.7,ease:'expo.out',stagger:.035},.9);
  tl.fromTo(q,{scale:0,rotate:-200},{scale:1,rotate:12,duration:.7,ease:'back.out(2)'},1.6);
  tl.fromTo(sub,{yPercent:120},{yPercent:0,duration:.7,ease:'expo.out'},2.0);
  tl.fromTo(st,{scale:0,rotate:-90},{scale:1,rotate:0,duration:.5,ease:'back.out(3)',stagger:.12},2.2);
  // depth drift (parallax) back slow, front fast
  tl.to(z1,{x:-22,duration:4.5,ease:'none'},0).to(z3,{x:26,duration:4.5,ease:'none'},0).to(circ,{y:-20,duration:4.5,ease:'sine.inOut'},0);
  tl.to(q,{rotate:32,duration:1.2,ease:'sine.inOut',yoyo:true,repeat:2},1.6);
});
cue(0.35,4.3,'רגע — מה זה בעצם <b>מושן גרפיקס</b>?','Wait — what even is <b>motion graphics</b>?',C.tom);

// ============ S1 DEFINITION 4.5 -> 15
scene('define',4.5,15,C.cob,C.cream,({tl,z1,z2,z3})=>{
  // ---- beat A: equation (0 -> 5)
  const A=$('div','layer',null,z2);
  const dz=big(z1,'DESIGN',{s:360,c:C.cream,top:130,op:.16});
  const th=big(z1,'תנועה',{cls:'H',s:400,c:C.tom,top:770,split:false,op:.95});
  const cardsY=470,cw=240,gap=92,x0=(W-(3*cw+2*gap))/2;
  const defs=[[C.cream,'pen-tool',C.ink,'DESIGN'],[C.sun,'clock',C.ink,'TIME'],[C.tom,'play',C.cream,'MOTION']];
  const cards=defs.map((d,i)=>{
    const c=$('div','card',ico(d[1],128,d[2],2.2),A,{position:'absolute',left:x0+i*(cw+gap),top:cardsY,width:cw,height:cw,background:d[0],display:'flex',alignItems:'center',justifyContent:'center'});
    const lab=$('div','A',d[3],A,{position:'absolute',left:x0+i*(cw+gap),top:cardsY+cw+34,width:cw,textAlign:'center',fontSize:'52px',color:C.cream});
    return {c,lab};
  });
  const ops=['+','='].map((s,i)=>$('div','A',s,A,{position:'absolute',left:x0+(i+1)*cw+i*gap+ (i?0:0),top:cardsY+cw/2-92,width:gap,textAlign:'center',fontSize:'190px',lineHeight:1,color:C.sun,marginLeft:i*0+'px'}));
  cards.forEach((o,i)=>{pop(tl,o.c,.35+i*.32,{ease:'back.out(2)'});rise(tl,o.lab,.55+i*.32,{y:30})});
  ops.forEach((o,i)=>tl.fromTo(o,{scale:0,rotate:180},{scale:1,rotate:0,duration:.5,ease:'back.out(3)'},.55+i*.32+.1));
  tl.to(cards[1].c.querySelector('svg'),{rotate:360,duration:1.4,ease:'power2.inOut',transformOrigin:'50% 50%'},1.6);
  tl.fromTo(cards[2].c.querySelector('svg'),{scale:1},{scale:1.25,duration:.4,yoyo:true,repeat:3,ease:'sine.inOut'},1.8);
  tl.fromTo(cards[0].c.querySelector('svg'),{rotate:0},{rotate:-18,duration:.35,yoyo:true,repeat:3,ease:'sine.inOut'},1.7);
  const front=big(z3,'TIME',{s:250,c:C.sun,top:960,sh:`8px 8px 0 ${C.ink}`,rot:-3});
  slam(tl,front,1.0,{st:.05});
  // exit beat A
  tl.to(A,{scale:.6,autoAlpha:0,duration:.35,ease:'power3.in'},4.55);
  tl.to([dz,th,front],{autoAlpha:0,yPercent:-30,duration:.3,ease:'power3.in'},4.55);
  // ---- beat B: examples (5 -> 10.5)
  const B=$('div','layer',null,z2,{opacity:0});
  const tiles=[
    ['LOGO STING',C.cream,C.ink],['EXPLAINER',C.sun,C.ink],['UI ANIMATION',C.lil,C.ink],['TITLES',C.tom,C.ink]];
  const tx=[60,570],ty=[180,600],tw=450,th_=390;
  const T=tiles.map((t,i)=>{
    const d=$('div','card',null,B,{position:'absolute',left:tx[i%2],top:ty[(i/2)|0],width:tw,height:th_,background:t[1],overflow:'hidden'});
    $('div','tag',t[0],d,{position:'absolute',left:18,top:14,color:C.ink,zIndex:5});
    return d;
  });
  // 1 logo sting
  const l1=$('div','',null,T[0],{position:'absolute',left:0,top:0,width:'100%',height:'100%'});
  const c1=$('div','',null,l1,{position:'absolute',left:145,top:95,width:160,height:160,borderRadius:'50%',background:C.tom,border:`6px solid ${C.ink}`});
  const r1=$('div','',null,l1,{position:'absolute',left:110,top:60,width:230,height:230,borderRadius:'50%',border:`4px solid ${C.ink}`});
  const w1=$('div','A',letters('YUV.AI'),l1,{position:'absolute',left:0,width:'100%',textAlign:'center',top:288,fontSize:'70px',color:C.ink});
  loop(tl,5.4,3,l=>{
    l.fromTo(c1,{scale:0},{scale:1,duration:.5,ease:'back.out(2.4)'},0).fromTo(r1,{scale:.5,autoAlpha:1},{scale:1.5,autoAlpha:0,duration:.7,ease:'power2.out'},.25)
     .fromTo(w1.querySelectorAll('.ch'),{yPercent:120},{yPercent:0,duration:.45,ease:'expo.out',stagger:.05},.3).to(l1,{autoAlpha:0,duration:.2},1.55).set(l1,{autoAlpha:1},1.75);
  });
  // 2 chart
  const bars=[.35,.55,.42,.8,.65].map((h,i)=>$('div','',null,T[1],{position:'absolute',left:50+i*76,bottom:44,width:56,height:h*280+'px',background:i==3?C.tom:C.ink,border:`4px solid ${C.ink}`,transformOrigin:'50% 100%'}));
  const ln=$('div','',`<svg width="450" height="390" viewBox="0 0 450 390" style="position:absolute;left:0;top:0"><path d="M60 300 L136 230 L212 260 L288 130 L364 175" fill="none" stroke="${C.cob}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" class="ln"/></svg>`,T[1]);
  loop(tl,5.5,3,l=>{
    l.fromTo(bars,{scaleY:0},{scaleY:1,duration:.7,ease:'back.out(1.5)',stagger:.08},0).fromTo(ln.querySelector('.ln'),{strokeDashoffset:1},{strokeDashoffset:0,duration:.8,ease:'power2.inOut'},.4)
     .to([bars,ln],{autoAlpha:0,duration:.2},1.55).set([bars,ln],{autoAlpha:1},1.75);
  });
  // 3 UI
  const rows=[0,1,2].map(i=>$('div','',null,T[2],{position:'absolute',left:30,top:70+i*100,width:390,height:76,background:C.cream,border:`4px solid ${C.ink}`}));
  const knobs=rows.map((r,i)=>{
    $('div','',null,r,{position:'absolute',left:20,top:22,width:140+i*40,height:14,background:C.ink});
    $('div','',null,r,{position:'absolute',left:20,top:44,width:90,height:8,background:C.ink,opacity:.4});
    const tg=$('div','',null,r,{position:'absolute',right:16,top:16,width:76,height:36,background:C.ink,borderRadius:18});
    return $('div','',null,tg,{position:'absolute',left:4,top:4,width:28,height:28,borderRadius:'50%',background:C.cream});
  });
  loop(tl,5.6,3,l=>{
    l.fromTo(rows,{x:-460},{x:0,duration:.55,ease:'expo.out',stagger:.1},0).to(knobs,{x:40,duration:.3,ease:'back.out(3)',stagger:.14},.7).to(knobs,{background:C.tom,duration:.1,stagger:.14},.7)
     .to(rows,{x:460,duration:.35,ease:'power3.in',stagger:.05},1.5).set(knobs,{x:0,background:C.cream},1.95);
  });
  // 4 lower third
  const bg4=$('div','',null,T[3],{position:'absolute',left:0,top:0,width:'100%',height:'100%'});
  $('div','',null,bg4,{position:'absolute',left:0,top:70,width:'100%',height:250,backgroundImage:`repeating-linear-gradient(135deg,transparent 0 22px,rgba(21,18,15,.14) 22px 26px)`});
  const lt=$('div','',null,T[3],{position:'absolute',left:26,top:230,width:340,height:100,background:C.ink,overflow:'hidden',color:C.cream});
  const lt1=$('div','A','MOTION LAB',lt,{position:'absolute',left:18,top:8,fontSize:'52px'});
  const lt2=$('div','',null,lt,{position:'absolute',left:18,top:66,fontFamily:'Assistant',fontWeight:200,fontSize:'22px',letterSpacing:'.14em'});lt2.textContent='EPISODE 01 / LIVE';
  const bar4=$('div','',null,T[3],{position:'absolute',left:26,top:216,width:340,height:10,background:C.sun,transformOrigin:'0 50%'});
  loop(tl,5.7,3,l=>{
    l.fromTo(bar4,{scaleX:0},{scaleX:1,duration:.4,ease:'expo.out'},0).fromTo(lt,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.5,ease:'expo.out'},.15)
     .fromTo([lt1,lt2],{xPercent:-30},{xPercent:0,duration:.5,ease:'power3.out',stagger:.08},.2).to([bar4,lt],{xPercent:110,duration:.4,ease:'power3.in'},1.5).set([bar4,lt],{xPercent:0},1.95);
  });
  tl.fromTo(B,{opacity:0},{opacity:1,duration:.01},4.85);
  tl.fromTo(T,{y:120,autoAlpha:0,rotate:(i)=>[-3,3,3,-3][i]},{y:0,autoAlpha:1,rotate:0,duration:.6,ease:'back.out(1.6)',stagger:.1},4.9);
  // tools row (real logos)
  const logos=['figma','blender','davinciresolve','greensock','framer','rive','lottiefiles'];
  const row=$('div','',null,z3,{position:'absolute',left:0,top:1060,width:W,display:'flex',justifyContent:'center',gap:'34px',alignItems:'center'});
  const lg=logos.map(k=>$('div','',brand(k,68,C.cream),row,{}));
  tl.fromTo(lg,{scale:0,rotate:-60,autoAlpha:0},{scale:1,rotate:0,autoAlpha:1,duration:.5,ease:'back.out(2.4)',stagger:.08},5.6);
  tl.to(lg,{y:-8,duration:.5,ease:'sine.inOut',yoyo:true,repeat:5,stagger:.09},6.4);
});
cue(4.7,9.3,'מושן גרפיקס = <b>עיצוב גרפי</b> + <b>זמן</b>.','Motion graphics = <b>graphic design</b> + <b>time</b>.',C.sun);
cue(9.7,14.8,'לא סרט ולא צילום — <b>צורות, טקסט ואייקונים</b> שזזים.','Not film. Not footage. <b>Shapes, type &amp; icons</b> that move.',C.sun);

// ============ S2 KEYFRAMES 15 -> 22.5
scene('keyframes',15,22.5,C.cream,C.ink,({tl,z1,z2,z3})=>{
  const kf=big(z1,'KEYFRAMES',{s:236,c:C.ink,top:100});
  const hk=big(z1,'קיפריימים',{cls:'HT',s:250,c:C.tom,top:300,split:false,rot:-3});
  // stage box
  const sb=$('div','card',null,z2,{position:'absolute',left:60,top:520,width:960,height:290,background:'#FFF7E6',overflow:'hidden',
    backgroundImage:`linear-gradient(rgba(21,18,15,.09) 2px,transparent 2px),linear-gradient(90deg,rgba(21,18,15,.09) 2px,transparent 2px)`,backgroundSize:'48px 48px'});
  const ax=90,bx=780,sq=100,cy=95;
  const mk=(x,l)=>{const m=$('div','',null,sb,{position:'absolute',left:x-8,top:cy+sq/2-8,width:16,height:16,borderRadius:'50%',background:C.ink});$('div','A',l,sb,{position:'absolute',left:x-14,top:cy+sq+34,fontSize:'42px'})};
  mk(ax+sq/2,'A');mk(bx+sq/2,'B');
  const ghosts=[];const N=9;
  for(let i=1;i<=N;i++)ghosts.push($('div','',null,sb,{position:'absolute',left:ax,top:cy,width:sq,height:sq,background:C.tom,opacity:0,border:`4px solid ${C.ink}`}));
  const box=$('div','',null,sb,{position:'absolute',left:ax,top:cy,width:sq,height:sq,background:C.tom,border:`5px solid ${C.ink}`,zIndex:5});
  // timeline panel
  const tp=$('div','card',null,z2,{position:'absolute',left:60,top:870,width:960,height:290,background:C.ink,borderColor:C.ink,boxShadow:`10px 10px 0 ${C.tom}`,overflow:'hidden'});
  const tx0=230,tx1=900,dur=1.6;
  const ticks=[0,.5,1,1.5,2];
  ticks.forEach(t=>{const x=tx0+(t/2)*(tx1-tx0)*1.0;$('div','',null,tp,{position:'absolute',left:x-60+60,top:46,width:2,height:20,background:C.cream,opacity:.6});$('div','M',t.toFixed(1)+'s',tp,{position:'absolute',left:x-10,top:16,fontSize:'18px',color:C.cream,opacity:.7})});
  const tracks=['POSITION','SCALE'];
  tracks.forEach((n,i)=>{$('div','tag',n,tp,{position:'absolute',left:24,top:104+i*80,color:C.cream,fontSize:'17px'});$('div','',null,tp,{position:'absolute',left:tx0,top:118+i*80,width:tx1-tx0+10,height:3,background:C.cream,opacity:.25})});
  const dpos=t=>tx0+(t/2)*(tx1-tx0);
  const dias=[];
  tracks.forEach((n,i)=>[0,dur].forEach(t=>dias.push($('div','',null,tp,{position:'absolute',left:dpos(t)-16,top:104+i*80,width:32,height:32,background:C.sun,transform:'rotate(45deg)',border:`3px solid ${C.cream}`}))));
  const ph=$('div','',null,tp,{position:'absolute',left:tx0-1,top:10,width:4,height:262,background:C.tom});
  $('div','',null,ph,{position:'absolute',left:-8,top:-2,width:20,height:20,background:C.tom,borderRadius:'50% 50% 50% 0',transform:'rotate(-45deg)'});
  // front layer
  const ab=$('div','A','A — B',z3,{position:'absolute',left:60,top:1170-1210+ 1210,fontSize:'0px'});ab.remove();
  const ib=$('div','',null,z3,{position:'absolute',left:60,top:440,padding:'8px 20px',background:C.sun,border:`5px solid ${C.ink}`,transform:'rotate(-3deg)',boxShadow:`6px 6px 0 ${C.ink}`});
  ib.innerHTML=`<span class="A" style="font-size:44px">IN-BETWEENS — AUTO</span>`;
  const kfl=$('div','',null,z3,{position:'absolute',left:600,top:452,padding:'6px 16px',background:C.cob,color:C.cream,border:`4px solid ${C.ink}`,transform:'rotate(2deg)'});
  kfl.innerHTML=`<span class="A" style="font-size:38px">◆ = KEYFRAME</span>`;kfl.querySelector('span').textContent='KEYFRAME = A CHOICE';
  slam(tl,kf,.05,{st:.04});tl.fromTo(hk,{autoAlpha:0,y:80},{autoAlpha:.95,y:0,duration:.6},.35);
  tl.fromTo([sb,tp],{y:200,autoAlpha:0},{y:0,autoAlpha:1,duration:.7,ease:'expo.out',stagger:.12},.3);
  tl.fromTo(dias,{scale:0},{scale:1,duration:.4,ease:'back.out(3)',stagger:.08},.95);
  tl.fromTo(kfl,{scale:0},{scale:1,duration:.4,ease:'back.out(2.5)'},1.2);
  // loops
  const px0=ax,px1=bx;
  loop(tl,1.4,3,l=>{
    l.fromTo(box,{x:0},{x:px1-px0,duration:dur,ease:'power2.inOut'},0)
     .fromTo(ph,{x:0},{x:dpos(dur)-tx0,duration:dur,ease:'power2.inOut'},0)
     .fromTo(box,{scale:1},{scale:1.2,duration:dur/2,ease:'sine.inOut',yoyo:true,repeat:1},0);
    ghosts.forEach((g,i)=>{const tt=(i+1)*dur/(N+1);const p=gsap.parseEase('power2.inOut')(tt/dur);
      l.fromTo(g,{opacity:0,x:p*(px1-px0)},{opacity:.28,duration:.12,x:p*(px1-px0)},tt);});
    l.to(ghosts,{opacity:0,duration:.2},dur+.9).set(box,{x:0,scale:1},dur+1.1).set(ph,{x:0},dur+1.1);
  },0);
  tl.fromTo(ib,{scale:0,rotate:-15},{scale:1,rotate:-3,duration:.5,ease:'back.out(2.5)'},3.0);
});
cue(15.2,18.8,'הכול מתחיל ב<b>קיפריימים</b>: נקודת התחלה ונקודת סיום.','It all starts with <b>keyframes</b>: a start and an end.',C.tom);
cue(18.9,22.3,'המחשב ממלא את מה שבאמצע — <b>אתם קובעים איך</b>.','The computer fills the in-between — <b>you decide how</b>.',C.tom);

// ============ S3 EASING 22.5 -> 31.5
scene('easing',22.5,31.5,C.ink,C.cream,({tl,z1,z2,z3})=>{
  const bg=big(z1,'EASING',{s:330,c:C.cream,top:60,op:.12});
  const heb=big(z3,'איזינג',{cls:'H',s:250,c:C.sun,top:70,split:false,rot:-6,left:560,w:480,align:'center'});
  const gp=$('div','card',null,z2,{position:'absolute',left:60,top:330,width:960,height:470,background:C.ink,borderColor:C.cream,boxShadow:`10px 10px 0 ${C.tom}`,overflow:'hidden'});
  const pw=800,ph_=300,gx=110,gy=70;
  const mkPath=(name,col,dash)=>{const f=gsap.parseEase(name);let d='';for(let i=0;i<=60;i++){const t=i/60;d+=(i?'L':'M')+(gx+t*pw).toFixed(1)+' '+(gy+ph_-f(t)*ph_*.82).toFixed(1)+' '}return `<path d="${d}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="${dash||1}" class="cv"/>`};
  const svg=$('div','',`<svg width="960" height="470" viewBox="0 0 960 470"><path d="M${gx} ${gy} V${gy+ph_} H${gx+pw+20}" fill="none" stroke="${C.cream}" stroke-width="3" opacity=".6"/>
    <text x="${gx-10}" y="${gy+16}" fill="${C.cream}" font-family="JB" font-size="18" text-anchor="end" opacity=".7">value</text><text x="${gx+pw}" y="${gy+ph_+36}" fill="${C.cream}" font-family="JB" font-size="18" text-anchor="end" opacity=".7">time</text>
    ${mkPath('none',C.cream)}${mkPath('power3.out',C.sun)}${mkPath('back.out(1.7)',C.tom)}</svg>`,gp);
  const cvs=[...svg.querySelectorAll('.cv')];
  const names=[['linear',C.cream],['power3.out',C.sun],['back.out(1.7)',C.tom]];
  names.forEach((n,i)=>{$('div','',null,gp,{position:'absolute',left:gx+30,top:gy+ph_+40+0,width:0});});
  const leg=$('div','',null,gp,{position:'absolute',left:gx+30,top:gy+ph_+70+ -0,display:'flex',gap:'26px'});leg.style.display='none';
  // race tracks
  const trk=$('div','',null,z2,{position:'absolute',left:60,top:840,width:960,height:340});
  const balls=names.map((n,i)=>{
    $('div','tag',n[0],trk,{position:'absolute',left:0,top:i*100,color:n[1],fontSize:'20px'});
    $('div','',null,trk,{position:'absolute',left:0,top:i*100+64,width:960,height:4,background:n[1],opacity:.35});
    return $('div','',null,trk,{position:'absolute',left:0,top:i*100+34,width:64,height:64,borderRadius:'50%',background:n[1],border:`5px solid ${C.cream}`,boxShadow:`0 0 0 0 ${n[1]}`});
  });
  const eases=['none','power3.out','back.out(1.7)'];
  const code=$('div','',null,z3,{position:'absolute',left:110,top:1090,padding:'10px 22px',background:C.sun,color:C.ink,border:`5px solid ${C.cream}`,transform:'rotate(-2deg)',boxShadow:`6px 6px 0 ${C.tom}`});
  const cs=$('span','M','ease: "power3.out"',code,{fontSize:'40px',fontWeight:700});
  slam(tl,bg,.05,{st:.05,d:.9});
  tl.fromTo(heb,{scale:0,rotate:-40},{scale:1,rotate:-6,duration:.7,ease:'back.out(2)'},.5);
  tl.fromTo(gp,{y:160,autoAlpha:0},{y:0,autoAlpha:1,duration:.7,ease:'expo.out'},.3);
  cvs.forEach((c,i)=>tl.fromTo(c,{strokeDashoffset:1},{strokeDashoffset:0,duration:.9,ease:'power2.inOut'},.9+i*.25));
  tl.fromTo(trk,{autoAlpha:0,y:80},{autoAlpha:1,y:0,duration:.6},.9);
  tl.fromTo(code,{scale:0},{scale:1,rotate:-2,duration:.5,ease:'back.out(2)'},2.1);
  loop(tl,1.6,3,l=>{
    balls.forEach((b,i)=>l.fromTo(b,{x:0},{x:896,duration:1.3,ease:eases[i]},0));
    l.to(balls,{x:0,duration:.4,ease:'power2.inOut'},2.15);
  },0);
  // pulse curve highlight
  tl.fromTo(cvs[1],{strokeWidth:9},{strokeWidth:16,duration:.3,yoyo:true,repeat:3,ease:'sine.inOut'},4.8);
  tl.to(z1,{x:-30,duration:9,ease:'none'},0);
});
cue(22.9,26.9,'<b>איזינג</b> הוא ההבדל בין רובוטי לבין חי.','<b>Easing</b> is the difference between robotic and alive.',C.sun);
cue(27.0,31.3,'מתחילים מהר ונוחתים רך — <b>כמו פיזיקה אמיתית</b>.','Fast start, soft landing — <b>like real physics</b>.',C.sun);
