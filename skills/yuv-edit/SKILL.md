---
name: "yuv-edit"
description: "Yuval's video editor: his real footage (talking head, screen recordings, screenshots, or a mix) edited into a finished YUV.AI film. The edit is built as a yuv-motion kit film: 60 fps with motion blur, the footage as a plate inside seek(t), transitions that change shape, B-roll drawn in code that explains what he says, kit kinetic captions, Mixkit music and SFX on the beat, cuts snapped to silence, text behind the subject, CTA and a signature end card. Use for: edit my video, ערוך לי את הסרטון, עריכת וידאו, תערוך, ריל מהצילום, סרטון יוטיוב, b-roll, כתוביות, jump cuts, screen recording demo, make this video pop. Not for films made purely from code (yuv-motion) or AI-generated footage (flux3-video)."
---

# YUV.AI Edit: his footage, cut as a motion film

Yuval hands over footage. You deliver one MP4 per format (16:9, and a 9:16 if asked), plus a short edit note: what you cut, why, and what to shoot differently next time.

**The edit IS a `yuv-motion` film.** Do not build a separate graphics layer next to it. The footage becomes a **plate** drawn inside the kit's `seek(t)`. Everything else is kit motion on the same clock:
- the screen stage and the morphs between screen and face;
- the B-roll and the titles;
- the captions;
- the CTA and the end card.

That gives 60 fps with 6-subframe motion blur, shared-element transitions, Phoenix Ink type and the kit's edit layer (impulse punches, flashes, kinetic captions, progress bar) for free.

**Read `yuv-motion` and the kit README before you start.** The kit is `github.com/hoodini/motion-in-code/tree/main/kit`; clone it with `add_repo` and run `npm i`. Brand comes only from `yuv-design-system` (Phoenix Ink).

**Story beats effects** (`references/playbook.md`). The winners won on a sharp promise, a thesis-first opening and chapters that argue. Polish multiplies a story; it does not rescue one. The story pass comes before any pixel.

## What Yuval rejected in v1 — never again

| He said | The rule now |
|---|---|
| "Cuts in the wrong places" | **Every cut snaps to measured silence** (`snapcuts.py`). Ranges closer than 0.25 s merge: a 0.1 s micro-cut inside a breath is a stutter. A boundary still flagged after snapping is fixed by hand, never shipped. |
| "No captions" | **Kit kinetic captions always.** 2–4 words, each word pops as it is spoken, the spoken word is gold. The screen stage leaves a caption band free. |
| "Titles appear in illogical places" | **No title floats over footage.** A headline lives in a layout made for it: a full B-roll scene, a **split** (the plate becomes a card on the left, the headline owns the right), a chapter spread, or text behind the subject. It slams in on the spoken word. |
| "No B-roll" | **Every named thing is shown.** When there is no footage of it, draw it in code with the kit: the UI he describes, the feature working, a comparison, a counter. A screenshot of a real page is B-roll too. |
| "No Mixkit audio like the motion skill" | **Mixkit music + Mixkit SFX** (`mixkit.py`), beat grid by `beats.py`, SFX placed by their measured peak, ducked under the voice, mixed to −14 LUFS. Mixkit is reachable from the cloud shell (verified Oct 2026). |
| "Word-by-word captions are distracting" (v2) | **Calm phrase captions.** The whole phrase (≤ 7 words / ~40 chars, broken at meaning, never between "Claude" and "Code") appears at once with one 0.18 s rise and stays still. No per-word pops, no per-word colour. Claude writes the phrases by hand (`captions_edit.json`: word-index ranges + corrected text: product names, commands, misheard words). |
| "It ends on me looking sideways" (v2) | **Pick the closing frame by eye.** Make a grid of the last seconds and choose a frame looking into the lens. The avatar and any freeze use that frame, never simply the last one. |
| "The branding is always dark; I love it lighter" (v2) | **Light is the default stage.** `paperSky` (white → cloud with soft pink / violet / orange glows), ink headlines with the gold marker, pink-tinted shadows. Terminals and code stay dark cards on it. Night only when he asks or the topic is night. |
| "I loved the glow around the circle, I want more" (v2) | **The glow ring is a signature, not a one-off.** `softRing` (conic glow stops as stacked strokes: cheap at 6 subframes) goes around the screen panel, split cards, hero B-roll cards, code chips, the lower third, the MODS-style hero chip, the CTA and the avatar, pulsing softly on the beat. Never on body text or small chips. |
| "No feeling of 60 fps animation" | **60 fps, 6 subframes, springs everywhere.** Plates morph panel↔full frame. Screen jump cuts push. Face jump cuts punch (1.0/1.12 + an impulse). Scenes grow out of the panel and contract back. Never a fade. |

