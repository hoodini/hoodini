# v3 "STORY" — GitHub Copilot app explainer (story-driven, funny, professional)

A 102.5 s, 38-shot story cut with soft reframes inside long shots. It uses the v2 neon/3D motion system and adds an emotional arc, synthesized b-roll, reaction overlays and sourced scale stats.

| Deliverable | Spec |
|---|---|
| `out/copilot-app-explainer-v3-1080p.mp4` | 1920×1080 · 30 fps · H.264 High · AAC 48 kHz · −14 LUFS |
| `out/copilot-app-explainer-v3-720p.mp4` | 1280×720 preview |

## Story arc
| Act | Beat | Emotion |
|---|---|---|
| 1 · 2:07 AM | Meet **Dana** (fictional, labelled on screen): 400 notifications, 97 open PRs, a "quick fix" PR with 347 comments. | Recognition: "that's me" |
| 2 · The pain | Tabs everywhere, 2 agents on 1 branch, `git blame` says it was Dana. | Frustration, played for laughs |
| 3 · Plot twist | GitHub has "seen this movie before": **180M+ developers · 630M repositories · 43.2M PRs merged/month** (Octoverse 2025). | Trust through expertise |
| 4 · The mentor's gift | GitHub Copilot app reveal, the drop. | Relief |
| 5 · Transformation | 400 tabs collapse into 1 window. Worktree lanes. Agent Merge turns red checks green. The 347-comment PR is merged before lunch. | Satisfaction (variable-reward dings) |
| 6 · Power moves | Model/Auto carousel, live canvas co-editing, sandboxes that ask first, the autopilot toggle. | Control |
| 7 · Honest catch | Metered in AI credits. Monthly credits plus a hard cap keep the bill "boring". | Credibility |
| 8 · Momentum | 19 days after launch, 8 new capabilities shipped, with an open GitHub Community feedback thread. GitHub Next prototypes (Chopin, Autoloop, Agentic Workflows). | "They keep listening and shipping" |
| 9 · 5:00 PM | Dana logs off. "Like, actually 5." Then: technical preview → ONE APP. MANY AGENTS. GO HOME ON TIME. | Aspiration and a CTA |

## Humour and overlays
- **Stickers:** "LGTM 👍 (didn't read)", "git blame, git shame", "merge conflict? never heard of her", "they've seen EVERY merge conflict 🫡", "the CI babysitter you deserve 🍼", "bill: boring 😴", "like, ACTUALLY 5 🕔".
- **Reactions:** live-stream-style emoji reactions rise on the punchlines.
- **Synthesized b-roll:**
  - Dana's room at 2:07 AM and at 5:00 PM (window skyline, moon or sunset, desk, monitor, mug steam, LED clock).
  - Phone notification storm, comment-bubble swarm, `git blame` terminal.
  - Rotating developer globe, a 3D wall of repositories, raining merge icons.
  - Tabs collapsing into one window, a lunch clock, a shipping timeline.
  - GitHub Next prototype cards floating in a lab.

## Sources (all ≤ 12 months old, checked 2026-09-30)
1. GitHub Blog — Octoverse 2025, *A new developer joins GitHub every second…* (Oct 28, 2025): “180 million-plus developers”, “630 million” repositories, “43.2 million pull requests” merged monthly on average, “more than one new developer on average joined GitHub” every second — https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/
2. GitHub Changelog — technical preview (May 14, 2026) — https://github.blog/changelog/2026-05-14-github-copilot-app-is-now-available-in-technical-preview/
3. GitHub Changelog — expanded preview (Jun 2, 2026): 8 new capabilities (Canvases, Voice, Cloud sessions, Cloud automations, CLI integration, Agentic browsing, Rubber duck, /chronicle) and a GitHub Community discussion link — https://github.blog/changelog/2026-06-02-expanded-technical-preview-availability-for-the-github-copilot-app/
4. GitHub Next — “investigates the future of software development”; prototypes Chopin (Sep 2026), Autoloop (Apr 2026), Agentic Workflows (Aug 2025) — https://githubnext.com/
5. Everything else (My Work, worktrees, Agent Merge, canvases, sandboxes, autopilot, billing) comes from the v1 source list in `../README.md`.

## Corrections and disclosures
- **Developer count:** the brief asked for "hundreds of millions of developers". The sourced figure is **180M+ developers**. What does reach the hundreds of millions is **630M repositories**, and the video uses both exact numbers.
- **Feedback framing:** "listening to feedback" is framed as fact only: an open feedback thread plus fast releases. It does not claim that specific features were caused by user feedback, which isn't sourced.
- **GitHub Next:** its projects are labelled as research prototypes, not shipped features.
- **Dana:** fictional, and labelled "dramatization". The 400 / 97 / 347 counts are story props.
- **UI and models:** app UI is recreated ("illustrative UI"), and model names are placeholders.
- **Voice:** ElevenLabs still had only 16 credits, so the voice is Kokoro-82M `af_heart` at speed 1.2.
