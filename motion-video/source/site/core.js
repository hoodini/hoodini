const W=1080,H=1440,FPS=30,DUR=103;
const C={off:'#FAFAF7',bone:'#F5EEE4',blk:'#0A0A0A',pink:'#FF1464',yel:'#E5FF00',char:'#1A1A1A',gray:'#8B8680'};C.cream=C.off;C.ink=C.blk;C.tom=C.pink;C.sun=C.yel;
const MASTER=gsap.timeline({paused:true,defaults:{ease:'power3.out'}});
const stage=document.getElementById('stage');
const UNIT=new Set(['opacity','zIndex','fontWeight','flex','lineHeight','order','scale']);
const $=(t,c,h,p,s)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;if(s)for(const k in s){let v=s[k];if(typeof v==='number'&&!UNIT.has(k))v+='px';if(k.startsWith('--'))e.style.setProperty(k,v);else e.style[k]=v}(p||stage).appendChild(e);return e};
const ico=(n,s=64,col='currentColor',sw=2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS.l[n]}</svg>`;
const brand=(k,s=64,col)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path fill="${col||'#'+ICONS.b[k].hex}" d="${ICONS.b[k].path}"/></svg>`;
const letters=t=>[...t].map(c=>`<span class="ch">${c===' '?'&nbsp;':c}</span>`).join('');
const P=(x,y)=>({left:x,top:y}); // helper
// big text line (absolute, centred by default). o: cls,size,color,top,left,width,align,rot
function big(par,txt,o){
  const w=$('div',(o.cls||'A')+(o.mask===false?'':' mk')+' abs',o.split===false?`<span class="ch">${txt}</span>`:letters(txt),par,{
    fontSize:o.s+'px',color:o.c||'inherit',top:o.top+'px',left:(o.left??0)+'px',width:(o.w??W)+'px',textAlign:o.align||'center',
    transform:o.rot?`rotate(${o.rot}deg)`:'',transformOrigin:'50% 50%',opacity:o.op??1,letterSpacing:o.ls||'',zIndex:o.z||0,textShadow:o.sh||'',webkitTextStroke:o.stroke||'0'});
  return w;
}
function slam(tl,el,at,o={}){
  tl.fromTo(el.querySelectorAll('.ch'),{yPercent:o.y??115,rotate:o.rot??7},{yPercent:0,rotate:0,duration:o.d??.75,ease:o.ease||'expo.out',stagger:o.st??.045},at);
}
function pop(tl,el,at,o={}){
  tl.fromTo(el,{scale:0,rotate:o.r0??-25},{scale:1,rotate:o.r1??0,duration:o.d??.55,ease:o.ease||'back.out(2.2)',transformOrigin:'50% 50%'},at);
}
function rise(tl,el,at,o={}){
  tl.fromTo(el,{y:o.y??60,autoAlpha:0},{y:0,autoAlpha:1,duration:o.d??.6,ease:'power3.out',stagger:o.st||0},at);
}
function typer(tl,parent,segs,at,cps=60,style){
  // segs: [[text,color,weight]] -> line
  const line=$('div','M',null,parent,Object.assign({fontSize:'25px',lineHeight:'35px',height:'35px'},style||{}));
  const chars=[];
  segs.forEach(([t,c,wt])=>{[...t].forEach(ch=>{const s=$('span','',ch,line,{opacity:0,color:c||'',fontWeight:wt||400});chars.push(s)})});
  const cur=$('span','',' ',line,{display:'inline-block',width:'13px',height:'24px',background:C.tom,verticalAlign:'-4px',opacity:0,marginLeft:'2px'});
  const n=chars.length,o={n:0};
  tl.fromTo(o,{n:0},{n:n,duration:Math.max(.05,n/cps),ease:'none',onUpdate(){
    const k=Math.round(o.n);chars.forEach((s,i)=>s.style.opacity=i<k?1:0);cur.style.opacity=(k>0&&k<n)?1:0;
  }},at);
  return {line,chars,end:at+n/cps};
}
// ---- scene factory
let SC_N=0;
function scene(name,t0,t1,bg,fg,build,opts={}){
  const root=$('div','scene',null,stage,{background:bg,color:fg});
  const z=[1,2,3].map(i=>$('div','layer z'+i,null,root));
  const m=$('div','mast',`<span class="l">Project Lily — Explained</span><span class="r">YUV.AI / ${String(++SC_N).padStart(2,'0')}</span><i></i>`,root,{color:fg});
  const tl=gsap.timeline();
  tl.set(root,{display:'block'},0).set(root,{display:'none'},t1-t0);
  if(!opts.nopunch)tl.fromTo(root,{scale:1.05},{scale:1,duration:.55,ease:'expo.out',transformOrigin:'50% 50%'},0);
  build({tl,root,z1:z[0],z2:z[1],z3:z[2],D:t1-t0,bg,fg});
  MASTER.add(tl,t0);
  return root;
}
// ---- captions
const CUES=[];
function cue(t0,t1,he,en,acc){CUES.push([t0,t1,he,en,acc])}
function words(html,rtl){
  const toks=[];let bold=false;
  html.split(/(<b>|<\/b>)/).forEach(p=>{
    if(p==='<b>')bold=true;else if(p==='</b>')bold=false;
    else p.split(/[ \t\n]+/).filter(Boolean).forEach(w=>toks.push({w,bold}));
  });
  const lat=w=>/[A-Za-z0-9]/.test(w)&&!/[\u0590-\u05FF]/.test(w);
  const out=[];
  toks.forEach(t=>{const l=out[out.length-1];if(rtl&&l&&lat(l.w)&&lat(t.w)&&l.bold===t.bold)l.w+=' '+t.w;else out.push({...t})});
  return out.map(t=>`<span class="w${t.bold?' bd':''}${rtl&&lat(t.w)?' lt':''}">${t.w}</span>`).join('');
}
function buildCues(){
  const caps=$('div',null,null,stage);caps.id='caps';
  CUES.forEach(([t0,t1,he,en,acc])=>{
    const c=$('div','cue',`<div class="he">${words(he,true)}</div><div class="en">${words(en)}</div>`,caps,{'--acc':acc||C.tom});
    const ws=c.querySelectorAll('.w');
    const tl=gsap.timeline();
    tl.set(c,{display:'block'},0).fromTo(c,{clipPath:'inset(0 100% 0 0)',rotate:-1.2},{clipPath:'inset(0 0% 0 0)',rotate:0,duration:.32,ease:'expo.out'},0)
      .fromTo(ws,{yPercent:70,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.4,stagger:.035,ease:'power3.out'},.06)
      .to(c,{clipPath:'inset(0 0 0 100%)',duration:.2,ease:'power3.in'},t1-t0-.2).set(c,{display:'none'},t1-t0);
    MASTER.add(tl,t0);
  });
}
// ---- transitions
const BOUNDS=[];
function wipe(t,kind,col){
  BOUNDS.push(t);
  const tr=document.getElementById('tr')||$('div',null,null,stage,{});tr.id='tr';
  const tl=gsap.timeline();
  if(kind==='L'||kind==='R'){
    const s=kind==='L'?1:-1,p=$('div','',null,tr,{background:col});
    tl.fromTo(p,{xPercent:100*s},{xPercent:0,duration:.22,ease:'power2.in'},t-.22).to(p,{xPercent:-100*s,duration:.26,ease:'power2.out'},t);
  }else if(kind==='U'){
    const p=$('div','',null,tr,{background:col});
    tl.fromTo(p,{yPercent:100},{yPercent:0,duration:.22,ease:'power2.in'},t-.22).to(p,{yPercent:-100,duration:.26,ease:'power2.out'},t);
  }else if(kind==='bars'){
    const n=6,bars=[];
    for(let i=0;i<n;i++)bars.push($('div','',null,tr,{background:col,left:i*W/n-1+'px',width:W/n+2+'px',transformOrigin:'50% 100%'}));
    tl.fromTo(bars,{scaleY:0},{scaleY:1,duration:.2,ease:'power2.in',stagger:.035},t-.3)
      .set(bars,{transformOrigin:'50% 0%'},t).to(bars,{scaleY:0,duration:.22,ease:'power2.out',stagger:.035},t+.01);
  }else if(kind==='iris'){
    const p=$('div','',null,tr,{background:col});
    tl.fromTo(p,{clipPath:'circle(0% at 50% 50%)',yPercent:0},{clipPath:'circle(78% at 50% 50%)',duration:.3,ease:'power2.in'},t-.3)
      .to(p,{yPercent:-100,duration:.24,ease:'power3.out'},t);
  }
  MASTER.add(tl,0);
}
// deterministic grain
let GR;
function buildGrain(){
  const cv=document.createElement('canvas');cv.width=cv.height=256;const g=cv.getContext('2d'),im=g.createImageData(256,256);
  let s=12345;const r=()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
  for(let i=0;i<256*256;i++){const v=200+r()*55|0;im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=v;im.data[i*4+3]=255}
  g.putImageData(im,0,0);
  GR=$('div',null,null,stage);GR.id='grain';GR.style.backgroundImage=`url(${cv.toDataURL()})`;
}
function hashj(f){const a=Math.sin(f*12.9898)*43758.5453;return a-Math.floor(a)}
// helper for loops
function loop(tl,at,n,fn,gap=0){const l=gsap.timeline({repeat:n-1,repeatDelay:gap});fn(l);tl.add(l,at);return l}
// ease inverse helper (time at which eased progress==p)
function easeAt(name,p){const f=gsap.parseEase(name);let lo=0,hi=1;for(let i=0;i<30;i++){const m=(lo+hi)/2;f(m)<p?lo=m:hi=m}return lo}
