// Burden objects that pile onto Lumi + swirling notification cards + the "order" formation.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { clamp, lerp, smooth, rng, canvasTex, roundRect, easeOutCubic, easeInCubic } from './util.js';

const HEB = '"Rubik", sans-serif';

function labelTex(w, h, bg, draw) {
  return canvasTex(w, h, (ctx) => { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); draw(ctx, w, h); });
}
function text(ctx, s, x, y, size, color, weight = 800, align = 'center', font = HEB) {
  ctx.font = `${weight} ${size}px ${font}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.direction = /[֐-׿]/.test(s) ? 'rtl' : 'ltr'; ctx.fillText(s, x, y);
}

// a set of item specs: [kind, label, color, size(w,h,d), labelColor, sub]
const ITEMS = [
  ['badge', '🔔', '#ff3b4e', [0.42, 0.42, 0.14], '#fff', '99+'],
  ['box', 'NEW MODEL', '#7b5cff', [0.62, 0.34, 0.42], '#fff', 'v6.0'],
  ['mail', '47', '#ffffff', [0.56, 0.36, 0.08], '#e83a4a', 'מיילים חדשים'],
  ['book', 'AGENTS', '#1f8fff', [0.66, 0.14, 0.46], '#fff', ''],
  ['book', 'MCP', '#ff8a00', [0.6, 0.13, 0.44], '#fff', ''],
  ['phone', '', '#15171c', [0.3, 0.56, 0.05], '#fff', ''],
  ['box', 'עוד כלי חדש!', '#00b37e', [0.7, 0.36, 0.4], '#fff', ''],
  ['badge', '📈', '#ffb400', [0.4, 0.4, 0.14], '#fff', 'טרנד!'],
  ['book', 'RAG', '#e8366d', [0.62, 0.12, 0.44], '#fff', ''],
  ['box', 'חייבים לדעת', '#ff4d6d', [0.74, 0.38, 0.42], '#fff', 'עכשיו!'],
  ['laptop', '', '#c9ced8', [0.8, 0.06, 0.55], '#fff', ''],
  ['badge', '⚠️', '#ff7a1a', [0.4, 0.4, 0.14], '#fff', 'עדכון'],
  ['book', 'PROMPTS', '#2bb6c4', [0.7, 0.13, 0.48], '#fff', ''],
  ['box', 'FOMO', '#e8243c', [0.86, 0.46, 0.5], '#fff', ''],
  ['badge', '💬', '#2f80ff', [0.4, 0.4, 0.14], '#fff', '312'],
  ['box', 'GPT-6?!', '#111827', [0.62, 0.34, 0.4], '#ffd23f', ''],
];

function itemMesh(spec) {
  const [kind, label, color, [w, h, d], lc, sub] = spec;
  const group = new THREE.Group();
  const side = new THREE.MeshPhysicalMaterial({ color, roughness: .38, clearcoat: .6, clearcoatRoughness: .25 });
  let face;
  if (kind === 'badge') {
    face = labelTex(256, 256, color, (ctx, W, H) => { ctx.font = `150px "Noto Color Emoji"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, W / 2, H / 2 + 6);
      if (sub) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(W - 62, 62, 52, 0, 7); ctx.fill(); text(ctx, sub, W - 62, 64, sub.length > 3 ? 26 : 38, '#e5243b', 900); } });
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(w, h) * 0.22), [side, side, side, side, new THREE.MeshPhysicalMaterial({ map: face, roughness: .3, clearcoat: .8 }), side]);
    group.add(m);
  } else if (kind === 'box') {
    face = labelTex(512, Math.round(512 * h / w), color, (ctx, W, H) => { text(ctx, label, W / 2, H * (sub ? 0.42 : 0.52), Math.min(H * 0.42, W / (label.length * 0.62)), lc, 900); if (sub) text(ctx, sub, W / 2, H * 0.78, H * 0.2, lc, 700); });
    const fm = new THREE.MeshPhysicalMaterial({ map: face, roughness: .35, clearcoat: .6 });
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, 0.04), [side, side, side, side, fm, fm]); group.add(m);
  } else if (kind === 'book') {
    const pages = new THREE.MeshStandardMaterial({ color: '#f4efe2', roughness: .9 });
    face = labelTex(512, 96, color, (ctx, W, H) => text(ctx, label, W / 2, H / 2 + 2, 60, lc, 900, 'center', '"Fredoka", sans-serif'));
    const spine = new THREE.MeshPhysicalMaterial({ map: face, roughness: .45, clearcoat: .4 });
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, 0.02), [pages, pages, side, side, spine, pages]); group.add(m);
  } else if (kind === 'mail') {
    face = labelTex(512, 330, '#ffffff', (ctx, W, H) => { ctx.strokeStyle = '#d9dee8'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(W / 2, H * 0.55); ctx.lineTo(W - 10, 10); ctx.stroke();
      ctx.fillStyle = '#e83a4a'; ctx.beginPath(); ctx.arc(W - 80, 80, 66, 0, 7); ctx.fill(); text(ctx, label, W - 80, 84, 70, '#fff', 900); text(ctx, sub, W / 2, H * 0.8, 46, '#2a3140', 700); });
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, 0.02), [side, side, side, side, new THREE.MeshPhysicalMaterial({ map: face, roughness: .6 }), side]); group.add(m);
  } else if (kind === 'phone') {
    face = labelTex(300, 560, '#0b0d12', (ctx, W, H) => {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2b2d6e'); g.addColorStop(1, '#c2408a'); ctx.fillStyle = g; roundRect(ctx, 12, 12, W - 24, H - 24, 34); ctx.fill();
      for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(255,255,255,0.85)'; roundRect(ctx, 26, 70 + i * 76, W - 52, 62, 14); ctx.fill(); ctx.fillStyle = ['#ff3b4e', '#2f80ff', '#00b37e', '#ffb400', '#7b5cff', '#ff7a1a'][i]; ctx.beginPath(); ctx.arc(W - 56, 101 + i * 76, 18, 0, 7); ctx.fill();
        ctx.fillStyle = '#5a6070'; ctx.fillRect(40, 88 + i * 76, 150, 10); ctx.fillRect(70, 108 + i * 76, 120, 8); }
    });
    const scr = new THREE.MeshBasicMaterial({ map: face, toneMapped: true });
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, 0.04), [side, side, side, side, scr, side]); group.add(m);
  } else if (kind === 'laptop') {
    const metal = new THREE.MeshPhysicalMaterial({ color: '#c9ced8', metalness: .9, roughness: .3 });
    const base = new THREE.Mesh(new RoundedBoxGeometry(w, d * 0.08, d, 3, 0.012), metal); group.add(base);
    face = labelTex(512, 340, '#0d1220', (ctx, W, H) => { ctx.fillStyle = '#1e2a44'; ctx.fillRect(0, 0, W, 36); ctx.font = '22px monospace'; ctx.fillStyle = '#6cf';
      for (let i = 0; i < 11; i++) { ctx.fillStyle = ['#6cf', '#ff6b8a', '#9be26b', '#ffd36b'][i % 4]; ctx.fillRect(24 + (i % 3) * 18, 56 + i * 25, 120 + ((i * 53) % 240), 12); } });
    const lid = new THREE.Mesh(new RoundedBoxGeometry(w, d * 0.66, 0.025, 3, 0.012), [metal, metal, metal, metal, new THREE.MeshBasicMaterial({ map: face }), metal]);
    lid.position.set(0, d * 0.33, -d / 2); lid.rotation.x = -0.25; group.add(lid);
  }
  group.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  group.userData.h = kind === 'laptop' ? 0.08 : h; group.userData.kind = kind; group.userData.face = face;
  return group;
}

