// Real 3D extruded lettering from TTF outlines (opentype.js) — works for Hebrew (RTL) and Latin.
import * as THREE from 'three';
import * as opentype from 'opentype';

const fonts = {};
export async function loadFont(name, url) { const buf = await (await fetch(url)).arrayBuffer(); fonts[name] = opentype.parse(buf); return fonts[name]; }

function contoursFromPath(path, flatten = 6) {
  const contours = []; let cur = null, last = null;
  const pushPt = (x, y) => { cur.push(new THREE.Vector2(x, -y)); last = [x, y]; };
  for (const c of path.commands) {
    if (c.type === 'M') { if (cur && cur.length > 2) contours.push(cur); cur = []; pushPt(c.x, c.y); }
    else if (c.type === 'L') pushPt(c.x, c.y);
    else if (c.type === 'Q') { const [x0, y0] = last; for (let i = 1; i <= flatten; i++) { const t = i / flatten, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, d = t * t; pushPt(a * x0 + b * c.x1 + d * c.x, a * y0 + b * c.y1 + d * c.y); } }
    else if (c.type === 'C') { const [x0, y0] = last; for (let i = 1; i <= flatten; i++) { const t = i / flatten, mt = 1 - t; pushPt(mt * mt * mt * x0 + 3 * mt * mt * t * c.x1 + 3 * mt * t * t * c.x2 + t * t * t * c.x, mt * mt * mt * y0 + 3 * mt * mt * t * c.y1 + 3 * mt * t * t * c.y2 + t * t * t * c.y); } }
    else if (c.type === 'Z') { if (cur && cur.length > 2) contours.push(cur); cur = null; }
  }
  if (cur && cur.length > 2) contours.push(cur);
  return contours;
}
function inside(pt, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if (((a.y > pt.y) !== (b.y > pt.y)) && (pt.x < (b.x - a.x) * (pt.y - a.y) / (b.y - a.y) + a.x)) c = !c; } return c; }

export function textShapes(str, fontName, size) {
  const font = fonts[fontName];
  const rtl = /[֐-׿]/.test(str);
  const s = rtl ? [...str].reverse().join('').replace(/[()]/g, m => m === '(' ? ')' : '(') : str;
  // manual layout (no GSUB shaping needed for un-pointed Hebrew / Latin)
  const path = new opentype.Path(); let x = 0; const sc = size / font.unitsPerEm; let prev = null;
  for (const ch of s) { const g = font.charToGlyph(ch); if (prev) x += font.getKerningValue(prev, g) * sc; const gp = g.getPath(x, 0, size); path.extend(gp); x += g.advanceWidth * sc; prev = g; }
  const contours = contoursFromPath(path);
  const shapes = [];
  const depth = contours.map((c, i) => contours.reduce((d, o, j) => d + (j !== i && inside(c[0], o) ? 1 : 0), 0));
  contours.forEach((c, i) => {
    if (depth[i] % 2 === 0) {
      const pts = THREE.ShapeUtils.isClockWise(c) ? c.slice().reverse() : c;
      const sh = new THREE.Shape(pts);
      contours.forEach((h, j) => { if (depth[j] === depth[i] + 1 && inside(h[0], c)) { const hp = THREE.ShapeUtils.isClockWise(h) ? h : h.slice().reverse(); sh.holes.push(new THREE.Path(hp)); } });
      shapes.push(sh);
    }
  });
  return shapes;
}

export function text3D(str, fontName, size, opts = {}) {
  const shapes = textShapes(str, fontName, size);
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: opts.depth ?? size * 0.22, bevelEnabled: true, bevelThickness: opts.bevel ?? size * 0.04, bevelSize: opts.bevelSize ?? size * 0.025, bevelSegments: 4, curveSegments: 6 });
  geo.computeBoundingBox(); const bb = geo.boundingBox;
  geo.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -(bb.min.z + bb.max.z) / 2);
  geo.computeVertexNormals();
  const mat = opts.material || new THREE.MeshPhysicalMaterial({ color: '#ffc94d', metalness: 1, roughness: 0.22, clearcoat: 0.6 });
  const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true;
  mesh.userData.width = bb.max.x - bb.min.x; mesh.userData.height = bb.max.y - bb.min.y;
  return mesh;
}