## 0. Intake

1. Run `ffprobe` on every file and make a timestamped contact sheet (`fps=1/3 … tile=10x6`). Look at the sheets.
2. **Map the picture:**
   - Separate screen and face by measuring colourfulness per second (saturation > 45 = face). This gives the `face` ranges.
   - Detect burned-in graphics (an old name tag, a PIP) and note where and when they appear.
3. Ask, in one message, only what you cannot infer: **the one action** to drive, and the platforms.
4. Work folder:

   ```
   raw/  build/  v2/{frames,mattes,music,sfx}
   pip install -r requirements.txt
   ```

## 1. Transcribe

```
python3 scripts/transcribe.py raw/talk.mp4 build --lang he      # Scribe if ELEVENLABS_API_KEY, else faster-whisper large-v3
```

Read all of `transcript.md`; `words.json` has every word's time.

## 2. Story pass → `edit.json`

Write `build/edit_plan.md` with these four things:
- **the promise**;
- **the cold open**: the strongest line first;
- **the chapter arc**: an argument, not a spec list;
- **every cut, each with its reason**: fillers, restarts, narrating instead of showing, tangents (a tangent is a separate Short).

Then put every decision in one `edit.json` (example: `references/example-claude-mods/edit.json`):
- `keep`: source ranges of speech to keep. Leave padding to `snapcuts.py`.
- `face`: on-camera source ranges. The rest is screen.
- `zooms`: `[source_t, [x,y,w,h] | null]` for the screen stage. **Check a frame at every zoom time**, because the old edit may have panned.
- `anchors`: a name for every spoken word that triggers motion, e.g. `"toast": 61.2`. All motion and sound hang on these names.
- `behind`: source ranges that get text behind the subject (≤ 1 per 2 min).
- `punch`: face jump-cut levels, plus overrides (e.g. a top-anchored 1.45 that crops a burned-in name tag).
- `music`, `sfx`: Mixkit files, peaks, and events as `[file, anchor, offset, gain]`.

## 3. Cuts, data, frames, mattes

```
python3 scripts/film/snapcuts.py edit.json        # -> keep_snapped.json; fix every FLAG line by hand
python3 scripts/film/build_data.py edit.json      # -> data.json: plates, captions, zooms, anchors in OUTPUT time, beat grid
# frames for the kept ranges (30 fps source; file N = source time N/30)
ffmpeg -ss <a> -i raw/talk.mp4 -frames:v <n> -q:v 3 -start_number <N0> frames/%06d.jpg    # per kept range
# person mattes for the behind ranges (rembg u2net_human_seg -> RGBA PNG, alpha = person)
```

Check the cut report: every boundary should be ≥ 15 dB under the speech median.

**Captions:**
- Dump the output-timed words with indices.
- Write `captions_edit.json` by hand as `[first_word, last_word, "corrected phrase"]`, tiling every word once, in order (example in `references/example-claude-mods/`).
- Run `scripts/film/captions.py dump` to list the words, then `captions.py apply captions_edit.json` to merge the phrases into `data.json`. Words are counted by their start time, because Whisper stretches ends over pauses.

## 4. The film (`kit/films/<slug>/film.js`)

Start from `references/example-claude-mods/film.js`. It is a complete, rendered, approved-direction example.

### Plates
- `plate(x,t)` draws the source frame of the current plate inside a rect.
- **Screen:**
  - the rect is the PANEL (1575×886, r 40, on `paperSky`, with the glow ring, leaving the caption band free);
  - the camera inside it follows `zooms` with critically damped springs, size in log space.
