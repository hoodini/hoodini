"""Soundtrack for FLY HIGH (70 s): music from the FLY HIGH score + synthesized, frame-synced sound design."""
import json, subprocess, numpy as np
from scipy import signal

SR = 48000; DUR = 70.0; N = int(SR * DUR)
A = '/home/user/fly-high-nyc/audio/'
rng = np.random.default_rng(7)
cues = json.load(open('cues.json'))
mix = {k: np.zeros((N, 2), np.float32) for k in ['music', 'amb', 'sfx']}

def load(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def db(x): return 10 ** (x / 20)
def mono(x): return np.stack([x, x], 1)
def pan(x, p):  # x mono, p -1..1
    l, r = np.cos((p + 1) * np.pi / 4), np.sin((p + 1) * np.pi / 4)
    return np.stack([x * l * 1.414, x * r * 1.414], 1)
def place(bus, clip, t, gain=0.0):
    i = int(t * SR)
    if i >= N: return
    if i < 0: clip = clip[-i:]; i = 0
    n = min(len(clip), N - i); mix[bus][i:i + n] += clip[:n] * db(gain)
def bp(x, lo, hi, order=4): return signal.sosfilt(signal.butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, order=4): return signal.sosfilt(signal.butter(order, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, order=4): return signal.sosfilt(signal.butter(order, f, 'highpass', fs=SR, output='sos'), x)
def tt(n): return np.arange(n) / SR
def env_curve(points):  # [(t, gain_lin)...] -> full-length envelope
    ts = np.array([p[0] for p in points]); vs = np.array([p[1] for p in points])
    return np.interp(np.arange(N) / SR, ts, vs).astype(np.float32)
def smooth(a, b, x): k = np.clip((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k)
T = np.arange(N) / SR

# ------------------------------------------------------------------ music
title = load(A + 'music/title.mp3')
seg = title[: int(18.2 * SR)].copy()
seg *= np.interp(np.arange(len(seg)) / SR, [0, 1.2, 15.6, 18.2], [0, 1, 1, 0])[:, None]
place('music', seg, 0.0, -7)
b0, b1 = 27.0, 27.0 + (DUR - 36.6)
seg = title[int(b0 * SR): int(b1 * SR)].copy()
st = np.arange(len(seg)) / SR + 36.6
seg *= np.interp(st, [36.6, 39.2, 68.4, 70.0], [0, 1, 1, 0])[:, None]
place('music', seg, 36.6, -5)

# storm score: dark drone + pulse (synth)
dr = np.zeros(N)
for f, a in [(49.0, 1.0), (73.4, 0.6), (98.0, 0.45), (146.8, 0.18)]:
    dr += a * np.sin(2 * np.pi * f * T + 0.3 * np.sin(2 * np.pi * 0.11 * T)) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.23 * T + f))
dr += 0.35 * lp(rng.standard_normal(N), 220)
dr *= env_curve([(0, 0), (16.4, 0), (19.5, 0.35), (29.5, 0.75), (33, 0.55), (36.2, 0.4), (38.5, 0)])
mix['music'] += pan(dr.astype(np.float32), 0) * db(-13)
# tension pulse (FOMO), 20 -> 30 s, accelerating
pulse = np.zeros(N); tp = 19.9
while tp < 30.0:
    n = int(0.18 * SR); x = np.sin(2 * np.pi * 55 * tt(n)) * np.exp(-tt(n) * 18)
    i = int(tp * SR); pulse[i:i + n] += x * (0.5 + 0.5 * (tp - 19.9) / 10)
    tp += 0.5 - 0.22 * (tp - 19.9) / 10
mix['music'] += pan(pulse.astype(np.float32), 0) * db(-8)
# heartbeat during the collapse
for k, tb in enumerate(np.arange(30.6, 36.2, 1.05 + 0.0)):
    for d, a in [(0, 1.0), (0.24, 0.65)]:
        n = int(0.22 * SR); x = np.sin(2 * np.pi * 52 * tt(n)) * np.exp(-tt(n) * 16) * a
        place('sfx', mono(x.astype(np.float32)), tb + d, -6 - k * 0.6)

# ------------------------------------------------------------------ ambience
# room tone (notebook)
room = lp(rng.standard_normal(N), 400) * env_curve([(0, 0.0), (0.5, 1), (8.6, 1), (9.2, 0)])
mix['amb'] += pan(room.astype(np.float32), 0) * db(-38)
# wind bed (looped)
wind = load(A + 'sfx/wind_bed.mp3'); reps = int(np.ceil(N / len(wind))) + 1; wl = np.tile(wind, (reps, 1))[:N]
wenv = env_curve([(0, 0), (9.0, 0), (9.6, db(-26)), (16.4, db(-24)), (19.5, db(-12)), (29, db(-9)), (33, db(-14)), (37, db(-20)), (43.5, db(-18)), (44.5, db(-8)), (50.0, db(-6)), (51.0, db(-18)), (62, db(-20)), (70, 0)])
mix['amb'] += wl * wenv[:, None]
# howl in the storm
how = np.zeros(N)
for c in [380, 620]:
    nz = rng.standard_normal(N); centre = c * (1 + 0.35 * np.sin(2 * np.pi * 0.07 * T + c))
    how += bp(nz, c * 0.8, c * 1.25, 2) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.13 * T + c))
