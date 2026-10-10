#!/usr/bin/env bash
# Full deterministic pipeline: script -> TTS -> word sync -> assets -> page -> cues -> music/sfx/mix -> render -> encode
set -euo pipefail; cd "$(dirname "$0")"; mkdir -p build tts qa out
python3 src/tts.py                    # Kokoro-82M per line + 0.12 s gaps  -> tts/vo.wav, tts/lines.json
python3 src/align.py                  # faster-whisper word timestamps, snapped to script tokens -> build/words.js
python3 src/build_assets.py           # fonts (woff2), logo variants, icons, 4 grain PNGs
python3 src/build_page.py             # GSAP page -> build/index.html
python3 src/extract_cues.py           # page emits SFX CUES + CUTS + DROP/BREAK/END -> build/cues.json
PYTHONPATH=src python3 src/mix.py     # procedural 140 BPM music + SFX + sidechain duck + loudnorm -14 LUFS
python3 src/qa_stills.py              # QA: one still per shot -> contact sheets
python3 src/render.py --workers "$(nproc)"   # parallel Playwright render + x264 + 720p preview
python3 src/qa_audio.py out/agentcore-harness-explainer.mp4   # intelligibility of the final mix
