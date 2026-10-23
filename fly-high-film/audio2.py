"""Soundtrack v2 (81 s): Hebrew narration (vo2/), FLY HIGH score, synthesized frame-synced sound design."""
import json, subprocess, numpy as np
from scipy import signal

SR = 48000; DUR = 81.0; N = int(SR * DUR)
A = '/home/user/fly-high-nyc/audio/'
rng = np.random.default_rng(11)
cues = json.load(open('cues2.json'))
mix = {k: np.zeros((N, 2), np.float32) for k in ['music', 'amb', 'sfx', 'vo']}
T = np.arange(N) / SR

def load(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def db(x): return 10 ** (x / 20)
def mono(x): return np.stack([x, x], 1).astype(np.float32)
def pan(x, p): return np.stack([x * np.cos((p + 1) * np.pi / 4) * 1.414, x * np.sin((p + 1) * np.pi / 4) * 1.414], 1).astype(np.float32)
def place(bus, clip, t, gain=0.0):
    i = int(t * SR)
    if i >= N: return
    if i < 0: clip = clip[-i:]; i = 0
    n = min(len(clip), N - i); mix[bus][i:i + n] += clip[:n] * db(gain)
def bp(x, lo, hi, o=4): return signal.sosfilt(signal.butter(o, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, o=4): return signal.sosfilt(signal.butter(o, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, o=4): return signal.sosfilt(signal.butter(o, f, 'highpass', fs=SR, output='sos'), x)
def tt(n): return np.arange(n) / SR
def env(points): return np.interp(T, [p[0] for p in points], [p[1] for p in points]).astype(np.float32)
def smooth(a, b, x): k = np.clip((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k)
def bell(f0, dur=1.2, bright=1.0):
    n = int(dur * SR); x = tt(n)
    y = sum(a * np.sin(2 * np.pi * f0 * m * x) * np.exp(-x * d) for m, a, d in [(1, 1, 3.5), (2.76, 0.45 * bright, 6), (5.4, 0.25 * bright, 9), (8.9, 0.12 * bright, 13)])
    return (y * np.minimum(1, x / 0.004)).astype(np.float32)
def scratch(a, b, gain, p=0.15):
    n = int((b - a) * SR)
    if n < 200: return
    x = bp(rng.standard_normal(n + 2000), 1800, 7500, 2)[1000:1000 + n]
    gran = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * rng.uniform(5, 9) * tt(n))) * (0.7 + 0.3 * rng.standard_normal(n).clip(-1, 1))
    e = np.minimum(1, tt(n) / 0.015) * np.minimum(1, tt(n)[::-1] / 0.03)
    place('sfx', pan(x * gran * e, p), a, gain)

# ------------------------------------------------------------------ voice-over
VO = {'01': 0.8, '02': 7.0, '03': 11.0, '04': 17.0, '05': 20.2, '06': 28.8, '07': 38.0, '08': 43.6, '09': 48.0, '10': 55.2, '11': 58.8, '12': 64.8, '13': 70.2, '14': 75.2}
for k, t0 in VO.items():
    x = load(f'vo2/{k}.mp3')
    if k in ('08', '13', '14'): x = x * db(1)   # Yuval / macaw voice
    place('vo', x, t0, 0)
# light de-ess / warmth
for c in range(2): mix['vo'][:, c] = lp(mix['vo'][:, c], 11000, 2)

# ------------------------------------------------------------------ music
title = load(A + 'music/title.mp3')
seg = title[: int(18.5 * SR)].copy(); seg *= np.interp(np.arange(len(seg)) / SR, [0, 1.2, 15.8, 18.5], [0, 1, 1, 0])[:, None]
place('music', seg, 0.0, -6)
b0 = 27.0; seg = title[int(b0 * SR): int((b0 + DUR - 38.0) * SR)].copy()
st = np.arange(len(seg)) / SR + 38.0; seg *= np.interp(st, [38.0, 41.0, 79.4, 81.0], [0, 1, 1, 0])[:, None]
place('music', seg, 38.0, -4)
dr = np.zeros(N)
for f, a in [(49.0, 1.0), (73.4, 0.6), (98.0, 0.45), (146.8, 0.18)]:
    dr += a * np.sin(2 * np.pi * f * T + 0.3 * np.sin(2 * np.pi * 0.11 * T)) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.23 * T + f))
dr += 0.35 * lp(rng.standard_normal(N), 220)
dr *= env([(0, 0), (16.6, 0), (19.5, 0.35), (28, 0.75), (33, 0.6), (37.5, 0.4), (40, 0)])
mix['music'] += pan(dr, 0) * db(-13)
pulse = np.zeros(N); tp = 20.2
while tp < 29.0:
    n = int(0.18 * SR); x = np.sin(2 * np.pi * 55 * tt(n)) * np.exp(-tt(n) * 18); i = int(tp * SR); pulse[i:i + n] += x * (0.5 + 0.5 * (tp - 20.2) / 9); tp += 0.5 - 0.2 * (tp - 20.2) / 9
