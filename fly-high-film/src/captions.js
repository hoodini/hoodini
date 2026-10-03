// Kinetic Hebrew captions + end card, drawn into a 2D overlay canvas each frame.
import * as THREE from 'three';
import { clamp, smooth, easeOutCubic, easeOutBack, roundRect } from './util.js';

const RUBIK = '"Rubik", sans-serif', HAND = '"Amatic SC", "Rubik", sans-serif', FRED = '"Fredoka", "Rubik", sans-serif';

// [start, end, text, style]
export const CAPTIONS = [
  [0.9, 3.7, 'הכל מתחיל בקו אחד...', 'hand'],
  [3.9, 6.5, 'סקיצה קטנה, במחברת.', 'hand'],
  [6.8, 9.2, 'ואז — היא מתעוררת לחיים.', 'hand'],
  [10.0, 12.6, 'יום יפה.', 'main'],
  [12.9, 16.3, 'שמש. דשא ירוק. ושקט בראש.', 'main'],
  [17.2, 19.6, 'ופתאום — זה מתחיל.', 'main'],
  [19.9, 21.3, 'עוד התראה.', 'punch'],
  [21.3, 22.6, 'עוד כלי חדש.', 'punch'],
  [22.6, 23.9, 'עוד מודל.', 'punch'],
  [23.9, 26.4, 'עוד משהו שחייבים לדעת — עכשיו!', 'main'],
  [26.6, 27.7, 'מבול של מידע.', 'punch'],
  [27.7, 28.7, 'הצפה.', 'punch'],
  [28.7, 30.1, 'FOMO.', 'punchEn'],
  [30.6, 33.3, 'והמשקל על הכתפיים... רק הולך וגדל.', 'main'],
  [33.5, 36.0, 'עד שכבר אי אפשר לקום.', 'main'],
  [36.8, 39.8, 'ואז, מבעד לעננים... מגיע מישהו.', 'main'],
  [40.2, 43.8, '״בואי. תעלי על הכנפיים שלי.״', 'quote'],
  [44.6, 47.2, 'והם ממריאים — מעל הסערה.', 'main'],
  [48.6, 51.2, 'ומשם — הכל נראה אחרת.', 'main'],
  [51.4, 54.0, 'העומס נושר. הבלגן נעלם.', 'main'],
  [54.2, 57.8, 'רואים את התמונה המלאה.\nיש סדר בדברים — ויש סדר בראש.', 'main'],
  [58.6, 62.6, 'לוקחים את הידע הטכני הכי מסובך —\nוהופכים אותו לברור.', 'main'],
];

export class Overlay {
  constructor(W, H) {
    this.W = W; this.H = H; this.portrait = H > W;
    this.canvas = document.createElement('canvas'); this.canvas.width = W; this.canvas.height = H;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.tex = new THREE.CanvasTexture(this.canvas); this.tex.colorSpace = THREE.NoColorSpace; this.tex.minFilter = THREE.LinearFilter; this.tex.generateMipmaps = false;
  }
  // unit: base font size relative to frame
  get u() { return this.portrait ? this.W / 1080 : this.H / 1080; }

