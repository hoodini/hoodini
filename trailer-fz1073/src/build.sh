#!/usr/bin/env bash
# Full pipeline: assets -> cues -> score -> frames (parallel) -> final encodes + checks.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 src/gen_assets.py
python3 src/render.py cues audio/cues.json
python3 src/audio.py audio/cues.json audio/score_raw.wav
# loudness: measure integrated LUFS (EBU R128) and apply one linear gain to hit -14 LUFS
I=$(ffmpeg -hide_banner -i audio/score_raw.wav -af ebur128=framelog=quiet -f null - 2>&1 | awk '/Summary/{f=1} f&&/ I:/{print $2; exit}')
G=$(python3 -c "print(round(-14.0-($I),2))")
ffmpeg -y -hide_banner -loglevel error -i audio/score_raw.wav -af "volume=${G}dB" -c:a pcm_f32le audio/score.wav
N=$(nproc)
for F in v h; do
  python3 src/render.py video $F out/silent_$F.mp4 $N
  NAME=$([ $F = v ] && echo 9x16 || echo 16x9)
  ffmpeg -y -hide_banner -loglevel error -i out/silent_$F.mp4 -i audio/score.wav -map 0:v -map 1:a \
    -c:v libx264 -preset slow -profile:v high -b:v 5M -maxrate 7M -bufsize 10M -pix_fmt yuv420p \
    -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest out/FZ1073_trailer_$NAME.mp4
  rm -rf out/silent_$F.mp4 out/silent_$F.mp4.parts
done
ffmpeg -y -hide_banner -loglevel error -i out/FZ1073_trailer_9x16.mp4 -vf scale=720:1280 -c:v libx264 -preset slow -b:v 2.5M \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out/FZ1073_trailer_9x16_720p_preview.mp4
for f in out/*.mp4; do
  echo "== $f"; ffprobe -v error -show_entries format=duration,size:stream=codec_name,profile,width,height,r_frame_rate -of compact "$f"
  ffmpeg -hide_banner -i "$f" -af ebur128=peak=true:framelog=quiet -f null - 2>&1 | grep -E "^\s+(I|Peak):"
done
