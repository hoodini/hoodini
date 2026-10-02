// "Lumi" — the little doodle character, built entirely from code.
import * as THREE from 'three';
import { clamp, lerp, smooth, canvasTex } from './util.js';

const BODY = '#FFB892';

function softBodyMaterial() {
  const m = new THREE.MeshPhysicalMaterial({
    color: BODY, roughness: 0.6, metalness: 0,
    sheen: 1, sheenColor: new THREE.Color('#ffd9c4'), sheenRoughness: 0.5,
    clearcoat: 0.08, clearcoatRoughness: 0.6,
  });
  // fake subsurface: warm wrap lighting + rim
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      float rim = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0), 2.5);
      totalEmissiveRadiance += vec3(1.0, 0.55, 0.42) * rim * 0.16 + vec3(0.09, 0.035, 0.02);`);
  };
  return m;
}

function bodyBumpTex() {
  // subtle fuzzy/felt micro texture
  return canvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 26000; i++) {
      const x = Math.random() * w, y = Math.random() * h, g = 100 + Math.random() * 60;
      ctx.fillStyle = `rgba(${g},${g},${g},0.35)`; ctx.fillRect(x, y, 1.5, 1.5);
    }
  }, { linear: true, repeat: [3, 3] });
}

export class Character {
  constructor() {
    this.root = new THREE.Group();
    this.pivot = new THREE.Group(); // squash/lean
    this.root.add(this.pivot);
    const bodyMat = softBodyMaterial();
    bodyMat.bumpMap = bodyBumpTex(); bodyMat.bumpScale = 0.6;
    this.bodyMat = bodyMat;

    // body (egg)
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 96, 64), bodyMat);
    body.scale.set(1.0, 1.06, 0.94); body.position.y = 0.56; body.castShadow = true; body.receiveShadow = true;
    this.pivot.add(body); this.body = body;

    // face group (so expressions sit on the surface)
    this.face = new THREE.Group(); this.face.position.set(0, 0.66, 0); this.pivot.add(this.face);

    const eyeMat = new THREE.MeshPhysicalMaterial({ color: '#1b1420', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03, metalness: 0 });
    const hiMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const lidMat = bodyMat;
    this.eyes = [];
    for (const sx of [-1, 1]) {
      const g = new THREE.Group(); g.position.set(0.165 * sx, 0.02, 0.405); g.rotation.y = 0.32 * sx; g.rotation.x = -0.05;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.088, 48, 32), eyeMat); eye.scale.set(0.95, 1.18, 0.55);
      g.add(eye);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.05, 32, 16), new THREE.MeshPhysicalMaterial({ color: '#3a2a55', roughness: .2, clearcoat: 1 }));
      iris.scale.set(1, 1.15, 0.3); iris.position.set(0, -0.012, 0.042); g.add(iris);
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), hiMat); h1.position.set(-0.026 * sx - 0.004, 0.04, 0.05); g.add(h1);
      const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 8), hiMat); h2.position.set(0.024 * sx, -0.035, 0.05); g.add(h2);
      // eyelid: hemisphere shell that rotates down
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.097, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), lidMat);
      lid.scale.set(1.02, 1.22, 0.8); lid.rotation.x = -1.45; // open
      g.add(lid);
      // brow
      const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.075, 6, 12), new THREE.MeshStandardMaterial({ color: '#7a4a3a', roughness: .8 }));
      brow.rotation.z = Math.PI / 2; brow.position.set(0, 0.155, 0.02); g.add(brow);
      this.face.add(g);
      this.eyes.push({ g, eye, iris, lid, brow, sx, h1, h2 });
    }
    // cheeks
    const cheekMat = new THREE.MeshBasicMaterial({ color: '#ff8a8a', transparent: true, opacity: 0.45, depthWrite: false });
    this.cheeks = [];
    for (const sx of [-1, 1]) {
      const c = new THREE.Mesh(new THREE.CircleGeometry(0.055, 24), cheekMat);
      c.position.set(0.29 * sx, -0.11, 0.36); c.rotation.y = 0.62 * sx; c.scale.set(1.3, 0.8, 1); this.face.add(c); this.cheeks.push(c);
    }
    // mouth (rebuilt per expression)
    this.mouthMat = new THREE.MeshStandardMaterial({ color: '#5a2630', roughness: .5 });
    this.mouth = new THREE.Mesh(new THREE.BufferGeometry(), this.mouthMat); this.face.add(this.mouth);
    this.mouthInner = new THREE.Mesh(new THREE.CircleGeometry(0.04, 24), new THREE.MeshStandardMaterial({ color: '#7a2a3a', roughness: .6 }));
    this.face.add(this.mouthInner);

    // sprout on head
    const leafMat = new THREE.MeshPhysicalMaterial({ color: '#5DBB4A', roughness: .45, side: THREE.DoubleSide, sheen: .5, sheenColor: new THREE.Color('#d8ffb0') });
    const stemCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.0, 0.1, -0.01), new THREE.Vector3(0.03, 0.17, 0));
    this.sprout = new THREE.Group(); this.sprout.position.set(0, 1.08, -0.02); this.pivot.add(this.sprout);
    const stem = new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 16, 0.013, 8), leafMat); this.sprout.add(stem);
    const leafShape = new THREE.Shape(); leafShape.moveTo(0, 0); leafShape.quadraticCurveTo(0.07, 0.05, 0.16, 0); leafShape.quadraticCurveTo(0.07, -0.05, 0, 0);
    const leafGeo = new THREE.ShapeGeometry(leafShape, 16);
    const pos = leafGeo.attributes.position; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i); pos.setZ(i, -Math.pow(x / 0.16, 2) * 0.03 + Math.abs(pos.getY(i)) * 0.4); } leafGeo.computeVertexNormals();
    this.leaves = [];
    for (const sx of [-1, 1]) {
      const l = new THREE.Mesh(leafGeo, leafMat); l.position.set(0.03, 0.17, 0); l.rotation.set(0, sx > 0 ? 0 : Math.PI, 0.45); l.castShadow = true;
      this.sprout.add(l); this.leaves.push(l);
    }

    // arms
    this.arms = [];
    for (const sx of [-1, 1]) {
      const a = new THREE.Group(); a.position.set(0.44 * sx, 0.5, 0.02);
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.17, 8, 16), bodyMat); m.position.y = -0.1; m.castShadow = true;
      a.add(m); a.rotation.z = 0.35 * sx; this.pivot.add(a); this.arms.push(a);
    }
    // feet (on root, not squashed)
    this.feet = [];
    for (const sx of [-1, 1]) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.11, 32, 16), bodyMat); f.scale.set(1, 0.6, 1.35);
      f.position.set(0.19 * sx, 0.06, 0.05); f.castShadow = true; this.root.add(f); this.feet.push(f);
    }
    // tears
    const tearMat = new THREE.MeshPhysicalMaterial({ color: '#bfe7ff', roughness: 0, transmission: 0.6, thickness: .05, clearcoat: 1, transparent: true, opacity: .9 });
    this.tears = [];
    for (let i = 0; i < 6; i++) { const t = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), tearMat); t.scale.set(1, 1.4, 1); t.visible = false; this.pivot.add(t); this.tears.push(t); }

    this.root.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
    this.cheeks.forEach(c => c.castShadow = false);
    this.expr = { smile: 1, open: 0, lid: 0, worry: 0, look: [0, 0], blush: 1, cry: 0 };
    this.setMouth(1, 0);
  }

  setMouth(smile, open) {
    // smile: 1 happy, 0 flat, -1 frown
    const w = 0.07 + 0.02 * Math.abs(smile);
    const y0 = -0.13, c = -smile * 0.045;
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-w, y0 + smile * 0.012, 0.448), new THREE.Vector3(0, y0 + c * 1.6, 0.47), new THREE.Vector3(w, y0 + smile * 0.012, 0.448));
    this.mouth.geometry.dispose();
    this.mouth.geometry = new THREE.TubeGeometry(curve, 20, 0.0105, 8);
    this.mouthInner.visible = open > 0.02;
    this.mouthInner.position.set(0, y0 + c * 0.9 - 0.012, 0.462);
    this.mouthInner.scale.set(1.1 * (0.6 + open * 0.6), open * 0.9, 1);
  }

  // expression + pose update. p = {time, walk, walkSpeed, squash, hunch, sit, look, ...}
  update(t, p = {}) {
    const e = Object.assign({ smile: 1, open: 0, lid: 0, worry: 0, blush: 1, cry: 0, look: [0, 0], blink: true }, p.expr || {});
    // blink
    let blink = 0;
    if (e.blink) { const bp = (t + 0.37) % 3.1; blink = bp < 0.14 ? Math.sin(bp / 0.14 * Math.PI) : 0; }
    const lid = clamp(Math.max(e.lid, blink));
    for (const E of this.eyes) {
      E.lid.rotation.x = lerp(-1.55, 1.5, lid) + e.worry * 0.25;
      E.lid.rotation.z = e.worry * 0.35 * E.sx;
      E.brow.rotation.z = Math.PI / 2 - E.sx * (0.08 + e.worry * 0.42);
      E.brow.position.y = 0.155 + e.worry * 0.02 - lid * 0.02;
      E.iris.position.x = e.look[0] * 0.02; E.iris.position.y = -0.012 + e.look[1] * 0.02;
      E.h1.visible = E.h2.visible = lid < 0.8;
    }
    this.cheeks.forEach(c => c.material.opacity = 0.42 * e.blush);
    this.setMouth(e.smile, e.open);

    // pose
    const walk = p.walk || 0, ph = (p.walkPhase ?? t * 7.5);
    const bob = Math.abs(Math.sin(ph)) * 0.05 * walk;
    const squash = p.squash || 0; // + = squashed
    const sy = 1 - squash * 0.35 + bob * 0.6, sxz = 1 + squash * 0.25;
    this.pivot.scale.set(sxz, sy, sxz);
    this.pivot.position.y = bob - (p.sink || 0);
    this.pivot.rotation.x = (p.hunch || 0) * 0.45 + Math.sin(ph) * 0.03 * walk;
    this.pivot.rotation.z = Math.sin(ph) * 0.06 * walk + (p.sway || 0);
    this.feet.forEach((f, i) => {
      const s = i ? 1 : -1, k = Math.sin(ph + (i ? Math.PI : 0));
      f.position.z = 0.05 + k * 0.13 * walk; f.position.y = 0.06 + Math.max(0, k) * 0.07 * walk;
      f.position.x = 0.19 * s * (1 + (p.sit || 0) * 0.5);
      f.rotation.x = -k * 0.3 * walk;
      f.rotation.y = (p.sit || 0) * 0.5 * s;
    });
    this.arms.forEach((a, i) => {
      const s = i ? 1 : -1, k = Math.sin(ph + (i ? 0 : Math.PI));
      a.rotation.x = k * 0.5 * walk + (p.armsFwd || 0);
      a.rotation.z = s * (0.35 + (p.armsUp || 0) * 1.9 - (p.armsDown || 0) * 0.3) + (i === 1 ? (p.wave || 0) * Math.sin(t * 14) * 0.35 : 0);
    });
    this.sprout.rotation.z = Math.sin(t * 2.3) * 0.08 + (p.sproutDroop || 0) * 0.9;
    this.sprout.rotation.x = (p.sproutDroop || 0) * 0.4 + (p.wind || 0) * Math.sin(t * 9) * 0.25;
    this.leaves.forEach((l, i) => l.rotation.z = 0.45 - (p.sproutDroop || 0) * 0.9 + Math.sin(t * 3 + i) * 0.06);

    // tears
    const cry = e.cry;
    this.tears.forEach((tr, i) => {
      if (cry <= 0.01) { tr.visible = false; return; }
      const side = i % 2 ? 1 : -1, per = 1.1, off = (i >> 1) * per / 3;
      const k = ((t + off) % per) / per;
      tr.visible = true;
      tr.position.set(side * (0.19 + k * 0.08), 0.6 - k * k * 0.42, 0.39 - k * 0.02);
      const s = cry * (0.7 + 0.5 * Math.sin(k * Math.PI));
      tr.scale.set(s, s * 1.4, s);
    });
  }
}
