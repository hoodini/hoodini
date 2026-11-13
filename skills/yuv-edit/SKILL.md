---
name: "yuv-edit"
description: "Yuval's video editor: his real footage (talking head, screen recordings, screenshots, or a mix) edited into a finished YUV.AI film. The edit is built as a yuv-motion kit film: 60 fps with motion blur, the footage as a plate inside seek(t), transitions that change shape, B-roll drawn in code that explains what he says, calm phrase captions, the Neon Studio stage from yuv-design-system (v5) with the signature glow ring, his OBS recordings (camera + screen with a baked-in picture-in-picture) on the stage3d engine, Mixkit music and SFX on the beat, cuts snapped to silence, text behind the subject, CTA and a glowing avatar end card. Use for: edit my video, ערוך לי את הסרטון, עריכת וידאו, תערוך, ריל מהצילום, סרטון יוטיוב, b-roll, כתוביות, jump cuts, screen recording demo, make this video pop. Not for films made purely from code (yuv-motion) or AI-generated footage (flux3-video)."
---

# YUV.AI Edit: his footage, cut as a motion film

Yuval hands over footage. You deliver one MP4 per format (16:9, and a 9:16 if asked), plus a short edit note: what you cut, why, and what to shoot differently next time.

**The edit IS a `yuv-motion` film.** Do not build a separate graphics layer next to it. The footage becomes a **plate** drawn inside the kit's `seek(t)`. Everything else is kit motion on the same clock:
- the screen stage and the morphs between screen and face;
- the B-roll and the titles;
- the captions;
- the CTA and the end card.

That gives 60 fps with 6-subframe motion blur, shared-element transitions, Neon Studio type and the kit's edit layer (impulse punches, flashes, progress bar) for free.

## Yuval's taste for edits (stated while editing, Oct 2026)

**Superseded in part on 11.11.2026.** `yuv-design-system` moved to **Neon Studio (v5)**, and Yuval asked for it in everything he makes, videos included: a near-black studio stage with violet / blue washes, cyan light and a touch of magenta. Colours, type, logos and motion rules come from there (`tokens/neon-studio.css`), never from this file. The "light, not dark" line below is retired; the rest still holds.
- ~~**Light, not dark.**~~ Retired by Neon Studio (v5). It was: a bright Paper/Cloud stage with soft pink glows.
- **The glow ring is his signature.** "Stunning, I want more of it": around the plates, hero cards, chips, the CTA and the avatar.
- **Calm and readable.** Nothing that jumps word by word. Text he can read at a glance, in correct Hebrew, with product names spelled right.
- **Eye contact.** Never end or freeze on him looking away.
- **Built on his own tools.** Use his kit and skills (`yuv-motion`, `yuv-design-system`), never a parallel system. "Did you even take the motion skill into account?"

**Read `yuv-motion` and the kit README before you start.** The kit is `github.com/hoodini/motion-in-code/tree/main/kit`; clone it with `add_repo` and run `npm i`. Brand comes only from `yuv-design-system`: Neon Studio (v5) since 11.11.2026. Phoenix Ink, Phoenix Sky and the light Paper stage are retired.

## Yuval's motion-density contract (EP18, 2.11.2026: he has asked for this many times)

