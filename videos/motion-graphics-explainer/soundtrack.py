"""Music bed + SFX timed from timing.json, mixed with vo.wav (if present) -> mix.wav"""
import json, os
import numpy as np
from scipy.signal import butter, lfilter, resample_poly
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(HERE, 'timing.json'), encoding='utf-8'))
SR, DUR, BPM = 44100, T['duration'], 100
BEAT = 60 / BPM
N = int(DUR * SR)
rng = np.random.default_rng(3)
M, FX = np.zeros((N, 2)), np.zeros((N, 2))

# scene starts, mirroring index.html
order, first = [], {}
for l in T['lines']:
    if l['scene'] not in first:
        first[l['scene']] = l; order.append(l['scene'])
S = {sc: (0.0 if k == 0 else first[sc]['start'] - 0.18) for k, sc in enumerate(order)}
E = {sc: (S[order[k + 1]] if k < len(order) - 1 else DUR) for k, sc in enumerate(order)}
CUTS = [S[sc] for sc in order[1:]]
REDACT = {'stagger', 'mask', 'toggle', 'hold', 'cta'}


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)


def filt(x, kind, fc):
    b, a = butter(2, np.array(fc) / (SR / 2), kind)
    return lfilter(b, a, x)


def put(buf, sig, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i] * g
    buf[i:i + len(sig), 0] += sig * np.sqrt((1 - pan) / 2) * 1.41
    buf[i:i + len(sig), 1] += sig * np.sqrt((1 + pan) / 2) * 1.41


def saw(f, n, det=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * f * (1 + det)) % 1) - 1


# ---------------- music: D minor, 100 BPM, restrained ----------------
prog = [(73.42, [293.66, 349.23, 440.0]), (58.27, [233.08, 293.66, 349.23]),
        (87.31, [349.23, 440.0, 523.25]), (65.41, [261.63, 329.63, 392.0])]
bar = 4 * BEAT
end_music = DUR - 1.0
k = 0
while k * bar < end_music:
    t0 = k * bar
    root, chord = prog[k % 4]
    n = int(bar * SR)
    fade = np.minimum(np.arange(n) / (0.4 * SR), 1) * np.minimum((n - np.arange(n)) / (0.2 * SR), 1)
    pad = sum(saw(f, n, d) for f in chord for d in (-0.003, 0.003))
    put(M, filt(pad, 'low', 1100) * fade, t0, 0.035, -0.3 if k % 2 else 0.3)
    sub = np.sin(2 * np.pi * root * np.arange(n) / SR) + 0.3 * np.sin(4 * np.pi * root * np.arange(n) / SR)
    put(M, sub * fade, t0, 0.13)
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= end_music:
            break
        if b in (0, 2):  # soft kick
            nk = int(0.3 * SR); tt = np.arange(nk) / SR
            put(M, np.sin(2 * np.pi * np.cumsum(45 + 80 * np.exp(-tt * 28)) / SR) * env(nk, 0.001, 0.14), tb, 0.55)
        if b in (1, 3):  # rim
            nr = int(0.08 * SR)
            put(M, filt(rng.standard_normal(nr), 'band', [1500, 4500]) * env(nr, 0.0005, 0.02), tb, 0.12, 0.2)
        for h in (0, 0.5):  # ticking hats (the "clock")
            nh = int(0.04 * SR)
            put(M, filt(rng.standard_normal(nh), 'high', 7500) * env(nh, 0.0003, 0.01), tb + h * BEAT, 0.07, -0.4 if h else 0.4)
        # sparse pluck motif
        if b == 3 or (k % 2 and b == 1):
            f = chord[(k + b) % 3] * 2; nn = int(0.4 * SR)
            pl = np.sign(np.sin(2 * np.pi * f * np.arange(nn) / SR)) * env(nn, 0.002, 0.09)
            put(M, filt(pl, 'low', 2600), tb + BEAT / 2, 0.035, 0.5)
    k += 1

# ---------------- SFX ----------------
def whoosh(L=0.45):
    n = int(L * SR); x = rng.standard_normal(n); out = np.zeros(n)
    for j in range(8):
        a, b = j * n // 8, (j + 1) * n // 8
        fc = 500 + 5000 * (j / 7) ** 2
        out[a:b] = filt(x, 'band', [fc, min(fc * 2.2, 18000)])[a:b]
    return out * np.sin(np.pi * np.linspace(0, 1, n)) ** 2


def hit():
    n = int(1.4 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(32 + 70 * np.exp(-t * 14)) / SR) * env(n, 0.002, 0.45) + filt(rng.standard_normal(n), 'high', 3000) * env(n, 0.001, 0.25) * 0.2


def click(f=2200):
    n = int(0.03 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * env(n, 0.0003, 0.006) + filt(rng.standard_normal(n), 'band', [2000, 7000]) * env(n, 0.0003, 0.004)


def key():
    n = int(0.015 * SR)
    return filt(rng.standard_normal(n), 'band', [1200, 5000]) * env(n, 0.0003, 0.003)


put(FX, hit(), 0.3, 0.45)
put(FX, hit(), S['hold'], 0.4)
for sc in order[1:]:
    put(FX, whoosh(0.5 if sc in REDACT else 0.3), S[sc] - (0.3 if sc in REDACT else 0.2), 0.22 if sc in REDACT else 0.12, rng.uniform(-.3, .3))
dT = E['toggle'] - S['toggle']
flips = [S['toggle'] + min(.9, dT * .45), S['cta'] + .45]
for sc in ('gpt', 'claude'):
    d = E[sc] - S[sc]; flips.append(S[sc] + 3.6 * d / 5.2 + .2)
for f in flips:
    put(FX, click(1800), f, 0.5); put(FX, click(2600), f + 0.07, 0.3)
pl = [l for l in T['lines'] if l['scene'] == 'prompt']
mid = lambda l, f: l['start'] + (l['end'] - l['start']) * f
typing = [(pl[0]['start'] + .1, .6), (pl[0]['start'] + .9, 1.4), (pl[1]['start'] + .2, 1.1), (pl[2]['start'], 1.6),
          (mid(pl[2], .5), 1.1), (pl[3]['start'], 1.1), (mid(pl[3], .5), 1.5)]
for s, d in typing:
    t = s
    while t < s + d:
        put(FX, key(), t, 0.12, rng.uniform(-.2, .2)); t += rng.uniform(0.035, 0.075)

# ---------------- mix ----------------
vo_path = os.path.join(HERE, 'vo.wav')
VO = np.zeros(N)
if os.path.exists(vo_path):
    sr, v = wavfile.read(vo_path)
    v = v.astype(np.float64) / 32768
    v = resample_poly(v, SR, sr) if sr != SR else v
    VO[:min(N, len(v))] = v[:N]
    e = np.abs(VO); win = int(0.25 * SR)
    e = np.convolve(e, np.ones(win) / win, 'same')
    duck = 1 - 0.55 * np.clip(e / (e.max() * 0.25 + 1e-9), 0, 1)
else:
    duck = np.ones(N) * 0.8
fade = np.ones(N); fn = int(1.0 * SR); fade[-fn:] = np.linspace(1, 0, fn)
mix = M * (duck * fade)[:, None] + FX + VO[:, None] * 0.95
mix = np.tanh(mix * 1.05)
mix /= np.abs(mix).max() / 0.89
wavfile.write(os.path.join(HERE, 'mix.wav'), SR, (mix * 32767).astype(np.int16))
print('mix.wav', round(DUR, 2), 's', 'with VO' if os.path.exists(vo_path) else 'NO VO (music+sfx only)')
