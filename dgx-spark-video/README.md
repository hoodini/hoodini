# DGX Spark vs RTX 5090: which one should you buy?

This is a 117-second motion-graphics explainer for X (16:9, 1920×1080, 30 fps). Its thesis is **Spark = capacity, 5090 = speed. Pick your bottleneck.**

*By Yuval Avidani · YUV.AI. Not affiliated with or endorsed by NVIDIA.*

| Deliverable | File |
|---|---|
| Final 1080p (H.264 High, AAC 48 kHz, −14 LUFS) | `out/dgx-spark-vs-rtx5090_1080p.mp4` |
| 720p preview | `out/dgx-spark-vs-rtx5090_720p.mp4` |
| QA contact sheets (one still per shot) | `qa/sheet_*.jpg` |
| Transcript of the final mix | `audio/transcript_final.txt` |

---

## 1. The core lesson (what the video teaches)

- **Token generation speed ≈ memory bandwidth.** Decoding one token streams the active weights through memory.
  - The 5090 has 1,792 GB/s and the Spark has 273 GB/s, a **6.56×** ratio.
  - On a dense 32B model (Qwen3 32B Q4_K_M, Ollama), LMSYS measured **58.90 vs 9.53 tok/s, which is 6.2×**. That is almost exactly the bandwidth ratio. This is the key on-screen "aha".
- **Which models you can run ≈ memory capacity.**
  - The 5090 has 32 GB of VRAM. The Spark has 128 GB of unified memory.
  - A 70B Q4 model (43 GB) or GPT-OSS 120B (65 GB) fits on the Spark but not in the 5090's VRAM.

## 2. Story beats (script → shots)

The single source of truth is `audio/script.py`, which holds 28 VO lines. The final cut has 53 shots, and every timing is keyed to a word timestamp.

| § | Beat | Key on-screen facts |
|---|---|---|
| 01 Hook | "POV: you want to run a 120B model at home… your GPU has 32 GB" → `nvidia-smi` 31.8/32 GiB → **CUDA out of memory 💀** | 32 GB (5090) |
| 02 What is it | DGX Spark reveal (music drop). Tiny box, 128 GB unified memory. Pantry vs mini-fridge analogy. GB10, 20 Arm cores, 1 PFLOP FP4 *sparse* | 150×150×50.5 mm, 1.2 kg. 10× X925 + 10× A725 |
| 03 What runs | Capacity ladder on a 0–128 GB axis with a 32 GB VRAM line: 8B / 20B / 70B / 120B / 200B. Quantization = "zip the model" | Ollama download sizes 4.9 / 14 / 43 / 65 GB. 200B = NVIDIA claim |
| 04 Bottleneck | Warehouse with a narrow door vs a garage on a highway. Pipes drawn **to scale**, with packets flowing at proportional speed | 273 vs 1,792 GB/s = 6.56× |
| 05 Head-to-head | Split-screen race (the same text streamed at 205.48 vs 60.91 tok/s). Bar charts for decode, dense 32B, prefill, 70B, 120B, 64 users, power, price, software. Then a 12-round scorecard | See §5 |
| 06 Which one? | Decision tree: capacity → Spark, speed → 5090. Two Sparks → 405B. RTX Spark toast | |
| 07 Value | $ ÷ tok/s, **labelled as an estimate** | $17.03 vs $77.15 on 20B. On 120B: Spark $112, 5090 ∞ |
| 08 Verdict | SPARK = CAPACITY · 5090 = SPEED · PICK YOUR BOTTLENECK + credit | |

## 3. Design system: "NVIDIA-green editorial × terminal"

- **Palette**
  - NVIDIA Green `#76B900` is the accent.
  - Black `#000` / `#0A0A0A`, white `#FFF`, and greys `#1A1A1A` / `#8C8C8C`.
  - Red `#FF3B30` is used **only** for errors and "doesn't fit".
  - Four hard-cut themes: `pure`, `black`, `green`, `white`.
- **Type**
  - **Anton** for giant numbers and headlines.
  - **Instrument Serif Italic** for the thin contrast lines.
  - **JetBrains Mono** for specs, terminals, labels, source lines and captions.
  - The woff2 files are self-hosted in `page/fonts/`.
