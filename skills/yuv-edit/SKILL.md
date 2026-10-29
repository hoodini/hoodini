---
name: "yuv-edit"
description: "Yuval's video editor: raw footage in, a finished, branded film out, plus an editable DaVinci Resolve / Final Cut timeline. Talking-head videos, reels and shorts, screen-recording demos, screenshots and websites, product reviews, or any mix. Cuts dead air and retakes, hides jump cuts with punch-ins, adds B-roll, 3D screenshot cards and 2.5D parallax, screen zooms that follow the action, text behind the subject, Phoenix Ink motion graphics, karaoke captions, music and SFX on the beat, a CTA and a signature end card. Use for: edit my video, ערוך לי את הסרטון, עריכת וידאו, תערוך, ריל מהצילום, סרטון יוטיוב, b-roll, כתוביות, jump cuts, screen recording demo, make this video pop. Not for films made purely from code (yuv-motion) or AI-generated footage (flux3-video)."
---

# YUV.AI Edit: raw footage in, a finished film out

Yuval hands over footage: himself talking, screen recordings, screenshots, a product, or a mix. You deliver:
1. a finished MP4 per format he needs (16:9 and/or 9:16);
2. `timeline.fcpxml` + `captions.srt` he can open in DaVinci Resolve (File › Import › Timeline) or Final Cut;
3. a short edit note: what you cut, why, and what you would shoot differently next time.

**You are the editor, not a filter.** The research behind this skill (`references/playbook.md`) found one thing above everything else: **story beats effects.** The most-watched iPhone 17 reviews won on a sharp promise in the title, a thesis-first opening and chapters that argue, not on effects. Polish multiplies a good story; it does not rescue a weak one. So the story pass (step 2) comes before any pixel.

**Brand comes from `yuv-design-system` (Phoenix Ink).** This skill defines no colours or fonts of its own. The gfx templates in `scripts/gfx/gfx.js` already implement them: night stage, gold marker, Karantina/Assistant, the glow ring only on the CTA, 36–48px radius, change shape and never fade. For a full code-only motion moment (an opener, a particle-phoenix logo sting, a product hero shot), render it with `yuv-motion` and drop the MP4 in as a primary clip.

## 0. Intake (2 minutes, then go)

1. List every file. Run `ffprobe` on each, then make a contact sheet per clip:
   `ffmpeg -i X -vf "fps=1/5,scale=480:-2,tile=6x4" -frames:v 1 sheet_X.png`. Look at the sheets.
2. Classify each file as **A-roll** (Yuval talking), **screen** (recording), **still** (screenshot, site, photo), **B-roll** (product, hands, environment) or **music/SFX**.
3. Ask only what you cannot infer, and in one message:
   - **the one action** the video should drive (subscribe, the course page, a link, a comment keyword);
   - which platforms. The default is both: 16:9 for YouTube and a 9:16 cut-down of the strongest 30–60 s.

   Everything else is decided here.
4. Set up the work folder and its tools:
   ```
   <project>/raw/    music/    sfx/    build/    out/
   pip install -r <skill>/requirements.txt
   ```
   Playwright and Chromium are preinstalled in Claude cloud sessions.

## 1. Transcribe: the voice is the clock

```
python3 scripts/transcribe.py raw/talk.mp4 build --lang he
```
- This uses ElevenLabs Scribe when `ELEVENLABS_API_KEY` is set (best for Hebrew), otherwise local faster-whisper `large-v3`.
- It writes `words.json` (word timestamps) and `transcript.md`.
- Read all of `transcript.md`. Every later decision hangs on a word.

## 2. Story pass (write `build/edit_plan.md` before touching the timeline)

1. **The promise.** One claim with tension, of the form "good thing + its price", e.g. "Beauty is Pain", "Paradox in a Box". The title, the thumbnail (`yuv-cover`) and the first 30 seconds must all deliver that same promise. YouTube's Intro metric and Test & Compare both reward the opening keeping the title's promise, not clickbait.
2. **The cold open.** Find the strongest sentence in the whole take (the verdict, the surprising number, the demo moment) and open on it.
   - No "היי, ברוכים הבאים", no logo first.
   - The thesis lands within 60–120 s for long-form and within 3 s for reels.
   - Target: at least 60% of viewers still watching at 30 s.
