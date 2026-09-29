const SCN={};SCRIPT.forEach(s=>SCN[s.id]=s);
const HL={hook_0:['בן אדם אמיתי','A real human'],hook_1:['בן אדם','A person'],define_0:['עיצוב גרפי, ועוד זמן','graphic design, plus time'],define_1:['עובדה אמיתית','a real fact'],
position_0:['מאות קבלנים','hundreds of contractors'],position_1:['Project Lily','Project Lily'],scale_0:['תשע מאות מיליון','900 million-plus'],rotation_0:['אחד עד שבע','one to seven'],
opacity_0:['סיכום זיכרון','memory summary'],stagger_0:['מאות אנשים','Hundreds of people'],mask_0:['לא רואים שמות משתמש',"don't see usernames"],mask_1:['פרטים רגישים עדיין יכולים לעבור','sensitive details can still get through'],
camera_0:['Improve the model for everyone','Improve the model for everyone'],morph_0:['רק על שיחות עתידיות','only covers future chats'],parallax_0:['Anthropic','Anthropic'],parallax_1:['תבדקו את ההגדרות','check the settings'],
prompt_0:['מבנה הפרומפט','prompt structure'],prompt_1:['Opus 5.5','Opus 5.5'],cta_0:['כבו את האפשרות','turn it off'],cta_1:['כבר כיביתם?','did you turn it off yet?']};
const bw=(t,k)=>k&&t.includes(k)?t.replace(k,`<b>${k}</b>`):t;
function S(id,bg,fg,build,acc,opts){
  const s=SCN[id];
  scene(id,s.t0,s.t0+s.D,bg,fg,o=>build({...o,D:s.D,sen:s.s}),opts);
  s.s.forEach((x,i)=>{const h=HL[id+'_'+i]||[];const a=x.en.replace(/&/g,'&amp;');cue(s.t0+x.t,s.t0+x.t+x.d+.28,bw(x.he,h[0]),bw(a,h[1]),acc||C.yel)});
}
function chip(par,n,name,he,en,bg,fg,top=104){
  const c=$('div','',null,par,{position:'absolute',left:60,top,background:bg,color:fg,padding:'10px 22px 12px',border:`4px solid ${fg==C.blk?C.blk:bg}`,boxShadow:`8px 8px 0 ${fg==C.blk?C.pink:C.pink}`,zIndex:30});
  c.innerHTML=`<div class="A" style="font-size:38px;letter-spacing:.04em">MOVE ${String(n).padStart(2,'0')}/10 — ${name}</div><div style="font-family:Assistant;font-weight:300;font-size:24px;margin-top:2px;letter-spacing:.02em"><span style="direction:rtl;unicode-bidi:isolate;font-weight:800">${he}</span> &nbsp;·&nbsp; ${en}</div>`;
  return c;
}
const chipIn=(tl,c,at=.15)=>tl.fromTo(c,{x:-700,autoAlpha:0},{x:0,autoAlpha:1,duration:.6,ease:'expo.out'},at);
const P_=(v,o)=>Object.assign({position:'absolute'},v,o||{});

