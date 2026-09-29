// ============ S4 TITLE 31.5 -> 33.5
scene('title10',31.5,33.5,C.sun,C.ink,({tl,z1,z2,z3})=>{
  const n10=big(z1,'10',{s:1000,c:C.ink,top:120,ls:'-.02em'});
  const mv=big(z3,'MOVES',{s:330,c:C.cream,top:640,sh:`12px 12px 0 ${C.ink}`,rot:-4});
  const hb=big(z3,'עשר תנועות',{cls:'HT',s:150,c:C.ink,top:1000,split:false,mask:false});
  const dots=[0,1,2,3,4,5,6,7,8,9].map(i=>$('div','',null,z2,{position:'absolute',left:70+i*93,top:90,width:34,height:34,borderRadius:'50%',background:C.tom,border:`4px solid ${C.ink}`}));
  slam(tl,n10,0,{st:.09,d:.6});slam(tl,mv,.25,{st:.05,d:.6,rot:-10});
  tl.fromTo(hb,{yPercent:130},{yPercent:0,duration:.6,ease:'expo.out'},.55);
  tl.fromTo(dots,{scale:0},{scale:1,duration:.3,ease:'back.out(3)',stagger:.05},.3);
  tl.to(n10,{scale:1.06,duration:2,ease:'none'},0);
});
cue(31.7,33.4,'עשר תנועות שחייבים להכיר','<b>10 moves</b> you must know',C.tom);