3. **Chapters as an argument.** Order the material small → medium → big concern → verdict, or problem → mechanism → proof → payoff. Never a spec list.
   - Each chapter gets a name with character, which becomes a `chapter` card in long-form only.
   - Cut every tangent that does not serve the promise, even a good one. Note it in the edit note as a possible separate short.
4. **The CTA moment.** Ask after the payoff, never in the first 30 s. Phrase it as a series CTA ("בפרק הבא…") or a soft single ask. One `cta` gfx, and the end card leaves the last ~20 s for YouTube's end screen.
5. **Shot needs.** List the B-roll each claim needs: what is named should be seen. If footage is missing, use:
   - a screenshot as a `card3d`;
   - a screen recording;
   - a stat or compare graphic;
   - a short `yuv-motion` insert;
   - or tell Yuval exactly what 5 seconds to shoot.

   Never fake a photoreal shot of a real product or person.

Write the plan as a table, then build it:

| out time | words (start…end) | picture | gfx / caption | sound |
|---|---|---|---|---|

## 3. The cut

```
python3 scripts/autocut.py build/words.json A build/edl.json --src ../raw/talk.mp4 --punch 1.0,1.12
```
- This removes fillers, pauses over 0.35 s, sentence retakes and in-breath restarts, keeping the last take.
- It alternates 1.0 / 1.12 punch-ins so every jump cut reads as intentional.
- It logs every removal to `cuts.md`. Read the log, because a word you need might be gone.

Then edit `edl.json` by hand (schema: `references/edl-schema.md`):
- **Reorder for the cold open:** move the strongest clip to the front, then a 0.3–0.6 s breath, then the context.
- **Pacing targets** (`references/playbook.md` §Pace):
  - talking-head long-form: about 12–28 visual changes per minute;
  - reels: 20–45.
  - **Faster is not better.** In the best available experiment, engagement dropped past the median pace, and memory falls under information overload.
- **Slow down on purpose** for numbers, comparisons and the verdict: hold the graphic 2–3 s with no cut and no SFX. Spend the speed on low-information stretches: setup, transitions, B-roll montage.
- **Punch levels:**
  - 1.0 for wide, the default;
  - 1.12 for an emphasis jump cut;
  - 1.25–1.35 for the punchline (a slow push `{"from":1.0,"to":1.15}` across a key sentence works better than a snap);
  - reset to wide on a new thought.
- **J/L cuts:** start a cover (B-roll) 0.2–0.4 s before the sentence that names it, and end it on the next sentence's first word. The dialogue continues under it.
- A `transition: "whip"` only where the content changes place or time. Every transition needs a reason, otherwise it is a straight cut.

## 4. Picture: covers, screens, stills

Full recipes by format are in `references/formats.md`. The core treatments:

| Need | `kind` in a cover or primary clip | Notes |
|---|---|---|
| B-roll over the voice | `video` (+ `zoom` push 1.0→1.08) | Real footage first. Hold at least 1.2 s; 2–4 s is typical. |
| Screen recording / demo | `screen` + `zooms` | Rounded panel on the night stage. The camera springs to where the action is. Seed with `scripts/screen_zoom.py`, then keep only zooms the voice explains ("כאן אני לוחץ…"). Max zoom 3×, so text stays sharp. |
| Screenshot / website / app UI | `card3d` | Apple-style 2.5D: the screenshot is a 3D card. The camera pushes on Z while the card turns a few degrees, a sheen sweeps across once, and the backdrop is the same image blurred (depth of field) or the night sky. Tune `rot_y`, `rot_x`, `z`. |
| Photo with depth | `parallax` + `depth` map | Depth from Depth Anything / a depth app, or a hand-painted mask (white = near). Push 0.06–0.1. |
| Apple / brand marketing footage | `video`, short | Downloadable from the press kit is **not** licensed, and credit is not fair use. Keep it short, under commentary that critiques or compares it, transformed (cropped, marked, side-by-side). Never use it as filler. Prefer your own B-roll and your own screen. |

## 5. Graphics (Phoenix Ink templates, `scripts/gfx/gfx.js`)

