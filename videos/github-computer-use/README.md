# GitHub Copilot · Computer Use: a 33-second motion film

A one-take, code-only motion film (YUV.AI **Phoenix Day**) about the new **Computer Use** feature in the GitHub Copilot app.
Both layouts come from one `seek(t)` engine: **16:9 (1920×1080)** and **9:16 (1080×1920)**, 60 fps with 6-subframe motion blur, H.264 yuv420p BT.709, −14 LUFS.

**The one idea (lands on the drop, 16.00 s):** *Copilot now uses your desktop apps, even the ones with no API.*

| | |
|---|---|
| Length | 32.9 s · 64 beats + the logo beat · 1,974 frames per layout |
| Track | "Electro Dreams" by Arulo, Mixkit #190, Mixkit Stock Music Free License (raw audio is not in this repo) |
| Tempo | 120.001 BPM, grid fitted to the measured kick hits (0.84 ms rms residual; the automatic grid was 31 ms early) |
| Drop | song 64.031 s = film beat 32 = 16.000 s |
| SFX | 124 cues from 21 Mixkit sound effects, each placed so its **measured peak** lands on the event |
| Icons | official GitHub **Octicons** v19.40.0 (MIT, © GitHub Inc.): `copilot-96`, `copilot-24`, `gear`, `device-desktop`, `terminal`, `shield-check`, `stop`, `trash`, `file`, `paperclip`, … |
| Type | Anton (display/labels), Inter (UI), JetBrains Mono (commands). No Hebrew in this film (all copy is English) |

## Story in one take (every scene is made out of the previous one)

1. **01 ASK** (b0–11): the Copilot mark pops in a white disc → the disc stretches into the neon prompt pill → "File my expenses in Ledger 98" types at 16ths. Hook: *YOUR AGENT GOT HANDS.*
2. **02 WALL** (b12–19): the pill grows into **Ledger 98**, a fictional legacy, GUI-only app. API / CLI / MCP get struck. *GUI ONLY.* · *CLICK. CLICK.*
3. **03 SWITCH** (b20–31): the window morphs into the Copilot app **Settings → Computer Use → Enable Computer Use**; the toggle knob stretches on two springs; macOS **Accessibility** + **Screen Recording** granted; a toast grows into the approval card (**Decline / Always allow / Allow**); the camera pushes in on Allow.
4. **04 IDEA** (b32–35, the drop): a fire flood pours out of Allow, navy follows: *COPILOT NOW USES YOUR DESKTOP APPS.* · *EVEN THE ONES WITH NO API.* · macOS · Windows · app + CLI.
5. **05 HOW** (b36–51): the night shrinks back into the window; Copilot's own cursor **READS** (scan line, dotted accessibility boxes, role chips), **CLICKS**, **TYPES** (32nds), **DRAGS** a receipt across apps from a Finder window.
6. **06 CONTROL** (b52–55): Submit → the window collapses into a pill → *APPROVE EACH APP · STOP ANYTIME · ESC · RESET ALWAYS-ALLOWED APPS.*
7. **07 GET IT** (b56–59): the chips merge into the neon CTA: `/computer on` · *Settings › Computer Use › Enable*.
8. **END** (b60–64): navy flood → *COMPUTER USE* → everything shrinks to a point → the point becomes the YUV.AI phoenix on the last beat.

Full beat-by-beat table with the SFX on each beat: [`beatmap.md`](beatmap.md). Cue sheet: [`cues.json`](cues.json).

## Facts used (checked 17 Oct 2026)

- Computer use entered **public preview on Oct 1, 2026** in **Copilot CLI and the GitHub Copilot app**, on **macOS and Windows** (local sessions). Copilot can read app content, click controls, enter text, press keys, scroll, drag and move through workflows across apps, including legacy/GUI-only software with no API, CLI or MCP integration. Source: [GitHub Changelog, 2026-10-01](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/)
- Enable it in **Settings → Computer Use → Enable Computer Use**, or `/computer on` (`/computer show`, `/computer off`). macOS needs **Accessibility** and **Screen Recording**. Approval follows the **Tool Permissions** setting: allow for the session, **Always allow**, or decline; **Stop** or **Esc** interrupts; always-allowed apps can be removed in settings. Source: [GitHub Docs: Using the GitHub Copilot app to interact with desktop applications](https://docs.github.com/en/copilot/how-tos/github-copilot-app/computer-use)
- The Copilot app itself: [GitHub Docs: GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)

The expense-report workflow mirrors the example screenshot in the changelog. "Ledger 98", the report, the amounts and the file names are **fictional**. The approval card text paraphrases the docs; GitHub's exact dialog wording may differ.

## Build, check, render

```bash
npm i
mkdir -p brand && cp <yuv-design-system>/assets/logo-square-transparent.png brand/   # private, never committed
node build.mjs                                                   # -> out/film.html (self-contained, fonts inlined)
node tools/stills.mjs out/film.html sheet h,v 0.25 out/sheet     # one still per beat (contact sheets)
node tools/render.mjs out/film.html h 0 987 out/seg/d.mp4 draft  # draft: 30 fps, half res, no blur
tools/run_master.sh out/film.html 1974 2                         # master: 60 fps, 6 subframes, ffmpeg tmix
python3 tools/mix.py cues.json audio out/audio.wav out/seg/master_h_silent.mp4 out/16x9.mp4 out/seg/master_v_silent.mp4 out/9x16.mp4
python3 -I tools/pops.py out/16x9.mp4 out/9x16.mp4             # single-frame pop scan
```

On Windows with a GPU, `tools/go.ps1` does the whole master with Chromium on ANGLE/D3D11 (`--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist`). `audio/` holds the Mixkit files listed in [`analysis/sfx_used.json`](analysis/sfx_used.json) plus `190.mp3`. They are free to use in videos but not to redistribute, so they are not in this repo.

### How the engine obeys the brief

- `seek(t, tf)` is pure: every style is computed from `t`. No timers, no CSS transitions, no state between frames. Fonts and the logo are awaited before the first seek.
- **Camera:** one transform keyed `[t, zoom, x, y]` with eased segments and log-space zoom. It makes one move per scene and never zooms back out. It resets only under the two full-frame floods (b31.5, b60).
- **Springs:** closed-form step responses, ζ 0.8–0.88. Multi-target values are a sum of springs. The sidebar indicator and the toggle knob ride two springs, one per edge, so the leading edge stretches.
- **Motion blur:** 6 subframes across half a frame are captured as separate frames and blended by `tmix=frames=6`, then `select=mod(n,6)=5`. The hard-cut captions ("CLICK.") read the frame time `tf`, so no frame blends across a cut.
- **Floods:** each clears the farthest corner of the frame in 0.35 s. The fire flood pours out of Allow, and the night later shrinks back into the Ledger window.

## QA

- [`qa/contact_sheet_16x9.jpg`](qa/contact_sheet_16x9.jpg) and [`qa/contact_sheet_9x16.jpg`](qa/contact_sheet_9x16.jpg): one still per beat.
- [`qa/key_stills_16x9.jpg`](qa/key_stills_16x9.jpg) and [`qa/key_stills_9x16.jpg`](qa/key_stills_9x16.jpg): open, drop, middle, end.
- Pop scan, loudness, frame counts and MD5s: see [`qa/report.md`](qa/report.md).
