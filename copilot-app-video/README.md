# GitHub Copilot app — motion-graphics explainer (X, 16:9)

A ~115 s, 60-shot, Gen-Z-paced explainer on the **GitHub Copilot app** (GitHub's agent-native desktop app, Microsoft Build 2026, technical preview) — not the classic GitHub Desktop Git GUI.

| Deliverable | Spec |
|---|---|
| `out/copilot-app-explainer-1080p.mp4` | 1920×1080 · 30 fps · H.264 High · AAC 48 kHz · −14 LUFS / ≤ −1 dBTP |
| `out/copilot-app-explainer-720p.mp4` | 1280×720 preview, < 30 MB |

Credit: **BY YUVAL AVIDANI · YUV.AI** (end card).

---

## Story beats (all timings derived from word timestamps, never hardcoded)

| § | Beat | What's on screen |
|---|---|---|
| 01 | Hook | "POV:" → 14 tabs counter → 3 typing terminals → 2 agents wired to `main` → red merge-conflict diff + "merge conflict? never heard of her" → "SAME. BRANCH." |
| 02 | Reveal | Contribution-graph wipe + riser → Invertocat drop, flash, music drop → "the desktop *home* for your agents" |
| 03 | My Work | Purple "MY WORK" slam → 4-column UI (sessions / issues / PRs / automations) popping on each spoken word → repo hub → radar "air-traffic control for agents" + "your PM: 👀" |
| 04 | Worktrees | `git worktree add` typed → diverging branch lanes drawn per agent → "0 branch juggling" → "who touched my branch?" struck through + "works on my branch™" |
| 05 | Issue → PR → Agent Merge | Issue #41 → agent diff → PR #42 + "Copilot opened PR #42" toast → AGENT MERGE → checks ✗ (error buzz) → ✗→✓ flips (rising dings) → cursor clicks Merge → purple **Merged** stamp → "it babysits CI so you don't" + "CI is green 🟢 touch grass" |
| 06 | Models | Model + reasoning-effort dropdowns → AUTO → "swap mid-task" toggle → BYOK |
| 07 | Canvases | CANVASES → plan / terminal / browser / deployment panes → you + agent co-editing → "same page, literally." |
| 08 | Azure | AZURE SHOPS → Azure DevOps items in My Work → "community canvas extensions" → Functions + Resource Graph cards → cost canvas (sample data) → "finally, next to the code." |
| 09 | Safety | Local vs cloud sandbox → permission dialog → permission-first → autopilot toggle → `/security-review` |
| 10 | AI Credits | $$$ → June 1 2026 · GitHub AI Credits · 1 credit = $0.01 → plan cards → fuel gauge filling (one pool, all models) → gauge draining + CAP snapping on, budget levels, preview bill → completions/NES = 0 credits |
| 10b | Fine print | "still tokens underneath" token counter → community reactions (👎 958 / 👍 24) → SEE IT. CAP IT. |
| 11 | Scoreboard | `git diff --verdict` (breakdown) → TAB-HOPPING STACK vs COPILOT APP, 5 rows with source tags |
| 12 | CTA | ONE APP. / MANY AGENTS. / SHIP IT. → end card, "technical preview — check your plan", credit line |

## Design system — GitHub/Primer × editorial × terminal
- **Palette (Primer dark):** canvas `#0D1117`, surface `#161B22`, border `#30363D`, fg `#F0F6FC`, muted `#8B949E`, green `#2DA44E/#3FB950`, purple `#8250DF/#A371F7`, red `#F85149`, attention `#D29922`. Hard-cut themes: dark, white (`#FFFFFF`/`#1F2328`), purple, green, black.
- **Type (self-hosted woff2 via Fontsource):** Mona Sans variable (900 wt, 125 % width for headlines), Hubot Sans (credit line), Instrument Serif italic (contrast lines), Monaspace Neon (UI, captions, chrome).
- **Chrome on every frame:** top rule `DEV TOOLS ISSUE Nº03 · § section · 2026-09-29`; bottom rule with live timecode, commit-SHA/shot ticker, page number; 80 px margins.
- **Overlays:** stickers, toasts, hand-drawn SVG strokes, animated cursor, 4-frame cycled film grain, flashes, beat-synced micro-zoom (140 BPM), jump-cuts inside any shot > 2.3 s.
- **Captions:** Monaspace `> words`, spoken word highlighted, driven by faster-whisper word timestamps aligned to the script text.
- **Brand:** GitHub Invertocat from the official `@primer/octicons` package (`mark-github`), white-on-dark, never recoloured or distorted. The GitHub wordmark is *not* redrawn; the product name is set in Mona Sans. Copilot octicon used only as a small UI icon. (github.com/logos download was blocked by the sandbox network policy.)

## Pipeline
```
src/script.json ──► scripts/tts.py (Kokoro-82M af_heart, speed 1.2) ──► audio/vo_*.wav
                 └► scripts/align.py (faster-whisper small.en word timestamps, difflib-aligned to script) ──► src/timeline.json
scripts/build_assets.py ──► src/data.js (timeline + octicons) + grain PNGs
src/index.html + src/shots.js  — one paused GSAP timeline, W(line, word) helpers, window.seek(t, frame),
                                 emits CUES (sfx) + CUTS (shots)
scripts/render.mjs — 4 Playwright/Chromium workers seek frame-by-frame → JPEG pipe → ffmpeg chunks
scripts/audio.py   — procedural 140 BPM trap bed (drop on logo, breakdown before verdict) + cue-driven SFX + VO,
                     sidechain-style ducking
scripts/master.sh  — compressor + limiter + two-pass loudnorm → −14 LUFS
scripts/final.sh   — concat, mux, libx264 High -preset slow -tune grain ~5.5 Mbps + 720p preview
scripts/stills.mjs — QA: one still per shot (sampled late in the shot) → contact sheets in qa/
```
Rebuild: `npm i && pip install numpy scipy soundfile kokoro-onnx faster-whisper pillow`, then
`python3 scripts/tts.py && python3 scripts/align.py && python3 scripts/build_assets.py && python3 -m http.server 8765 & node scripts/render.mjs && python3 scripts/audio.py && scripts/master.sh && scripts/final.sh`.
Kokoro model files come from `huggingface.co/fastrtc/kokoro-onnx` (put in `/tmp/kok`).

**Voice:** ElevenLabs was checked first — the account had 16 credits left vs. ~1,846 needed for eleven_v3, so the pipeline fell back (as specified) to local Kokoro-82M + procedural numpy/scipy music. All audio is synthesized; no licensed music or samples.

## Sources (primary, all ≤ 12 months old; checked 2026-09-29)
1. GitHub Blog — *GitHub Copilot app: The agent-native desktop experience*, Mario Rodriguez, 2026-06-02 — https://github.blog/news-insights/product-news/github-copilot-app-the-agent-native-desktop-experience/
2. GitHub Changelog — *GitHub Copilot app is now available in technical preview*, 2026-05-14 — https://github.blog/changelog/2026-05-14-github-copilot-app-is-now-available-in-technical-preview/
   2b. GitHub Changelog — *Expanded technical preview availability for the GitHub Copilot app*, 2026-06-02 — https://github.blog/changelog/2026-06-02-expanded-technical-preview-availability-for-the-github-copilot-app/
3. GitHub Blog — *GitHub Copilot is moving to usage-based billing*, 2026-04-27 — https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/
   3b. GitHub Docs — Usage-based billing for organizations and enterprises — https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises
   3c. GitHub Docs — Usage-based billing for individuals — https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-individuals
4. Azure DevOps Blog — *Azure DevOps in the GitHub Copilot App*, Dan Hellem, 2026-08-27 — https://devblogs.microsoft.com/devops/azure-devops-in-the-github-copilot-app/
5. Awesome GitHub Copilot — Canvas Extensions (community listing) — https://awesome-copilot.github.com/extensions/
6. GitHub Docs — Working with agent sessions in the GitHub Copilot app — https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions
7. GitHub Docs — Using your own LLM models in the GitHub Copilot app — https://docs.github.com/en/copilot/how-tos/github-copilot-app/use-byok-models
8. GitHub Community — Discussion #192948 (reaction counts as fetched 2026-09-29) — https://github.com/orgs/community/discussions/192948

Scoreboard tags: Context switching [1] · Parallel agents [1] · CI babysitting [1][2] · Cloud/Azure [4][5] · Spend control [3].

### Claim → source map
| On-screen claim | Source |
|---|---|
| Windows 11 (+Arm), macOS, Linux; tech preview for Pro/Pro+/Business/Enterprise | [1][2b] |
| My Work: sessions, issues, PRs, background automations across connected repos | [1] |
| Every session in its own git worktree, no branch juggling | [1] |
| Start from an issue; land the change through PR review | [1][2] |
| Agent Merge: monitors CI, tracks required reviewers, addresses failing checks, merges when conditions are met | [1][2] |
| Model + reasoning-effort pickers, Auto, change any time in a session | [6] |
| BYOK models in the picker | [7] |
| Canvases: bidirectional; plan/PR/browser/terminal/deployment/dashboard/workflow | [1][2b] |
| Azure DevOps work items & PRs in My Work, edit/complete | [4] |
| Azure Cost Health Check, Azure Functions Hosted Skills, Azure Resources Query (Resource Graph) canvases — **community-built** | [5] |
| Local sandbox restricts filesystem/network/credentials; cloud = isolated ephemeral Linux hosted by GitHub | [1][6] |
| Cloud agent asks permission before each write; autopilot | [1] |
| `/security-review` skill | [1] |
| AI Credits since June 1 2026, 1 credit = $0.01, token-metered at API rates | [3][3b] |
| Included credits: Pro $10, Pro+ $39, Business $19/user, Enterprise $39/user | [3] |
| Completions + Next Edit Suggestions don't consume credits | [3] |
| Budgets at user / cost-center / enterprise level; preview bill | [3][3b] |
| 👎 958 / 👍 24 on the billing announcement | [8] |

## Dropped or softened (unverified or not primary-sourced)
- **Specific model names** in the picker — the docs confirm a model picker, Auto and BYOK, but not an app-specific model list → no model names shown ("model A/B/C" placeholders).
- **Native "deploy" / GitHub Actions trigger flow** inside the app — not found in primary sources → not claimed. Only a *deployment canvas surface* (listed in [1]) is shown.
- **"Native issue solving" wording** — replaced with the sourced "start from an issue … land the change through PR review".
- **Azure cost / Functions / Resource Graph canvases as first-party features** — they are community-published extensions on awesome-copilot; labeled "community-built" on screen.
- **Partner agent apps** (LaunchDarkly, Sonar, Octopus Deploy, PagerDuty, Miro, …) — verified in [1] but cut for runtime.
- **Copilot Max** — verified ([1][2b]) but kept out of the video to avoid plan confusion.
- **Competitor comparisons** — none named; the scoreboard compares against a generic "tab-hopping stack".
- **Numbers that are illustrative:** $1,284 cost figure ("sample data" label), token counter, PR/issue numbers and UI mock-ups ("illustrative UI" label) are synthesized.
