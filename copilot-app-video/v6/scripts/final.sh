#!/usr/bin/env bash
# Deliverables from the HyperFrames render: re-mux the mastered mix, X spec encodes
set -e
cd out
ffmpeg -hide_banner -loglevel error -y -i render_raw.mp4 -i ../audio/master.wav -map 0:v -map 1:a \
  -c:v libx264 -profile:v high -preset slow -b:v 6000k -maxrate 8500k -bufsize 12000k -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest copilot-app-explainer-v6-1080p.mp4
ffmpeg -hide_banner -loglevel error -y -i copilot-app-explainer-v6-1080p.mp4 -vf scale=1280:720:flags=lanczos \
  -c:v libx264 -profile:v high -preset slow -b:v 1800k -maxrate 2500k -bufsize 3600k -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart copilot-app-explainer-v6-720p.mp4
ls -la copilot-app-explainer-v6-*.mp4