export class Burden {
  constructor() {
    this.group = new THREE.Group();
    this.items = ITEMS.map((spec, i) => {
      const m = itemMesh(spec); this.group.add(m);
      const r = rng(100 + i);
      return { m, spec, drop: 0, rx: (r() - .5) * 0.5, ry: (r() - .5) * 1.4, rz: (r() - .5) * 0.4, ox: (r() - .5) * 0.18, oz: (r() - .5) * 0.14, h: m.userData.h };
    });
    // stack heights
    let y = 0;
    this.items.forEach((it, i) => { const h = it.spec[0] === 'badge' || it.spec[0] === 'mail' || it.spec[0] === 'phone' ? 0.16 : it.h; it.y = y + h / 2; y += h * 0.92; });
    this.totalH = y;
  }
  // times: array of drop times; anchor: Object3D (Lumi's head-top); t: now. release: [t0, t1] items fly away
  update(t, times, anchorPos, anchorQuat, release = null, cam = null) {
    let landed = 0, lastLand = -10;
    this.items.forEach((it, i) => {
      const td = times[i]; const m = it.m;
      if (t < td - 1.2) { m.visible = false; return; }
      m.visible = true;
      const local = new THREE.Vector3(it.ox, it.y, it.oz);
      const k = clamp((t - (td - 1.2)) / 1.2); // fall progress
      const fallH = (1 - easeInCubic(k)) * 7.5;
      // tumble while falling, settle on landing with a little bounce
      const after = t - td;
      const bounce = after > 0 ? Math.exp(-after * 7) * Math.sin(after * 22) * 0.06 : 0;
      local.y += fallH + Math.abs(bounce);
      const tumble = (1 - k) * 4;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(it.rx + tumble * 0.7, it.ry + tumble, it.rz + tumble * 0.4));
      local.applyQuaternion(anchorQuat).add(anchorPos);
      m.position.copy(local); m.quaternion.copy(anchorQuat).multiply(q);
      if (after >= 0) { landed++; lastLand = Math.max(lastLand, td); }
      if (release) {
        const rk = clamp((t - release[0] - i * 0.06) / (release[1] - release[0]));
        if (rk > 0) {
          const r = rng(500 + i); const dir = new THREE.Vector3((r() - .5) * 2, -0.6 - r(), (r() - .5) * 2).normalize();
          m.position.addScaledVector(dir, easeInCubic(rk) * 14);
          m.rotation.x += rk * 6 * (r() - .5); m.rotation.y += rk * 5;
          const s = 1 - smooth(0.5, 1.0, rk); m.scale.setScalar(Math.max(0.001, s));
        } else m.scale.setScalar(1);
      }
    });
    return { landed, lastLand };
  }
}

