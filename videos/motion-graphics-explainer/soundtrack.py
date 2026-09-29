"""Procedural 120 BPM retro-synth soundtrack + SFX, synced to the scene cuts in index.html."""
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR, DUR, BPM = 44100, 72.0, 120
BEAT = 60 / BPM
N = int(DUR * SR)
L, R = np.zeros(N), np.zeros(N)
rng = np.random.default_rng(7)

CUTS = [4.5, 9, 12, 14.5, 18, 21.5, 25, 28.5, 32, 35.5, 39, 42.5, 45.5, 50, 66]
BIG = {12, 42.5, 66}           # section impacts
BREAK = (41.0, 42.5)           # drums out, riser in


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)


def lp(x, fc, order=2):
    b, a = butter(order, min(fc / (SR / 2), 0.99), 'low')
    return lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), 'high')
    return lfilter(b, a, x)


def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band')
    return lfilter(b, a, x)


def add(sig, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * g * (1 - pan) ** 0.5 * 1.0
    R[i:i + len(sig)] += sig * g * (1 + pan) ** 0.5 * 1.0


def in_break(t):
    return BREAK[0] <= t < BREAK[1]


# ---------- instruments ----------
def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.16) + 0.3 * hp(rng.standard_normal(n), 3000) * env(n, 0.0005, 0.004)


def clap():
    n = int(0.25 * SR)
    x = bp(rng.standard_normal(n), 900, 5000)
    e = sum(env(n, 0.0005, 0.012) * (np.arange(n) >= int(k * 0.011 * SR)) for k in range(3)) + env(n, 0.001, 0.09)
    return x * e * 0.6


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    return hp(rng.standard_normal(n), 7000) * env(n, 0.0005, 0.06 if open_ else 0.015)


def saw(f, n, detune=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * f * (1 + detune)) % 1) - 1


def square(f, n):
    t = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * f * t))


def whoosh(len_=0.45):
    n = int(len_ * SR); t = np.linspace(0, 1, n)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for k in range(8):                      # sweeping band
        a, b = int(k * n / 8), int((k + 1) * n / 8)
        fc = 400 + 5000 * (k / 7) ** 2
        out[a:b] = bp(x, fc, min(fc * 2.5, 18000))[a:b]
    return out * np.sin(np.pi * t) ** 2 * 0.5


def impact():
    n = int(1.6 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(35 + 60 * np.exp(-t * 12)) / SR) * env(n, 0.002, 0.5)
    crash = hp(rng.standard_normal(n), 2500) * env(n, 0.001, 0.45) * 0.35
    return boom + crash


def riser(len_):
    n = int(len_ * SR); t = np.linspace(0, 1, n)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for k in range(16):
        a, b = int(k * n / 16), int((k + 1) * n / 16)
        fc = 300 + 7000 * (k / 15) ** 2
        out[a:b] = bp(x, fc, fc * 1.8)[a:b]
    tone = np.sin(2 * np.pi * np.cumsum(200 + 900 * t ** 2) / SR) * 0.15
    return (out * 0.6 + tone) * t ** 2


def blip(f=1200, d=0.06):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (f + 1400 * np.exp(-t * 60)) * t) * env(n, 0.001, d / 3)


def click():
    n = int(0.012 * SR)
    return bp(rng.standard_normal(n), 1500, 6000) * env(n, 0.0003, 0.003)


# ---------- drums ----------
kick_env = np.zeros(N)
for b in range(int(DUR / BEAT)):
    t = b * BEAT
    if t < 0.25 or in_break(t) or t >= 71.5:
        continue
    add(kick(), t, 0.95)
    i = int(t * SR); m = min(N - i, int(0.3 * SR))
    kick_env[i:i + m] = np.maximum(kick_env[i:i + m], env(m, 0.001, 0.12))
    if b % 2 == 1:
        add(clap(), t, 0.55, 0.05)
for s in range(int(DUR / (BEAT / 2))):
    t = s * BEAT / 2
    if t < 0.25 or in_break(t) or t >= 71.5:
        continue
    add(hat(open_=(s % 2 == 1)), t, 0.16 if s % 2 else 0.1, 0.3 if s % 2 else -0.3)