// ---------- 01 HOOK: kinetic type
S('hook',C.blk,C.off,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,1,'KINETIC TYPE','לתפוס תשומת לב בשנייה הראשונה','grab attention in second one',C.yel,C.blk);chipIn(tl,ck,.1);
  const gh=big(z1,'קוראים',{cls:'H',s:470,c:C.pink,top:470,split:false,op:.28,rot:-5});
  const l1=big(z2,'A HUMAN',{s:250,c:C.yel,top:250});
  const l2=big(z2,'IS READING',{s:205,c:C.off,top:485});
  const l3=big(z3,'YOUR CHATS',{s:205,c:C.pink,top:700});
  const eye=$('div','',ico('eye',110,C.blk,2.2),z3,P_({left:790,top:925,width:200,height:200,background:C.yel,border:`7px solid ${C.blk}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`10px 10px 0 ${C.pink}`}));
  const bub=$('div','',ico('message-square',80,C.off,2),z3,P_({left:70,top:925,width:200,height:200,background:C.pink,display:'flex',alignItems:'center',justifyContent:'center'}));
  const hb=big(z3,'לא בוט. בן אדם.',{cls:'HT',s:104,c:C.off,top:945,split:false,left:270,w:520,mask:false,align:'center'});
  const notbot=$('div','',null,z3,P_({left:300,top:1065,padding:'0 22px',background:C.off,color:C.blk,transform:'rotate(-3deg)'}));notbot.innerHTML=`<span class="A" style="font-size:70px">NOT A <s style="text-decoration-color:${C.pink};text-decoration-thickness:10px">BOT</s></span>`;
  const t2=sen[1].t;
  slam(tl,l1,.3,{st:.05,d:.5,rot:14});tl.fromTo(l1,{scale:1.25},{scale:1,duration:.4,ease:'expo.out'},.3);
  slam(tl,l2,.95,{st:.04,d:.5,rot:-14});
  slam(tl,l3,1.6,{st:.05,d:.5,rot:14});tl.fromTo(l3,{scale:1.3},{scale:1,duration:.4,ease:'expo.out'},1.6);
  tl.fromTo(gh,{autoAlpha:0,scale:.7},{autoAlpha:.28,scale:1,duration:.8,ease:'expo.out'},.4);
  pop(tl,eye,2.0,{r0:-40});pop(tl,bub,t2-.1,{r0:20});
  tl.fromTo(hb,{yPercent:130},{yPercent:0,duration:.6,ease:'expo.out'},t2);
  tl.fromTo(notbot,{scale:0,rotate:-30},{scale:1,rotate:-3,duration:.5,ease:'back.out(2.4)'},t2+.5);
  tl.to(eye,{y:-14,duration:.5,yoyo:true,repeat:5,ease:'sine.inOut'},2.6);
  tl.to(z1,{x:-30,duration:D,ease:'none'},0);
},C.yel);

// ---------- 02 DEFINE
S('define',C.yel,C.blk,({tl,z1,z2,z3,D,sen})=>{
  const gm=big(z1,'MOTION',{s:470,c:C.blk,top:130,op:.07});
  const cw=250,gap=90,x0=(W-(3*cw+2*gap))/2,y=230;
  const defs=[[C.off,'pen-tool',C.blk,'DESIGN'],[C.blk,'clock',C.yel,'TIME'],[C.pink,'play',C.off,'MOTION']];
  const cards=defs.map((d,i)=>{
    const c=$('div','',ico(d[1],130,d[2],2.2),z2,P_({left:x0+i*(cw+gap),top:y,width:cw,height:cw,background:d[0],border:`6px solid ${C.blk}`,boxShadow:`10px 10px 0 ${C.blk}`,display:'flex',alignItems:'center',justifyContent:'center'}));
    const l=$('div','A',d[3],z2,P_({left:x0+i*(cw+gap),top:y+cw+34,width:cw,textAlign:'center',fontSize:'54px'}));return {c,l};});
  const ops=['+','='].map((s,i)=>$('div','A',s,z2,P_({left:x0+(i+1)*cw+i*gap,top:y+cw/2-100,width:gap,textAlign:'center',fontSize:'200px',lineHeight:1,color:C.blk})));
  cards.forEach((o,i)=>{pop(tl,o.c,.4+i*.3,{ease:'back.out(2)'});rise(tl,o.l,.55+i*.3,{y:30})});
  ops.forEach((o,i)=>tl.fromTo(o,{scale:0,rotate:180},{scale:1,rotate:0,duration:.5,ease:'back.out(3)'},.6+i*.3));
  tl.to(cards[1].c.querySelector('svg'),{rotate:360,duration:1.6,ease:'power2.inOut',transformOrigin:'50% 50%'},1.6);
  const t2=sen[1].t;
  const a=big(z3,'EVERY MOVE',{s:190,c:C.blk,top:700});
  const bar=$('div','',null,z3,P_({left:60,top:930,padding:'0 26px',background:C.blk,color:C.yel,transform:'rotate(-2deg)'}));bar.innerHTML=`<span class="A" style="font-size:150px">= A REAL FACT</span>`;
  slam(tl,a,t2,{st:.05,d:.5});
  tl.fromTo(bar,{x:1200},{x:0,duration:.6,ease:'expo.out'},t2+.35);
  tl.to(cards.map(o=>o.c),{y:-8,duration:.6,yoyo:true,repeat:5,ease:'sine.inOut',stagger:.1},2.6);
},C.pink);

// ---------- 03 POSITION
S('position',C.off,C.blk,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,2,'POSITION','לסדר סיפור צעד אחר צעד','sequence a story, step by step',C.blk,C.off);chipIn(tl,ck,.1);
  big(z1,'LILY',{s:760,c:C.pink,top:120,op:.13,left:200,w:900,align:'left'});
  const card=$('div','',null,z2,P_({left:60,top:250,width:960,height:290,background:C.bone,border:`6px solid ${C.blk}`,boxShadow:`12px 12px 0 ${C.pink}`,overflow:'hidden'}));
  $('div','',null,card,P_({left:0,top:0,width:'100%',height:56,background:C.blk,color:C.yel}));
  $('div','A','404 MEDIA',card,P_({left:22,top:8,fontSize:'34px',color:C.yel}));
  $('div','M','SEP 14, 2026 — REPORTED BY JOSEPH COX',card,P_({right:22,top:17,fontSize:'18px',color:C.off,letterSpacing:'.08em'}));
  $('div','A','Inside ‘Project Lily’: The Humans Reading Your ChatGPT Chats',card,P_({left:26,top:76,width:900,fontSize:'64px',whiteSpace:'normal',lineHeight:1.02}));
  const chat=$('div','',null,z2,P_({left:60,top:590,width:960,height:560,background:C.off,border:`6px solid ${C.blk}`}));
  $('div','M','ILLUSTRATIVE EXAMPLE — NOT A REAL CHAT',chat,P_({left:20,top:12,fontSize:'16px',letterSpacing:'.1em',color:C.gray}));
  const msgs=[['u','Can you help me write to my landlord?'],['a','Sure. What happened?'],['u',"He won't return my deposit."],['a',"I'm sorry. Let's draft it together."]];
  const bs=msgs.map((m,i)=>{const u=m[0]=='u';
    return $('div','',m[1],chat,P_({[u?'right':'left']:26,top:52+i*118,width:600,padding:'20px 26px',background:u?C.pink:C.blk,color:C.off,fontFamily:'Assistant',fontWeight:u?800:300,fontSize:'36px',lineHeight:1.15}))});
  const t2=sen[1].t;
  tl.fromTo(card,{x:-1200},{x:0,duration:.7,ease:'expo.out'},.25);
  tl.fromTo(chat,{y:300,autoAlpha:0},{y:0,autoAlpha:1,duration:.5,ease:'expo.out'},.5);
  bs.forEach((b,i)=>tl.fromTo(b,{x:msgs[i][0]=='u'?900:-900},{x:0,duration:.6,ease:'expo.out'},.9+i*.55));
  const eye=$('div','',ico('scan-eye',110,C.blk,2.2),z3,P_({left:770,top:770,width:200,height:200,background:C.yel,border:`7px solid ${C.blk}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`8px 8px 0 ${C.blk}`}));
  const lab=$('div','',null,z3,P_({left:690,top:985,padding:'0 18px',background:C.blk,color:C.yel,transform:'rotate(3deg)'}));lab.innerHTML=`<span class="A" style="font-size:52px">CONTRACTOR</span>`;
  tl.fromTo(eye,{x:600,autoAlpha:0},{x:0,autoAlpha:1,duration:.7,ease:'expo.out'},t2);
  tl.fromTo(lab,{scale:0},{scale:1,rotate:3,duration:.4,ease:'back.out(2.5)'},t2+.5);
  tl.to(eye,{y:-300,duration:1.2,ease:'power2.inOut',yoyo:true,repeat:1},t2+1.0);
},C.yel);