how *= env_curve([(0, 0), (17, 0), (21, 0.8), (35, 0.7), (38, 0.2), (44, 0.3), (49, 1.0), (50.3, 0)])
mix['amb'] += pan(how.astype(np.float32), 0.2) * db(-17)
# rain
storm = smooth(16.6, 19.6, T) * (1 - smooth(49.6, 50.4, T)); hole = smooth(36.2, 38.4, T) * (1 - smooth(46, 48, T))
rain_amt = storm * (1 - hole * 0.5) * (1 - smooth(46.5, 48.5, T))
rn = np.stack([hp(lp(rng.standard_normal(N), 9000), 900), hp(lp(rng.standard_normal(N), 9000), 900)], 1)
drops = np.zeros((N, 2)); idx = rng.integers(0, N, 9000)
for i in idx:
    n = 300
    if i + n < N: drops[i:i + n, rng.integers(0, 2)] += np.sin(2 * np.pi * rng.uniform(2500, 6000) * tt(n)) * np.exp(-tt(n) * 400) * rng.uniform(0.2, 1)
mix['amb'] += (rn * 0.55 + drops * 0.5).astype(np.float32) * rain_amt[:, None] * db(-15)
# birds in the meadow
tb = 9.3
while tb < 16.6:
    for k in range(rng.integers(2, 5)):
        n = int(rng.uniform(0.05, 0.11) * SR); f0 = rng.uniform(3200, 5200); x = tt(n)
        f = f0 + rng.uniform(-1500, 1500) * x / x[-1] + 300 * np.sin(2 * np.pi * rng.uniform(25, 60) * x)
        ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * x / x[-1]) ** 2
        place('amb', pan(ch.astype(np.float32), rng.uniform(-0.8, 0.8)), tb + k * rng.uniform(0.08, 0.14), -24 - 6 * smooth(15, 16.6, tb))
    tb += rng.uniform(0.55, 1.3)

# ------------------------------------------------------------------ sfx: notebook
for a, b in cues['pen']:
    n = int((b - a) * SR); x = bp(rng.standard_normal(n + 2000), 1800, 7500, 2)[1000:1000 + n]
    gran = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * rng.uniform(5, 9) * tt(n))) * (0.7 + 0.3 * rng.standard_normal(n).clip(-1, 1))
    e = np.minimum(1, tt(n) / 0.015) * np.minimum(1, (tt(n)[::-1]) / 0.03)
    place('sfx', pan((x * gran * e).astype(np.float32), 0.15), a, -15)
    n2 = int(0.03 * SR); place('sfx', pan((bp(rng.standard_normal(n2), 1200, 4000) * np.exp(-tt(n2) * 120)).astype(np.float32), 0.15), a, -17)
shimmer = load(A + 'sfx/shimmer.mp3'); place('sfx', shimmer, 6.45, -7)
# pop / come alive
n = int(0.45 * SR); x = tt(n); f = 260 + 700 * (1 - np.exp(-x * 9)); boing = np.sin(2 * np.pi * np.cumsum(f * (1 + 0.04 * np.sin(2 * np.pi * 14 * x))) / SR) * np.exp(-x * 6)
place('sfx', mono(boing.astype(np.float32)), 6.92, -9)
def bell(f0, dur=1.2, bright=1.0):
    n = int(dur * SR); x = tt(n)
    y = sum(a * np.sin(2 * np.pi * f0 * m * x) * np.exp(-x * d) for m, a, d in [(1, 1, 3.5), (2.76, 0.45 * bright, 6), (5.4, 0.25 * bright, 9), (8.9, 0.12 * bright, 13)])
    return (y * np.minimum(1, x / 0.004)).astype(np.float32)
