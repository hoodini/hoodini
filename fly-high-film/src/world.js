// The outdoor world: sky, meadow, storm, rain, lightning, god-rays and the sea of clouds above.
import * as THREE from 'three';
import { clamp, lerp, smooth, rng, canvasTex, fbm2, noise2 } from './util.js';

export const CLOUD_BASE = 26, CLOUD_TOP = 44;

const NOISE_GLSL = `
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=0.0, w=0.5; for(int i=0;i<6;i++){ a+=w*vnoise(p); p=p*2.03+vec2(1.7,9.2); w*=0.5; } return a; }
`;

export function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      uSun: { value: new THREE.Vector3(0.6, 0.35, -0.7).normalize() }, uStorm: { value: 0 }, uGold: { value: 0 }, uT: { value: 0 },
      uFlash: { value: 0 }, uFlashDir: { value: new THREE.Vector3(-0.3, 0.5, -1).normalize() }, uHole: { value: 0 }, uHoleDir: { value: new THREE.Vector3(0.2, 0.9, -0.3).normalize() },
      uAlt: { value: 0 },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_Position = p.xyww; }`,
    fragmentShader: NOISE_GLSL + `
      uniform vec3 uSun; uniform float uStorm, uGold, uT, uFlash, uHole, uAlt; uniform vec3 uFlashDir, uHoleDir; varying vec3 vDir;
      void main(){
        vec3 d = normalize(vDir); float h = d.y;
        // sunny day
        vec3 zen = vec3(0.10,0.36,0.80), hor = vec3(0.62,0.80,0.94);
        vec3 col = mix(hor, zen, pow(clamp(h,0.0,1.0), 0.55));
        // golden hour above the clouds (brand sky)
        vec3 gZen = vec3(0.07,0.30,0.70), gMid = vec3(0.30,0.60,0.88), gHor = vec3(1.0,0.74,0.46);
        vec3 gcol = mix(gHor, gMid, smoothstep(-0.02, 0.22, h)); gcol = mix(gcol, gZen, smoothstep(0.2, 0.9, h));
        float sd = max(dot(d, uSun), 0.0);
        gcol += vec3(1.0,0.72,0.38) * pow(sd, 6.0) * 0.55 * (1.0-smoothstep(0.1,0.6,h));
        col = mix(col, gcol, uGold);
        // sun
        float sunDisk = smoothstep(0.9993, 0.9997, sd);
        col += vec3(1.0,0.93,0.8) * (pow(sd, 900.0)*6.0 + pow(sd, 60.0)*0.45 + sunDisk*8.0) * (1.0-uStorm);
        // clouds layer (projected)
        vec2 uv = d.xz / max(h, 0.04) * 0.55;
        if (uGold < 0.999 && uStorm < 0.999 && h > 0.0) {
          float c = fbm(uv*1.3 + vec2(uT*0.015, uT*0.006));
          float sunnyC = smoothstep(0.5, 0.75, c) * smoothstep(0.02, 0.2, h) * (1.0-uGold);
          col = mix(col, vec3(1.0,0.99,0.97) + vec3(1.0,0.9,0.7)*pow(sd,8.0)*0.4, sunnyC*0.85);
        }
        // storm
        if (uStorm > 0.001) {
        float sc = fbm(uv*0.9 + vec2(uT*0.06, -uT*0.03)); float sc2 = fbm(uv*2.4 - vec2(uT*0.09, uT*0.02));
        vec3 stormCol = mix(vec3(0.20,0.22,0.26), vec3(0.42,0.45,0.5), smoothstep(0.25, 0.8, sc*0.7+sc2*0.4));
        stormCol = mix(stormCol, vec3(0.13,0.14,0.17), smoothstep(0.45,0.75,sc2)*0.6);
        stormCol = mix(vec3(0.36,0.38,0.42), stormCol, smoothstep(-0.05, 0.3, h));
        // lightning lights the clouds from within
        float fl = pow(max(dot(d, uFlashDir), 0.0), 6.0) * uFlash;
        stormCol += vec3(0.75,0.8,1.0) * (fl*2.2 + uFlash*0.35) * (0.4+sc2);
        // hole in the clouds with golden light
        float hole = smoothstep(0.86, 0.98, dot(d, uHoleDir)) * uHole;
        stormCol = mix(stormCol, vec3(1.0,0.86,0.55)*1.35, hole);
        stormCol += vec3(1.0,0.8,0.45) * pow(max(dot(d,uHoleDir),0.0), 12.0) * uHole * 0.6;
        col = mix(col, stormCol, uStorm);
        }
        // below horizon
        col = mix(col, vec3(0.95,0.74,0.5), smoothstep(0.01, -0.05, h) * uGold);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  mat.toneMapped = true;
  const m = new THREE.Mesh(new THREE.SphereGeometry(900, 64, 32), mat); m.frustumCulled = false; m.renderOrder = -10;
  return m;
}

