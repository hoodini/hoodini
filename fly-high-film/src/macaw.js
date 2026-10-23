// Procedural blue-and-gold macaw. Coordinates: +z = forward (beak), +y up, +x = bird's left.
import * as THREE from 'three';
import { clamp, lerp, smooth, canvasTex } from './util.js';

function featherPath(ctx, w, h) {
  ctx.beginPath(); ctx.moveTo(w * 0.42, h);
  ctx.bezierCurveTo(w * 0.1, h * 0.9, w * 0.04, h * 0.75, w * 0.05, h * 0.5);
  ctx.lineTo(w * 0.06, h * 0.16);
  ctx.bezierCurveTo(w * 0.08, h * 0.0, w * 0.92, h * 0.0, w * 0.95, h * 0.14);
  ctx.lineTo(w * 0.96, h * 0.5);
  ctx.bezierCurveTo(w * 0.96, h * 0.75, w * 0.9, h * 0.9, w * 0.58, h); ctx.closePath();
}
function featherTex() {
  return canvasTex(128, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // vane silhouette
    ctx.save();
    featherPath(ctx, w, h); ctx.clip();
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#5a5a66'); g.addColorStop(0.18, '#d8d8d8'); g.addColorStop(1, '#ffffff');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // barbs
    ctx.globalAlpha = 0.18; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
    for (let y = 8; y < h; y += 5) { ctx.beginPath(); ctx.moveTo(w / 2, y + 12); ctx.lineTo(0, y); ctx.moveTo(w / 2, y + 12); ctx.lineTo(w, y); ctx.stroke(); }
    // edge darkening
    ctx.globalAlpha = 0.35; const eg = ctx.createRadialGradient(w / 2, h * 0.5, w * 0.2, w / 2, h * 0.5, w * 0.8);
    eg.addColorStop(0, 'rgba(0,0,0,0)'); eg.addColorStop(1, 'rgba(0,0,0,1)'); ctx.fillStyle = eg; ctx.fillRect(0, 0, w, h);
    ctx.restore();
    // rachis
    ctx.globalAlpha = 0.5; ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w / 2, h); ctx.lineTo(w / 2, 6); ctx.stroke();
  });
}
function featherAlpha() {
  return canvasTex(128, 512, (ctx, w, h) => {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fff'; featherPath(ctx, w, h); ctx.fill();
  }, { linear: true });
}

function twoToneMat(top, bottom, map, alpha, opts = {}) {
  const m = new THREE.MeshStandardMaterial({ map, alphaMap: alpha, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.05, color: '#ffffff', ...opts });
  m.userData.top = { value: new THREE.Color(top) }; m.userData.bottom = { value: new THREE.Color(bottom) };
  m.onBeforeCompile = (s) => {
    s.uniforms.uTop = m.userData.top; s.uniforms.uBot = m.userData.bottom;
    s.fragmentShader = 'uniform vec3 uTop; uniform vec3 uBot;\n' + s.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      diffuseColor.rgb *= gl_FrontFacing ? uTop : uBot;`).replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      // iridescent sheen on top side
      float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 3.0);
      totalEmissiveRadiance += (gl_FrontFacing ? uTop * 0.18 : uBot * 0.08) * fres;`);
  };
  return m;
}

// feather geometry: base at origin, extends to -z (length L), width W, slight curve
function featherGeo(W, L, curl = 0.08) {
  const g = new THREE.PlaneGeometry(W, L, 2, 10);
  g.rotateX(-Math.PI / 2); // lies in xz, normal +y
  g.translate(0, 0, -L / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const z = p.getZ(i), x = p.getX(i), u = -z / L;
    p.setY(i, -curl * L * u * u + Math.abs(x) * -0.15);
  }
  // uv: v=0 at tip -> flip so base = bottom of texture (v=0) and tip = top (v=1)
  g.computeVertexNormals();
  return g;
}

