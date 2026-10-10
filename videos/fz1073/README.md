# FZ1073: news explainer (YA-051 · NWS)

A Hebrew motion-graphics news explainer with no voiceover about the flydubai FZ1073 incident of 30 September 2026. It uses the YUV.AI "מעל העננים" brand in its restrained **sensitive-news mode**.

| Deliverable | File |
|---|---|
| 16:9 1920×1080 | `out/FZ1073_YA-051_NWS_16x9.mp4` |
| 9:16 1080×1920 | `out/FZ1073_YA-051_NWS_9x16.mp4` |
| 720p preview | `out/FZ1073_YA-051_NWS_preview_720p.mp4` |

Specs: 30 fps · H.264 High · yuv420p · ~5 Mbps · AAC 48 kHz · −14 LUFS / ≤ −1 dBTP · faststart. The final measured values are listed under **QA results**.

Facts were last checked on **1 Oct 2026, 04:15–04:45 UTC (07:15–07:45 Israel time)**. The date stamp on every scene reads `30.9.2026 · עודכן 1.10.2026`.

---

## Shot list (real holds, generated in code)

The holds are computed in `src/index.html` from the strings that are actually on screen. The formula is `max(1.6 s, words × 0.33 s + 0.6 s)`, quantized up to whole beats at 84 BPM (1 beat = 0.714 s). Each attribution chip counts as one word. Shot 1 (title reveal) and shot 13 (end card with logo and sources) keep the brief's fixed 6 and 5 beats. Transitions are 0.6 s each (12 × 0.6 = 7.2 s).

| # | Scene | Words | Beats | Hold (s) | Starts at (s) | Attribution chip |
|---|---|---|---|---|---|---|
| 1 | Opening: "מה קרה בטיסה FZ1073" | 4 | 6 | 4.29 | 0.00 | none (title) |
| 2 | Context + dashed route | 14 | 8 | 5.71 | 4.89 | לפי ynet |
| 3 | Turbulence (card-only 2 px shake) | 15 | 8 | 5.71 | 11.20 | לפי ראש הממשלה |
| 4 | The dive (illustrative altitude line, altimeter falls) | 9 | 5 | 3.57 | 17.51 | לפי הדיווחים |
| 5 | The code (7700 → 7500 seven-segment) | 21 | 11 | 7.86 | 21.69 | לפי Wikipedia ו-Times of Israel |
| 6 | Response (radar sweep, two jet glyphs) | 9 | 5 | 3.57 | 30.14 | לפי Times of Israel |
| 7 | The turn (storm starts to break) | 10 | 6 | 4.29 | 34.31 | לפי ראש הממשלה |
| 8 | Landing (solid diverted route to Tabuk, one soft pulse) | 14 | 8 | 5.71 | 39.20 | לפי flydubai |
| 9 | Why it worked 1: extra crew on board | 7 | 5 | 3.57 | 45.51 | לפי flydubai והדיווחים (shared by 9–11) |
| 10 | Why it worked 2: passengers acted within minutes | 4 | 3 | 2.14 | 49.69 | (shared) |
| 11 | Why it worked 3: **174 אנשים נחתו בשלום** (the only gold marker) | 4 | 3 | 2.14 | 52.43 | (shared) |
| 12 | Now: flydubai suspended Israel flights; investigation continues | 8 | 5 | 3.57 | 55.17 | לפי flydubai |
| 13 | End card: sources, phoenix, wordmark, credit | 3 | 5 | 3.57 | 59.34 | none |

**Total: 62.91 s · 1,887 frames.** That is 3.6 s longer than the brief's estimate of 59.3 s, just outside its ±3 s tolerance. The cause is the formula itself. The brief's table counted shortened strings, while the screen shows more text: shot 5 shows the thin line and both code cards (21 words, not 13), and the chips add one word each. The formula was kept rather than cutting reading time.

## VERIFY outcomes

