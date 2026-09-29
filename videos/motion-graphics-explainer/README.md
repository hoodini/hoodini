# The Motion Issue: motion graphics explainer (1080×1440, 3:4, 72s)

`motion-graphics-explainer.mp4` explains what motion graphics is, the 8 motion moves worth knowing, and how to prompt Claude Opus 5.5 / Sonnet 5.5 to make an explainer video.

- **Style:** retro magazine ("Issue Nº05"), fast beat-synced cuts. Anton for English; Assistant in bold/thin pairs for Hebrew.
- **Subtitles:** Hebrew line on top, English line below. The captions also appear as big layered type placed in front of, behind, and between the scene elements.
- **Stack:** HTML + GSAP on a paused timeline, so every frame renders the same way each time. Playwright takes a screenshot of each frame and ffmpeg encodes H.264. `soundtrack.py` generates a 120 BPM synth track with sound effects placed on every cut.

## Rebuild
```bash
pip install numpy scipy imageio-ffmpeg
python3 soundtrack.py
FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())") \
  node render.mjs video motion-graphics-explainer.mp4 soundtrack.wav
node render.mjs stills 5,20,40   # preview frames -> stills/
```