A clean, restrained edit is a **failure** for him. EP18 ("לא לרצות") went out with ~60% of the runtime as a flat screen recording plus PIP and only ~6 three.js moments, and he sent it back. Restraint applies to story and readability, never to how much motion design there is. Every edit, in every format:
1. **three.js on screen ≥ 60% of the runtime (aim for 80%+).** Screen recordings and the camera are 3D cards in a three.js scene: each card tilts and moves (a new pose every 3.5–6.5 s on caption starts, spring glides, slow drift), with a rounded-rect shader, a neon rim and a soft shadow. Logo coins and props float around the cards and behind him, relevant to what is said.
2. **3D tilt on every overlay** (panels, chips, cards swing in with perspective), except overlays that must line up with burned-in content.
3. **Screen recordings follow the action:** a frame-difference pass finds where the screen changes; the 3D camera zooms (≤ ~1.7×) and pans there, with HUD brackets and a mono label. When he points at something, override the shot.
4. **Real B-roll every ~20–30 s of camera time**, 2–5 s each, as 3D cards: scroll captures of every product, site and repo he names; licensed stock graded to the palette.
5. **Launch footage for any product in the news** (official films and press photos, credited, under commentary that reviews or compares; never in a sponsored promo).
6. **Motion graphics on every beat:** chips, panels, counters, stamps, text behind and in front of him, a fact-check card when a claim on screen is outdated.
7. **Hard numbers, checked before rendering** (coverage audit): 3D/tilt ≥ 60% and overlays ≥ 75% of the runtime; 3D or B-roll on ≥ 75% of camera time; no camera stretch over 3 s with captions only; nothing unchanged for more than ~6 s. If the audit fails, add material; do not render.
8. **Show early:** stills from every format, then the first 60–80 s of the real render.

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
| "The branding is always dark; I love it lighter" (v2) | **Superseded on 11.11.2026 by Neon Studio (v5): the stage is near-black with violet / blue light for everything, videos included; take it from `yuv-design-system`.** The v2 rule was: **Light is the default stage.** `paperSky` (white → cloud with soft pink / violet / orange glows), ink headlines with the gold marker, pink-tinted shadows. Terminals and code stay dark cards on it. Night only when he asks or the topic is night. |
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
| Self-review of the Tanya edit (v10, Nov 2026: a lecture by Rabbi Yoram Abergel zt"l, not Yuval) | **When the speaker is not Yuval, the film is about him.** The lower third, the end-card avatar and the closing name are the speaker's; no "יובל אבידני" signature (YUV.AI stays as a small credit). Keep the source's own watermark and credit it in the end card and the edit note: never crop out someone else's attribution. **Torah content uses Bona Nova SC** for headlines and captions (`FT.torah`), and the edit layer is calmer: small zoom impulses only, no shakes, no white flashes. **A single talking-head camera needs scenes for variety:** real pages of every person and book named (Wikipedia, Sefaria) in 3D, licensed stock for every image in the words (a road, a garden, a river for a verse), A-vs-B cards for a comparison, splits for the key lines. **Behind-the-subject text must sit on empty background:** check the matte on a still; the whole body hides text, not only the head, so it goes in the free wall area above the shoulder, at a size where the head covers 20–40% of the non-marker word. **Headlines auto-fit their layout** (a split headline ran under the plate card). **9:16 face shots need a tracked face x, not one number per plate:** the phone crop is only 608 px of a 1920 frame, so a 100 px error puts the face at the edge. When Haar fails (beard, glasses), track a reliable dark or bright blob (here his black hat, every 0.2 s), smooth it over ~2 s, and map it through the 16:9 crop (`(faceX − sx) · punch`). **Side-placed 16:9 chips must not draw into the 9:16 inner frame** (`if (V_INNER) return`): they leak into the face crop, cut at the edge, next to their re-placed copy. |
| "Why doesn't it look like the motion graphics I love? Where are the official logos, the beautiful overlays, the 3D?" (v11, GitHub Universe edit, 1.11.2026) | **The edit is a launch film wrapped around his footage, not footage with chips on it.** v1 of that edit had flat 2D cards and text chips ("Cloudflare", "Opus 5.5" as words): rejected. Every edit now ships **the YouTuber layer** (section below): three.js hero scenes (one per act, not one per film), **official logos for every product, model and connector named** (Simple Icons, never a name typed in a pill), callouts on the real UI of the recording, real pages in 3D on stock B-roll, editorial furniture, and the golden-prompt rules (night pages for chapters and the end card, captions in a night pill, the music drop on the cut out of the hook). **Read `GOLDEN_PROMPT-explainer-film.md` before any edit** (on his PC: `C:\Users\User\Documents\yuv-projects\` and `Downloads\`). A memory note pointing to it was skipped in v1 and it cost a full round. |
| Self-review plus three independent review rounds of the sponsored "Claude Fable 5.2 + Higgsfield MCP" tutorial (v12, 12–13.11.2026: a 2-hour OBS recording cut to 14:15) | **Frame-level defects only show up in frame-level checks.** Stills every few seconds found none of these: a mini screenshot inside the camera card for 1–2 frames at three screen→camera switches (OBS switches 1–2 frames after the boundary a classifier finds); a framing snap as a card flew in; a 3-frame HUD flash; single black frames from a FIFO texture cache; a privacy blur baked into a camera frame; a black notch in a frame corner at the 1.12 punch-in. Run the frame tools on every final (section "OBS recordings: the stage3d engine") and an **independent review by subagents on every final**: three visual reviewers on thirds of the film, one auditor of the texts against the brief, one checker of the files, each new round given the list of fixes to confirm. **Sponsored videos: read the brief against the raw footage on day one** and tell him at once what editing cannot fix (here: another brand's website as the reference, no sign-up and no trial shown, the required CTA never said aloud), before the edit, not in the delivery note. Put the brief's exact wording on screen (a disclosure chip from the first seconds; the CTA sentence on the end card for 10 s) and in the description. |
| "No feeling of 60 fps animation" | **60 fps, 6 subframes, springs everywhere.** Plates morph panel↔full frame. Screen jump cuts push. Face jump cuts punch (1.0/1.12 + an impulse). Scenes grow out of the panel and contract back. Never a fade. |

## The YouTuber layer (every edit, non-negotiable)

What separates his edit from a captioned recording. Plan it in the story pass, check it in the stills gate. Reference build: `references/example-github-universe/film.js` (a 13-minute screen demo + talking head, Nov 2026).

1. **A 3D studio** (three.js, one renderer with `alpha: true`, `RoomEnvironment` reflections, a pink and a violet point light). Objects hold real material and are drawn over `nightSky`:
   - **the chapter list as a 3D carousel** (`makeCard3D` per chapter, ring radius ≈ 3.3, snaps on the beat with z ≈ 0.55, the camera dives in, the glow ring follows the projected corners of the active card). It *is* the transition between chapters: the shared element of the whole film;
   - **a concept made physical** (Fusion = the models' logo tiles orbiting and melting into a clearcoat sphere with a gold torus);
   - **devices that carry his real screen** (`makeLaptop` with a real frame of the recording as the screen texture; `makePhone` lights up when the session moves to it; an arc of light between them);
   - **logos flowing into the surfaces they connect** (connector tiles orbit a hub, merge, and beam into Desktop / CLI / VS Code cards).
   On Windows, render with the GPU flags (§5); with them 3D costs almost nothing.
2. **Official logos, always.** Fetch the marks from Simple Icons (`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg`, CC0), add `width="256" height="256"` to the `<svg>` tag (otherwise the canvas gets no size), and tint them per brand colour with `source-in`. Use them in white app tiles (`logoTile`), inside cards next to titles (`infoCard({logo})`), and on price, repo and verdict cards. Use a product's own mark; if Simple Icons doesn't have it (xAI, Nano Banana), don't fake one.
3. **Callouts on the real UI (`D.shl`).** When he points at something in the recording (a toggle, a menu row, a price, a log line), dim the rest of the plate, put the glow ring on the element and a pink label chip above it.
   - Rects are source-normalised and **measured on a gridded frame inside the window**.
   - The screen recorder pans, so keep each callout in a 2–3 s window where the frame holds still, and check every one on a still (three of eight needed an offset in v11).
   - Draw them inside `drawSource`, so they follow the zooms and the 3D tilt.
4. **Real pages on real B-roll.** The browser card in 3D sits on licensed stock that matches the words (a conference hall for "the conference", wiping to the Golden Gate at dusk on "San Francisco"), with a `FIG. n · source` label.
5. **Editorial furniture.** A night section pill top-left (`01 · COPILOT FUSION`) whenever the screen or a scene is up, `FIG.` labels on evidence, mono kickers, folio numerals.
6. **Golden-prompt finish.**
   - Chapter and act pages and the end card on the night stage. The end card grows out of the avatar circle, with the real phoenix mark and the wordmark bottom-right.
   - Captions are calm whole phrases **in a night pill** (white Assistant on `rgba(14,13,42,.88)`, radius = height / 2).
   - The music enters under the hook and **its drop lands on the cut out of the hook** (`at = cut − drop_time`), with a whoosh on the drop.
7. **Density.** Make a contact sheet every 3 s of the cut (`stills` at 1.5 + 3k). No static stretch over ~3–4 s. The fix is a zoom with tilt, a callout, a 3D scene or a real page, never another chip.

## OBS recordings: the stage3d engine (EP18, then the Higgsfield tutorial, Nov 2026)

His long tutorials are OBS recordings: a camera scene, and screen scenes with his camera baked in as a picture-in-picture. For those, do not compose with ffmpeg overlays and do not draw the plate in the kit: one `seek(t)` page (three.js + 2D canvas) is rendered frame by frame on his PC. **The working engine is `C:\Users\User\Videos\grokbot\ep-fable-hf\` on his PC** (`film/main.js`, `film/scenes.js`, `film/gl.js`, `render.mjs`, `run_queue.ps1`, `finalize.py`, `make_master.py`, `mk_blur.py`, `mk_sidebar.py`, `mkshots.py`, `mix.py`, `verify_final.py`, `tools/`). Copy from there, not from the older `yuvwork\stage3d` template.

**Build**
- **Master time = film time.** Cut the kept pieces into one 30 fps master (GOP 15, no B-frames) and drive the page with film time. Privacy masks are baked into the master per piece (incremental, stamped per piece). Compare every rebuilt master with the previous one (`tools/master_diff.py`): a decode hiccup once baked a broken frame into a rebuild.
- **Layout model:** camera (`C`) and screen (`S`) segments; camera→screen fly-ins with frozen clean frames while OBS animates its own transition; screen→camera hard cuts where the camera card grows into the frame. Measure where OBS really switches (`tools/lay_switch.py`) and frame a fly-in from its first frame.
- **He zooms while recording** (a cursor-following zoom tool, about half of the screen time). Detect it (no Windows taskbar in the frame = zoomed), find UI through OCR every 0.1 s (`mk_sidebar.py`), and never let the engine's own zoom cut the lines it is showing (post-pass in `mkshots.py`).
- **The OBS camera scene has rounded corners baked in** (radius ≈ 92 px of 2560). Every camera crop keeps its corners inside them, at every zoom (`cornerSafe` in `main.js`). The 1.12 punch-in had no guard and showed a black notch in a frame corner.
- **The baked picture-in-picture:** the floating camera card covers what shows of it (up to 1.5× its usual size, anchored at its top-right corner, whole inside the frame with ~30 px to spare after its tilt). Whatever stays uncovered gets a smooth four-edge fill in the plate shader. A column fill read as streaks. Where covering a thin strip of it at full 16:9 height would lay a 1.5× card over the text he is reading, park the card at its usual size for that shot (`CAMPARK`) and let the strip take the fill. Do it per shot: a general "park on thin strips" rule made the card swell and shrink back during shot glides. `node render.mjs h camtrack` writes the card's rectangle for every frame without rendering, which finds such pulses and lists the chunks a change touches.
- **Everything tilted needs margin for the tilt.** Cards and panels are drawn on planes turned toward the centre, which brings their outer edge 15–40 px closer to the frame edge than the flat rectangle; 3D props in front of the stage are pushed out by perspective (`d / (d − z)`). Measure margins on rendered frames, not on the rectangles.
- **Piece joins inside a take.** Where a take is split into layout pieces, the EDL starts the second piece one source frame before the first ends. The picture hides it; the voice repeated 33 ms of speech. `mk_voice.py` rebuilds ±0.25 s around each such join from the continuous source audio, stretched by one frame, so the sync after it stays exact. The master's input seek also starts some pieces one frame early (≤ 33 ms of sync, invisible), except where his zoom tool was animating: the picture stepped back and forth for 0.1 s, so the screen card holds a frame there (`SCRHOLD`, which the falling card of a hard switch uses too).
- **When the caption lands on the line he is reading**, move the screen card aside or up for that shot (`SCRMOD`). The top chip and the caption follow the card's centre, and both ease across camera↔screen switches with the act rail's spring (`sk(t, LAYK, 9, 1)`): switching their position on the layout snapped the pill 80 px in one frame at every hard switch. Transitions start from the rect the live layout has (`poseRect(scrModK(t), 0)`), or the card jumps when a side panel is still easing out.
- **Scenes are timed by word lookups** (`wt(take, word)`): correcting a caption's spelling silently moved a chip by 2 s, because the lookup then found the next word. Regenerate the cues after any caption change and compare them with the previous cues.
- **Texture cache = LRU, not FIFO.** A held frame was evicted every 18 insertions and showed as single black frames.
- **Hebrew captions with Latin names:** one display token per left-to-right run, or "Fable 5.2" renders as "5.2 Fable". In chips, use `→` between Latin names. Wrap an English sentence in LRI/PDI.

**Privacy (he does not think about it while recording): blur by default and tell him.** The Claude Desktop sidebar (other sessions, pinned projects, the PC host name), address-bar suggestions, Alt-Tab, the desktop, Dropbox share links. A mask never goes on camera frames, including the frozen camera frame shown during an animated OBS transition (`mk_blur.py` subtracts the camera spans). One that did showed as a blurred patch on the full-frame camera.

**Render and join.** Playwright Chromium with `--use-angle=d3d11 --force_high_performance_gpu`: without the second flag it renders on the Intel iGPU, so check the `GL ANGLE (...)` line. Render 1000-frame MKV chunks, ~10 workers (a 14-minute film takes ~13 minutes on the 4090). Rewrap every chunk to MP4 at timescale 60 before the concat: MKV millisecond stamps drift. After a local fix, re-render only the touched chunks and prove with `tools/chunk_diff.py` that nothing else changed.

**Deliverables.** Mux the final with `-color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart+write_colr`: a stream copy otherwise writes no `colr` box, which QuickTime and Apple players read. The YouTube SRT: no name split across a line or a cue ("ל-Claude" | "Fable 5.2"), a right-to-left mark on a Hebrew line that starts with a Latin word (players take the direction from the first letter; not on an all-English line, whose full stop would jump left), no full stop glued to a URL, no cue under 0.7 s or over 7 s, two lines of up to 42 characters. When a sponsor requires an English first line in a Hebrew description, YouTube may lay out the whole description left-to-right: wrap each Hebrew line in RLI…PDI (U+2067…U+2069), never before a chapter's timestamp or inside the required English lines. Thumbnails under 2 MB (JPG, not a 2560 PNG). For a sponsored video, have the texts auditor read the brief line by line against the cut and the description: it found the keywords in the wrong place, a title not built on the sponsor's search phrases, two trial terms that are never spoken, and part of the workflow filmed on another model.

**Checks that found real defects** (run all on every final): `verify_final.py` (facts, loudness, black frames, an OCR sweep for private strings, blind transcription against the script); `tools/cut_sync.py` (the frame each cut lands on); `tools/sync_check.py` (sound against the raw recording); `tools/flash_scan.py` + `tools/flash_triage.py` (regions that change for 1–4 frames and come back; the master scan removes what is in the recording); `tools/cut_strip.py`; `tools/final_sheets.py`. Windows OCR (`tools/ocr.ps1`) runs only under `powershell.exe` 5.1.

## 0. Intake

1. Read `GOLDEN_PROMPT-explainer-film.md` (see the v11 row). Then run `ffprobe` on every file and make a timestamped contact sheet (`fps=1/3 … tile=10x6`). Look at the sheets.
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
python3 scripts/transcribe.py raw/talk.mp4 build --lang he --model ivrit-ai/whisper-large-v3-ct2   # no Scribe key: far better Hebrew than stock large-v3
```

Without a Scribe key, use the ivrit-ai model for Hebrew: on an elderly speaker with a Sephardi accent, stock large-v3 garbled most sentences, ivrit-ai got nearly all of them. Its words carry RTL embedding marks (U+202B/U+202C): strip them before captions.

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
ffmpeg -ss <N0/30> -i raw/talk.mp4 -vf fps=30 -frames:v <n> -q:v 3 -start_number <N0> frames/%06d.jpg    # per kept range
# -vf fps=30 is required for 29.97 fps sources: without it frame N is not at N/30 s and the lips drift ~9 frames by minute 5
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

**Windows GPU (measured Nov 2026, RTX 4090):** launch Chromium with `--enable-gpu --ignore-gpu-blocklist --use-angle=d3d11 --enable-gpu-rasterization` (`render_edit.cjs` adds them on win32). Without them, WebGL falls back to SwiftShader at 0.8 fps per worker; with them it runs at ≈ 10 fps per worker. 6 workers render a 13-minute film with 3D cards and three.js scenes in ≈ 15 minutes per layout. Before the full render, compare one WebGL frame from the GPU path with a CPU still.

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
- `references/example-github-universe/film.js`: the YouTuber layer in full (3D carousel, Fusion core, tools and devices in three.js, official logos, UI callouts, night pill captions).
- `references/example-claude-mods/`: the full worked example: `edit.json` (story-ordered `keep`), `captions_src.json` (hand-written phrases by source time) and `film.js` (`lab()` = concept → examples).
- `references/edl-schema.md`: the quick-mode EDL.
