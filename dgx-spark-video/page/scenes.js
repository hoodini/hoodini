/* Shot list. Every timing comes from W(lineKey, word) — no hardcoded seconds. */
(function () {
  const T = window.TIMINGS;
  const E = k => T.lines[k].end;
  const SRC = {
    spark: 'nvidia.com/en-us/products/workstations/dgx-spark · docs.nvidia.com/dgx/dgx-spark/hardware.html (accessed 2026-09-29)',
    g5090: 'nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090 · GeForce RTX 50 announcement, 2025-01-06',
    lmsys: 'LMSYS “NVIDIA DGX Spark In-Depth Review”, 2025-10-13 + its public data sheet',
    ollama: 'download sizes: ollama.com/library (llama3.1:8b, gpt-oss:20b, llama3.1:70b, gpt-oss:120b) · 200B: NVIDIA newsroom 2025-10-13',
  };
  const src = (s) => `<div class="src">${s}</div>`;
  const S = window.shot;
  const tl = () => window.TL;

  /* ================= § 01 HOOK ================= */
  S(0, { theme: 'pure', sec: '01 HOOK', page: 1, punch: .12 }, `
    <div class="center"><div class="disp s1a" style="font-size:330px">POV<span class="acc">:</span></div>
    <div class="mask" style="margin-top:10px"><span class="serif s1b" style="font-size:92px">you want to run a…</span></div></div>`,
    (q, t0) => { H.slam(q('.s1a'), t0 + .02, { cue: 'boom', gain: .5 }); H.rise(q('.s1b'), W('h1', 'you')); });

  S(W('h1', '120B'), { theme: 'black', sec: '01 HOOK', page: 1 }, `
    <div class="center"><div class="disp g s2a" style="font-size:420px">120B</div>
    <div class="mask"><span class="serif s2b" style="font-size:90px">model. at home. on your desk.</span></div></div>
    <div class="sticker s2c" style="left:1290px;top:190px;transform:rotate(8deg)">🏠 local AI era</div>`,
    (q, t0) => { H.slam(q('.s2a'), t0); H.rise(q('.s2b'), W('h1', 'at')); H.pop(q('.s2c'), W('h1', 'home'), { rot0: -30, rot: 8 }); });

  S(W('h2'), { theme: 'black', sec: '01 HOOK', page: 1 }, `
    <div class="abs s3art" style="left:140px;top:300px">${ART.gpuCard(640)}</div>
    <div class="abs" style="left:900px;top:220px"><div class="label dim">your GPU’s VRAM</div>
      <div class="disp s3n" style="font-size:300px;margin-top:10px">32<span style="font-size:150px"> GB</span></div>
      <div class="serif s3c dim" style="font-size:54px">(it felt huge in 2025)</div></div>`,
    (q, t0) => { H.draw(q('.s3art svg'), t0, .5); H.slideX(q('.s3art'), t0, { x: -120 }); H.slam(q('.s3n'), W('h2', '32 GB.'), { cue: 'pop' }); H.fade(q('.s3c'), W('h2', '32 GB.') + .3); });

  S(W('h2', '32 GB.') + .3, { theme: 'pure', sec: '01 HOOK', page: 1, punch: .04 }, `
    <div class="term s4t" style="left:180px;top:190px;width:1560px;height:560px"><span class="p">$</span> <span class="s4cmd"></span>
<span class="s4out" style="opacity:0">+-----------------------------------------------------------------+
| GPU  Name              | Memory-Usage          | GPU-Util         |
|   0  GeForce RTX 5090  | <span class="e s4mem">31.8 GiB / 32.0 GiB</span>  |   <span class="s4u">100%</span>          |
+-----------------------------------------------------------------+</span></div>
    <div class="abs s4bar" style="left:230px;top:640px;width:1460px;height:42px;border:3px solid #fff"><div class="s4fill" style="height:100%;background:var(--r);transform-origin:0 50%"></div></div>`,
    (q, t0) => {
      const end = typeText(q('.s4cmd'), 'nvidia-smi', t0, 60);
      tl().to(q('.s4out'), { opacity: 1, duration: .05 }, end + .05);
      H.barX(q('.s4fill'), end + .05, { d: .45, ease: 'power1.in' });
    });

  S(W('h3'), { theme: 'pure', sec: '01 HOOK', page: 1, punch: .14, cutCue: 'error', cutGain: .9 }, `
    <div class="term" style="left:140px;top:170px;width:1640px;height:360px;border-color:var(--r)"><span class="e">RuntimeError: CUDA out of memory.</span>
Tried to allocate 38.00 GiB. GPU 0 has a total capacity
of 31.84 GiB of which 0 bytes is free.  <span class="p">¯\\_(ツ)_/¯</span></div>
    <div class="sticker red s5a" style="left:420px;top:600px;font-size:64px;transform:rotate(-6deg)">CUDA out of memory 💀</div>
    <div class="abs serif s5b" style="left:1240px;top:760px;font-size:120px;color:#fff">classic.</div>`,
    (q, t0) => { flash(t0, .6); H.shake(q('.term'), t0 + .02, 22); H.pop(q('.s5a'), t0 + .15, { rot0: 25, rot: -6, cue: false }); H.slam(q('.s5b'), W('h3', 'Classic.'), { from: 2.6, cue: 'cut' }); });

  /* ================= § 02 WHAT IS IT ================= */
  S(W('w1'), { theme: 'green', sec: '02 WHAT IS IT', page: 2, punch: .1 }, `
    <div class="center"><div class="disp s6a" style="font-size:380px;color:#000">ENTER</div></div>`,
    (q, t0) => { H.slam(q('.s6a'), t0, { cue: false }); cue(W('w1', 'Spark.') - 2.0, 'riser', .7); });

  // DROP — product reveal
  S(W('w1', 'Spark.'), { theme: 'pure', sec: '02 WHAT IS IT', page: 2, punch: .16, cutCue: 'boom', cutGain: 1 }, `
    <div class="abs s7art" style="left:1020px;top:250px">${ART.sparkBox(700)}</div>
    <div class="abs" style="left:110px;top:240px"><div class="label acc s7l">NVIDIA · GB10 · 2025→</div>
      <div class="disp s7a" style="font-size:250px;margin-top:20px">DGX</div><div class="disp g s7b" style="font-size:250px">SPARK</div></div>`,
    (q, t0) => { flash(t0, .9); H.draw(q('.s7art svg'), t0, .55); H.slam(q('.s7art'), t0, { from: .4, cue: false }); H.slam(q('.s7a'), t0 + .05, { cue: false }); H.slam(q('.s7b'), t0 + .18, { cue: false }); H.fade(q('.s7l'), t0 + .3); });

  S(W('w1', 'tiny'), { theme: 'black', sec: '02 WHAT IS IT', page: 2 }, `
    <div class="abs s8art" style="left:170px;top:280px">${ART.sparkBox(520)}</div>
    <div class="abs" style="left:900px;top:250px"><div class="label dim">footprint</div>
      <div class="disp s8a" style="font-size:150px">150×150</div><div class="disp s8b" style="font-size:88px">×50.5 MM · 1.2 KG</div>
      <div class="serif s8c acc" style="font-size:64px;margin-top:20px">smaller than your router, probably.</div></div>
    ${src(SRC.spark)}`,
    (q, t0) => { H.pop(q('.s8art'), t0, { cue: false }); H.slam(q('.s8a'), t0 + .1); H.fade(q('.s8b'), t0 + .3); H.fade(q('.s8c'), t0 + .7); });

  S(W('w1', '128 GB'), { theme: 'white', sec: '02 WHAT IS IT', page: 2, punch: .12 }, `
    <div class="center" style="top:-40px"><div class="disp" style="font-size:470px;line-height:.85"><span class="s9n">0</span><span style="font-size:190px"> GB</span></div>
    <div class="mono s9l" style="font-size:34px;margin-top:10px">LPDDR5X · unified · coherent</div></div>
    <div class="sticker black s9s" style="left:1260px;top:170px;transform:rotate(7deg)">no cap, 128 GB</div>`,
    (q, t0) => { counter(q('.s9n'), t0, t0 + .7, 0, 128, v => Math.round(v), true); H.fade(q('.s9l'), t0 + .4); H.pop(q('.s9s'), t0 + .8, { rot0: -20, rot: 7 }); });

  S(W('w1', 'the'), { theme: 'black', sec: '02 WHAT IS IT', page: 2 }, `
    <div class="abs" style="left:160px;top:250px;width:1600px">
      <div class="label dim">memory the GPU can address</div>
      <div class="bar-row"><div class="nm">RTX 5090</div><div class="bar-track"><div class="bar s10a" style="width:${32 / 128 * 100}%"></div><div class="bar-val s10av" style="left:calc(${32 / 128 * 100}% + 24px)">32 GB</div></div></div>
      <div class="bar-row"><div class="nm g">DGX SPARK</div><div class="bar-track"><div class="bar win s10b" style="width:100%"></div><div class="bar-val s10bv" style="right:24px;color:#000">128 GB</div></div></div>
      <div class="mono dim" style="font-size:22px;margin-top:18px">5090: 32 GB GDDR7 VRAM · Spark: 128 GB LPDDR5X shared by CPU + GPU</div></div>
    <div class="abs s10c" style="left:1210px;top:400px">${ART.circle(520, 170)}</div>
    <div class="abs serif acc s10d" style="left:1340px;top:620px;font-size:60px">4× the room</div>
    ${src(SRC.spark + ' · ' + SRC.g5090)}`,
    (q, t0) => { H.barX(q('.s10a'), t0); H.fade(q('.s10av'), t0 + .3); H.barX(q('.s10b'), t0 + .15, { d: .9 }); H.fade(q('.s10bv'), t0 + .7); H.draw(q('.s10c'), t0 + .8, .5); H.fade(q('.s10d'), t0 + 1.0); });

  S(W('w2'), { theme: 'white', sec: '02 WHAT IS IT', page: 2, punch: .1 }, `
    <div class="center"><div class="mask"><span class="disp s11a" style="font-size:260px">UNIFIED</span></div>
      <div class="mask"><span class="disp s11b" style="font-size:260px;color:var(--g)">MEMORY</span></div>
      <div class="serif s11c" style="font-size:70px;margin-top:10px">one pool. CPU and GPU both eat from it.</div></div>`,
    (q, t0) => { H.rise(q('.s11a'), t0); H.rise(q('.s11b'), t0 + .12); H.fade(q('.s11c'), W('w2', 'CPU')); });

  S(W('w2', 'share'), { theme: 'black', sec: '02 WHAT IS IT', page: 2 }, `
    <div class="abs card cut s12p" style="left:560px;top:390px;width:800px;height:360px;background:#111;border:4px solid var(--g)">
      <div class="label acc">THE PANTRY</div><div class="disp" style="font-size:150px;margin-top:20px">128 GB</div><div class="mono dim" style="font-size:24px">one shared pool</div></div>
    <div class="abs pill s12c" style="left:560px;top:170px;font-size:44px;padding:18px 34px;background:#fff">CPU</div>
    <div class="abs pill s12g" style="left:1170px;top:170px;font-size:44px;padding:18px 34px">GPU</div>
    <svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080"><path class="drawp s12l1" d="M640 260 L760 380" stroke="#fff" stroke-width="6" fill="none"/><path class="drawp s12l2" d="M1250 260 L1130 380" stroke="#76B900" stroke-width="6" fill="none"/></svg>
    <div class="sticker green s12s" style="left:1400px;top:620px;transform:rotate(-5deg)">🥫 one giant pantry</div>`,
    (q, t0) => { H.pop(q('.s12p'), t0, { cue: false }); H.pop(q('.s12c'), t0 + .15); H.pop(q('.s12g'), t0 + .3); H.draw(q('.s12l1'), t0 + .35, .3); H.draw(q('.s12l2'), t0 + .45, .3); H.pop(q('.s12s'), W('w2', 'pantry.'), { rot0: 20, rot: -5 }); });

  S(W('w2', 'No'), { theme: 'black', sec: '02 WHAT IS IT', page: 2 }, `
    <div class="abs cut s13f" style="left:260px;top:250px;width:300px;height:470px;border:5px solid #fff;padding:30px 24px">
      <div class="label">MINI FRIDGE</div><div class="disp" style="font-size:110px;margin-top:40px">32<br>GB</div><div class="mono dim" style="font-size:20px">GPU VRAM</div></div>
    <div class="abs s13x" style="left:220px;top:470px;width:380px;height:14px;background:var(--r);transform:rotate(-28deg);transform-origin:0 50%"></div>
    <div class="abs" style="left:760px;top:270px;width:1000px">
      <div class="serif" style="font-size:80px">the old way:</div>
      <div class="mono" style="font-size:34px;line-height:1.5;margin-top:10px">model > VRAM → layers spill into system RAM<br>→ shuttle over PCIe → <span class="red">crawl</span> 🐌</div></div>
    <div class="sticker s13s" style="left:900px;top:640px;transform:rotate(4deg)">🧊 tiny GPU fridge = sad</div>`,
    (q, t0) => { H.pop(q('.s13f'), t0, { cue: false }); H.strike(q('.s13x'), W('w2', 'fridge.')); H.fade(q('.s13s'), W('w2', 'mini')); });

  S(W('w3'), { theme: 'white', sec: '02 WHAT IS IT', page: 2 }, `
    <div class="abs" style="left:120px;top:190px"><div class="label">INSIDE</div><div class="disp s14a" style="font-size:190px;margin-top:10px">GB10</div>
      <div class="serif s14b" style="font-size:72px">Grace Blackwell superchip</div></div>
    <div class="abs cut s14c" style="left:1000px;top:230px;width:780px;height:500px;background:#0A0A0A;padding:30px">
      <div class="abs cut" style="left:40px;top:60px;width:300px;height:380px;border:4px solid #fff;--cut:18px"><div class="label" style="color:#fff;padding:20px">GRACE CPU<br><span style="color:#8c8c8c">20 × Arm</span></div></div>
      <div class="abs cut" style="left:370px;top:60px;width:370px;height:380px;background:var(--g);--cut:18px"><div class="label" style="color:#000;padding:20px">BLACKWELL GPU<br>5th-gen Tensor Cores</div></div>
      <div class="abs mono" style="left:40px;top:450px;color:#8c8c8c;font-size:18px">NVLink-C2C · one package · one memory pool</div></div>
    ${src(SRC.spark)}`,
    (q, t0) => { H.slam(q('.s14a'), W('w3', 'GB10')); H.fade(q('.s14b'), W('w3', 'Grace')); H.slideX(q('.s14c'), t0 + .1, { x: 200 }); });

  S(W('w3', '20'), { theme: 'black', sec: '02 WHAT IS IT', page: 2 }, `
    <div class="abs" style="left:120px;top:210px"><div class="disp s15a" style="font-size:300px">20</div><div class="serif" style="font-size:70px">Arm cores</div>
      <div class="mono dim" style="font-size:24px;margin-top:10px">10 × Cortex-X925 + 10 × Cortex-A725</div></div>
    <div class="abs s15g" style="left:840px;top:250px;display:grid;grid-template-columns:repeat(5,160px);gap:22px">
      ${Array.from({ length: 20 }, (_, i) => `<div class="cut c" style="--cut:14px;height:100px;background:${i < 10 ? 'var(--g)' : '#2a2a2a'};display:flex;align-items:center;justify-content:center;font:700 22px var(--mono);color:${i < 10 ? '#000' : '#aaa'}">${i < 10 ? 'X925' : 'A725'}</div>`).join('')}</div>
    ${src(SRC.spark)}`,
    (q, t0) => { H.slam(q('.s15a'), t0); q.all('.s15g .c').forEach((c, i) => H.pop(c, t0 + .05 + i * .035, { cue: i % 4 ? false : 'tick', d: .25 })); });

  S(W('w3', 'up'), { theme: 'green', sec: '02 WHAT IS IT', page: 2, punch: .1 }, `
    <div class="center"><div class="mono s16l" style="font-size:36px;letter-spacing:.2em">UP TO</div>
      <div class="disp s16a" style="font-size:400px;color:#000">1 PFLOP</div>
      <div class="serif s16b" style="font-size:70px">of FP4 — <u>with sparsity</u>, the fine print says</div></div>
    ${src('docs.nvidia.com/dgx/dgx-spark/hardware.html: “up to 1 petaFLOP at FP4 precision with sparsity”')}`,
    (q, t0) => { H.fade(q('.s16l'), t0); H.slam(q('.s16a'), W('w3', 'petaflop')); H.fade(q('.s16b'), W('w3', 'sparse')); });

  /* ================= § 03 WHAT RUNS ================= */
  // capacity ladder: size bars on a 0–128 GB axis with the 32 GB VRAM line
  const PX = 1180 / 128, X0 = 470;
  const MODELS = [
    ['8B', 'Llama 3.1 8B · Q4', 4.9], ['20B', 'GPT-OSS 20B · MXFP4', 14], ['70B', 'Llama 3.1 70B · Q4', 43],
    ['120B', 'GPT-OSS 120B · MXFP4', 65], ['200B', 'NVIDIA’s max · FP4 (≈100 GB est.)', 100]];
  const ladder = (hi, cls) => `
    <div class="abs lad ${cls}" style="left:0;top:0;width:1920px;height:1080px">
      <div class="abs label dim" style="left:${X0}px;top:170px">MODEL DOWNLOAD SIZE (GB) · 0 → 128</div>
      <div class="abs" style="left:${X0 + 32 * PX}px;top:205px;width:0;height:590px;border-left:4px dashed var(--r)"></div>
      <div class="abs label red" style="left:${X0 + 32 * PX + 12}px;top:205px">5090 · 32 GB</div>
      <div class="abs" style="left:${X0 + 128 * PX}px;top:205px;width:0;height:590px;border-left:4px solid var(--g)"></div>
      <div class="abs label acc" style="left:${X0 + 128 * PX - 210}px;top:205px">SPARK · 128 GB</div>
      ${MODELS.map((m, i) => `<div class="abs row r${i}" style="left:120px;top:${250 + i * 108}px;width:1700px;height:90px;opacity:${hi.includes(i) ? 1 : .28}">
        <div class="abs disp" style="left:0;top:4px;font-size:78px">${m[0]}</div>
        <div class="abs mono dim" style="left:0;top:74px;font-size:15px;white-space:nowrap">${m[1]}</div>
        <div class="abs bar ${m[2] <= 32 ? 'win' : ''} b" style="left:${X0 - 120}px;top:14px;height:56px;width:${m[2] * PX}px;background:${m[2] <= 32 ? 'var(--g)' : '#8C8C8C'}"></div>
        <div class="abs mono" style="left:${X0 - 120 + m[2] * PX + 16}px;top:24px;font-size:30px;font-weight:700">${m[2]} GB</div>
      </div>`).join('')}
    </div>`;

  S(W('f1'), { theme: 'white', sec: '03 WHAT RUNS', page: 3 }, `
    <div class="center"><div class="disp s17a" style="font-size:300px">SO WHAT</div><div class="disp s17b" style="font-size:300px;color:var(--g);-webkit-text-stroke:4px #000">FITS?</div></div>`,
    (q, t0) => { H.slam(q('.s17a'), t0); H.slam(q('.s17b'), W('f1', 'fits?')); });

  S(W('f1', '8B,'), { theme: 'black', sec: '03 WHAT RUNS', page: 3, drift: .01 }, ladder([0, 1], 'L1') + `
    <div class="sticker green s18s" style="left:1230px;top:330px;transform:rotate(-4deg)">fits ✅ on both</div>${src(SRC.ollama)}`,
    (q, t0) => { H.barX(q('.r0 .b'), t0); H.barX(q('.r1 .b'), W('f1', '20B:')); H.pop(q('.s18s'), W('f1', 'easy'), { rot0: 20, rot: -4, cue: 'ding', gain: .6 }); });

  S(W('f2'), { theme: 'black', sec: '03 WHAT RUNS', page: 3, drift: .01 }, ladder([2], 'L2') + `
    <div class="sticker green s19a" style="left:1400px;top:420px;transform:rotate(-5deg)">Spark ✅</div>
    <div class="sticker red s19b" style="left:960px;top:560px;transform:rotate(4deg)">5090 ❌ 43 GB > 32 GB</div>${src(SRC.ollama)}`,
    (q, t0) => { H.barX(q('.r2 .b'), t0 + .05); H.pop(q('.s19a'), W('f2', 'yes.'), { cue: 'ding' }); H.pop(q('.s19b'), W('f2', 'Nope.'), { cue: 'error', gain: .7 }); });

  S(W('f3'), { theme: 'black', sec: '03 WHAT RUNS', page: 3, drift: .01 }, ladder([3], 'L3') + `
    <div class="sticker black s20a" style="left:1180px;top:470px;transform:rotate(-3deg)">Spark only 👑</div>${src(SRC.ollama)}`,
    (q, t0) => { H.barX(q('.r3 .b'), t0 + .05); H.pop(q('.s20a'), W('f3', 'only.'), { cue: 'ding' }); });

  S(W('f3', 'Up'), { theme: 'pure', sec: '03 WHAT RUNS', page: 3, punch: .1 }, `
    <div class="term" style="left:140px;top:170px;width:1000px;height:330px"><span class="p">$</span> <span class="s21c"></span>
<span class="s21o" style="opacity:0">pulling manifest… <span class="ok">65 GB ✓</span>
>>> <span class="dim">Send a message (/? for help)</span></span></div>
    <div class="abs" style="left:1200px;top:180px;text-align:right;width:620px"><div class="label dim">up to</div><div class="disp g s21a" style="font-size:300px">200B</div>
      <div class="serif s21b" style="font-size:56px">parameters, per box*</div></div>
    <div class="src">*NVIDIA newsroom, 2025-10-13: “inference on AI models up to 200 billion parameters” (FP4)</div>`,
    (q, t0) => { const e = typeText(q('.s21c'), 'ollama run gpt-oss:120b', t0 + .02, 34); tl().to(q('.s21o'), { opacity: 1, duration: .05 }, e + .1); H.slam(q('.s21a'), W('f3', '200B')); H.fade(q('.s21b'), W('f3', 'quantize.')); });

  S(W('q1'), { theme: 'green', sec: '03 WHAT RUNS', page: 3 }, `
    <div class="abs" style="left:120px;top:200px;width:1680px">
      <div class="disp" style="font-size:150px;color:#000">QUANTIZE = ZIP IT</div>
      <div style="display:flex;align-items:center;gap:40px;margin-top:50px">
        <div class="cut card s22a" style="width:520px;background:#000;color:#fff"><div class="label" style="color:var(--g)">16-BIT WEIGHTS</div><div class="disp" style="font-size:90px">BIG.</div></div>
        <div class="disp s22ar" style="font-size:120px;color:#000">→</div>
        <div class="cut card s22b" style="width:300px;background:#000;color:#fff;--cut:18px"><div class="label" style="color:var(--g)">4-BIT</div><div class="disp" style="font-size:90px">~¼</div></div>
      </div>
      <div class="mono" style="font-size:26px;margin-top:30px;color:#000">16 → ~4 bits per weight ≈ 4× smaller · lose a little quality</div></div>
    <div class="sticker s22s" style="left:1250px;top:560px;transform:rotate(6deg)">slightly dumber 🤏</div>`,
    (q, t0) => { H.fade(q('.s22a'), t0); tl().fromTo(q('.s22b'), { scale: 1.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .4, ease: 'expo.out', immediateRender: true }, W('q1', 'zipping')); cue(W('q1', 'zipping'), 'whoosh', .5); H.fade(q('.s22ar'), W('q1', 'zipping') - .1); H.pop(q('.s22s'), W('q1', 'slightly'), { rot0: -20, rot: 6 }); });

  /* ================= § 04 THE BOTTLENECK ================= */
  S(W('p1'), { theme: 'pure', sec: '04 BOTTLENECK', page: 4, punch: .15, cutCue: 'boom', cutGain: .7 }, `
    <div class="center"><div class="serif s23a" style="font-size:90px">now the</div><div class="disp g s23b" style="font-size:360px">PLOT TWIST</div></div>`,
    (q, t0) => { flash(t0, .5); H.fade(q('.s23a'), t0); H.slam(q('.s23b'), W('p1', 'plot'), { cue: false }); });

  S(W('p1', 'Memory'), { theme: 'white', sec: '04 BOTTLENECK', page: 4 }, `
    <div class="abs" style="left:130px;top:230px">
      <div class="mask"><span class="disp s24a" style="font-size:200px">CAPACITY</span></div>
      <div class="serif s24b" style="font-size:90px">→ decides <u>what</u> runs</div></div>
    <div class="abs" style="left:1000px;top:520px">
      <div class="mask"><span class="disp s24c" style="font-size:200px;color:var(--g);-webkit-text-stroke:3px #000">BANDWIDTH</span></div>
      <div class="serif s24d" style="font-size:90px">→ decides <u>how fast</u></div></div>`,
    (q, t0) => { H.rise(q('.s24a'), t0); H.fade(q('.s24b'), W('p1', 'decides')); H.rise(q('.s24c'), W('p1', 'Bandwidth')); H.fade(q('.s24d'), W('p1', 'decides', 1)); });

  // pipes drawn to scale: 1,792 GB/s → 560 px tall ; 273 GB/s → 85 px
  const PIPE = g => g / 1792 * 560;
  const packets = (cls, n, color) => Array.from({ length: n }, (_, i) => `<div class="abs pk ${cls}" style="width:26px;height:18px;background:${color};left:0;top:0"></div>`).join('');
  function flowPackets(q, sel, x0, x1, yC, h, speed, t0) {
    const els = q.all(sel);
    els.forEach((el, i) => {
      const lane = (i * 7919 % 97) / 97, off = (i * 2654435761 % 1000) / 1000;
      proc(t => {
        const span = x1 - x0; const x = x0 + (((t - t0) * speed + off * span) % span + span) % span;
        el.style.transform = `translate(${x}px, ${yC - h / 2 + 6 + lane * Math.max(1, h - 30)}px)`;
      });
    });
  }

  S(W('p2'), { theme: 'black', sec: '04 BOTTLENECK', page: 4, drift: .012 }, `
    <div class="abs s25w" style="left:120px;top:210px;width:900px;height:560px;border:6px solid var(--g);background:repeating-linear-gradient(90deg,#111 0 60px,#161616 60px 64px)">
      <div class="label acc" style="padding:24px">WAREHOUSE · 128 GB</div>
      <div class="abs" style="left:40px;top:120px;display:grid;grid-template-columns:repeat(8,80px);gap:14px">${Array.from({ length: 24 }, () => '<div style="height:80px;border:3px solid #444"></div>').join('')}</div></div>
    <div class="abs" style="left:1014px;top:${490 - PIPE(273) / 2}px;width:14px;height:${PIPE(273)}px;background:#0A0A0A"></div>
    <div class="abs s25p" style="left:1020px;top:${490 - PIPE(273) / 2}px;width:800px;height:${PIPE(273)}px;border-top:4px solid #fff;border-bottom:4px solid #fff;overflow:hidden">${packets('pa', 5, 'var(--g)')}</div>
    <div class="abs serif s25a" style="left:1060px;top:260px;font-size:70px">a narrow door</div>
    <div class="abs s25c" style="left:980px;top:390px">${ART.arrow(120, 90)}</div>`,
    (q, t0) => { H.fade(q('.s25w'), t0, { y: 40 }); H.barX(q('.s25p'), t0 + .2, { d: .5 }); flowPackets(q, '.pa', -30, 800, PIPE(273) / 2, PIPE(273), 170, t0); H.fade(q('.s25a'), W('p2', 'narrow')); H.draw(q('.s25c'), W('p2', 'door:')); });

  S(W('p2', '273'), { theme: 'white', sec: '04 BOTTLENECK', page: 4, punch: .1 }, `
    <div class="center"><div class="disp s26a" style="font-size:430px;line-height:.85"><span class="s26n">0</span></div>
      <div class="mono s26b" style="font-size:44px;font-weight:700">GB/s · DGX SPARK memory bandwidth</div></div>${src(SRC.spark)}`,
    (q, t0) => { counter(q('.s26n'), t0, t0 + .6, 0, 273, v => Math.round(v), true); H.fade(q('.s26b'), t0 + .2); });

  S(W('p3'), { theme: 'black', sec: '04 BOTTLENECK', page: 4, drift: .012 }, `
    <div class="abs s27g" style="left:140px;top:350px;width:380px;height:300px;border:6px solid #fff">
      <div class="abs" style="left:-6px;top:-110px;width:380px;height:0;border-left:196px solid transparent;border-right:196px solid transparent;border-bottom:110px solid #fff"></div>
      <div class="label" style="padding:20px">GARAGE<br>32 GB</div></div>
    <div class="abs s27h" style="left:520px;top:${500 - PIPE(1792) / 2}px;width:1320px;height:${PIPE(1792)}px;border-top:6px solid var(--g);border-bottom:6px solid var(--g);overflow:hidden;background:repeating-linear-gradient(90deg,transparent 0 80px,rgba(255,255,255,.12) 80px 120px) 0 50%/100% 6px no-repeat">
      ${packets('pb', 60, '#fff')}</div>
    <div class="abs serif s27a" style="left:1080px;top:140px;font-size:72px">…on a highway 🛣️</div>`,
    (q, t0) => { H.pop(q('.s27g'), t0, { cue: false }); H.barX(q('.s27h'), W('p3', 'highway:') - .25, { d: .45 }); flowPackets(q, '.pb', -30, 1320, PIPE(1792) / 2, PIPE(1792), 1100, t0); H.fade(q('.s27a'), W('p3', 'highway:')); cue(W('p3', 'highway:') - .2, 'whoosh', .6); });

  S(W('p3', '1,792.'), { theme: 'black', sec: '04 BOTTLENECK', page: 4, drift: .006 }, `
    <div class="abs label dim" style="left:120px;top:160px">MEMORY BANDWIDTH · pipes drawn to scale</div>
    <div class="abs" style="left:120px;top:210px;width:1680px">
      <div class="mono" style="font-size:28px;font-weight:700">RTX 5090 · <span class="s28a">0</span> GB/s</div>
      <div class="abs s28p1" style="left:0;top:50px;width:1680px;height:${PIPE(1792) * .72}px;border:4px solid var(--g);overflow:hidden">${packets('pc', 46, 'var(--g)')}</div>
      <div class="abs mono" style="left:0;top:${70 + PIPE(1792) * .72}px;font-size:28px;font-weight:700">DGX SPARK · 273 GB/s</div>
      <div class="abs s28p2" style="left:0;top:${118 + PIPE(1792) * .72}px;width:1680px;height:${PIPE(273) * .72}px;border:4px solid #8C8C8C;overflow:hidden">${packets('pd', 4, '#8C8C8C')}</div></div>
    <div class="abs s28s" style="left:1300px;top:700px"><div class="disp g" style="font-size:190px">6.56×</div></div>
    <div class="abs serif s28t" style="left:1000px;top:770px;font-size:54px">six and a half-ish</div>
    ${src('1,792 GB/s: ' + SRC.g5090 + ' · 273 GB/s: ' + SRC.spark)}`,
    (q, t0) => {
      counter(q('.s28a'), t0, t0 + .5, 0, 1792);
      H.barX(q('.s28p1'), t0, { d: .4 }); H.barX(q('.s28p2'), t0 + .15, { d: .4 });
      flowPackets(q, '.pc', -30, 1680, PIPE(1792) * .36, PIPE(1792) * .72, 1100, t0); flowPackets(q, '.pd', -30, 1680, PIPE(273) * .36, PIPE(273) * .72, 170, t0);
      H.slam(q('.s28s'), W('p3', 'Six')); H.fade(q('.s28t'), W('p3', 'wider.'));
    });

  /* ================= § 05 HEAD-TO-HEAD ================= */
  const board = (s, g, cls = '') => `<div class="score ${cls}"><div>SPARK <span class="n">${s}</span></div><div>5090 <span class="n">${g}</span></div></div>`;

  S(W('r1'), { theme: 'white', sec: '05 HEAD-TO-HEAD', page: 5, punch: .14, cutCue: 'boom', cutGain: .6 }, `
    <div class="center"><div class="label s29l">ROUND 01 · DECODE SPEED</div><div class="disp s29a" style="font-size:330px">ROUND 1</div>
      <div class="serif s29b" style="font-size:72px">same model: GPT-OSS 20B</div>
      <div class="mono s29c dim" style="font-size:24px;margin-top:10px">MXFP4 · Ollama · batch 1 · fits in both</div></div>`,
    (q, t0) => { H.slam(q('.s29a'), t0, { cue: false }); H.fade(q('.s29l'), t0 + .2); H.fade(q('.s29b'), W('r1', 'same')); H.fade(q('.s29c'), W('r1', 'model.')); });

  const ANSWER = 'Unified memory means the CPU and GPU read from one shared pool, so a 120B model does not need to fit in a separate VRAM island. The trade-off is bandwidth: LPDDR5X moves bytes slower than GDDR7, so each generated token waits on memory. Bigger pool, slower pipe. Pick the bottleneck you can live with.';
  S(W('r1', 'The'), { theme: 'pure', sec: '05 HEAD-TO-HEAD', page: 5, punch: .03, drift: .006 }, `
    <div class="abs label dim" style="left:120px;top:150px">SAME PROMPT · STREAMED AT EACH DEVICE’S MEASURED DECODE SPEED</div>
    ${[['RTX 5090', 205.48, 120, 'g'], ['DGX SPARK', 60.91, 990, '']].map(([nm, v, x, c], i) => `
      <div class="abs cut" style="left:${x}px;top:200px;width:810px;height:560px;background:#0d0d0d;border:3px solid ${i ? '#555' : 'var(--g)'};padding:26px 30px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="disp ${c}" style="font-size:64px">${nm}</span>
          <span class="mono" style="font-size:26px"><b class="${c}" style="font-size:40px">${v}</b> tok/s</span></div>
        <div class="mono dim" style="font-size:20px;margin:8px 0 14px">&gt; explain unified memory like I’m five</div>
        <div class="mono st${i}" style="font-size:25px;line-height:1.42;white-space:normal;color:#e8e8e8;height:340px;overflow:hidden"></div>
        <div class="mono" style="font-size:22px;margin-top:6px;color:#8c8c8c">tokens: <b class="cn${i}" style="color:#fff">0</b> <span class="dn${i}" style="opacity:0;color:var(--g);font-weight:700">· DONE ✓</span></div></div>`).join('')}
    ${src(SRC.lmsys + ' · GPT-OSS 20B · MXFP4 · Ollama · batch 1 · decode tok/s (sheet values)')}`,
    (q, t0) => {
      const tStart = W('r1', '5090') + .15, toks = ANSWER.length / 4;
      stream(q('.st0'), ANSWER, tStart, 205.48, q('.cn0')); stream(q('.st1'), ANSWER, tStart, 60.91, q('.cn1'));
      tl().to(q('.dn0'), { opacity: 1, duration: .05 }, tStart + toks / 205.48); cue(tStart + toks / 205.48, 'ding', .5);
      tl().to(q('.dn1'), { opacity: 1, duration: .05 }, tStart + toks / 60.91);
      for (let x = tStart; x < tStart + toks / 205.48; x += .05) cue(x, 'type', .15);
    });

  S(W('r1', 'Spark?'), { theme: 'black', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    ${board(0, 1, 'sb1')}
    <div class="abs" style="left:120px;top:260px;width:1680px">
      <div class="label dim">DECODE · tokens / second · higher is better</div>
      <div class="bar-row"><div class="nm">RTX 5090</div><div class="bar-track"><div class="bar win b1" style="width:${205.48 / 220 * 100}%"></div><div class="bar-val" style="left:24px;color:#000">205.5</div></div></div>
      <div class="bar-row"><div class="nm">DGX SPARK</div><div class="bar-track"><div class="bar b2" style="width:${60.91 / 220 * 100}%"></div><div class="bar-val" style="left:calc(${60.91 / 220 * 100}% + 20px)">60.9</div></div></div></div>
    <div class="sticker green s31s" style="left:1300px;top:680px;transform:rotate(-4deg)">3.4× faster ⚡</div>
    ${src(SRC.lmsys + ' · GPT-OSS 20B · MXFP4 · Ollama · batch 1 (blog text quotes 49.7 for Spark)')}`,
    (q, t0) => { H.barX(q('.b1'), t0); H.barX(q('.b2'), t0 + .1); H.pop(q('.s31s'), W('r1', '61.') + .2, { rot0: 15, rot: -4 }); H.pop(q('.sb1'), t0 + .3, { cue: false }); });

  S(W('r2'), { theme: 'white', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    <div class="abs" style="left:120px;top:190px;width:840px">
      <div class="label">DENSE 32B · Qwen3 32B · Q4_K_M · Ollama</div>
      <div class="disp s32a" style="font-size:230px;margin-top:14px">6.2×</div>
      <div class="mono" style="font-size:26px">58.9 vs 9.5 tok/s decode</div></div>
    <div class="abs" style="left:1060px;top:190px;width:760px">
      <div class="label">MEMORY BANDWIDTH RATIO</div>
      <div class="disp s32b" style="font-size:230px;margin-top:14px;color:var(--g);-webkit-text-stroke:3px #000">6.6×</div>
      <div class="mono" style="font-size:26px">1,792 ÷ 273 GB/s</div></div>
    <div class="abs s32c" style="left:900px;top:330px;font:400 150px/1 var(--display)">≈</div>
    <div class="abs s32o" style="left:1010px;top:170px">${ART.circle(760, 300, '#000')}</div>
    <div class="sticker black s32s" style="left:620px;top:690px;transform:rotate(-3deg)">the bottleneck 👆 = bandwidth</div>
    ${src(SRC.lmsys + ' · decode, batch 1')}`,
    (q, t0) => { H.slam(q('.s32a'), t0 + .25); H.slam(q('.s32b'), W('r2', 'That\'s'), { cue: false }); H.fade(q('.s32c'), W('r2', 'That\'s')); H.draw(q('.s32o'), W('r2', 'bandwidth'), .45); H.pop(q('.s32s'), W('r2', 'gap.')); });

  S(W('r3'), { theme: 'black', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    ${board(0, 2, 'sb2')}
    <div class="abs" style="left:120px;top:250px;width:1680px">
      <div class="label dim">PREFILL (reading your prompt) · tokens / second</div>
      <div class="bar-row"><div class="nm">RTX 5090</div><div class="bar-track"><div class="bar win b1" style="width:90%"></div><div class="bar-val" style="left:24px;color:#000">8,519</div></div></div>
      <div class="bar-row"><div class="nm">DGX SPARK</div><div class="bar-track"><div class="bar b2" style="width:${2053.98 / 8518.57 * 90}%"></div><div class="bar-val" style="left:calc(${2053.98 / 8518.57 * 90}% + 20px)">2,054</div></div></div></div>
    <div class="sticker green s33s" style="left:1300px;top:660px;transform:rotate(3deg)">4.1× 📖💨</div>
    ${src(SRC.lmsys + ' · GPT-OSS 20B · MXFP4 · Ollama · batch 1 · prefill tok/s')}`,
    (q, t0) => { H.barX(q('.b1'), W('r3', '5090')); H.barX(q('.b2'), W('r3', '5090') + .1); H.pop(q('.s33s'), W('r3', 'four'), { rot0: -20, rot: 3 }); });

  S(W('r4'), { theme: 'white', sec: '05 HEAD-TO-HEAD', page: 5, punch: .12, cutCue: 'whoosh' }, `
    <div class="center"><div class="label">ROUND 03 · LLAMA 3.1 70B · Q4_K_M · 43 GB</div><div class="disp s34a" style="font-size:400px">70B</div></div>`,
    (q, t0) => { H.slam(q('.s34a'), t0); });

  S(W('r4', 'Spark'), { theme: 'black', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    ${board(1, 2, 'sb3')}
    <div class="abs cut card" style="left:120px;top:230px;width:800px;height:520px;border:4px solid var(--g);background:#0d0d0d">
      <div class="label acc">DGX SPARK · runs it ✅</div><div class="disp" style="font-size:250px;margin-top:10px"><span class="s35n">0</span></div>
      <div class="mono" style="font-size:30px">tok/s decode · Ollama · batch 1</div>
      <div class="serif dim" style="font-size:44px;margin-top:10px">≈ slow reading speed. but it runs.</div></div>
    <div class="abs cut card s35b" style="left:1000px;top:230px;width:800px;height:520px;border:4px solid var(--r);background:#0d0d0d">
      <div class="label red">RTX 5090 · 32 GB VRAM</div><div class="disp red" style="font-size:150px;margin-top:10px">DOESN’T<br>FIT</div>
      <div class="mono" style="font-size:24px;margin-top:10px">43 GB model &gt; 32 GB VRAM → CPU offload<br><span class="dim">(no reliable public tok/s for this setup)</span></div></div>
    ${src(SRC.lmsys + ' · Llama 3.1 70B · Q4_K_M · Ollama · batch 1 · 4.58 tok/s')}`,
    (q, t0) => { counter(q('.s35n'), t0, t0 + .6, 0, 4.58, v => v.toFixed(2)); H.pop(q('.sb3'), t0 + .2, { cue: false }); H.slideX(q('.s35b'), W('r4', 'The'), { x: 300 }); cue(W('r4', 'fit'), 'error', .7); });

  S(W('r4', 'can\'t'), { theme: 'pure', sec: '05 HEAD-TO-HEAD', page: 5, punch: .1 }, `
    <div class="term" style="left:200px;top:200px;width:1520px;height:300px"><span class="p">$</span> ollama run llama3.1:70b --gpu rtx5090
<span class="e">✗ 43 GB model · 32 GB VRAM · spilling layers to system RAM…</span></div>
    <div class="sticker red s36a" style="left:520px;top:560px;font-size:60px;transform:rotate(-5deg)">CUDA out of memory 💀</div>`,
    (q, t0) => { H.pop(q('.s36a'), t0 + .1, { rot0: 30, rot: -5, cue: 'error' }); H.shake(q('.term'), t0 + .1); });

  S(W('r5'), { theme: 'black', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    ${board(2, 2, 'sb4')}
    <div class="abs" style="left:120px;top:210px"><div class="label acc">ROUND 04 · GPT-OSS 120B · MXFP4 · 65 GB</div>
      <div class="disp" style="font-size:330px;line-height:.9"><span class="s37n">0</span></div><div class="mono" style="font-size:32px">tok/s on one Spark · Ollama · batch 1</div></div>
    <div class="abs cut card" style="left:1180px;top:260px;width:620px;border:4px solid var(--r);background:#0d0d0d">
      <div class="label red">RTX 5090</div><div class="disp red" style="font-size:120px">N/A</div><div class="mono" style="font-size:22px">65 GB won’t fit in 32 GB</div></div>
    ${src(SRC.lmsys + ' · GPT-OSS 120B · MXFP4 · Ollama · batch 1 · 41.88 tok/s (llama.cpp build 7941: 58.7 tg32)')}`,
    (q, t0) => { counter(q('.s37n'), t0 + .1, W('r5', '42') + .3, 0, 41.88, v => v.toFixed(1), true); H.pop(q('.sb4'), t0 + .2, { cue: false }); });

  S(W('r5', 'serves'), { theme: 'white', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    <div class="abs" style="left:120px;top:190px"><div class="disp" style="font-size:250px">64</div><div class="serif" style="font-size:70px">users at once</div>
      <div class="mono" style="font-size:28px;margin-top:20px"><b>291.7 tok/s</b> total on GPT-OSS 120B</div>
      <div class="mono" style="font-size:20px;color:#5c5c5c">SGLang · MXFP4 · batch 64 · 2048 in / 2048 out</div></div>
    <div class="abs s38g" style="left:900px;top:190px;display:grid;grid-template-columns:repeat(8,96px);gap:14px">
      ${Array.from({ length: 64 }, () => `<div class="u" style="height:62px;background:#0A0A0A;clip-path:polygon(50% 0,70% 12%,70% 38%,50% 50%,30% 38%,30% 12%,50% 0,50% 0,100% 100%,0 100%,50% 55%,50% 55%)"></div>`).join('')}</div>
    ${src(SRC.lmsys)}`,
    (q, t0) => { q.all('.s38g .u').forEach((u, i) => { tl().fromTo(u, { background: '#cfcfcf' }, { background: '#76B900', duration: .08, immediateRender: true }, t0 + .02 + i * .022); if (i % 8 === 0) cue(t0 + .02 + i * .022, 'tick', .3); }); });

  S(W('r6'), { theme: 'black', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    ${board(3, 2, 'sb5')}
    <div class="abs" style="left:120px;top:210px;width:1680px">
      <div class="label dim">POWER · watts · shorter is better</div>
      <div class="bar-row"><div class="nm g">DGX SPARK</div><div class="bar-track"><div class="bar win b1" style="width:${90 / 600 * 100}%"></div><div class="bar-val v1" style="left:calc(${90 / 600 * 100}% + 20px)">60–90 W <span class="mono" style="font-size:22px">at the wall, running an LLM</span></div></div></div>
      <div class="bar-row"><div class="nm">RTX 5090</div><div class="bar-track"><div class="mono dim" style="font-size:26px;line-height:84px">…</div></div></div></div>
    <div class="abs serif acc s39c" style="left:900px;top:600px;font-size:84px">sips. like a laptop charger.</div>
    ${src('Spark: ServeTheHome review, 2025-10-14 (60–90 W LLM inference) · Tom’s Hardware: ~160 W at the wall under GPU load · 240 W PSU')}`,
    (q, t0) => { H.barX(q('.b1'), W('r6', '60 to 90')); H.fade(q('.v1'), W('r6', '60 to 90') + .2); H.fade(q('.s39c'), W('r6', 'LLMs.')); H.pop(q('.sb5'), W('r6', 'watts'), { cue: false }); });

  S(W('r6', 'The'), { theme: 'pure', sec: '05 HEAD-TO-HEAD', page: 5, punch: .05 }, `
    <div class="abs s39f" style="left:110px;top:260px">${ART.gpuCard(820)}</div>
    <div class="abs" style="left:1060px;top:220px"><div class="label dim">RTX 5090 · TOTAL GRAPHICS POWER</div>
      <div class="disp" style="font-size:300px;line-height:.9"><span class="s40w">0</span><span style="font-size:140px"> W</span></div>
      <div class="mono" style="font-size:26px">card only · NVIDIA recommends a 1,000 W PSU</div></div>
    <div class="sticker s39s" style="left:1080px;top:690px;transform:rotate(-4deg)">your electricity bill: 😬</div>
    ${src(SRC.g5090)}`,
    (q, t0) => { cue(t0, 'fan', .9); counter(q('.s40w'), t0 + .2, W('r6', '575 W.') + .2, 0, 575, v => Math.round(v), true);
      q.all('.s39f .fan').forEach(f => proc(t => { const dt = Math.max(0, t - t0); f.style.transform = `rotate(${dt * dt * 700}deg)`; }));
      H.pop(q('.s39s'), W('r6', 'Rated'), { rot0: 20, rot: -4 }); });

  S(W('r7'), { theme: 'white', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    <div class="abs" style="left:120px;top:200px"><div class="label">DGX SPARK · FOUNDERS EDITION MSRP</div>
      <div class="disp" style="font-size:280px;line-height:.9">$<span class="s40n">3,999</span></div>
      <div class="mono" style="font-size:26px;margin-top:6px"><s class="s40o">$3,999 at launch (Oct 2025)</s> → <b>$4,699 since Feb 25, 2026</b></div></div>
    <div class="toast s40t" style="top:560px;right:120px"><div class="h">PRICE UPDATE · NVIDIA DEV FORUM</div>“adjusted from $3,999 to $4,699 due to memory supply constraints”</div>
    ${src('forums.developer.nvidia.com/t/2-23-2026-price-change-announcement/361713 (posted Feb 25, 2026) · street prices vary')}`,
    (q, t0) => { counter(q('.s40n'), W('r7', '$4,699.') - .2, W('r7', '$4,699.') + .4, 3999, 4699, v => Math.round(v).toLocaleString('en-US'), true); H.fade(q('.s40t'), W('r7', '$4,699.') + .3); cue(W('r7', '$4,699.') + .3, 'toast', .6); });

  S(W('r7', 'The'), { theme: 'black', sec: '05 HEAD-TO-HEAD', page: 5 }, `
    ${board(3, 3, 'sb6')}
    <div class="abs" style="left:120px;top:210px;width:1680px;font-family:var(--mono)">
      <div class="label dim">RTX 5090 DESKTOP · BUILD ESTIMATE</div>
      <div class="s41r" style="display:flex;justify-content:space-between;font-size:40px;border-bottom:2px solid #333;padding:18px 0"><span>RTX 5090 (MSRP, Jan 2025)</span><b>$1,999</b></div>
      <div class="s41s" style="display:flex;justify-content:space-between;font-size:40px;border-bottom:2px solid #333;padding:18px 0"><span>CPU · board · 64 GB RAM · 1,000 W PSU · case · SSD <span class="dim">(our est.)</span></span><b>~$1,500</b></div>
      <div class="s41t" style="display:flex;justify-content:space-between;font-size:60px;padding:22px 0;color:var(--g)"><b>TOTAL</b><b class="disp" style="font-size:120px">~$3,500</b></div></div>
    <div class="sticker s41x" style="left:1080px;top:760px;transform:rotate(3deg)">street price varies — a lot 👀</div>
    ${src(SRC.g5090 + ' · rest-of-PC cost is our assumption, not a quote')}`,
    (q, t0) => { H.slideX(q('.s41r'), t0); H.slideX(q('.s41s'), W('r7', 'plus')); H.slam(q('.s41t'), W('r7', 'PC.')); H.pop(q('.s41x'), W('r7', 'PC.') + .35, { cue: false }); H.pop(q('.sb6'), W('r7', 'PC.') + .1, { cue: false }); });

  // full scoreboard — 12 rounds
  const ROUNDS = [
    ['MEMORY', '128 GB', '32 GB', 'S'], ['BANDWIDTH', '273 GB/s', '1,792 GB/s', 'G'], ['DECODE · 20B', '60.9 tok/s', '205.5 tok/s', 'G'], ['PREFILL · 20B', '2,054', '8,519', 'G'],
    ['70B MODEL', '4.58 tok/s', 'doesn’t fit', 'S'], ['BIGGEST MODEL', '200B (NVIDIA)', '~30B-class', 'S'], ['MULTI-USER · 120B', '291.7 tok/s @64', 'n/a', 'S'], ['POWER', '60–90 W', '575 W card', 'S'],
    ['NOISE / SIZE', '37.5 dBA · 1.2 kg', 'full tower', 'S'], ['PRICE', '$4,699', '~$3,500 build', 'G'], ['SOFTWARE', 'NVIDIA AI stack', 'games + creative + AI', 'T'], ['FINE-TUNING', 'up to 70B (NVIDIA)', '32 GB limit', 'S']];
  S(W('r8'), { theme: 'black', sec: '05 HEAD-TO-HEAD', page: 5, drift: .01 }, `
    <div class="abs label dim" style="left:120px;top:140px">THE SCORECARD · 12 ROUNDS</div>
    <div class="abs sc" style="left:120px;top:176px;width:1680px;font-family:var(--mono);font-size:25px">
      <div style="display:grid;grid-template-columns:360px 1fr 1fr 170px;padding:8px 14px;color:#8c8c8c;font-weight:700"><span>ROUND</span><span>DGX SPARK</span><span>RTX 5090</span><span>WIN</span></div>
      ${ROUNDS.map((r, i) => `<div class="rw rw${i}" style="display:grid;grid-template-columns:360px 1fr 1fr 170px;padding:8px 14px;border-top:1px solid #262626;${r[0] === 'SOFTWARE' ? 'background:#1a1a1a' : ''}">
        <b>${r[0]}</b><span style="${r[3] === 'S' ? 'color:var(--g);font-weight:700' : ''}">${r[1]}</span><span style="${r[3] === 'G' ? 'color:var(--g);font-weight:700' : ''}">${r[2]}</span>
        <span class="pill" style="font-size:17px;padding:5px 10px;${r[3] === 'T' ? 'background:#fff' : ''}">${r[3] === 'S' ? 'SPARK' : r[3] === 'G' ? '5090' : 'DEPENDS'}</span></div>`).join('')}</div>
    <div class="sticker black s42s" style="left:1100px;top:800px;transform:rotate(3deg);font-size:26px">score ≠ verdict. bottleneck = verdict.</div>
    <div class="src">sources per row in README · noise: Tom’s Hardware (37.5 dBA @ 18") · fine-tuning & 200B: NVIDIA claims</div>`,
    (q, t0) => { q.all('.rw').forEach((r, i) => H.fade(r, t0 + .05 + i * .07, { y: 12 })); cue(t0 + .1, 'whoosh', .4); H.pop(q('.s42s'), W('r8', 'games'), { rot0: -10, rot: 3 }); });

  /* ================= § 06 WHICH ONE? ================= */
  S(W('b1'), { theme: 'green', sec: '06 WHICH ONE?', page: 6, punch: .14, cutCue: 'boom', cutGain: .5 }, `
    <div class="center"><div class="serif s43a" style="font-size:90px;color:#000">so… which one should</div><div class="disp s43b" style="font-size:330px;color:#000">YOU BUY?</div></div>`,
    (q, t0) => { H.fade(q('.s43a'), t0); H.slam(q('.s43b'), W('b1', 'you')); });

  const tree = (on) => `
    <div class="abs cut" style="left:710px;top:150px;width:500px;padding:22px;background:#fff;color:#000;text-align:center;--cut:16px"><div class="label">WHAT’S YOUR BOTTLENECK?</div></div>
    <svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080"><path d="M960 215 L960 260 L480 260 L480 300 M960 260 L1440 260 L1440 300" stroke="#8c8c8c" stroke-width="4" fill="none"/></svg>
    <div class="abs cut tS" style="left:120px;top:300px;width:720px;height:470px;padding:30px;border:4px solid ${on === 'S' ? 'var(--g)' : '#333'};background:#0d0d0d;opacity:${on === 'S' ? 1 : .35}">
      <div class="label acc">CAPACITY</div>
      <div class="mono" style="font-size:30px;line-height:1.7;margin-top:10px">▸ big models (70B–200B)<br>▸ agents w/ long context<br>▸ fine-tuning (up to 70B*)<br>▸ quiet desk box (37.5 dBA)</div>
      <div class="disp g" style="font-size:110px;margin-top:10px">→ DGX SPARK</div></div>
    <div class="abs cut tG" style="left:1080px;top:300px;width:720px;height:470px;padding:30px;border:4px solid ${on === 'G' ? 'var(--g)' : '#333'};background:#0d0d0d;opacity:${on === 'G' ? 1 : .35}">
      <div class="label acc">SPEED</div>
      <div class="mono" style="font-size:30px;line-height:1.7;margin-top:10px">▸ max tok/s on ≤30B models<br>▸ gaming (it’s a GeForce)<br>▸ video, 3D, creative apps<br>▸ Windows or Linux</div>
      <div class="disp g" style="font-size:110px;margin-top:10px">→ RTX 5090</div></div>`;
  S(W('b2'), { theme: 'black', sec: '06 WHICH ONE?', page: 6 }, tree('S') + `<div class="src">*NVIDIA: “fine-tune models of up to 70 billion parameters” · noise: Tom’s Hardware review</div>`,
    (q, t0) => { H.slideX(q('.tS'), t0, { x: -160 }); H.pop(q('.tS .disp'), W('b2', 'Spark.'), { cue: 'ding' }); });
  S(W('b3'), { theme: 'black', sec: '06 WHICH ONE?', page: 6 }, tree('G'),
    (q, t0) => { H.slideX(q('.tG'), t0, { x: 160 }); H.pop(q('.tG .disp'), W('b3', '5090.'), { cue: 'ding' }); });

  S(W('b4'), { theme: 'white', sec: '06 WHICH ONE?', page: 6 }, `
    <div class="abs s46a" style="left:140px;top:300px">${ART.sparkBox(460, '#000', '#fff')}</div>
    <div class="abs s46b" style="left:1320px;top:300px">${ART.sparkBox(460, '#000', '#fff')}</div>
    <div class="abs s46c" style="left:560px;top:520px;width:800px;height:10px;background:var(--g);transform-origin:0 50%"></div>
    <div class="abs mono" style="left:640px;top:450px;font-size:24px;font-weight:700">ConnectX-7 · 200 Gb/s</div>
    <div class="abs center" style="top:-230px"><div class="disp s46d" style="font-size:200px">2 × SPARK = 405B</div></div>
    <div class="toast s46t" style="top:660px;right:560px;width:800px"><div class="h">ALSO ANNOUNCED · MAY 31, 2026</div>RTX Spark (N1X) Windows-on-Arm PCs · up to 128 GB unified · “this fall” · price TBA</div>
    ${src('405B: docs.nvidia.com DGX Spark hardware · product page now says up to 4 units / 700B · RTX Spark: nvidianews.nvidia.com 2026-05-31')}`,
    (q, t0) => { H.pop(q('.s46a'), t0, { cue: false }); H.pop(q('.s46b'), W('b4', 'Link'), { cue: false }); H.barX(q('.s46c'), W('b4', 'Link') + .1, { d: .3 }); cue(W('b4', 'Link') + .1, 'whoosh', .5); H.slam(q('.s46d'), W('b4', '405B.')); H.fade(q('.s46t'), W('b4', '405B.') + .35); cue(W('b4', '405B.') + .35, 'toast', .5); });

  /* ================= § 07 VALUE ================= */
  S(W('c1'), { theme: 'white', sec: '07 VALUE', page: 7 }, `
    <div class="center"><div class="label">VALUE MATH · ESTIMATE</div><div class="disp s47a" style="font-size:250px">$ ÷ TOK/S</div>
      <div class="serif" style="font-size:66px">what one token-per-second of speed costs you</div></div>`,
    (q, t0) => { H.slam(q('.s47a'), W('c1', 'dollars')); });

  const calc = (hi) => `
    <div class="abs label dim" style="left:120px;top:150px">ESTIMATE · hardware price ÷ measured decode tok/s (LMSYS, Ollama, batch 1) · ignores power, resale, your time</div>
    <div class="abs mono" style="left:120px;top:220px;width:1680px;font-size:44px;line-height:1.3">
      <div class="k1" style="display:grid;grid-template-columns:420px 1fr 280px;padding:24px 0;border-bottom:2px solid #333"><b>5090 BUILD</b><span>$3,500 (est.) ÷ 205.5</span><b class="g">$17.03</b></div>
      <div class="k2" style="display:grid;grid-template-columns:420px 1fr 280px;padding:24px 0;border-bottom:2px solid #333"><b>DGX SPARK</b><span>$4,699 ÷ 60.9</span><b>$77.15</b></div>
      <div class="dim" style="font-size:26px;padding-top:14px">— on GPT-OSS 20B —</div>
      <div class="k3" style="display:grid;grid-template-columns:420px 1fr 280px;padding:24px 0;border-top:2px solid #333;margin-top:16px"><b>on 120B</b><span>Spark: $4,699 ÷ 41.9 = <b class="g">$112</b></span><b class="red">5090: ∞</b></div></div>`;
  S(W('c1', 'on'), { theme: 'black', sec: '07 VALUE', page: 7, drift: .01 }, calc(0) + src(SRC.lmsys + ' · prices: NVIDIA MSRP (Spark, Feb 2026), 5090 MSRP + our ~$1,500 PC estimate'),
    (q, t0) => { H.slideX(q('.k1'), t0); H.slideX(q('.k2'), W('c1', 'Spark,')); H.hide(q('.k3'), t0); });
  S(W('c2'), { theme: 'black', sec: '07 VALUE', page: 7, drift: .01 }, calc(1) + src(SRC.lmsys + ' · GPT-OSS 120B · MXFP4 · Ollama · 41.88 tok/s'),
    (q, t0) => { H.slideX(q('.k3'), t0); cue(W('c2', 'play.'), 'error', .6); });

  /* ================= § 08 VERDICT ================= */
  S(W('v1'), { theme: 'pure', sec: '08 VERDICT', page: 8, punch: .16, cutCue: 'boom', cutGain: 1 }, `
    <div class="abs" style="left:120px;top:200px"><div class="disp s49a" style="font-size:210px">SPARK =</div><div class="disp g s49b" style="font-size:250px">CAPACITY.</div></div>
    <div class="abs s49c" style="left:1120px;top:250px">${ART.sparkBox(620)}</div>`,
    (q, t0) => { flash(t0, .8); H.slam(q('.s49a'), t0, { cue: false }); H.slam(q('.s49b'), W('v1', 'capacity.'), { cue: 'pop' }); H.pop(q('.s49c'), t0 + .1, { cue: false }); });

  S(W('v1', '5090'), { theme: 'white', sec: '08 VERDICT', page: 8, punch: .12 }, `
    <div class="abs" style="left:120px;top:200px"><div class="disp s50a" style="font-size:210px">5090 =</div><div class="disp s50b" style="font-size:250px;color:var(--g);-webkit-text-stroke:4px #000">SPEED.</div></div>
    <div class="abs s50c" style="left:1080px;top:330px">${ART.gpuCard(700, '#000')}</div>`,
    (q, t0) => { H.slam(q('.s50a'), t0, { cue: false }); H.slam(q('.s50b'), W('v1', 'speed.'), { cue: 'pop' }); H.slideX(q('.s50c'), t0, { x: 300 });
      q.all('.s50c .fan').forEach(f => proc(t => { f.style.transform = `rotate(${Math.max(0, t - t0) * 1400}deg)`; })); });

  S(W('v1', 'Pick'), { theme: 'green', sec: '08 VERDICT', page: 8, punch: .14, cutCue: 'boom', cutGain: .9, drift: .03 }, `
    <div class="abs" style="left:120px;top:150px;color:#000">
      <div class="disp s51a" style="font-size:108px;line-height:1">SPARK = CAPACITY.</div>
      <div class="disp s51b" style="font-size:108px;line-height:1;color:#fff;-webkit-text-stroke:3px #000">5090 = SPEED.</div>
      <div class="disp s51c" style="font-size:210px;line-height:.92;margin-top:18px">PICK YOUR<br>BOTTLENECK.</div></div>
    <div class="abs s51d" style="left:120px;top:800px;width:1680px;display:flex;justify-content:space-between;align-items:center;color:#000;border-top:3px solid #000;padding-top:14px">
      <span class="mono" style="font-size:30px;font-weight:700;letter-spacing:.14em">BY YUVAL AVIDANI · YUV.AI</span>
      <span class="mono" style="font-size:18px">not affiliated with NVIDIA · sources in README</span></div>`,
    (q, t0) => { flash(t0, .6); H.fade(q('.s51a'), t0); H.fade(q('.s51b'), t0 + .08); H.slam(q('.s51c'), W('v1', 'bottleneck.'), { cue: false }); H.fade(q('.s51d'), W('v1', 'bottleneck.') + .5); });

  window.finalize(T.duration);
})();
