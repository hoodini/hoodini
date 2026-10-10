// v4 "Home by 6" — illustration kit. One palette, one shape language:
// flat vector, no outlines, rounded geometry, one same-hue shade per surface.
const C = {
  cream:'#FFF7EC', paper:'#FFFFFF', line:'#EFE6D8', ink:'#1F1B3A', ink2:'#6A6488',
  night:'#2B2660', night2:'#221E4E', night3:'#37307A',
  pu:'#7B5CF0', puS:'#5E42D6', puT:'#ECE6FF',
  co:'#FF7A5C', coS:'#E9603F', coT:'#FFE4DC',
  su:'#FFC94A', suS:'#EFB02B', suT:'#FFF1CC',
  mi:'#34C9A0', miS:'#22A884', miT:'#D8F6EC',
  skin:'#EBA985', skinS:'#D98F6A', hair:'#2A2346'
};

/* ---------- Dana (front, behind a laptop) ---------- */
const DANA = (id='dana') => `
<svg id="${id}" viewBox="0 0 420 470" width="420" height="470" style="overflow:visible">
  <g class="body">
    <path d="M70,470 C70,360 120,300 210,300 C300,300 350,360 350,470 Z" fill="${C.pu}"/>
    <path d="M210,300 C300,300 350,360 350,470 L290,470 C290,390 262,330 210,318 Z" fill="${C.puS}" opacity=".55"/>
    <path d="M168,300 L210,352 L252,300 Z" fill="${C.puS}"/>
    <rect x="186" y="262" width="48" height="48" rx="14" fill="${C.skinS}"/>
  </g>
  <g class="head">
    <circle cx="210" cy="112" r="40" fill="${C.hair}"/>
    <ellipse cx="136" cy="192" rx="14" ry="20" fill="${C.skinS}"/><ellipse cx="284" cy="192" rx="14" ry="20" fill="${C.skinS}"/>
    <ellipse cx="210" cy="190" rx="76" ry="84" fill="${C.skin}"/>
    <path d="M134,176 C134,120 170,98 210,98 C258,98 290,126 288,176 C270,150 236,136 210,140 C182,144 150,156 134,176 Z" fill="${C.hair}"/>
    <ellipse cx="170" cy="222" rx="14" ry="8" fill="${C.co}" opacity=".35"/><ellipse cx="250" cy="222" rx="14" ry="8" fill="${C.co}" opacity=".35"/>
    <g class="brows"><rect class="browL" x="160" y="160" width="26" height="7" rx="3.5" fill="${C.hair}"/><rect class="browR" x="234" y="160" width="26" height="7" rx="3.5" fill="${C.hair}"/></g>
    <g class="eyes"><ellipse class="eye" cx="178" cy="192" rx="6.5" ry="8" fill="${C.ink}"/><ellipse class="eye" cx="242" cy="192" rx="6.5" ry="8" fill="${C.ink}"/></g>
    <g fill="none" stroke="${C.ink}" stroke-width="5"><circle cx="178" cy="192" r="24"/><circle cx="242" cy="192" r="24"/><path d="M202,190 C206,184 214,184 218,190"/></g>
    <path class="m-flat" d="M194,238 L226,238" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path class="m-worry" d="M192,244 C200,234 220,234 228,244" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/>
    <path class="m-smile" d="M188,232 C198,250 222,250 232,232" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" fill="${C.paper}" opacity="0"/>
  </g>
</svg>`;

const LAPTOP = (glow=true) => `
<svg viewBox="0 0 520 300" width="520" height="300" style="overflow:visible">
  ${glow?`<ellipse cx="260" cy="-40" rx="260" ry="120" fill="${C.puT}" opacity=".14"/>`:''}
  <path d="M40,10 Q40,0 50,0 L470,0 Q480,0 480,10 L480,250 L40,250 Z" fill="#DCDDEA"/>
  <path d="M260,0 L470,0 Q480,0 480,10 L480,250 L260,250 Z" fill="#C9CADB"/>
  <circle cx="260" cy="125" r="18" fill="#C4C5D8"/>
  <path d="M0,250 L520,250 L500,290 Q498,300 486,300 L34,300 Q22,300 20,290 Z" fill="#B9BACE"/>
</svg>`;