// ---------- 04 SCALE
S('scale',C.pink,C.blk,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,3,'SCALE','כדי שמספרים יפגעו','make numbers hit',C.blk,C.off);chipIn(tl,ck,.1);
  const rings=[0,1,2].map(i=>$('div','',null,z1,P_({left:140,top:280,width:800,height:800,borderRadius:'50%',border:`6px solid ${C.blk}`,opacity:0})));
  const rows=[['900M+','CHATGPT USERS',265,C.blk,225],['$50+/HR','CONTRACTOR PAY, PER THE REPORT',225,C.off,575],['HUNDREDS','OF CONTRACTORS',165,C.yel,880]];
  const els=rows.map((r,i)=>{
    const n=$('div','A',r[0],z2,P_({left:0,width:W,textAlign:'center',top:r[4],fontSize:r[2]+'px',lineHeight:.95,color:r[3],textShadow:i==2?`8px 8px 0 ${C.blk}`:'none'}));
    const l=$('div','A',r[1],z3,P_({left:0,width:W,textAlign:'center',top:r[4]+r[2]*.92+36,fontSize:'38px',letterSpacing:'.06em',color:C.blk}));
    return {n,l};});
  const at=[.3,D*.32,D*.6];
  els.forEach((e,i)=>{tl.fromTo(e.n,{scale:0,rotate:i%2?6:-6},{scale:1,rotate:0,duration:.6,ease:'back.out(3)',transformOrigin:'50% 60%'},at[i]);rise(tl,e.l,at[i]+.25,{y:30});
    tl.fromTo(rings[i],{scale:.4,opacity:.9},{scale:1.5,opacity:0,duration:.9,ease:'power2.out'},at[i]);});
},C.yel);

// ---------- 05 ROTATION
S('rotation',C.off,C.blk,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,4,'ROTATION','מדדים ומחוגים','gauges & dials show ratings',C.blk,C.off);chipIn(tl,ck,.1);
  $('div','',null,z1,P_({left:60,top:260,width:960,height:520,background:C.yel}));
  big(z1,'1—7',{s:520,c:C.blk,top:280,op:.08});
  const cx=540,cy=700,R=330;
  let svg=`<svg width="1080" height="800" viewBox="0 0 1080 800" style="position:absolute;left:0;top:0"><path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${C.blk}" stroke-width="18"/>`;
  for(let i=0;i<7;i++){const a=Math.PI+i/6*Math.PI,x=cx+Math.cos(a)*(R+52),y=cy+Math.sin(a)*(R+52),x1=cx+Math.cos(a)*(R-30),y1=cy+Math.sin(a)*(R-30),x2=cx+Math.cos(a)*(R+18),y2=cy+Math.sin(a)*(R+18);
    svg+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.blk}" stroke-width="10"/><text x="${x}" y="${y+16}" text-anchor="middle" font-family="Anton" font-size="48" fill="${C.blk}">${i+1}</text>`;}
  svg+='</svg>';
  const g=$('div','',svg,z2,P_({left:0,top:0,width:W,height:H}));
  const needle=$('div','',null,z2,P_({left:cx,top:cy-9,width:R-20,height:18,background:C.pink,transformOrigin:'0 50%',border:`3px solid ${C.blk}`}));
  $('div','',null,z2,P_({left:cx-34,top:cy-34,width:68,height:68,borderRadius:'50%',background:C.blk}));
  const score=$('div','A','6 / 7',z3,P_({left:0,width:W,top:cy+56,textAlign:'center',fontSize:'110px',color:C.blk}));
  const cardsX=[70,400,730],sc=['3','2','6'],names=['ANSWER A','ANSWER B','ANSWER C'];
  const cs=names.map((n,i)=>{const c=$('div','',null,z2,P_({left:cardsX[i],top:900,width:280,height:190,background:i==2?C.pink:C.off,color:i==2?C.off:C.blk,border:`6px solid ${C.blk}`,boxShadow:`8px 8px 0 ${C.blk}`}));
    c.innerHTML=`<div class="M" style="font-size:20px;font-weight:700;padding:14px 0 0 16px;letter-spacing:.1em">${n}</div><div class="A" style="font-size:110px;text-align:center;margin-top:-4px">${sc[i]}</div>`;return c;});
  tl.fromTo([g],{autoAlpha:0},{autoAlpha:1,duration:.4},.2);
  const seq=[[.6,-180],[1.2,0],[2.0,-120],[3.0,-30]];
  tl.fromTo(needle,{rotate:-180},{rotate:0,duration:1.0,ease:'power3.inOut'},.6);
  tl.to(needle,{rotate:-120,duration:.9,ease:'power3.inOut'},1.8);
  tl.to(needle,{rotate:-30,duration:1.6,ease:'elastic.out(1,.4)'},2.9);
  tl.fromTo(score,{autoAlpha:0,scale:.5},{autoAlpha:1,scale:1,duration:.5,ease:'back.out(3)'},3.6);
  cs.forEach((c,i)=>tl.fromTo(c,{rotate:i%2?30:-30,y:400,autoAlpha:0},{rotate:i==1?2:i==2?-2:1,y:0,autoAlpha:1,duration:.7,ease:'back.out(1.6)'},1.2+i*.35));
},C.pink);