- **Chrome.** Every frame carries a spec-sheet frame with 80 px margins:
  - Top rule: `LOCAL AI ISSUE Nº02 · § section · SEP 2026`.
  - Bottom rule: live timecode, `YUV.AI`, and a page number.
  - Corner ticks and an 80 px green grid.
- **Shapes.** NVIDIA-style chamfered "cut-corner" cards (`clip-path`), stickers with hard shadows, toasts, and terminals.
- **Captions.** Bottom of frame, in the form `> words`. The spoken word is highlighted green and synced to the real word timestamps. Caption text uses **script spelling** (GPT-OSS, tok/s, GB, 5090, $4,699); whisper supplies only the timing.
- **Charts.** Bars in HTML/SVG, green for the winner and grey for the other. Units are always shown. Every chart carries a mono `SRC ›` line with its setup (model, quant, engine, batch).
- **Grain.** Four pre-rendered noise PNGs are cycled per frame (overlay, 8.5%).
- **Logo.** The NVIDIA logo is **deliberately not used.** The brand-usage page (<https://www.nvidia.com/en-us/about-nvidia/legal-info/logo-brand-usage/>) says the assets "may not be used in any manner that isn't expressly authorized in writing by NVIDIA". Product names therefore appear as plain text, the product drawings are generic line art, and the end card says "not affiliated with NVIDIA".
- **Motion.**
  - Hard cuts every ~0.6–3 s, with a punch-in on every cut (7–16% settling to 1.0, then a slow drift).
  - Text effects: scale slams, mask reveals, pop-ins, draw-on strokes, strike-throughs.
  - Typed terminal commands and live counters.
  - A procedural packet flow through the bandwidth pipes.
  - A fan spin-up on the 5090.
  - A white flash on drops and a beat-synced micro-zoom on every kick.

## 4. Pipeline

```
audio/script.py      → script.json  ({spoken|Caption} markup, [v3 tags], per-line gaps)
audio/vo_kokoro.py   → vo.wav + vo_layout.json   (Kokoro-82M, af_heart, speed 1.3, one clip per line)
audio/align.py       → page/timings.js           (faster-whisper small.en word timestamps, aligned to script tokens)
audio/music.py       → music.wav + page/beats.js (procedural 140 BPM trap; drop on the reveal, breakdown before the verdict)
page/index.html      → GSAP paused timeline + window.seek(t, frame); W(line, word) for every timing; emits CUES/CUTS
render.js --cuesOnly → audio/cues.json (SFX cues emitted by the page)
audio/sfx.py         → audio/sfx/*.wav (procedural: cut, whoosh, pop, boom, riser, error, ding, fan, tick, type, toast)
audio/mix.py         → mix.wav (VO polish, music ducked −9 dB under VO, SFX, 2-pass loudnorm −14 LUFS / −1.5 dBTP target)
render.js            → Playwright Chromium screenshots → ffmpeg, 4 parallel workers → concat
ffmpeg               → libx264 High, -preset slow -tune grain, ~5.5 Mbps + AAC 48 kHz
```

### Rebuild

```bash
pip install numpy scipy soundfile kokoro-onnx faster-whisper pillow   # + ffmpeg, playwright (Chromium)
# Kokoro model files go in audio/raw/ (kokoro-v1.0.onnx, voices-v1.0.bin from thewh1teagle/kokoro-onnx releases)
python3 audio/script.py && SPEED=1.3 GAPX=0.8 python3 audio/vo_kokoro.py && python3 audio/align.py && python3 audio/music.py && python3 audio/sfx.py
NODE_PATH=$(npm root -g) node render.js --cuesOnly 1 && python3 audio/mix.py
NODE_PATH=$(npm root -g) node render.js --workers 4
bash encode.sh
```

## 5. Sources: every on-screen number

All sources were accessed **2026-09-29**, and each URL returned HTTP 200 on that date, with one exception: the GitHub discussion answered a bot 403, and none of its numbers are used.

| On-screen fact | Value | Source (date) |
|---|---|---|
| Spark chip, CPU | GB10 Grace Blackwell. 20 Arm cores (10× Cortex-X925 + 10× Cortex-A725) | <https://www.nvidia.com/en-us/products/workstations/dgx-spark/> (live page) · <https://docs.nvidia.com/dgx/dgx-spark/hardware.html> |
| Spark memory | 128 GB LPDDR5X, coherent unified memory | same |
| Spark bandwidth | 273 GB/s | same |
| Spark AI compute | "up to 1 PFLOP at FP4 precision **with sparsity**" | docs hardware page |
| Spark size, weight | 150 × 150 × 50.5 mm, 1.2 kg | docs hardware page |
| Spark networking | ConnectX-7, 200 Gb/s | product page |
| 2 Sparks → 405B. Up to 4 → 700B | 405B / 700B params | docs hardware page. Product page ("up to four DGX Spark systems… up to 700B") |
| 200B per box · fine-tune up to 70B | NVIDIA claims | <https://nvidianews.nvidia.com/news/nvidia-dgx-spark-arrives-for-worlds-ai-developers> (2025-10-13) |
| Spark price | $3,999 at launch → **$4,699** "due to memory supply constraints" | <https://forums.developer.nvidia.com/t/2-23-2026-price-change-announcement/361713> (NVIDIA forum post, Feb 25, 2026) |
| 5090 memory, bandwidth | 32 GB GDDR7, 1,792 GB/s | <https://www.nvidia.com/en-us/geforce/news/rtx-50-series-graphics-cards-gpu-laptop-announcements/> (2025-01-06). Spec page below |
| 5090 power | 575 W TGP. 1,000 W required system power | <https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/> |
| 5090 MSRP | $1,999 (Jan 2025) | GeForce news above (2025-01-06). This is the one primary source older than 12 months, and it is the official figure. |
| Decode, GPT-OSS 20B | 5090 **205.48** vs Spark **60.91** tok/s | LMSYS blog <https://lmsys.org/blog/2025-10-13-nvidia-dgx-spark/> (2025-10-13) and its data sheet <https://docs.google.com/spreadsheets/d/1SF1u0J2vJ-ou-R_Ry1JZQ0iscOZL8UKHpdVFr85tNLU> |
| Prefill, GPT-OSS 20B | 8,518.57 vs 2,053.98 tok/s (4.1×) | LMSYS sheet |
| Dense 32B decode | Qwen3 32B Q4_K_M: 58.90 vs 9.53 tok/s (6.2×) | LMSYS sheet |
| 70B on Spark | Llama 3.1 70B Q4_K_M: **4.58** tok/s | LMSYS sheet |
| 120B on Spark | GPT-OSS 120B MXFP4: **41.88** tok/s | LMSYS sheet |
| 120B on Spark, newer llama.cpp | 58.72 tok/s tg32 (small print) | <https://raw.githubusercontent.com/ggml-org/llama.cpp/master/benches/dgx-spark/dgx-spark.md> (build 7941) |
| 64 users | GPT-OSS 120B, 291.65 tok/s total | LMSYS sheet |
| Model sizes | llama3.1:8b 4.9 GB · gpt-oss:20b 14 GB · llama3.1:70b 43 GB · gpt-oss:120b 65 GB | <https://ollama.com/library> model pages |
| Spark power | 60–90 W at the wall during LLM inference | ServeTheHome <https://www.servethehome.com/nvidia-dgx-spark-review-the-gb10-machine-is-so-freaking-cool/4/> (2025-10-14) |
| Spark power, GPU load | About 160 W at the wall. 240 W PSU | Tom's Hardware <https://www.tomshardware.com/pc-components/gpus/nvidia-dgx-spark-review/4> (updated 2026-01-27). NVIDIA product page |
| Spark noise | 37.5 dBA at 18" (max, image generation) | Tom's Hardware, same page |
| RTX Spark (N1X) | Windows-on-Arm PCs, up to 128 GB unified, "this fall", price TBA | <https://nvidianews.nvidia.com/news/nvidia-microsoft-windows-pcs-agents-rtx-spark> (2026-05-31) |
| Partner GB10 boxes | Acer, ASUS, Dell, GIGABYTE, HP, Lenovo, MSI | NVIDIA newsroom (2025-10-13) |
| CES 2026 software uplift | Mostly prefill. Decode stays bandwidth-bound | <https://developer.nvidia.com/blog/new-software-and-model-optimizations-supercharge-nvidia-dgx-spark> (Jan 2026) · <https://www.theregister.com/2026/01/05/nvidia_dgx_spark_speed/> (2026-01-05). Background only, not shown on screen |

### Benchmark setup, as shown in the mono text under the charts

- **LMSYS Ollama rows** use batch 1 and the quant named on screen (MXFP4 or Q4_K_M). LMSYS does not state the prompt length for these rows.
- **LMSYS SGLang rows** use 2048 input / 2048 output tokens. The 64-user row is batch 64.
- **Spark GPT-OSS 20B decode.** The LMSYS blog text quotes **49.7** tok/s, but its data sheet says **60.91**. The video uses the sheet value, so both devices come from the same table, and the source line notes the discrepancy.

### Estimates, labelled on screen

- **5090 desktop ≈ $3,500.** This is $1,999 MSRP plus **our assumption** of about $1,500 for CPU, board, 64 GB RAM, a 1,000 W PSU, case and SSD. It is not a quote.
- **$ per tok/s** = hardware price ÷ measured decode tok/s (LMSYS, Ollama, batch 1):
  - 5090 build: $3,500 / 205.48 = **$17.03**
  - Spark: $4,699 / 60.91 = **$77.15**
  - Spark on 120B: $4,699 / 41.88 = **$112**
  - The estimate ignores power, resale and time.
- **"200B ≈ 100 GB"** is plain arithmetic: 200B params × 4 bits = 100 GB, before overhead.
- **Street prices vary.** The video shows MSRPs with their dates and a "street price varies" sticker.

### Unverified, so NOT shown as numbers

- **5090 running 70B Q4 with CPU offload, tok/s.** Only SEO sites give a figure. The video says only "doesn't fit (CPU offload) — no reliable public tok/s".
- **2026 street prices for the 5090, and a reported ~$300 increase to board partners.** Only aggregators carry these.
- **Current partner GB10 box prices, and the RTX Spark price.**
- **Whole-system wall power of a 5090 desktop during LLM inference.** Only GPU-only measurements exist (arXiv 2601.09527: 309–546 W). The video therefore shows the 575 W TGP, labelled "card only".

## 6. Real vs synthesized

- **Real:**
  - All specs, benchmark numbers and prices, from the sources above.
  - The `ollama run` / `nvidia-smi` command syntax.
- **Synthesized or illustrative:**
  - **Terminal output.** The `nvidia-smi` 31.8/32 GiB readout, the OOM traceback, and "pulling manifest… 65 GB" are illustrative mock-ups, not captured logs. The 65 GB and 43 GB sizes are real.
  - **Split-screen race.** The text is generic. The streaming rates are the real measured tok/s, at about 4 characters per token.
  - **Product drawings** are generic line art, not NVIDIA assets.
  - **Voice-over:** Kokoro-82M TTS, voice `af_heart`.
  - **Music:** procedurally generated in numpy (140 BPM).
  - **SFX:** procedurally generated.
- **Why not ElevenLabs?** The account had 16 credits against about 2,190 needed for eleven_v3, and the music job failed with "insufficient funds". The fallback was used as specified, and nothing was charged.

## 7. QA results (final encode)

| Check | Result |
|---|---|
| Duration | 117.29 s (target 90–120) |
| Video | 1920×1080, 30 fps, H.264 High, ~5.6 Mbps, `-preset slow -tune grain` |
| Audio | AAC-LC, 48 kHz stereo, **−14.09 LUFS** integrated, **−1.15 dBTP** true peak (measured on the MP4) |
| Size | 1080p **82.5 MB** (< 100 MB). 720p preview **25.5 MB** (< 30 MB) |
| Shots | 53 hard cuts. Contact sheets in `qa/sheet_*.jpg`, stills sampled late in each shot |
| Intelligibility | The final mix was re-transcribed with faster-whisper (`audio/transcript_final.txt`), and every line came back recognizable. Known mishears are covered by the on-screen captions: "CUDA out of memory" came back as "Kudo memory" (masked by the error SFX), and "Power:" as "However". |
| Numbers | Every on-screen figure was re-checked against the LMSYS CSV export and the NVIDIA pages on 2026-09-29 (§5) |
| Known nit | The hand-drawn circle on the 128 GB bar (≈ 11–13 s) brushes the "GB" label |
