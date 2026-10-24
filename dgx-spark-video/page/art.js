/* Line-art illustrations + animation helpers. Generic product drawings (no logos). */
(function () {
  const A = {};
  // DGX Spark-style compact box: square footprint, perforated front, drawn in brand-neutral line art
  A.sparkBox = (w = 420, stroke = '#76B900', fill = '#0A0A0A') => {
    const dots = []; for (let r = 0; r < 7; r++) for (let c = 0; c < 18; c++) dots.push(`<circle cx="${62 + c * 17 + (r % 2) * 8}" cy="${178 + r * 13}" r="4.2" fill="none" stroke="${stroke}" stroke-width="1.6" opacity=".75"/>`);
    return `<svg class="art-spark" width="${w}" viewBox="0 0 420 300" style="overflow:visible">
      <polygon class="draw" points="40,150 120,70 400,70 320,150" fill="${fill}" stroke="${stroke}" stroke-width="4"/>
      <polygon class="draw" points="320,150 400,70 400,210 320,290" fill="${fill}" stroke="${stroke}" stroke-width="4"/>
      <rect class="draw" x="40" y="150" width="280" height="140" fill="${fill}" stroke="${stroke}" stroke-width="4"/>
      ${dots.join('')}
      <line x1="40" y1="165" x2="320" y2="165" stroke="${stroke}" stroke-width="2" opacity=".5"/>
    </svg>`;
  };
  // desktop GPU card, two fans
  A.gpuCard = (w = 560, stroke = '#FFFFFF', acc = '#76B900') => `<svg class="art-gpu" width="${w}" viewBox="0 0 560 240" style="overflow:visible">
      <rect class="draw" x="10" y="20" width="520" height="190" rx="10" fill="#0A0A0A" stroke="${stroke}" stroke-width="4"/>
      <rect x="530" y="40" width="20" height="150" fill="none" stroke="${stroke}" stroke-width="3"/>
      <g class="fan" style="transform-origin:150px 115px"><circle cx="150" cy="115" r="78" fill="none" stroke="${stroke}" stroke-width="3"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M150 115 Q ${150 + 50 * Math.cos((a + 25) * Math.PI / 180)} ${115 + 50 * Math.sin((a + 25) * Math.PI / 180)} ${150 + 72 * Math.cos(a * Math.PI / 180)} ${115 + 72 * Math.sin(a * Math.PI / 180)}" fill="none" stroke="${acc}" stroke-width="3"/>`).join('')}
        <circle cx="150" cy="115" r="16" fill="${acc}"/></g>
      <g class="fan" style="transform-origin:370px 115px"><circle cx="370" cy="115" r="78" fill="none" stroke="${stroke}" stroke-width="3"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M370 115 Q ${370 + 50 * Math.cos((a + 25) * Math.PI / 180)} ${115 + 50 * Math.sin((a + 25) * Math.PI / 180)} ${370 + 72 * Math.cos(a * Math.PI / 180)} ${115 + 72 * Math.sin(a * Math.PI / 180)}" fill="none" stroke="${acc}" stroke-width="3"/>`).join('')}
        <circle cx="370" cy="115" r="16" fill="${acc}"/></g>
      <rect x="60" y="210" width="300" height="16" fill="${acc}"/>
    </svg>`;
  A.circle = (w, h, color = '#76B900') => `<svg class="scrawl" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible;position:absolute">
      <path class="drawp" d="M ${w * .52} ${h * .04} C ${w * .95} ${h * .02}, ${w * 1.02} ${h * .9}, ${w * .5} ${h * .96} C ${w * .02} ${h}, ${-w * .03} ${h * .15}, ${w * .45} ${h * .06} L ${w * .6} ${h * .1}"
        fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/></svg>`;
  A.arrow = (w, h, color = '#76B900') => `<svg class="scrawl" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible;position:absolute">
      <path class="drawp" d="M 4 ${h * .1} C ${w * .3} ${h * .05}, ${w * .7} ${h * .3}, ${w - 10} ${h - 10} M ${w - 44} ${h - 8} L ${w - 8} ${h - 8} L ${w - 12} ${h - 44}"
        fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  A.cursor = `<svg viewBox="0 0 24 24" width="36" height="36"><path d="M3 2 L3 20 L8 15 L11.5 22 L14.5 20.6 L11 13.8 L18 13.8 Z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  window.ART = A;

  // ---------- animation helpers (all positioned on the master timeline at absolute times) ----------
  const tl = () => window.TL;
  const H = {};
  H.slam = (el, t, o = {}) => { if (!el) return; tl().fromTo(el, { scale: o.from ?? 1.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: o.d ?? .32, ease: 'expo.out', immediateRender: true }, t); if (o.cue !== false) cue(t, o.cue || 'pop', o.gain ?? .6); };
  H.pop = (el, t, o = {}) => { if (!el) return; tl().fromTo(el, { scale: 0, autoAlpha: 0, rotation: o.rot0 ?? 0 }, { scale: 1, autoAlpha: 1, rotation: o.rot ?? 0, duration: o.d ?? .38, ease: 'back.out(2.2)', immediateRender: true }, t); if (o.cue !== false) cue(t, o.cue || 'pop', o.gain ?? .55); };
  H.rise = (el, t, o = {}) => { if (!el) return; tl().fromTo(el, { yPercent: o.y ?? 110, autoAlpha: 1 }, { yPercent: 0, duration: o.d ?? .45, ease: 'expo.out', immediateRender: true }, t); };
  H.fade = (el, t, o = {}) => { if (!el) return; tl().fromTo(el, { autoAlpha: 0, y: o.y ?? 20 }, { autoAlpha: 1, y: 0, duration: o.d ?? .3, ease: 'power2.out', immediateRender: true }, t); };
  H.slideX = (el, t, o = {}) => { if (!el) return; tl().fromTo(el, { x: o.x ?? -200, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: o.d ?? .4, ease: 'expo.out', immediateRender: true }, t); };
  H.barX = (el, t, o = {}) => { if (!el) return; tl().fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: o.d ?? .7, ease: o.ease || 'power3.out', immediateRender: true }, t); };
  H.barY = (el, t, o = {}) => { if (!el) return; tl().fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: o.d ?? .7, ease: o.ease || 'power3.out', immediateRender: true }, t); };
  H.hide = (el, t) => { if (el) tl().set(el, { autoAlpha: 0 }, t); };
  H.show = (el, t) => { if (el) tl().set(el, { autoAlpha: 1 }, t); };
  H.draw = (root, t, d = .6) => {
    if (!root) return;
    const paths = root.matches && root.matches('path,line,polyline,polygon,rect,circle') ? [root] : [...root.querySelectorAll('.draw, .drawp')];
    paths.forEach(p => {
      let len = 1200; try { len = p.getTotalLength(); } catch (e) {}
      p.style.strokeDasharray = len; tl().fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: d, ease: 'power2.inOut', immediateRender: true }, t);
    });
  };
  H.strike = (el, t) => { if (!el) return; tl().fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: .25, ease: 'power3.out', immediateRender: true }, t); cue(t, 'whoosh', .35); };
  H.shake = (el, t, amt = 14) => { if (!el) return; tl().to(el, { keyframes: { x: [amt, -amt, amt * .6, -amt * .4, 0] }, duration: .3 }, t); };
  // animated cursor path: pts=[[x,y,t],...], click at times
  H.cursor = (root, pts, clicks = []) => {
    const c = document.createElement('div'); c.className = 'cur abs'; c.style.cssText = 'z-index:40;width:36px;height:36px;left:0;top:0'; c.innerHTML = ART.cursor; root.appendChild(c);
    tl().set(c, { x: pts[0][0], y: pts[0][1], autoAlpha: 1 }, pts[0][2]);
    for (let i = 1; i < pts.length; i++) tl().to(c, { x: pts[i][0], y: pts[i][1], duration: pts[i][2] - pts[i - 1][2], ease: 'power2.inOut' }, pts[i - 1][2]);
    clicks.forEach(t => { tl().to(c, { scale: .8, duration: .06, yoyo: true, repeat: 1 }, t); cue(t, 'tick', .5); });
  };
  window.H = H;
})();
