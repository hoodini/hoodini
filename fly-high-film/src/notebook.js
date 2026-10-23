// Scene 1: a notebook on a desk; a ballpoint pen draws the doodle, which then comes alive.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { clamp, lerp, smooth, rng, canvasTex, noise1 } from './util.js';

const PAGE_W = 3.0, PAGE_H = 4.1; // world units
const TEX = 2048;

function woodTex() {
  return canvasTex(2048, 1024, (ctx, w, h) => {
    const r = rng(7);
    ctx.fillStyle = '#6b4128'; ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 1) {
      const n = Math.sin(y * 0.021 + Math.sin(y * 0.0043) * 6) * 0.5 + Math.sin(y * 0.11) * 0.15;
      const l = 30 + n * 9 + (r() - 0.5) * 3;
      ctx.fillStyle = `hsl(24, 42%, ${l}%)`; ctx.fillRect(0, y, w, 1);
    }
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 900; i++) { const y = r() * h, x = r() * w, L = 80 + r() * 600; ctx.fillStyle = r() > .5 ? '#2b160a' : '#b07a52'; ctx.fillRect(x, y, L, 1 + r() * 2); }
    // planks
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#2a1408'; for (let y = 0; y < h; y += 256) ctx.fillRect(0, y, w, 3);
    ctx.globalAlpha = 1;
  }, { repeat: [1, 1] });
}

// the doodle: list of strokes in page-UV space (0..1, y down), each [{x,y}]
function buildStrokes() {
  const S = [];
  const cx = 0.5, cy = 0.5;
  const R = rng(3);
  const wob = (a, k) => 1 + Math.sin(a * 3 + k) * 0.012 + Math.sin(a * 7 + k * 2) * 0.006;
  // body: egg, drawn as a slightly overlapping loop (classic ballpoint)
  { const p = []; const n = 120; for (let i = 0; i <= n * 1.08; i++) { const a = -Math.PI / 2 - 0.3 + i / n * Math.PI * 2; const rx = 0.205 * wob(a, 1), ry = 0.215 * wob(a, 2);
      p.push({ x: cx + Math.cos(a) * rx, y: cy + 0.02 + Math.sin(a) * ry * (Math.sin(a) > 0 ? 1.0 : 1.04) }); } S.push(p); }
  // second faint pass of body (sketchy)
  { const p = []; const n = 90; for (let i = 0; i <= n; i++) { const a = Math.PI * 0.15 + i / n * Math.PI * 1.1; p.push({ x: cx + Math.cos(a) * 0.209, y: cy + 0.023 + Math.sin(a) * 0.218 }); } S.push(p); }
  // eyes (ovals, filled later by hatching strokes)
  for (const sx of [-1, 1]) {
    const ex = cx + sx * 0.072, ey = cy - 0.02;
    const p = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2; p.push({ x: ex + Math.cos(a) * 0.034, y: ey + Math.sin(a) * 0.044 }); } S.push(p);
    // fill scribble leaving highlight
    const f = []; for (let k = 0; k < 9; k++) { const yy = ey - 0.036 + k * 0.009; const half = Math.sqrt(Math.max(0, 1 - Math.pow((yy - ey) / 0.044, 2))) * 0.031;
      f.push({ x: ex - half, y: yy }); f.push({ x: ex + half, y: yy + 0.004 }); } S.push(f);
  }
  // smile
  { const p = []; for (let i = 0; i <= 24; i++) { const u = i / 24; p.push({ x: cx - 0.04 + u * 0.08, y: cy + 0.052 + Math.sin(u * Math.PI) * 0.022 }); } S.push(p); }
  // cheeks (small hatch)
  for (const sx of [-1, 1]) { const p = []; for (let k = 0; k < 4; k++) { const x0 = cx + sx * 0.125 + k * 0.009 - 0.014; p.push({ x: x0, y: cy + 0.04 }); p.push({ x: x0 + 0.006, y: cy + 0.025 }); } S.push(p); }
  // sprout stem + leaves
  { const p = []; for (let i = 0; i <= 16; i++) { const u = i / 16; p.push({ x: cx + Math.sin(u * 1.2) * 0.012, y: cy - 0.195 - u * 0.085 }); } S.push(p); }
  for (const sx of [-1, 1]) { const p = []; const bx = cx + 0.012, by = cy - 0.28; for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI * 2; const L = 0.06;
      const t = (Math.cos(a) * -0.5 + 0.5); p.push({ x: bx + sx * t * L, y: by - Math.sin(a) * 0.016 * Math.sin(t * Math.PI) * 1.4 - t * 0.022 }); } S.push(p); }
  // arms
  for (const sx of [-1, 1]) { const p = []; for (let i = 0; i <= 14; i++) { const u = i / 14; p.push({ x: cx + sx * (0.2 + Math.sin(u * Math.PI) * 0.035), y: cy + 0.02 + u * 0.075 }); } S.push(p); }
  // feet
  for (const sx of [-1, 1]) { const p = []; for (let i = 0; i <= 30; i++) { const a = Math.PI + i / 30 * Math.PI; p.push({ x: cx + sx * 0.075 + Math.cos(a) * 0.05, y: cy + 0.235 - Math.sin(a) * 0.028 }); } S.push(p); }
  // ground scribble + sparkle stars
  { const p = []; for (let i = 0; i <= 30; i++) { const u = i / 30; p.push({ x: cx - 0.16 + u * 0.32, y: cy + 0.262 + Math.sin(u * 25) * 0.004 }); } S.push(p); }
  for (const [sx, sy, s] of [[0.27, 0.27, 0.025], [0.75, 0.3, 0.018], [0.78, 0.66, 0.02]]) {
    S.push([{ x: sx - s, y: sy }, { x: sx + s, y: sy }]); S.push([{ x: sx, y: sy - s }, { x: sx, y: sy + s }]);
  }
  // cumulative length for timing
  let total = 0; const meta = S.map(st => { let L = 0; for (let i = 1; i < st.length; i++) L += Math.hypot(st[i].x - st[i - 1].x, st[i].y - st[i - 1].y); const m = { start: total, len: L }; total += L + 0.06; return m; });
  return { S, meta, total };
}

