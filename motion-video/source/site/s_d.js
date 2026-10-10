// ============ S9 OPUS vs SONNET 90.5 -> 97.5
scene('models',90.5,97.5,C.cob,C.cream,({tl,z1,z2,z3})=>{
  const top=$('div','',null,z1,{position:'absolute',inset:0,background:C.cob});
  const bot=$('div','',null,z1,{position:'absolute',inset:0,background:C.sun,clipPath:'polygon(0 40%,100% 30%,100% 100%,0 100%)'});
  const op=big(z1,'OPUS',{s:420,c:C.cream,top:60,left:-30,w:700,align:'left',op:.2});
  const sn=big(z1,'SONNET',{s:330,c:C.ink,top:600,left:0,w:W,align:'center',op:.13});
  const t1=$('div','',null,z2,{position:'absolute',left:60,top:120,padding:'0 24px',background:C.cream,color:C.ink,border:`6px solid ${C.ink}`,boxShadow:`10px 10px 0 ${C.ink}`,transform:'rotate(-2deg)'});
  t1.innerHTML=`<span class="A" style="font-size:130px">OPUS 5.5</span>`;
  const oc=['PLAN THE STORYBOARD','BUILD THE WHOLE THING','LONG, COHERENT TIMELINES'].map((t,i)=>{
    const e=$('div','',null,z2,{position:'absolute',left:60+i*22,top:310+i*70,padding:'2px 22px',background:C.ink,color:C.cream,border:`4px solid ${C.cream}`});
    e.innerHTML=`<span class="A" style="font-size:44px">${t}</span>`;return e});
  const oh=big(z3,'מתכננים ובונים',{cls:'H',s:66,c:C.sun,top:150,split:false,left:0,w:W-50,align:'right',mask:false});
  const t2=$('div','',null,z2,{position:'absolute',left:300,top:650,padding:'0 24px',background:C.ink,color:C.sun,border:`6px solid ${C.ink}`,boxShadow:`10px 10px 0 ${C.tom}`,transform:'rotate(2deg)'});
  t2.innerHTML=`<span class="A" style="font-size:130px">SONNET 5.5</span>`;
  const sc=['FAST ITERATIONS','TWEAKS &amp; FIXES','ALTERNATIVE TAKES'].map((t,i)=>{
    const e=$('div','',null,z2,{position:'absolute',left:300+i*22,top:830+i*66,padding:'2px 22px',background:C.cream,color:C.ink,border:`4px solid ${C.ink}`});
    e.innerHTML=`<span class="A" style="font-size:42px">${t}</span>`;return e});
  const sh=big(z3,'מתקנים ומשפרים מהר',{cls:'H',s:62,c:C.ink,top:1040,split:false,left:60,w:W-120,align:'left',mask:false});
  const cl=$('div','',null,z3,{position:'absolute',left:800,top:440,width:190,height:190,background:C.ink,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',border:`6px solid ${C.cream}`});
  cl.innerHTML=brand('claude',120,'#D97757');
  const fn=$('div','M','rule of thumb — test both on your own prompt',z3,{position:'absolute',left:0,width:W,textAlign:'center',top:1125,fontSize:'22px',fontWeight:400,letterSpacing:'.06em',color:C.ink});
  slam(tl,op,.05,{st:.06,d:.8});slam(tl,sn,.4,{st:.05,d:.8});
  tl.fromTo(bot,{clipPath:'polygon(0 100%,100% 100%,100% 100%,0 100%)'},{clipPath:'polygon(0 40%,100% 30%,100% 100%,0 100%)',duration:.7,ease:'expo.out'},0);
  tl.fromTo(t1,{x:-900,rotate:-10},{x:0,rotate:-2,duration:.7,ease:'expo.out'},.15);
  oc.forEach((e,i)=>tl.fromTo(e,{x:-1000},{x:0,duration:.6,ease:'expo.out'},.5+i*.16));
  tl.fromTo(oh,{yPercent:130},{yPercent:0,duration:.6,ease:'expo.out'},.9);
  tl.fromTo(t2,{x:900,rotate:10},{x:0,rotate:2,duration:.7,ease:'expo.out'},1.3);
  sc.forEach((e,i)=>tl.fromTo(e,{x:1100},{x:0,duration:.6,ease:'expo.out'},1.7+i*.16));
  tl.fromTo(sh,{yPercent:130},{yPercent:0,duration:.6,ease:'expo.out'},2.2);
  tl.fromTo(cl,{scale:0,rotate:-180},{scale:1,rotate:0,duration:.7,ease:'back.out(2)'},2.6);
  tl.to(cl.firstChild,{rotate:360,duration:4,ease:'none'},3.3);
  tl.fromTo(fn,{autoAlpha:0},{autoAlpha:1,duration:.4},3.4);
});
cue(90.7,97.3,'<b>Opus 5.5</b> מתכנן ובונה. <b>Sonnet 5.5</b> מתקן מהר.','<b>Opus 5.5</b> to plan &amp; build. <b>Sonnet 5.5</b> for fast iterations.',C.sun);

// ============ S10 OUTRO 97.5 -> 103
scene('outro',97.5,103,C.ink,C.cream,({tl,z1,z2,z3})=>{
  const hb=big(z1,'תזיזו',{cls:'H',s:520,c:C.tom,top:280,split:false,op:.9,rot:-6});
  const n=big(z2,'NOW',{s:300,c:C.cream,top:130});
  const m=big(z2,'MAKE IT',{s:290,c:C.sun,top:410});
  const mv=big(z3,'MOVE.',{s:400,c:C.cream,top:700,sh:`12px 12px 0 ${C.tom}`});
  const tag=$('div','',null,z3,{position:'absolute',left:0,width:W,top:1130,textAlign:'center'});
  tag.innerHTML=`<span class="A" style="display:inline-block;background:${C.cream};color:${C.ink};padding:4px 26px;font-size:54px;border:5px solid ${C.ink};box-shadow:8px 8px 0 ${C.sun}">YUV.AI</span>`;
  const shapes=[];const cols=[C.tom,C.sun,C.cob,C.lil,C.cream];
  for(let i=0;i<26;i++){
    const a=(i/26)*Math.PI*2,k=i%3;
    const sz=24+((i*37)%30);
    const e=$('div','',null,i%2?z3:z1,{position:'absolute',left:W/2-sz/2,top:700,width:sz,height:sz,background:k==1?'transparent':cols[i%5],borderRadius:k==0?'50%':0,border:k==1?`6px solid ${cols[i%5]}`:'none',opacity:0});
    shapes.push([e,a,i]);
  }
  slam(tl,n,.05,{st:.06,d:.7});slam(tl,m,.3,{st:.05,d:.7});slam(tl,mv,.65,{st:.06,d:.8,rot:12});
  tl.fromTo(hb,{autoAlpha:0,scale:.6},{autoAlpha:.9,scale:1,duration:.8,ease:'back.out(1.6)',transformOrigin:'50% 50%'},.2);
  tl.fromTo(tag,{y:60,autoAlpha:0},{y:0,autoAlpha:1,duration:.6},1.5);
  shapes.forEach(([e,a,i])=>{
    const d=420+((i*53)%420);
    tl.fromTo(e,{x:0,y:0,opacity:1,rotate:0,scale:1},{x:Math.cos(a)*d,y:Math.sin(a)*d*0.9-120,rotate:i*40,duration:1.3,ease:'power3.out'},1.1)
      .to(e,{y:'+=520',opacity:0,duration:1.6,ease:'power2.in'},2.3);
  });
  tl.to(mv.querySelectorAll('.ch'),{y:-14,duration:.35,yoyo:true,repeat:5,ease:'sine.inOut',stagger:.06},2.2);
  tl.to(hb,{rotate:-2,duration:3.5,ease:'sine.inOut'},1.2);
});
cue(97.7,102.6,'עכשיו — <b>תזיזו דברים</b>.','Now go <b>make things move</b>.',C.tom);
