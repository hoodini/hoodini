# Kokoro-82M per-line VO (fallback: ElevenLabs quota exhausted)
import json, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro('/tmp/kok/kokoro-v1.0.onnx', '/tmp/kok/voices-v1.0.bin')
SAY = [(r'\bPOV\b','P.O.V.'),(r'\bCI\b','C.I.'),(r'\bPRs\b','P.R.s'),(r'\bPR\b','P.R.'),
       (r'\bAzure\b','Azhure'),(r'worktree','work tree'),(r'Copilot','Co-pilot')]
lines = json.load(open('src/script.json'))
out = {}
for key, text in lines:
    t = text
    for a,b in SAY: t = re.sub(a,b,t)
    s, sr = k.create(t, voice='af_heart', speed=1.25, lang='en-us')
    sf.write(f'audio/vo_{key}.wav', s, sr)
    out[key] = len(s)/sr
    print(key, round(len(s)/sr,2))
json.dump(out, open('audio/vo_durations.json','w'), indent=1)
print('total', round(sum(out.values()),2))
