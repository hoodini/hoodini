#!/usr/bin/env python3
"""usage: python3 build_data.py edit.json  (after snapcuts.py)
Everything the film needs, in OUTPUT time: plates (which source frames, screen or face), captions, zooms, named
anchors for every motion event (all hung on spoken words), the beat grid and the sound cue list."""
import json, subprocess, sys

CFG = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 'edit.json'))
KEEP = json.load(open('keep_snapped.json'))           # silence-snapped cuts (snapcuts.py)
FACE = [tuple(f) for f in CFG['face']]
WORDS = json.load(open(CFG['words']))
END = CFG.get('end_card', 4.5)
FPS = CFG.get('fps', 30)                                             # end card

STARTS, _t = [], 0.0
for a, b in KEEP: STARTS.append(_t); _t += b - a
def O(src):
    """source time -> output time. KEEP is in STORY order (it may be reordered against the source).
    A time inside a removed stretch maps to the start of the next kept range in source order."""
    for (a, b), t0 in zip(KEEP, STARTS):
        if a <= src < b: return t0 + src - a
    nxt = [(a, t0) for (a, b), t0 in zip(KEEP, STARTS) if a > src]
    return min(nxt)[1] if nxt else _t
SPEECH = sum(b - a for a, b in KEEP)
DUR = SPEECH + END

# plates: kept ranges split at screen/face boundaries
plates = []
for (a, b), T0 in zip(KEEP, STARTS):      # cumulative story time (a boundary belongs to two ranges: never look it up)
    edges = sorted({a, b} | {x for f in FACE for x in f if a < x < b})
    for i, (s, e) in enumerate(zip(edges, edges[1:])):
        face = any(fa <= s < fb for fa, fb in FACE)
        plates.append({'t0': round(T0 + s - a, 4), 'dur': round(e - s, 4), 'in': s, 'kind': 'face' if face else 'screen',
                       'cut': i == 0})                 # True = a real cut into this plate, False = continuous take
# face punch levels per plate (jump cuts alternate 1.0 / 1.12; the sign-off is the top-anchored crop that hides
# the old burned-in name tag)
lvl = 0
LV = CFG.get('punch', {}).get('levels', [1.0, 1.12]); OV = CFG.get('punch', {}).get('overrides', [])
for p in plates:
    if p['kind'] != 'face': lvl = 0; continue
    o = [v for v in OV if p['in'] >= v['from'] - 0.1]
    if o: p['punch'], p['anchor'] = o[-1]['punch'], o[-1].get('anchor', [0.5, 0.3])
    else: p['punch'] = LV[lvl % len(LV)]; p['anchor'] = [0.5, 0.3]; lvl += 1

# screen zooms (source frame rects), checked frame by frame against the footage
ZOOMS = CFG.get('zooms', [])
zooms = [{'t': round(O(t), 3), 'rect': r or [0, 0, 1, 1]} for t, r in ZOOMS]

# words in output time (words inside removed stretches are dropped)
ow = []
for w in WORDS:
    for a, b in KEEP:
        if a - 0.02 <= w['s'] < b - 0.05:   # by its START: Whisper often stretches a word's end over the next pause
            T0 = STARTS[KEEP.index([a, b])]
            ow.append({'w': w['w'], 't0': round(T0 + max(w['s'], a) - a, 3), 't1': round(T0 + min(w['e'], b) - a, 3), 'src': w['s']}); break
ow.sort(key=lambda w: w['t0'])
# caption phrases (calm, read at a glance): up to 7 words / 34 characters, break on a pause or punctuation,
# each shown at least 0.9 s and held until the next phrase when the gap is short (no flicker)
HEAD_WORDS = {'של', 'את', 'עם', 'יש', 'זה', 'כמו', 'אם', 'או', 'כי', 'אבל', 'גם', 'רק', 'על', 'אל', 'מה', 'לי', 'לנו',
              'אני', 'אנחנו', 'הוא', 'היא', 'כל', 'עוד', 'אז', 'בין', 'בתוך', 'לא', 'the', 'a', 'to', 'of'}
def cost(c, i):
    """cost of breaking after word i: prefer a real pause, never leave a function word dangling at the end"""
    gap = c[i + 1]['t0'] - c[i]['t1']
    end = c[i]['w'].strip(',.?!').lower()
    return -gap * 10 + (3 if end in HEAD_WORDS else 0) - (4 if c[i]['w'][-1:] in ',.?!' else 0) + abs(i + 1 - 5) * 0.15
chunks, rest = [], list(ow)
while rest:
    lim = 0
    while lim < len(rest) and lim < 7 and sum(len(x['w']) + 1 for x in rest[:lim + 1]) <= 34:
        if lim and rest[lim]['t0'] - rest[lim - 1]['t1'] > 0.45: break
        lim += 1
    lim = max(lim, 1)
    if lim < len(rest) and lim >= 4 and not (rest[lim]['t0'] - rest[lim - 1]['t1'] > 0.45):
        k = min(range(2, lim), key=lambda i: cost(rest, i)) + 1     # split at the best point (keep >= 3 words)
    else: k = lim
    chunks.append(rest[:k]); rest = rest[k:]
CH = []
for i, c in enumerate(chunks):
    nxt = chunks[i + 1][0]['t0'] if i + 1 < len(chunks) else c[-1]['t1'] + 0.6
    end = nxt if nxt - c[-1]['t1'] < 0.6 else c[-1]['t1'] + 0.35
    end = max(end, min(nxt, c[0]['t0'] + 0.9))
    CH.append({'t0': c[0]['t0'], 'end': round(end, 3), 'words': c})

# named anchors (source seconds of the spoken word) -> output seconds
A = {k: round(O(v), 3) for k, v in CFG['anchors'].items()}
A['end'] = round(SPEECH, 3)

# music: Mixkit #623, 124.04 BPM; start it on its first beat so the grid is k * B in film time
from pathlib import Path
mb = json.loads(subprocess.run(['python3', str(Path(__file__).resolve().parent.parent / 'beats.py'), CFG['music']['file']],
                               capture_output=True, text=True).stdout)
B = mb['beat']; M_IN = mb['first_beat']

json.dump({'DUR': round(DUR, 3), 'SPEECH': round(SPEECH, 3), 'plates': plates, 'zooms': zooms, 'chunks': CH,
           'A': A, 'B': B, 'BPM': mb['bpm'], 'fps': FPS,
           'behind': [[round(O(a), 3), round(O(b), 3)] for a, b in CFG.get('behind', [])]}, open('data.json', 'w'), ensure_ascii=False)
json.dump({'music_in': M_IN, 'B': B}, open('music.json', 'w'))
print(f"DUR {DUR:.2f}s  speech {SPEECH:.2f}s  plates {len(plates)}  chunks {len(CH)}  BPM {mb['bpm']}")
