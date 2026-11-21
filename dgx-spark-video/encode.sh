#!/usr/bin/env bash
# Concat worker parts + final mix → 1080p master (~5.5 Mbps, grain-tuned) and 720p preview.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out
ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i render/parts.txt -c copy render/video.mkv
ffmpeg -y -hide_banner -loglevel error -i render/video.mkv -i audio/mix.wav \
  -map 0:v -map 1:a -c:v libx264 -profile:v high -level 4.1 -preset slow -tune grain \
  -b:v 5500k -maxrate 8000k -bufsize 11000k -pix_fmt yuv420p -r 30 -g 60 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart -shortest out/dgx-spark-vs-rtx5090_1080p.mp4
ffmpeg -y -hide_banner -loglevel error -i out/dgx-spark-vs-rtx5090_1080p.mp4 \
  -vf scale=1280:720:flags=lanczos -c:v libx264 -profile:v high -preset slow -b:v 1600k -maxrate 2400k -bufsize 3200k \
  -pix_fmt yuv420p -c:a aac -b:a 128k -ar 48000 -movflags +faststart out/dgx-spark-vs-rtx5090_720p.mp4
ls -la out/