/* ---------- Rubber duck (the sidekick) ---------- */
const DUCK = (s=1) => `
<svg class="duck" viewBox="0 0 200 180" width="${200*s}" height="${180*s}" style="overflow:visible">
  <ellipse cx="100" cy="176" rx="74" ry="8" fill="${C.ink}" opacity=".12"/>
  <path d="M30,120 C30,86 60,74 96,80 L150,80 C176,80 186,104 176,130 C168,156 140,172 100,172 C58,172 30,152 30,120 Z" fill="${C.su}"/>
  <path d="M40,138 C60,160 120,168 168,138 C160,160 134,172 100,172 C66,172 44,158 40,138 Z" fill="${C.suS}"/>
  <circle cx="118" cy="62" r="42" fill="${C.su}"/>
  <path d="M150,70 C176,64 192,70 190,80 C186,90 164,90 150,86 Z" fill="${C.co}"/>
  <ellipse class="deye" cx="128" cy="54" rx="6" ry="7.5" fill="${C.ink}"/>
  <path class="wing" d="M58,112 C58,96 86,94 104,108 C96,128 70,132 58,112 Z" fill="${C.suS}"/>
  <path class="sweat" d="M84,24 C90,34 94,40 90,46 C86,52 78,48 80,40 C80,34 82,30 84,24 Z" fill="#9FD8F0" opacity="0"/>
</svg>`;

/* ---------- Rooms ---------- */
const CLOCK = (cls='clk') => `
<svg class="${cls}" viewBox="-60 -60 120 120" width="170" height="170">
  <circle r="56" fill="${C.paper}"/><circle r="56" fill="none" stroke="${C.night3}" stroke-width="6"/>
  ${Array.from({length:12},(_,i)=>`<rect x="-2" y="-50" width="4" height="${i%3?7:12}" rx="2" fill="${C.ink}" transform="rotate(${i*30})"/>`).join('')}
  <rect class="hh" x="-3.5" y="-30" width="7" height="34" rx="3.5" fill="${C.ink}"/>
  <rect class="mh" x="-2.5" y="-44" width="5" height="48" rx="2.5" fill="${C.co}"/>
  <circle r="5" fill="${C.ink}"/>
</svg>`;

