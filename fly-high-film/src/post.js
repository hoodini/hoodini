import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

export function makePost(renderer, W, H, samples = 4, rt8 = false) {
  const rt = new THREE.WebGLRenderTarget(W, H, { type: rt8 ? THREE.UnsignedByteType : THREE.HalfFloatType, samples });
  const composer = new EffectComposer(renderer, rt);
  composer.setSize(W, H);
  const renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
  composer.addPass(renderPass);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.6, 0.55, 0.85);
  composer.addPass(bloom);
  const grade = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uFlash: { value: 0 }, uFlashCol: { value: new THREE.Color(1, 1, 1) }, uVig: { value: 0.35 }, uSat: { value: 1 }, uTint: { value: new THREE.Color(1, 1, 1) }, uExpo: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uFlash, uVig, uSat, uExpo; uniform vec3 uFlashCol, uTint; varying vec2 vUv;
      void main(){ vec4 c = texture2D(tDiffuse, vUv); vec3 col = c.rgb*uExpo*uTint;
        float l = dot(col, vec3(0.2126,0.7152,0.0722)); col = mix(vec3(l), col, uSat);
        vec2 q = vUv-0.5; float v = 1.0 - dot(q,q)*uVig*2.2; col *= clamp(v, 0.0, 1.0);
        col = mix(col, uFlashCol*4.0, uFlash);
        gl_FragColor = vec4(col, 1.0); }`,
  });
  composer.addPass(grade);
  composer.addPass(new OutputPass());
  const fxaa = new ShaderPass(FXAAShader); fxaa.enabled = !location.search.includes('nofxaa'); fxaa.material.uniforms.resolution.value.set(1 / W, 1 / H); composer.addPass(fxaa);
  const final = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, tOver: { value: null }, uT: { value: 0 }, uGrain: { value: 0.045 }, uCA: { value: 0.0012 }, uFade: { value: 0 }, uRes: { value: new THREE.Vector2(W, H) } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform sampler2D tOver; uniform float uT, uGrain, uCA, uFade; uniform vec2 uRes; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uT*61.7)*43758.5453); }
      void main(){ vec2 d = (vUv-0.5); float r = dot(d,d);
        vec3 col; col.r = texture2D(tDiffuse, vUv + d*uCA*r*4.0).r; col.g = texture2D(tDiffuse, vUv).g; col.b = texture2D(tDiffuse, vUv - d*uCA*r*4.0).b;
        col += (h(vUv*uRes) - 0.5) * uGrain;
        col *= 1.0 - uFade;
        vec4 o = texture2D(tOver, vUv); col = mix(col, o.rgb, o.a);
        gl_FragColor = vec4(col, 1.0); }`,
  });
  composer.addPass(final);
  return { composer, renderPass, bloom, grade, final };
}
