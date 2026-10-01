# FZ1073: news trailer (YA-052 · NWS)

A no-voiceover action-thriller news trailer in Hebrew about the flydubai flight FZ1073 incident (Wednesday 30 September 2026), built on the YUV.AI "מעל העננים" brand system.
**Credit:** YUVAL AVIDANI · YUV.AI · **Facts last checked:** 1 Oct 2026, 04:15–04:35 UTC (07:15–07:35 Israel time).

| Deliverable | Spec |
|---|---|
| `out/FZ1073_trailer_9x16.mp4` | 1080×1920, 30 fps, H.264 High ~5 Mbps + AAC 48 kHz, 39.45 s / 1,184 frames |
| `out/FZ1073_trailer_16x9.mp4` | 1920×1080 re-layout with a 2.39:1 letterbox, same audio |
| `out/FZ1073_trailer_9x16_720p_preview.mp4` | 720×1280 preview |

Audio is mixed to −14.0 LUFS integrated. True peak is about −1.6 dBTP (the target was ≤ −1 dBTP). The measured values for each file are at the end of `out/build.log`.

## Shot list (real holds, computed in code)
The formula is `hold = max(0.45 s, words × 0.22 s + 0.25 s)`, rounded up to whole beats at 128 BPM (1 beat = 0.469 s). The minimum is 2 beats, so no line is on screen for less than 0.9 s. Each transition is 0.3 s. The word count covers the headline plus its Assistant 300 counter-line. Shots 1, 19 and 20 have fixed holds: the cold open (taken from the brief's table) and the two requested extensions.

| # | Scene | Headline | Counter-line | Words | Formula (s) | Beats | Hold (s) | Start (s) |
|---|---|---|---|---|---|---|---|---|
| 1 | Cold open | 30.9.2026 | — | 1 | 0.47 | 5 | 2.34 | 0.00 |
| 2 | Route | דובאי ← תל אביב | FZ1073 | 4 | 1.13 | 3 | 1.41 | 2.64 |
| 3 | Souls on board | 174 נוסעים | — | 2 | 0.69 | 2 | 0.94 | 4.35 |
| 4 | Souls on board 2 | 27 מהם ילדים | — | 3 | 0.91 | 2 | 0.94 | 5.59 |
| 5 | Cruise | גובה שיוט | 34,000 רגל | 4 | 1.13 | 3 | 1.41 | 6.83 |
| 6 | Silence | ואז | — | 1 | 0.47 | 2 | 0.94 | 8.53 |
| 7 | Cockpit | תא הטייס | — | 2 | 0.69 | 2 | 0.94 | 9.77 |
| 8 | Attack | טייס אחד דקר את השני | באמצע הטיסה | 7 | 1.79 | 4 | 1.88 | 11.01 |
| 9 | Intent | וניסה להפיל את המטוס | החקירה נמשכת | 6 | 1.57 | 4 | 1.88 | 13.18 |
| 10 | Dive | המטוס צולל | אלפי רגל בשניות | 5 | 1.35 | 3 | 1.41 | 15.36 |
| 11 | Squawk 1 | 7700 מצב חירום | קוד מצוקה | 5 | 1.35 | 3 | 1.41 | 17.06 |
| 12 | Squawk 2 | 7500 חטיפה | הקוד שודר 7 דקות אחרי | 7 | 1.79 | 4 | 1.88 | 18.77 |
| 13 | Scramble | מטוסי קרב באוויר | הוזנקו מישראל | 5 | 1.35 | 3 | 1.41 | 20.94 |
| 14 | Turn | הנוסעים לא חיכו | — | 3 | 0.91 | 2 | 0.94 | 22.65 |
| 15 | Breach | הם נכנסו לתא הטייס | הקברניט הפצוע פתח את הדלת | 9 | 2.23 | 5 | 2.34 | 23.89 |
| 16 | Subdue | והשתלטו על התוקף | עם הצוות | 5 | 1.35 | 3 | 1.41 | 26.53 |
| 17 | Control | אנשי צוות על הסיפון לקחו פיקוד | של flydubai | 8 | 2.01 | 5 | 2.34 | 28.24 |
| 18 | Landing | נחיתה בטוחה בתבוק | — | 3 | 0.91 | 2 | 0.94 | 30.88 |
| 19 | Hero (extended) | 174 **נוסעים** נחתו בשלום | — | 4 | 1.13 | 6 | 2.81 | 32.12 |
| 20 | End card (extended) | הפרטים עדיין מתבררים | sources + credit | 3 | 0.91 | 9 | 4.22 | 35.23 |

The total is 39.45 s. That is 33.75 s of holds plus 19 × 0.3 s of transitions, which is +1.45 s against the brief's 38.0 s target and inside the allowed ±2 s.

**Attribution chips.** Each chip stays up for its whole shot group:

| Shots | Chip |
|---|---|
| 2 | לפי flydubai |
| 3–4 | לפי ynet |
| 5 | לפי Times of Israel |
| 8–9 | לפי ראש הממשלה |
| 10 | לפי הדיווחים |
| 11–13 | לפי Wikipedia ו-Times of Israel |
| 14–16 | לפי ראש הממשלה |
| 17–19 | לפי flydubai |

**Changes from the brief, and why:**
- **Shot 19 says "174 נוסעים" instead of "174 אנשים".** Wikipedia lists 180 people on board: 174 passengers and 6 crew. The captain was seriously injured, so "174 people landed safely" would be inaccurate.
- **Counter-lines were added.** The brief's word counts imply a second line per shot, so each shot got a sourced counter-line.
- **Shot 15 gained the counter "הקברניט הפצוע פתח את הדלת".** It is per the Prime Minister, reported by Times of Israel and CBS. It adds one beat.
- **New chips for shots 2 and 5.** "Attribute every claim" covers the route/flight number and the 34,000 ft cruise figure too.
- **The flydubai chip runs through shot 19.** "Landed safely, all passengers accounted for" is flydubai's own wording.

## VERIFY outcomes (checked 1 Oct 2026, ~07:15–07:35 IDT)
1. **ADS-B altitude profile: not verified from raw data.** I could not pull the FR24 or ADS-B Exchange track. Outlets that cite Flightradar24 report a drop from 34,000 to about 17,000 ft in under a minute (one figure is 14,125 ft in 29 s), a climb to 21,750 ft, then a level-off at about 15,000 ft. Sources: [Times of Israel](https://www.timesofisrael.com/liveblog_entry/what-we-know-about-the-flydubai-plane-incident/), [Wikipedia](https://en.wikipedia.org/wiki/Flydubai_Flight_1073), [ynet](https://www.ynet.co.il/news/article/r17juuqqme). The altimeter follows this shape and every altitude graphic is labelled **"המחשה"**.
2. **7700 then 7500: confirmed, in that order.** 7700 at 08:31 and 7500 at 08:38 Israel time (05:31 and 05:38 UTC). Sources: [ynet minute-by-minute](https://www.ynet.co.il/news/article/r17juuqqme), [AeroTime](https://www.aerotime.aero/articles/flydubai-fz1073-diverts-saudi-arabia-7500-code), [Times of Israel](https://www.timesofisrael.com/liveblog_entry/what-we-know-about-the-flydubai-plane-incident/).
3. **IAF scrambled fighter jets: confirmed, but by media reports.** Times of Israel, ynet and Wikipedia report it. I did not find a primary IDF statement. Shot 13 is attributed to Wikipedia and Times of Israel.
4. **Passengers entered the cockpit, and on-board flydubai crew landed at Tabuk: confirmed.**
   - The Prime Minister said the wounded captain unlocked the door and Israeli passengers went in and subdued the co-pilot ([CBS News](https://www.cbsnews.com/news/netanyahu-too-early-to-determine-motive-flydubai-cockpit-stabbing/), [Times of Israel](https://www.timesofisrael.com/liveblog-september-30-2026/)).
   - flydubai's statement says: "secured by on-duty flydubai crew travelling on the flight, who diverted and landed the aircraft safely at Tabuk" ([flydubai newsroom](https://news.flydubai.com/updates-on-fz-1073-dxb-tlv-on-30-september-2026)).
5. **Newer statements: the core account is unchanged.**
   - flydubai suspended Israel flights. It says motives are unknown and urges against speculation.
   - The UAE GCAA's investigation is ongoing ([Aletihad](https://en.aletihad.ae/amp/news/uae/4695652/gcaa--security-incident-involving-flydubai-flight-fz1073--bo)).
   - Netanyahu said it is too early to determine motive ([CBS](https://www.cbsnews.com/news/netanyahu-too-early-to-determine-motive-flydubai-cockpit-stabbing/)).

Other sources:
- [CNN](https://www.cnn.com/2026/09/30/middleeast/flydubai-israel-plane-pilot-hijacking-incident-latam-hnk-intl)
- [ynet: 174 passengers, 27 children](https://www.ynet.co.il/news/article/hy4xjs99fg)

## Sensitivity rules applied
- **Nothing identifying anyone.** No names or nationalities of the attacker or the injured pilot. No motive labels: the words פיגוע, טרור and ג'יהאד do not appear.
- **No violent or real imagery.** No weapons, blood, reconstruction, real footage or photos, airline logos or livery, and no crash imagery or sound.
- **Silhouettes.** They are faceless flat shapes in deep-sky against light, and they only rise or stand. They are never shown attacking.
- **Permanent chip.** "הפרטים עדיין מתבררים" sits in the top rule, which hides during the act-2 black cuts.
- **Schematic graphics carry a "המחשה" tag.** This covers the route maps, seat map, altimeter, door, transponder, radar and silhouettes.

## Design system as applied
- **Palette.** Only the listed tokens, plus gradients between them. Black #05070D is used for act 2 and the letterbox.
  - A pixel audit of the QA stills found **no red or warning-yellow pixels**.
  - sun-gold appears **only on shot 19**: the marker behind "בשלום", wiping right to left, plus the horizon line.
  - The phoenix keeps its original colors and appears on the end card only.
- **Type.** All files are self-hosted from github.com/google/fonts:
  - Hebrew: Assistant 800 and 300.
  - Inline English and numbers in headlines: Anton.
  - Codes, instruments and English inside chips: IBM Plex Mono 600.
  - Wordmark: "YUV" in Anton + ".AI" in Oswald 200.
  - A fontTools cmap check found **zero missing glyphs** for every string in the font it is set in.
- **Two deviations to know about:**
  - IBM Plex Mono has no Hebrew glyphs, so the Hebrew words inside the mono chips ("לפי…") are set in Assistant 700. The English inside them stays in Plex Mono.
  - The "←" is drawn as an inline SVG, so no fallback font is involved.
- **Bidi.** Every Latin, number or code token sits in `<bdi>` (`unicode-bidi: isolate`). On the QA sheets, "דובאי ← תל אביב", "34,000 רגל", "לפי Wikipedia ו-Times of Israel", the date stamp and the 7700/7500 codes all read correctly.
- **Layout and readability:**
  - 9:16 safe zone: 220 px top, 380 px bottom, 120 px on both sides.
  - Headlines run 140–220 px, which is over the 96 px minimum. Chips are 34 px in 9:16 and 30 px in 16:9.
  - White text sits on a scrim with a two-layer shadow.
  - Text never sits on the horizon or the sun.
- **Motion.**
  - Every line slams in on its cut with a 2-frame overshoot.
  - Punch-ins of 7–10% run on shots 8, 9, 12, 15 and 17. The scene is also punched 8–12% on 10 and 13.
  - An 8-frame whip blur through cloud runs at act 2→3 and act 3→4. The cut into act 2 is a hard cut to black.
  - Shot 10 has a ≤6 px handheld shake on the background layer only.
  - The transponder digits slam in one at a time, 7700 flips to 7500, the radar sweeps twice, and the silhouettes rise from below.
  - Shot 19 runs the background and particles at 50% speed.
  - Film grain cycles through 4 pre-rendered tiles, with a soft vignette.

## Audio
- **ElevenLabs:** the connected MCP server has no credits or subscription endpoint and no music tool, and there is no API key in the environment. I could not check credits, so the score is procedural (numpy/scipy, `src/audio.py`), generated from the CUES the page emits.
- **Act 1:** airy pad and pulse.
- **The cut to black:** a hard stop, then exactly 0.3 s of digital silence, then one low heartbeat.
- **Act 2:** a sub hit on each line, plus a drone.
- **Act 3:** taiko-style toms, a 16th-note synth pulse, rising wind in the dive, soft transponder ticks, radar pings, and air whooshes on the whips.
- **Act 4:** a build of toms in 8ths then 16ths, a riser and chord stabs, then a swell on the landing.
- **Shot 19:** full drop-out into a warm D-major pad with bells.
- **End card:** a soft resolve.
- **Not used:** vocals, alarm-like tones, impacts, screams, gunshots or blade sounds.
- **Mixing:** one linear gain to −14 LUFS.

## Pipeline
```
src/shots.js      shot list + timing (formula → beat quantize → fixed extensions), chips
src/main.js       RTL page, GSAP paused master timeline + deterministic procedural layer; window.seek(t, frame); window.CUES
src/style.css     tokens, @font-face, layout
src/gen_assets.py seeded cloud sprites (calm / storm / dawn) + 4 grain tiles
src/render.py     local http server → Playwright Chromium screenshots → ffmpeg; N parallel workers (= CPU cores) → concat
src/audio.py      procedural score + SFX from CUES
src/build.sh      full build: assets → cues → score → loudness → both formats → final libx264 -preset slow, faststart → checks
```
Run `src/build.sh` (needs ffmpeg, Python with playwright, numpy, scipy and pillow, and a Chromium under /opt/pw-browsers). The QA contact sheets are in `qa/`.
