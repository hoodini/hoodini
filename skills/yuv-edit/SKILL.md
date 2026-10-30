---
name: "yuv-edit"
description: "Yuval's video editor: his real footage (talking head, screen recordings, screenshots, or a mix) edited into a finished YUV.AI film. The edit is built as a yuv-motion kit film: 60 fps with motion blur, the footage as a plate inside seek(t), transitions that change shape, B-roll drawn in code that explains what he says, calm phrase captions, a light Phoenix Ink stage with the signature glow ring, Mixkit music and SFX on the beat, cuts snapped to silence, text behind the subject, CTA and a glowing avatar end card. Use for: edit my video, ערוך לי את הסרטון, עריכת וידאו, תערוך, ריל מהצילום, סרטון יוטיוב, b-roll, כתוביות, jump cuts, screen recording demo, make this video pop. Not for films made purely from code (yuv-motion) or AI-generated footage (flux3-video)."
---

# YUV.AI Edit: his footage, cut as a motion film

Yuval hands over footage. You deliver one MP4 per format (16:9, and a 9:16 if asked), plus a short edit note: what you cut, why, and what to shoot differently next time.

**The edit IS a `yuv-motion` film.** Do not build a separate graphics layer next to it. The footage becomes a **plate** drawn inside the kit's `seek(t)`. Everything else is kit motion on the same clock:
- the screen stage and the morphs between screen and face;
- the B-roll and the titles;
- the captions;
- the CTA and the end card.

That gives 60 fps with 6-subframe motion blur, shared-element transitions, Phoenix Ink type and the kit's edit layer (impulse punches, flashes, progress bar) for free.

## Yuval's taste for edits (stated while editing, Oct 2026)

These override generic defaults, and override `yuv-design-system` §6 where it says Night is the default for video. Until that master is updated, this list wins for edits.
- **Light, not dark.** A bright Paper/Cloud stage with soft pink glows. "I love it lighter."
- **The glow ring is his signature.** "Stunning, I want more of it": around the plates, hero cards, chips, the CTA and the avatar.
- **Calm and readable.** Nothing that jumps word by word. Text he can read at a glance, in correct Hebrew, with product names spelled right.
- **Eye contact.** Never end or freeze on him looking away.
- **Built on his own tools.** Use his kit and skills (`yuv-motion`, `yuv-design-system`), never a parallel system. "Did you even take the motion skill into account?"

**Read `yuv-motion` and the kit README before you start.** The kit is `github.com/hoodini/motion-in-code/tree/main/kit`; clone it with `add_repo` and run `npm i`. Brand comes only from `yuv-design-system` (Phoenix Ink).

**Story beats effects** (`references/playbook.md`). The winners won on a sharp promise, a thesis-first opening and chapters that argue. Polish multiplies a story; it does not rescue one. The story pass comes before any pixel.

## What Yuval rejected (v1 and v2) — never again

