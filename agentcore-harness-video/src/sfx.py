"""Procedural SFX (numpy/scipy, 48 kHz mono). No samples, no randomness without a seed."""
import numpy as np
from scipy import signal
SR = 48000
def _n(sec): return int(sec * SR)
def _env(n, a=0.002, d=0.1, curve=4.0):
    t = np.arange(n) / SR; e = np.exp(-t * curve / max(d, 1e-3)); e[: int(a * SR) + 1] *= np.linspace(0, 1, int(a * SR) + 1)[: len(e[: int(a * SR) + 1])]; return e
def _bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos"); return signal.sosfilt(sos, x)
def _hp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, btype="high", fs=SR, output="sos"), x)
def _lp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, btype="low", fs=SR, output="sos"), x)
def _noise(n, seed): return np.random.default_rng(seed).standard_normal(n)
def norm(x, peak=0.9): return x / (np.max(np.abs(x)) + 1e-9) * peak
def tick(): n = _n(.06); t = np.arange(n) / SR; return norm(_bp(_noise(n, 1), 2500, 9000) * _env(n, .0005, .012) + .6 * np.sin(2 * np.pi * 1800 * t) * _env(n, .0005, .02), .5)
def whoosh(dur=.42):
    n = _n(dur); x = _noise(n, 2); out = np.zeros(n); t = np.linspace(0, 1, n)
    for i in range(0, n, 2048):
        c = 300 + 5200 * np.sin(np.pi * min(1, (i / n)) * .95) ** 1.5; seg = x[i:i + 4096]
        if len(seg) > 200: out[i:i + len(seg)] += _bp(seg, max(120, c * .6), min(15000, c * 1.4), 2)[: len(seg)] * np.hanning(len(seg))
    return norm(out * np.sin(np.pi * t) ** 1.2, .7)
def pop(): n = _n(.14); t = np.arange(n) / SR; f = 260 + 700 * np.exp(-t * 40); return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * _env(n, .001, .06), .6)
def ding():
    n = _n(.9); t = np.arange(n) / SR; x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in [(1318, 1, 5), (1975, .5, 7), (2637, .25, 9), (3951, .1, 12)])
    return norm(x, .55)
def err():
    n = _n(.36); t = np.arange(n) / SR; x = np.zeros(n)
    for s in (0, .18):
        i = int(s * SR); m = _n(.13); tt = np.arange(m) / SR; x[i:i + m] += signal.square(2 * np.pi * 196 * tt) * _env(m, .002, .1, 2.5)
    return norm(_lp(x, 2500), .5)
def scribble():
    n = _n(.42); x = _bp(_noise(n, 3), 1800, 6500) * (0.6 + .4 * np.sin(2 * np.pi * 22 * np.arange(n) / SR)) * np.hanning(n); return norm(x, .35)
def tape():
    n = _n(.5); x = _hp(_noise(n, 4), 1500) * (0.5 + .5 * np.abs(np.sin(2 * np.pi * 38 * np.arange(n) / SR))) * np.linspace(1, .2, n); return norm(x, .55)
def lock(): a = tick(); n = _n(.16); b = _bp(_noise(n, 5), 500, 3500) * _env(n, .0005, .03) * .9; out = np.zeros(_n(.3)); out[:len(a)] += a; out[_n(.09):_n(.09) + n] += b; return norm(out, .6)
def crash(dur=1.8): n = _n(dur); return norm(_hp(_noise(n, 6), 3000) * np.exp(-np.arange(n) / SR * 2.4) + .3 * _bp(_noise(n, 7), 400, 2000) * np.exp(-np.arange(n) / SR * 6), .7)
def scratch():
    n = _n(.55); t = np.arange(n) / SR; f = 900 * np.abs(np.sin(2 * np.pi * 3.3 * t)) ** .7 + 150; ph = np.cumsum(f) / SR
    x = (signal.sawtooth(2 * np.pi * ph) * .6 + _bp(_noise(n, 8), 800, 6000) * .8) * np.hanning(n) ** .5; return norm(_lp(x, 7000), .75)
def click(): n = _n(.05); return norm(_bp(_noise(n, 9), 1500, 5000) * _env(n, .0003, .01) + np.sin(2 * np.pi * 900 * np.arange(n) / SR) * _env(n, .0003, .015), .4)
def sweep(): n = _n(1.1); x = _bp(_noise(n, 10), 900, 4500) * (0.5 + .5 * np.sin(2 * np.pi * 7 * np.arange(n) / SR)) * np.hanning(n); return norm(x, .4)
def stamp(): n = _n(.35); t = np.arange(n) / SR; x = np.sin(2 * np.pi * (90 * np.exp(-t * 12) + 40) * t * 2) * _env(n, .001, .12) + _bp(_noise(n, 11), 200, 2500) * _env(n, .0005, .03) * .8; return norm(x, .8)
def boom():
    n = _n(2.2); t = np.arange(n) / SR; f = 34 + 90 * np.exp(-t * 9); sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    return norm(np.tanh(sub * 2.2) * .9 + _lp(_noise(n, 12), 1800) * np.exp(-t * 4) * .5 + _hp(_noise(n, 13), 5000) * np.exp(-t * 3.2) * .3, .95)
def riser(dur):
    n = _n(dur); t = np.arange(n) / SR; u = t / dur; f = 200 * (1 + 14 * u ** 2.2); ph = np.cumsum(f) / SR
    x = np.sin(2 * np.pi * ph) * .5 + _noise(n, 14) * .5 * u ** 1.6; x = _hp(x, 150) * (0.15 + .85 * u ** 1.8)
    return norm(x, .8)
LIB = {"tick": tick, "whoosh": whoosh, "pop": pop, "ding": ding, "err": err, "scribble": scribble, "tape": tape, "lock": lock, "crash": crash,
       "scratch": scratch, "click": click, "sweep": sweep, "stamp": stamp, "boom": boom}
GAIN_DB = {"tick": -21, "whoosh": -13, "pop": -17, "ding": -15, "err": -15, "scribble": -19, "tape": -15, "lock": -14, "crash": -10, "scratch": -8, "click": -19, "sweep": -16, "stamp": -10, "boom": -3, "riser": -8}
