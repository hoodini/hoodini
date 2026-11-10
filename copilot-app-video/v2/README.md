# v2 "NEON" — GitHub Copilot app explainer (high-energy cut)

A 93 s, 54-shot rework of v1. It keeps v1's verified facts and changes everything else.

| Deliverable | Spec |
|---|---|
| `out/copilot-app-explainer-v2-1080p.mp4` | 1920×1080 · 30 fps · H.264 High · AAC 48 kHz · −14 LUFS |
| `out/copilot-app-explainer-v2-720p.mp4` | 1280×720 preview, < 30 MB |

## What changed vs v1
- **Palette:** Primer-dark is replaced by an animated neon gradient mesh (lime `#A3E635`, cyan `#22D3EE`, purple `#A855F7`, pink `#FF2E88`, amber `#FBBF24`). There are also hard-cut solid frames in pink, lime, amber and purple.
- **Matrix code rain:** a deterministic canvas of code tokens, git keywords and katakana behind the terminal, worktree, merge and demo shots.
- **3D:**
  - macOS-style app windows fly in from depth and float in perspective.
  - A 3D tab ring and a 3D model carousel.
  - Glass sandbox cubes and a card flip for "switch model mid-task".
  - A contribution-graph tunnel into the drop.
  - A dotted spinning globe.
  - A phone-to-laptop mirroring scene.
- **Motion:** RGB-split glitch type, particle bursts, confetti on merge, a warp-speed autopilot, extruded 3D type, a beat-pumped world zoom and more jump cuts.
- **Captions:** TikTok-style, up to 4 words at a time. The active word pops in a cycling neon colour.
- **Music:** the 140 BPM trap bed now has a supersaw lead, sidechain-pumped pads, and an impact plus reverse swell at every section start.

## Attention design (and its guardrails)
| Technique | Where | Guardrail |
|---|---|---|
| Pattern interrupt | Glitch "STOP SCROLLING." with flash and boom at 0 s | — |
| Open loop / curiosity gap | "a build at the end you'll want to steal", a blurred app tease, "reveal in 3…" | The loop closes at 63 s (concept build) |
| Progress / completion drive | Gradient progress bar, "CH 03/12" chapter chip | — |
| Variable reward | CI checks flipping green with rising dings, the MERGED stamp and confetti | — |
| Social proof | "commits nearly doubled… 1.4 billion per month" | Quoted verbatim from the GitHub Blog (Jun 2, 2026), with the source on screen |
| Honest objection handling | "The catch? … metered in tokens" | States the real downside before the cap |
| Urgency | "LIVE NOW · technical preview" | True: available to existing Pro, Pro+, Business and Enterprise users |
| Identity / status | "devs who start today are already ahead" | Opinion, not a statistic |

Not used: fake scarcity, invented numbers or fake testimonials.

## Concept demo disclosure
The **phone → Windows mirroring build** (five agents, one weekend) is a **concept illustration**. It's labelled on screen as "concept demo · illustrative — not an official GitHub showcase". It shows the kind of parallel-agent workflow the app supports; it is not a real project or a claim about GitHub. All app UI is recreated ("illustrative UI"). Model names are placeholders.

## Sources
The same primary sources as the v1 README (`../README.md`), plus the proof line, which comes from source [1]: GitHub Blog, 2026-06-02 — “commits nearly doubled year over year, crossing 1.4 billion per month”.

## Voice
ElevenLabs was checked again and still has 16 credits (25+ needed even for a 2-word probe). The voice is Kokoro-82M `af_heart` at speed 1.25.

## Rebuild
From `v2/`, with the server rooted at `copilot-app-video/`:
`python3 scripts/tts.py && python3 scripts/align.py && python3 scripts/build_assets.py && node scripts/render.mjs && python3 scripts/audio.py && scripts/master.sh && scripts/final.sh`
