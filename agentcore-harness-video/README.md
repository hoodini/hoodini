# AgentCore Harness — motion-graphics explainer

**BY YUVAL AVIDANI — AWS GEN AI SUPERSTAR · YUV.AI** · 16:9 · 1920×1080 · 30 fps · H.264 High + AAC 48 kHz · −14 LUFS · ~106 s

Fast-edit explainer on **Amazon Bedrock AgentCore harness** (GA 18 Jun 2026): what it is and why it beats a DIY agent stack.
Everything (script → TTS → word sync → page → SFX → music → mix → render) is code in this folder and re-runnable with `./run_all.sh`.

```
out/agentcore-harness-explainer.mp4              1080p master (X upload)
out/agentcore-harness-explainer-720p-preview.mp4 720p preview for chat
```

## 0. Facts — every on-screen / VO claim → source (all pages fetched 29 Sep 2026, all dated ≤ 12 months)

| Claim in the video | Source |
|---|---|
| Harness = managed runtime; you declare **model, tools, skills, instructions**; AgentCore handles environment, compute, memory, identity, networking, observability | [Harness overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness.html) |
| **2 API calls**: `CreateHarness` (define) / `InvokeHarness` (run); GA on **18 Jun 2026** | [GA blog post](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-harness-is-now-generally-available-go-from-idea-to-production-grade-agent-in-minutes/) |
| Terminal snippets (`aws bedrock-agentcore-control create-harness …`, `client.invoke_harness(harnessArn=…, runtimeSessionId=…, messages=…)`, `agentcore deploy`, `npm i -g @aws/agentcore`) | [Get started](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-get-started.html) |
| Built-ins: browser (`agentcore_browser`), code interpreter (`agentcore_code_interpreter`, sandboxed Python + Node), shell, file system (`file_operations`), Gateway (OpenAPI, Smithy, Lambda, MCP), memory | GA blog post; Harness overview |
| Any model (Bedrock, OpenAI, Gemini, LiteLLM), **switch providers mid-session and keep context**; model chips = the list in the GA blog | Harness overview; GA blog |
| Memory persists across sessions | Harness overview |
| **1 session = 1 isolated Firecracker microVM**, no shared state / filesystem | [Harness security](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-security.html) |
| **Up to 8 h** per microVM lifetime (default `maxLifetime` 28 800 s, max 28 800 s for microVMs) | [Lifecycle settings](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-lifecycle-settings.html); [Runtime sessions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html) |
| **"10 → 5,000" sessions**: default *active session workloads per account* quota = 5,000 (us-east-1, us-west-2; 2,500 elsewhere), adjustable | [Quotas](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html) |
| After a session the **microVM is terminated and memory is sanitized** | [Runtime sessions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html) |
| API keys live in **AgentCore Identity's token vault; the agent never sees raw credentials** | GA blog post |
| Every step traced automatically (model calls, tool invocations, memory ops, shell commands) to CloudWatch; **session → trace → span** hierarchy | [Observability & costs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-operations.html); [Telemetry concepts](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-telemetry.html) |
| Pricing: CPU billed on **active consumption** — **no CPU charge during model/tool I/O wait**; **no separate harness fee** (memory stays billable while the session runs — shown as fine print) | [Observability & costs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-operations.html); [Pricing](https://aws.amazon.com/bedrock/agentcore/pricing/) |
| Ops: **immutable versions**, named endpoints, rollback = repoint an endpoint; Evaluations (LLM-as-a-judge: helpfulness / faithfulness / safety); **A/B tests with statistical significance** | Harness overview; GA blog post |
| Export to **Strands** code, keeping model / prompt / tools (and memory wiring, skills, container env) | Harness overview; GA blog post |
| AWS Architecture Icons (Bedrock, AgentCore, Lambda, ECS, DynamoDB, Cognito, Secrets Manager, CloudWatch…) | [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/) (package `Icon-package_01302026`) |

**Deliberately NOT claimed** – no competitor names (the comparison is against a *generic DIY stack*); no per-vCPU/GB rates (the GA blog says $0.0895 / vCPU-h, the live pricing page says $0.1276 — sources disagree, so no rate is shown); no customer names.

**Jokes / illustrations, not facts** (they are labelled as such in the README, not in the video): "6 services / 12 dashboards / 0 sleep", "9 log-group tabs", the 03:07 AM clock, "friday 4:59 PM", chat/toast texts, the ex, `session_id: 7f3a…`, the config panel (marked `# simplified for the screen` — field names follow the docs' wording "model, tools, skills, instructions" but it is **not literal API syntax**), the `✔ deployed` line typed after `agentcore deploy` (illustrative output), and the DIY column of the scoreboard.

## 1. Story beats (97 cuts, median ≈ 1.0 s)

| § | Page | Beat |
|---|---|---|
| 01 | HOOK | "POV: your AI agent works perfectly… on your laptop" → boss "ship it" → sandboxes / memory / auth / logs / scaling → "and therapy." (record scratch) |
| 02 | THE PAIN | duct-taped tower of 6 AWS services, 12 dashboards, 0 sleep, "prod is on fire. again." → riser |
| 03 | THE DROP | AWS logo slam + white difference flash + boom → AMAZON / BEDROCK / AGENTCORE → "main character: THE HARNESS" |
| 04 | ANALOGY | restaurant: you bring the recipe (config), AWS runs the kitchen |
| 05 | HOW IT WORKS | config (model/tools/skills/instructions) with line highlights synced to VO → "2 API calls" (`CreateHarness` / `InvokeHarness`) |
| 06 | BUILT-INS | browser, code interpreter, shell, file system, Gateway ("MCP = USB-C for AI tools"), memory ("unlike your ex"), any model + mid-session switch, CLI deploy, "touch grass" |
| 07–10 | PILLARS | **01 Scale** (hostel vs hotel, 1 session = 1 microVM, 8 h, 10 → 5,000) · **02 Security** (microVM shatters + broom, key → vault, 🙈) · **03 Observability** (flight black box, session→trace→step waterfall vs 9 tabs at 3 AM) |
| 11–12 | PRICING / OPS | active-CPU billing bar with a live "cpu-seconds billed" meter, "$0 harness fee", versions / rollbacks / evals / A-B, export to code |
| 13 | SCOREBOARD | DIY STACK vs AGENTCORE HARNESS — strike-throughs + ✓ stamps land on the spoken word |
| 14 | VERDICT | "your job is SHIPPING AGENTS. ~~not babysitting infrastructure~~" → magazine-cover end card + credit line + barcode |

## 2. Design system — "editorial magazine × code editor"

* **Palette only**: ink `#0B0B0C`, paper `#EEE8DD`, AWS orange `#FF9900`. Hard cuts alternate ink / paper / orange; the AWS logo switches variant per theme (default on paper, *reversed* on ink, *mono* on orange).
* **Type** (self-hosted woff2 via `@fontsource`): **Anton** (150–1000 px, sized per word so nothing overflows) × **Instrument Serif Italic** (contrast lines) × **JetBrains Mono** (code, labels, captions).
* **Magazine chrome on every frame**: top rule `AGENTCORE — ISSUE Nº01 · § section · date · AWS logo`, bottom rule with running timecode + `P. 03 / 14`, 80 px margins, barcode on the end cover.
* **Code feel**: `//` labels, `$` prompts with typing + blinking caret, syntax-coloured panel with highlights synced to the VO.
* **Captions**: mono `> word word word`, 3–5 words per chunk, spoken word inverted, timed from real word timestamps.
* **Icons**: Lucide (line, 1.2–2 px stroke) + official AWS Architecture Icons; Noto Color Emoji for humour only.
* **Film grain**: 4 pre-rendered noise PNGs cycled per frame (no live SVG filter).
* **Overlay layer**: rotated stickers (3 px border, hard offset shadow, wobble), iOS-style toasts, hand-drawn orange scribble circles + curved arrows with serif labels, an animated mouse cursor with click ripples.
* **Motion primitives**: mask reveals (`yPercent 118→0`, `expo.out`), scale slams, `back.out` pop-ins, `scaleX` rules/strikes, typers, counters, per-cut punch-in, difference-flash on the drop, 140 BPM micro-zoom after the drop.

## 3. Pipeline (deterministic & reproducible)

```
src/script.json        VO script; {spoken=Display} lets on-screen spelling differ from what TTS says
src/tts.py             Kokoro-82M (kokoro-onnx, af_heart, speed 1.2) per line, 0.12 s default gap  -> tts/*.wav, lines.json
src/align.py           faster-whisper small.en word timestamps (prompted with the script), snapped onto the SCRIPT tokens
                       -> captions can never mis-spell Claude/cloud, ex/X, 3AM, 10,000, AgentCore   -> build/words.js
src/build_assets.py    fonts, AWS logo variants, icon subset, 4 grain PNGs
src/js/*.js            single GSAP page, timeline paused. window.seek(t, frame) renders any frame; per-frame fx() handles shot
                       visibility/theme, typers, counters, wobble, live meters, captions, grain, timecode. No Math.random (seeded PRNG).
                       W(line, word, nth) = word timestamp; every animation time derives from it (no hard-coded seconds).
src/extract_cues.py    page emits CUES (sfx events) + CUTS + DROP/BREAK/END -> build/cues.json
src/sfx.py, music.py   procedural SFX and a 140 BPM F-minor trap/phonk beat (kick, distorted 808 on F-Db-Eb-C roots, clap, hat rolls,
                       saw stabs, cowbell, pad breakdown); drop on the logo slam, breakdown before the verdict, re-drop, hard stop
src/mix.py             VO EQ/compression, sidechain-duck music under VO, SFX at cue times, two-pass loudnorm -14 LUFS / -1 dBTP
src/render.py          N parallel Playwright workers (jpeg q92 -> ffmpeg), concat, final libx264 slow -tune grain ~5.5 Mbps, 720p preview
src/qa_stills.py       one still per shot (~85 % in) + contact sheets (qa/sheet_*.jpg)
src/qa_audio.py        transcribes the FINAL mix to verify intelligibility
```

Setup: `./fetch_assets.sh && pip install -r requirements.txt && ./run_all.sh` (Chromium must be available to Playwright; the render script points at `/opt/pw-browsers/chromium-1194` — adjust `CH`).

## 4. Real vs synthesized

* **Voice — synthesized, Kokoro-82M `af_heart`** (local, open weights). **ElevenLabs was not used**: the connector in this session exposes speech generation but no balance/credit endpoint and no `eleven_music`, and generated files cannot be pulled into the render sandbox, so per the brief the pipeline fell back to Kokoro without asking. (An estimate-only call priced ~100 characters at ~99 credits, i.e. the ~1 500-character script would have needed ≈1.5 k credits per take — not verified against the actual balance.)
* **Music & SFX — 100 % procedural** (numpy/scipy), no samples, no third-party audio.
* **Icons / logo** — official AWS Architecture Icons package and the AWS logo (Wikimedia Commons copy of the official mark; usage approved per the author's Gen AI Superstar status — swap in brand-portal assets if you prefer). Lucide icons (ISC). Noto Color Emoji (OFL).
* **No footage, no AI-generated imagery** — every pixel is HTML/SVG rendered by Chromium.

## 5. QA results

See the bottom of this file (filled in after the final render).
