# v5 "Home by 6": final cut

This is a 90 s explainer for the **GitHub Copilot app**. It combines one illustrated story (Dana, a tech lead, and her daughter Mia's recital) with the **real product UI**, taken from GitHub's official screenshot.

It is built as a HyperFrames composition (HTML + GSAP, deterministic render). `hyperframes check` passes.

| Deliverable | Spec |
|---|---|
| `out/copilot-app-explainer-v5-1080p.mp4` | 1920×1080 · 30 fps · H.264 High · AAC 48 kHz · −14 LUFS |
| `out/copilot-app-explainer-v5-720p.mp4` | 1280×720 preview |

## What changed vs v4 (and why)
- **Real product, not a mock-up.**
  - Every feature beat now happens on GitHub's official app screenshot (Changelog, Jun 2 2026), shown with a camera push-in, highlight rings and callouts:
    - My Work
    - the prompt box, with the bug typed in
    - the model picker
    - the session list (worktrees)
    - Check Status plus the Merge button (Agent Merge)
    - Autopilot
  - The screenshot is labelled "Real product UI" on screen. Recreated UI is gone.
- **Built for a leadership audience.**
  - The billing section is cut: it was accurate, but it pulled focus in a 90 s film.
  - Three new beats were added, each verified against primary sources:
    - the model picker and Auto
    - local and cloud sandboxes
    - the GitHub Community discussion
- **Clean voice, measured.** The best of 3 seeded Chatterbox takes is picked per line: a script-matched transcript first, then objective speech quality (torchaudio SQUIM, reference-free PESQ; all picks score 3.8–4.1). Pacing comes from pauses between lines, not from time-stretching.
  - *Lesson learned:* an earlier v5 build slowed the voice 6% with Rubber Band. SQUIM showed this cut PESQ from about 3.8 to 1.2–2.0 (audibly metallic), so it was removed. The mastering chain was checked and leaves PESQ unchanged (3.82 → 3.84).
- **Real instruments.** The score is arranged in code (mido) and rendered with FluidSynth using the FluidR3 GM soundfont (piano, strings, pizzicato, harp, celesta, bass, drums), not synthesised sine waves. The leitmotif is *Mary Had a Little Lamb* (public domain). Mia plays it with one wrong note in Act 1, and it is played correctly as a solo piano at 6:02 PM.
- **QA fixes.**
  - The screenshot's edge never enters the frame on close-ups.
  - No element appears before its entrance.
  - Source footers no longer collide with captions.

## Facts on screen (checked 2026-09-30; all links returned HTTP 200)
| Claim | Source |
|---|---|
| 180M+ developers build on GitHub | [Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) (Oct 28 2025) |
| Desktop home for agents; My Work; worktree per session; Agent Merge | [GitHub Blog, Jun 2 2026](https://github.blog/news-insights/product-news/github-copilot-app-the-agent-native-desktop-experience/) |
| "Cloud and local sandboxes … on your local machine or in the cloud" | same post |
| "By default, the cloud agent asks permission before each write action. Switch to autopilot once you have established trust." | same post |
| "If you choose **Auto** in the model picker, the app automatically selects the optimal model" | [GitHub Docs: agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions) |
| 8 new features on Jun 2, 19 days after the May 14 launch (Canvases, Voice, Cloud sessions, Cloud automations, CLI sessions in My Work, Agentic browsing, Rubber duck, /chronicle) | [Changelog May 14](https://github.blog/changelog/2026-05-14-github-copilot-app-is-now-available-in-technical-preview/) · [Changelog Jun 2](https://github.blog/changelog/2026-06-02-expanded-technical-preview-availability-for-the-github-copilot-app/) |
| "Join the discussion within GitHub Community" | Changelog Jun 2 (links to discussion #197303) |

**Dropped or corrected claims**
- A draft line said "every update comes with an open feedback thread". The May 14 post has no such link, so the line was re-voiced as "developers can join the discussion, right in GitHub Community".
- The billing and AI Credits figures from v4 were cut for focus, not for accuracy (v4's README keeps them with sources).

## Disclosures
- Dana, Mia and the duck are fictional, and labelled "Dramatization".
- The typed prompt text ("Fix #1284 …") and the illustrated PR card are illustrative overlays. The app window itself is GitHub's screenshot.
- The voice is synthetic (Chatterbox TTS, MIT).

## Build
```
/tmp/cbx/bin/python scripts/tts_takes.py   # 3 seeded takes per line (+ scripts/tts_extra.py for added lines)
python3 scripts/pick_takes.py              # pick per line: transcript match, then SQUIM PESQ
/tmp/cbx/bin/python scripts/squim_takes.py # objective quality score per take (no time-stretch: it degraded the voice)
python3 scripts/align.py                   # word timings → src/timeline.json
python3 scripts/build_data.py              # single-scope index.html
node scripts/qa.mjs .75                    # stills + SFX cues (serve repo root on :8765)
python3 scripts/audio_v5.py && scripts/master.sh
npx hyperframes@0.8.94 check . && npx hyperframes@0.8.94 render . -q high -w 4 -o out/render_raw.mp4
scripts/final.sh
```
