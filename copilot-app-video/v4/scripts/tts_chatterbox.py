# v4 VO: Chatterbox (Resemble AI, MIT) — local, expressive. Per-line, seeded for repeatability.
import json, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS
torch.set_num_threads(4)
m = ChatterboxTTS.from_pretrained(device="cpu")
# per-line delivery: (exaggeration, cfg_weight) — lower cfg = slower/more deliberate, higher exag = more emotive
STYLE = {'open':(.55,.5),'promise':(.7,.35),'habit':(.65,.45),'scale':(.55,.5),'reveal':(.7,.45),'mywork':(.5,.5),
         'handoff':(.7,.4),'lanes':(.5,.5),'merge':(.55,.5),'control':(.5,.5),'money':(.5,.5),'listen':(.55,.5),
         'payoff':(.75,.3),'cta':(.6,.45)}
out = {}
for key, text in json.load(open('src/script.json')):
    torch.manual_seed(7)
    ex, cfg = STYLE[key]
    wav = m.generate(text, exaggeration=ex, cfg_weight=cfg, temperature=.7)
    ta.save(f'audio/vo_{key}.wav', wav, m.sr); out[key] = wav.shape[-1]/m.sr
    print(key, round(out[key],2), flush=True)
json.dump(out, open('audio/vo_durations.json','w'), indent=1)
print('total', round(sum(out.values()),2))