| template | use | density |
|---|---|---|
| `title` | kinetic headline. Words slam in with overshoot; `marker` = index of the gold-marked word; optional mono `kicker`. | the hook, the promise, the verdict |
| `title` + `behind_subject: true` | text behind Yuval: the matte (rembg) puts him in front of the words. Big type (size 220–300) in the empty side of frame, with his head covering **20–40%** of a non-marker word; fully hidden text is a failure | **max ~1 per 2 min** — a highlight, not a style |
| `code` | a command as typed: night glass card, JetBrains Mono, pink prompt, types itself with a caret | whenever he says a command out loud (`claude --update`, `/plugin`) |
| `lower_third` | name + role, white card, pink bar | once, within the first 15–40 s of long-form |
| `callout` | chip + dotted connector to a point on screen (spec, button, detail) | when the voice names a thing on screen |
| `stat` | Anton count-up number + label (gold on night) | any number worth remembering |
| `compare` | spec bars A vs B | comparisons; hold ≥ 2.5 s |
| `chapter` | full-frame night spread, giant folio numeral, iris in/out | long-form chapter starts only |
| `cta` | pink pill with the rotating glow ring | once, after the payoff |
| `endcard` | night stage, closing line with marker, handwritten יובל אבידני signature, YUV.AI wordmark | always, last 4–6 s |
| `caption` (auto) | karaoke chunks ≤ 3 words, active word on the gold marker | reels always; long-form optional |

Rules:
- One display element per moment. Never stack two headlines, and never put a title on top of the screen being demoed.
- Hebrew is right-anchored, max ~4 words per line. Key word on the gold marker, ink text, one marker per line.
- Things enter with a spring and leave by changing shape. Never fade.
- Put graphics on words: `at` = the word's output time − 0.1 s, so the motion starts before the beat and *lands* on it (viewers judge sync by the landing).

Render them, after any EDL change; unchanged jobs are skipped:
```
python3 scripts/prep_gfx.py build/edl.json --words build/words.json --mov   # --mov = ProRes 4444 for the NLE timeline
```

## 6. Sound

- **Music:** licensed only, from Yuval's library, Mixkit (download on the PC; the cloud shell cannot reach it), Epidemic or Artlist.
  - Pick by energy: calm and minimal under explanation, a drop for the reveal.
  - `python3 scripts/beats.py music/track.mp3` gives the beat grid and the drop. Offset the track so the drop lands on the reveal: `in = drop − reveal_time`.
  - Cut moments that are about energy on beats. Never cut a sentence to fit a beat: the voice wins.
- **Ducking** is automatic (sidechain, ~10 dB under the voice). The music bed is about −16 to −20 dB before the master.
- **SFX:**
  - whoosh on covers and transitions, pop or click on chips and callouts, riser into the reveal (its peak *on* the reveal, then a whoosh), soft UI clicks on screen demos;
  - `beats.py file --sfx` gives `peak`; set `event` = the moment it should hit;
  - never back to back (keep them at least 0.8 s apart) and not on every cut, or the cuts start to feel mechanical.
- **Master:** `mix.py` cleans the dialogue, ducks, places SFX and normalises in two passes to −14 LUFS / −1.5 dBTP.

## 7. Render, look, deliver

```
python3 scripts/prep_gfx.py build/edl.json --words build/words.json --preview  # half-size gfx for the preview
python3 scripts/compose.py build/edl.json build --preview                       # fast look
# --- look at it (stills gate below), fix, then the real thing:
python3 scripts/prep_gfx.py build/edl.json --words build/words.json --mov
python3 scripts/compose.py build/edl.json build            # parallel slices, frame-exact joins
python3 scripts/mix.py build/edl.json build out/<slug>_16x9.mp4
python3 scripts/qa.py build/edl.json out/<slug>_16x9.mp4 build/qa
python3 scripts/export_fcpxml.py build/edl.json out/<slug>.fcpxml
```

For 9:16, copy the EDL and adjust it as below, then render it again:
- set `"width": 1080, "height": 1920`;
- the face anchor reframes the A-roll automatically;
- re-place the gfx: titles above the face, captions at y 0.72;
- cut to the 30–60 s that carry the promise and the payoff.

Cost: about 8 frames per second per core at 1080p. A 10-minute video renders in about 15–25 minutes on 4 cores, so iterate on `--preview` and `--from/--to` slices.