| # | Item | Outcome |
|---|---|---|
| 1 | Real ADS-B altitude profile | **Not available.** OpenSky historical data needs an account (HTTP 403). The ADS-B Exchange and adsb.lol history files for A6-FKF (hex `8965D1`) were refused or missing. The altitude graphic stays an **illustrative line labelled "המחשה"** with no numbers on it. |
| 2 | Size of the altitude loss | **Not confirmed by a primary source, and reports disagree.** Times of Israel and Wikipedia: 34,000 → ~17,000 ft. CNN: 17,400 ft "in just under two minutes". ynet: ~20,000 ft (34,000 → 14,000). Migflug: ~19,000 ft. All of these are second-hand readings of flight-tracking data, so the vague wording **"אלפי רגל בתוך דקות"** was kept. The words "לפי הדיווחים" moved into the chip so the attribution isn't printed twice. |
| 3 | 7700 and 7500, in that order | **Confirmed.** 7700 first, 7500 about 5–7 minutes later. Times: AeroTime 05:31 / 05:38 UTC, Al Jazeera 05:28 / 05:35 UTC. Times of Israel and Wikipedia agree on the order. |
| 4 | Suspension and investigation status | **Confirmed as of 1 Oct, morning.** flydubai's official statement says flights to and from Israel are suspended "while the investigation continues" (no end date). CNN carries the same statement from a flydubai spokesperson. Separately, Israel suspended flydubai for six days (ynetnews). The UAE GCAA says its investigation is ongoing. The shot 12 chip was changed from "לפי CNN" to **"לפי flydubai"**, the primary source. **Re-check on the day you publish.** |
| 5 | Newer statements that change the core account | **None found.** The later reports add detail but match the account in the video: Saudi authorities, as reported by the WSJ via Wikipedia, assess a deliberate crash attempt with no motive determined; Israel is joining the investigation; GCAA. Rendering went ahead. |

Other source notes:
- The brief's end-card list (CBS News · ynet · Times of Israel · CNN · Wikipedia) was replaced with the sources actually checked: **flydubai · ynet · Times of Israel · Al Jazeera · Wikipedia**. CBS was not reviewed. CNN was read only after the end card was rendered; it corroborates the account.
- "174 אנשים נחתו בשלום": 174 is the number of passengers (ynet; there were also 6 crew). flydubai says "all passengers and crew are safe". Wikipedia also records minor passenger injuries and one passenger taken to hospital, so this line carries an attribution chip.
- Shot 8, "אנשי צוות של flydubai שטסו על הסיפון הנחיתו אותו", matches flydubai's wording: "on-duty flydubai crew travelling on the flight".