  drawCaption(t, [t0, t1, str, style]) {
    const ctx = this.ctx, W = this.W, H = this.H, u = this.u;
    const k = smooth(t0, t0 + 0.35, t) * (1 - smooth(t1 - 0.3, t1, t));
    if (k <= 0) return;
    const lines = str.split('\n');
    let size, font, weight, y0, color = '#ffffff';
    if (style === 'hand') { size = 96 * u; font = HAND; weight = 700; y0 = this.portrait ? H * 0.84 : H * 0.85; color = '#1c348c'; }
    else if (style === 'punch' || style === 'punchEn') { size = (this.portrait ? 120 : 128) * u; font = style === 'punchEn' ? FRED : RUBIK; weight = 900; y0 = this.portrait ? H * 0.2 : H * 0.24; }
    else if (style === 'quote') { size = 62 * u; font = RUBIK; weight = 600; y0 = this.portrait ? H * 0.82 : H * 0.84; color = '#fff3d6'; }
    else { size = 56 * u; font = RUBIK; weight = 700; y0 = this.portrait ? H * 0.82 : H * 0.84; }
    const lh = size * 1.25;
    const totalH = lh * lines.length; let y = y0 - totalH / 2 + lh / 2;
    const dur = Math.max(0.6, (t1 - t0) * 0.5);
    lines.forEach((line, li) => {
      ctx.font = `${weight} ${size}px ${font}`;
      const words = line.split(' ');
      const rtl = /[֐-׿]/.test(line);
      const sp = ctx.measureText(' ').width;
      const widths = words.map(w => ctx.measureText(w).width);
      const total = widths.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
      const maxW = W * 0.9; const scale = Math.min(1, maxW / total);
      let x = rtl ? W / 2 + total * scale / 2 : W / 2 - total * scale / 2;
      const nWordsBefore = lines.slice(0, li).reduce((a, l) => a + l.split(' ').length, 0);
      words.forEach((w, wi) => {
        const idx = nWordsBefore + wi;
        const nAll = str.replace('\n', ' ').split(' ').length;
        const wt0 = t0 + (idx / nAll) * dur * (style.startsWith('punch') ? 0 : 1);
        const wk = easeOutCubic(clamp((t - wt0) / 0.45));
        const ww = widths[wi] * scale;
        const cx = rtl ? x - ww / 2 : x + ww / 2;
        ctx.save();
        ctx.globalAlpha = k * wk;
        ctx.translate(cx, y + (1 - wk) * size * 0.35);
        let sc = scale;
        if (style.startsWith('punch')) { const pk = easeOutBack(clamp((t - t0) / 0.32), 2.2); sc *= 0.6 + 0.4 * pk; ctx.rotate((1 - pk) * -0.05); }
        ctx.scale(sc, sc);
        ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = rtl ? 'rtl' : 'ltr';
        if (wk < 1) ctx.filter = `blur(${(1 - wk) * 10 * u}px)`;
        if (style !== 'hand') { ctx.shadowColor = 'rgba(0,10,30,0.55)'; ctx.shadowBlur = 24 * u; ctx.shadowOffsetY = 4 * u; }
        else { ctx.shadowColor = 'rgba(255,255,255,0.0)'; }
        if (style.startsWith('punch')) {
          const g = ctx.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffd9a0'); ctx.fillStyle = g;
        } else ctx.fillStyle = color;
        ctx.fillText(w, 0, 0);
        ctx.restore();
        x += rtl ? -(ww + sp * scale) : (ww + sp * scale);
      });
      y += lh;
    });
  }

  drawEndCard(t, t0) {
    const ctx = this.ctx, W = this.W, H = this.H, u = this.u;
    const k = (d, len = 0.8) => easeOutCubic(clamp((t - t0 - d) / len));
    const cy = this.portrait ? H * 0.68 : H * 0.7;
    // subtitle
    const a1 = k(0.5);
    ctx.save(); ctx.globalAlpha = a1; ctx.font = `600 ${44 * u}px ${RUBIK}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
    ctx.shadowColor = 'rgba(0,20,50,0.5)'; ctx.shadowBlur = 20 * u; ctx.fillStyle = '#ffffff';
    ctx.fillText('פתרונות AI פרקטיים — לכל אחת ואחד', W / 2, cy + (1 - a1) * 20 * u); ctx.restore();
    // name line
    const a2 = k(0.9);
    ctx.save(); ctx.globalAlpha = a2; ctx.font = `800 ${50 * u}px ${RUBIK}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
    ctx.shadowColor = 'rgba(0,20,50,0.5)'; ctx.shadowBlur = 18 * u; ctx.fillStyle = '#fff6e0';
    ctx.fillText('יובל אבידני  ·  YUV.AI', W / 2, cy + 82 * u + (1 - a2) * 20 * u); ctx.restore();
    // CTA pill
    const a3 = k(1.4, 0.6);
    if (a3 > 0) {
      const bw = 520 * u, bh = 104 * u, bx = W / 2 - bw / 2, by = cy + 150 * u;
      ctx.save(); ctx.globalAlpha = a3; ctx.translate(W / 2, by + bh / 2); const s = 0.85 + 0.15 * easeOutBack(a3); ctx.scale(s, s); ctx.translate(-W / 2, -(by + bh / 2));
      const g = ctx.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, '#ffcf5a'); g.addColorStop(1, '#ff9a3c');
      ctx.shadowColor = 'rgba(255,160,60,0.55)'; ctx.shadowBlur = 40 * u; ctx.fillStyle = g; roundRect(ctx, bx, by, bw, bh, bh / 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.font = `800 ${46 * u}px ${RUBIK}`; ctx.fillStyle = '#10223d'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
      ctx.fillText('yuv.ai  ←  בואו להמריא', W / 2, by + bh / 2 + 2 * u);
      // shine sweep
      const sx = bx + ((t - t0 - 1.6) % 2.4) / 2.4 * bw * 1.6 - bw * 0.3;
      ctx.globalCompositeOperation = 'source-atop'; const sg = ctx.createLinearGradient(sx - 60 * u, 0, sx + 60 * u, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.55)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sg; roundRect(ctx, bx, by, bw, bh, bh / 2); ctx.fill();
      ctx.restore();
    }
  }

  render(t, extra, list = CAPTIONS) {
    const ctx = this.ctx; ctx.clearRect(0, 0, this.W, this.H);
    for (const c of list) if (t > c[0] - 0.1 && t < c[1] + 0.1) this.drawCaption(t, c);
    if (extra) extra(ctx, this);
    this.tex.needsUpdate = true;
  }
}
