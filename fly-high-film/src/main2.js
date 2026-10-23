// Film v2: 3D notebook opening (pen draws Noa) -> hand-drawn colour illustration on the page.
import * as THREE from 'three';
import { clamp, lerp, smooth, smoother, pulse, easeInOut, easeInCubic, v3, noise1 } from './util.js';
import { Notebook } from './notebook.js';
import { makePost } from './post.js';
import { Overlay } from './captions.js';
import { girlStrokes } from './girl.js';
import { render2D, GIRL, GS } from './film2d.js';

const q = new URLSearchParams(location.search);
const W = +(q.get('w') || 1920), H = +(q.get('h') || 1080);
const PORTRAIT = H > W;
export const DURATION = 81;
const R = 4.1 / 3.0; // page height / width

await Promise.all(['800', '900', '700', '600', '500'].map(w => document.fonts.load(`${w} 40px "Rubik"`, 'אבג')).concat([
  document.fonts.load('700 40px "Fredoka"', 'ABC'), document.fonts.load('40px "Noto Color Emoji"', '🔔👩‍🏫')]));

// ---- 3D (opening only)
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.domElement.style.display = 'none'; document.body.appendChild(renderer.domElement);
const post = makePost(renderer, W, H, 0);
post.final.uniforms.tOver.value = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1); post.final.uniforms.tOver.value.needsUpdate = true;
const camera = new THREE.PerspectiveCamera(36, W / H, 0.05, 200);
function fitFov(vfov) { if (!PORTRAIT) return vfov; const h = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(vfov) / 2) * 16 / 9) * 0.66; return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / (W / H))); }

const NB = new Notebook(renderer);
// Noa's doodle: girl local units -> page uv
const strokes = girlStrokes({ smile: 0.6, blink: false, look: [0, 0] })
  .map(st => ({ ...st, pts: st.pts.map(([x, y]) => [GIRL[0] + x * GS, (GIRL[1] + y * GS) / R]), w: st.w * GS * 2048 * 0.9 }))
  .map(st => ({ ...st, top: Math.min(...st.pts.map(p => p[1])) }))
  .sort((a, b) => (a.top - b.top));
NB.setDoodle(strokes);
const gc = NB.uvToWorld(GIRL[0], (GIRL[1] - GS * 0.5) / R); // doodle centre in 3D
const pageUp = NB.uvToWorld(GIRL[0], 0.0).sub(NB.uvToWorld(GIRL[0], 1.0)).normalize();
const pageN = new THREE.Vector3(0, 1, 0);
const HANDOFF = 7.6;
const endPos = gc.clone().addScaledVector(pageN, PORTRAIT ? 3.3 : 2.45);

function pose3D(t) {
  const pc = NB.uvToWorld(0.5, 0.5);
  const A = pc.clone().add(v3(0.35, 5.0, 2.3)), B = pc.clone().add(v3(0.05, 4.1, 1.75));
  const k1 = smooth(0, 6.4, t), k2 = smoother(6.2, HANDOFF, t);
  const pos = A.clone().lerp(B, k1).lerp(endPos, k2);
  const tgt = pc.clone().add(v3(0, 0, 0.25)).lerp(gc, Math.max(0.3 * k1, k2));
  const up = new THREE.Vector3(0, 1, 0).lerp(pageUp, k2).normalize();
  return { pos, tgt, up };
}
// matching 2D camera at the hand-off
function handoffCam() {
  const { pos, tgt, up } = pose3D(HANDOFF);
  camera.fov = fitFov(36); camera.aspect = W / H; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.up.copy(up); camera.lookAt(tgt); camera.updateMatrixWorld();
  const pr = (u, v) => { const p = NB.uvToWorld(u, v).project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; };
  const [px, py] = pr(GIRL[0], 0.5), [px2] = pr(GIRL[0] + 0.1, 0.5);
  const z = (px2 - px) / 0.1;
  const vw = W / z / (PORTRAIT ? 0.62 : 1);
  return { cx: GIRL[0] + (W / 2 - px) / z, cy: 0.5 * R + (H / 2 - py) / z, vw };
}
const START = handoffCam();