// ---------- 06 OPACITY
S('opacity',C.blk,C.off,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,5,'OPACITY','לשכב מידע משני','layer in secondary info',C.yel,C.blk);chipIn(tl,ck,.1);
  big(z1,'MEMORY',{s:480,c:C.off,top:300,op:.07});
  const mem=$('div','',null,z2,P_({left:60,top:270,width:960,height:440,background:C.yel,color:C.blk,border:`6px solid ${C.yel}`,boxShadow:`12px 12px 0 ${C.pink}`}));
  $('div','M','USER MEMORIES SUMMARY — ILLUSTRATIVE',mem,P_({left:26,top:22,fontSize:'20px',fontWeight:700,letterSpacing:'.1em'}));
  const lines=[['Works as','a night nurse'],['Lives in','the north, general area'],['Background','two kids, shift work']];
  const ls=lines.map((l,i)=>{const e=$('div','',null,mem,P_({left:26,top:84+i*112,width:900}));e.innerHTML=`<span class="A" style="font-size:38px;letter-spacing:.05em;opacity:.6">${l[0]}</span><br><span style="font-family:Assistant;font-weight:800;font-size:52px;line-height:1">${l[1]}</span>`;return e});
  const pr=$('div','',null,z2,P_({left:60,top:780,width:960,height:250,background:C.off,color:C.blk,border:`6px solid ${C.off}`}));
  $('div','M','USER PROMPT',pr,P_({left:26,top:20,fontSize:'20px',fontWeight:700,letterSpacing:'.1em',color:C.gray}));
  $('div','',"Rewrite my resume for a nurse position in Haifa.",pr,P_({left:26,top:70,width:900,fontFamily:'Assistant',fontWeight:800,fontSize:'58px',lineHeight:1.05}));
  const tag=$('div','',null,z3,P_({left:540,top:1050,padding:'0 20px',background:C.pink,color:C.off,transform:'rotate(3deg)'}));tag.innerHTML=`<span class="A" style="font-size:52px">CONTRACTORS SEE BOTH</span>`;
  tl.fromTo(pr,{y:200,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out'},.3);
  tl.fromTo(mem,{autoAlpha:0},{autoAlpha:1,duration:2.2,ease:'power1.inOut'},1.0);
  ls.forEach((l,i)=>tl.fromTo(l,{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.8,ease:'power2.out'},1.6+i*.9));
  tl.fromTo(tag,{scale:0},{scale:1,rotate:3,duration:.5,ease:'back.out(2.4)'},D-2.2);
},C.pink);

// ---------- 07 STAGGER
S('stagger',C.bone,C.blk,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,6,'STAGGER','"הרבה" כגל אחד','show “many” as a wave',C.blk,C.off);chipIn(tl,ck,.1);
  big(z1,'מאות',{cls:'H',s:560,c:C.pink,top:330,split:false,op:.35});
  const tiles=[];const cols=6,rows=6,sz=118,gp=18,x0=(W-(cols*sz+(cols-1)*gp))/2,y0=250;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const k=(r+c)%3;
    tiles.push($('div','',ico('user',64,k==1?C.blk:C.off,2.2),z2,P_({left:x0+c*(sz+gp),top:y0+r*(sz+gp),width:sz,height:sz,background:k==0?C.blk:k==1?C.yel:C.pink,border:`5px solid ${C.blk}`,display:'flex',alignItems:'center',justifyContent:'center'})));}
  const hw=big(z3,'HUNDREDS',{s:250,c:C.yel,top:560,sh:`10px 10px 0 ${C.blk}`,rot:-4});
  tl.fromTo(tiles,{scale:0,rotate:-45},{scale:1,rotate:0,duration:.6,ease:'back.out(2)',stagger:{amount:1.4,grid:[rows,cols],from:'center'}},.3);
  tl.to(tiles,{scale:.8,duration:.35,ease:'sine.inOut',yoyo:true,repeat:1,stagger:{amount:1.0,grid:[rows,cols],from:'edges'}},2.2);
  slam(tl,hw,1.2,{st:.05,d:.6,rot:-14});
},C.yel);

