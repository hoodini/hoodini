"""Procedural score + SFX for FZ1073 (no voiceover).

Reads build/timing-h.json (CUTS/CUES emitted by the page) and writes build/tmp/mix.wav,
mixed to -14 LUFS integrated / -1 dBTP. Deterministic (seeded).
Character: warm pads at 84 BPM, no percussion for the first 20 s, a soft low pulse after,
sparse bright notes from shot 9, slow hopeful resolve, fade-out (no end hit).
SFX (very quiet): air on transitions, a faint tick per transponder digit, a gentle radar sweep.
"""
import json, os
import numpy as np
from scipy import signal
import pyloudnorm as pyln
from scipy.ndimage import minimum_filter1d

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(os.path.join(ROOT, 'build/timing-h.json')))
SR = 48000
DUR = T['DURATION']
N = int(round(DUR * SR))
BEAT = 60 / T['BPM']
BAR = 4 * BEAT
rng = np.random.default_rng(1073)
cut = {c['key']: c for c in T['CUTS']}
t_storm, t_turn, t_why, t_end = cut['turbulence']['start'] - 0.6, cut['turn']['start'] - 0.6, cut['why1']['start'] - 0.6, cut['end']['start']

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

# ---- chord plan (MIDI notes), one chord per 2 bars, chosen by section ----
D, Bm, G, Em, Fsm, A, Dsus = [50, 57, 62, 64, 66], [47, 54, 59, 62, 66], [43, 55, 59, 62, 67], [40, 52, 59, 62, 67], [42, 54, 57, 61, 64], [45, 52, 57, 61, 64], [50, 57, 62, 64, 69]
def chord_at(t):
    if t < t_storm: seq = [D, G]
    elif t < t_turn: seq = [Bm, G, Em, Fsm]
    elif t < t_why: seq = [G, A, Bm, A]
    else: seq = [G, D, Em, A, D, D]
    idx = int(t // (2 * BAR))
    if t >= t_why:  # resolve section: count from its own start so it lands on D at the end
        idx = int((t - t_why) // (2 * BAR))
        return seq[min(idx, len(seq) - 1)]
    return seq[idx % len(seq)]

t = np.arange(N) / SR
pad = np.zeros((N, 2))
seg = 2 * BAR
starts = np.arange(0, DUR + seg, seg)
# also re-anchor at section boundaries so chord changes align with story beats
bounds = sorted(set([0.0, t_storm, t_turn, t_why] + [s for s in starts if s < DUR]))
for i, s0 in enumerate(bounds):
    s1 = bounds[i + 1] if i + 1 < len(bounds) else DUR
    if s1 - s0 < 0.5: continue
    ch = chord_at(s0 + 0.01)
    a0, a1 = max(0, int((s0 - 0.9) * SR)), min(N, int((s1 + 0.9) * SR))
    tt = t[a0:a1] - t[a0]
    L = a1 - a0
    env = np.minimum(1, tt / 1.4) * np.minimum(1, (L / SR - tt) / 1.4)
    env = np.clip(env, 0, 1) ** 1.5
    for k, n in enumerate(ch):
        f = midi(n)
        for det, pan in ((-0.07, 0.25), (0.0, 0.5), (0.07, 0.75)):
            ff = f * 2 ** (det / 12)
            ph = rng.uniform(0, 2 * np.pi)
            w = np.zeros(L)
            for h in range(1, 7):  # soft saw-ish, few partials
                w += np.sin(2 * np.pi * ff * h * tt + ph * h) / (h ** 1.6)
            amp = (0.9 if k == 0 else 0.55) * env
            pad[a0:a1, 0] += w * amp * (1 - pan)
            pad[a0:a1, 1] += w * amp * pan
# section-dependent warmth (lowpass sweeps): darker in the storm, opens up toward the end
def lp(x, fc):
    b, a = signal.butter(2, fc / (SR / 2), 'low'); return signal.lfilter(b, a, x, axis=0)
pad_dark, pad_open = lp(pad, 900), lp(pad, 2600)
mixw = np.interp(t, [0, t_storm, t_storm + 2, t_turn, t_why, DUR], [0.6, 0.6, 0.0, 0.15, 0.85, 1.0])[:, None]
pad = pad_dark * (1 - mixw) + pad_open * mixw
pad *= np.interp(t, [0, 2.5, t_storm, t_storm + 2, t_turn, t_why, DUR], [0.0, 1, 1, 0.8, 0.85, 1, 1])[:, None]

# ---- soft low pulse from 20 s (sub sine on each beat, fades in) ----
pulse = np.zeros(N)
pt0 = 20.0
for k in range(int(DUR / BEAT) + 1):
    bt = k * BEAT
    if bt < pt0 or bt > DUR - 3.5: continue
    root = chord_at(bt + 0.01)[0] - 12
    a0 = int(bt * SR); L = min(int(0.6 * SR), N - a0)
    tt = np.arange(L) / SR
    e = (1 - np.exp(-tt / 0.02)) * np.exp(-tt / 0.22)
    pulse[a0:a0 + L] += np.sin(2 * np.pi * midi(root) * tt) * e * (0.7 if k % 2 == 0 else 0.45)
pulse *= np.interp(t, [0, pt0, pt0 + 4, DUR - 4, DUR], [0, 0, 1, 1, 0])

# ---- sparse bright notes from shot 9 ----
bell = np.zeros((N, 2))
r2 = np.random.default_rng(84)
k0 = int(np.ceil((t_why + 0.3) / BEAT))
for k in range(k0, int((DUR - 2.0) / BEAT)):
    if r2.random() > 0.38: continue
    bt = k * BEAT
    ch = chord_at(bt + 0.01)
    n = ch[int(r2.integers(1, len(ch)))] + 24
    a0 = int(bt * SR); L = min(int(2.4 * SR), N - a0)
    tt = np.arange(L) / SR
    e = (1 - np.exp(-tt / 0.004)) * np.exp(-tt / 0.7)
    w = np.sin(2 * np.pi * midi(n) * tt) + 0.25 * np.sin(2 * np.pi * midi(n) * 2.0 * tt) * np.exp(-tt / 0.3)
    pan = r2.uniform(0.3, 0.7)
    bell[a0:a0 + L, 0] += w * e * (1 - pan); bell[a0:a0 + L, 1] += w * e * pan

# ---- reverb (seeded synthetic IR) ----
def reverb(x, secs=2.8, wet=0.35):
    L = int(secs * SR); r3 = np.random.default_rng(7)
    ir = r3.standard_normal((L, 2)) * np.exp(-np.arange(L) / SR / (secs / 6.5))[:, None]
    ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum(axis=0))
    y = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], axis=1)
    return x * (1 - wet) + y * wet

