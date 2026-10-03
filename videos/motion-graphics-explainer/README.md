# Case File: Project Lily — motion graphics, taught through a real story

A 3:4 (1080×1440) Instagram explainer, about 80 seconds long. It teaches 8 motion moves, each used for a real job in one hot news story:

| # | Move | Job in the story |
|---|------|------------------|
| 01 | Kinetic type | The headline: "Someone is reading your chats" |
| 02 | Stagger | Volume: an endless wall of real chats (Project Lily) |
| 03 | Easing | The numbers: 4 replies scored 1–7, $50+/hour |
| 04 | Mask reveal | The leak: the privacy filter redacts, and details slip through |
| 05 | Parallax | The pile: Copilot reviewers see uploaded photos, faces uncensored |
| 06 | Morph | Chat → eye: not one company (OpenAI, Microsoft, Anthropic) |
| 07 | Overshoot | The switch |
| 08 | Line draw | Where to tap: ChatGPT and Claude opt-out paths |

It ends with the Claude Code prompt that built the video (Opus 5.5 for script and concept, Sonnet 5.5 for iterations) and a call to action to switch the setting off and share.

**Sources shown on screen:** 404 Media, "Inside 'Project Lily'" (Sep 14, 2026); 404 Media on Copilot reviewers (Sep 2026); Tom's Guide and Android Headlines (opt-out path); IBTimes (the opt-out isn't retroactive); privacy.claude.com (Claude toggle).

## Build
```bash
export GEMINI_API_KEY=...        # Gemini 3.8 Flash TTS (Hebrew voiceover)
./build.sh                       # tts.py -> timing.json -> soundtrack.py -> render -> project-lily-motion.mp4
```
- `script.json`: the voiceover lines plus the Hebrew and English subtitles. Edit the text, voice or style here.
- `tts.py`: one Gemini TTS call per line. Line durations drive every scene cut (`timing.js`). Without a key it estimates the timing.
- `index.html`: GSAP on a paused timeline, so frames render the same way every time. `node render.mjs stills 5,20` gives preview frames.