function terrainHeight(x, z) {
  // gentle meadow with rolling hills toward the horizon
  const d = Math.hypot(x, z + 6);
  const near = fbm2(x * 0.045, z * 0.045, 3) * 1.6;
  const far = Math.max(0, fbm2(x * 0.012 + 3, z * 0.012, 4)) * 22 * smooth(25, 120, d);
  const path = Math.exp(-Math.pow(z / 3, 2)) * 0.0;
  return near * smooth(4, 30, d) + far - path + (fbm2(x * 0.3, z * 0.3, 2) * 0.08);
}

export class Meadow {
  constructor() {
    this.group = new THREE.Group();
    // ground
    const g = new THREE.PlaneGeometry(700, 700, 280, 280); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, terrainHeight(x, z)); }
    g.computeVertexNormals();
    const groundTex = canvasTex(1024, 1024, (ctx, w, h) => {
      const r = rng(21); ctx.fillStyle = '#4f8a32'; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 60000; i++) { const s = r(); ctx.fillStyle = s > .6 ? 'rgba(120,170,60,0.35)' : s > .3 ? 'rgba(40,90,30,0.35)' : 'rgba(150,140,70,0.2)'; ctx.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 4); }
    }, { repeat: [120, 120] });
    this.ground = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.95, color: '#ffffff' }));
    this.ground.receiveShadow = true; this.group.add(this.ground);
    this.height = terrainHeight;

    // grass blades (instanced, wind in shader)
    const blade = new THREE.BufferGeometry();
    const bv = [-0.5, 0, 0, 0.5, 0, 0, -0.3, 0.55, 0, 0.3, 0.55, 0, 0, 1, 0];
    blade.setAttribute('position', new THREE.Float32BufferAttribute(bv, 3));
    blade.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4]);
    blade.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(15).fill(0).map((_, i) => i % 3 === 2 ? 1 : 0), 3));
    const N = 85000; const r = rng(9);
    const offs = new Float32Array(N * 4), cols = new Float32Array(N * 3);
    let k = 0;
    for (let i = 0; i < N; i++) {
      // denser near the action area (x in -14..10, z in -10..6)
      let x, z;
      if (i < N * 0.72) { x = -16 + r() * 28; z = -12 + r() * 20; } else { const a = r() * Math.PI * 2, d = 8 + Math.pow(r(), 0.7) * 40; x = Math.cos(a) * d; z = Math.sin(a) * d - 6; }
      const y = terrainHeight(x, z);
      const trail = Math.max(Math.exp(-Math.pow((z - 0.4) / 0.9, 2)) * smooth(-12, -9, x) * (1 - smooth(5, 7, x)), 1 - smooth(1.6, 3.4, Math.hypot(x - 0.6, z - 1.4)));
      const hgt = (0.32 + r() * 0.38) * (1 - trail * 0.65);
      offs[k * 4] = x; offs[k * 4 + 1] = y; offs[k * 4 + 2] = z; offs[k * 4 + 3] = hgt;
      const c = new THREE.Color().setHSL(0.24 + r() * 0.06, 0.55 + r() * 0.2, 0.32 + r() * 0.16);
      cols[k * 3] = c.r; cols[k * 3 + 1] = c.g; cols[k * 3 + 2] = c.b; k++;
    }
    this.grassU = { uT: { value: 0 }, uWind: { value: 0.3 }, uDry: { value: 0 } };
    const gm = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, color: '#ffffff' });
    gm.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, this.grassU);
      s.vertexShader = `attribute vec4 offset; attribute vec3 gcol; uniform float uT; uniform float uWind; varying vec3 vG; varying float vH;\n` + s.vertexShader
        .replace('#include <begin_vertex>', `
          float rnd = fract(sin(dot(offset.xz, vec2(12.9898,78.233)))*43758.5453);
          float ang = rnd*6.2831;
          vec3 p = position; p.x *= 0.065 + 0.025*rnd; p.y *= offset.w;
          float c = cos(ang), s = sin(ang);
          p = vec3(p.x*c - p.z*s, p.y, p.x*s + p.z*c);
          float w = sin(uT*1.7 + offset.x*0.35 + offset.z*0.21)*0.5 + sin(uT*3.1 + offset.x*0.9)*0.25;
          float gust = sin(uT*0.9 + offset.x*0.08)*0.5+0.5;
          float bend = (0.12 + uWind*(0.55 + gust*0.6)) * position.y*position.y;
          p.x += (w*0.6 + uWind*1.2) * bend * offset.w; p.z += w*0.3*bend*offset.w;
          p.y -= abs(bend)*0.25*offset.w*uWind;
          vec3 transformed = p + offset.xyz; vG = gcol; vH = position.y;`)
        .replace('#include <beginnormal_vertex>', `vec3 objectNormal = vec3(0.0,1.0,0.0);`);
      s.fragmentShader = `varying vec3 vG; varying float vH; uniform float uDry;\n` + s.fragmentShader
        .replace('#include <color_fragment>', `#include <color_fragment>
          diffuseColor.rgb *= mix(vG*0.45, vG*1.25 + vec3(0.06,0.07,0.0), vH);`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          totalEmissiveRadiance += vG*vH*0.06;`);
    };
    // bucket blades into spatial chunks so off-screen grass is frustum-culled
    const buckets = new Map(); const CH = 4;
    for (let i = 0; i < N; i++) { const key = Math.floor(offs[i * 4] / CH) + ',' + Math.floor(offs[i * 4 + 2] / CH); if (!buckets.has(key)) buckets.set(key, []); buckets.get(key).push(i); }
    this.grass = new THREE.Group(); this.group.add(this.grass);
    for (const [key, ids] of buckets) {
      const o = new Float32Array(ids.length * 4), c = new Float32Array(ids.length * 3); let minY = 1e9, maxY = -1e9; let cx = 0, cz = 0;
      ids.forEach((id, j) => { o.set(offs.subarray(id * 4, id * 4 + 4), j * 4); c.set(cols.subarray(id * 3, id * 3 + 3), j * 3); minY = Math.min(minY, offs[id * 4 + 1]); maxY = Math.max(maxY, offs[id * 4 + 1]); cx += offs[id * 4]; cz += offs[id * 4 + 2]; });
      const ig = new THREE.InstancedBufferGeometry(); ig.index = blade.index; ig.attributes.position = blade.attributes.position; ig.attributes.normal = blade.attributes.normal;
      ig.setAttribute('offset', new THREE.InstancedBufferAttribute(o, 4)); ig.setAttribute('gcol', new THREE.InstancedBufferAttribute(c, 3)); ig.instanceCount = ids.length;
      const [kx, kz] = key.split(',').map(Number);
      ig.boundingSphere = new THREE.Sphere(new THREE.Vector3((kx + 0.5) * CH, (minY + maxY) / 2 + 0.4, (kz + 0.5) * CH), CH * 0.75 + (maxY - minY) / 2 + 1.2);
      ig.boundingBox = new THREE.Box3(new THREE.Vector3(kx * CH - 1, minY - 1, kz * CH - 1), new THREE.Vector3(kx * CH + CH + 1, maxY + 1.5, kz * CH + CH + 1));
      const m = new THREE.Mesh(ig, gm); m.receiveShadow = true; this.grass.add(m);
    }

    // flowers
    const petal = new THREE.SphereGeometry(0.05, 8, 6); petal.scale(1, 0.4, 1);
    const flowerCols = ['#ffffff', '#ffe066', '#ff9ec7', '#c9b6ff', '#ffb36b'];
    this.flowers = [];
    flowerCols.forEach((fc, ci) => {
      const n = 320, im = new THREE.InstancedMesh(petal, new THREE.MeshStandardMaterial({ color: fc, roughness: .6, emissive: fc, emissiveIntensity: 0.08 }), n);
      const m4 = new THREE.Matrix4(); const rr = rng(40 + ci);
      for (let i = 0; i < n; i++) { const x = -16 + rr() * 30, z = -14 + rr() * 22; const y = terrainHeight(x, z) + 0.22 + rr() * 0.2; const s = 0.4 + rr() * 0.45; m4.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rr() * 0.4, rr() * 6, rr() * 0.4)), new THREE.Vector3(s, s, s)); im.setMatrixAt(i, m4); }
      im.castShadow = false; this.group.add(im); this.flowers.push(im);
    });

    // stylized trees on the hills
    this.trees = new THREE.Group(); this.group.add(this.trees);
    const leafMat = new THREE.MeshStandardMaterial({ color: '#3f7f2e', roughness: .8 });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: '#5a9c3a', roughness: .8 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#5a3b26', roughness: .9 });
    const tr = rng(77);
    const treeSpots = [[-22, -18], [-15, -26], [-6, -30], [9, -24], [17, -16], [24, -30], [-30, -8], [32, -12], [-40, -35], [40, -40], [2, -45], [-12, -50]];
    for (const [x, z] of treeSpots) {
      const t = new THREE.Group(); const y = terrainHeight(x, z); t.position.set(x, y, z); const s = 1.4 + tr() * 1.6; t.scale.setScalar(s);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 8), trunkMat); trunk.position.y = 1.1; trunk.castShadow = true; t.add(trunk);
      for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9 + tr() * 0.5, 2), i % 2 ? leafMat : leafMat2); b.position.set((tr() - .5) * 1.4, 2.4 + tr() * 1.3, (tr() - .5) * 1.4); b.castShadow = true; t.add(b); }
      this.trees.add(t);
    }
  }
  update(t, wind) { this.grassU.uT.value = t; this.grassU.uWind.value = wind; }
}

// rain streaks around a moving centre
export class Rain {
  constructor() {
    const N = 9000, pos = new Float32Array(N * 2 * 3), seed = new Float32Array(N * 2 * 2);
    const r = rng(5);
    for (let i = 0; i < N; i++) { const x = r(), y = r(), z = r(); for (let k = 0; k < 2; k++) { pos.set([x, y, z], (i * 2 + k) * 3); seed.set([k, r()], (i * 2 + k) * 2); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('seed', new THREE.BufferAttribute(seed, 2));
    this.u = { uT: { value: 0 }, uC: { value: new THREE.Vector3() }, uA: { value: 0 }, uWind: { value: 0.3 } };
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: this.u,
      vertexShader: `attribute vec2 seed; uniform float uT; uniform vec3 uC; uniform float uWind; varying float vA; varying float vEnd;
        void main(){ vec3 box = vec3(36.0, 22.0, 36.0); vec3 p = position*box;
          p.y = mod(p.y - uT*(18.0+seed.y*6.0), box.y); p.x = mod(p.x + uT*uWind*6.0 - uC.x, box.x) + uC.x - box.x*0.5; p.z = mod(p.z - uC.z, box.z) + uC.z - box.z*0.5; p.y += uC.y - box.y*0.45;
          p += seed.x * vec3(uWind*0.2, 0.55, 0.0);
          vEnd = seed.x; vec4 mv = modelViewMatrix*vec4(p,1.0); vA = clamp(1.0 - (-mv.z)/34.0, 0.0, 1.0); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform float uA; varying float vA; varying float vEnd; void main(){ gl_FragColor = vec4(vec3(0.78,0.84,0.92), uA*vA*mix(0.6,0.05,vEnd)); }` });
    this.mesh = new THREE.LineSegments(g, m); this.mesh.frustumCulled = false;
  }
  update(t, center, amount, wind) { this.u.uT.value = t; this.u.uC.value.copy(center); this.u.uA.value = amount; this.u.uWind.value = wind; this.mesh.visible = amount > 0.001; }
}

export function makeBolt(seed, start, end) {
  const r = rng(seed); const pts = [start.clone()]; const n = 22;
  for (let i = 1; i < n; i++) { const u = i / n; const p = start.clone().lerp(end, u); p.x += (r() - .5) * 3.2 * Math.sin(u * Math.PI); p.z += (r() - .5) * 1.5; pts.push(p); }
  pts.push(end.clone());
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 3.4, 4.2), transparent: true, depthWrite: false, fog: false, toneMapped: false });
  const geo = (ps, rad) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ps, false, 'catmullrom', 0.05), ps.length * 4, rad, 5);
  group.add(new THREE.Mesh(geo(pts, 0.09), mat));
  for (let b = 0; b < 4; b++) { const i0 = 3 + Math.floor(r() * 12); const bp = [pts[i0].clone()]; let q = pts[i0].clone(); for (let j = 0; j < 6; j++) { q = q.clone().add(new THREE.Vector3((r() - .3) * 2.2, -1.4 - r(), (r() - .5))); bp.push(q); } group.add(new THREE.Mesh(geo(bp, 0.05), mat)); }
  group.userData.mat = mat; return group;
}

// golden beam through the clouds
export function makeGodRay() {
  const g = new THREE.CylinderGeometry(1.2, 9, 60, 48, 1, true); g.translate(0, -30, 0);
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    uniforms: { uA: { value: 0 }, uT: { value: 0 } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform float uA; uniform float uT; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      float h(float x){ return fract(sin(x*91.7)*43758.5); }
      void main(){ float edge = pow(abs(dot(vN, vV)), 1.6);
        float streak = 0.55 + 0.45*sin(vUv.x*80.0 + sin(vUv.x*13.0)*3.0 + uT*0.6);
        float fall = smoothstep(0.0, 0.25, vUv.y) * (0.35 + 0.65*vUv.y);
        gl_FragColor = vec4(vec3(1.0,0.82,0.5)*edge*streak*fall*uA*0.55, 1.0); }` });
  const mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; return mesh;
}