music = reverb(pad * 0.05 + bell * 0.035, wet=0.4) + pulse[:, None] * 0.05
music *= np.interp(t, [0, DUR - 3.2, DUR], [1, 1, 0])[:, None] ** 1.2   # fade out, no end hit

# ---- SFX ----
sfx = np.zeros((N, 2))
def bp(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return signal.lfilter(b, a, x)
r4 = np.random.default_rng(30)
for c in T['CUES']:
    a0 = int(c['t'] * SR)
    if c['type'] == 'air':
        L = min(int(0.9 * SR), N - a0); tt = np.arange(L) / SR
        nz = bp(r4.standard_normal(L), 250, 2200)
        e = np.sin(np.pi * np.clip(tt / 0.9, 0, 1)) ** 2
        pan = 0.5 + 0.25 * np.sin(2 * np.pi * tt / 0.9)
        sfx[a0:a0 + L, 0] += nz * e * 0.010 * (1 - pan); sfx[a0:a0 + L, 1] += nz * e * 0.010 * pan
    elif c['type'] == 'tick':
        L = min(int(0.03 * SR), N - a0); tt = np.arange(L) / SR
        w = (np.sin(2 * np.pi * 2600 * tt) * 0.6 + bp(r4.standard_normal(L), 1500, 6000) * 0.4) * np.exp(-tt / 0.006)
        sfx[a0:a0 + L] += (w * 0.020)[:, None]
    elif c['type'] == 'radar':
        dur = c.get('dur', 3.0) + 0.6
        L = min(int(dur * SR), N - a0); tt = np.arange(L) / SR
        nz = r4.standard_normal(L)
        # sweep a resonant band slowly, two passes, very soft
        out = np.zeros(L); blk = 2048
        zi = None
        for s in range(0, L, blk):
            ph = (tt[s] / dur) * 2 % 1
            fc = 300 + 1500 * np.sin(np.pi * ph)
            b, a = signal.butter(2, [fc * 0.8 / (SR / 2), fc * 1.25 / (SR / 2)], 'band')
            if zi is None: zi = signal.lfilter_zi(b, a) * 0
            out[s:s + blk], zi = signal.lfilter(b, a, nz[s:s + blk], zi=zi)
        e = np.minimum(1, tt / 0.4) * np.minimum(1, (dur - tt) / 0.6)
        pan = 0.5 + 0.3 * np.sin(2 * np.pi * 2 * tt / dur)
        sfx[a0:a0 + L, 0] += out * e * 0.012 * (1 - pan); sfx[a0:a0 + L, 1] += out * e * 0.012 * pan

mix = music + sfx

# ---- loudness: -14 LUFS integrated, -1 dBTP ----
meter = pyln.Meter(SR)
mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -14.0)
def true_peak(x):
    up = signal.resample_poly(x, 4, 1, axis=0); return 20 * np.log10(np.max(np.abs(up)) + 1e-12)
ceiling = 10 ** (-1.3 / 20)
for _ in range(6):
    tp = true_peak(mix)
    if tp <= -1.2: break
    # smooth gain-reduction limiter (look-ahead envelope on 4x-oversampled peak)
    up = np.max(np.abs(signal.resample_poly(mix, 4, 1, axis=0)), axis=1)
    pk = up.reshape(-1, 4).max(axis=1)[:len(mix)]
    g = np.minimum(1, ceiling / np.maximum(pk, 1e-9))
    win = int(0.008 * SR)
    g = minimum_filter1d(g, size=2 * win)                         # look-ahead/hold
    g = np.convolve(g, np.ones(win) / win, mode='same')          # smooth the gain curve
    mix = mix * g[:, None]
    mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -14.0)
print('LUFS %.2f  TP %.2f dBTP  dur %.3f' % (meter.integrated_loudness(mix), true_peak(mix), len(mix) / SR))
os.makedirs(os.path.join(ROOT, 'build/tmp'), exist_ok=True)
from scipy.io import wavfile
wavfile.write(os.path.join(ROOT, 'build/tmp/mix.wav'), SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
