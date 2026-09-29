"""Mix: VO + music (sidechain-ducked under VO) + SFX placed from page-emitted cues. Then 2-pass ffmpeg loudnorm
to -14 LUFS integrated / -1 dBTP. Writes audio/mix_pre.wav and audio/mix.wav (48 kHz stereo)."""
import json, os, subprocess, re
import numpy as np, soundfile as sf
from scipy import signal
from scipy.ndimage import maximum_filter1d

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000
vo, _ = sf.read(os.path.join(HERE, 'vo.wav')); mus, _ = sf.read(os.path.join(HERE, 'music.wav'))
cues = json.load(open(os.path.join(HERE, 'cues.json')))
N = max(len(vo), len(mus)); N = int(cues['duration'] * SR) if cues.get('duration') else N
def fit(x): return np.pad(x, [(0, max(0, N - len(x)))] + [(0, 0)] * (x.ndim - 1))[:N]
vo = fit(vo); mus = fit(mus)

# VO polish: gentle high-pass + presence lift + soft compression
vo = signal.sosfilt(signal.butter(2, 90, 'highpass', fs=SR, output='sos'), vo)
pres = signal.sosfilt(signal.butter(2, [2500, 6000], 'bandpass', fs=SR, output='sos'), vo)
vo = vo + 0.25 * pres
env = np.sqrt(signal.sosfilt(signal.butter(1, 12, 'lowpass', fs=SR, output='sos'), vo ** 2) + 1e-9)
thr = 0.08; gain = np.where(env > thr, (thr + (env - thr) / 3) / env, 1.0); vo = vo * gain

# sidechain duck: VO envelope → music gain (-9 dB under speech), fast attack / slow release
e = np.abs(vo); e = maximum_filter1d(e, int(0.03 * SR))
e = signal.sosfilt(signal.butter(1, 4, 'lowpass', fs=SR, output='sos'), e)
k = np.clip(e / 0.05, 0, 1)
duck = 1 - k * (1 - 10 ** (-9 / 20))
mus = mus * duck[:, None] * 0.55

# SFX
bank = {f[:-4]: sf.read(os.path.join(HERE, 'sfx', f))[0] for f in os.listdir(os.path.join(HERE, 'sfx')) if f.endswith('.wav')}
LEVEL = {'cut': .22, 'pop': .30, 'whoosh': .30, 'boom': .55, 'riser': .35, 'error': .30, 'ding': .28, 'fan': .45, 'tick': .12, 'type': .12, 'flash': .25, 'toast': .25}
sfx = np.zeros(N); last = {}
for c in cues['cues']:
    x = bank.get(c['type']);
    if x is None: continue
    if c['t'] - last.get(c['type'], -9) < 0.035: continue  # de-flam identical cues
    last[c['type']] = c['t']
    t0 = c['t'] - (len(x) / SR if c['type'] == 'riser' else 0)  # risers END on the cue
    i = int(t0 * SR); a, b = max(0, i), min(N, i + len(x))
    if b > a: sfx[a:b] += x[a - i:b - i] * LEVEL.get(c['type'], .25) * c.get('gain', 1)
# whoosh on every hard cut to a new section
mix = mus + np.stack([vo * 0.95 + sfx * 0.9] * 2, 1)
mix = np.tanh(mix * 0.9) / 0.9 * 0.9
pre = os.path.join(HERE, 'mix_pre.wav'); sf.write(pre, mix.astype(np.float32), SR)

# 2-pass loudnorm
p1 = subprocess.run(['ffmpeg', '-hide_banner', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json', '-f', 'null', '-'],
                    capture_output=True, text=True).stderr
m = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', p1, re.S).group(0))
af = (f"loudnorm=I=-14:TP=-1.5:LRA=9:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', pre, '-af', af, '-ar', '48000', os.path.join(HERE, 'mix.wav')], check=True)
p3 = subprocess.run(['ffmpeg', '-hide_banner', '-i', os.path.join(HERE, 'mix.wav'), '-af', 'loudnorm=I=-14:TP=-1:print_format=json', '-f', 'null', '-'],
                    capture_output=True, text=True).stderr
r = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', p3, re.S).group(0))
print(f"mix.wav: integrated {r['input_i']} LUFS, true peak {r['input_tp']} dBTP, LRA {r['input_lra']}, sfx cues {len(cues['cues'])}")
