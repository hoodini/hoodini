import * as THREE from 'three';
import { clamp, lerp, smooth, smoother, pulse, easeInOut, easeOutCubic, easeInCubic, easeOutElastic, easeOutBack, rng, track, v3, noise1 } from './util.js';
import { Character } from './character.js';
import { Macaw } from './macaw.js';
import { Notebook } from './notebook.js';
import { makeSky, Meadow, Rain, makeBolt, makeGodRay, CloudSea, CLOUD_BASE, CLOUD_TOP } from './world.js';
import { Burden, Toasts, Order } from './props.js';
import { loadFont, text3D } from './text3d.js';
import { makePost } from './post.js';
import { Overlay } from './captions.js';

const q = new URLSearchParams(location.search);
const W = +(q.get('w') || 1920), H = +(q.get('h') || 1080);
const PORTRAIT = H > W;
export const DURATION = 70;

// ---------------------------------------------------------------- renderer
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

await Promise.all([
  document.fonts.load('800 40px "Rubik"', 'אבג'), document.fonts.load('900 40px "Rubik"', 'אבג'), document.fonts.load('700 40px "Rubik"', 'אבג'),
  document.fonts.load('600 40px "Rubik"', 'אבג'), document.fonts.load('500 40px "Rubik"', 'אבג'),
  document.fonts.load('700 40px "Amatic SC"', 'אבג'), document.fonts.load('700 40px "Fredoka"', 'ABC'), document.fonts.load('40px "Noto Color Emoji"', '🔔'),
]);
await loadFont('fredoka', './fonts/Fredoka-700.ttf');
await loadFont('rubik', './fonts/Rubik-900.ttf');

const post = makePost(renderer, W, H, +(q.get('msaa') ?? 0), q.has('rt8'));
if (q.has('nobloom')) post.bloom.enabled = false;
if (q.has('noshadow')) renderer.shadowMap.enabled = false;
const overlay = new Overlay(W, H);
post.final.uniforms.tOver.value = overlay.tex;

// camera fov fitting: design in 16:9; portrait gets a tighter horizontal crop
function fitFov(vfov) {
  if (!PORTRAIT) return vfov;
  const h = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(vfov) / 2) * 16 / 9);
  const h2 = h * 0.66;
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h2 / 2) / (W / H)));
}
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 3000);

// ---------------------------------------------------------------- scene 1: notebook
const NB = new Notebook(renderer);
const lumiNB = new Character(); NB.scene.add(lumiNB.root);
const pageCenter = NB.uvToWorld(0.5, 0.5);
const pageFeet = NB.uvToWorld(0.5, 0.745);

// ---------------------------------------------------------------- world scene
const world = new THREE.Scene();
const sky = makeSky(); world.add(sky);
const meadow = new Meadow(); world.add(meadow.group);
if (q.has('nograss')) meadow.grass.visible = false;
const rain = new Rain(); world.add(rain.mesh);
const clouds = new CloudSea(); world.add(clouds.group);
const godRay = makeGodRay(); world.add(godRay);
const lumi = new Character(); world.add(lumi.root);
const macaw = new Macaw(); world.add(macaw.root); macaw.root.scale.setScalar(3.2);
const burden = new Burden(); world.add(burden.group);
const toasts = new Toasts(); world.add(toasts.group);
const order = new Order(); world.add(order.group);
const bolts = [makeBolt(1, v3(-14, 40, -60), v3(-10, 2, -58)), makeBolt(2, v3(20, 40, -70), v3(16, 1, -66)), makeBolt(3, v3(-30, 40, -50), v3(-26, 2, -48)), makeBolt(4, v3(8, 40, -45), v3(6, 1, -42)), makeBolt(5, v3(-4, 42, -80), v3(0, 2, -76))];
bolts.forEach(b => { b.visible = false; world.add(b); });
const BOLT_T = [21.0, 24.45, 27.85, 31.3, 34.1];

const sun = new THREE.DirectionalLight('#fff0d8', 3.2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 3;
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 120 });
world.add(sun, sun.target);
const hemi = new THREE.HemisphereLight('#cfe8ff', '#5c7a3c', 1.0); world.add(hemi);
const titleFill = new THREE.DirectionalLight('#ffe9cc', 0); titleFill.position.set(-1, 0.4, 0.3); world.add(titleFill, titleFill.target);
const flashLight = new THREE.PointLight('#cfdcff', 0, 200, 1.2); flashLight.position.set(-10, 30, -30); world.add(flashLight);
const rayLight = new THREE.SpotLight('#ffd391', 0, 80, 0.32, 0.8, 1.0); rayLight.position.set(4, 34, -10); world.add(rayLight, rayLight.target);
world.fog = new THREE.FogExp2('#cfe2ee', 0.004);

