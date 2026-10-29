# The editing playbook: what works, what fails, and the evidence

This file distils the October 2026 research behind this skill. The full report is "עריכת וידאו של יוטיוברים טכנולוגיים" and covers 4 research tracks and 60+ sources. Claims are marked **[verified]** when they were observed in top creators' videos or are backed by data, and **[inference]** when they are sound practice without direct proof. Use the evidence level when deciding how hard to push a rule.

## 1. What the winners actually do

**Who leads:** MKBHD, Mrwhosetheboss, Unbox Therapy, Linus Tech Tips, plus style channels like Dave2D, JerryRigEverything, Jonathan Morrison and MrMobile. No single authoritative 2026 ranking exists.

**iPhone 17 / Air cycle (views as of Oct 2026):**

| Video | Views | Note |
|---|---|---|
| MKBHD event-day "Impressions: Spot the Red Flags!" | 14.1M | his 5 videos on the cycle total about 50M |
| JerryRigEverything "iPhone Air durability test" | 13.0M | one visual event, the bend, not fancy editing |
| Mrwhosetheboss "Hands on" | 9.1M | |

[verified]

### What repeats [verified, from chapters, descriptions and titles]
- **Titles built on tension:** "Paradox in a Box!", "Beauty is Pain", "No Asterisks!", "What Apple didn't tell you!"
- **A thesis cold open of 1–2 minutes.** MKBHD's opening chapters ran 1:09–2:01.
- **Chapters that escalate an argument.** The Air review goes Small → Medium → Main Concerns → Future.
- **One sponsor read at minutes 3–5,** placed after the hook has paid off.
- **One test segment that produces a clear visual:** a battery graph, a camera side-by-side, a stress test.
- **A signature product B-roll move.** MKBHD's robot-arm swoops (about $250K) are the extreme case. A motorised slider or turntable repeated in every video is the affordable version.
- **CTAs live mostly in the description.** A soft subscribe ask ("you'd make my day") and a series hook ("Reviews incoming.").
- **Lengths of 9–16 minutes.** MKBHD says videos grew from 3–4 minutes to 9–14 minutes as viewing moved to TVs.
- **Timing in waves:** impressions on event day, the unboxing at embargo lift, then one review per model. Timing beat editing.

**The team model** [verified]:
- MKBHD has about 17 staff and turns a video around in 4–5 days. He keeps the "three hearts" himself: on camera, writing and testing.
- Mrwhosetheboss reportedly gives his editors written style guides (weak source).
- The lesson for an AI editor: **this skill is the style guide.** Consistency is the signature.

**One verified note on polish:** the press praised HTX Studio's iPhone 17 Pro review because its editing "drives the narrative without creating unrest" and each transition is "justification, not decoration". Even there, some viewers said it was *too fast*.

## 2. Pace: the evidence contradicts "faster is always better"

- **Dost & Huang (2026)** [verified, conference paper]:
  - In 50 top informational talking-head clips, the median was about 0.33 cuts per second (≈20/min). The 16th–84th percentile range was about 11–31/min.
  - In an experiment with N=242, seamless jump cuts helped only at medium or high pace.
  - Slight audio-overlap cuts raised engagement, peaking at medium pace.
  - "Higher pacing reduced sustained engagement overall." The authors' advice: anchor near the median.
  - Limit: 20-second clips, so applying this to long-form is an extrapolation.
- **Lang (media psychology)** [verified, older]: cuts trigger orienting responses (attention), but as the information load rises, memory falls. The densest messages were rated *more enjoyable and remembered less*. This is exactly the tech-review trap: specs plus on-screen text plus dense cuts.
- **Stuppy et al., JMR 2024** [verified]: slow motion raised liking and willingness to pay through processing fluency. Speed helps only when the viewer wants excitement.
- **Cutting et al. 2010** [verified]: the *rhythm and variety* of shot lengths holds attention, not only the average length.
- **MrBeast memo** [leaked, disputed]: quick scene changes are for *simple* content.
- **YouTube's Todd Beaupré, Sept 2026:** "We don't want to just assume that all time is valuable."
- **Not proven:** "a cut every 2–4 seconds" and "3.3× completion" come from unsourced blogs.

**Rules this skill applies:**
- Talking-head long-form: 12–28 visual changes per minute. Reels: 20–45.
- Slow down for data and the verdict; speed up for low-information stretches.
- Vary shot lengths.
- `qa.py` warns outside these ranges.

## 3. Hooks, retention and CTAs

