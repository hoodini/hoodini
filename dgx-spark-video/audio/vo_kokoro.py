"""Fallback VO: Kokoro-82M (kokoro-onnx), voice af_heart, one clip per script line, assembled with gaps.
Writes audio/vo.wav, audio/vo_layout.json, audio/vo_meta.json."""
import json, os, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from scipy.signal import resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
VOICE, SPEED = os.environ.get('VOICE', 'af_heart'), float(os.environ.get('SPEED', '1.2'))
LEAD_IN, BASE_GAP, TAIL = 0.30, 0.08, 2.2

# pronunciation fixes for Kokoro only (spoken side)
FIX = [(r'\bDGX\b', 'D G X'), (r'\bGPU\b', 'G P U'), (r'\bCPU\b', 'C P U'), (r'\bCUDA\b', 'Kooda'), (r'\bLLM\b', 'L L M'),
       (r"\bNVIDIA's AI", "Nvidia's A.I."), (r'\bNVIDIA\b', 'Nvidia'), (r'\bPOV\b', 'P O V'), (r'\bAI\b', 'A I'), (r'\bPC\b', 'P C')]

script = json.load(open(os.path.join(HERE, 'script.json')))
k = Kokoro(os.path.join(HERE, 'raw', 'kokoro-v1.0.onnx'), os.path.join(HERE, 'raw', 'voices-v1.0.bin'))


def trim(x, thr=0.012, pad=0.03):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx): return x
    a, b = max(0, idx[0] - int(pad * SR)), min(len(x), idx[-1] + int(pad * SR * 2))
    return x[a:b]


track, layout, t = [np.zeros(int(LEAD_IN * SR))], [], LEAD_IN
for L in script:
    text = re.sub(r'\[[^\]]+\]\s*', '', L['tts']).replace('…', '...')
    for a, b in FIX: text = re.sub(a, b, text)
    audio, sr = k.create(text, voice=VOICE, speed=SPEED, lang='en-us')
    audio = resample_poly(audio, SR, sr).astype(np.float32)
    audio = trim(audio)
    sf.write(os.path.join(HERE, 'raw', f"line_{L['key']}.wav"), audio, SR)
    d = len(audio) / SR
    layout.append({'key': L['key'], 'start': round(t, 3), 'end': round(t + d, 3), 'text': L['caption'], 'units': L['units']})
    gap = BASE_GAP + L['gap'] * float(os.environ.get('GAPX', '1'))
    track += [audio, np.zeros(int(gap * SR))]
    t += d + gap
    print(f"{L['key']:>3} {d:5.2f}s  {text}")
track.append(np.zeros(int(TAIL * SR)))
vo = np.concatenate(track)
sf.write(os.path.join(HERE, 'vo.wav'), vo, SR)
json.dump(layout, open(os.path.join(HERE, 'vo_layout.json'), 'w'), indent=1)
json.dump({'duration': round(len(vo) / SR, 3), 'voice': VOICE, 'speed': SPEED, 'engine': 'kokoro-onnx (Kokoro-82M v1.0)'},
          open(os.path.join(HERE, 'vo_meta.json'), 'w'))
print('VO duration', round(len(vo) / SR, 2), 's')