// environment maps from the sky shader (sunny + golden)
const pmrem = new THREE.PMREMGenerator(renderer);
function envFromSky(state) {
  const s = new THREE.Scene(); const sk = makeSky(); Object.entries(state).forEach(([k, v]) => sk.material.uniforms[k].value = v); s.add(sk);
  return pmrem.fromScene(s, 0, 0.1, 1000).texture;
}
const SUN_DAY = new THREE.Vector3(0.45, 0.62, 0.62).normalize();
const SUN_GOLD = new THREE.Vector3(0.92, 0.17, -0.34).normalize();
const envDay = envFromSky({ uSun: SUN_DAY, uStorm: 0, uGold: 0 });
const envGold = envFromSky({ uSun: SUN_GOLD, uStorm: 0, uGold: 1 });
const envStorm = envFromSky({ uSun: SUN_DAY, uStorm: 1, uGold: 0 });
NB.scene.environment = envDay; NB.scene.environmentIntensity = 0.25;

// 3D titles
const goldMat = new THREE.MeshPhysicalMaterial({ color: '#f2a218', metalness: 1, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.1, emissive: '#8a4a00', emissiveIntensity: 0.55, envMapIntensity: 0.8 });
const pearlMat = new THREE.MeshPhysicalMaterial({ color: '#2a8ae0', metalness: 0.35, roughness: 0.25, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color('#bfe6ff'), emissive: '#0d4fa0', emissiveIntensity: 0.75, envMapIntensity: 0.8 });
const titles = new THREE.Group(); world.add(titles);
const flyHigh = text3D('FLY HIGH', 'fredoka', 6, { material: goldMat, depth: 1.4 });
const withYuv = text3D('WITH YUV.AI', 'fredoka', 3.0, { material: pearlMat, depth: 0.7 });
const finalTitle = new THREE.Group(); finalTitle.add(flyHigh, withYuv); flyHigh.position.y = 2.6; withYuv.position.y = -2.8;
titles.add(finalTitle);
const TITLE_POS = v3(222, 58, -14);
finalTitle.position.copy(TITLE_POS); finalTitle.rotation.y = -Math.PI / 2; // face -x (towards the camera)

const words = [['בהירות', v3(152, 55.5, -18.5), 0.3], ['הקשר רחב', v3(166, 51.5, -9.5), -0.3], ['תמונה מלאה', v3(180, 57, -18), 0.25]].map(([s, p, yaw], i) => {
  const m = text3D(s, 'rubik', 2.4, { material: i % 2 ? pearlMat : goldMat, depth: 0.7 }); m.position.copy(p); m.rotation.y = -Math.PI / 2 + yaw; m.userData.base = p.clone(); titles.add(m); return m;
});

// ---------------------------------------------------------------- paths
const LAND = v3(2.1, meadow.height(2.1, 0.3), 0.3);
function groundY(x, z) { return meadow.height(x, z); }
const FLIGHT = [
  [44.0, v3(2.1, LAND.y + 0.85, 0.3)], [45.2, v3(5.5, 6, -3)], [46.5, v3(13, 16, -9)], [47.6, v3(21, 26, -13)],
  [49.0, v3(31, 37, -16)], [50.2, v3(40, 47.5, -16)], [51.5, v3(52, 50, -14)],
];
function flightPos(t) {
  if (t <= FLIGHT[0][0]) return FLIGHT[0][1].clone();
  const last = FLIGHT[FLIGHT.length - 1];
  if (t >= last[0]) { const dt = t - last[0]; return v3(last[1].x + dt * 10 + smooth(61.5, 66, t) * (t - 61.5) * 2.5, 50 + Math.sin(dt * 0.6) * 0.8 + smooth(61, 68, t) * 21, -14 + Math.sin(dt * 0.25) * 2.2); }
  const pts = FLIGHT.map(f => f[1]); const ts = FLIGHT.map(f => f[0]);
  let i = 0; while (t > ts[i + 1]) i++;
  const u = (i + (t - ts[i]) / (ts[i + 1] - ts[i])) / (pts.length - 1);
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal').getPoint(u);
}

// ---------------------------------------------------------------- per-frame
const tmpQ = new THREE.Quaternion();
function shake(t, amp, freq = 1.3) { return v3(noise1(t * freq, 1) * amp, noise1(t * freq, 2) * amp, noise1(t * freq, 3) * amp * 0.5); }
const ITEM_T = [20.0, 20.65, 21.25, 21.85, 22.4, 22.9, 23.4, 23.9, 24.45, 24.95, 25.45, 25.95, 26.45, 26.95, 27.45, 28.05];