export class Macaw {
  constructor() {
    this.root = new THREE.Group();
    this.body = new THREE.Group(); this.root.add(this.body);
    const fTex = featherTex(), fA = featherAlpha();

    // ---- body: lofted along a spine (tail -> face) with vertex colours
    const N = 120, M = 64;
    const prof = [ // u, z, y, rx, ry
      [0.00, -0.44, 0.015, 0.045, 0.035], [0.10, -0.36, 0.01, 0.10, 0.085], [0.25, -0.22, 0.0, 0.165, 0.175],
      [0.42, -0.05, 0.0, 0.19, 0.205], [0.58, 0.10, 0.03, 0.17, 0.185], [0.70, 0.20, 0.08, 0.125, 0.135],
      [0.78, 0.26, 0.13, 0.118, 0.125], [0.86, 0.32, 0.165, 0.128, 0.13], [0.93, 0.38, 0.175, 0.115, 0.118],
      [0.975, 0.425, 0.168, 0.085, 0.09], [1.0, 0.445, 0.16, 0.0, 0.0]];
    const sample = (u) => { for (let i = 0; i < prof.length - 1; i++) { const a = prof[i], b = prof[i + 1]; if (u <= b[0]) { let k = (u - a[0]) / (b[0] - a[0]); k = k * k * (3 - 2 * k); return a.map((v, j) => v + (b[j] - v) * k); } } return prof[prof.length - 1]; };
    const pos = [], colors = [], uvs = [], idx = [];
    const cBlue = new THREE.Color('#0b62bb'), cTeal = new THREE.Color('#11a5d0'), cGold = new THREE.Color('#ffae17'), cGold2 = new THREE.Color('#ffd040');
    const cGreen = new THREE.Color('#86c43e'), cWhite = new THREE.Color('#f6f3ee'), cBlack = new THREE.Color('#151515');
    const tmp = new THREE.Color();
    for (let i = 0; i <= N; i++) {
      let u = i / N; u = 1 - Math.pow(1 - u, 1.15);
      const [, z, y, rx0, ry0] = sample(u);
      const capF = u > 0.975 ? Math.sqrt(Math.max(0, 1 - Math.pow((u - 0.975) / 0.025, 2))) : 1;
      const rx = Math.max(rx0, 0.0001), ry = Math.max(ry0, 0.0001);
      for (let j = 0; j <= M; j++) {
        const th = j / M * Math.PI * 2; // 0 = top
        const sx = Math.sin(th), cy = Math.cos(th);
        // flatter belly, rounder back
        const bel = cy < 0 ? 1 + cy * 0.06 : 1;
        pos.push(sx * rx * bel, y + cy * ry * bel, z);
        uvs.push(j / M * 4, u * 6);
        const dors = Math.abs(((th + Math.PI) % (2 * Math.PI)) - Math.PI); // 0 top .. PI bottom
        const under = smooth(1.55, 2.2, dors);
        tmp.copy(cBlue).lerp(cTeal, smooth(0.2, 0.7, u) * 0.75 * (1 - smooth(0.8, 0.9, u)));
        tmp.lerp(cGold, under * smooth(0.12, 0.25, u) * (1 - smooth(0.66, 0.72, u)));
        tmp.lerp(cGold2, under * 0.35 * smooth(0.45, 0.65, u) * (1 - smooth(0.66, 0.72, u)));
        tmp.lerp(cGreen, smooth(0.8, 0.88, u) * (1 - smooth(0.7, 1.25, dors)));
        const faceSide = smooth(0.85, 1.25, dors) * (1 - smooth(2.15, 2.5, dors));
        tmp.lerp(cWhite, smooth(0.84, 0.9, u) * faceSide);
        tmp.lerp(cBlack, smooth(0.68, 0.74, u) * (1 - smooth(0.84, 0.88, u)) * smooth(2.0, 2.5, dors));
        tmp.lerp(cWhite, smooth(0.955, 0.975, u) * 0.6);
        colors.push(tmp.r, tmp.g, tmp.b);
      }
    }
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b = a + M + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    bg.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    bg.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    bg.setIndex(idx); bg.computeVertexNormals();
    this._sample = sample;
    const bodyBump = canvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, w, h);
      for (let row = 0; row < 34; row++) for (let colI = 0; colI < 18; colI++) {
        const x = colI * 30 + (row % 2) * 15, y = row * 16;
        const g = ctx.createRadialGradient(x, y + 2, 1, x, y + 6, 16); g.addColorStop(0, '#b4b4b4'); g.addColorStop(0.8, '#8a8a8a'); g.addColorStop(1, '#5a5a5a');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y + 6, 15, 12, 0, 0, Math.PI); ctx.fill();
      }
    }, { linear: true, repeat: [1, 1] });
    bodyBump.wrapS = bodyBump.wrapT = THREE.RepeatWrapping;
    const bodyMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.6, bumpMap: bodyBump, bumpScale: 1.6, sheen: 0.8, sheenColor: new THREE.Color('#bdf0ff'), sheenRoughness: 0.35 });
    const torso = new THREE.Mesh(bg, bodyMat); torso.castShadow = true; torso.receiveShadow = true;
    this.body.add(torso);
    const surf = (u, th, off = 0) => { const [, z, y, rx, ry] = sample(u); const n = new THREE.Vector3(Math.sin(th) / rx, Math.cos(th) / ry, 0).normalize(); return new THREE.Vector3(Math.sin(th) * rx, y + Math.cos(th) * ry, z).addScaledVector(n, off); };

    // face stripes on the white patch
    const stripeMat = new THREE.MeshStandardMaterial({ color: '#1d1d1d', roughness: .6 });
    for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) {
      const pts = []; for (let q = 0; q <= 8; q++) { const u = 0.885 + q / 8 * 0.07; pts.push(surf(u, sx * (1.5 + k * 0.17 + q * 0.012), 0.002)); }
      this.body.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.0032, 5), stripeMat));
    }
    // eyes
    const irisMat = new THREE.MeshPhysicalMaterial({ color: '#f1e4b0', roughness: .12, clearcoat: 1 });
    const pupMat = new THREE.MeshPhysicalMaterial({ color: '#030303', roughness: .04, clearcoat: 1 });
    this.eyes = [];
    for (const sx of [-1, 1]) {
      const p0 = surf(0.905, sx * 1.12, -0.004);
      const e = new THREE.Group(); e.position.copy(p0); e.lookAt(p0.clone().add(new THREE.Vector3(sx * 1, 0.25, 0.35)));
      const ir = new THREE.Mesh(new THREE.SphereGeometry(0.021, 24, 16), irisMat); ir.scale.z = .55; e.add(ir);
      const pu = new THREE.Mesh(new THREE.SphereGeometry(0.0105, 16, 12), pupMat); pu.position.z = 0.009; e.add(pu);
      const hi = new THREE.Mesh(new THREE.SphereGeometry(0.0032, 8, 6), new THREE.MeshBasicMaterial({ color: '#fff' })); hi.position.set(0.004, 0.006, 0.016); e.add(hi);
      this.body.add(e); this.eyes.push(e);
    }
    // beak: lofted hooked mandibles
    const beakMat = new THREE.MeshPhysicalMaterial({ color: '#26262b', roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: .25 });
    const loft = (path, rFn, ratio, n = 40, m = 24) => {
      const P = [], I = []; const curve = new THREE.CatmullRomCurve3(path);
      const frames = curve.computeFrenetFrames(n, false);
      for (let i = 0; i <= n; i++) { const u = i / n, c = curve.getPoint(u), r = rFn(u); const N1 = frames.normals[i], B1 = frames.binormals[i];
        for (let j = 0; j <= m; j++) { const a = j / m * Math.PI * 2; const v = c.clone().addScaledVector(N1, Math.cos(a) * r * ratio).addScaledVector(B1, Math.sin(a) * r); P.push(v.x, v.y, v.z); } }
      for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const a = i * (m + 1) + j, b = a + m + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); return g; };
    const up = loft([new THREE.Vector3(0, 0.175, 0.41), new THREE.Vector3(0, 0.185, 0.475), new THREE.Vector3(0, 0.15, 0.545), new THREE.Vector3(0, 0.08, 0.56), new THREE.Vector3(0, 0.035, 0.53)], u => 0.068 * Math.pow(1 - u, 0.8) + 0.002, 1.25);
    const ub = new THREE.Mesh(up, beakMat); ub.castShadow = true; this.body.add(ub);
    this.lowerBeakPivot = new THREE.Group(); this.lowerBeakPivot.position.set(0, 0.11, 0.42); this.body.add(this.lowerBeakPivot);
    const lo = loft([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -0.012, 0.05), new THREE.Vector3(0, 0.005, 0.095)], u => 0.05 * (1 - u) + 0.006, 1.0);
    this.lowerBeak = new THREE.Mesh(lo, beakMat); this.lowerBeakPivot.add(this.lowerBeak);
    this._surf = surf;

    // ---- tail
    const tailTop = twoToneMat('#1166c4', '#e8b52c', fTex, fA, { roughness: .45 });
    this.tail = new THREE.Group(); this.tail.position.set(0, 0.02, -0.42); this.body.add(this.tail);
    for (let i = 0; i < 7; i++) {
      const k = (i - 3) / 3, L = 0.85 - Math.abs(k) * 0.28;
      const f = new THREE.Mesh(featherGeo(0.095, L, 0.04), tailTop);
      f.rotation.y = k * 0.16; f.position.x = k * 0.03; f.position.y = -Math.abs(k) * 0.01 - 0.002 * i; f.castShadow = true;
      this.tail.add(f);
    }

    // ---- wings
    this.wings = [this._wing(1, fTex, fA), this._wing(-1, fTex, fA)];

    // ---- feet (tucked)
    const footMat = new THREE.MeshStandardMaterial({ color: '#5d5d63', roughness: .8 });
    this.feet = new THREE.Group(); this.body.add(this.feet);
    for (const sx of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.08, 4, 8), footMat); leg.position.set(0.07 * sx, -0.2, 0.02); this.feet.add(leg);
      for (let k = 0; k < 4; k++) { const toe = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.06, 4, 6), footMat); toe.rotation.x = Math.PI / 2 + (k < 2 ? 0 : Math.PI); toe.rotation.z = (k % 2 ? .3 : -.3); toe.position.set(0.07 * sx, -0.25, 0.02 + (k < 2 ? 0.035 : -0.035)); this.feet.add(toe); }
    }
    this.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
  }

  _wing(side, fTex, fA) {
    // side=+1 is bird's left (+x)
    const W = { side };
    const covMat = twoToneMat('#17a9d2', '#d9a92c', fTex, fA, { roughness: .5 });
    const secMat = twoToneMat('#0f7bc7', '#e3b43a', fTex, fA, { roughness: .45 });
    const priMat = twoToneMat('#0b4fa6', '#caa236', fTex, fA, { roughness: .42 });
    const boneMat = new THREE.MeshPhysicalMaterial({ color: '#16a0cc', roughness: .55, sheen: .5, sheenColor: new THREE.Color('#aef') });
    const sh = new THREE.Group(); sh.position.set(0.12 * side, 0.13, 0.08); this.body.add(sh);
    const elbow = new THREE.Group(); elbow.position.set(0.32 * side, 0, 0); sh.add(elbow);
    const wrist = new THREE.Group(); wrist.position.set(0.36 * side, 0, 0); elbow.add(wrist);
    const seg = (parent, len, r0, r1) => {
      const g = new THREE.CylinderGeometry(r1, r0, len, 16, 1); g.rotateZ(-Math.PI / 2 * side); g.translate(len / 2 * side, 0, 0);
      const m = new THREE.Mesh(g, boneMat); m.scale.set(1, 0.7, 1.4); parent.add(m);
      const j = new THREE.Mesh(new THREE.SphereGeometry(r0, 16, 12), boneMat); j.scale.set(1, .7, 1.4); parent.add(j);
    };
    seg(sh, 0.32, 0.06, 0.045); seg(elbow, 0.36, 0.045, 0.034); seg(wrist, 0.3, 0.034, 0.016);
    W.feathers = [];
    const add = (parent, mat, n, x0, x1, len0, len1, w, ang0, ang1, y, row) => {
      for (let i = 0; i < n; i++) {
        const u = n === 1 ? 0 : i / (n - 1);
        const L = lerp(len0, len1, u);
        const f = new THREE.Mesh(featherGeo(w, L, 0.06), mat);
        f.position.set(lerp(x0, x1, u) * side, y - 0.003 * i * (row === 'pri' ? 1 : 0.4), -0.02);
        const base = lerp(ang0, ang1, u);
        f.rotation.y = -base * side; f.castShadow = true;
        if (side < 0) { f.scale.x = -1; }
        parent.add(f); W.feathers.push({ f, base, row, u });
      }
    };
    // secondaries along forearm (elbow group), pointing back
    add(elbow, secMat, 14, 0.0, 0.36, 0.5, 0.56, 0.13, 0.02, 0.2, -0.01, 'sec');
    // tertials near body on arm
    add(sh, secMat, 7, 0.04, 0.32, 0.4, 0.5, 0.13, -0.08, 0.02, -0.012, 'ter');
    // primaries on hand: sweep outward
    add(wrist, priMat, 11, 0.0, 0.3, 0.6, 0.82, 0.12, 0.25, 1.3, -0.02, 'pri');
    // coverts
    add(elbow, covMat, 13, -0.01, 0.37, 0.28, 0.26, 0.12, 0.05, 0.22, 0.014, 'cov');
    add(wrist, covMat, 8, -0.01, 0.26, 0.32, 0.26, 0.12, 0.3, 1.0, 0.008, 'cov');
    add(sh, covMat, 8, 0.0, 0.32, 0.22, 0.26, 0.12, -0.05, 0.05, 0.017, 'cov');
    add(elbow, covMat, 12, -0.02, 0.36, 0.14, 0.13, 0.1, 0.05, 0.2, 0.024, 'cov2');
    add(sh, covMat, 9, 0.0, 0.32, 0.13, 0.13, 0.1, -0.02, 0.05, 0.026, 'cov2');
    add(wrist, covMat, 6, -0.01, 0.2, 0.15, 0.13, 0.1, 0.3, 0.9, 0.016, 'cov2');
    Object.assign(W, { sh, elbow, wrist });
    return W;
  }

  // phase: flap phase (radians); flap: 0 glide .. 1 full flap; fold: 0..1 folded at rest; spread
  pose(t, { phase = 0, flap = 0, fold = 0, bank = 0, pitch = 0, headTurn = 0, beakOpen = 0, legs = 0, tailFan = 0 } = {}) {
    const s = Math.sin(phase), c = Math.cos(phase);
    for (const W of this.wings) {
      const side = W.side;
      const up = flap * (0.95 * s + 0.15) * (1 - fold);
      // shoulder: up/down around z (bird-left wing: +z rot raises for side +1)
      W.sh.rotation.z = (up + 0.06 * (1 - flap)) * side + fold * -0.2 * side;
      W.sh.rotation.y = side * (fold * 1.15 + flap * 0.1 * c);
      W.sh.rotation.x = -flap * 0.18 * c;
      W.elbow.rotation.y = -side * (fold * 2.3 + flap * Math.max(0, c) * 0.25);
      W.elbow.rotation.z = side * flap * 0.25 * s;
      W.wrist.rotation.y = side * (fold * 2.2 + flap * Math.max(0, c) * 0.35);
      W.wrist.rotation.z = side * flap * 0.35 * s;
      const spread = 1 - fold * 0.85 - flap * Math.max(0, c) * 0.25;
      for (const F of W.feathers) {
        F.f.rotation.y = -F.base * side * spread;
        F.f.rotation.z = (F.row === 'pri' ? flap * 0.25 * -s * F.u : 0) * side;
      }
    }
    this.body.rotation.z = bank; this.body.rotation.x = pitch;
    this.tail.rotation.x = 0.06 + pitch * -0.3 + flap * 0.06 * s;
    this.tail.children.forEach((f, i) => f.rotation.y = ((i - 3) / 3) * (0.16 + tailFan * 0.35));
    this.lowerBeakPivot.rotation.x = beakOpen * 0.35;
    this.feet.visible = legs > 0.01; this.feet.position.y = (1 - legs) * 0.06;
  }
}