# ---------- music: Am  F  C  G (one bar = 2s) ----------
prog = [(110.0, [220.0, 261.63, 329.63]), (87.31, [174.61, 220.0, 261.63]),
        (130.81, [261.63, 329.63, 392.0]), (98.0, [196.0, 246.94, 293.66])]
bus_L, bus_R = np.zeros(N), np.zeros(N)


def add_bus(sig, t, g, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    bus_L[i:i + len(sig)] += sig * g * (1 - pan) ** 0.5
    bus_R[i:i + len(sig)] += sig * g * (1 + pan) ** 0.5


bar = 4 * BEAT
for k in range(int(DUR / bar) + 1):
    t0 = k * bar
    root, chord = prog[k % 4]
    if t0 >= 71.5:
        break
    # bass: offbeat 8ths, octave jumps
    for e in range(8):
        t = t0 + e * BEAT / 2
        if in_break(t) or t >= 71.5:
            continue
        f = root * (2 if e in (3, 7) else 1) / 2 * 2
        n = int(BEAT / 2 * 0.9 * SR)
        add_bus(lp(saw(f, n) + 0.5 * square(f / 2, n), 700) * env(n, 0.003, 0.2), t, 0.34)
    # pad
    n = int(bar * SR)
    pad = sum(saw(f, n, d) for f in chord for d in (-0.004, 0.004))
    pad = lp(pad, 1400 if t0 > 12 else 900) * np.minimum(np.arange(n) / (0.3 * SR), 1) * np.minimum((n - np.arange(n)) / (0.1 * SR), 1)
    add_bus(pad, t0, 0.05, -0.2 if k % 2 else 0.2)
    # arp 16ths (from the "8 moves" section on)
    if t0 >= 14:
        notes = chord + [chord[0] * 2, chord[1] * 2, chord[2] * 2]
        for sidx in range(16):
            t = t0 + sidx * BEAT / 4
            if in_break(t) or t >= 71.5:
                continue
            n2 = int(BEAT / 4 * SR)
            f = notes[(sidx * 2 + sidx // 4) % len(notes)] * 2
            add_bus(lp(square(f, n2), 3000) * env(n2, 0.002, 0.05), t, 0.045, 0.4 if sidx % 2 else -0.4)

duck = 1 - 0.6 * kick_env
L += bus_L * duck
R += bus_R * duck

# ---------- SFX ----------
for c in CUTS:
    if c in BIG:
        add(impact(), c, 0.8)
    add(whoosh(), c - 0.3, 0.55, rng.uniform(-0.4, 0.4))
add(riser(1.5), BREAK[0], 0.55)
# hook: letter drops (MOTION stagger), question mark pop
for k in range(6):
    add(blip(900 + k * 120), 0.35 + k * 0.07, 0.35)
add(blip(1800, 0.12), 1.45, 0.4)
# ingredient tiles + move headers
for k in range(4):
    add(blip(700 + k * 200), 6.6 + k * 0.1, 0.3)
for i in range(8):
    add(blip(1500, 0.05), 14.5 + i * 3.5 + 0.1, 0.25)
add(blip(500, 0.2), 18 + 0.4, 0.35)          # POP card
add(blip(2200, 0.08), 45.5 + 2.2, 0.3)       # sonnet card
add(impact() * 0.5, 69.2, 0.6)                # bookmark lands
# terminal typing
RL = 16 / 6
typing = [(50.2, 0.6)] + [(50 + k * RL + (0.8 if k == 0 else 0.15), 1.4 if k == 0 else 1.5) for k in range(6)]
for s, d in typing:
    t = s
    while t < s + d:
        add(click(), t, 0.25, rng.uniform(-0.2, 0.2))
        t += rng.uniform(0.03, 0.07)

# ---------- master ----------
mix = np.stack([L, R], 1)
fade = np.ones(N); fn = int(0.5 * SR); fade[-fn:] = np.linspace(1, 0, fn)
mix *= fade[:, None]
mix = np.tanh(mix * 1.1)
mix /= np.abs(mix).max() / 0.89
wavfile.write('soundtrack.wav', SR, (mix * 32767).astype(np.int16))
print('ok', mix.shape)
