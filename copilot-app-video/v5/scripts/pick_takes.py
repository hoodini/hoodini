# For each line: transcribe the 3 seeded takes, keep the one whose transcript best matches the script
# (similarity first, then mean word probability, then shorter). Trims leading/trailing silence.
import json, re, difflib, shutil, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
norm = lambda s: re.sub(r'[^a-z0-9 ]', '', s.lower().replace('-', ' ')).split()
NUM = {'1147':'eleven forty seven','200':'two hundred','180':'one hundred and eighty','8':'eight','19':'nineteen','602':'six oh two','6':'six','4':'four'}
def fix(s):
    s = s.replace(':', '')
    for k, v in sorted(NUM.items(), key=lambda x: -len(x[0])): s = re.sub(rf'\b{k}\b', v, s)
    return s.replace('oclock', 'o clock')
out, dur, rep = {}, {}, {}
for key, text in json.load(open('src/script.json')):
    best = None
    for seed in (7, 23, 42):
        f = f'audio/take_{key}_{seed}.wav'
        segs, _ = m.transcribe(f, word_timestamps=True, beam_size=5, initial_prompt='Dana, Mia, GitHub Copilot app, git worktree, Agent Merge, autopilot')
        ws = [w for s in segs for w in s.words]; heard = ''.join(w.word for w in ws)
        sim = difflib.SequenceMatcher(None, norm(fix(text.replace("'", ''))), norm(fix(heard.replace("'", '')))).ratio()
        conf = float(np.mean([w.probability for w in ws])) if ws else 0
        x, sr = sf.read(f); score = (round(sim, 2), conf >= .88, len(x))
        print(key, seed, f'{sim:.2f} {conf:.2f} {len(x)/sr:.2f}s |', heard.strip(), flush=True)
        if best is None or score > best[0]: best = (score, seed, heard.strip(), x, sr)
    _, seed, heard, x, sr = best
    a = np.abs(x); th = a.max() * .02; nz = np.where(a > th)[0]
    x = x[max(0, nz[0] - int(.04 * sr)): min(len(x), nz[-1] + int(.12 * sr))]
    sf.write(f'audio/vo_{key}.wav', x, sr); dur[key] = round(len(x) / sr, 3); rep[key] = {'seed': seed, 'heard': heard, 'sim': best[0][0]}
json.dump(dur, open('audio/vo_durations.json', 'w'), indent=1); json.dump(rep, open('audio/picks.json', 'w'), indent=1)
print('TOTAL VO', round(sum(dur.values()), 2))