// the sea of clouds seen from above + puffs for parallax
export class CloudSea {
  constructor() {
    this.group = new THREE.Group();
    const g = new THREE.PlaneGeometry(5000, 5000, 240, 240); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position, cols = [];
    const cLow = new THREE.Color('#6f86b4'), cHigh = new THREE.Color('#fff1e0');
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      let h = fbm2(x * 0.012, z * 0.012, 5); h = Math.max(0, h + 0.15);
      const billow = Math.pow(Math.abs(fbm2(x * 0.035 + 7, z * 0.035, 3)), 0.8) * 3.2;
      const y = h * 6.5 + billow * 0.9;
      p.setY(i, y);
      const k = clamp(y / 7); const c = cLow.clone().lerp(cHigh, Math.pow(k, 0.6)); cols.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.computeVertexNormals();
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
    m.onBeforeCompile = (s) => {
      s.fragmentShader = s.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * vec3(0.05,0.055,0.07);`);
    };
    this.sea = new THREE.Mesh(g, m); this.sea.position.y = CLOUD_TOP - 8; this.sea.receiveShadow = true; this.group.add(this.sea);

    // puff sprites (soft cumulus) scattered above the sea + inside the storm layer
    const puffTex = canvasTex(256, 256, (ctx, w, h) => {
      const r = rng(4);
      for (let i = 0; i < 26; i++) { const x = w / 2 + (r() - .5) * w * 0.5, y = h / 2 + (r() - .5) * h * 0.35, rad = w * (0.12 + r() * 0.18);
        const gr = ctx.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h); }
      ctx.globalCompositeOperation = 'source-atop'; const sh = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.75); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(120,140,185,0.9)'); ctx.fillStyle = sh; ctx.fillRect(0, 0, w, h);
    });
    this.puffs = []; this.puffMatTop = new THREE.SpriteMaterial({ map: puffTex, color: '#fff3e2', transparent: true, depthWrite: false, fog: true });
    this.puffMatStorm = new THREE.SpriteMaterial({ map: puffTex, color: '#6f7682', transparent: true, depthWrite: false, fog: true, opacity: 0.95 });
    const r = rng(99);
    for (let i = 0; i < 90; i++) { const s = new THREE.Sprite(this.puffMatTop); s.position.set(-200 + r() * 700, CLOUD_TOP - 5 + r() * 3, -260 + r() * 420); if (Math.abs(s.position.z + 14) < 22) s.position.z += 44 * Math.sign(s.position.z + 14 || 1); const k = 7 + r() * 14; s.scale.set(k * 1.8, k, 1); this.group.add(s); this.puffs.push(s); }
    this.stormPuffs = new THREE.Group(); this.group.add(this.stormPuffs);
    for (let i = 0; i < 140; i++) { const s = new THREE.Sprite(this.puffMatStorm); s.position.set(-30 + r() * 80, CLOUD_BASE + r() * (CLOUD_TOP - CLOUD_BASE), -40 + r() * 70); const k = 5 + r() * 10; s.scale.set(k * 1.5, k, 1); this.stormPuffs.add(s); }
  }
  cull(cam) {
    for (const s of this.stormPuffs.children) s.visible = s.position.distanceTo(cam) > Math.max(s.scale.x, s.scale.y) * 0.45 + 1.5;
    for (const s of this.puffs) s.visible = s.position.distanceTo(cam) > Math.max(s.scale.x, s.scale.y) * 0.45 + 2;
  }
}
