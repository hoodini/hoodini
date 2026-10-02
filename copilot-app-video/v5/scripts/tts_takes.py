# Chatterbox: 3 seeded takes per line → pick the take whose transcript best matches the script (then best confidence)
import json, re, difflib, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS
torch.set_num_threads(4)
m = ChatterboxTTS.from_pretrained(device="cpu")
STYLE = {'open':(.55,.5),'promise':(.7,.35),'habit':(.6,.45),'scale':(.55,.5),'reveal':(.7,.45),'mywork':(.5,.5),'handoff':(.65,.4),
         'lanes':(.5,.5),'merge':(.55,.5),'control':(.6,.45),'ships':(.6,.45),'payoff':(.6,.3),'cta':(.6,.4)}
for key, text in json.load(open('src/script.json')):
    ex, cfg = STYLE[key]
    for seed in (7, 23, 42):
        torch.manual_seed(seed); w = m.generate(text, exaggeration=ex, cfg_weight=cfg, temperature=.7)
        ta.save(f'audio/take_{key}_{seed}.wav', w, m.sr); print(key, seed, round(w.shape[-1]/m.sr,2), flush=True)
print('DONE', flush=True)
