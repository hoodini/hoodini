import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const inv = (a, b, x) => clamp((x - a) / (b - a));
export const smooth = (a, b, x) => { const t = inv(a, b, x); return t * t * (3 - 2 * t); };
export const smoother = (a, b, x) => { const t = inv(a, b, x); return t * t * t * (t * (t * 6 - 15) + 10); };
export const easeOutCubic = t => 1 - Math.pow(1 - clamp(t), 3);
export const easeInCubic = t => Math.pow(clamp(t), 3);
export const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const easeOutBack = (t, s = 1.70158) => { t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1; };
export const easeOutElastic = t => { t = clamp(t); if (t === 0 || t === 1) return t; return Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1; };
export const pulse = (a, b, c, d, x) => smooth(a, b, x) * (1 - smooth(c, d, x));

// deterministic RNG
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export const perlin = new ImprovedNoise();
export const noise1 = (x, s = 0) => perlin.noise(x, s * 13.17 + 0.5, 0.31);
export const noise2 = (x, y, s = 0) => perlin.noise(x, y, s * 7.3 + 0.77);
export function fbm2(x, y, oct = 4) { let a = 0, f = 1, w = .5; for (let i = 0; i < oct; i++) { a += w * perlin.noise(x * f, y * f, i * 3.1); f *= 2.03; w *= .5; } return a; }

export const col = h => new THREE.Color(h);
export const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

// keyframe track: [[t, value], ...] with easing between
export function track(keys, t, ease = easeInOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i], [t1, b] = keys[i + 1];
    if (t <= t1) {
      const k = ease((t - t0) / (t1 - t0));
      if (typeof a === 'number') return lerp(a, b, k);
      if (a.isVector3) return a.clone().lerp(b, k);
      if (a.isColor) return a.clone().lerp(b, k);
      return a.map((v, j) => lerp(v, b[j], k));
    }
  }
  return keys[keys.length - 1][1];
}

// Catmull-Rom camera path helper
export function pathAt(points, u) {
  const c = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  return c.getPoint(clamp(u));
}

export function canvasTex(w, h, draw, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d', opts.dynamic ? { willReadFrequently: true } : undefined);
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...opts.repeat); }
  t.needsUpdate = true;
  t.userData.canvas = c; t.userData.ctx = ctx;
  return t;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