let _room=0;
function ROOM(mode){ // mode: 'night' | 'day'
  const n = mode==='night'; const cid='wclip'+(++_room);
  const wall = n?C.night:C.suT, wall2 = n?C.night2:'#FBE6BF';
  const sky = n?`<rect width="560" height="420" fill="${C.night2}"/>${[[60,60],[180,40],[420,90],[500,50],[300,120],[120,150]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="${C.suT}"/>`).join('')}<circle cx="430" cy="110" r="46" fill="${C.suT}"/><circle cx="452" cy="96" r="40" fill="${C.night2}"/>`
                : `<rect width="560" height="420" fill="#FFD9A8"/><rect y="220" width="560" height="200" fill="#FFB98A"/><circle class="sun" cx="280" cy="250" r="70" fill="${C.su}"/>`;
  const city = Array.from({length:8},(_,i)=>{const h=110+((i*47)%140);return `<rect x="${i*72}" y="${420-h}" width="64" height="${h}" fill="${n?'#1A1740':'#E59A70'}"/>${Array.from({length:6},(_,k)=>((i+k)%3===0)?`<rect x="${i*72+10+(k%2)*26}" y="${420-h+16+Math.floor(k/2)*26}" width="14" height="14" rx="2" fill="${n?C.su:C.suT}"/>`:'').join('')}`}).join('');
  return `
  <div class="room" style="position:absolute;inset:0;background:${wall}">
    <div style="position:absolute;left:0;right:0;top:760px;bottom:0;background:${wall2}"></div>
    <svg style="position:absolute;left:1180px;top:130px" width="600" height="460"><rect x="0" y="0" width="600" height="460" rx="26" fill="${n?C.night3:'#F4C98C'}"/><svg x="20" y="20" width="560" height="420"><clipPath id="${cid}"><rect width="560" height="420" rx="14"/></clipPath><g clip-path="url(#${cid})">${sky}${city}</g></svg><rect x="292" y="20" width="16" height="420" fill="${n?C.night3:'#F4C98C'}"/></svg>
    <div style="position:absolute;left:170px;top:150px">${CLOCK('clk')}</div>
    <svg style="position:absolute;left:1560px;top:560px" width="200" height="220"><rect x="60" y="120" width="80" height="90" rx="16" fill="${C.co}"/><path d="M100,120 C60,90 40,40 70,20 C90,50 96,80 100,120 C104,70 120,30 150,30 C160,70 140,100 100,120 Z" fill="${C.mi}"/><path d="M100,120 C104,70 120,30 150,30 C160,70 140,100 100,120 Z" fill="${C.miS}"/></svg>
    <div style="position:absolute;left:0;right:0;top:740px;height:40px;background:${n?'#3E3685':'#E9B878'}"></div>
    ${n?`<svg style="position:absolute;left:300px;top:250px" width="260" height="520"><rect x="120" y="60" width="12" height="440" rx="6" fill="${C.night3}"/><path d="M70,70 L190,70 L160,10 L100,10 Z" fill="${C.su}"/><path d="M70,70 L190,70 L330,480 L-70,480 Z" fill="${C.su}" opacity=".10"/></svg>`:''}
  </div>`;
}

/* ---------- Little people ---------- */
const MIA = () => `
<svg viewBox="0 0 360 300" width="360" height="300" style="overflow:visible">
  <rect x="150" y="90" width="210" height="130" rx="18" fill="${C.ink}"/>
  <rect x="160" y="170" width="190" height="34" rx="6" fill="${C.paper}"/>
  ${Array.from({length:9},(_,i)=>`<rect x="${172+i*20}" y="170" width="10" height="20" rx="2" fill="${C.ink}"/>`).join('')}
  <rect x="170" y="220" width="12" height="70" fill="${C.ink}"/><rect x="330" y="220" width="12" height="70" fill="${C.ink}"/>
  <g class="kid">
   <circle cx="70" cy="70" r="34" fill="${C.hair}"/><circle cx="36" cy="54" r="18" fill="${C.hair}"/><circle cx="104" cy="54" r="18" fill="${C.hair}"/>
   <ellipse cx="72" cy="92" rx="34" ry="36" fill="${C.skin}"/>
   <circle cx="62" cy="92" r="4.5" fill="${C.ink}"/><circle cx="84" cy="92" r="4.5" fill="${C.ink}"/>
   <path class="kmouth" d="M64,108 C70,116 78,116 84,108" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
   <path d="M30,230 C30,160 50,130 72,130 C94,130 116,160 116,230 Z" fill="${C.su}"/>
   <rect class="arm" x="100" y="150" width="70" height="18" rx="9" fill="${C.skin}"/>
  </g>
</svg>`;

const DANA_BACK = () => `
<svg viewBox="0 0 300 320" width="300" height="320" style="overflow:visible">
  <path d="M30,320 C30,230 80,190 150,190 C220,190 270,230 270,320 Z" fill="${C.pu}"/>
  <circle cx="150" cy="120" r="72" fill="${C.hair}"/><circle cx="150" cy="40" r="34" fill="${C.hair}"/>
  <ellipse cx="80" cy="130" rx="12" ry="18" fill="${C.skinS}"/><ellipse cx="220" cy="130" rx="12" ry="18" fill="${C.skinS}"/>
  <g class="clapL"><ellipse cx="96" cy="200" rx="22" ry="16" fill="${C.skin}"/></g><g class="clapR"><ellipse cx="204" cy="200" rx="22" ry="16" fill="${C.skin}"/></g>
</svg>`;

/* ---------- UI kit (illustrative, light) ---------- */
const DOTS = `<span style="display:inline-flex;gap:9px"><i style="width:14px;height:14px;border-radius:50%;background:${C.co}"></i><i style="width:14px;height:14px;border-radius:50%;background:${C.su}"></i><i style="width:14px;height:14px;border-radius:50%;background:${C.mi}"></i></span>`;
const WIN = (title, inner, w, h, extra='') => `<div class="win" style="width:${w}px;height:${h}px;${extra}"><div class="wbar">${DOTS}<span>${title}</span></div><div class="wbody">${inner}</div></div>`;
const ICO = n => `<span class="ico">${ICON[n]}</span>`;
const PILL = (t, bg, fg) => `<span class="pill" style="background:${bg};color:${fg}">${t}</span>`;
