// yuv-edit motion-graphics templates. Every template is a pure function of time:
// draw(ctx, t, props, W, H) paints the frame at t seconds on a TRANSPARENT canvas.
// Brand values come from yuv-design-system (Phoenix Ink); do not invent new ones here.
(function () {
  const C = {
    ink: '#1C1A4B', ink2: '#4A4870', muted: '#6B6990', paper: '#FFFFFF', cloud: '#F7F6FB',
    line: '#ECEAF4', pink: '#FF2EA0', pinkDeep: '#C8106F', pinkWash: '#FFF0F7', pinkLine: '#F7DCEB',
    pinkSoft: '#FF8FCC', gold1: '#FFD66E', gold2: '#F4B030', night: '#0E0D2A', night2: '#14123A',
    night3: '#1C1A4B', onNight: '#FFFFFF', onNight2: '#CFCDEB', onNight3: '#A9A6CF',
    violet: '#8B6CFF', cyan: '#5DE4E9', orange: '#FF8F3A',
  };
  const GLOW = ['#FF2EA0', '#FF8F3A', '#FFC74E', '#8B6CFF', '#5DE4E9', '#FF2EA0'];
  const F = {
    he: (s) => `700 ${s}px Karantina`, heR: (s) => `400 ${s}px Karantina`,
    text: (s) => `500 ${s}px Assistant`, textB: (s) => `700 ${s}px Assistant`,
    en: (s) => `${s}px Anton`, mono: (s) => `600 ${s}px "JetBrains Mono"`,
    hand: (s) => `${s}px "Gveret Levin"`,
  };
  const isHe = (s) => /[֐-׿]/.test(s || '');

  // ---- closed-form motion -------------------------------------------------
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  // damped spring 0 -> 1. w = angular freq, z = damping ratio (<1 overshoots).
  function spring(t, w = 22, z = 0.45) {
    if (t <= 0) return 0;
    if (z >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
  }
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const easeInOut = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  // exit: everything leaves by changing shape (scale/clip), never a plain fade.
  function life(t, dur, inT = 0, outLen = 0.28) {
    const out = clamp((t - (dur - outLen)) / outLen);
    return { k: spring(t - inT), out: easeInOut(out) };
  }

  // ---- primitives ---------------------------------------------------------
  function rr(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function goldPaint(ctx, y0, y1) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, C.gold1); g.addColorStop(1, C.gold2); return g; }
  function card(ctx, x, y, w, h, r, { fill = C.paper, night = false, border = null } = {}) {
    ctx.save();
    ctx.shadowColor = night ? 'rgba(5,4,20,.55)' : 'rgba(255,46,160,.16)';
    ctx.shadowBlur = night ? 60 : 44; ctx.shadowOffsetY = night ? 26 : 18;
    rr(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
    if (border) { ctx.save(); rr(ctx, x + .5, y + .5, w - 1, h - 1, r); ctx.strokeStyle = border; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
  }
  function glowRing(ctx, x, y, w, h, r, angle, power = 1) {
    ctx.save();
    const g = ctx.createConicGradient(angle, x + w / 2, y + h / 2);
    GLOW.forEach((c, i) => g.addColorStop(i / (GLOW.length - 1), c));
    ctx.globalAlpha = 0.8 * power; ctx.filter = 'blur(22px)';
    rr(ctx, x - 6, y - 6, w + 12, h + 12, r + 6); ctx.strokeStyle = g; ctx.lineWidth = 14; ctx.stroke();
    ctx.filter = 'none'; ctx.globalAlpha = 1;
    rr(ctx, x - 3, y - 3, w + 6, h + 6, r + 3); ctx.lineWidth = 3; ctx.strokeStyle = g; ctx.stroke();
    ctx.restore();
  }
  function setDir(ctx, s) { ctx.direction = isHe(s) ? 'rtl' : 'ltr'; }
  function measure(ctx, font, s) { ctx.font = font; setDir(ctx, s); return ctx.measureText(s).width; }

  // Words that slam in (two per beat by default) with a visible overshoot.
  // The marker word sits on the gold block with ink text.
  function slamLine(ctx, words, { x, y, size, align = 'right', color = C.onNight, t, step = 0.16, marker = -1, font = null, night = true }) {
    const he = isHe(words.join(' '));
    const fnt = font || (he ? F.he(size) : F.en(size));
    ctx.font = fnt; ctx.direction = he ? 'rtl' : 'ltr'; ctx.textBaseline = 'alphabetic';
    const gap = size * 0.22;
    const ws = words.map((w) => ctx.measureText(w).width);
    const total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
    // reading-direction layout: Hebrew runs right->left
    let cursor = align === 'right' ? x : align === 'center' ? x + (he ? total / 2 : -total / 2) : x;
    if (align === 'left' && he) cursor = x + total;
    if (align === 'right' && !he) cursor = x - total;
    words.forEach((w, i) => {
      const ww = ws[i];
      const wx = he ? cursor - ww : cursor; // left edge of this word
      cursor = he ? cursor - ww - gap : cursor + ww + gap;
      const k = spring(t - i * step, 24, 0.42);
      if (k <= 0) return;
      const s = 1.55 - 0.55 * k; // from 1.55x down to 1 with overshoot
      ctx.save();
      ctx.translate(wx + ww / 2, y - size * 0.32); ctx.scale(s, s); ctx.translate(-(wx + ww / 2), -(y - size * 0.32));
      if (i === marker) {
        const mk = spring(t - i * step - 0.06, 20, 0.6);
        const pad = size * 0.12, top = y - size * 0.86, hgt = size * 1.04;
        ctx.save(); rr(ctx, he ? wx + ww + pad - (ww + 2 * pad) * mk : wx - pad, top, (ww + 2 * pad) * mk, hgt, size * 0.12);
        ctx.fillStyle = goldPaint(ctx, top, top + hgt); ctx.fill(); ctx.restore();
        ctx.fillStyle = C.ink;
      } else ctx.fillStyle = color;
      ctx.textAlign = 'left'; ctx.direction = 'ltr';
      // draw each word as a unit (direction ltr on a single RTL word still renders correctly in Chromium
      // because the word itself is shaped by the bidi algorithm)
      ctx.direction = he ? 'rtl' : 'ltr'; ctx.textAlign = he ? 'right' : 'left';
      ctx.fillText(w, he ? wx + ww : wx, y);
      ctx.restore();
    });
    return total;
  }

  // ---- templates ----------------------------------------------------------
  const T = {};

  // Big kinetic headline. props: {text, marker(word index), x, y (0..1), size, align, color:'night'|'paper', kicker}
  T.title = (ctx, t, p, W, H) => {
    const u = Math.min(W, H) / 1080;
    const { k, out } = life(t, p.dur);
    const words = String(p.text).split(/\s+/);
    const size = (p.size || 150) * u;
    ctx.save();
    // exit = shape change: the line is pulled up out of a mask, never faded
    if (out > 0) { const cy = (p.y ?? .5) * H; ctx.beginPath(); ctx.rect(0, 0, W, cy + size * 0.3); ctx.clip(); ctx.translate(0, -out * size * 1.6); }
    if (p.kicker) {
      const kk = easeOut((t - 0.05) / 0.4);
      ctx.save(); ctx.beginPath(); ctx.rect(0, (p.y ?? .5) * H - size * 1.25, W, size * .35); ctx.clip();
      ctx.font = F.mono(28 * u); ctx.fillStyle = C.pinkSoft; ctx.textAlign = (p.align || 'right') === 'right' ? 'right' : 'left';
      ctx.direction = 'ltr';
      ctx.fillText(String(p.kicker).toUpperCase().split('').join(' '), (p.x ?? .92) * W, (p.y ?? .5) * H - size * 1.0 + (1 - kk) * 40 * u);
      ctx.restore();
    }
    // fit: wrap into lines (max 4 words, max width), then shrink if a single word is still too wide
    const he = isHe(p.text), maxW = (p.maxW || 0.84) * W;
    let sz = size;
    const fnt = (z) => he ? F.he(z) : F.en(z);
    const layout = (z) => {
      ctx.font = fnt(z); const gap = z * 0.22, lines = [[]]; let w = 0;
      words.forEach((wd, i) => {
        const ww = ctx.measureText(wd).width;
        const cur = lines[lines.length - 1];
        if (cur.length && (cur.length >= 4 || w + gap + ww > maxW)) { lines.push([]); w = 0; }
        lines[lines.length - 1].push(i); w += (lines[lines.length - 1].length > 1 ? gap : 0) + ww;
      });
      return lines;
    };
    let lines = layout(sz);
    const widest = () => { ctx.font = fnt(sz); return Math.max(...words.map((wd) => ctx.measureText(wd).width)); };
    while ((widest() > maxW || lines.length > 3) && sz > size * 0.5) { sz *= 0.92; lines = layout(sz); }
    const lh = sz * 1.02, y0 = (p.y ?? .5) * H - (lines.length - 1) * lh / 2;
    lines.forEach((idx, li) => {
      const m = idx.indexOf(p.marker ?? -1);
      slamLine(ctx, idx.map((i) => words[i]), { x: (p.x ?? .92) * W, y: y0 + li * lh, size: sz, align: p.align || 'right',
        t: t - li * 0.12, marker: m, color: p.color === 'paper' ? C.ink : C.onNight });
    });
    ctx.restore();
  };

  // Lower third: white card, name in Karantina/Anton, role line, small pink chip.
  T.lower_third = (ctx, t, p, W, H) => {
    const u = Math.min(W, H) / 1080;
    const { out } = life(t, p.dur);
    const he = isHe(p.name);
    const k = spring(t, 18, 0.55);
    const nameF = he ? F.he(64 * u) : F.en(52 * u), roleF = F.textB(28 * u);
    const nw = measure(ctx, nameF, p.name), rw = measure(ctx, roleF, p.role || '');
    const w = Math.max(nw, rw) + 80 * u, h = (p.role ? 150 : 104) * u;
    const margin = 72 * u;
    const x = he ? W - margin - w : margin, y = H - margin - h - (p.lift ?? (H > W ? 0.16 : 0)) * H;
    const sw = w * (1 - out) * k;
    ctx.save();
    ctx.beginPath(); ctx.rect(he ? x + w - sw - 40 * u : x - 40 * u, y - 60 * u, sw + 80 * u, h + 140 * u); ctx.clip();
    card(ctx, x, y, w, h, 40 * u, { border: C.pinkLine });
    ctx.fillStyle = C.pink; rr(ctx, he ? x + w - 14 * u : x + 6 * u, y + 26 * u, 8 * u, h - 52 * u, 4 * u); ctx.fill();
    ctx.textAlign = he ? 'right' : 'left'; ctx.direction = he ? 'rtl' : 'ltr';
    const tx = he ? x + w - 40 * u : x + 40 * u;
    ctx.font = nameF; ctx.fillStyle = C.ink; ctx.fillText(p.name, tx, y + 76 * u);
    if (p.role) { ctx.font = roleF; ctx.fillStyle = C.ink2; ctx.fillText(p.role, tx, y + 120 * u); }
    ctx.restore();
  };

  // Callout chip with a dotted connector to a point. props: {text, to:[x,y], at:[x,y]} (0..1)
  T.callout = (ctx, t, p, W, H) => {
    const u = Math.min(W, H) / 1080;
    const { out } = life(t, p.dur);
    const [tx, ty] = [p.to[0] * W, p.to[1] * H], [cx, cy] = [p.at[0] * W, p.at[1] * H];
    const lk = easeOut(t / 0.35) * (1 - out);
    // connector: white under-stroke, ink dots on top
    const ex = cx + (tx - cx) * lk, ey = cy + (ty - cy) * lk;
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 10 * u; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.setLineDash([2 * u, 12 * u]); ctx.strokeStyle = C.ink; ctx.lineWidth = 6 * u; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.setLineDash([]);
    const dk = spring(t - 0.3, 26, 0.45) * (1 - out);
    ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(tx, ty, 16 * u * dk, 0, 7); ctx.fill();
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(tx, ty, 9 * u * dk, 0, 7); ctx.fill();
    ctx.restore();
    const he = isHe(p.text), f = F.textB(34 * u);
    const w = measure(ctx, f, p.text) + 56 * u, h = 72 * u;
    const k = spring(t - 0.1, 22, 0.45) * (1 - out);
    if (k <= 0) return;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
    card(ctx, -w / 2, -h / 2, w, h, h / 2, { fill: C.paper, border: C.pinkLine });
    ctx.fillStyle = C.ink; ctx.font = f; ctx.textAlign = 'center'; ctx.direction = he ? 'rtl' : 'ltr'; ctx.textBaseline = 'middle';
    ctx.fillText(p.text, 0, 2 * u); ctx.restore();
  };

  // Stat: big count-up number (gold on night or ink on paper) + label. props: {value, prefix, suffix, decimals, label, x, y, color}
  T.stat = (ctx, t, p, W, H) => {
    const u = Math.min(W, H) / 1080;
    const { out } = life(t, p.dur);
    const v = (p.value || 0) * easeOut(t / (p.count || 0.9));
    const num = (p.prefix || '') + v.toFixed(p.decimals || 0) + (p.suffix || '');
    const k = spring(t, 20, 0.45) * (1 - out);
    const x = (p.x ?? .5) * W, y = (p.y ?? .5) * H;
    if (k <= 0.01) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(0.6 + 0.4 * k, k);
    ctx.textAlign = 'center'; ctx.direction = 'ltr';
    ctx.font = F.en((p.size || 220) * u); ctx.fillStyle = p.color === 'paper' ? C.ink : C.gold1;
    ctx.fillText(num, 0, 0);
    if (p.label) {
      const he = isHe(p.label); ctx.direction = he ? 'rtl' : 'ltr';
      ctx.font = he ? F.he(64 * u) : F.mono(34 * u); ctx.fillStyle = p.color === 'paper' ? C.ink2 : C.onNight2;
      ctx.fillText(p.label, 0, 80 * u);
    }
    ctx.restore();
  };

  // Chapter card: a full-frame night spread with a giant folio numeral and the chapter name.
  // Enters by an iris/shape change, leaves the same way. props: {n, title, kicker}
  T.chapter = (ctx, t, p, W, H) => {
    const u = Math.min(W, H) / 1080;
    const inK = spring(t, 9, 1), outK = easeInOut((t - (p.dur - 0.35)) / 0.35);
    const R = Math.hypot(W, H) * (inK * (1 - outK));
    ctx.save(); ctx.beginPath(); ctx.arc(W * 0.85, H * 0.5, Math.max(0, R), 0, 7); ctx.clip();
    nightSky(ctx, W, H, t, 'right');
    ctx.textAlign = 'left'; ctx.direction = 'ltr'; ctx.font = F.en(560 * u);
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillText(String(p.n).padStart(2, '0'), 60 * u, H * 0.5 + 200 * u);
    slamLine(ctx, String(p.title).split(/\s+/), { x: W - 110 * u, y: H * 0.56, size: 170 * u, align: 'right', t: t - 0.15, marker: p.marker ?? -1 });
    if (p.kicker) { ctx.font = F.mono(30 * u); ctx.fillStyle = C.pinkSoft; ctx.textAlign = 'right'; ctx.direction = 'ltr'; ctx.fillText(String(p.kicker).toUpperCase(), W - 110 * u, H * 0.56 - 190 * u); }
    ctx.restore();
  };

  // CTA pill with the rotating glow ring (the ONLY place the glow lives). props: {text, sub, x, y}
  T.cta = (ctx, t, p, W, H) => {
    const u = Math.min(W, H) / 1080;
    const { out } = life(t, p.dur);
    const he = isHe(p.text), f = F.textB(44 * u);
    const tw = measure(ctx, f, p.text + (he ? '  ←' : '  →'));
    const w = tw + 110 * u, h = 112 * u;
    const x = (p.x ?? .5) * W - w / 2, y = (p.y ?? .78) * H - h / 2;
    const k = spring(t, 20, 0.5) * (1 - out);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
    glowRing(ctx, x, y, w, h, h / 2, (t / 6) * Math.PI * 2, 0.7 + 0.3 * Math.sin(t * 6));
    rr(ctx, x, y, w, h, h / 2); ctx.fillStyle = C.pink; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = f; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = he ? 'rtl' : 'ltr';
    ctx.fillText(p.text + (he ? '  ←' : '  →'), x + w / 2, y + h / 2 + 2 * u);
    if (p.sub) { ctx.font = F.text(30 * u); ctx.fillStyle = C.onNight2; ctx.fillText(p.sub, x + w / 2, y + h + 56 * u); }
    ctx.restore();
  };

  // Spec compare bars. props: {title, rows:[{label, a, b}], aName, bName, max, unit}
  T.compare = (ctx, t, p, W, H) => {
    const u = Math.min(W, H) / 1080;
    const { out } = life(t, p.dur);
    const k = spring(t, 14, 0.8) * (1 - out);
    const w = Math.min(W * 0.78, 1400 * u), rows = p.rows || [], rh = 120 * u, h = 190 * u + rows.length * rh;
    const x = (W - w) / 2, y = (H - h) / 2;
    ctx.save(); const sc = 0.9 + 0.1 * k; ctx.translate(W / 2, H / 2); ctx.scale(sc, sc * k); ctx.translate(-W / 2, -H / 2);
    if (k <= 0.01) { ctx.restore(); return; }
    card(ctx, x, y, w, h, 44 * u, { border: C.pinkLine });
    const he = isHe(p.title || rows.map((r) => r.label).join(''));
    ctx.direction = he ? 'rtl' : 'ltr'; ctx.textAlign = he ? 'right' : 'left';
    const sx = he ? x + w - 60 * u : x + 60 * u;
    ctx.font = he ? F.he(84 * u) : F.en(64 * u); ctx.fillStyle = C.ink; ctx.fillText(p.title || '', sx, y + 110 * u);
    const max = p.max || Math.max(...rows.flatMap((r) => [r.a, r.b]));
    const barW = w - 520 * u;
    rows.forEach((r, i) => {
      const ry = y + 190 * u + i * rh, bk = easeOut((t - 0.2 - i * 0.12) / 0.6);
      ctx.font = F.textB(32 * u); ctx.fillStyle = C.ink2; ctx.direction = he ? 'rtl' : 'ltr'; ctx.textAlign = he ? 'right' : 'left';
      ctx.fillText(r.label, sx, ry + 40 * u);
      [[r.a, C.pink], [r.b, C.night3]].forEach(([v, col], j) => {
        const bw = barW * (v / max) * bk, by = ry + 6 * u + j * 44 * u;
        const bx = he ? x + w - 300 * u - bw : x + 300 * u;
        rr(ctx, bx, by, Math.max(bw, 1), 34 * u, 17 * u); ctx.fillStyle = col; ctx.fill();
        ctx.font = F.mono(26 * u); ctx.fillStyle = C.ink; ctx.direction = 'ltr'; ctx.textAlign = he ? 'right' : 'left';
        ctx.fillText(`${(v * bk).toFixed(r.decimals || 0)}${p.unit || ''}`, he ? bx - 14 * u : bx + bw + 14 * u, by + 27 * u);
      });
    });
    ctx.restore();
  };

  // End card / signature: wordmark area bottom-right, handwritten signature, optional next-video slot.
  // props: {sig:'יובל אבידני', line, url}
  T.endcard = (ctx, t, p, W, H) => {
    const u = Math.min(W, H) / 1080;
    nightSky(ctx, W, H, t, 'right');
    const k = spring(t - 0.1, 14, 0.7);
    ctx.save(); ctx.globalAlpha = clamp(k * 1.4);
    if (p.line) slamLine(ctx, String(p.line).split(/\s+/), { x: W - 140 * u, y: H * 0.42, size: 150 * u, align: 'right', t: t - 0.1, marker: p.marker ?? -1 });
    // the signature writes on in the reading direction over 1.5s
    const sk = easeInOut((t - 0.5) / 1.5);
    ctx.save(); ctx.translate(W - 160 * u, H * 0.62); ctx.rotate(-3 * Math.PI / 180);
    ctx.font = F.hand(120 * u); ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.fillStyle = C.gold1;
    const sw = measure(ctx, F.hand(120 * u), p.sig || 'יובל אבידני');
    ctx.beginPath(); ctx.rect(-sw * sk, -140 * u, sw * sk + 10, 200 * u); ctx.clip();
    ctx.fillText(p.sig || 'יובל אבידני', 0, 0);
    ctx.restore();
    // underline draws in .65s after the signature
    const uk = easeOut((t - 2.0) / 0.65);
    ctx.strokeStyle = C.gold2; ctx.lineWidth = 6 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(W - 160 * u, H * 0.66); ctx.lineTo(W - 160 * u - 520 * u * uk, H * 0.66 + 18 * u * uk); ctx.stroke();
    // wordmark set in type (the PNG is composited by compose.py when available)
    ctx.direction = 'ltr'; ctx.textAlign = 'right'; ctx.font = F.en(54 * u); ctx.fillStyle = C.pink;
    ctx.fillText('YUV.AI', W - 80 * u, H - 92 * u);
    ctx.font = F.mono(20 * u); ctx.fillStyle = C.cyan; ctx.fillText("LET'S FLY HIGH", W - 80 * u, H - 60 * u);
    if (p.url) { ctx.font = F.mono(30 * u); ctx.fillStyle = C.onNight2; ctx.textAlign = 'left'; ctx.fillText(p.url, 80 * u, H - 72 * u); }
    ctx.restore();
  };

  // Caption still (karaoke): one chunk, the active word on the gold marker. Rendered as a still per active word;
  // compose.py springs it in. props: {words:[...], active, size, night}
  T.caption = (ctx, t, p, W, H) => {
    const u = p.unit || Math.min(W, H) / 1080; // stills are a strip: scale from the FRAME, not the strip
    const words = p.words, he = isHe(words.join(' '));
    const size = (p.size || 96) * u, font = he ? F.he(size) : F.en(size * 0.8);
    ctx.font = font; ctx.direction = he ? 'rtl' : 'ltr'; ctx.textBaseline = 'alphabetic';
    const gap = size * 0.24, ws = words.map((w) => ctx.measureText(w).width);
    const total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
    let cursor = he ? W / 2 + total / 2 : W / 2 - total / 2; const y = H / 2 + size * 0.34;
    words.forEach((w, i) => {
      const ww = ws[i], wx = he ? cursor - ww : cursor;
      cursor = he ? cursor - ww - gap : cursor + ww + gap;
      ctx.textAlign = he ? 'right' : 'left';
      if (i === p.active) {
        const pad = size * 0.12, top = y - size * 0.86, hgt = size * 1.04;
        rr(ctx, wx - pad, top, ww + 2 * pad, hgt, size * 0.12); ctx.fillStyle = goldPaint(ctx, top, top + hgt); ctx.fill();
        ctx.fillStyle = C.ink; ctx.fillText(w, he ? wx + ww : wx, y);
      } else {
        // white with a deep night stroke so it reads on any footage
        ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.14; ctx.strokeStyle = 'rgba(14,13,42,.85)';
        ctx.strokeText(w, he ? wx + ww : wx, y); ctx.fillStyle = '#FFFFFF'; ctx.fillText(w, he ? wx + ww : wx, y);
      }
    });
  };

  // ---- stages -------------------------------------------------------------
  function nightSky(ctx, W, H, t, side = 'right') {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0A0922'); g.addColorStop(1, '#15133C');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const sx = side === 'right' ? W * 0.8 : W * 0.2;
    [[sx, H * 0.45, 'rgba(255,46,160,.17)', 0.55], [sx, H * 0.05, 'rgba(139,108,255,.16)', 0.5], [W * 0.5, H * 1.05, 'rgba(255,143,58,.20)', 0.6]]
      .forEach(([x, y, c, r]) => { const rg = ctx.createRadialGradient(x, y, 0, x, y, Math.max(W, H) * r); rg.addColorStop(0, c); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); });
    let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 160; i++) { const x = rnd() * W, y = rnd() * H, ph = rnd() * 6.28; ctx.globalAlpha = 0.35 + 0.25 * Math.sin(t * 1.3 + ph); ctx.fillStyle = '#fff'; ctx.fillRect(x, y, 1.4, 1.4); }
    ctx.globalAlpha = 1;
  }
  T.night = (ctx, t, p, W, H) => nightSky(ctx, W, H, t, p.side || 'right');

  window.YUVGFX = { T, C, F, spring, easeOut, easeInOut, nightSky, rr, card, glowRing, slamLine };
})();