// ============ S5 CARDS 33.5 -> 53.5 (10 x 2s)
const CARD_DUR=2.0,CARD0=33.5;
const CARDS=[
 {n:'POSITION',he:'מיקום',bg:C.cob,fg:C.cream,ac:C.sun,lab:'x: -800 → 0 · power4.out',hc:'<b>מיקום</b> — להחליק פנימה',ec:'<b>Position</b> — slide it in',demo:d_pos},
 {n:'SCALE',he:'קנה מידה',bg:C.cream,fg:C.ink,ac:C.tom,lab:'scale: 0 → 1 · back.out(4)',hc:'<b>קנה מידה</b> — פופ עם אוברשוט',ec:'<b>Scale</b> — the pop with overshoot',demo:d_scale},
 {n:'ROTATION',he:'סיבוב',bg:C.tom,fg:C.ink,ac:C.cream,lab:'rotate: 0 → 360° · expo.inOut',hc:'<b>סיבוב</b> — מושכים את העין',ec:'<b>Rotation</b> — grab the eye',demo:d_rot},
 {n:'OPACITY',he:'שקיפות',bg:C.ink,fg:C.cream,ac:C.sun,lab:'opacity: 0 → 1 · y: 40 → 0',hc:'<b>שקיפות</b> — כניסה רכה',ec:'<b>Opacity</b> — a soft entrance',demo:d_fade},
 {n:'STAGGER',he:'סטגר',bg:C.sun,fg:C.ink,ac:C.cob,lab:'stagger: 0.07 · from: center',hc:'<b>סטגר</b> — קסקדה עם השהיות קטנות',ec:'<b>Stagger</b> — a cascade of tiny delays',demo:d_stag},
 {n:'MASK REVEAL',he:'מסכה',bg:C.lil,fg:C.ink,ac:C.tom,lab:'clip-path: inset(0 100% 0 0) → 0',hc:'<b>מסכה</b> — חושפים, לא סתם מציגים',ec:'<b>Mask reveal</b> — uncover, don\'t just show',demo:d_mask},
 {n:'PARALLAX',he:'פרלקסה',bg:C.cream,fg:C.ink,ac:C.cob,lab:'far: -80px · near: -420px',hc:'<b>פרלקסה</b> — עומק משכבות בקצבים שונים',ec:'<b>Parallax</b> — depth from layers at different speeds',demo:d_par},
 {n:'MORPH',he:'מורפ',bg:C.tom,fg:C.cream,ac:C.ink,lab:'square → circle → triangle → star',hc:'<b>מורפ</b> — צורה אחת הופכת לאחרת',ec:'<b>Morph</b> — one shape becomes another',demo:d_morph},
 {n:'KINETIC TYPE',he:'טקסט קינטי',bg:C.ink,fg:C.cream,ac:C.tom,lab:'one word per beat',hc:'<b>טקסט קינטי</b> — מילים שרוקדות עם הקצב',ec:'<b>Kinetic type</b> — words that move to the beat',demo:d_kin},
 {n:'CAMERA',he:'מצלמה',bg:C.sun,fg:C.ink,ac:C.tom,lab:'scale: 1 → 2.6 + pan x',hc:'<b>מצלמה</b> — זום ופאן על הפריים',ec:'<b>Camera moves</b> — zoom &amp; pan the frame',demo:d_cam},
];
function stg(z,w=800,h=640){return $('div','',null,z,{position:'absolute',left:(W-w)/2,top:330+ (700-h)/2,width:w,height:h})}
function d_pos(tl,z,c){
  const s=stg(z),cx=400,cy=320;
  $('div','',null,s,{position:'absolute',left:0,top:cy,width:800,height:0,borderTop:`5px dashed ${c.fg}`,opacity:.5});
  $('div','',null,s,{position:'absolute',left:cx-14,top:cy-14,width:28,height:28,borderRadius:'50%',border:`5px solid ${c.fg}`});
  const sq=$('div','card',null,s,{position:'absolute',left:cx-115,top:cy-115,width:230,height:230,background:C.tom});
  const lines=[0,1,2,3,4].map(i=>$('div','',null,s,{position:'absolute',left:cx-115-40-i*10,top:cy-95+i*40,width:200+i*40,height:9,background:c.fg,transformOrigin:'100% 50%',opacity:0}));
  tl.fromTo(sq,{x:-900},{x:0,duration:.85,ease:'power4.out'},.15);
  tl.fromTo(lines,{scaleX:0,opacity:.9,x:-900},{scaleX:1,x:0,duration:.6,ease:'power4.out',stagger:.02},.15).to(lines,{opacity:0,duration:.25},.65);
}
function d_scale(tl,z,c){
  const s=stg(z),cx=400,cy=320;
  const rings=[0,1].map(i=>$('div','',null,s,{position:'absolute',left:cx-130,top:cy-130,width:260,height:260,borderRadius:'50%',border:`8px solid ${C.ink}`,opacity:0}));
  const sq=[...Array(10)].map((_,i)=>$('div','',null,s,{position:'absolute',left:cx-14,top:cy-14,width:28,height:28,background:i%2?C.tom:C.ink,opacity:0}));
  const ci=$('div','card',null,s,{position:'absolute',left:cx-150,top:cy-150,width:300,height:300,borderRadius:'50%',background:C.tom});
  tl.fromTo(ci,{scale:0},{scale:1,duration:.75,ease:'back.out(4)'},.15);
  rings.forEach((r,i)=>tl.fromTo(r,{scale:.5,opacity:1},{scale:2.1,opacity:0,duration:.7,ease:'power2.out'},.3+i*.15));
  sq.forEach((q,i)=>{const a=i/10*Math.PI*2;tl.fromTo(q,{x:0,y:0,opacity:1,rotate:0},{x:Math.cos(a)*340,y:Math.sin(a)*340,opacity:0,rotate:200,duration:.8,ease:'power3.out'},.3)});
}
function d_rot(tl,z,c){
  const s=stg(z),cx=400,cy=320;
  const ticks=[...Array(12)].map((_,i)=>$('div','',null,s,{position:'absolute',left:cx-4,top:cy-290,width:8,height:i%3?26:46,background:c.fg,transformOrigin:`4px 290px`,transform:`rotate(${i*30}deg)`,opacity:0}));
  const sq=$('div','card',ico('star',150,C.ink,2),s,{position:'absolute',left:cx-130,top:cy-130,width:260,height:260,background:C.cream,display:'flex',alignItems:'center',justifyContent:'center'});
  tl.fromTo(ticks,{opacity:0},{opacity:.9,duration:.2,stagger:.03},.1);
  tl.fromTo(sq,{rotate:-360,scale:.3},{rotate:0,scale:1,duration:1.0,ease:'expo.inOut'},.15);
  tl.fromTo(sq,{y:0},{y:-28,duration:.16,yoyo:true,repeat:1,ease:'sine.inOut'},1.2);
}
function d_fade(tl,z,c){
  const s=stg(z),cx=400,cy=320;
  const ck=$('div','',null,s,{position:'absolute',left:cx-290,top:cy-210,width:580,height:420,border:`5px solid ${C.cream}`,backgroundImage:`conic-gradient(#3a352f 25%,#26221d 0 50%,#3a352f 0 75%,#26221d 0)`,backgroundSize:'60px 60px'});
  const cd=$('div','card',null,s,{position:'absolute',left:cx-200,top:cy-120,width:400,height:240,background:C.sun,display:'flex',alignItems:'center',justifyContent:'center',borderColor:C.cream,boxShadow:`10px 10px 0 ${C.cream}`});
  $('div','A','FADE',cd,{fontSize:'150px',color:C.ink});
  const tr=$('div','',null,s,{position:'absolute',left:cx-290,top:cy+250,width:580,height:10,background:C.cream,opacity:.4});
  const kn=$('div','',null,s,{position:'absolute',left:cx-290,top:cy+232,width:46,height:46,borderRadius:'50%',background:C.sun,border:`5px solid ${C.cream}`});
  tl.fromTo(ck,{scale:.8,opacity:0},{scale:1,opacity:1,duration:.4,ease:'expo.out'},.05);
  tl.fromTo(cd,{opacity:0,y:60},{opacity:1,y:0,duration:1.0,ease:'power2.out'},.25);
  tl.fromTo(kn,{x:0},{x:534,duration:1.0,ease:'power2.out'},.25);
}
function d_stag(tl,z,c){
  const s=stg(z),cy=560;
  const bars=[...Array(9)].map((_,i)=>$('div','',null,s,{position:'absolute',left:26+i*82,top:cy-420,width:64,height:420,background:i==4?C.tom:C.ink,border:`5px solid ${C.ink}`,transformOrigin:'50% 100%'}));
  $('div','',null,s,{position:'absolute',left:0,top:cy+4,width:800,height:8,background:C.ink});
  tl.fromTo(bars,{scaleY:0},{scaleY:1,duration:.7,ease:'back.out(1.8)',stagger:{each:.07,from:'center'}},.1);
  tl.to(bars,{scaleY:.45,duration:.4,ease:'sine.inOut',stagger:{each:.06,from:'center'},yoyo:true,repeat:1},.95);
}
function d_mask(tl,z,c){
  const s=stg(z),cx=400,cy=320;
  const w=$('div','A mk','REVEAL',s,{position:'absolute',left:0,width:800,top:cy-140,fontSize:'250px',textAlign:'center',color:C.ink});
  const inner=$('div','',null,s,{position:'absolute',left:0,top:0,width:800,height:640,pointerEvents:'none'});
  const bar=$('div','',null,s,{position:'absolute',left:0,top:cy-160,width:40,height:320,background:C.tom,border:`5px solid ${C.ink}`});
  tl.fromTo(w,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.9,ease:'expo.inOut'},.2);
  tl.fromTo(bar,{x:0,autoAlpha:1},{x:760,duration:.9,ease:'expo.inOut'},.2).to(bar,{autoAlpha:0,duration:.1},1.1);
}
function d_par(tl,z,c){
  const s=stg(z,800,590);s.style.overflow='hidden';s.style.border=`6px solid ${C.ink}`;s.style.boxShadow=`10px 10px 0 ${C.ink}`;s.style.background=C.sun;
  const L=(bg,y,w,h,x,br)=>$('div','',null,s,{position:'absolute',left:x,top:y,width:w,height:h,background:bg,borderRadius:br||'50%',border:`5px solid ${C.ink}`});
  const sun=L(C.tom,90,190,190,520);
  const far=[L('#7B8BFF',330,520,420,-80),L('#7B8BFF',360,560,420,380),L('#7B8BFF',340,520,420,850)];
  const near=[L(C.cob,430,620,420,-160),L(C.cob,450,600,420,520),L(C.cob,440,620,420,1060)];
  const trees=[...Array(9)].map((_,i)=>$('div','',null,s,{position:'absolute',left:60+i*200,top:500,width:0,height:0,borderLeft:'34px solid transparent',borderRight:'34px solid transparent',borderBottom:`120px solid ${C.ink}`}));
  tl.fromTo(sun,{x:0},{x:-30,duration:1.7,ease:'sine.inOut'},.1);
  tl.fromTo(far,{x:0},{x:-80,duration:1.7,ease:'sine.inOut'},.1);
  tl.fromTo(near,{x:0},{x:-260,duration:1.7,ease:'sine.inOut'},.1);
  tl.fromTo(trees,{x:0},{x:-420,duration:1.7,ease:'sine.inOut'},.1);
}
function poly(kind,n=40){
  const pts=[];
  for(let i=0;i<n;i++){const t=i/n*Math.PI*2-Math.PI/2;let r;
    if(kind==='circle')r=1;else if(kind==='square')r=Math.cos(Math.PI/4)/Math.cos(((t+Math.PI/4)%(Math.PI/2)+Math.PI/2)%(Math.PI/2)-Math.PI/4)*1.0;
    else if(kind==='tri'){const a=2*Math.PI/3;r=Math.cos(Math.PI/3)/Math.cos((((t+Math.PI/2)%a)+a)%a-Math.PI/3)*1.15;}
    else r=.62+.38*Math.cos(5*(t+Math.PI/2));
    pts.push([Math.cos(t)*r,Math.sin(t)*r]);}
  return pts;
}
function d_morph(tl,z,c){
  const s=stg(z),cx=400,cy=320,R=250;
  const seq=['square','circle','tri','star','square'].map(k=>poly(k));
  const svg=$('div','',`<svg width="800" height="640" viewBox="0 0 800 640"><polygon class="pg" fill="${C.cream}" stroke="${C.ink}" stroke-width="10" stroke-linejoin="round"/></svg>`,s);
  const pg=svg.querySelector('.pg'),o={p:0};
  const set=p=>{const i=Math.min(3,Math.floor(p)),f=p-i,a=seq[i],b=seq[i+1];pg.setAttribute('points',a.map((q,j)=>`${(cx+(q[0]+(b[j][0]-q[0])*f)*R).toFixed(1)},${(cy+(q[1]+(b[j][1]-q[1])*f)*R).toFixed(1)}`).join(' '))};
  set(0);
  tl.fromTo(o,{p:0},{p:4,duration:1.6,ease:'none',onUpdate(){const p=o.p;const seg=Math.min(3,Math.floor(p)),f=p-seg;const e=gsap.parseEase('expo.inOut')(f);set(Math.min(3.9999,seg+e)+ (p>=4?0.0001:0))}},.1);
  tl.fromTo(pg,{fill:C.cream},{keyframes:[{fill:C.sun,duration:.4},{fill:C.cream,duration:.4},{fill:C.sun,duration:.4},{fill:C.cream,duration:.4}]},.1);
}
function d_kin(tl,z,c){
  const s=stg(z),ws=['MOVE','TO','THE','BEAT'],cols=[C.cream,C.sun,C.tom,C.cream],bgs=[C.tom,C.cob,C.sun,C.cream];
  const els=ws.map((w,i)=>{
    const p=$('div','',null,s,{position:'absolute',left:0,top:60,width:800,height:520,display:'flex',alignItems:'center',justifyContent:'center',background:bgs[i],border:`6px solid ${C.cream}`,opacity:0});
    $('div','A',w,p,{fontSize:(w.length>3?290:340)+'px',color:i==0?C.cream:C.ink,textShadow:'none'});
    return p;
  });
  els.forEach((e,i)=>{const t0=.1+i*.4;
    tl.fromTo(e,{opacity:1,scale:1.6,rotate:i%2?7:-7},{opacity:1,scale:1,rotate:0,duration:.28,ease:'expo.out'},t0);
    if(i<3)tl.set(e,{opacity:0},t0+.4);
  });
  tl.fromTo(els[3],{scale:1},{scale:1.08,duration:.2,yoyo:true,repeat:3,ease:'sine.inOut'},1.05);
}
function d_cam(tl,z,c){
  const s=stg(z,800,640);s.style.overflow='hidden';s.style.border=`6px solid ${C.ink}`;s.style.boxShadow=`10px 10px 0 ${C.ink}`;s.style.background=C.cream;
  const cam=$('div','',null,s,{position:'absolute',left:0,top:0,width:800,height:640,transformOrigin:'0 0'});
  const cols=[C.tom,C.cob,C.ink,C.lil,C.sun],ic=['sparkles','zap','film','camera','music','star','video'];
  for(let r=0;r<4;r++)for(let q=0;q<5;q++){const i=r*5+q;
    $('div','',ico(ic[i%ic.length],64,i%3==2?C.cream:C.ink,2.2),cam,{position:'absolute',left:q*160,top:r*160,width:160,height:160,background:cols[(i*2+r)%5],border:`5px solid ${C.ink}`,display:'flex',alignItems:'center',justifyContent:'center'});}
  const fx=2*160,fy=1*160; // focus tile
  const vf=$('div','',`<div style="position:absolute;left:20px;top:20px;width:60px;height:60px;border-left:6px solid ${C.ink};border-top:6px solid ${C.ink}"></div><div style="position:absolute;right:20px;top:20px;width:60px;height:60px;border-right:6px solid ${C.ink};border-top:6px solid ${C.ink}"></div><div style="position:absolute;left:20px;bottom:20px;width:60px;height:60px;border-left:6px solid ${C.ink};border-bottom:6px solid ${C.ink}"></div><div style="position:absolute;right:20px;bottom:20px;width:60px;height:60px;border-right:6px solid ${C.ink};border-bottom:6px solid ${C.ink}"></div><div class="M" style="position:absolute;left:100px;top:22px;font-size:22px;font-weight:700;color:${C.ink}">● REC CAM 01</div>`,s,{position:'absolute',left:0,top:0,width:800,height:640,zIndex:4});
  tl.fromTo(cam,{scale:1,x:0,y:0},{scale:2.5,x:-fx*2.5+ 400-200,y:-fy*2.5+320-200,duration:.8,ease:'expo.inOut'},.15);
  tl.to(cam,{x:-fx*2.5+400-200-400,duration:.7,ease:'power2.inOut'},.95);
}
CARDS.forEach((cd,i)=>{
  const t0=CARD0+i*CARD_DUR;
  scene('card'+i,t0,t0+CARD_DUR,cd.bg,cd.fg,({tl,z1,z2,z3})=>{
    const fs=Math.min(300,980/(cd.n.length*.48));
    const nm=big(z1,cd.n,{s:fs,c:cd.ac,top:100,mask:true});
    const num=$('div','M',String(i+1).padStart(2,'0')+' / 10',z3,{position:'absolute',left:60,top:1000,fontSize:'22px',fontWeight:700,letterSpacing:'.1em'});
    const hb=big(z3,cd.he,{cls:'H',s:150,c:cd.fg,top:1030,split:false,mask:false,left:0,w:W,sh:'none'});
    const lab=$('div','M',cd.lab,z3,{position:'absolute',left:0,width:W,textAlign:'center',top:1008,fontSize:'22px',fontWeight:700,letterSpacing:'.04em',opacity:.85});
    cd.demo(tl,z2,cd);
    slam(tl,nm,0,{st:.03,d:.5});
    tl.fromTo(hb,{yPercent:100,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.5,ease:'expo.out'},.15);
    tl.fromTo(lab,{autoAlpha:0},{autoAlpha:.85,duration:.3},.4);
  },{nopunch:false});
  cue(t0+.08,t0+CARD_DUR-.06,cd.hc,cd.ec,cd.ac==C.ink?C.sun:cd.ac);
});
