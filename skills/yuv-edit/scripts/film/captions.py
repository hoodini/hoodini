#!/usr/bin/env python3
"""Calm phrase captions, written by the editor.
usage: python3 captions.py dump              -> words_out.json + 'i:word' list (output-timed words from data.json)
       python3 captions.py apply captions_edit.json
captions_edit.json = [[first_word_index, last_word_index, "corrected phrase"], ...] tiling every word exactly once,
  or [[src_start_of_first_word, src_start_of_last_word, "phrase"], ...] (survives reordering the story).
Each phrase shows from its first word, held until the next one when the gap is short, at least 0.9 s."""
import json, sys
d = json.load(open('data.json'))
if sys.argv[1] == 'dump':
    ow = [w for c in d['chunks'] for w in c['words']]
    json.dump(ow, open('words_out.json', 'w'), ensure_ascii=False)
    print(' '.join(f"{i}:{w['w']}" for i, w in enumerate(ow))); sys.exit()
ow = json.load(open('words_out.json')); P = json.load(open(sys.argv[2]))
if P and isinstance(P[0][0], float):   # [src_first_word_start, src_last_word_start, text]: map to the current word indices
    pos = {round(w['src'], 3): i for i, w in enumerate(ow)}
    P = sorted([[pos[round(a, 3)], pos[round(b, 3)], t] for a, b, t in P])
idx = [i for a, b, _ in P for i in range(a, b + 1)]
bad = [(i, j) for i, j in zip(idx, range(len(ow))) if i != j]
assert idx == list(range(len(ow))), f'phrases must tile every word once, in order; first mismatch {bad[:1]}'
CH = []
for k, (a, b, text) in enumerate(P):
    t0, t1 = ow[a]['t0'], ow[b]['t1']
    nxt = ow[P[k + 1][0]]['t0'] if k + 1 < len(P) else t1 + 0.6
    end = nxt if nxt - t1 < 0.6 else t1 + 0.35
    CH.append({'t0': t0, 'end': round(max(end, min(nxt, t0 + 0.9)), 3), 'words': [{'w': text, 't0': t0, 't1': t1}]})
d['chunks'] = CH; json.dump(d, open('data.json', 'w'), ensure_ascii=False)
print(f'{len(CH)} phrases, longest {max(len(p[2]) for p in P)} chars')
