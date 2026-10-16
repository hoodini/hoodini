#!/usr/bin/env bash
# Full build: Gemini 3.8 Flash TTS voiceover -> timing -> soundtrack mix -> frame render -> MP4
set -euo pipefail
cd "$(dirname "$0")"
pip install -q numpy scipy imageio-ffmpeg >/dev/null 2>&1 || true
export FFMPEG="${FFMPEG:-$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')}"
python3 tts.py            # needs GEMINI_API_KEY; without it, timing is estimated and there is no VO
python3 soundtrack.py
node render.mjs video project-lily-motion.mp4 mix.wav
"$FFMPEG" -loglevel error -y -i project-lily-motion.mp4 -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -c:a copy -movflags +faststart tmp.mp4 && mv tmp.mp4 project-lily-motion.mp4
ls -la project-lily-motion.mp4
