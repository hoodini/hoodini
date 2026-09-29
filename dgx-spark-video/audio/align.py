"""Transcribe the VO track with faster-whisper (word timestamps) and align to the script words.
Script spelling wins for captions (GPT-OSS, tok/s, GB, LPDDR5X, 5090...); whisper supplies timing.
Writes page/timings.js (window.TIMINGS) and audio/transcript_vo.txt.
usage: python align.py vo.wav vo_layout.json
vo_layout.json: [{key, start, end, text}] — where each line was placed in the VO track."""
import json, re, sys, difflib, os
from faster_whisper import WhisperModel

HERE = os.path.dirname(os.path.abspath(__file__))
vo, layout = sys.argv[1], json.load(open(sys.argv[2]))
m = WhisperModel('small.en', device='cpu', compute_type='int8')
segs, _ = m.transcribe(vo, word_timestamps=True, beam_size=5, vad_filter=False,
                       initial_prompt='DGX Spark, RTX 5090, GPT-OSS, tokens per second, GB, LPDDR5X, NVIDIA, Grace Blackwell, GB10, FP4.')
hw = [w for s in segs for w in s.words]
open(os.path.join(HERE, 'transcript_vo.txt'), 'w').write(' '.join(w.word.strip() for w in hw))

NUM = {'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'}
def n(s):
    s = s.lower().replace('’', "'")
    s = re.sub(r'[^a-z0-9]', '', s)
    return NUM.get(s, s)

lines = {}
for L in layout:
    words = L['text'].split()
    # whisper words falling in this line's window
    cand = [w for w in hw if w.start >= L['start'] - 0.15 and w.start < L['end'] + 0.05]
    a, b = [n(x) for x in words], [n(w.word) for w in cand]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    times = [None] * len(words)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1): times[i1 + k] = (cand[j1 + k].start, cand[j1 + k].end)
        elif tag == 'replace' and j2 > j1:
            # spread script words i1..i2 across whisper span j1..j2
            s0, e0 = cand[j1].start, cand[j2 - 1].end
            for k in range(i2 - i1):
                f0, f1 = k / (i2 - i1), (k + 1) / (i2 - i1)
                times[i1 + k] = (s0 + (e0 - s0) * f0, s0 + (e0 - s0) * f1)
    # interpolate any unmatched words
    st, en = L['start'], L['end']
    for i in range(len(words)):
        if times[i] is None:
            prv = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), st)
            nxt_i = next((j for j in range(i + 1, len(words)) if times[j]), None)
            nxt = times[nxt_i][0] if nxt_i is not None else en
            gap = nxt_i - i if nxt_i is not None else len(words) - i
            d = (nxt - prv) / (gap + 0)
            times[i] = (prv, prv + d * 0.9)
    wl = [{'w': w, 's': round(t[0], 3), 'e': round(t[1], 3)} for w, t in zip(words, times)]
    for i in range(1, len(wl)):  # monotonic
        wl[i]['s'] = max(wl[i]['s'], wl[i - 1]['s'] + 0.01)
        wl[i]['e'] = max(wl[i]['e'], wl[i]['s'] + 0.05)
    lines[L['key']] = {'start': wl[0]['s'], 'end': wl[-1]['e'], 'words': wl, 'text': L['text']}

dur = json.load(open(os.path.join(HERE, 'vo_meta.json')))['duration']
out = {'lines': lines, 'order': [L['key'] for L in layout], 'duration': dur}
open(os.path.join(HERE, '..', 'page', 'timings.js'), 'w').write('window.TIMINGS=' + json.dumps(out) + ';')
matched = sum(1 for L in layout for _ in L['text'].split())
print('aligned', len(lines), 'lines;', matched, 'words; whisper words:', len(hw))