**Stills gate (mandatory, before the final render):** open `build/qa/sheet.png` plus stills of every gfx moment. Fail and fix on any of these:
- unreadable text: low contrast, or a caption over a busy area without its stroke;
- a title or caption covering the face, the demoed UI or another graphic;
- RTL errors or wrong word order;
- a font that is not Karantina or Assistant;
- a black frame, frozen frame or a jump at a clip join;
- a punch-in that cuts off the head;
- a screen zoom that is too soft to read (above 3×);
- more than one marker per line, or a glow on something other than the CTA;
- a "dead" minute in `qa.txt` with no visual change;
- grey, beige or washed-out surfaces;
- anything that looks AI-made.

`qa.py` also checks frame count, loudness, cut rate per minute, longest static shot, the first visual change, the text-behind-subject budget, SFX spacing and CTA timing.

**Deliver:**
- send the MP4s (re-encode at CRF 21 if over 30 MiB for chat; keep the master), the `.fcpxml` with `captions.srt`, and the edit note;
- suggest 2–3 title and thumbnail variants for YouTube Test & Compare. It picks winners by watch time, not CTR, so the title must match the opening.

## Gotchas from real edits

- **Footage that was already edited:**
  - **Baked-in graphics:** if Yuval hands over an already-edited export, find what is burned in before placing anything (an old name tag, a watermark, a PIP). Scan the frames for it (bright text pixels in a band over time). If it clashes, hide it with a punch anchored away from it (`anchor: [0.5, 0.0]` + zoom 1.4 crops the bottom 30%), or cover it, and never place a graphic on top of it.
  - **Existing pans and zooms:** the old moves change where things are on screen from moment to moment. Check a frame at every zoom time before you set its rect.
- **A punch moves the face, so re-check every overlay after changing a zoom.** A CTA that was clear at 1.0 can land on his mouth at 1.45.
- **Hebrew + English in one title:** consecutive English words are merged into one LTR unit automatically ("Claude Code" stays in order), and the marker index refers to the original words.
- **Titles over terminal or busy footage** get a soft night shadow by default (`shadow: false` turns it off). Keep them in the empty band (y ≈ 0.2) and short: ≤ 4 words, no separator dots that wrap onto their own line.
- **Screen recording with a burned-in camera PIP:** zooms magnify the PIP too. Keep the zoom ≤ 2.6× and ask for separate screen and camera files next time.
- **Music in the cloud:** there is no licensed library there. Ship without music, say so, and suggest a Mixkit or Epidemic bed on the PC; synthesized whoosh, pop and riser SFX (ffmpeg noise and sine) are fine.

## Never (what fails for others)

- **Effects as the point.** Every zoom, whip, SFX and behind-the-subject title needs a reason you can say in words. If you cannot say it, cut it.
- **Metronome cutting.** Vary shot lengths; rhythm matters more than the average.
- **Walls of text on screen while he talks.** Show one idea at a time.
- **Opening slowly:** a logo, "welcome back", or the context before the claim.
- **Opening on a subscribe ask.** Fewer than 10% of viewers click subscribe; ask after the payoff.
- **Clickbait the opening does not deliver.** Test & Compare punishes it.
- **Stock-looking B-roll, fake UI, invented stats or AI-looking visuals.** The research shows trust is the reviewer's product.
- **A loud master.** YouTube turns it down, and the limiter you hit on the way squashes the voice.
- **Covering the face or the thing being demonstrated** with a graphic.

## Honest limits

- **Text behind the subject** needs `rembg` + `onnxruntime` (person matting at about 5–10 fps). Hair edges are good, not rotoscope-perfect. Keep these moments short (1.5–3 s).
- **Face anchoring** uses an OpenCV 4.x Haar cascade; requirements pin `opencv<5`. Without it, the anchor defaults to centre-upper.
- **The FCPXML timeline** carries cuts, punch scale, covers, gfx movies, music and SFX. Code-only treatments (`card3d`, `parallax`, `screen` stage) appear as their source media for the editor to rebuild, or he can drop in the rendered film. Premiere: open it through Resolve, or use the MP4.
- **Footage limits:** you cannot invent footage. When a claim needs a shot that does not exist, say what to shoot.
