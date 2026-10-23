import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Character } from './character.js';
import { Macaw } from './macaw.js';
const q = new URLSearchParams(location.search), W = +q.get('w'), H = +q.get('h');
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
r.setSize(W, H); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(r.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#9cc9e0');
scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = .5;
const sun = new THREE.DirectionalLight('#fff1dc', 3); sun.position.set(3, 5, 4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);
scene.add(new THREE.HemisphereLight('#bfe3ff', '#6a8a50', 1.0));
const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: '#7fb069' })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
const cams = [];
const ch = new Character(); scene.add(ch.root); ch.root.position.x = -1.6;
const ch2 = new Character(); scene.add(ch2.root); ch2.root.position.x = -0.4;
const m = new Macaw(); scene.add(m.root); m.root.position.set(1.4, 0.9, 0); m.root.scale.setScalar(1.3); m.root.rotation.y = -0.6;
const cam = new THREE.PerspectiveCamera(35, W / H, 0.1, 100); cam.position.set(0, 1.6, 5.5); cam.lookAt(0, 0.7, 0);
window.renderAt = (t) => {
  const mode = Math.floor(t);
  ch.update(t, { expr: { smile: 1, look: [0.3, 0.2] } });
  ch2.update(t, { expr: { smile: -1, worry: 1, lid: 0.3, cry: 1, blush: .6, blink: false }, hunch: .5, squash: .2, sproutDroop: 1 });
  if (mode === 1) { m.pose(t, { phase: 0, flap: 0, fold: 1, legs: 1 }); cam.position.set(1.4, 1.2, 3); cam.lookAt(1.4, 0.9, 0); }
  else if (mode === 2) { m.pose(t, { phase: Math.PI / 2, flap: 1 }); cam.position.set(1.4, 3.5, 2.5); cam.lookAt(1.4, 0.9, 0); }
  else if (mode === 3) { m.pose(t, { phase: 0, flap: 0.2 }); cam.position.set(1.4, 0.7, 3.2); cam.lookAt(1.4, 0.9, 0); }
  else if (mode === 4) { m.pose(t, { phase: 0, flap: 0.2 }); cam.position.set(-0.6, 1.0, 2.0); cam.lookAt(-1.0, 0.7, 0); }
  else m.pose(t, { phase: 0, flap: 0.3 });
  r.render(scene, cam);
};
window.__ready = true;
