"""Procedural SFX bank (numpy/scipy). Writes 48 kHz mono WAVs to audio/sfx/."""
import numpy as np, soundfile as sf, os
from scipy import signal

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), 'sfx')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(3)
t_ = lambda d: np.arange(int(SR * d)) / SR


def env(n, a=0.005, r=None, curve=4):
    e = np.ones(n)
    na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    x = np.linspace(0, 1, n - na)
    e[na:] = (1 - x) ** curve if r is None else np.exp(-x * (n - na) / SR / r)
    return e


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], 'bandpass', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, 'lowpass', fs=SR, output='sos'), x)


def norm(x, peak=0.9):
    return x / (np.abs(x).max() + 1e-9) * peak


def save(name, x):
    sf.write(os.path.join(OUT, name + '.wav'), norm(x).astype(np.float32), SR)


def sweep_noise(d, f0, f1, q=0.35):
    n = int(SR * d); x = rng.normal(0, 1, n); y = np.zeros(n); blk = 480
    for i in range(0, n, blk):
        f = f0 * (f1 / f0) ** (i / n)
        y[i:i + blk] = bp(x[max(0, i - 2048):i + blk], f * (1 - q), f * (1 + q))[-len(x[i:i + blk]):]
    return y


# whoosh: band-swept noise, swelling then fading
d = 0.45; w = sweep_noise(d, 300, 4000); save('whoosh', w * np.sin(np.pi * t_(d) / d) ** 2)
# cut: short transient click + tiny thump
d = 0.08; tt = t_(d); save('cut', (rng.normal(0, 1, len(tt)) * env(len(tt), 0.001, curve=12) * 0.6
                                   + np.sin(2 * np.pi * 90 * tt) * env(len(tt), 0.001, curve=3)))
# pop: pitch-dropping sine blip
d = 0.12; tt = t_(d); f = 900 * np.exp(-tt * 30) + 300; save('pop', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, curve=3))
# boom: sub drop + noise burst
d = 1.6; tt = t_(d); f = 120 * np.exp(-tt * 3) + 38
b = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.003, r=0.45)
b += lp(rng.normal(0, 1, len(tt)), 900) * env(len(tt), 0.001, r=0.08) * 0.8
save('boom', np.tanh(b * 1.6))
# riser: up-swept noise + rising saw-ish tone, 2.0 s, ends at peak
d = 2.0; tt = t_(d); r = sweep_noise(d, 200, 9000, 0.25) * (tt / d) ** 2
f = 110 * 2 ** (tt / d * 3); tone = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (tt / d) ** 3 * 0.3
save('riser', r + lp(tone, 5000))
# error beep: two harsh square beeps
d = 0.36; tt = t_(d); sq = signal.square(2 * np.pi * 440 * tt) * 0.5
gate = ((tt < 0.14) | ((tt > 0.2) & (tt < 0.34))).astype(float)
save('error', lp(sq, 3000) * gate)
# ding: bell partials
d = 1.1; tt = t_(d)
save('ding', sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(1318, 1), (2637, .4), (3950, .2), (1760, .25)]) * env(len(tt), 0.002, r=0.3))
# fan spin-up: rising filtered noise + blade hum
d = 1.4; tt = t_(d); fn = sweep_noise(d, 150, 2500, 0.5) * np.minimum(1, tt / 1.0)
hum = np.sin(2 * np.pi * np.cumsum(60 + 340 * (tt / d)) / SR) * 0.3 * (tt / d)
save('fan', (fn + hum) * np.minimum(1, (d - tt) / 0.2))
# tick: counter tick
d = 0.03; tt = t_(d); save('tick', np.sin(2 * np.pi * 2400 * tt) * env(len(tt), 0.0005, curve=6))
# type: keyboard click
d = 0.04; tt = t_(d); save('type', bp(rng.normal(0, 1, len(tt)), 1500, 6000) * env(len(tt), 0.0005, curve=8))
# flash: bright noise hit
d = 0.25; tt = t_(d); save('flash', bp(rng.normal(0, 1, len(tt)), 3000, 12000) * env(len(tt), 0.001, r=0.05))
# toast: two-tone notification
d = 0.3; tt = t_(d); f = np.where(tt < 0.1, 880, 1320)
save('toast', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, r=0.12))
print('sfx written:', sorted(os.listdir(OUT)))