function renderAt(t) {
  let scene, fov = 40, pos, target, roll = 0;
  const G = post.grade.uniforms;
  G.uFlash.value = 0; G.uVig.value = 0.35; G.uSat.value = 1; G.uTint.value.setRGB(1, 1, 1); G.uExpo.value = 1;
  post.bloom.strength = 0.45; post.bloom.threshold = 0.85; post.bloom.radius = 0.5;
  post.final.uniforms.uT.value = t; post.final.uniforms.uFade.value = 0;

  if (t < 9.0) {
    // ============================================== SCENE 1 — the doodle
    scene = NB.scene;
    const total = NB.doodle.total;
    const prog = total * clamp((t - 0.55) / 5.9);
    const fade = smooth(6.95, 7.6, t), glow = pulse(6.3, 6.75, 7.0, 7.6, t);
    const tip = NB.drawDoodle(prog, fade, glow);
    // pen: follow tip; lift between strokes; leave after drawing
    let tipW;
    {
      const { S, meta } = NB.doodle; let idx = meta.findIndex(m => prog <= m.start + m.len);
      if (idx < 0) idx = meta.length - 1;
      const m = meta[idx];
      let p, lift = 0;
      if (prog < m.start) { // travelling to this stroke
        const prev = idx > 0 ? S[idx - 1][S[idx - 1].length - 1] : { x: 0.7, y: 0.2 }; const nxt = S[idx][0];
        const pm = idx > 0 ? meta[idx - 1] : { start: 0, len: 0 }; const f = clamp((prog - (pm.start + pm.len)) / Math.max(0.0001, m.start - (pm.start + pm.len)));
        p = { x: lerp(prev.x, nxt.x, easeInOut(f)), y: lerp(prev.y, nxt.y, easeInOut(f)) }; lift = Math.sin(f * Math.PI) * 0.22;
      } else p = tip || S[0][0];
      if (t < 0.55) { p = S[0][0]; lift = (0.55 - t) * 1.2; }
      tipW = NB.uvToWorld(p.x, p.y); tipW.y += lift + 0.01;
      const leave = easeInCubic(clamp((t - 6.45) / 0.8));
      NB.pen.position.copy(tipW).add(v3(leave * 2.5, leave * 3.5, -leave * 1.0));
      NB.pen.rotation.set(-0.38 - leave * 0.3, 0.2, -0.42 + noise1(t * 3, 4) * 0.03);
      NB.pen.visible = t < 7.6;
    }
    // Lumi pops out of the page
    const popK = clamp((t - 6.9) / 0.9);
    lumiNB.root.visible = popK > 0;
    lumiNB.root.position.copy(pageFeet).add(v3(0, -0.02, 0)); lumiNB.root.rotation.y = -0.12;
    const s = 1.22;
    lumiNB.root.scale.set(s * (1 + (1 - easeOutElastic(popK)) * 0.0), s * Math.max(0.02, easeOutElastic(popK)), s * Math.max(0.05, easeOutElastic(popK)));
    lumiNB.update(t, {
      expr: { smile: lerp(0.3, 1, smooth(7.6, 8.1, t)), open: pulse(8.0, 8.2, 8.5, 8.8, t) * 0.6, look: [lerp(0.4, 0.05, smooth(7.6, 8.2, t)), lerp(0.3, 0.05, smooth(7.6, 8.2, t))], lid: pulse(7.0, 7.2, 7.55, 7.75, t) * 0.9, blink: t > 8 },
      wave: smooth(8.15, 8.4, t), armsUp: smooth(8.15, 8.4, t) * 0.0 + pulse(8.1, 8.4, 9, 9.2, t) * 0.0,
      squash: (1 - easeOutElastic(popK)) * -0.2,
    });
    if (lumiNB.root.visible) { lumiNB.arms[1].rotation.z = lerp(0.35, 2.4, smooth(8.15, 8.45, t)) + Math.sin(t * 15) * 0.3 * smooth(8.3, 8.5, t); }
    // sparkles
    const sp = NB.sparkles; sp.position.copy(pageFeet); sp.scale.setScalar(1.6); sp.material.uniforms.uT.value = t; sp.material.uniforms.uK.value = pulse(6.6, 7.0, 8.2, 9.0, t);
    // camera
    const pc = pageCenter.clone();
    const A = pc.clone().add(v3(0.35, 5.0, 2.3)), B = pc.clone().add(v3(0.05, 4.1, 1.75));
    const C = pageFeet.clone().add(v3(0.55, 1.15, 3.6)), D = pageFeet.clone().add(v3(0.2, 1.05, 2.75));
    const k1 = smooth(0, 6.6, t), k2 = smoother(6.4, 8.0, t), k3 = smooth(8.0, 9.0, t);
    pos = A.clone().lerp(B, k1).lerp(C, k2).lerp(D, k3);
    const tgA = pc.clone().add(v3(0, 0, 0.25)).lerp(tipW || pc, 0.18 * (1 - k2));
    target = tgA.lerp(pageFeet.clone().add(v3(0, 0.95, 0)), k2);
    fov = lerp(38, 34, k2);
    pos.add(shake(t, 0.03, 0.6));
    G.uVig.value = 0.6; post.bloom.strength = 0.25 + glow * 0.6; post.bloom.threshold = 0.92; G.uExpo.value = 0.85;
    G.uFlash.value = smooth(8.55, 9.0, t) * 0.95; G.uFlashCol.value.setRGB(1.0, 0.95, 0.85);
    post.final.uniforms.uFade.value = 1 - smooth(0.0, 0.7, t);
  } else {
    // ============================================== WORLD
    scene = world;
    const storm = smoother(16.6, 19.6, t) * (1 - smoother(49.6, 50.4, t));
    const hole = smooth(36.2, 38.4, t) * (1 - smooth(46, 48, t));
    const gold = smoother(49.8, 50.6, t);
    let wind = 0.25 + storm * 0.9 + pulse(19, 21, 30, 33, t) * 0.4 - hole * 0.4;
    const U = sky.material.uniforms; U.uT.value = t; U.uStorm.value = storm; U.uGold.value = gold; U.uHole.value = hole;
    U.uSun.value.copy(SUN_DAY).lerp(SUN_GOLD, gold).normalize();
    // lightning
    let flash = 0;
    BOLT_T.forEach((bt, i) => { const d = t - bt; const f = d > 0 && d < 0.5 ? (Math.exp(-d * 14) + 0.7 * Math.exp(-Math.abs(d - 0.18) * 30)) : 0; flash = Math.max(flash, f); bolts[i].visible = d > 0 && d < 0.32 && storm > 0.5; });
    const flashInCloud = pulse(48.3, 48.4, 48.5, 48.75, t) * 0.8;
    flash = Math.max(flash * storm, flashInCloud);
    U.uFlash.value = flash; U.uFlashDir.value.set(-0.3, 0.5, -1).normalize();
    // lights
    sun.color.set('#fff0d8').lerp(new THREE.Color('#ffd09a'), gold);
    sun.intensity = lerp(3.4, 0.25, storm) * (1 - gold) + gold * 3.0 + hole * 0.6;
    hemi.color.set('#cfe8ff').lerp(new THREE.Color('#7f8896'), storm).lerp(new THREE.Color('#bcd9f2'), gold);
    hemi.groundColor.set('#5c7a3c').lerp(new THREE.Color('#2b3326'), storm).lerp(new THREE.Color('#ffe3b8'), gold);
    hemi.intensity = (lerp(1.1, 0.75, storm) + flash * 0.9) * (1 - gold * 0.5);
    flashLight.intensity = flash * 700;
    world.environment = gold > 0.5 ? envGold : (storm > 0.5 ? envStorm : envDay); world.environmentIntensity = lerp(0.6, 0.35, storm) + gold * 0.15;
    meadow.update(t, wind);
    meadow.group.visible = t < 50.5; if (q.has('nograss')) meadow.grass.visible = false;

    // ------------------------------ Lumi + macaw choreography
    let lp = v3(0, 0, 0.4), lrot = 0, lscale = 1, lpose = {}, lexpr = {};
    const walkK = 1 - smooth(16.0, 16.8, t);
    if (t < 16.8) {
      const x = lerp(-7.5, 0, clamp((t - 9.0) / 7.4) * 0.92 + smooth(9.0, 16.4, t) * 0.08);
      lp.set(x, groundY(x, 0.4), 0.4); lrot = lerp(Math.PI / 2, 0.35, smooth(15.6, 16.8, t));
      lpose = { walk: walkK, walkPhase: x * 4.2 };
      lexpr = { smile: 1, look: [0.2, 0.1] };
    } else {
      lp.set(0, groundY(0, 0.4), 0.4); lrot = lerp(0.35, 0.15, smooth(17, 19, t));
    }
    const { landed, lastLand } = (() => {
      let n = 0, ll = -10; ITEM_T.forEach(tt => { if (t >= tt) { n++; ll = tt; } }); return { landed: n, lastLand: ll };
    })();
    const load = landed / ITEM_T.length;
    const hit = t - lastLand < 0.5 ? Math.exp(-(t - lastLand) * 8) : 0;
    if (t >= 16.8 && t < 43.0) {
      const collapse = smoother(30.2, 32.2, t) * (1 - smooth(41.0, 42.4, t) * 0.6);
      lpose = {
        squash: load * 0.22 + hit * 0.18 + collapse * 0.32, hunch: load * 0.32 + collapse * 0.3 - pulse(38, 39.5, 41, 42, t) * 0.3,
        sink: collapse * 0.12, sit: collapse, sway: Math.sin(t * 3.2) * 0.04 * load * (1 - collapse) + (collapse > 0.5 ? Math.sin(t * 9) * 0.012 : 0),
        sproutDroop: clamp(load * 1.1 + collapse * 0.5) * (1 - smooth(39, 41, t) * 0.5), wind: storm, armsDown: collapse,
      };
      lexpr = {
        smile: track([[16.8, 1], [17.6, 0], [19.8, -0.5], [25, -0.8], [30, -1], [38, -0.6], [41.5, 0.2], [43, 0.6]], t),
        open: pulse(17.3, 17.6, 18.6, 19.2, t) * 0.8 + pulse(28.5, 28.8, 29.4, 29.8, t) * 0.5,
        worry: track([[16.8, 0], [17.6, 0.6], [20, 1], [38, 1], [41.5, 0.3], [43, 0]], t),
        lid: track([[30, 0], [32, 0.55], [36.5, 0.55], [37.6, 0.1]], t) + pulse(33.8, 34.0, 34.6, 34.9, t) * 0.4,
        look: t < 20 ? [0.1, lerp(0, 0.9, smooth(17.2, 18, t))] : t < 37 ? [Math.sin(t * 2.3) * 0.5, 0.6 - smooth(29, 31, t) * 1.2] : t < 40 ? [0.4, 0.9] : [0.9, 0.6],
        cry: smooth(26.5, 28.5, t) * (1 - smooth(39.5, 41.5, t)), blush: lerp(1, 0.5, storm), blink: t < 30 || t > 37.5,
      };
    }
    // macaw arrival & boarding
    const mDescend = clamp((t - 36.6) / 3.6);
    let mp = v3(9, 30, -16), mBank = 0, mPitch = 0, mYaw = -Math.PI / 2, mFlap = 1, mPhase = t * 11, mFold = 0, mLegs = 0, mBeak = 0, mTail = 0, mHead = 0;
    if (t < 44.0) {
      const P0 = v3(14, 30, -22), P1 = v3(6, 14, -8), P2 = v3(LAND.x + 0.5, LAND.y + 3.2, LAND.z - 1.0), P3 = v3(LAND.x, LAND.y + 0.85, LAND.z);
      const curve = new THREE.CubicBezierCurve3(P0, P1, P2, P3);
      const e = easeOutCubic(mDescend);
      mp = curve.getPoint(e);
      const tan = curve.getTangent(Math.min(0.999, e)); mYaw = Math.atan2(tan.x, tan.z) * (1 - smooth(0.8, 1, mDescend)) + smooth(0.8, 1, mDescend) * -1.2;
      mPitch = -0.35 * (1 - mDescend) + pulse(0.7, 0.85, 0.95, 1.0, mDescend) * -0.4;
      mFlap = lerp(0.35, 1, smooth(0.6, 0.85, mDescend)) * (1 - smooth(40.2, 40.9, t)); mPhase = t * lerp(7, 13, smooth(0.6, 0.9, mDescend));
      mFold = smooth(40.6, 41.4, t) * (1 - pulse(41.4, 41.9, 42.7, 43.2, t) * 0.75); mLegs = smooth(0.7, 0.95, mDescend);
      mBeak = (t > 40.2 && t < 43.6) ? Math.max(0, Math.sin((t - 40.2) * 9)) * 0.7 : 0;
      mHead = smooth(40, 40.6, t);
      mTail = pulse(0.75, 0.9, 1.0, 1.0, mDescend);
      if (mDescend <= 0) mp.set(14, 40, -22);
    } else {
      mp = flightPos(t);
      const ahead = flightPos(t + 0.15); const dir = ahead.clone().sub(mp);
      mYaw = Math.atan2(dir.x, dir.z); mPitch = -Math.atan2(dir.y, Math.hypot(dir.x, dir.z)) * 0.8;
      mBank = Math.sin(t * 0.4) * 0.12 - smooth(44, 44.5, t) * 0.0;
      const climb = smooth(44, 44.4, t) * (1 - smooth(50.4, 51.4, t));
      mFlap = Math.max(climb, 0.35 + 0.35 * Math.sin(t * 0.7)); mPhase = t * lerp(9, 12, climb);
      mFold = 0; mLegs = 1 - smooth(44.2, 44.8, t); mTail = 0.3;
    }
    macaw.root.position.copy(mp); macaw.root.rotation.set(0, mYaw, 0);
    macaw.pose(t, { phase: mPhase, flap: mFlap, fold: mFold, bank: mBank, pitch: mPitch, legs: mLegs, beakOpen: mBeak, tailFan: mTail });
    macaw.root.visible = t > 36.4;
    // lumi boards the macaw (42.6 -> 43.6), then rides
    const board = smoother(42.6, 43.5, t);
    macaw.root.updateMatrixWorld(true);
    const seat = macaw.body.localToWorld(v3(0, 0.205, -0.02));
    if (board > 0) {
      const from = lp.clone(); const hop = Math.sin(board * Math.PI) * 1.4;
      lp = from.lerp(seat, board); lp.y += hop;
      lscale = lerp(1, 0.78, board);
      const qSeat = new THREE.Quaternion(); macaw.body.getWorldQuaternion(qSeat);
      lumi.root.quaternion.slerpQuaternions(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, lrot, 0)), qSeat, board);
      lpose = Object.assign(lpose || {}, { sit: 1, squash: lerp(lpose.squash || 0, 0.1, board), hunch: lerp(lpose.hunch || 0, -0.1, board) });
      if (t > 44) {
        const free = smooth(51.6, 53.8, t);
        lpose = { sit: 1, squash: 0.08 * (1 - free), hunch: lerp(0.15, -0.25, free), armsUp: free * 0.75 + pulse(56, 56.5, 58, 59, t) * 0.0, sproutDroop: lerp(0.4, -0.15, free), wind: 1, sway: Math.sin(t * 2) * 0.03 };
        lexpr = { smile: lerp(0.3, 1, smooth(50.5, 53, t)), open: pulse(50.3, 50.6, 51.4, 52, t) * 0.7 + free * 0.35, worry: lerp(0.4, 0, smooth(49.5, 51.5, t)), look: [0.2, 0.3], blush: 1, cry: 0 };
      }
    } else lumi.root.rotation.set(0, lrot, 0);
    lumi.root.position.copy(lp); lumi.root.scale.setScalar(lscale);
    lumi.update(t, Object.assign({ expr: lexpr }, lpose));
    lumi.root.visible = t >= 9.0;
    // burden attaches to the top of Lumi's head
    lumi.root.updateMatrixWorld(true);
    const anchor = lumi.pivot.localToWorld(v3(0, 1.0, -0.05));
    lumi.pivot.getWorldQuaternion(tmpQ);
    burden.group.scale.setScalar(1);
    const bl = burden.update(t, ITEM_T, anchor, tmpQ, [51.6, 53.6]);
    burden.group.visible = t > 18 && t < 55;
    // toasts swirl
    const tc = lp.clone(); toasts.update(t, tc, 19.5, 0.42, camera.position, (1 - smooth(37.5, 39.5, t)), storm);
    // rain + god ray
    const rainAmt = storm * (1 - hole * 0.55) * (1 - smooth(46.5, 48, t));
    rain.update(t, camera.position, rainAmt * 0.9, wind);
    godRay.position.set(LAND.x - 0.6, 40, LAND.z - 0.8); godRay.material.uniforms.uA.value = hole * 0.28 * (1 - smooth(44.5, 46.5, t)); godRay.material.uniforms.uT.value = t; godRay.visible = hole > 0.01;
    rayLight.intensity = hole * 140 * (1 - smooth(44, 46, t)); rayLight.position.set(LAND.x + 2, 34, LAND.z - 6); rayLight.target.position.copy(LAND);
    clouds.stormPuffs.visible = t > 45 && t < 51.5;
    clouds.sea.visible = clouds.group.visible = t > 44;
    // order formation
    const ORDER_C = v3(97, 45.5, -14);
    order.group.position.copy(ORDER_C);
    order.update(t, smoother(53.6, 57.2, t) * (1 - smooth(60.5, 62, t)), camera.position);
    titles.visible = t > 57;
    words.forEach((w, i) => { w.visible = t > 59 && t < 65.5; w.rotation.z = Math.sin(t * 0.8 + i) * 0.05; const k = easeOutBack(clamp((t - (59.6 + i * 0.9)) / 0.9)); w.scale.setScalar(Math.max(0.001, k)); w.position.y = w.userData.base.y + (1 - k) * -3; });
    finalTitle.position.y = TITLE_POS.y + Math.sin(t * 0.9) * 0.3;
    { const k1 = easeOutBack(clamp((t - 63.0) / 1.1), 1.4), k2 = easeOutBack(clamp((t - 63.5) / 1.0), 1.6); const base = PORTRAIT ? 0.8 : 1;
      flyHigh.scale.setScalar(Math.max(0.001, k1)); withYuv.scale.setScalar(Math.max(0.001, k2)); finalTitle.scale.setScalar(base);
      flyHigh.rotation.x = (1 - clamp((t - 63.0) / 1.1)) * -0.8; withYuv.rotation.x = (1 - clamp((t - 63.5) / 1.0)) * 0.8; }
    titleFill.intensity = smooth(58.5, 60, t) * 2.2; titleFill.target.position.copy(TITLE_POS); titleFill.position.copy(TITLE_POS).add(v3(-60, 18, 20));

    // fog by phase / altitude
    const camY = 0; // set after camera
    // ------------------------------ camera
    const C = lumi.root.position.clone();
    if (t < 16.6) {
      const k = smoother(9.0, 11.6, t);
      const wide = v3(-11.5, 4.2, 10.5), side = v3(C.x + 1.4, C.y + 1.25, 5.2);
      pos = wide.clone().lerp(side, k);
      const tgt0 = v3(-3, 6.5, -30); target = tgt0.lerp(C.clone().add(v3(0.6, 0.7, 0)), k);
      pos.add(v3(smooth(12.2, 16.6, t) * -0.6, 0, smooth(12.2, 16.6, t) * -1.0));
      fov = lerp(46, 36, k);
    } else if (t < 30.0) {
      const k = smoother(16.6, 19.6, t);
      const pA = v3(1.0, C.y + 1.25, 4.2), pB = v3(1.6, C.y + 1.0, 3.3);
      pos = pA.lerp(pB, k); target = C.clone().add(v3(0.1, 0.85 + smooth(17, 18.2, t) * 0.25, 0));
      if (t > 19.6) {
        const o = smooth(19.6, 29.6, t);
        const ang = lerp(0.45, -0.55, o), rad = lerp(3.5, 6.4, smooth(19.6, 27, t)), hh = lerp(1.0, 2.6, smooth(19.6, 28, t));
        const orbit = v3(C.x + Math.sin(ang) * rad, C.y + hh, C.z + Math.cos(ang) * rad);
        pos = pos.lerp(orbit, smooth(19.6, 21, t)); target = C.clone().add(v3(0, lerp(0.95, 2.0, smooth(19.6, 28, t)), 0));
      }
      pos.add(shake(t, 0.05 + storm * 0.06 + hit * 0.1, 1.4)); fov = 38 + hit * -1.5;
      roll = noise1(t * 0.7, 9) * 0.02 * storm;
    } else if (t < 36.4) {
      const k = smooth(30.0, 36.4, t);
      pos = v3(C.x + lerp(0.7, 0.3, k), C.y + lerp(0.6, 0.5, k), C.z + lerp(3.4, 2.5, k)); target = C.clone().add(v3(0, lerp(0.95, 0.72, k), 0));
      pos.add(shake(t, 0.025, 0.8)); fov = 34;
      G.uSat.value = lerp(0.85, 0.55, smooth(30, 33, t)); G.uTint.value.setRGB(0.88, 0.95, 1.12);
    } else if (t < 40.0) {
      const k = smoother(36.4, 39.9, t);
      // low angle behind Lumi looking up at the opening sky and the descending macaw
      pos = v3(C.x - 1.6, C.y + 0.45, C.z + 2.4).lerp(v3(C.x - 2.4, C.y + 0.55, C.z + 3.9), k);
      target = v3(C.x + 2.5, C.y + 9, C.z - 6).lerp(mp.clone().add(v3(0, 0.6, 0)), smooth(37.8, 39.6, t));
      fov = lerp(42, 36, k); pos.add(shake(t, 0.02, 0.6));
      G.uSat.value = lerp(0.6, 1.0, smooth(36.5, 39.5, t)); G.uTint.value.setRGB(1, 1, 1);
    } else if (t < 44.0) {
      const k = smoother(40.0, 43.9, t);
      const mid = LAND.clone().lerp(C, 0.5);
      pos = v3(mid.x - 1.9, mid.y + 1.5, mid.z + 6.4).lerp(v3(mid.x - 2.6, mid.y + 2.0, mid.z + 7.2), k);
      target = mid.clone().add(v3(0.3, lerp(1.25, 1.9, smooth(42.5, 43.8, t)), 0));
      fov = 34;
    } else if (t < 50.4) {
      // chase the climb: behind-below, then inside the clouds
      const m = macaw.root.position;
      const back = v3(-7.5, -2.2, 6.5).lerp(v3(-6, -1.2, 3.8), smooth(46, 49, t));
      pos = m.clone().add(back); target = m.clone().add(v3(2, 1.5, -1.5));
      pos.add(shake(t, 0.12 + pulse(47.6, 48, 49.6, 50.2, t) * 0.2, 2.2)); fov = 48; roll = Math.sin(t * 0.9) * 0.05;
    } else if (t < 54.0) {
      // above the clouds: side tracking with sun ahead
      const m = macaw.root.position; const k = smoother(50.4, 53.9, t);
      pos = m.clone().add(v3(-4.5, 3.2, 12).lerp(v3(-1.5, 1.6, 7.5), k)); target = m.clone().add(v3(1.4, 1.4, 0));
      fov = lerp(52, 38, k); pos.add(shake(t, 0.04, 0.8)); roll = -0.04;
    } else if (t < 58.6) {
      // crane up: see the whole picture from above
      const m = macaw.root.position; const k = smoother(54.0, 57.6, t);
      const near = m.clone().add(v3(-1.5, 1.6, 7.5)), high = ORDER_C.clone().add(v3(-16, 34, 16));
      pos = near.lerp(high, k);
      target = m.clone().add(v3(1.4, 1.4, 0)).lerp(ORDER_C.clone().lerp(m, 0.25), k);
      fov = lerp(38, 46, k);
    } else if (t < 63.0) {
      // swoop down behind the macaw and fly through the words
      const m = macaw.root.position; const k = smoother(58.6, 60.4, t);
      const high = ORDER_C.clone().add(v3(-16, 34, 16));
      const chase = m.clone().add(v3(-9, 2.2, 1.8));
      pos = high.lerp(chase, k);
      target = ORDER_C.clone().lerp(m.clone().add(v3(10, 0.5, -0.5)), k);
      fov = lerp(46, 50, k); roll = Math.sin(t * 0.8) * 0.06 * k;
    } else {
      // settle: macaw flies on toward the sun over the final title
      const camEnd = TITLE_POS.clone().add(v3(PORTRAIT ? -46 : -40, -5.5, 0));
      const k = smoother(63.0, 66.5, t);
      const m = flightPos(63.0); const start = m.clone().add(v3(-9, 2.2, 1.8));
      pos = start.lerp(camEnd, k); target = flightPos(63).add(v3(10, 0.5, -0.5)).lerp(TITLE_POS.clone().add(v3(0, PORTRAIT ? -3.5 : -3.2, 0)), smooth(63, 66, t));
      fov = PORTRAIT ? 44 : 40;
      pos.add(shake(t, 0.03, 0.4));
    }
    // fog & atmosphere by altitude/phase
    const alt = pos.y;
    const inCloud = smooth(CLOUD_BASE - 4, CLOUD_BASE + 2, alt) * (1 - smooth(CLOUD_TOP - 3, CLOUD_TOP + 1, alt)) * (t < 51 ? 1 : 0);
    const fogCol = new THREE.Color('#d7e6ef').lerp(new THREE.Color('#5a6170'), storm).lerp(new THREE.Color('#b9bfc8'), inCloud).lerp(new THREE.Color('#ffe2b8'), gold);
    world.fog.color.copy(fogCol).lerp(new THREE.Color().setRGB(0.95, 0.74, 0.5), gold);
    world.fog.density = lerp(0.006, 0.026, storm) * (1 - gold) + inCloud * 0.045 + gold * 0.00055 + hole * -0.006;
    world.fog.density = Math.max(0.0005, world.fog.density);
    sky.position.copy(pos); clouds.cull(pos);
    // sun shadow follows the action
    const focus = t < 44 ? C : macaw.root.position;
    const sdir = U.uSun.value.clone(); sun.position.copy(focus).addScaledVector(sdir, 60); sun.target.position.copy(focus);
    // grading per phase
    post.bloom.strength = 0.4 - gold * 0.12 + hole * 0.3 + flash * 0.4; post.bloom.threshold = lerp(0.88, 0.95, gold);
    G.uVig.value = 0.35 + storm * 0.25;
    if (t < 36.4) { G.uSat.value = Math.min(G.uSat.value, lerp(1.08, 0.72, storm)); }
    if (gold > 0) { G.uExpo.value = lerp(1, 0.8, gold); G.uSat.value = lerp(G.uSat.value, 1.18, gold); G.uTint.value.lerp(new THREE.Color(1.04, 1.0, 0.95), gold); }
    G.uFlash.value = Math.max(pulse(8.9, 9.0, 9.0, 9.6, t) * 0.95, pulse(49.95, 50.2, 50.25, 50.65, t) * 0.7, flash * 0.035);
    G.uFlashCol.value.setRGB(1.0, 0.92, 0.75);
    post.final.uniforms.uFade.value = smooth(69.0, 70.0, t);
  }

  camera.fov = fitFov(fov); camera.aspect = W / H; camera.updateProjectionMatrix();
  camera.position.copy(pos); camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(target);
  const HIDE = (q.get('hide') || '').split(',');
  if (HIDE.includes('sky')) sky.visible = false; if (HIDE.includes('sea')) clouds.sea.visible = false; if (HIDE.includes('puffs')) clouds.puffs.forEach(p => p.visible = false);
  if (HIDE.includes('macaw')) macaw.root.visible = false; if (HIDE.includes('order')) order.group.visible = false; if (HIDE.includes('lumi')) lumi.root.visible = false;
  if (HIDE.includes('post')) { renderer.setRenderTarget(null); renderer.render(scene, camera); return; }
  post.renderPass.scene = scene; post.renderPass.camera = camera;
  if (!HIDE.includes('over')) overlay.render(t, (ctx, ov) => { if (t > 63.6) ov.drawEndCard(t, 63.6); });
  post.composer.render();
}