function render3D(t) {
  const total = NB.doodle.total;
  const prog = total * clamp((t - 0.55) / 5.85);
  const tip = NB.drawDoodle(prog, 0, 0);
  const { S, meta } = NB.doodle; let idx = meta.findIndex(m => prog <= m.start + m.len); if (idx < 0) idx = meta.length - 1;
  const m = meta[idx]; let p, lift = 0;
  if (prog < m.start) { const prev = idx > 0 ? S[idx - 1][S[idx - 1].length - 1] : { x: 0.75, y: 0.3 }; const nxt = S[idx][0]; const pm = idx > 0 ? meta[idx - 1] : { start: 0, len: 0 };
    const f = clamp((prog - (pm.start + pm.len)) / Math.max(1e-4, m.start - (pm.start + pm.len))); p = { x: lerp(prev.x, nxt.x, easeInOut(f)), y: lerp(prev.y, nxt.y, easeInOut(f)) }; lift = Math.sin(f * Math.PI) * 0.12; }
  else p = tip || S[0][0];
  if (t < 0.55) { p = S[0][0]; lift = (0.55 - t) * 1.2; }
  const tipW = NB.uvToWorld(p.x, p.y); tipW.y += lift + 0.01;
  const leave = easeInCubic(clamp((t - 6.35) / 0.9));
  NB.pen.position.copy(tipW).add(v3(leave * 2.8, leave * 4.0, -leave * 1.2)); NB.pen.rotation.set(-0.38 - leave * 0.3, 0.2, -0.42 + noise1(t * 3, 4) * 0.03); NB.pen.visible = t < 7.3;
  NB.sparkles.visible = false;
  const { pos, tgt, up } = pose3D(t);
  const k2 = smoother(6.2, HANDOFF, t);
  pos.add(new THREE.Vector3(noise1(t * 0.6, 1), noise1(t * 0.6, 2), noise1(t * 0.6, 3)).multiplyScalar(0.03 * (1 - k2)));
  camera.fov = fitFov(36); camera.aspect = W / H; camera.updateProjectionMatrix(); camera.position.copy(pos); camera.up.copy(up); camera.lookAt(tgt);
  const G = post.grade.uniforms; G.uVig.value = 0.6 * (1 - k2 * 0.4); G.uExpo.value = 0.85; G.uFlash.value = 0;
  post.bloom.strength = 0.22; post.bloom.threshold = 0.92; post.final.uniforms.uFade.value = 1 - smooth(0, 0.7, t); post.final.uniforms.uT.value = t;
  post.renderPass.scene = NB.scene; post.renderPass.camera = camera; post.composer.render();
}

// ---- 2D output canvas
const out = document.createElement('canvas'); out.width = W; out.height = H; out.id = 'out'; document.body.appendChild(out);
const ctx = out.getContext('2d', { willReadFrequently: true });
const overlay = new Overlay(W, H);
export const CAPS = [
  [0.8, 6.8, 'הכל מתחיל בקו אחד... סקיצה קטנה, במחברת.', 'main'],
  [7.0, 10.3, 'ואז — היא מתעוררת לחיים.', 'main'],
  [11.0, 16.3, 'יום יפה. שמש, שקט... וראש פנוי.', 'main'],
  [17.0, 19.9, 'ופתאום — זה מתחיל.', 'main'],
  [20.2, 28.3, 'עוד התראה. עוד כלי חדש. עוד מודל שחייבים להכיר...\nעוד משהו שכולם כבר מדברים עליו.', 'main'],
  [28.8, 37.3, 'מבול של מידע. רעש. והמשקל רק הולך וגדל...\nעד שכבר לא יודעים מאיפה להתחיל.', 'main'],
  [38.0, 43.3, 'ואז, מבעד לעננים... מגיע מישהו.', 'main'],
  [43.6, 46.4, '״בואי. תעלי עליי.״', 'quote'],
  [48.0, 50.8, 'למעלה. מעל הרעש.', 'main'],
  [55.2, 58.6, 'ומלמעלה — הכל מסתדר.', 'main'],
  [58.8, 64.5, 'לכל אחת ואחד — פתרונות פרקטיים,\nבדיוק לשימושים שלהם.', 'main'],
  [64.8, 69.8, 'יש סדר בדברים... ויש סדר בראש.', 'main'],
  [70.2, 74.9, 'אני יובל אבידני. אני הופך את הרעש — לבהירות.', 'main'],
];

function renderAt(t) {
  if (t < HANDOFF + 0.3) render3D(Math.min(t, HANDOFF));
  if (t >= HANDOFF - 0.25) render2D(ctx, t, W, H, START);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (t < HANDOFF + 0.3) { const a = 1 - smooth(HANDOFF - 0.25, HANDOFF + 0.3, t); ctx.globalAlpha = a; ctx.drawImage(renderer.domElement, 0, 0); ctx.globalAlpha = 1; }
  // caption backing + captions
  const active = CAPS.some(c => t > c[0] - 0.2 && t < c[1] + 0.2);
  if (active) { const g = ctx.createLinearGradient(0, H * 0.62, 0, H); g.addColorStop(0, 'rgba(10,14,30,0)'); g.addColorStop(1, 'rgba(10,14,30,0.42)'); ctx.fillStyle = g; ctx.fillRect(0, H * 0.62, W, H * 0.38); }
  overlay.render(t, (c, ov) => { if (t > 74.6) ov.drawEndCard(t, 74.6); }, CAPS);
  ctx.drawImage(overlay.canvas, 0, 0);
}
window.renderAt = renderAt; window.DURATION = DURATION;
window.audioCues = () => {
  const total = NB.doodle.total, meta = NB.doodle.meta, pen = []; let down = false, t0 = 0;
  for (let t = 0.5; t < 6.5; t += 1 / 240) { const prog = total * clamp((t - 0.55) / 5.85); const d = meta.some(m => prog > m.start && prog < m.start + m.len) && prog < total;
    if (d && !down) { down = true; t0 = t; } if (!d && down) { down = false; pen.push([+t0.toFixed(3), +t.toFixed(3)]); } }
  const steps = []; let prev = null;
  for (let t = 12.4; t < 16.9; t += 1 / 240) { const x = lerp(GIRL[0], 1.75, smoother(12.4, 16.9, t)); const ph = Math.sin(x * 22); if (prev !== null && Math.sign(ph) !== Math.sign(prev)) steps.push(+t.toFixed(3)); prev = ph; }
  return { pen, steps };
};
window.capture = (t) => { renderAt(t); return out.toDataURL('image/jpeg', 0.95); };
renderAt(0.0); renderAt(8.0);
window.__ready = true;