place('sfx', pan(bell(1568, 1.4), 0.3), 8.2, -17)
whoosh = load(A + 'sfx/whoosh.mp3'); place('sfx', whoosh, 8.25, -3)

# ------------------------------------------------------------------ sfx: meadow + storm
for s in cues['steps']:
    n = int(0.08 * SR); x = lp(rng.standard_normal(n), 900) * np.exp(-tt(n) * 45) + 0.4 * np.sin(2 * np.pi * 90 * tt(n)) * np.exp(-tt(n) * 40)
    place('sfx', pan(x.astype(np.float32), -0.1), s, -21)
def thunder(t0, gain, crack=True, muffle=False):
    if crack:
        n = int(0.35 * SR); x = hp(rng.standard_normal(n), 1500) * np.exp(-tt(n) * 14)
        place('sfx', pan(x.astype(np.float32), -0.3), t0, gain)
    n = int(4.0 * SR); x = lp(np.cumsum(rng.standard_normal(n)) * 0.02, 160 if muffle else 260)
    x = x / (np.abs(x).max() + 1e-9) * (np.exp(-tt(n) * 0.9)) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 1.7 * tt(n))))
    place('sfx', pan(x.astype(np.float32), -0.2), t0 + 0.12, gain + 2)
thunder(16.9, -16, crack=False)
for i, b in enumerate(cues['bolts']): thunder(b, -5 - (2 if i > 2 else 0))
thunder(48.35, -9, crack=False, muffle=True)
# notification pings
for i, tq in enumerate(cues['toasts']):
    f = [1318.5, 1567.98, 1174.66, 1760, 1396.9, 1975.5][i % 6]
    n = int(0.5 * SR); x = tt(n)
    ping = (np.sin(2 * np.pi * f * x) + 0.5 * np.sin(2 * np.pi * f * 1.5 * x)) * np.exp(-x * 9) * np.minimum(1, x / 0.003)
    place('sfx', pan(ping.astype(np.float32), [-0.7, 0.6, -0.3, 0.8, -0.8, 0.4][i % 6]), tq, -15)
    if i % 4 == 1:
        n = int(0.4 * SR); bz = signal.square(2 * np.pi * 150 * tt(n)) * (np.sin(2 * np.pi * 12 * tt(n)) > 0) * 0.3
        place('sfx', pan(lp(bz, 800).astype(np.float32), 0.5), tq + 0.05, -20)
# items landing
for i, ti in enumerate(cues['items']):
    n = int(0.3 * SR); x = tt(n)
    th = lp(rng.standard_normal(n), 500) * np.exp(-x * 22) + 0.9 * np.sin(2 * np.pi * (68 + i) * x) * np.exp(-x * 15)
    kn = bp(rng.standard_normal(n), 600, 2200) * np.exp(-x * 40) * 0.5
    place('sfx', pan((th + kn).astype(np.float32), rng.uniform(-0.2, 0.2)), ti, -9 + i * 0.25)
    # falling whistle before landing
    n = int(0.5 * SR); x = tt(n); fw = np.sin(2 * np.pi * np.cumsum(1400 - 900 * x / x[-1]) / SR) * np.sin(np.pi * x / x[-1]) * 0.3
    place('sfx', pan(fw.astype(np.float32), rng.uniform(-0.5, 0.5)), ti - 0.5, -24)
# trailer hits on the punch captions
for tp_, g in [(19.9, -7), (21.3, -7), (22.6, -6), (26.6, -6), (27.7, -5), (28.7, -3)]:
    n = int(1.4 * SR); x = tt(n)
    boom = np.sin(2 * np.pi * (60 * np.exp(-x * 2) + 32) * x) * np.exp(-x * 3.2) + 0.5 * lp(rng.standard_normal(n), 2500) * np.exp(-x * 20)
    place('sfx', mono(boom.astype(np.float32)), tp_, g)
impact = load(A + 'sfx/impact.mp3'); place('sfx', impact, 30.3, -6)