// notification toasts (2D cards in 3D)
const TOASTS = [
  ['🔔', 'התראה חדשה', 'יש לך 38 הודעות שלא נקראו'],
  ['🚀', 'יצא מודל חדש!', 'חובה לנסות היום'],
  ['⚡', 'עדכון גרסה 4.2', 'הכל השתנה. שוב.'],
  ['📣', 'אל תפספסו!', 'הוובינר מתחיל עכשיו'],
  ['🤖', 'כלי AI חדש', '10 דברים שחייבים לדעת'],
  ['📈', 'טרנד חם', 'כולם כבר משתמשים בזה'],
  ['⏰', 'דדליין!', 'נשארו 2 שעות'],
  ['💬', 'קבוצה (412)', 'ראית את זה?!'],
  ['🧠', 'Agents 2.0', 'המדריך המלא'],
  ['🔥', 'שובר שוויון', 'השוק משתנה'],
  ['📰', 'מבזק', 'עוד הכרזה גדולה'],
  ['❗', 'דחוף', 'תענה כמה שיותר מהר'],
];
function toastTex([icon, title, body], i) {
  return canvasTex(720, 220, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 18; ctx.fillStyle = 'rgba(255,255,255,0.96)'; roundRect(ctx, 14, 14, w - 28, h - 28, 40); ctx.fill(); ctx.shadowBlur = 0;
    const c = ['#ff3b4e', '#7b5cff', '#ff7a1a', '#2f80ff', '#00b37e', '#ffb400'][i % 6];
    ctx.fillStyle = c; roundRect(ctx, w - 186, 42, 136, 136, 34); ctx.fill();
    ctx.font = '84px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(icon, w - 118, 114);
    text(ctx, title, w - 214, 82, 54, '#131722', 800, 'right');
    text(ctx, body, w - 214, 148, 38, '#5b6476', 500, 'right');
    ctx.fillStyle = '#ff3b4e'; ctx.beginPath(); ctx.arc(52, 52, 18, 0, 7); ctx.fill();
  });
}