export class Notebook {
  constructor(renderer) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1a0f0a');
    this.scene.fog = new THREE.Fog('#1a0f0a', 9, 22);
    // desk
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(24, 14), new THREE.MeshStandardMaterial({ map: woodTex(), roughness: 0.55, metalness: 0 }));
    desk.rotation.x = -Math.PI / 2; desk.receiveShadow = true; this.scene.add(desk);
    // notebook block (cover + page stack)
    const nb = new THREE.Group(); this.nb = nb; this.scene.add(nb); nb.rotation.y = -0.12;
    const cover = new THREE.Mesh(new RoundedBoxGeometry(PAGE_W * 2 + 0.5, 0.06, PAGE_H + 0.3, 3, 0.03), new THREE.MeshStandardMaterial({ color: '#244a6b', roughness: 0.7 }));
    cover.position.y = 0.03; cover.castShadow = true; cover.receiveShadow = true; nb.add(cover);
    const stackMat = new THREE.MeshStandardMaterial({ color: '#efe8d8', roughness: 0.9 });
    for (const sx of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(PAGE_W, 0.12, PAGE_H), stackMat); st.position.set(sx * (PAGE_W / 2 + 0.06), 0.12, 0); st.castShadow = true; st.receiveShadow = true; nb.add(st); }
    // page canvas (right page holds the doodle)
    this.pageTex = canvasTex(TEX, Math.round(TEX * PAGE_H / PAGE_W), (ctx) => this._drawPaper(ctx), { dynamic: true });
    this.paperBase = document.createElement('canvas'); this.paperBase.width = TEX; this.paperBase.height = this.pageTex.image.height;
    this._drawPaper(this.paperBase.getContext('2d'));
    const pageGeo = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 40, 40);
    { const p = pageGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i); const u = (x + PAGE_W / 2) / PAGE_W; p.setZ(i, Math.pow(1 - u, 6) * 0.08 + Math.sin(u * Math.PI) * 0.012); } pageGeo.computeVertexNormals(); }
    const pageMat = new THREE.MeshPhysicalMaterial({ map: this.pageTex, roughness: 0.85, sheen: .3, sheenColor: new THREE.Color('#fff') });
    this.page = new THREE.Mesh(pageGeo, pageMat); this.page.rotation.x = -Math.PI / 2; this.page.position.set(PAGE_W / 2 + 0.06, 0.185, 0); this.page.receiveShadow = true; nb.add(this.page);
    // left page (blank lined)
    const leftTex = canvasTex(1024, Math.round(1024 * PAGE_H / PAGE_W), (ctx, w, h) => { ctx.drawImage(this.paperBase, 0, 0, w, h); });
    const lg = pageGeo.clone(); { const p = lg.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i); const u = (x + PAGE_W / 2) / PAGE_W; p.setZ(i, Math.pow(u, 6) * 0.08 + Math.sin(u * Math.PI) * 0.012); } lg.computeVertexNormals(); }
    const left = new THREE.Mesh(lg, new THREE.MeshPhysicalMaterial({ map: leftTex, roughness: .85 })); left.rotation.x = -Math.PI / 2; left.position.set(-PAGE_W / 2 - 0.06, 0.185, 0); left.receiveShadow = true; nb.add(left);
    // spiral rings
    const ringMat = new THREE.MeshPhysicalMaterial({ color: '#c9ccd4', metalness: 1, roughness: 0.22, clearcoat: .4 });
    const ringGeo = new THREE.TorusGeometry(0.13, 0.016, 10, 40, Math.PI * 1.3);
    for (let i = 0; i < 18; i++) { const r = new THREE.Mesh(ringGeo, ringMat); r.position.set(0, 0.2, -PAGE_H / 2 + 0.2 + i * (PAGE_H - 0.4) / 17); r.rotation.set(0, Math.PI / 2, Math.PI * 0.85); r.castShadow = true; nb.add(r); }
    // pen
    this.pen = this._pen(); this.scene.add(this.pen);
    // props: coffee mug + eraser for scale and richness
    const mug = new THREE.Group(); mug.position.set(-6.2, 0, -2.6); this.scene.add(mug);
    const mugMat = new THREE.MeshPhysicalMaterial({ color: '#f2efe9', roughness: .25, clearcoat: .8 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.7, 1.7, 48, 1, true), mugMat); body.position.y = 0.85; body.castShadow = true; mug.add(body);
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.7, 40), mugMat); bottom.rotation.x = -Math.PI / 2; bottom.position.y = 0.02; mug.add(bottom);
    const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.72, 40), new THREE.MeshPhysicalMaterial({ color: '#3a1d0c', roughness: .1, clearcoat: 1 })); coffee.rotation.x = -Math.PI / 2; coffee.position.y = 1.5; mug.add(coffee);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.09, 16, 40, Math.PI), mugMat); handle.position.set(0.75, 0.85, 0); handle.rotation.z = -Math.PI / 2; handle.castShadow = true; mug.add(handle);
    const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 6), new THREE.MeshStandardMaterial({ color: '#f2b51b', roughness: .5 })); pencil.rotation.set(Math.PI / 2, 0, 0.9); pencil.position.set(-4.6, 0.06, 2.4); pencil.castShadow = true; this.scene.add(pencil);

    // lights: warm desk lamp + cool window fill
    this.scene.add(new THREE.HemisphereLight('#ffe8d0', '#2a1a10', 0.35));
    const lamp = new THREE.SpotLight('#ffd6a0', 75, 30, 0.75, 0.6, 1.6); lamp.position.set(-3.5, 8.5, -3.5); lamp.target.position.set(1.4, 0, 0.2);
    lamp.castShadow = true; lamp.shadow.mapSize.set(2048, 2048); lamp.shadow.bias = -0.0002; lamp.shadow.radius = 6; this.scene.add(lamp, lamp.target); this.lamp = lamp;
    const fill = new THREE.DirectionalLight('#9fc4ff', 0.6); fill.position.set(6, 5, 6); this.scene.add(fill);
    // warm room backdrop with window glow + bokeh (out-of-focus background)
    const bokeh = canvasTex(1024, 512, (ctx, w, h) => {
      const r = rng(31); const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2a1a12'); g.addColorStop(0.55, '#5a3a24'); g.addColorStop(1, '#24150d'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const win = ctx.createRadialGradient(w * 0.72, h * 0.38, 10, w * 0.72, h * 0.38, w * 0.38); win.addColorStop(0, 'rgba(255,214,150,0.85)'); win.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = win; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 70; i++) { const x = r() * w, y = h * 0.15 + r() * h * 0.6, rad = 8 + r() * 34; const a = 0.08 + r() * 0.22;
        const bg = ctx.createRadialGradient(x, y, rad * 0.6, x, y, rad); bg.addColorStop(0, `rgba(255,${190 + r() * 50 | 0},${110 + r() * 60 | 0},${a})`); bg.addColorStop(0.9, `rgba(255,200,140,${a * 1.3})`); bg.addColorStop(1, 'rgba(255,200,140,0)');
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill(); }
    });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshBasicMaterial({ map: bokeh, fog: false }));
    back.position.set(1, 6, -11); this.scene.add(back);
    this.doodle = buildStrokes();
    this.sparkles = this._sparkles(); this.scene.add(this.sparkles);
    this.pageW = PAGE_W; this.pageH = PAGE_H;
    this.scene.updateMatrixWorld(true);
  }

  _pen() {
    const g = new THREE.Group(); const inner = new THREE.Group(); g.add(inner);
    const L = 2.6;
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: '#10141c', roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12 });
    const goldMat = new THREE.MeshPhysicalMaterial({ color: '#e6b85c', metalness: 1, roughness: 0.2 });
    const steel = new THREE.MeshPhysicalMaterial({ color: '#d8dce3', metalness: 1, roughness: 0.16 });
    const add = (geo, mat, y) => { const m = new THREE.Mesh(geo, mat); m.position.y = y; m.castShadow = true; inner.add(m); return m; };
    add(new THREE.ConeGeometry(0.012, 0.06, 16), steel, 0.03).rotation.x = Math.PI; // ball tip
    add(new THREE.CylinderGeometry(0.03, 0.075, 0.22, 32), steel, 0.17);
    add(new THREE.CylinderGeometry(0.085, 0.08, 0.5, 32), new THREE.MeshStandardMaterial({ color: '#1b1b1f', roughness: .9 }), 0.52);
    add(new THREE.CylinderGeometry(0.088, 0.088, 0.04, 32), goldMat, 0.79);
    add(new THREE.CylinderGeometry(0.09, 0.085, 1.5, 32), bodyMat, 1.56);
    add(new THREE.CylinderGeometry(0.092, 0.092, 0.05, 32), goldMat, 2.33);
    add(new THREE.CylinderGeometry(0.085, 0.09, 0.3, 32), bodyMat, 2.5);
    add(new THREE.SphereGeometry(0.085, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat, 2.65);
    const clip = add(new RoundedBoxGeometry(0.05, 0.9, 0.035, 2, 0.015), goldMat, 2.1); clip.position.z = 0.11;
    // the pen rests tilted; inner y=0 is the ball point
    return g;
  }

  _sparkles() {
    const n = 60, geo = new THREE.BufferGeometry(); const p = new Float32Array(n * 3), s = new Float32Array(n), ph = new Float32Array(n);
    const r = rng(11); for (let i = 0; i < n; i++) { p[i * 3] = (r() - .5); p[i * 3 + 1] = r(); p[i * 3 + 2] = (r() - .5); s[i] = r(); ph[i] = r(); }
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3)); geo.setAttribute('seed', new THREE.BufferAttribute(s, 1)); geo.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
    const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uK: { value: 0 }, uScale: { value: 1 } },
      vertexShader: `attribute float seed; attribute float phase; uniform float uT; uniform float uK; uniform float uScale; varying float vA;
        void main(){ vec3 p = position; float life = fract(phase + uT*0.35);
          p.xz *= 1.6*(0.4+life); p.y = p.y*0.6 + life*1.4;
          vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv;
          vA = uK * sin(life*3.14159) * (0.5+0.5*sin(uT*9.0+seed*40.0));
          gl_PointSize = uScale*(3.0+seed*8.0)/(-mv.z)*30.0; }`,
      fragmentShader: `varying float vA; void main(){ vec2 c=gl_PointCoord-0.5; float d=length(c); float star = max(0.0, 1.0-d*2.0); star = pow(star,3.0) + max(0.0,1.0-abs(c.x)*14.0)*max(0.0,1.0-abs(c.y)*2.0)*0.6 + max(0.0,1.0-abs(c.y)*14.0)*max(0.0,1.0-abs(c.x)*2.0)*0.6;
          gl_FragColor = vec4(vec3(1.0,0.78,0.42)*star*vA*1.4, 1.0); }` });
    const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; return pts;
  }

  _drawPaper(ctx) {
    const w = ctx.canvas.width, h = ctx.canvas.height; const r = rng(5);
    ctx.fillStyle = '#f7f1e3'; ctx.fillRect(0, 0, w, h);
    // fibres
    for (let i = 0; i < 40000; i++) { const g = 200 + r() * 40; ctx.fillStyle = `rgba(${g},${g - 8},${g - 25},0.08)`; ctx.fillRect(r() * w, r() * h, 1 + r() * 3, 1); }
    // vignette darkening at edges
    const vg = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.9); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(90,60,20,0.18)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    // ruled lines
    ctx.strokeStyle = 'rgba(70,130,200,0.5)'; ctx.lineWidth = 4;
    for (let y = h * 0.09; y < h * 0.97; y += h * 0.032) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(220,70,80,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(w * 0.12, 0); ctx.lineTo(w * 0.12, h); ctx.stroke();
  }

  // draws doodle up to progress (length units); fade 0..1 removes ink; glow adds a warm halo
  drawDoodle(prog, fade = 0, glow = 0) {
    const ctx = this.pageTex.userData.ctx, w = ctx.canvas.width, h = ctx.canvas.height;
    ctx.drawImage(this.paperBase, 0, 0);
    const { S, meta } = this.doodle;
    const alpha = 1 - fade;
    if (alpha <= 0) { this.pageTex.needsUpdate = true; return null; }
    let tip = null;
    const passes = glow > 0 ? [['glow', glow], ['ink', 1]] : [['ink', 1]];
    for (const [kind, k] of passes) {
      ctx.save();
      if (kind === 'glow') { ctx.shadowColor = `rgba(255,190,90,${0.9 * k})`; ctx.shadowBlur = 40; ctx.strokeStyle = `rgba(255,200,120,${0.5 * k * alpha})`; ctx.lineWidth = 14; }
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      S.forEach((st, si) => {
        const m = meta[si]; const local = prog - m.start; if (local <= 0) return;
        let acc = 0;
        for (let i = 1; i < st.length; i++) {
          const a = st[i - 1], b = st[i]; const L = Math.hypot(b.x - a.x, b.y - a.y);
          let f = 1; if (acc + L > local) f = (local - acc) / L;
          if (f <= 0) break;
          const bx = a.x + (b.x - a.x) * f, by = a.y + (b.y - a.y) * f;
          if (kind === 'ink') {
            const press = 0.75 + 0.25 * noise1(si * 3.1 + i * 0.13);
            ctx.strokeStyle = `rgba(22,40,120,${0.92 * alpha})`; ctx.lineWidth = (this.doodle.W ? this.doodle.W[si] : 11) * press * Math.min(1, 0.35 + 0.65 * Math.min(i, st.length - i) / 4);
          }
          ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(bx * w, by * h); ctx.stroke();
          acc += L; tip = { x: bx, y: by };
          if (f < 1) break;
        }
        if (kind === 'ink' && this.doodle.D && this.doodle.D[si] && local >= m.len) { ctx.fillStyle = `rgba(22,40,120,${0.88 * alpha})`; ctx.beginPath(); st.forEach((q, qi) => qi ? ctx.lineTo(q.x * w, q.y * h) : ctx.moveTo(q.x * w, q.y * h)); ctx.fill(); }
      });
      ctx.restore();
    }
    this.pageTex.needsUpdate = true;
    return tip;
  }

  // replace the doodle with external strokes: [{pts:[[u,v]...], w(px), dark}]
  setDoodle(strokes) {
    const S = strokes.map(st => st.pts.map(([x, y]) => ({ x, y })));
    let total = 0; const meta = S.map(st => { let L = 0; for (let i = 1; i < st.length; i++) L += Math.hypot(st[i].x - st[i - 1].x, (st[i].y - st[i - 1].y) * 1.366); const m = { start: total, len: L }; total += L + 0.012; return m; });
    this.doodle = { S, meta, total, W: strokes.map(s => s.w), D: strokes.map(s => !!s.dark) };
  }
  // page uv -> world
  uvToWorld(x, y) {
    const v = new THREE.Vector3((x - 0.5) * PAGE_W, (0.5 - y) * PAGE_H, 0.02);
    return this.page.localToWorld(v);
  }
}
