/* Real 3D perspective for 2D content (the "YouTuber 3D tilt"): a WebGL quad with perspective-correct texturing and a
   depth-of-field blur that grows with distance from the card's focus depth. The content is any 2D canvas (a browser
   card with a scrolling page, a crop of the screen recording); the result is drawn back onto the film's 2D canvas.
   Pure: same inputs -> same pixels. */
const W = 1920, H = 1080, F = 1500;   // focal length in px
const gl_cv = document.createElement('canvas'); gl_cv.width = W; gl_cv.height = H;
const gl = gl_cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true, preserveDrawingBuffer: true });
const VS = `attribute vec2 uv; uniform mat3 R; uniform vec3 T; uniform vec2 S; uniform vec4 sub; uniform float f; varying vec2 vuv; varying float vz;
void main(){ vec2 lp=(uv-0.5)*S; vec3 P=R*vec3(lp.x,-lp.y,0.0)+T; vuv=mix(sub.xy,sub.zw,uv); vz=P.z;
  gl_Position=vec4(f*P.x/960.0, f*P.y/540.0, 0.0, P.z); }`;
const FS = `precision mediump float; uniform sampler2D tex; uniform float zc, dof; uniform vec2 px; varying vec2 vuv; varying float vz;
void main(){ float b=clamp(abs(vz-zc)*dof,0.0,1.0)*3.5; vec4 c=vec4(0.0); float n=0.0;
  for(int i=-2;i<=2;i++) for(int j=-2;j<=2;j++){ vec2 o=vec2(float(i),float(j))*px*b; c+=texture2D(tex,vuv+o); n+=1.0; }
  gl_FragColor=c/n; }`;
function sh(t, s) { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
const N = 24, verts = [];   // a subdivided quad (perspective-correct anyway; the grid keeps the DOF varying smooth)
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const a = i / N, b = j / N, c = (i + 1) / N, d = (j + 1) / N; verts.push(a, b, c, b, c, d, a, b, c, d, a, d); }
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
const tex = gl.createTexture();
const U = n => gl.getUniformLocation(prog, n);
function rot(rx, ry, rz = 0) {   // R = Ry * Rx * Rz (column-major for GL)
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
  const Rx = [1, 0, 0, 0, cx, sx, 0, -sx, cx], Ry = [cy, 0, -sy, 0, 1, 0, sy, 0, cy], Rz = [cz, sz, 0, -sz, cz, 0, 0, 0, 1];
  const m = (A, B) => { const o = []; for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) { let s = 0; for (let k = 0; k < 3; k++) s += A[k * 3 + r] * B[c * 3 + k]; o[c * 3 + r] = s; } return o; };
  return m(Ry, m(Rx, Rz));
}
/** world position of a card-local point (lx right, ly down, lz toward the camera) for a card placed like drawPersp(q) */
export function worldOf(q, lx, ly, lz = 0) {
  const tz = F * (q.push ?? 1), tx = (q.cx - 960) * tz / F, ty = -(q.cy - 540) * tz / F, R = rot(q.rx, q.ry, q.rz || 0);
  return [R[0] * lx + R[3] * -ly + R[6] * -lz + tx, R[1] * lx + R[4] * -ly + R[7] * -lz + ty, R[2] * lx + R[5] * -ly + R[8] * -lz + tz];
}
export const toScreen = P => [960 + F * P[0] / P[2], 540 - F * P[1] / P[2]];
/** project a local card point (px, card centre = 0) to screen px */
export function project(q, lx, ly) {
  const R = rot(q.rx, q.ry, q.rz || 0), P = [R[0] * lx + R[3] * -ly + q.tx, R[1] * lx + R[4] * -ly + q.ty, R[2] * lx + R[5] * -ly + q.tz];
  return [960 + F * P[0] / P[2], 540 - F * P[1] / P[2]];
}
/** q: {cx, cy (screen px of the card centre at depth F), w, h (px), rx, ry, rz (rad), push (1 = at focus depth, >1 farther), dof}
 *  sub: [u0, v0, u1, v1] part of the source to map (default whole). Draws onto ctx; returns the 4 projected corners. */
export function drawPersp(ctx, src, q, sub = [0, 0, 1, 1]) {
  let tz = F * (q.push ?? 1), tx = (q.cx - 960) * tz / F, ty = -(q.cy - 540) * tz / F;
  if (q.T) [tx, ty, tz] = q.T;                     // explicit world position (a layer lifted off a card)
  const Q = { ...q, tx, ty, tz };
  gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(prog); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  const loc = gl.getAttribLocation(prog, 'uv'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniformMatrix3fv(U('R'), false, rot(q.rx, q.ry, q.rz || 0)); gl.uniform3f(U('T'), tx, ty, tz); gl.uniform2f(U('S'), q.w, q.h);
  gl.uniform4f(U('sub'), sub[0], sub[1], sub[2], sub[3]); gl.uniform1f(U('f'), F); gl.uniform1f(U('zc'), tz);
  gl.uniform1f(U('dof'), (q.dof ?? 1) / (q.w * 0.9)); gl.uniform2f(U('px'), 1 / src.width, 1 / src.height);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLES, 0, N * N * 6);
  ctx.save(); ctx.setTransform(ctx.getTransform()); ctx.drawImage(gl_cv, 0, 0); ctx.restore();
  const R = rot(q.rx, q.ry, q.rz || 0);
  return [[-q.w / 2, -q.h / 2], [q.w / 2, -q.h / 2], [q.w / 2, q.h / 2], [-q.w / 2, q.h / 2]].map(([a, b]) => toScreen([R[0] * a + R[3] * -b + tx, R[1] * a + R[4] * -b + ty, R[2] * a + R[5] * -b + tz]));
}