// ---------- 08 MASK REVEAL
S('mask',C.yel,C.blk,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,7,'MASK REVEAL','השחרה וחשיפה','redact & reveal',C.blk,C.off);chipIn(tl,ck,.1);
  big(z1,'REDACTED',{s:330,c:C.blk,top:520,op:.08,rot:-6});
  const doc=$('div','',null,z2,P_({left:70,top:250,width:940,height:500,background:C.off,border:`6px solid ${C.blk}`,boxShadow:`12px 12px 0 ${C.blk}`}));
  $('div','M','CONVERSATION EXCERPT — ILLUSTRATIVE',doc,P_({left:26,top:20,fontSize:'18px',letterSpacing:'.1em',color:C.gray,fontWeight:700}));
  const text=$('div','',null,doc,P_({left:34,top:76,width:872,fontFamily:'Assistant',fontWeight:300,fontSize:'47px',lineHeight:'1.5',direction:'ltr'}));
  const bars=[];const leak=[];
  const lines=[[['Hi, I\'m '],['Dana Levi','r']],[['I live on '],['Herzl 12, Haifa','r']],[['I work at '],['Carmel Medical','r'],[' as a '],['night nurse','l']],[['My son '],['Noam','r'],[' starts school.']]];
  lines.forEach(ln=>{const row=$('div','',null,text,{whiteSpace:'nowrap'});ln.forEach(p=>{
    const s=$('span','',p[0],row,{position:'relative',display:'inline-block',whiteSpace:'pre'});
    if(p[1]=='r'){s.style.fontWeight=800;const b=$('span','',null,s,{position:'absolute',left:'-6px',right:'-6px',top:'8px',bottom:'8px',background:C.blk,transformOrigin:'0 50%'});bars.push(b);}
    if(p[1]=='l'){s.style.fontWeight=800;s.style.background=`linear-gradient(transparent 58%, ${C.pink} 58%)`;s.style.backgroundRepeat='no-repeat';leak.push(s);}
  })});
  const call=$('div','',null,z3,P_({left:80,top:800,padding:'6px 22px',background:C.blk,color:C.yel,transform:'rotate(-1.5deg)',boxShadow:`8px 8px 0 ${C.pink}`}));call.innerHTML=`<span class="A" style="font-size:54px">STILL VISIBLE: “SENSITIVE DETAILS CAN GET THROUGH”</span>`;call.firstChild.style.fontSize='42px';
  const t1=sen[0].t,t2=sen[1].t;
  tl.fromTo(doc,{y:260,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out'},.3);
  tl.fromTo(bars,{scaleX:0},{scaleX:1,duration:.5,ease:'expo.inOut',stagger:.45},t1+.5);
  tl.fromTo(leak,{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',duration:.5,ease:'power2.out'},t2);
    tl.fromTo(call,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.7,ease:'expo.inOut'},t2+.4);
},C.pink);

// ---------- 09 CAMERA
S('camera',C.off,C.blk,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,8,'CAMERA MOVE','זום אל הפעולה','zoom to the action',C.blk,C.off);chipIn(tl,ck,.1);
  const frame=$('div','',null,z2,P_({left:60,top:250,width:960,height:640,overflow:'hidden',background:C.bone,border:`6px solid ${C.blk}`,boxShadow:`12px 12px 0 ${C.pink}`}));
  const cam=$('div','',null,frame,P_({left:0,top:0,width:960,height:640,transformOrigin:'0 0'}));
  const side=$('div','',null,cam,P_({left:0,top:0,width:270,height:640,background:C.blk}));
  ['General','Notifications','Personalization','Data Controls','Security','Account'].forEach((t,i)=>{const on=t=='Data Controls';$('div','',t,side,P_({left:0,top:24+i*76,width:270,height:60,padding:'14px 24px',fontFamily:'Assistant',fontWeight:on?800:300,fontSize:'30px',color:on?C.blk:C.off,background:on?C.yel:'transparent'}))});
  $('div','A','DATA CONTROLS',cam,P_({left:310,top:24,fontSize:'46px'}));
  const rowsY=[110,250,390,520];
  const rw=[['Chat history',''],['Improve the model for everyone','t'],['Shared links',''],['Delete all chats','']];
  let tg,knob;
  rw.forEach((r,i)=>{const rr=$('div','',null,cam,P_({left:310,top:rowsY[i],width:620,height:100,background:C.off,border:`4px solid ${C.blk}`}));
    $('div','',r[0],rr,P_({left:20,top:0,height:'100%',display:'flex',alignItems:'center',fontFamily:'Assistant',fontWeight:r[1]?800:300,fontSize:r[1]?'32px':'34px',width:440,lineHeight:1.05}));
    tg=tg||null;
    if(r[1]){tg=$('div','',null,rr,P_({right:22,top:26,width:92,height:48,background:C.pink,border:`4px solid ${C.blk}`}));knob=$('div','',null,tg,P_({left:44,top:2,width:38,height:38,background:C.off,border:`3px solid ${C.blk}`}));}
    else $('div','',null,rr,P_({right:22,top:26,width:92,height:48,background:C.bone,border:`4px solid ${C.blk}`,opacity:.5}));});
  $('div','M','ILLUSTRATIVE UI',frame,P_({right:16,bottom:10,fontSize:'16px',letterSpacing:'.1em',color:C.gray,fontWeight:700,zIndex:5}));
  // viewfinder
  const vf=$('div','',null,frame,P_({left:0,top:0,width:960,height:640,zIndex:6,pointerEvents:'none'}));
  vf.innerHTML=['left:16px;top:16px;border-left:6px solid;border-top:6px solid','right:16px;top:16px;border-right:6px solid;border-top:6px solid','left:16px;bottom:16px;border-left:6px solid;border-bottom:6px solid','right:16px;bottom:16px;border-right:6px solid;border-bottom:6px solid'].map(s=>`<div style="position:absolute;width:56px;height:56px;color:${C.pink};${s}"></div>`).join('')+`<div class="M" style="position:absolute;left:84px;top:22px;font-size:20px;font-weight:700;color:${C.pink}">● REC</div>`;
  const s=2.1,px=310+620-70,py=250+50;
  tl.fromTo(frame,{y:200,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out'},.3);
  tl.fromTo(cam,{scale:1,x:0,y:0},{scale:s,x:480-px*s,y:320-py*s,duration:1.3,ease:'expo.inOut'},D*.42);
  tl.to(tg,{backgroundColor:C.gray,duration:.15},D*.42+1.5).to(knob,{left:4,duration:.35,ease:'back.out(3)'},D*.42+1.5);
  const steps=['SETTINGS','DATA CONTROLS','TURN OFF'],st=[D*.06,D*.2,D*.38];
  steps.forEach((t,i)=>{const p=$('div','',null,z3,P_({left:70+i*330,top:950,width:300,padding:'6px 10px',textAlign:'center',background:i==2?C.pink:C.blk,color:C.off,border:`4px solid ${C.blk}`,boxShadow:`6px 6px 0 ${C.blk}`}));p.innerHTML=`<span class="A" style="font-size:42px">${i+1}. ${t}</span>`;tl.fromTo(p,{scale:0,rotate:-12},{scale:1,rotate:0,duration:.45,ease:'back.out(2.4)'},.9+st[i]*.9+.2);});
},C.yel);

// ---------- 10 MORPH
S('morph',C.blk,C.off,({tl,z1,z2,z3,D,sen})=>{
  const ck=chip(z3,9,'MORPH','שינוי מצב','show a state change',C.yel,C.blk);chipIn(tl,ck,.1);
  big(z1,'ONLY FORWARD',{s:230,c:C.off,top:900,op:.07});
  const cx=540,cy=430,R=170,n=48;
  const circle=[],square=[];
  for(let i=0;i<n;i++){const t=i/n*Math.PI*2-Math.PI/2;circle.push([Math.cos(t),Math.sin(t)]);const m=Math.max(Math.abs(Math.cos(t)),Math.abs(Math.sin(t)));square.push([Math.cos(t)/m*.88,Math.sin(t)/m*.88]);}
  const wrap=$('div','',`<svg width="1080" height="700" viewBox="0 0 1080 700" style="position:absolute;left:0;top:0"><polygon class="pg" fill="${C.pink}" stroke="${C.off}" stroke-width="8"/></svg>`,z2,P_({left:0,top:0,width:W,height:700}));
  const pg=wrap.querySelector('.pg'),o={p:0};
  const setp=p=>pg.setAttribute('points',circle.map((a,j)=>`${(cx+(a[0]+(square[j][0]-a[0])*p)*R).toFixed(1)},${(cy+(a[1]+(square[j][1]-a[1])*p)*R).toFixed(1)}`).join(' '));setp(0);
  const lab=$('div','A','ON',z3,P_({left:cx-150,width:300,top:cy-72,textAlign:'center',fontSize:'150px',color:C.off,lineHeight:1}));
  const lab2=$('div','A','OFF',z3,P_({left:cx-150,width:300,top:cy-72,textAlign:'center',fontSize:'150px',color:C.yel,lineHeight:1,opacity:0}));
  // timeline
  const y=760,past=$('div','',null,z2,P_({left:60,top:y,width:500,height:150,background:C.pink,color:C.off,padding:'18px 22px'}));
  past.innerHTML=`<div class="A" style="font-size:52px">PAST CHATS</div><div style="font-family:Assistant;font-weight:300;font-size:30px;margin-top:2px">still eligible for review</div>`;
  const fut=$('div','',null,z2,P_({left:560,top:y,width:460,height:150,border:`5px dashed ${C.off}`,color:C.off,padding:'18px 22px'}));
  fut.innerHTML=`<div class="A" style="font-size:52px">FUTURE CHATS</div><div class="fs" style="font-family:Assistant;font-weight:300;font-size:30px;margin-top:2px">used to improve the model</div>`;
  const today=$('div','',null,z3,P_({left:556,top:y-40,width:8,height:230,background:C.yel}));
  const tl2=$('div','A','TODAY',z3,P_({left:520,top:y-88,width:80,textAlign:'center',fontSize:'40px',color:C.yel,whiteSpace:'nowrap',marginLeft:'-0px'}));tl2.style.left='450px';tl2.style.width='220px';
  const t=D*.45;
  tl.fromTo(wrap,{autoAlpha:0,scale:.6},{autoAlpha:1,scale:1,duration:.6,ease:'back.out(1.8)',transformOrigin:'540px 430px'},.3);
  tl.fromTo([past,fut],{y:200,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out',stagger:.15},.7);
  tl.fromTo(today,{scaleY:0},{scaleY:1,duration:.4,ease:'expo.out',transformOrigin:'50% 100%'},1.2);tl.fromTo(tl2,{autoAlpha:0},{autoAlpha:1,duration:.3},1.4);
  tl.fromTo(o,{p:0},{p:1,duration:.9,ease:'expo.inOut',onUpdate(){setp(o.p)}},t);
  tl.to(pg,{fill:C.gray,duration:.4},t).to(lab,{opacity:0,duration:.2},t).to(lab2,{opacity:1,duration:.3},t+.3);
  tl.to(fut,{borderColor:C.gray,color:C.gray,duration:.5},t+.2);
  tl.call(()=>{},[],t);
  tl.to(fut.querySelector('.fs'),{opacity:0,duration:.2},t+.2);
  const fx=$('div','',null,z2,P_({left:0,top:0}));
  const fs2=fut.querySelector('.fs');tl.set(fs2,{textContent:'not used after opt-out'},t+.4).to(fs2,{opacity:1,duration:.3},t+.4);
  const stk=$('div','',null,z3,P_({left:70,top:960,padding:'0 22px',background:C.yel,color:C.blk,transform:'rotate(-2deg)'}));stk.innerHTML=`<span class="A" style="font-size:66px">OPT-OUT IS NOT RETROACTIVE</span>`;
  tl.fromTo(stk,{scale:0,rotate:-15},{scale:1,rotate:-2,duration:.5,ease:'back.out(2.4)'},t+.8);
},C.yel);

// ---------- 11 PARALLAX
S('parallax',C.pink,C.blk,({tl,root,z1,z2,z3,D,sen})=>{
  const ck=chip(root,10,'PARALLAX','עומק בין שחקנים','depth between players',C.blk,C.off);chipIn(tl,ck,.1);
  const bg=big(z1,'HUMAN REVIEW',{s:300,c:C.blk,top:180,op:.13,left:-60,w:1400,align:'left'});
  const bg2=big(z1,'EVERYWHERE',{s:300,c:C.blk,top:520,op:.13,left:100,w:1400,align:'left'});
  const dots=[...Array(8)].map((_,i)=>$('div','',null,z1,P_({left:100+i*140,top:900+((i*97)%200),width:40+((i*13)%40),height:40+((i*13)%40),borderRadius:'50%',background:C.blk,opacity:.15})));
  const mk=(x,logo,title,sub,bgc,fgc)=>{const c=$('div','',null,z2,P_({left:x,top:300,width:430,height:560,background:bgc,color:fgc,border:`6px solid ${C.blk}`,boxShadow:`12px 12px 0 ${C.blk}`,padding:'26px'}));
    c.innerHTML=`<div style="height:210px;display:flex;align-items:center">${logo}</div><div class="A" style="font-size:66px;margin-top:14px">${title}</div><div style="font-family:Assistant;font-weight:300;font-size:30px;margin-top:8px;line-height:1.15">${sub}</div>`;return c;};
  const a=mk(130,`<span style="font-family:Assistant;font-weight:800;font-size:96px;letter-spacing:-.02em">OpenAI</span>`,'PROJECT LILY','reported by 404 Media, Sep 2026',C.off,C.blk);
  const b=mk(620,brand('claude',170,'#D97757')+`<span style="margin-left:18px">${brand('anthropic',96,C.off)}</span>`,'ANTHROPIC','confirmed it also uses human review',C.blk,C.off);
  const chk=$('div','',null,z3,P_({left:380,top:930,padding:'2px 26px',background:C.yel,color:C.blk,transform:'rotate(-3deg)',border:`5px solid ${C.blk}`,boxShadow:`8px 8px 0 ${C.blk}`,display:'flex',alignItems:'center',gap:'14px'}));
  chk.innerHTML=ico('list-checks',72,C.blk,2.4)+`<span class="A" style="font-size:78px">CHECK EVERY TOOL</span>`;
  const sp=[0,1,2].map(i=>$('div','',ico('sparkles',70,C.blk,2.2),z3,P_({left:[900,120,700][i],top:[180,1090,1000][i]})));
  tl.fromTo(a,{x:900,autoAlpha:0},{x:0,autoAlpha:1,duration:.7,ease:'expo.out'},.3);
  tl.fromTo(b,{x:1300,autoAlpha:0},{x:0,autoAlpha:1,duration:.7,ease:'expo.out'},D*.28);
  tl.fromTo(chk,{scale:0,rotate:-20},{scale:1,rotate:-3,duration:.5,ease:'back.out(2.4)'},sen[1].t+.3);
  tl.fromTo(sp,{scale:0},{scale:1,duration:.4,ease:'back.out(3)',stagger:.1},sen[1].t+.5);
  // parallax pan
  tl.to([bg,bg2],{x:-90,duration:D,ease:'none'},0).to(dots,{x:-160,duration:D,ease:'none'},0);
  tl.to(z2,{x:-70,duration:D,ease:'none'},.3);
  tl.to(z3,{x:-230,duration:D,ease:'none'},.3);
},C.yel);

// ---------- 12 PROMPT
S('prompt',C.bone,C.blk,({tl,z1,z2,z3,D,sen})=>{
  big(z1,'PROMPT',{s:430,c:C.pink,top:1000,op:.16});
  const term=$('div','',null,z2,P_({left:60,top:150,width:960,height:590,background:C.blk,color:C.off,boxShadow:`14px 14px 0 ${C.pink}`,overflow:'hidden'}));
  const bar=$('div','',null,term,P_({left:0,top:0,width:'100%',height:52,background:C.char,display:'flex',alignItems:'center',gap:'10px',padding:'0 20px'}));
  [C.pink,C.yel,C.off].forEach(c=>$('div','',null,bar,{width:16,height:16,background:c}));
  $('div','M','claude — ~/project-lily-video',bar,{color:C.off,fontSize:'18px',opacity:.6,marginLeft:'14px',letterSpacing:'.05em'});
  const body=$('div','',null,term,P_({left:26,top:76,right:20,bottom:14}));
  const L=[
   [['> ',C.pink,700],['Build a 3:4 motion explainer on ChatGPT “Project Lily”',C.off,700]],
   [['  source: 404 Media, 14 Sep 2026 · cite on screen',C.off,300]],null,
   [['FORMAT  ',C.yel,700],[' 1080x1440 · 30fps · HTML + GSAP · seekable',C.off,400]],
   [['STYLE   ',C.pink,700],[' off-white / black / pink / yellow',C.off,400]],
   [['         Anton (EN) + Assistant thin+bold (HE)',C.off,400]],
   [['STORY   ',C.yel,700],[' 13 scenes · one real fact per scene',C.off,400]],
   [['MOTION  ',C.pink,700],[' power3.out · back.out(1.7) · stagger .06',C.off,400]],
   [['RHYTHM  ',C.yel,700],[' a move every ~2s · one hero per beat',C.off,400]],
   [['CHECK   ',C.pink,700],[' render frames · fix overflow · HE+EN captions',C.off,400]],
  ];
  let t=.6;
  L.forEach(l=>{if(!l){$('div','',null,body,{height:'35px'});return}const r=typer(tl,body,l,t,72);t=r.end+.12;});
  const pills=[['OPUS 5.5','plan the storyboard + build it all',C.yel,C.blk],['SONNET 5.5','fast fix rounds + variations',C.off,C.blk]];
  pills.forEach((p,i)=>{const c=$('div','',null,z3,P_({left:60+i*490,top:830,width:470,height:260,background:p[2],color:p[3],border:`6px solid ${C.blk}`,boxShadow:`8px 8px 0 ${C.blk}`,padding:'18px 22px'}));
    c.innerHTML=`<div style="display:flex;align-items:center;gap:14px">${brand('claude',70,'#D97757')}<span class="A" style="font-size:70px">${p[0]}</span></div><div style="font-family:Assistant;font-weight:300;font-size:32px;margin-top:8px;line-height:1.1">${p[1]}</div><div class="M" style="position:absolute;left:22px;bottom:12px;font-size:16px;letter-spacing:.08em;font-weight:700;opacity:.7">RULE OF THUMB — TEST BOTH</div>`;
    tl.fromTo(c,{y:300,autoAlpha:0,rotate:i?4:-4},{y:0,autoAlpha:1,rotate:0,duration:.6,ease:'back.out(1.6)'},sen[1].t+i*.5);});
  tl.fromTo(term,{y:260,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out'},.1);
},C.pink);

// ---------- 13 CTA
S('cta',C.pink,C.blk,({tl,z1,z2,z3,D,sen})=>{
  const a=big(z1,'TURN',{s:280,c:C.blk,top:110});
  const b=big(z2,'IT OFF.',{s:280,c:C.off,top:360,sh:`10px 10px 0 ${C.blk}`});
  const steps=[['1','SETTINGS'],['2','DATA CONTROLS'],['3','IMPROVE THE MODEL FOR EVERYONE → OFF']];
  const els=steps.map((s,i)=>{const e=$('div','',null,z2,P_({left:60,top:690+i*128,width:960,height:108,background:i==2?C.yel:C.off,border:`6px solid ${C.blk}`,boxShadow:`8px 8px 0 ${C.blk}`,display:'flex',alignItems:'center'}));
    e.innerHTML=`<div class="A" style="width:96px;height:100%;background:${C.blk};color:${C.yel};font-size:80px;text-align:center;line-height:104px">${s[0]}</div><div class="A" style="font-size:${i==2?40:58}px;margin-left:24px;white-space:nowrap">${s[1].replace('→','')}</div>`;
    if(i==2)e.innerHTML=e.innerHTML.replace('OFF','<span style="color:'+C.pink+'">OFF</span>');return e;});
  const send=$('div','',null,z3,P_({left:520,top:1090,padding:'2px 22px',background:C.blk,color:C.yel,transform:'rotate(3deg)',display:'flex',alignItems:'center',gap:'10px'}));
  send.innerHTML=ico('send',52,C.yel,2.4)+`<span class="A" style="font-size:52px">SEND IT TO A FRIEND</span>`;
  const cm=$('div','',null,z3,P_({left:60,top:1090,padding:'2px 22px',background:C.off,color:C.blk,border:`5px solid ${C.blk}`,transform:'rotate(-2deg)'}));cm.innerHTML=`<span class="A" style="font-size:52px">DID YOU? COMMENT ↓</span>`;cm.firstChild.innerHTML='DID YOU? COMMENT';
  $('div','M','SOURCES: 404 MEDIA (SEP 14, 2026) · ANDROID HEADLINES · IBTIMES',z3,P_({left:0,width:W,textAlign:'center',top:1165,fontSize:'17px',fontWeight:700,letterSpacing:'.05em'}));
  slam(tl,a,.2,{st:.06,d:.6});slam(tl,b,.5,{st:.05,d:.6,rot:-10});
  els.forEach((e,i)=>tl.fromTo(e,{x:i%2?1200:-1200},{x:0,duration:.6,ease:'expo.out'},1.2+i*.3));
  tl.fromTo(send,{scale:0,rotate:-20},{scale:1,rotate:3,duration:.5,ease:'back.out(2.4)'},sen[0].t+3.0);
  tl.fromTo(cm,{scale:0,rotate:20},{scale:1,rotate:-2,duration:.5,ease:'back.out(2.4)'},sen[1].t);
  tl.to(cm,{scale:1.06,duration:.35,yoyo:true,repeat:5,ease:'sine.inOut'},sen[1].t+.6);
},C.yel);
