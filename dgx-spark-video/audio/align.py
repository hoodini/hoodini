"""Word timestamps: faster-whisper on each VO line clip, aligned to the script's spoken tokens.
Caption text comes from the script (GPT-OSS, tok/s, GB, 5090, $4,699 ...); whisper supplies only timing.
Writes page/timings.js (window.TIMINGS) and audio/transcript_lines.txt (for intelligibility QA)."""
import json, re, os, difflib
from faster_whisper import WhisperModel

HERE = os.path.dirname(os.path.abspath(__file__))
layout = json.load(open(os.path.join(HERE, 'vo_layout.json')))
meta = json.load(open(os.path.join(HERE, 'vo_meta.json')))
m = WhisperModel('small.en', device='cpu', compute_type='int8')

NUM = {'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'}
def n(s):
    s = re.sub(r'[^a-z0-9]', '', s.lower())
    return NUM.get(s, s)

def split_tokens(words):  # split hyphenated spoken tokens so "seventy-three" ~ "seventy three"
    out = []
    for ui, w in enumerate(words):
        for p in re.split(r'[-\s]+', w):
            if n(p): out.append((ui, n(p)))
    return out

lines, report = {}, []
for L in layout:
    segs, _ = m.transcribe(os.path.join(HERE, 'raw', f"line_{L['key']}.wav"), word_timestamps=True, beam_size=5,
                           initial_prompt='DGX Spark, RTX 5090, GPU, CUDA, NVIDIA, Grace Blackwell.')
    hw = [w for s in segs for w in s.words]
    report.append(f"{L['key']}: {' '.join(w.word.strip() for w in hw)}")
    # whisper side tokens (split numerals/hyphens too)
    wt = []
    for w in hw:
        parts = [p for p in re.split(r'[-\s]+', w.word.strip()) if n(p)]
        for k, p in enumerate(parts):
            d = (w.end - w.start) / max(1, len(parts))
            wt.append((n(p), w.start + k * d, w.start + (k + 1) * d))
    # script side: units -> spoken tokens
    st = []
    for ui, u in enumerate(L['units']):
        for p in split_tokens(u['say']): st.append((ui, p[1]))
    sm = difflib.SequenceMatcher(a=[x[1] for x in st], b=[x[0] for x in wt], autojunk=False)
    tt = [None] * len(st)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1): tt[i1 + k] = (wt[j1 + k][1], wt[j1 + k][2])
        elif tag == 'replace':
            s0, e0 = wt[j1][1], wt[j2 - 1][2]
            for k in range(i2 - i1):
                tt[i1 + k] = (s0 + (e0 - s0) * k / (i2 - i1), s0 + (e0 - s0) * (k + 1) / (i2 - i1))
    dur = L['end'] - L['start']
    for i in range(len(tt)):  # interpolate unmatched
        if tt[i] is None:
            prv = next((tt[j][1] for j in range(i - 1, -1, -1) if tt[j]), 0.0)
            nj = next((j for j in range(i + 1, len(tt)) if tt[j]), None)
            nxt = tt[nj][0] if nj is not None else dur
            span = (nj if nj is not None else len(tt)) - i + 1
            tt[i] = (prv, prv + (nxt - prv) / span)
    words = []
    for ui, u in enumerate(L['units']):
        ts = [tt[i] for i in range(len(st)) if st[i][0] == ui]
        if not ts: ts = [words[-1] and (words[-1]['e'] - L['start'], words[-1]['e'] - L['start'] + .1)] if words else [(0, .1)]
        words.append({'w': u['cap'], 's': round(L['start'] + ts[0][0], 3), 'e': round(L['start'] + ts[-1][1], 3)})
    for i in range(1, len(words)):
        words[i]['s'] = max(words[i]['s'], words[i - 1]['s'] + 0.02)
        words[i]['e'] = max(words[i]['e'], words[i]['s'] + 0.06)
    lines[L['key']] = {'start': words[0]['s'], 'end': words[-1]['e'], 'words': words}

out = {'lines': lines, 'order': [L['key'] for L in layout], 'duration': meta['duration']}
open(os.path.join(HERE, '..', 'page', 'timings.js'), 'w').write('window.TIMINGS=' + json.dumps(out) + ';')
open(os.path.join(HERE, 'transcript_lines.txt'), 'w').write('\n'.join(report))
print('\n'.join(report))
