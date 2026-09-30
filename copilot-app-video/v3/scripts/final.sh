#!/usr/bin/env bash
# Concat chunks, mux mastered audio, final encodes
set -e
cd out
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i chunks.txt -c copy video_raw.mp4
ffmpeg -hide_banner -loglevel error -y -i video_raw.mp4 -i ../audio/master.wav -map 0:v -map 1:a \
  -c:v libx264 -profile:v high -preset slow -tune grain -b:v 5500k -maxrate 8000k -bufsize 11000k -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest copilot-app-explainer-v3-1080p.mp4
ffmpeg -hide_banner -loglevel error -y -i copilot-app-explainer-v3-1080p.mp4 -vf scale=1280:720:flags=lanczos \
  -c:v libx264 -profile:v high -preset slow -b:v 1500k -maxrate 2200k -bufsize 3000k -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart copilot-app-explainer-v3-720p.mp4
ls -la *.mp4