export class Toasts {
  constructor() {
    this.group = new THREE.Group();
    this.cards = TOASTS.map((spec, i) => {
      const tex = toastTex(spec, i);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.35), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: true, fog: false, color: new THREE.Color(0.92, 0.92, 0.92) }));
      m.renderOrder = 5; this.group.add(m);
      const r = rng(300 + i); return { m, a: r() * Math.PI * 2, rad: 1.4 + r() * 1.6, y: 0.6 + r() * 2.2, sp: 0.6 + r() * 0.9, t0: 0, tilt: (r() - .5) * 0.6, tex };
    });
  }
  // appear in sequence from t0 with spacing; swirl around centre; amount fades
  update(t, center, startT, spacing, camPos, amount = 1, chaos = 1) {
    this.cards.forEach((c, i) => {
      const ts = startT + i * spacing; const k = smooth(ts, ts + 0.35, t);
      if (k <= 0 || amount <= 0) { c.m.visible = false; return; }
      c.m.visible = true;
      const a = c.a + (t - ts) * c.sp * (0.6 + chaos * 0.8);
      const rad = c.rad * (0.6 + 0.4 * k) + Math.sin(t * 1.3 + i) * 0.2;
      c.m.position.set(center.x + Math.cos(a) * rad, center.y + c.y + Math.sin(t * 2.1 + i) * 0.15 * chaos, center.z + Math.sin(a) * rad * 0.7);
      c.m.lookAt(camPos); c.m.rotateZ(c.tilt * chaos + Math.sin(t * 3 + i) * 0.08 * chaos);
      const pop = 0.6 + 0.4 * Math.min(1, k * 1.3);
      c.m.scale.setScalar(pop * amount);
      c.m.material.opacity = k * amount;
    });
  }
}

// order: icons resolve into a calm, structured constellation with connecting light
export class Order {
  constructor() {
    this.group = new THREE.Group();
    const labels = [['🧠', 'מודלים'], ['🤖', 'סוכנים'], ['🔌', 'MCP'], ['📚', 'RAG'], ['✍️', 'פרומפטים'], ['🛠️', 'כלים'], ['📈', 'טרנדים'], ['🎯', 'מה חשוב']];
    this.nodes = labels.map(([ic, lb], i) => {
      const tex = canvasTex(360, 420, (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        const g = ctx.createRadialGradient(w / 2, 170, 20, w / 2, 170, 170); g.addColorStop(0, 'rgba(255,236,190,0.95)'); g.addColorStop(1, 'rgba(255,220,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.95)'; roundRect(ctx, 70, 60, 220, 220, 60); ctx.fill();
        ctx.strokeStyle = 'rgba(255,190,80,0.9)'; ctx.lineWidth = 6; roundRect(ctx, 70, 60, 220, 220, 60); ctx.stroke();
        ctx.font = '120px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ic, w / 2, 176);
        ctx.shadowColor = 'rgba(0,40,90,0.5)'; ctx.shadowBlur = 12; text(ctx, lb, w / 2, 350, 58, '#ffffff', 800);
      });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.9), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, side: THREE.DoubleSide }));
      this.group.add(m); return { m, i };
    });
    // hub
    const hubTex = canvasTex(512, 512, (ctx, w, h) => { const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,224,150,0.9)'); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); });
    this.hub = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: hubTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); this.group.add(this.hub);
    // connecting lines (thin glowing tubes rebuilt as straight cylinders)
    this.lines = this.nodes.map(() => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 6, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.0, 1.6, 0.9), transparent: true, depthWrite: false, fog: false, toneMapped: false })); this.group.add(m); return m; });
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(12, 0.08, 8, 160), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.8, 1.0), transparent: true, fog: false, toneMapped: false })); this.ring.rotation.x = Math.PI / 2; this.group.add(this.ring);
  }
  update(t, k, camPos) {
    // k: 0 scattered/hidden -> 1 ordered
    const n = this.nodes.length;
    this.group.visible = k > 0.001;
    const R = 12;
    this.nodes.forEach(({ m, i }) => {
      const a = i / n * Math.PI * 2 + t * 0.05;
      const r = rng(900 + i);
      const scat = new THREE.Vector3((r() - .5) * 40, (r() - .2) * 14, (r() - .5) * 40);
      const ord = new THREE.Vector3(Math.cos(a) * R, 0, Math.sin(a) * R);
      const kk = smooth(i * 0.04, 0.7 + i * 0.04, k);
      m.position.copy(scat.lerp(ord, kk));
      m.lookAt(camPos);
      m.material.opacity = smooth(0, 0.25, k);
      m.scale.setScalar(0.6 + 0.4 * kk);
      const L = this.lines[i]; const dir = m.position.clone(); const len = dir.length();
      L.position.copy(dir.clone().multiplyScalar(0.5)); L.scale.set(1, len, 1);
      L.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      L.material.opacity = smooth(0.55, 0.95, k) * 0.9;
    });
    this.hub.lookAt(camPos); this.hub.material.opacity = smooth(0.5, 1, k);
    this.ring.material.opacity = smooth(0.6, 1, k) * 0.8; this.ring.scale.setScalar(0.6 + 0.4 * smooth(0.6, 1, k));
  }
}