window.renderAt = renderAt;
window.audioCues = () => {
  const total = NB.doodle.total, meta = NB.doodle.meta, pen = [];
  let down = false, t0 = 0;
  for (let t = 0.5; t < 6.6; t += 1 / 240) { const prog = total * clamp((t - 0.55) / 5.9); const d = meta.some(m => prog > m.start && prog < m.start + m.len) && prog < total;
    if (d && !down) { down = true; t0 = t; } if (!d && down) { down = false; pen.push([t0, t]); } }
  const steps = []; let prev = null;
  for (let t = 9.0; t < 16.8; t += 1 / 240) { const x = lerp(-7.5, 0, clamp((t - 9.0) / 7.4) * 0.92 + smooth(9.0, 16.4, t) * 0.08); const ph = Math.sin(x * 4.2); if (prev !== null && Math.sign(ph) !== Math.sign(prev) && t < 16.3) steps.push(+t.toFixed(3)); prev = ph; }
  return { pen, steps, items: ITEM_T, bolts: BOLT_T, toasts: Array.from({ length: 12 }, (_, i) => +(19.5 + i * 0.42).toFixed(3)) };
};
window.DURATION = DURATION;
renderAt(0.0); renderAt(10.0); renderAt(45.0); // warm-up compile of both scenes
window.__ready = true;
