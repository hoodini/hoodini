# Prompt template: motion-graphics explainer (for Claude Opus 5.5 / Sonnet 5.5)

Fill the brackets, keep the six blocks. Named eases + numbers beat adjectives.

```
Build a motion-graphics explainer video about [TOPIC].

FORMAT
  [1080x1440] · [30fps] · [~60s] · HTML + GSAP
  one paused master timeline, seekable (t -> frame), no real-time dependencies

STYLE
  [retro magazine / Gen Z pace]
  palette: [hex, hex, hex, hex, hex]  (name each color's role)
  fonts: [EN display + thin pair] / [HE thick + thin pair]
  bilingual captions: Hebrew line on top, English below

STORYBOARD (scene by scene, with seconds)
  0-4s    hook: [what is on screen, what moves]
  4-15s   [scene] ...
  ...
  each scene: on-screen text, layers (back / mid / front), one hero element

MOTION
  entries: power3.out / expo.out · pops: back.out(1.7) · transitions: expo.inOut
  stagger 0.06 · never linear (except loops)
  depth: text behind / between / in front of objects, parallax on layers

RHYTHM
  a cut or big move every ~2s · one hero per beat · hold 0.3s before cutting

CHECK
  render frames to PNG, review contact sheets, fix overflow / overlap / legibility
  real logos (SVG), real terminal + code for software demos, no lorem ipsum
```

Workflow: Opus 5.5 to plan the storyboard and build the full timeline; Sonnet 5.5 for fast tweak rounds
(spacing, timing, copy). This split is a practical rule of thumb, not a benchmark: test both on your own prompt.