mix['music'] += pan(pulse, 0) * db(-9)
for k, tb in enumerate(np.arange(30.2, 37.4, 1.1)):
    for d, a in [(0, 1.0), (0.24, 0.65)]:
        n = int(0.22 * SR); place('sfx', mono(np.sin(2 * np.pi * 52 * tt(n)) * np.exp(-tt(n) * 16) * a), tb + d, -7 - k * 0.5)

# ------------------------------------------------------------------ ambience
room = lp(rng.standard_normal(N), 400) * env([(0, 0), (0.5, 1), (7.6, 1), (8.5, 0)]); mix['amb'] += pan(room, 0) * db(-38)
wind = load(A + 'sfx/wind_bed.mp3'); wl = np.tile(wind, (int(np.ceil(N / len(wind))) + 1, 1))[:N]
mix['amb'] += wl * env([(0, 0), (10.4, 0), (11, db(-28)), (16.6, db(-26)), (19.5, db(-13)), (28, db(-10)), (33, db(-15)), (37.6, db(-22)), (47.2, db(-20)), (47.8, db(-9)), (50.2, db(-8)), (50.8, db(-22)), (70, db(-24)), (81, 0)])[:, None]
storm = smooth(17.0, 20.0, T) * (1 - smooth(37.5, 41.0, T) * 0.85) * (1 - smooth(48.5, 50.4, T))
rn = np.stack([hp(lp(rng.standard_normal(N), 9000), 900), hp(lp(rng.standard_normal(N), 9000), 900)], 1)
mix['amb'] += (rn * 0.6).astype(np.float32) * (storm * smooth(18.6, 20.0, T))[:, None] * db(-16)
tb = 10.8
while tb < 17.2:
    for k in range(rng.integers(2, 5)):
        n = int(rng.uniform(0.05, 0.11) * SR); f0 = rng.uniform(3200, 5200); x = tt(n)
        f = f0 + rng.uniform(-1500, 1500) * x / x[-1] + 300 * np.sin(2 * np.pi * rng.uniform(25, 60) * x)
        place('amb', pan(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * x / x[-1]) ** 2, rng.uniform(-0.8, 0.8)), tb + k * rng.uniform(0.08, 0.14), -25)
    tb += rng.uniform(0.55, 1.3)

# ------------------------------------------------------------------ sfx
for a, b in cues['pen']: scratch(a, b, -15)
shimmer = load(A + 'sfx/shimmer.mp3'); whoosh = load(A + 'sfx/whoosh.mp3'); riser = load(A + 'sfx/riser.mp3'); impact = load(A + 'sfx/impact.mp3')
place('sfx', shimmer, 7.4, -6)
place('sfx', pan(bell(1568, 1.4), 0.3), 9.45, -16)
for s in cues['steps']:
    n = int(0.08 * SR); place('sfx', pan(lp(rng.standard_normal(n), 900) * np.exp(-tt(n) * 45) + 0.4 * np.sin(2 * np.pi * 90 * tt(n)) * np.exp(-tt(n) * 40), -0.1), s, -21)
# quick pen sketches as the world is drawn
for a in [10.6, 11.0, 11.4, 11.9, 12.3]: scratch(a, a + 0.35, -21, rng.uniform(-0.5, 0.5))
for i in range(9): scratch(17.0 + i * 0.22, 17.0 + i * 0.22 + 0.5, -20, -0.6 + i * 0.15)
def thunder(t0, gain, crack=True, muffle=False):
    if crack: n = int(0.35 * SR); place('sfx', pan(hp(rng.standard_normal(n), 1500) * np.exp(-tt(n) * 14), -0.3), t0, gain)
    n = int(4.0 * SR); x = lp(np.cumsum(rng.standard_normal(n)) * 0.02, 160 if muffle else 260)
    x = x / (np.abs(x).max() + 1e-9) * np.exp(-tt(n) * 0.9) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 1.7 * tt(n))))
    place('sfx', pan(x, -0.2), t0 + 0.12, gain + 2)