**YouTube's own measures:**
- The Intro metric is the share of viewers still watching at 30 s, framed as "did the opening match the title and thumbnail". [verified]
- Test & Compare tests up to 3 titles or thumbnails and picks the winner by **watch-time share, not CTR**. Editing the video mid-test resets it. [verified]
- **Since 17 Dec 2025 viewers can hide end screens.** Design the CTA "as part of the video experience" and plan the last ~20 s for it. [verified]

**Benchmarks:**
- vidIQ (June 2026): at least 60% still watching at 30 s is good, and strong hooks exceed 65%. About 30% average view percentage is good for a 6–9 minute explainer. [verified, vendor]
- Subscriber CTR is typically 10% or less, and "subscribing isn't as strong as people think" (YouTube, Sept 2026). [verified]

**So:**
- Open on the claim.
- Ask once, after the payoff, as a series CTA.
- Put links and the detailed asks in the description.

## 4. Visual techniques: status and tools (2026)

| Technique | Evidence | Tool reality 2026 | This skill |
|---|---|---|---|
| Motion-control product B-roll | [verified] MKBHD's signature | MRMC Cinebot Mini, motorised sliders | shoot it; `video` cover with a slow push |
| Shooting on the device under review | [verified] "shot on iPhone 17 Pro" credit | — | recommend in the shot list |
| Keynote-style motion graphics | [partly verified] iJustine sells a MotionVFX mKeynote plugin; MKBHD has motion staff | AE 26 variable-font animation, Resolve 21 Fusion | `title`, `stat`, `compare` in Phoenix Ink |
| Text behind subject | [not verified in these videos] common practice | Premiere 26 Object Mask, AE Object Matte, Resolve Magic Mask 2, CapCut Auto removal | `behind_subject` with a rembg matte; ≤ 1 per 2 min |
| 2.5D / Z-axis / DOF on product renders | [not verified] likely in event-day videos made before review units arrive | AE 26.3 depth of field (Advanced 3D, no motion blur) | `card3d`, `parallax` |
| Punch-in, whip, shake | [not verified; weak source on Mrwhosetheboss's "constant motion"] | presets | `zoom`, `transition: whip`, `shake` (use sparingly) |
| Screen auto-zoom | general practice | Screen Studio (macOS) | `screen` kind + `screen_zoom.py` |
| Overlays: light leaks, grain, glow filters | no 2025–26 source | — | not in the default look (Phoenix Ink is clean). The **glow ring** around plates, cards and the avatar is different: it is Yuval's signature (see SKILL.md) |

**Why text behind the subject works** [inference]: occlusion is a depth cue, so the brain reads the words as part of the 3D scene. **Why it stops working:** everyone can do it now with one click. Scarcity is what keeps it special.

## 5. Sound

- **Beat sync:** no study tests cutting on beats. The nearest evidence is that viewers judge audio-visual sync by the *end of a motion and the moment of impact*. So start the motion before the beat and land it on the beat. [inference from indirect evidence]
- **Risers and whooshes:** Epidemic Sound's guidance is that the riser's peak lands on the cut or reveal, and a riser followed by a whoosh makes a full transition. They also warn that "overusing sound effects back to back can make cuts feel mechanical." [verified, vendor guidance]
- **Music sources:** Mrwhosetheboss and iJustine use Epidemic Sound, Max Tech uses Soundstripe, and MKBHD uses branded intro music. [verified]
- **Loudness:** YouTube publishes no official LUFS spec. The observed behaviour is that it turns uploads down toward about −14 LUFS integrated and never boosts quiet ones. Use −1 dBTP as the ceiling and duck the music under the dialogue. [rule of thumb]

## 6. Rights: Apple and brand footage

- Apple Newsroom offers press-kit downloads but **states no licence**, and Apple's guidelines require express written permission to use its photographs. [verified]
- YouTube's fair-use guidance [verified]:
  - credit alone does not make a copy fair use;
  - there are no "magic words";
  - a claim can come from a few seconds of footage.
- **Practice:** keep it short, under critical or comparative commentary, transformed (cropped, marked, side-by-side). Prefer your own B-roll and screen captures.

## 7. Open gaps (be honest when Yuval asks)

- No public data links cuts per minute to long-form YouTube retention curves.
- No frame-level measurement exists of MKBHD's versus Mrwhosetheboss's pacing. The highest-value next step is to run PySceneDetect on 3–4 of the iPhone 17 videos and compare against his own retention dips.
