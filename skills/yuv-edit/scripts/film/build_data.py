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

def O(src):
    """source time -> output time (a time inside a removed stretch snaps to the next kept moment)"""
    t = 0.0
    for a, b in KEEP:
        if src < a: return t
        if src <= b: return t + src - a
        t += b - a
    return t
SPEECH = sum(b - a for a, b in KEEP)
DUR = SPEECH + END

# plates: kept ranges split at screen/face boundaries
plates = []
for a, b in KEEP:
    edges = sorted({a, b} | {x for f in FACE for x in f if a < x < b})
    for i, (s, e) in enumerate(zip(edges, edges[1:])):
        face = any(fa <= s < fb for fa, fb in FACE)
        plates.append({'t0': round(O(s), 4), 'dur': round(e - s, 4), 'in': s, 'kind': 'face' if face else 'screen',
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
        if w['s'] >= a - 0.02 and w['e'] <= b + 0.08:
            ow.append({'w': w['w'], 't0': round(O(max(w['s'], a)), 3), 't1': round(O(min(w['e'], b)), 3)}); break
# caption chunks: 2-4 words, break on a pause, punctuation or ~20 characters
chunks, cur = [], []
for w in ow:
    if cur and (len(cur) >= 4 or sum(len(x['w']) + 1 for x in cur) + len(w['w']) > 20 or w['t0'] - cur[-1]['t1'] > 0.35
                or cur[-1]['w'][-1:] in ',.?!'):
        chunks.append(cur); cur = []
    cur.append(w)
if cur: chunks.append(cur)
CH = []
for i, c in enumerate(chunks):
    nxt = chunks[i + 1][0]['t0'] if i + 1 < len(chunks) else c[-1]['t1'] + 0.4
    CH.append({'t0': c[0]['t0'], 'end': round(min(nxt, c[-1]['t1'] + 0.6), 3), 'words': c})

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
