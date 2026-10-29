# Recipes by format

All recipes use the kit-film pipeline in SKILL.md: a light stage, the glow ring signature, calm phrase captions.

Each recipe covers the structure, then the picture, graphics and sound for that format. Mix them freely; a real video is often A + C + D together.

## A. Talking head, long-form (16:9, 6–16 min)

1. **Cold open, 0–30 s:**
   - the strongest line first, at punch 1.12;
   - a `title` with the promise at 0.3–0.8 s, with the key word on the gold marker;
   - one B-roll or screen flash of the payoff (a 1.5 s "you'll see this");
   - then the context.
2. **Lower third** at the first natural pause after the hook, within 15–40 s, shown once.
3. **Chapters:**
   - a 1.2–1.6 s `chapter` card, with a whoosh into it;
   - inside a chapter, alternate A-roll and covers: every claim that names something visible gets a cover (B-roll, screen or `card3d`) starting 0.2–0.4 s before the word;
   - when that thing has a detail worth pointing at, add a `callout`.
4. **Jump cuts:** punch 1.0 / 1.12 alternating. Add a slow push 1.0→1.15 across the 2–3 key sentences of each chapter, and reset to wide on a new thought.
5. **Proof moment:** a `stat` or `compare`, held 2.5–3 s, with no cut, no SFX and the music dipped.
6. **Verdict:**
   - a `title` with the verdict (one marker);
   - one `behind_subject` title here or in the cold open, never both within 2 minutes;
   - then `cta` with a series ask, then the `endcard` (last 5 s), leaving the last ~20 s free of other graphics for YouTube's end screen.
7. **Sound:**
   - a calm bed under the voice, swapped or lifted at each chapter;
   - a riser into the verdict;
   - SFX on covers and graphics, never back to back.

## B. Reel / Short (9:16, 20–60 s)

1. **Frame:** `width 1080, height 1920`. The face anchor reframes 16:9 A-roll automatically; check the head is not cut off in the stills gate.
2. **First 1.5 s:**
   - the claim as a `title` (y ≈ 0.22, above the face) and motion on frame 1 (punch 1.12 or a cover);
   - no greeting.
3. **Captions always:**
   - calm phrases, shorter than long-form: ≤ 4 words per phrase, written by hand (`captions.py`);
   - the whole phrase at once with one soft rise, no word-by-word pops;
   - white with a night stroke over footage, ink on the light stage;
   - kept clear of the face and of the bottom 15% (platform UI).
4. **Pace:** 20–45 changes per minute, a punch on nearly every sentence, a cover every 3–5 s.
5. **The loop:** the last line should hand back to the first, so the replay feels seamless (`cta` optional, the `endcard` short at 1.5–2 s).
6. **Music:** louder than long-form (bed −14 to −16 dB), with the drop on the reveal.

## C. Screen recording / product demo

1. Seed the zooms:
   `python3 scripts/screen_zoom.py raw/screen.mp4 --start <in> --end <out>`. It suggests where the screen changes.
2. Keep a zoom only when the voice points at that place. Arrive 0.3 s **before** the click or typing, and hold until the result is visible. Zoom out between actions that are far apart, and pan when they are close.
3. Max 3×. If the text still looks small, the recording was too low-resolution; record at 1440p+ next time (put that in the edit note).
4. A `callout` on the exact button, a click SFX on the click, and a soft UI tick on result reveals.
5. **Long waits** (loading, generation): speed-ramp the cover (`speed: 4–8`) with a `stat` or a caption "×6", or cut away to A-roll.
6. Yuval's face as a picture-in-picture is not built in yet. Alternate full-screen demo with A-roll instead.

## D. Screenshots, websites, app UI (Apple-site style)

1. **Use `card3d` for every static screenshot:**
   - the default turn is `rot_y −14→6`, `rot_x 8→2`, `z 2.6→1.9`, with a blurred-self backdrop;
   - for a hero moment use a bigger push (`z 3.2→1.6`) on the light stage, with the glow ring around the card.
2. **Sequences of screenshots:** alternate the direction of `rot_y` from shot to shot, so the camera feels like it orbits.
3. **For a long page:** record a smooth scroll and use it as a `screen`, rather than one giant screenshot.
4. **Photos (product, people, places):** use `parallax` with a depth map for the Z-axis feel. Keep `push` ≤ 0.1, or edges smear.
5. **Third-party marketing renders:** keep them short, under commentary, transformed (see playbook §6). Your own UI captures are always safe.

## E. Product review (the iPhone 17 pattern)

- **Package:** a promise title with tension ("good + price"), and the thumbnail matching the first frame of the cold open (`yuv-cover`).
- **Structure:** cold open (verdict tease) → what's new (`card3d` on spec screenshots, `callout` on hardware B-roll) → test segment (`compare` / `stat`) → concerns small to big → verdict → series CTA.
- **Signature B-roll:** the same macro move on every product (slider push across the edge, a turntable rotation), lit the same way. It becomes recognisable.
- **Timing (tell Yuval):** event-day impressions out first, then the unboxing at embargo, then one review per model.

## F. Mixed tutorial / course lesson

- Chapters are lesson steps. Each step gets `chapter` → A-roll (why) → screen (how, with zooms) → `stat` / callout (result).
- **Captions:** always, as calm phrases (`captions.py`); also export the phrases as an SRT for YouTube.
- **CTA:** the course or the next lesson, never in the first 30 s.
