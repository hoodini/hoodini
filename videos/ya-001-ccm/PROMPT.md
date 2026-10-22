# YA-001 · CCM — production prompt (verbatim)

The exact prompt this video was produced from. Shot 8 (WPT 5/6) types its first lines on screen.

```
Defaults chosen: PLATFORM = 16:9 1920×1080 master (YouTube / LinkedIn / X) plus a 9:16 1080×1920 Reels re-layout · STYLE MODE = Classic Flight · CTA = "עוד הסברים כאלה ב-yuv.ai" · FACTS = none provided, so every product claim below is marked VERIFY · flight code = YA-001 · CCM (no earlier YA- codes found in the repo) · music = 108 BPM (1 beat = 0.5556 s) · every transition = 1 beat (0.556 s) · output folder = videos/ya-001-ccm/ in this repo.

[ROLE]
You are a senior motion designer + creative technologist. Produce a finished, publish-ready, NO-VOICEOVER motion-graphics video (MP4) about "how to use Claude Opus 5.5 through Claude Code, even from a phone, in a cloud environment, to create Hebrew motion-graphics videos". All on-screen text is in Hebrew, fully on-brand for YUV.AI. Work autonomously; only ask if truly blocked.
Meta note: this video is itself made the way it describes (Claude Code, cloud environment, Opus 5.5). Shot 15 proves it with stats measured from this exact render.

[PARAMETERS]
- Formats: (A) 16:9 1920×1080 master; (B) 9:16 1080×1920 re-layout with a shorter cut (see SHOT LIST B).
- 30 fps, H.264 High profile, yuv420p, +faststart; AAC 48 kHz stereo 192 kbps.
- Loudness: -14 LUFS integrated, -1 dBTP true peak.
- Duration: A = 71.667 s (129 beats, 2150 frames, 17 shots); B = 57.222 s (103 beats, 1717 frames, 13 shots). Recompute these in code from the shot list; if your numbers differ from mine, yours win, and report the difference.
- File size: each final MP4 < 100 MB; each 720p preview < 30 MB.
- Flight code: "YA-001 · CCM". Credit: "YUVAL AVIDANI · YUV.AI".
- Repo hygiene: this repository is Yuval's GitHub profile repo. Its README.md and update_profile.py are updated by a bot, so do NOT touch them. Put everything under videos/ya-001-ccm/. Keep heavy intermediates (frames, chunks) out of git via a local .gitignore.

[STORY]
Story type: PROCESS. Spine: the pain → the promise → 6 steps as waypoints → pitfalls as NOTAMs → result → takeaway. Brand arc: fog → breakthrough → climb → big picture → clear skies.
Headline rule: line 1 = the problem (Assistant 800, deep-sky); line 2 = the solution (Assistant 300, open-sky). Product names stay in English inside <bdi>.

Scenes and exact Hebrew strings ("|" separates line 1 from line 2):
1. OPEN, fog: the YUV.AI phoenix fades up through mist, and then the boarding strip appears: "מ- ערפל ← אל ברור · YA-001 · CCM". The altimeter reads ALT 0 FT.
2. PAIN, turbulence in the fog: "סרטון מושן בעברית לוקח ימים | ודורש מחשב חזק ותוכנות כבדות". A heavy timeline UI and a fan icon shake gently in turbulence.
3. PROMISE, the breakthrough: "ומה אם הטלפון מספיק? | Claude Code בענן עושה את העבודה הכבדה". A phone outline (cockpit icon; its gold detail is the screen) sends a dashed flight path up to a control tower above the clouds. The control tower = the Claude Code cloud environment.
4. WPT 1/6: "פותחים את Claude Code | באפליקציה של Claude או ב-claude.ai/code". Chip (mono, dir=ltr): "claude.ai/code". [VERIFY: Claude Code on the web is reachable from the Claude mobile app (iOS/Android) and at claude.ai/code. Check https://code.claude.com/docs/en/claude-code-on-the-web. If mobile access is only via the browser, change line 2 to "מהדפדפן בטלפון: claude.ai/code" and recount the words.]
5. WPT 2/6: "מחברים GitHub ובוחרים ריפו | שם יישמרו הקוד והסרטון". Icon: a repo folder with a branch; the gold detail is the branch node. [VERIFY: GitHub connection and repo selection flow in the same doc.]
6. WPT 3/6: "בוחרים סביבת ענן | מחשב זמני שעובד בשבילכם". Icon: a cloud with a server rack inside; the gold detail is one status LED. Chip: "network policy · setup script". [VERIFY: the environment settings names (network access policy, setup script, environment variables) in the same doc.]
7. WPT 4/6: "בוחרים מודל: Opus 5.5 | הוא מתכנן, כותב ובודק". Instrument readout chip: "MODEL · claude-opus-5-5". [VERIFY: Opus 5.5 is selectable in Claude Code on the web and its exact model ID is claude-opus-5-5. Check the Claude Code docs model-config page and Anthropic's models overview.]
8. WPT 5/6: "מדביקים פרומפט הפקה אחד | נושא, סגנון, צבעים ותזמון במקום אחד". Evidence: the first real lines of THIS production prompt type in on a white cloud card, mono, dir=ltr, verbatim, never paraphrased.
9. WPT 6/6: "Claude בונה ומרנדר בענן | HTML, GSAP, Playwright ו-ffmpeg". Evidence: 4–6 real lines copied from your own render script (the actual Playwright screenshot loop and ffmpeg command you wrote), typed in. Never write fake code.
10. HOLDING PATTERN, the QA loop: "בודק את עצמו שוב ושוב | צילומי מסך, תיקונים, רינדור חוזר". The plane flies an oval holding pattern around the control tower. Three real contact-sheet thumbnails from your own QA pass orbit with it, each flipping from a pink-deep ✕ to a deep-sky ✓.
11. NOTAM 1: "הסביבה זמנית: שומרים ב-GitHub לפני שהיא נסגרת". [VERIFY: cloud sessions run in ephemeral containers; same doc.]
12. NOTAM 2: "פונטים וחבילות? בודקים שהרשת של הסביבה מאפשרת אותם". [VERIFY: the network policy can restrict package and font downloads; same doc.]
13. NOTAM 3: "אפשר לנעול את הטלפון. העבודה ממשיכה בענן". [VERIFY: a cloud session keeps running while the client is closed or locked; same doc.]
14. RESULT: "MP4 מוכן ו-PR ב-GitHub | צופים, מעירים בצ'אט ומקבלים גרסה חדשה". A phone frame shows a still from this video's own end card plus a draft PR badge.
15. PROOF, instrument readouts: "הסרטון הזה נוצר בדיוק ככה". Four readouts count up, with values measured from the actual final render (never pre-written): SHOTS, FRAMES, DURATION (s), RENDER WORKERS. Write the values into a JSON file after a first render, then do a second render that reads them.
16. FINAL REVEAL, runway lights: the full route appears from fog to stratosphere. All 6 waypoint labels light in sequence, then all at once, legible: "פותחים · מחברים · ענן · מודל · פרומפט · רינדור". Takeaway headline: "רעיון בטלפון | סרטון מוכן בענן".
17. END CARD over the golden sunrise: "מעל העננים, הכול נהיה ברור." · phoenix · wordmark "YUV.AI" · CTA "עוד הסברים כאלה ב-yuv.ai" · credit "YUVAL AVIDANI · YUV.AI". ALT 35,000 FT.

Flight metaphors used: waypoints = the 6 steps; the control tower = the Claude Code cloud environment; holding pattern = the self-QA loop; NOTAM tags = the 3 pitfalls; turbulence = the pain; instrument readouts = the model chip and the render stats; altitude = depth of understanding; boarding strip = the promise; runway lights = the final reveal.
Copy rules: no hype words ("מהפכה", "ישנה הכול", "חייבים עכשיו"), no invented numbers, no clickbait.

[SHOT LIST]
Formula (Classic Flight): hold = max(1.6 s, words × 0.33 s + 0.6 s), with the opening held at least 3 s, the reveal 3–5 s and the end card 2.5–4 s. Round up to whole beats at 108 BPM (0.5556 s per beat). Word count = whitespace tokens that contain a letter or digit (chips, chrome and readout labels excluded).

A. 16:9 master
| # | Scene | Exact Hebrew text | Words | Formula s | Beats | Hold s | Altitude layer (ALT) | Motion |
|---|-------|-------------------|-------|-----------|-------|--------|----------------------|--------|
| 1 | OPEN | מ- ערפל ← אל ברור | 4 | 3.00 (min) | 6 | 3.333 | fog (0 FT) | phoenix fades up through mist; boarding strip rises through a mask; chrome draws in |
| 2 | PAIN | סרטון מושן בעברית לוקח ימים \| ודורש מחשב חזק ותוכנות כבדות | 10 | 3.90 | 8 | 4.444 | fog (1,500) | word-by-word reveal; turbulence shake ±3 px on icons only, never on text; gold marker wipes R→L |
| 3 | PROMISE | ומה אם הטלפון מספיק? \| Claude Code בענן עושה את העבודה הכבדה | 11 | 4.23 | 8 | 4.444 | breakthrough → cloud tops (4,000) | phone icon draws; dashed path climbs to the tower; white-pink flash breaks through the cloud |
| 4 | WPT 1/6 | פותחים את Claude Code \| באפליקציה של Claude או ב-claude.ai/code | 9 | 3.57 | 7 | 3.889 | cloud tops, pink light (7,000) | waypoint pin drops on the route; card rises; chip snaps in |
| 5 | WPT 2/6 | מחברים GitHub ובוחרים ריפו \| שם יישמרו הקוד והסרטון | 8 | 3.24 | 6 | 3.333 | cloud tops (9,500) | repo icon draws stroke by stroke, gold branch node lights last |
| 6 | WPT 3/6 | בוחרים סביבת ענן \| מחשב זמני שעובד בשבילכם | 7 | 2.91 | 6 | 3.333 | low open sky (12,000) | cloud-server icon draws; LED lights gold; chip types in |
| 7 | WPT 4/6 | בוחרים מודל: Opus 5.5 \| הוא מתכנן, כותב ובודק | 8 | 3.24 | 6 | 3.333 | low open sky (14,500) | model readout flips like an instrument; cabin chime |
| 8 | WPT 5/6 | מדביקים פרומפט הפקה אחד \| נושא, סגנון, צבעים ותזמון במקום אחד | 10 | 3.90 | 8 | 4.444 | low open sky (17,000) | real prompt lines type in on a cloud card with typewriter ticks |
| 9 | WPT 6/6 | Claude בונה ומרנדר בענן \| HTML, GSAP, Playwright ו-ffmpeg | 8 | 3.24 | 6 | 3.333 | high deep blue + contrail (20,000) | real render code types in; frame counter ticks |
| 10 | HOLDING PATTERN | בודק את עצמו שוב ושוב \| צילומי מסך, תיקונים, רינדור חוזר | 10 | 3.90 | 8 | 4.444 | high deep blue (22,500) | plane loops an oval; QA thumbnails flip ✕→✓ |
| 11 | NOTAM 1 | הסביבה זמנית: שומרים ב-GitHub לפני שהיא נסגרת | 7 | 2.91 | 6 | 3.333 | high deep blue (24,500) | NOTAM tag rises; pink edge draws top to bottom |
| 12 | NOTAM 2 | פונטים וחבילות? בודקים שהרשת של הסביבה מאפשרת אותם | 8 | 3.24 | 6 | 3.333 | high deep blue (26,500) | second tag stacks above the first, which dims to 40% |
| 13 | NOTAM 3 | אפשר לנעול את הטלפון. העבודה ממשיכה בענן | 7 | 2.91 | 6 | 3.333 | high deep blue (28,000) | phone screen dims to a lock icon while the tower keeps pulsing |
| 14 | RESULT | MP4 מוכן ו-PR ב-GitHub \| צופים, מעירים בצ'אט ומקבלים גרסה חדשה | 10 | 3.90 | 8 | 4.444 | stratosphere, stars (30,500) | phone frame rises; draft-PR badge pops |
| 15 | PROOF | הסרטון הזה נוצר בדיוק ככה | 5 | 2.25 | 5 | 2.778 | stratosphere, Earth curve (32,500) | 4 readouts count up from measured values; chime per counter |
| 16 | FINAL REVEAL | רעיון בטלפון \| סרטון מוכן בענן (+ 6 waypoint labels) | 5 | 3.00 (min) | 6 | 3.333 | stratosphere → horizon (34,000) | camera pulls back; runway lights run along the whole route; jet-spool riser |
| 17 | END CARD | מעל העננים, הכול נהיה ברור. \| עוד הסברים כאלה ב-yuv.ai | 9 | 3.57 | 7 | 3.889 | golden sunrise (35,000) | phoenix + wordmark rise; landing impact on the last downbeat |
Totals A: holds 113 beats (62.778 s) + 16 transitions × 1 beat (8.889 s) = 129 beats = 71.667 s · 2150 frames · 17 shots · 108 BPM. Within the LinkedIn/X limit of 140 s.

B. 9:16 Reels re-layout (limit 60 s; the 16:9 cut runs 71.7 s)
What was cut, and why: WPT 2 and WPT 3 merged into one shot; NOTAM 2 (network) dropped; NOTAM 3 (lock the phone) dropped; PROOF dropped. Waypoints become 5 (WPT n/5). NOTAM 1 stays because losing work is the costliest mistake.
| # | Scene | Text | Words | Beats | Hold s |
|---|-------|------|-------|-------|--------|
| 1 | OPEN | as A1 | 4 | 6 | 3.333 |
| 2 | PAIN | as A2 | 10 | 8 | 4.444 |
| 3 | PROMISE | as A3 | 11 | 8 | 4.444 |
| 4 | WPT 1/5 | as A4 | 9 | 7 | 3.889 |
| 5 | WPT 2/5 | מחברים GitHub ובוחרים סביבת ענן \| מחשב זמני שעובד בשבילכם | 9 | 7 | 3.889 |
| 6 | WPT 3/5 | as A7 | 8 | 6 | 3.333 |
| 7 | WPT 4/5 | as A8 | 10 | 8 | 4.444 |
| 8 | WPT 5/5 | as A9 | 8 | 6 | 3.333 |
| 9 | HOLDING PATTERN | as A10 | 10 | 8 | 4.444 |
| 10 | NOTAM | as A11 | 7 | 6 | 3.333 |
| 11 | RESULT | as A14 | 10 | 8 | 4.444 |
| 12 | FINAL REVEAL | as A16, 5 waypoint labels: "פותחים · ענן · מודל · פרומפט · רינדור" | 5 | 6 | 3.333 |
| 13 | END CARD | as A17 | 9 | 7 | 3.889 |
Totals B: holds 91 beats (50.556 s) + 12 transitions (6.667 s) = 103 beats = 57.222 s · 1717 frames · 13 shots · 108 BPM.
B layout: headlines stack in the upper-middle band inside the safe zone (220 px top, 380 px bottom, 120 px right); minimum text 44 px; code cards at most 6 lines at 44 px mono, wrapped by hand, never auto-shrunk below 44 px.

[BRAND: YUV.AI · מעל העננים]
Concept: the clouds are the jargon; the open sky above them is understanding. Every video is a flight from inside the fog of a topic to a clear view.
Colors (only these, with these roles): cloud #FFFFFF (surfaces, cards) · dawn #FFE8EF (warm light behind tags) · sunrise-pink #EE6A92 (decorative only, never body text) · pink-deep #A8264F (pink text or elements on white only) · sun-gold #FFC53D (the "aha" only: one full-height marker per section, the horizon line, one lit detail per icon; text on gold is always deep-sky) · sea #19B8C9 and sky #8EC3F2 (decorative, glows, charts) · open-sky #2F6FD6 (thin headline line on white) · deep-sky #0B2A5B (main text, strokes, arrows) · muted #4A6285 (secondary text) · scrim #061A48 (overlay on sky photos, 62% at the top fading to 0 by the middle). Ratio 70% white and sky, 20% deep-sky, 10% color. Never pink on a sunrise photo.
Type (self-hosted from github.com/google/fonts or @fontsource): Hebrew headlines Assistant 800 (problem) + Assistant 300 (solution; 200 only on solid white); Hebrew body Assistant 600; English Anton (thick word) + Oswald 200/300 (thin word), always paired; chips, instruments and code IBM Plex Mono 600. Never skew or italicize Hebrew.
Backgrounds by altitude, changing as the story climbs: fog (soft grey-white-pink mist) → cloud tops with pink light → low open sky → high deep blue with a contrail → stratosphere with stars and the curve of the Earth → golden sunrise above a sea of clouds for the end card. Use sky photographs from the project's assets folder when present; otherwise build them from gradients, soft cloud shapes, stars and light.
Readability: text only in clean or deep sky, never on the horizon or the sun; white text on photos with a two-layer shadow over the scrim; information sits on white cloud cards (36 px radius, one sharp 6 px wing-tip corner bottom-left, deep-sky 2.5 px stroke, shadow 0 20px 40px -24px rgba(6,26,72,.5)). For 9:16 keep text inside the safe zone: 220 px top, 380 px bottom, 120 px right; minimum text 44 px at 1080 width.
Devices: the boarding strip "מ- ערפל ← אל ברור · <flight code>"; an altimeter climbing from ALT 0 FT to ALT 35,000 FT across the video; a thin gold horizon line; a dashed deep-sky flight path with a small travelling plane; cockpit-style line icons (deep-sky, 2.5 px stroke, 48 grid, round caps, exactly one gold detail); real code as evidence, never fake code; NOTAM tags (white, sunrise-pink left edge, "NOTAM" in mono).
Chrome: top rule as a flight data strip (boarding strip on the right, "WPT n/N" in the center, live altimeter on the left); bottom rule with timecode and the wordmark "YUV" in Anton + ".AI" in Oswald thin; 80 px margins (16:9).
Logo: the YUV.AI phoenix in its original fire colors, never recolored, only at the opening and on the end card. End card over the golden sunrise: the closing line, the phoenix, the wordmark, "מעל העננים, הכול נהיה ברור.", the CTA and the credit.
Texture: fine film grain (4 pre-rendered noise PNGs cycled per frame) and a soft vignette.
Logo sourcing for this project: search the repo and any attached assets for the phoenix file (svg/png). If it is not found, STOP and ask Yuval for it. Never draw, trace or generate a stand-in phoenix.

[MOTION]
Everything ascends: entrances rise from below through masks, the camera climbs, the altimeter counts up. Headlines reveal word by word from behind a mask (easeOutCubic); the gold marker wipes in right to left after the headline lands. Icons draw stroke by stroke and light their gold detail last. Numbers count up like instrument readouts. Code types in. Scene transitions are flights: a push-in through a cloud with a soft white-pink flash, or a climb into the next altitude layer; no generic slides, spins or wipes. Constant subtle life: background parallax, gentle float on cards. Cuts locked to the beat grid. Gen Z 2026 mode only: punch-in zooms of 8–15% on cuts, huge type filling up to 80% of the width, snap-in white pills, faster altitude jumps; all brand and readability rules still apply.
Topic-specific moves:
- The phone-to-tower link: from shot 3 on, a thin dashed line connects a small phone glyph (bottom-left chrome area, 16:9 only) to the control tower; it pulses once per bar to show the session is live in the cloud. It stays alive in shot 13 while the phone screen is locked.
- Waypoint pins: each WPT shot drops a pin on the route at the current altitude; pins persist dimly so the route builds up visibly toward the runway-lights reveal.
- Holding pattern (shot 10): exactly one full oval per 8 beats; the thumbnails flip ✕→✓ on beats 3, 5 and 7.
- Readouts (shot 15): counters start on a downbeat and land on the last beat of the hold.
- Gold budget: one gold marker per section. Sections = Fog (1–3), Climb (4–9), Holding & NOTAMs (10–13), Arrival (14–17).

[AUDIO]
No voiceover. FIRST check ElevenLabs credits. If sufficient: instrumental music at the computed BPM (airy electronic, uplifting, no vocals, ending on a hit). Else procedural numpy/scipy music (soft kick, snare, hats, warm airy pad, bright plucks). SFX from page-emitted cues: air whoosh per camera move, soft engine swell on climbs, gentle pen draw on strokes, pop on icons, typewriter ticks on text, cabin chime per counter, jet-spool riser into the finale, landing impact at the end. Mix to -14 LUFS / -1 dBTP.
Specifics: 108 BPM; the music length must equal the video length to the frame (A 71.667 s, B 57.222 s); the final hit lands on the end card's last downbeat. If ElevenLabs music cannot hit the exact length or BPM, time-stretch it with rubberband or atempo, or fall back to procedural music. Typewriter ticks go only on shots 8 and 9 (code) and at most 1 per 2 characters.

[BUILD PIPELINE]
Single HTML page (dir="rtl") + GSAP paused timeline; deterministic window.seek(t, frame); all timings generated from the shot list in code (reading-time formula + beat quantize), never hand-typed; the page emits CUES/CUTS for the audio script. Bidi: every English or code token inside Hebrew text in <bdi> or a span with unicode-bidi:isolate; chips in a dir="ltr" mono span. Render with Playwright Chromium screenshots → ffmpeg across parallel workers (= CPU cores), concat, final libx264 -preset slow at about 5 Mbps.
Specifics:
- One shots.json is the single source of truth for both formats (text, words, beats, layer, altitude, a "formats": ["A","B"] flag). Word counts and holds are computed from it at load time.
- Cloud environment: Chromium is pre-installed at /opt/pw-browsers (PLAYWRIGHT_BROWSERS_PATH is set); do not run "playwright install". If @playwright/test pins another version, launch with executablePath '/opt/pw-browsers/chromium'. [VERIFY by checking the path exists before rendering.]
- Fonts: install via npm @fontsource (assistant, anton, oswald, ibm-plex-mono) and copy the woff2 files locally; if the network blocks npm, try github.com/google/fonts raw files; if both fail, stop and report it. Never render with fallback fonts.
- Before rendering, wait on document.fonts.ready and assert that the computed font-family of every Hebrew node resolves to Assistant.
- The container is temporary: commit and push source after each milestone (pipeline works, first full render, final).
- Do not commit MP4s over 100 MB (GitHub's file limit; [VERIFY: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github]).

[QA LOOP, mandatory]
One still per shot late in its hold → contact sheets → fix bidi glitches, flipped punctuation, text overflow, overlaps and contrast. Brand check on every sheet: only the listed colors, no pink on photos, one gold marker per section at most, no text on the horizon or the sun, white cloud cards with the wing-tip corner, icons with exactly one gold detail, Hebrew rendered in Assistant with no fallback fonts and no italics. Verify the finale shows everything legibly. Verify duration, resolution, fps, loudness and file size. Re-render until clean.
Topic-specific checks:
- "claude.ai/code", "Opus 5.5", "ב-GitHub", "ו-ffmpeg", "ו-PR" and "MP4" must render in the correct order, with the Hebrew prefix letter attached on the correct side and no stray hyphen jumps.
- "?" and ":" in shots 3, 7, 11 and 12 must sit at the visual left end of their Hebrew clause.
- Shot 15 readouts must equal ffprobe's values for the final file and the actual worker count used.
- The 9:16 cut: no text inside 220 px top, 380 px bottom or 120 px right, and none smaller than 44 px.
- Check with ffprobe (duration, 30 fps, resolution, codecs) and ffmpeg loudnorm/ebur128 (-14 LUFS ±0.5, ≤ -1 dBTP).

[DELIVERABLES]
Final MP4(s) + 720p preview + README (shot list with real holds, design system as applied, pipeline) + all source committed and a draft PR. Final message: a one-line summary, a short paragraph, what was synthesized, what to double-check (including every VERIFY item).
Files, all under videos/ya-001-ccm/:
- YA-001-CCM_16x9.mp4, YA-001-CCM_9x16.mp4
- YA-001-CCM_16x9_720p.mp4, YA-001-CCM_9x16_720p.mp4 (the 9:16 preview at 720×1280)
- contact sheets (PNG)
- README.md
- src/
VERIFY list to report back with source links: (1) Claude Code on the web from the Claude mobile app and claude.ai/code; (2) GitHub repo connection flow; (3) cloud environment settings names (network policy, setup script); (4) Opus 5.5 selectable in Claude Code on the web and its model ID claude-opus-5-5; (5) containers are ephemeral; (6) the network policy can block package and font downloads; (7) sessions keep running with the client closed; (8) GitHub's 100 MB file limit. Any item you cannot confirm from an official page: rewrite or remove that on-screen line, re-run the timing, and say so.
```