| He said | The rule now |
|---|---|
| "Cuts in the wrong places" | **Every cut snaps to measured silence** (`snapcuts.py`). Ranges closer than 0.25 s merge: a 0.1 s micro-cut inside a breath is a stutter. A boundary still flagged after snapping is fixed by hand, never shipped. |
| "No captions" | **Captions always**, as calm phrases (the v2 row below). The screen stage leaves a caption band free: ink on the light stage, white with a night stroke over full-frame footage. |
| "Titles appear in illogical places" | **No title floats over footage.** A headline lives in a layout made for it: a full B-roll scene, a **split** (the plate becomes a card on the left, the headline owns the right), a chapter spread, or text behind the subject. It slams in on the spoken word. |
| "No B-roll" | **Every named thing is shown.** When there is no footage of it, draw it in code with the kit: the UI he describes, the feature working, a comparison, a counter. A screenshot of a real page is B-roll too. |
| "No Mixkit audio like the motion skill" | **Mixkit music + Mixkit SFX** (`mixkit.py`), beat grid by `beats.py`, SFX placed by their measured peak, ducked under the voice, mixed to −14 LUFS. Mixkit is reachable from the cloud shell (verified Oct 2026). |
| "Word-by-word captions are distracting" (v2) | **Calm phrase captions.** The whole phrase (≤ 7 words / ~40 chars, broken at meaning, never between "Claude" and "Code") appears at once with one 0.18 s rise and stays still. No per-word pops, no per-word colour. Claude writes the phrases by hand (`captions_edit.json`: word-index ranges + corrected text: product names, commands, misheard words). |
| "It ends on me looking sideways" (v2) | **Pick the closing frame by eye.** Make a grid of the last seconds and choose a frame looking into the lens. The avatar and any freeze use that frame, never simply the last one. |
| "The branding is always dark; I love it lighter" (v2) | **Light is the default stage.** `paperSky` (white → cloud with soft pink / violet / orange glows), ink headlines with the gold marker, pink-tinted shadows. Terminals and code stay dark cards on it. Night only when he asks or the topic is night. |
| "I loved the glow around the circle, I want more" (v2) | **The glow ring is a signature, not a one-off.** `softRing` (conic glow stops as stacked strokes: cheap at 6 subframes) goes around the screen panel, split cards, hero B-roll cards, code chips, the lower third, the MODS-style hero chip, the CTA and the avatar, pulsing softly on the beat. Never on body text or small chips. |
| "I didn't understand what a mod is, it jumps straight to Live pane, the demo is visually bad" (v3) | **A question is followed by its answer.** If the source answers later, **reorder the story** (`keep` is in story order, not source order): question → definition → examples. **A demo shows one thing at a time:** the concept first (A vs B, e.g. plugin = tools going out, mod = Claude's own look), then each example alone, big, in a spotlight (the rest dimmed, the glow ring on the active part, a large label naming it). Never four small elements at once. Before the stills gate, ask: would a viewer who knows nothing understand it from the screen alone? |
| "Why don't you take real B-roll from the web?" (v4) | **Real B-roll first, code second.** Two legal sources, both checked as reachable: (1) **live captures of the actual pages he talks about** — the changelog, the pricing page, the docs (`capture_web.cjs` → full-page PNG + DOM rects; the film's `browserCard` scrolls and zooms it at 60 fps and spotlights the real element with a label); (2) **licensed stock footage** from Mixkit (`mixkit.py video <tag>`, choose from the contact sheet by eye), e.g. Shabbat candles behind the zmanim. Never rip YouTube or random sites: it is blocked, and it is someone else's copyright. A short capture of a public page under commentary is the norm; say in the edit note which pages and clips were used. Code-drawn scenes are for what has no real image (a concept, a comparison, a mock of the result). |
| "No Z-axis scroll at all, even though the skill says 3D tilt" (v5) | **Every page, screenshot and screen recording moves in real 3D.** Not a flat card with a scale: a WebGL perspective quad (`persp.js`, focal 1500) with depth of field that softens the far edge. Browser cards enter turned and far (rotY ≈ ±22°, rotX ≈ 13°, push 1.45), settle (±12°, 1.15), turn to face the camera on the highlight (≈ ±5°, 1.05) while the page scrolls inside, then swing to the other side; alternate the side from card to card. The highlighted element **lifts off the page in Z** (its own layer, +70 px toward the camera, ×1.05, with a shadow, the glow ring and the label). The screen panel tilts ±8° / 5° (push 1.16, so it never leaves the frame) while the camera zooms in, and goes flat again on zoom-out. The shadow and glow follow the projected corners. A stills gate must show the tilt before any render. |
| "Why all the empty space around it? It shrinks the video" (v6) | **Content fills the frame.** The screen panel is 1816×1022 (≈95% of the frame, 28 px radius), never a small card on a big background; the 3D tilt on it stays at push ≈ 1.0 so it does not shrink. Scene content is drawn 1.1× (`scene(..., {fill})`), browser cards 1680×850 settling at push ≈ 0.95. The light stage shows as a thin frame and around entering cards only. Captions over the screen are white with a stroke. In the stills gate, check: does anything important sit in less than ~80% of the frame width? |
| "Compared with YouTubers: fewer keyframes, less real B-roll with 3D tilt and highlights, less atmosphere, weaker motion-graphic overlays" (v7) | **Density audit before building.** Make a contact sheet every 2 s of the current cut and mark every stretch over ~3 s where the picture does not change meaningfully (a raw screen with no zoom, a face with no insert, a static card). Each one gets one of: (1) a **real page in 3D** for anything named (docs, a product page, a download page, a pricing page; `capture_web.cjs` + DOM rects, a `browserCard` with tilt keys, scroll and a lifted highlight); (2) a **licensed atmosphere shot** (Mixkit `video`) for abstract lines ("Claude updates it by itself", "you can change other things too"), full-bleed with push + drift and kinetic chips on top; (3) **a motion-graphic overlay that visualises a number or a list** said or shown (count-up stat cards with the glow ring, a bar chart that grows, floating chips of the options); (4) **more zoom keyframes** on long screen stretches (each zoom also tilts). Target: no static stretch over ~3–4 s, a real page or stock shot every ~15–20 s. Every new insert gets its whoosh/pop. |
| "In the plugin-authoring part I talk but you can't see me, something covers me, and the screen is unclear" (v8) | **Never cover the speaker.** A screen recording with his webcam in a corner: chips and overlays stay clear of that corner (check the source frame, not only the film). **A zoom that shows half-sentences is not clear:** when the screen holds the point (a description, a setting), rebuild it as a scene: crop the real lines from the live source frame into a card, tilt it in 3D, lift the key line toward the camera with a label ("Make a mod = יוצרים מוד"), and put his face from the webcam corner in the glowing circle beside it, so he is always seen while he talks. |
| "At the end my face is too low, in full frame and in the final circle" (v8) | **Frame the face by eye, every face plate.** Eyes on the upper third, headroom small. If the source sits low, tighten the crop and anchor it lower (`faceCrop`: punch ≈ 1.28, anchor y = 1); the end-card circle uses the same crop so the face is centred in the ring. Check the face plates in the stills gate like any graphic. |
| "The glow on the Hebrew date is in the wrong place" (v8) | **Measure, never hard-code, the position of a ring or highlight.** Take it from the element itself (the right edge the layout returns + the measured text width), so it stays on target when sizes, fonts or the fill scale change. |
| "Also need a 9:16 version" (v8) | **9:16 is the same film, re-framed (`?L=v`, `LAYOUT=v` for `render_edit.cjs`).** `drawV` draws the 16:9 frame (no captions) into an offscreen canvas and composes the phone frame: face shots with no scene or split title **fill the vertical frame** (a 608-px-wide crop of the face, untightened); everything else plays as a glowing full-width 16:9 card under a brand header (YUV.AI + topic). The two morph into each other (spring), face stretches under 0.8 s stay as a card. Captions are re-set for the phone (66 px, wrapped, above the bottom UI zone); things that lived at the sides of the 16:9 face frame (lower third, CTA) are re-placed centred. Scenes register their windows in `scene()`, which is how `drawV` knows when the face is free. Render it with 4 subframes to keep the time sane. |
| Self-review of the v9 9:16 (before he saw it) | **A 16:9 card on a phone leaves ~40% of the frame empty: never ship that.** Card mode is the Shorts stack: brand header on top, the card (y≈330), captions under it (y≈1010), and **the speaker in a big glow circle at the bottom** (`vFace`): on screen-recording plates crop the webcam corner of the recording (measure its rect per plate, it moves sides), on face plates crop the face itself. Fade the circle out when the frame morphs to full-face and at the end card (which has its own circle; centre the card there). Check a contact sheet of the 9:16 *before* the full render, not after. |
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
- **the chapter arc**: an argument, not a spec list. Check every question he asks on camera: where is its answer? If it comes later in the source, move it right after the question;
- **every cut, each with its reason**: fillers, restarts, narrating instead of showing, tangents (a tangent is a separate Short).

Then put every decision in one `edit.json` (example: `references/example-claude-mods/edit.json`):
- `keep`: source ranges of speech to keep, **in story order**, which may differ from source order. Leave padding to `snapcuts.py`. Plate and word times are computed cumulatively in story order: a boundary time belongs to two ranges, so never look it up.
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

**One scene per idea he explains, built from what he says. Clarity first:** a concept before its examples; one element at a time; big labels; spotlight plus glow on the active part; the rest dimmed. A shared element can carry the eye from the concept to the examples, as in the example's `lab()`, where the mod window grows into the examples window.
- the UI he describes, drawn in code (status lines, panes, toasts, chips);
- before/after;
- A vs B;
- a counter, with "דוגמה" when the numbers are illustrative;
- cards bursting (an idea spreading);
- a chapter spread with a folio numeral.

Components come from the kit (`card`, `slamWords`, `popType`, `neonRing`, `markerPaint`, `rr`) and the example (`paperSky`, `softRing`, `terminal`, `statusBar`, `goldChip`, `chip`, `codeChip`). Terminals and code chips stay dark cards on the light stage, with the glow ring.

### Real B-roll
- **Web pages:** `browserCard(x,t,a,b,page,url,keys,highlights,tilt)` is a white browser card with the URL pill and the glow ring, drawn flat into its own canvas and then put in 3D with `drawPersp` (`references/example-claude-mods/persp.js`).
  - `tilt` are `[t, rotY°, rotX°, push]` spring keys (push 1 = card at full size, >1 farther).
  - `keys` are `[t, scrollY, zoom, focusX]` in source px.
  - `highlights` are `[t0, t1, rect, label]`. The spotlight dims everything but the rect.
  - **Check every rect on a crop of the PNG.** The pricing page's "API" regex matched the nav instead of the tab.
- **Stock footage:** extract frames (`fps=30, scale=1920:1080`), load them in `prepare()` like the plates, and draw them full-bleed with a slow push under the scene's card. Captions turn white over dark footage.
- **Spotlights:** build the hole with `x.rect(...)` + `x.roundRect(...)` + `fill('evenodd')`. The kit's `rr()` calls `beginPath()` and silently inverts the spotlight: the active part goes dark and the rest stays bright.

### Text over the plate
- **Code chips:** a command typed in JetBrains Mono on night glass, while he says it.
- **Lower third:** once, at his first full-frame appearance.
- **CTA:** pink, with the glow ring, after the payoff, and never on his face.

### Text behind the subject
headline → person matte composited back on top (`subjectOver`). Big type, his head covering 20–40% of a non-marker word.

### Edit layer
- `camAt` impulses on cuts and scene entrances;
- `flash` on chapter downbeats;
- calm phrase `captions`;
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

**A fix after the full render:** re-render only the frames around the fix and splice them in. That takes minutes, not 22:

```
node scripts/film/render_edit.cjs film.html frames <f0> <f1> patch.mp4 6
E="-c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -an"
ffmpeg -i build/picture.mp4 -frames:v <f0> $E segA.mp4 && ffmpeg -ss <f1/60> -i build/picture.mp4 $E segC.mp4
printf "file 'segA.mp4'\nfile 'patch.mp4'\nfile 'segC.mp4'\n" > fix.txt && ffmpeg -f concat -safe 0 -i fix.txt -c copy build/picture_fixed.mp4
```

**Time budget (measured, Oct 2026, 4-core cloud box):** with 3D cards, stock and WebGL, a full 146 s render runs ~0.1–0.4 fps per worker, i.e. 1.5–4 hours. So: one full render per version at most; every later round re-renders **only the changed ranges** (each scene's window + 0.6 s for its exit) and splices them into the previous picture, cutting kept segments frame-exact with `trim=start_frame=..:end_frame=..,setpts=PTS-STARTPTS`. More workers than cores make it slower, not faster. Tell Yuval the expected time up front.

Use matching encoder settings so the concat is lossless. Never use one input twice in a filter graph: it buffers the whole film and gets killed.

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
- RTL errors;
- a caption phrase broken between words that belong together, or a misspelled product name or command;
- a closing frame or avatar where he is not looking into the lens;
- the glow ring on body text or on small chips.

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

## How to work with him (lessons from the first edit)

1. **Look before you send.** Each round, the stills gate caught real problems before he saw them:
   - white on white;
   - an empty avatar;
   - a CTA on his mouth;
   - an old burned-in name tag.

   Never deliver a render you have not looked at.
2. **Measure, don't assume.** Check the cut loudness, whether a host is reachable (Mixkit is), and whether the source frame exists. The v1 cuts sounded wrong because they were never measured.
3. **Iterate on stills, render once.** A stills sheet takes about a minute; a full render takes about 22. Settle every visual question on stills.
4. **Be honest about what you can't check.** You cannot hear: say how the music was chosen, and name the one cut that could not reach silence.
5. **Every complaint becomes a rule in this file the same day**, so the next edit starts where this one ended.
6. **The editorial pass is yours.** Phrasing captions, correcting the transcript and choosing frames by eye are editor work, not script output.

## Quick mode (only if he asks for fast and simple)

`scripts/compose.py` + `scripts/gfx/` + `mix.py` + `export_fcpxml.py` is the v1 pipeline:
- 30 fps;
- graphics over footage;
- an FCPXML timeline for Resolve.

It is fine for a rough cut or a Resolve hand-off. It is **not** the YUV.AI look, and it was rejected as a finished edit.

## References
- `references/playbook.md`: the research and evidence (pacing, hooks, CTAs, sound, rights).
- `references/formats.md`: recipes for talking head, reels, screen demos, screenshots and product reviews.
- `references/example-claude-mods/`: the full worked example: `edit.json` (story-ordered `keep`), `captions_src.json` (hand-written phrases by source time) and `film.js` (`lab()` = concept → examples).
- `references/edl-schema.md`: the quick-mode EDL.
