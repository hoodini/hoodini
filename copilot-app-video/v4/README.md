# v4 "Home by 6" — GitHub Copilot app explainer (studio cut)

A 99 s, 44-shot illustrated explainer, built as a **HyperFrames** composition (HTML + GSAP, deterministic render) and checked with `hyperframes check` (lint, runtime, layout, motion, contrast).

| Deliverable | Spec |
|---|---|
| `out/copilot-app-explainer-v4-1080p.mp4` | 1920×1080 · 30 fps · H.264 High · AAC 48 kHz · −14 LUFS |
| `out/copilot-app-explainer-v4-720p.mp4` | 1280×720 preview |

## Why v4 exists (what was wrong with v1–v3)
- **No single visual language.** Every shot used a different trick (neon, glitch, code rain, 3D, confetti). v4 uses **one** flat-vector illustration style and **one** camera language: a hard cut plus a slow push-in.
- **Colours with no harmony.** v4 uses a split-complementary palette built around Copilot purple:
  - Cream `#FFF7EC` for day, deep indigo `#2B2660` for night, ink `#1F1B3A` for text.
  - Purple `#7B5CF0` is the hero colour.
  - Coral `#FF7A5C` means tension, sun `#FFC94A` means warmth, mint `#34C9A0` means success.
  - Each colour has one shade and one tint. No glows, no gradient blobs, no emoji as illustration.
- **Narration that sounded robotic.** v4 has no spoken acronyms ("CI" became "the tests"), a conversational script, and **Chatterbox** (Resemble AI, MIT), a more expressive local voice. Two lines were re-voiced after a transcription check caught "bug" being heard as "boat".
- **No story.** v4 has a real arc (below) with a recurring sidekick and a musical leitmotif.

## Story (Pixar spine)
*Dana always does everything herself.* → *Every night she babysits every branch, review and failing test.* → *One night a Friday release collides with her daughter Mia's first piano recital (6 PM, front row).* → *Because of that, she hands one small bug to an agent (reluctantly).* → *Because of that, the agents work in separate worktree lanes, and Agent Merge watches the tests, keeps an eye on reviewers and fixes what breaks.* → *Until finally, at 6:02 PM, she's in the front row; the release merged at four.*

- **Want vs need:** she wants to ship the release; she needs to let go without losing control. That's why sandboxes, "asks before every change" and "autopilot only when you say so" appear right after the handoff.
- **Humour:** the rubber-duck sidekick (a nod to the app's real Rubber duck skill) sweats, covers its eyes ("we don't talk about that time") and rides in Dana's lane. There's also the 212-notification tower, the pile of reviews burying Dana, Mia's wrong note, and "Very, very carefully".
- **Callbacks:**
  - The 11:47 PM clock pays off at 6:02 PM.
  - The notification tower from Act 1 pours into My Work.
  - The Friday clock in the Agent Merge shot spins to 4:00, then pays off as "Merged at four."
- **Music leitmotif:** *Mary Had a Little Lamb* (public domain). Mia plays it with one wrong note in Act 1, and the piano plays it correctly as a solo at 6:02 PM, the emotional peak. The score is a procedural warm 100 BPM I–V–vi–IV groove (C–G–Am–F) that drops on the reveal.

## Facts on screen (sources in `../README.md` and `../v3/README.md`)
- 180M+ developers build on GitHub — Octoverse 2025 (Oct 28, 2025).
- The app itself: My Work, git worktree per session, Agent Merge (watches checks, tracks required reviewers, fixes failing checks, merges when conditions are met), local/cloud sandboxes, the cloud agent asking before each write, autopilot, model picker with Auto — GitHub Blog (Jun 2, 2026) and GitHub Docs.
- AI Credits: 1 credit = $0.01, token-metered; Pro $10, Pro+ $39, Business $19/user, Enterprise $39/user monthly credits; budgets at user, cost-center and enterprise level — GitHub Blog (Apr 27, 2026) and GitHub Docs.
- 8 new features 19 days after launch, plus an open GitHub Community feedback thread — GitHub Changelog (May 14 and Jun 2, 2026).

## Disclosures
- **Characters:** Dana and Mia are fictional, labelled "Dramatization" on screen.
- **UI:** all app UI is recreated and labelled "Illustrative UI". Model names are not shown.
- **Community comments:** the example comments in the feedback-thread card are illustrative, and labelled that way on screen.
- **Voice:** Chatterbox TTS. ElevenLabs was declined, so the voice is synthetic but far more natural than Kokoro.

## Build
```
/tmp/cbx/bin/python scripts/tts_chatterbox.py   # VO (Chatterbox, per line, seeded)
python3 scripts/align.py                         # faster-whisper word timings → src/timeline.json
python3 scripts/build_data.py                    # bundle src/* into a single-scope index.html (HyperFrames-safe)
node scripts/qa.mjs .75                          # per-shot stills + page-emitted SFX cues → audio/cues.json
python3 scripts/audio_v4.py && scripts/master.sh # score + SFX + VO ducking → −14 LUFS
npx hyperframes check . && npx hyperframes render . -q high -o out/render_raw.mp4
scripts/final.sh                                 # X deliverables
```
