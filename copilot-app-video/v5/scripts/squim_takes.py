# Objective, reference-free speech quality (torchaudio SQUIM: STOI / PESQ / SI-SDR) for every take -> audio/squim.json
import glob, json, torch, torchaudio as ta
from torchaudio.pipelines import SQUIM_OBJECTIVE
m = SQUIM_OBJECTIVE.get_model(); out = {}
for f in sorted(glob.glob('audio/take_*.wav')):
    w, sr = ta.load(f); w = ta.functional.resample(w.mean(0, keepdim=True), sr, 16000)
    with torch.no_grad(): s, p, d = m(w)
    out[f] = {'stoi': round(s.item(), 3), 'pesq': round(p.item(), 2), 'sisdr': round(d.item(), 1)}
json.dump(out, open('audio/squim.json', 'w'), indent=1); print(len(out), 'takes scored')