### Links (checked 1 Oct 2026)
- flydubai statement: https://news.flydubai.com/updates-on-fz-1073-dxb-tlv-on-30-september-2026
- ynet (174 passengers, 27 children): https://www.ynet.co.il/news/article/sjc00c7q5gx
- Times of Israel (squawks, IAF scramble, altitudes): https://www.timesofisrael.com/copilot-subdued-after-stabbing-pilot-in-alleged-attempt-to-crash-plane-full-of-israelis/
- Wikipedia: https://en.wikipedia.org/wiki/Flydubai_Flight_1073
- Al Jazeera timeline: https://www.aljazeera.com/news/2026/9/30/flydubai-fz1073-timeline-how-the-israel-bound-flight-emergency-unfolded
- AeroTime (squawk times): https://www.aerotime.aero/articles/flydubai-fz1073-diverts-saudi-arabia-7500-code
- CNN: https://www.cnn.com/2026/09/30/middleeast/flydubai-israel-plane-pilot-hijacking-incident-latam-hnk-intl
- ynetnews (6-day Israeli suspension): https://www.ynetnews.com/article/rja2tr9cfl
- Gulf News (suspension): https://gulfnews.com/business/aviation/flydubai-suspends-flights-to-israel-after-fz1073-security-incident-1.500694151
- NPR (PM's account): https://www.npr.org/2026/09/30/nx-s1-5985806/flydubai-flight-dubai-tel-aviv-israel

## Design system as applied

- **Sensitive-news overrides:** no names, nationalities, motive labels, weapons, blood, real people, logos or livery. No macaw wing, no punch-ins, pops, chimes or impacts. Exactly **one** gold marker, on shot 11. The chip "הפרטים עדיין מתבררים" stays in the top rule for the whole video. Every factual line carries a NOTAM-style chip.
- **Colours:** only the brand tokens, plus a muted storm palette built from deep-sky and muted (`--storm-0…4`, no red, no warning yellow). Pink is used only for the chip edges, never on a sky. Gold appears only in the shot 11 marker, the thin horizon line and one detail per icon.
- **Type:** self-hosted Assistant 800/300/600 (Hebrew and Latin), IBM Plex Mono 600 (chips, instruments, codes) and Anton + Oswald 200 (wordmark). The font audit in `build/qa-stills.mjs`, which uses CDP `getPlatformFontsForNode`, finds only these families: **no fallback fonts**. No italics or skew.
- **Cards:** white, 36 px radius, a sharp 6 px corner bottom-left, a 2.5 px deep-sky stroke and the brand shadow.
- **Skies:** high blue → low open sky → muted storm → storm breaking (shots 7–9) → clearing → golden → dawn above a sea of clouds. All are built from gradients and seeded soft cloud puffs, with very slow parallax.
- **Devices:** a top-rule flight strip (boarding strip on the right; date stamp and status chip in the centre; an altimeter on the left that falls in the dive and settles on landing), a bottom rule (wordmark + timecode), dashed and solid route lines, a seven-segment transponder, cockpit line icons on a 48 grid with 2.5 px round strokes and one gold detail each, film grain (4 seeded PNGs cycled per frame) and a vignette.
- **Map:** schematic. Dubai, Tabuk and Tel Aviv sit in roughly correct relative positions from an equirectangular projection. It shows a dashed planned route, a solid diverted leg and the label "המחשה".
- **9:16:** a separate layout that keeps every text inside the safe zone (220 top / 380 bottom / 120 right). Text is at least 44 px and chips at least 30 px; the top-rule instrument strip uses the 30 px chip size.

## Audio

ElevenLabs credits were checked first. The music estimate was 1,800 credits, and the run failed with **"Insufficient funds"**. The score is therefore **procedural**, made with numpy/scipy in `build/audio.py` and seeded so every run is identical:
- warm detuned pads at 84 BPM in D; darker and filtered during the storm, opening up toward the end
- no pulse or drums for the first 20 s, then a soft sub pulse
- sparse bright notes from shot 9, a slow resolve to D, and a fade-out with no end hit
- very quiet SFX at the cue times the page emits: soft air on cloud transitions, a faint tick per transponder digit, a gentle radar sweep in shot 6
- loudness normalised to −14 LUFS, with an oversampled true-peak limiter

## Pipeline

```
npm install                       # gsap
node build/dump-timing.mjs        # page → build/timing-{h,v}.json (CUTS, CUES, DURATION)
node build/qa-stills.mjs          # one still per shot → qa/contact-{h,v}.png + font & safe-zone audit
python3 build/audio.py            # score + SFX → build/tmp/mix.wav (-14 LUFS)
node build/render.mjs h 4         # Playwright Chromium screenshots → ffmpeg, 4 parallel workers → concat
node build/render.mjs v 4
build/finalize.sh                 # mux, libx264 -preset slow ~5 Mbps, AAC, faststart, 720p preview, verify
```

- A single `src/index.html` (`dir="rtl"`, `?fmt=h|v`) holds a paused GSAP timeline. `window.seek(t, frame)` is deterministic: there are no CSS transitions, no timers, and the cloud field and grain are seeded.
- Bidi: every English, number or code token is in a `<bdi>` (FZ1073, 7700, 7500, flydubai, dates, Times of Israel, YA-051).
- Fonts are in `fonts/` (OFL, from @fontsource). The logo `assets/phoenix.png` comes from yuv.ai/logo.png, in its original colours, and appears only on the end card.

## QA results
See `qa/contact-h.png` and `qa/contact-v.png` (one still per shot, late in its hold), plus the final probe below.
