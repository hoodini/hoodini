# FLY HIGH with YUV.AI — code-only 3D motion film

A ~70 s film rendered entirely from code (Three.js r170, no 3D assets): a ballpoint doodle comes alive, gets buried
under a storm of information overload, and is carried above the clouds by a blue-and-gold macaw.

- `src/character.js` – Lumi, the doodle character (expressions, walk, tears, squash)
- `src/macaw.js` – procedural macaw (lofted body, hooked beak, ~150 two-tone feathers, flap/fold rig)
- `src/notebook.js` – desk, notebook, pen and live ink strokes
- `src/world.js` – sky shader, meadow (85k grass blades), rain, lightning, god-rays, cloud sea
- `src/props.js` – burden objects, notification toasts, the "order" constellation
- `src/text3d.js` – extruded 3D Hebrew/Latin type from TTF outlines
- `src/captions.js`, `src/post.js`, `src/main.js` – captions, post FX, and the shot timeline
- `audio.py` – soundtrack (FLY HIGH score + synthesized, frame-synced sound design)

## Render
```bash
npm i && python3 -m http.server 8123 &
node render.mjs 1920 1080 out/land   # 16:9
node render.mjs 1080 1440 out/port   # 3:4
node cues.mjs && python3 audio.py    # needs ../fly-high-nyc/audio for music/sfx
```
Headless Chromium + SwiftShader, deterministic `renderAt(t)` per frame, 30 fps.
