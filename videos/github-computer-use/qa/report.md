# QA report (17 Oct 2026)

Rendered in a cloud container: headless Chromium 1194 with software raster (no GPU there), 4 parallel workers, about 21 minutes for both layouts. `tools/go.ps1` re-renders the same film on a Windows GPU.

| check | 16:9 | 9:16 |
|---|---|---|
| resolution / fps | 1920×1080 / 60 | 1080×1920 / 60 |
| frames (counted) | 1974 | 1974 |
| duration | 32.900 s | 32.900 s |
| pixel format / colour | yuv420p, BT.709 primaries/transfer/matrix, tv range | same |
| motion blur | 6 subframes over a 180° shutter, ffmpeg `tmix` | same |
| integrated loudness | −13.6 LUFS (target −14 ± 0.5) | −13.6 LUFS |
| true peak | −1.5 dBFS | −1.5 dBFS |
| single-frame pops (frame spikes over 3× their neighbours) | none | none |
| master file (CRF 14) | 17.9 MB · MD5 `c741b3af93ebb573cf7ba78840ac2949` | 16.3 MB · MD5 `cdd37adc63e06cf7252640eba25355ad` |
| light file (CRF 21) | 8.7 MB · MD5 `53a318c9d1249ddf71c01cff464f52b0` | 8.2 MB · MD5 `eb9be240c50e4cfec0f7072380c4c6d1` |

- **Largest frame-to-frame changes:** the end-card flood (29.80–29.87 s) and the window collapsing into the Submitted pill (26.15 s). Both are intended and spread over several frames; neither is a one-frame pop.
- **Draft scan:** an earlier draft scan caught a hard swap at 18.2 s (the night page turned into the cloud window body in one frame). It was fixed: the body now wipes up inside the navy shape.
- **Audio sync:** checked on the mixed track. The loudest point near each downbeat sits within −1.6 to +3.6 ms of the grid at beats 33–52, 60 and 64. Two exceptions: beat 32 at +46 ms, where the drop's bass body peaks after the attack, and beat 56 at +13 ms, where a swoosh and a slam are layered.
- **Text direction:** the film has no Hebrew. All copy is English and drawn with `ctx.direction = 'ltr'`; the source contains 0 Hebrew code points.
- **Face check:** not applicable, since there is no talking-head footage.
- **Stills reviewed:** one per beat for both layouts (`contact_sheet_*.jpg`), the open/drop/middle/end stills (`key_stills_*.jpg`), and 16 frames pulled from the final MP4s (`frames_from_mp4_*.jpg`).