thunder(17.3, -15, crack=False)
for b in [22.1, 25.5, 27.7, 31.4, 34.6]: thunder(b, -7)
PILE_T = [20.4, 21.0, 21.6, 22.2, 22.8, 23.3, 23.8, 24.4, 25.0, 25.6, 26.2, 26.8, 27.4, 28.0]
for i, ti in enumerate(PILE_T):
    f = [1318.5, 1567.98, 1174.66, 1760, 1396.9, 1975.5][i % 6]; n = int(0.5 * SR); x = tt(n)
    place('sfx', pan((np.sin(2 * np.pi * f * x) + 0.5 * np.sin(2 * np.pi * f * 1.5 * x)) * np.exp(-x * 9) * np.minimum(1, x / 0.003), [-0.7, 0.6, -0.3, 0.8, -0.8, 0.4][i % 6]), ti - 0.55, -16)
    n = int(0.25 * SR); x = tt(n)
    place('sfx', pan(lp(rng.standard_normal(n), 1400) * np.exp(-x * 26) * 0.6 + 0.4 * bp(rng.standard_normal(n), 900, 3000) * np.exp(-x * 45), rng.uniform(-0.2, 0.2)), ti, -14 + i * 0.3)
    if i % 4 == 1: n = int(0.4 * SR); place('sfx', pan(lp(signal.square(2 * np.pi * 150 * tt(n)) * (np.sin(2 * np.pi * 12 * tt(n)) > 0) * 0.3, 800), 0.5), ti - 0.4, -20)
place('sfx', impact, 28.9, -8)
# arrival
place('sfx', riser, 34.2, -10); place('sfx', shimmer, 37.6, -5)
flaps = [load(A + f'sfx/flap_{i}.mp3') for i in range(1, 8)]
tf = 38.4; k = 0
while tf < 41.6: place('sfx', pan(flaps[k % 7].mean(1), -0.6 + 0.4 * (tf - 38.4) / 3), tf, -14 + 9 * (tf - 38.4) / 3.2); tf += 0.26 - 0.06 * (tf - 38.4) / 3.2; k += 1
place('sfx', load(A + 'sfx/call_full.mp3'), 39.0, -5)
place('sfx', load(A + 'sfx/wing_unfurl.mp3'), 41.5, -6)
place('sfx', load(A + 'sfx/wing_unfurl.mp3'), 44.7, -9)
n = int(0.35 * SR); x = tt(n); boing = np.sin(2 * np.pi * np.cumsum(260 + 700 * (1 - np.exp(-x * 9))) / SR) * np.exp(-x * 7); place('sfx', mono(boing), 46.0, -13)
# takeoff
place('sfx', load(A + 'sfx/wing_boom.mp3'), 47.25, -1); place('sfx', load(A + 'sfx/call_a.mp3'), 47.5, -7)
tf = 47.3; k = 0
while tf < 50.4: place('sfx', flaps[k % 7], tf, -7); tf += 0.21; k += 1
place('sfx', load(A + 'sfx/flyby.mp3'), 47.9, -6)
for i in range(6): place('sfx', pan(whoosh.mean(1)[: int(0.9 * SR)], rng.uniform(-0.7, 0.7)), 48.1 + i * 0.25, -14)
place('sfx', riser, 46.6, -6); place('sfx', shimmer, 50.3, -3); place('sfx', impact, 50.35, -13)
# YUV.AI written in the sky, then the dive into the dot
scratch(50.7, 52.6, -13, 0.0); place('sfx', shimmer, 51.9, -6)
place('sfx', whoosh, 53.4, -4); place('sfx', impact, 54.85, -9)
# order: chimes as each use-case card lands
for i in range(8): place('sfx', pan(bell([523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.7, 1318.5][i], 2.0, 0.5), np.cos(i / 8 * 2 * np.pi) * 0.7), 56.5 + i * 0.55, -18)
place('sfx', shimmer, 56.0, -10)
for i in range(3): scratch(65.6 + i * 0.7, 65.6 + i * 0.7 + 0.18, -16, 0.3)
# CTA
scratch(70.4, 72.0, -14, 0.0); scratch(72.0, 73.2, -16, 0.0)
place('sfx', load(A + 'sfx/stinger_complete.mp3'), 71.3, -3)
place('sfx', load(A + 'sfx/call_full.mp3'), 76.5, -13)

# ------------------------------------------------------------------ mix: duck music/ambience under the voice
lvl = np.convolve(np.abs(mix['vo']).mean(1), np.ones(4800) / 4800, 'same'); lvl = lvl / (lvl.max() + 1e-9)
duck = 1 - 0.5 * np.clip(lvl * 4, 0, 1)
duck = np.convolve(duck, np.ones(9600) / 9600, 'same')
out = mix['music'] * duck[:, None] + mix['amb'] * (0.55 + 0.45 * duck)[:, None] + mix['sfx'] + mix['vo'] * db(4)
out *= np.interp(T, [0, 0.05, 79.6, 81.0], [0, 1, 1, 0])[:, None]
out = np.tanh(out * 1.1) / 1.1; out = out / np.abs(out).max() * db(-1.5)
out.astype(np.float32).tofile('mix2_raw.f32')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'mix2_raw.f32', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '-c:a', 'pcm_s16le', 'soundtrack2.wav'], check=True)
print('ok')