- **Face:** the rect is FULL, with the plate's punch and anchor.
- **Screen ↔ face:** the rect springs from one home to the other. That is the transition; no extra effect.
- **Screen → screen jump cut:** PUSH. The old frame leaves to the right and the new one arrives from the left (RTL), over 0.32 s.
- **Face → face jump cut:** the punch alternates, plus a camera impulse.
- **Splits:** the plate rect springs to a card on the left while the headline slams on the right.
- **The end:** the plate becomes a round avatar with the glow ring.

### B-roll scenes
`scene(x,t,a,b,seed,fn)` grows a full-frame scene out of the panel and contracts it back.

**One scene per idea he explains, built from what he says:**
- the UI he describes, drawn in code (status lines, panes, toasts, chips);
- before/after;
- A vs B;
- a counter, with "דוגמה" when the numbers are illustrative;
- cards bursting (an idea spreading);
- a chapter spread with a folio numeral.

Components come from the kit: `card`, `slamWords`, `popType`, `neonRing`, `nightSky`, `markerPaint`, `rr`.

### Text over the plate
- **Code chips:** a command typed in JetBrains Mono on night glass, while he says it.
- **Lower third:** once, at his first full-frame appearance.
- **CTA:** pink, with the glow ring, after the payoff, and never on his face.

### Text behind the subject
headline → person matte composited back on top (`subjectOver`). Big type, his head covering 20–40% of a non-marker word.

### Edit layer
- `camAt` impulses on cuts and scene entrances;
- `flash` on chapter downbeats;
- kit `captions`;
- RTL `progress` bar.

### Footage loading
`window.prepare(t)` decodes the frames the subframes will touch before each frame. `seek` stays pure.

## 5. Stills gate (mandatory) → render

```
node build.mjs <slug>                                                  # in kit/
node scripts/film/render_edit.cjs film.html stills 0.5,2.9,…  stills/   # one still per event; LOOK at the sheet
for i in 0 1 2 3; do node scripts/film/render_edit.cjs film.html frames $((N*i/4)) $((N*(i+1)/4)) part$i.mp4 6 & done
ffmpeg -f concat -safe 0 -i parts.txt -c copy build/picture.mp4
python3 scripts/film/build_audio.py edit.json && python3 scripts/mix.py audio_edl.json build out.mp4 --picture build/picture.mp4
python3 kit/render/pops_mp4.py out.mp4        # 0 single-frame pops
```

Speed and environment:
- About 2.4 fps per worker in the cloud. 4 workers render a 2.5-minute film in about 22 minutes.
- Use Yuval's PC GPU when it is connected (yuv-motion §4).
- Use the preinstalled Playwright, not the kit's `node_modules` copy, in the cloud.

**Gate failures** — fix before rendering:
- a title over the plate outside a split;
- text on his face;
- white text on a white UI;
- a cut that isn't in silence;
- an empty frame, including a source index past the file end;
- a CTA covering the face;
- a burned-in old graphic left visible;
- anything grey or washed out;
- RTL errors.

**Verify the MP4:**
- 60 fps and frames = ceil(DUR·60);
- −14 ±0.5 LUFS;
- no pops;
- a 16-frame contact sheet of the real file, which you look at.

## 6. Deliver

- **The MP4:** re-encode at CRF 22, maxrate 1.45 M, 60 fps, to fit the 30 MiB chat cap. Keep the master.
- **The edit note:** what was cut and why, and how the music was chosen (by BPM, length and energy, since you cannot listen; he decides).
- **Next time:** what to shoot differently. Typical asks:
  - separate screen and camera files;
  - 1440p+ screen recording;
  - the hook on camera.
- **Offers:** a 9:16 version and title/thumbnail variants.

## Quick mode (only if he asks for fast and simple)

`scripts/compose.py` + `scripts/gfx/` + `mix.py` + `export_fcpxml.py` is the v1 pipeline:
- 30 fps;
- graphics over footage;
- an FCPXML timeline for Resolve.

It is fine for a rough cut or a Resolve hand-off. It is **not** the YUV.AI look, and it was rejected as a finished edit.

## References
- `references/playbook.md`: the research and evidence (pacing, hooks, CTAs, sound, rights).
- `references/formats.md`: recipes for talking head, reels, screen demos, screenshots and product reviews.
- `references/example-claude-mods/`: the full worked example (`edit.json` + `film.js`).
- `references/edl-schema.md`: the quick-mode EDL.
