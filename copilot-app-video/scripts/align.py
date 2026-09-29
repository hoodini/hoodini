# faster-whisper word timestamps -> aligned to script tokens -> absolute timeline
import json, re, difflib, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
lines = json.load(open('src/script.json'))
dur = json.load(open('audio/vo_durations.json'))
GAP = {'reveal':0.9, 'score':0.9, 'cta':0.5}   # extra air for drops / breakdown
LEAD, DEFGAP, TAIL = 0.35, 0.28, 3.6
norm = lambda w: re.sub(r'[^a-z0-9]','',w.lower())
t = LEAD; TL = {'lines':{}, 'words':{}}
for key, text in lines:
    t += GAP.get(key, 0) + (DEFGAP if key!='hook' else 0)
    segs,_ = m.transcribe(f'audio/vo_{key}.wav', word_timestamps=True, beam_size=5,
        initial_prompt='GitHub Copilot app, PR, CI, Azure, worktree, Agent Merge, autopilot')
    ww = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
    toks = text.replace('...',' ').split()
    a = [norm(x) for x in toks]; b = [norm(x[0]) for x in ww]
    times = [None]*len(toks)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for i in range(blk.size): times[blk.a+i] = ww[blk.b+i][1:]
    # interpolate unmatched
    D = dur[key]
    for i in range(len(toks)):
        if times[i] is None:
            p = next((times[j][1] for j in range(i-1,-1,-1) if times[j]), 0.0)
            n = next((times[j][0] for j in range(i+1,len(toks)) if times[j]), D)
            k0 = i; k1 = i
            times[i] = (p + (n-p)*0.1, p + (n-p)*0.9)
    TL['lines'][key] = {'start': round(t,3), 'end': round(t+D,3), 'text': text,
                        'heard': ' '.join(x[0] for x in ww)}
    TL['words'][key] = [{'w':tok, 's':round(t+s,3), 'e':round(t+e,3)} for tok,(s,e) in zip(toks,times)]
    t += D
TL['total'] = round(t + TAIL, 3)
json.dump(TL, open('src/timeline.json','w'), indent=1)
for k,v in TL['lines'].items(): print(k, v['start'], '|', v['heard'])
print('TOTAL', TL['total'])
