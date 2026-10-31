# edl.json: the single source of truth

Every script reads this file; nothing is hidden in code. Paths are relative to the EDL's folder, and times are seconds.

```jsonc
{
  "title": "iphone-17-review",
  "fps": 30, "width": 1920, "height": 1080,        // 9:16 => 1080 x 1920 (A-roll reframes on the face)
  "sources": { "A": "../raw/talk.mp4", "SR1": "../raw/screen.mov", "IMG1": "../raw/site.png", "B1": "../raw/macro.mp4" },
  "gfx_dir": "gfx",

  // PRIMARY track: played back to back. Defines the dialogue and the base picture.
  "video": [
    { "src": "A", "role": "aroll", "in": 12.30, "out": 18.92,
      "zoom": 1.12,                                  // constant punch-in, or:
      // "zoom": {"from": 1.0, "to": 1.15, "ease": "smooth|spring|linear", "start": 0, "len": 4.0},
      "anchor": "face",                              // or [x, y] 0..1 of the source; default "face" for aroll
      "transition": "whip",                          // optional, into this clip
      "shake": 0,                                    // px amplitude at 1080p; tiny (2-4) or none
      "gain_db": 0, "speed": 1.0 },
    { "src": "B1", "in": 3.0, "out": 6.0, "audio": "mute" },        // full-frame B-roll as a primary clip
    { "src": "IMG1", "kind": "card3d", "in": 0, "out": 3.0 }         // stills: in/out just set the duration
  ],

  // COVERS: picture-only items over the primary (the dialogue continues under them). J/L cuts live here.
  "covers": [
    { "src": "B1", "kind": "video", "at": 21.4, "dur": 2.6, "in": 8.0, "zoom": {"from": 1.0, "to": 1.08} },
    { "src": "SR1", "kind": "screen", "at": 30.0, "dur": 9.0, "in": 42.0,
      "zooms": [ {"t": 1.2, "rect": [0.55, 0.40, 0.35, 0.35]}, {"t": 5.5, "rect": [0, 0, 1, 1]} ],
      "max_zoom": 3.0, "side": "right" },
    { "src": "IMG1", "kind": "card3d", "at": 45.0, "dur": 3.0,
      "rot_y": [-14, 6], "rot_x": [8, 2], "z": [2.6, 1.9], "bg": "blur|night", "sheen": true },
    { "src": "IMG2", "kind": "parallax", "depth": "../raw/img2_depth.png", "at": 52.0, "dur": 3.0,
      "push": 0.08, "pan": [0.03, 0] }
  ],

  // GFX: rendered by prep_gfx.py from scripts/gfx/gfx.js templates; placed in OUTPUT time.
  "gfx": [
    { "id": "hook", "template": "title", "at": 0.3, "dur": 2.2, "behind_subject": true,
      "props": { "text": "הסוד של MKBHD", "marker": 2, "kicker": "part 01", "x": 0.92, "y": 0.45, "size": 150 } },
    { "id": "lt", "template": "lower_third", "at": 18.0, "dur": 3.5, "props": { "name": "יובל אבידני", "role": "AI Builder & Speaker · YUV.AI" } },
    { "id": "cam", "template": "callout", "at": 23.0, "dur": 2.0, "props": { "text": "48MP Fusion", "to": [0.62, 0.40], "at": [0.30, 0.22] } },
    { "id": "views", "template": "stat", "at": 40.0, "dur": 3.0, "props": { "value": 14.1, "decimals": 1, "suffix": "M", "label": "צפיות ביום ההשקה" } },
    { "id": "bat", "template": "compare", "at": 60.0, "dur": 3.5, "props": { "title": "סוללה", "unit": "h", "rows": [{"label": "17 Pro", "a": 31, "b": 27}] } },
    { "id": "ch2", "template": "chapter", "at": 70.0, "dur": 1.4, "props": { "n": 2, "title": "מה לא עובד", "marker": 2, "kicker": "chapter" } },
    { "id": "cta", "template": "cta", "at": 500.0, "dur": 3.0, "props": { "text": "לפרק הבא", "sub": "yuv.ai" } },
    { "id": "end", "template": "endcard", "at": 520.0, "dur": 5.0, "z": 2, "props": { "line": "תמשיכו לעוף גבוה", "marker": 1, "url": "yuv.ai" } }
  ],
  // z orders gfx (higher = on top). behind_subject: the person is composited back over this gfx.

  "captions": { "style": "karaoke", "y": 0.80, "max_words": 3, "size": 96, "chunks": [] },
  // prep_gfx.py --words fills chunks (output-time word timings, remapped through the cut).

  "audio": {
    "music": [ { "src": "../music/bed.mp3", "at": 0, "in": 12.4, "dur": 300, "gain_db": -18, "duck_db": 10, "fade_out": 2 } ],
    "sfx":   [ { "src": "../sfx/whoosh.wav", "event": 21.40, "peak": 0.21, "gain_db": -10 } ]
  }
}
```

## Conventions

- **Output time** is the time in the finished film. Covers, gfx, captions and audio are all placed in output time. Only `in`/`out` refer to source time.
- **Finding a word's output time:** sum the durations of the primary clips before it, then add `word.s − clip.in`. `prep_gfx.py` does this for captions (`remap()`); reuse it for anything else.
- **Never edit gfx PNGs by hand.** Change `props` and re-run `prep_gfx.py`; only changed jobs re-render.
- **Kinds:**
  - `video` (default): cover-fit and anchored;
  - `screen`: the night stage plus zooms;
  - `card3d`: a 3D screenshot card;
  - `parallax`: needs `depth`.
  - Images (`.png`, `.jpg`, `.jpeg`, `.webp`) used as `video` get a static cover-fit; add `zoom` for a Ken Burns push.
