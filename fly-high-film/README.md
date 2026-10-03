# FLY HIGH with YUV.AI — code-only motion film (v2)

An 81 s film rendered entirely from code. A ballpoint doodle of Noa is drawn in a notebook (Three.js), then blooms into a
hand-illustrated, coloured sketch world (Canvas2D): she walks through a meadow, a storm of notifications piles on until
she collapses, and a blue-and-gold macaw carries her above the clouds — through the YUV.AI logo — into a calm board of
practical AI use-cases for everyone.

**v2 entry:** `film2.html` → `src/main2.js`
- `src/notebook.js` – 3D desk, notebook, pen and live ink strokes (0–7.6 s), hands off to 2D at a matched top-down camera
- `src/sketch.js` – illustration toolkit: calligraphic tapered ink, line boil, watercolour wash + grain, cel shading, paper
- `src/illus.js` – ordered draw-op renderer (doodle → colour bloom, coloured lines, iris gradients)
- `src/girl.js` – Noa, the heroine (posable: walk, cry, collapse/hug knees, wave, ride)
- `src/macaw2d.js` – feather-by-feather macaw with flap/glide/fold/perch rig
- `src/film2d.js` – the 2D director: world, storm, notification pile, flight, YUV.AI fly-through, use-case board, finale
- `src/captions.js` – Hebrew captions + end card
- `tts.py` + `vo2/` – Hebrew narration (edge-tts, see `NARRATION.he.md`)
- `cues2.mjs`, `audio2.py` – frame-synced cue export and soundtrack (score + synthesized SFX + ducked VO, −14 LUFS)

v1 (full 3D) sources remain: `index.html`, `src/main.js`, `character.js`, `macaw.js`, `world.js`, `props.js`, `text3d.js`.

## Render
```bash
npm i && python3 -m http.server 8123 &
node preview.mjs 640 360 12 preview.mp4   # fast motion preview
node render.mjs 1920 1080 out2/land       # 16:9, chunked + resumable
node render.mjs 1080 1440 out2/port       # 3:4
node cues2.mjs && python3 audio2.py       # soundtrack2.wav (needs ../fly-high-nyc/audio for music)
```
Headless Chromium + SwiftShader, deterministic `renderAt(t)` / `window.capture(t)` per frame, 30 fps.
