#!/usr/bin/env bash
# Mux rendered video + mixed audio into the final deliverables, then verify specs.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
enc() { # in out
  ffmpeg -y -loglevel error -i "$1" -i build/tmp/mix.wav -map 0:v -map 1:a \
    -c:v libx264 -preset slow -profile:v high -b:v 5M -maxrate 7M -bufsize 10M -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest "$2"
}
enc build/tmp/h/video.mp4 out/FZ1073_YA-051_NWS_16x9.mp4
enc build/tmp/v/video.mp4 out/FZ1073_YA-051_NWS_9x16.mp4
ffmpeg -y -loglevel error -i out/FZ1073_YA-051_NWS_16x9.mp4 -vf scale=1280:720:flags=lanczos \
  -c:v libx264 -preset slow -profile:v high -b:v 2M -maxrate 3M -bufsize 4M -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ar 48000 -movflags +faststart out/FZ1073_YA-051_NWS_preview_720p.mp4
for f in out/*.mp4; do
  echo "== $f"
  ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,profile,width,height,r_frame_rate,pix_fmt,sample_rate,nb_frames -of compact "$f"
  ffmpeg -hide_banner -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
done