# ------------------------------------------------------------------ sfx: macaw arrival & flight
riser = load(A + 'sfx/riser.mp3'); place('sfx', riser, 34.9, -9)
place('sfx', shimmer, 36.2, -5)
flaps = [load(A + f'sfx/flap_{i}.mp3') for i in range(1, 8)]
tf = 37.6; k = 0
while tf < 40.6:
    place('sfx', pan(flaps[k % 7].mean(1), -0.2 + 0.4 * (tf - 37.6) / 3), tf, -14 + 9 * (tf - 37.6) / 3); tf += 0.26 - 0.06 * (tf - 37.6) / 3; k += 1
place('sfx', load(A + 'sfx/call_full.mp3'), 38.7, -4)
place('sfx', load(A + 'sfx/wing_unfurl.mp3'), 40.35, -5)
place('sfx', load(A + 'sfx/call_chuckle.mp3'), 40.3, -7)
place('sfx', load(A + 'sfx/call_b.mp3'), 42.0, -8)
place('sfx', load(A + 'sfx/wing_unfurl.mp3'), 41.45, -9)
place('sfx', mono((boing[: int(0.3 * SR)] * 0.8).astype(np.float32)), 42.75, -12)
place('sfx', load(A + 'sfx/wing_boom.mp3'), 43.95, -1)
place('sfx', load(A + 'sfx/call_a.mp3'), 44.15, -6)
tf = 44.0; k = 0
while tf < 47.2:
    place('sfx', flaps[k % 7], tf, -6); tf += 0.2; k += 1
place('sfx', load(A + 'sfx/flyby.mp3'), 45.0, -5)
place('sfx', whoosh, 47.3, -6)
place('sfx', riser, 46.4, -5)
place('sfx', shimmer, 50.15, -4)
place('sfx', impact, 50.1, -12)
place('sfx', whoosh, 51.6, -8)
for i in range(16):
    place('sfx', pan(bell([2093, 2349, 2637, 3136, 3520][i % 5] * (0.5 if i % 3 else 1), 0.9, 0.6), rng.uniform(-0.6, 0.6)), 51.7 + i * 0.12, -24)
for i in range(8):
    place('sfx', pan(bell([523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.7, 1318.5][i], 2.2, 0.5), np.cos(i / 8 * 2 * np.pi) * 0.7), 54.0 + i * 0.36, -19)
place('sfx', shimmer, 56.9, -9)
place('sfx', load(A + 'sfx/flyby.mp3'), 58.7, -6)
for tw in [60.3, 61.4, 62.4]: place('sfx', whoosh, tw, -9)
place('sfx', load(A + 'sfx/stinger_complete.mp3'), 62.9, -2)
place('sfx', load(A + 'sfx/call_full.mp3'), 66.2, -11)

# ------------------------------------------------------------------ optional voice-over (vo/01.mp3 .. vo/07.mp3)
import os
VO_T = [0.9, 10.0, 17.2, 30.6, 36.8, 44.6, 58.6]
vo = np.zeros((N, 2), np.float32)
for i, tv in enumerate(VO_T):
    f = f'vo/{i + 1:02d}.mp3'
    if os.path.exists(f): x = load(f); n = min(len(x), N - int(tv * SR)); vo[int(tv * SR):int(tv * SR) + n] += x[:n]
if np.abs(vo).max() > 0:
    lvl = np.convolve(np.abs(vo).mean(1), np.ones(4800) / 4800, 'same')
    duck = 1 - 0.55 * np.clip(lvl / (lvl.max() * 0.25 + 1e-9), 0, 1)
    mix['music'] *= duck[:, None]; mix['amb'] *= (0.5 + 0.5 * duck)[:, None]
# ------------------------------------------------------------------ master
out = mix['music'] + mix['amb'] + mix['sfx'] + vo * db(2)
fade = np.interp(T, [0, 0.05, 69.0, 70.0], [0, 1, 1, 0]); out *= fade[:, None]
out = np.tanh(out * 1.1) / 1.1
peak = np.abs(out).max(); out = out / peak * db(-1.5)
out.astype(np.float32).tofile('mix_raw.f32')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'mix_raw.f32',
                '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), '-c:a', 'pcm_s16le', 'soundtrack.wav'], check=True)
print('ok', peak)
