"""Procedural score + SFX for YA-001 · CCM, driven by the page's CUES/CUTS.
Airy electronic, D major, 108 BPM, no vocals, ends on a hit at the last downbeat.
Usage: python3 audio.py A   ->  build/audio_A.wav (48 kHz stereo, pre-loudnorm)"""
import json, sys, pathlib
import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
FMT = sys.argv[1].upper()
TM = json.loads((ROOT / 'build' / f'timing_{FMT}.json').read_text())
SR = 48000
BEAT = TM['beat']
DUR = TM['frames'] / 30  # exactly the video's frame span, so -shortest never trims a frame
N = int(round(DUR * SR))
rng = np.random.default_rng(108)

def t_(sec):
    return np.arange(int(sec * SR)) / SR

def add(buf, x, at, gain=1.0, pan=0.0):
    """Mix mono or stereo x into stereo buf at time `at` (s), with equal-power pan."""
    i = int(round(at * SR))
    if i >= len(buf):
        return
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l, x * r], 1)
    j = min(len(buf), i + len(x))
    if i < 0:
        x = x[-i:]; i = 0
    buf[i:j] += x[: j - i] * gain

def lp(x, fc, order=2):
    b, a = signal.butter(order, min(fc, SR * 0.45) / (SR / 2), 'low'); return signal.lfilter(b, a, x, axis=0)

def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), 'high'); return signal.lfilter(b, a, x, axis=0)

def bp(x, f1, f2, order=2):
    b, a = signal.butter(order, [f1 / (SR / 2), min(f2, SR * 0.45) / (SR / 2)], 'band'); return signal.lfilter(b, a, x, axis=0)

def sweep_filter(x, f0, f1, kind='band', q=0.6, block=256):
    """Time-varying filter (exponential cutoff sweep) applied block by block with carried state."""
    out = np.zeros_like(x); n = len(x); zi = None; prev = None
    for s in range(0, n, block):
        k = s / max(1, n - 1)
        fc = f0 * (f1 / f0) ** k
        if kind == 'band':
            lo, hi = fc * (1 - q / 2), fc * (1 + q / 2)
            b, a = signal.butter(2, [lo / (SR / 2), min(hi, SR * 0.45) / (SR / 2)], 'band')
        else:
            b, a = signal.butter(2, min(fc, SR * 0.45) / (SR / 2), kind)
        if zi is None or len(zi) != max(len(a), len(b)) - 1:
            zi = signal.lfilter_zi(b, a) * 0
        out[s:s + block], zi = signal.lfilter(b, a, x[s:s + block], zi=zi)
    return out

def note(n):  # MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

# ---------------- arrangement ----------------
SECTION_OF = {'open': 'fog', 'pain': 'fog', 'promise': 'break', 'app': 'climb', 'repo': 'climb', 'env': 'climb', 'repoenv': 'climb',
              'model': 'climb', 'prompt': 'climb', 'render': 'climb', 'loop': 'hold', 'notam1': 'hold', 'notam2': 'hold', 'notam3': 'hold',
              'result': 'arrive', 'proof': 'arrive', 'reveal': 'finale', 'end': 'finale'}
shots = TM['shots']
def section_at(sec):
    cur = 'fog'
    for s in shots:
        if sec >= s['start'] - 1e-6:
            cur = SECTION_OF[s['key']]
    return cur

total_beats = TM['totalBeats']
final_hit = TM['finalHit']
final_beat = int(round(final_hit / BEAT))
# I – vi – IV – V in D major
CHORDS = [[50, 57, 62, 66, 69], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62], [45, 52, 57, 61, 64]]
ROOTS = [38, 35, 43, 45]

music = np.zeros((N, 2))
pad_dark = np.zeros((N, 2)); pad_bright = np.zeros((N, 2))
bright = np.zeros(N)

# pad: detuned saws per bar, crossfaded; dark/bright versions blended by section
for bar in range(int(np.ceil(total_beats / 4)) + 1):
    t0 = bar * 4 * BEAT
    if t0 >= final_hit + 1e-6:
        break
    length = 4 * BEAT + 1.2
    tt = t_(length)
    env = np.minimum(1, tt / 0.5) * np.minimum(1, np.maximum(0, (length - tt) / 1.2))
    chord = CHORDS[bar % 4]
    for v, m in enumerate(chord[1:]):
        for det, pan in ((-0.09, -0.6), (0.0, 0.0), (0.08, 0.6)):
            f = note(m + det)
            saw = 2 * ((tt * f + rng.random()) % 1) - 1
            x = saw * env * 0.05
            add(pad_dark, lp(x, 900), t0, 1, pan)
            add(pad_bright, lp(x, 3200), t0, 1, pan)

level = {'fog': 0.0, 'break': 0.45, 'climb': 0.8, 'hold': 0.35, 'arrive': 0.85, 'finale': 1.0}
sec_curve = np.array([level[section_at(i / SR)] for i in range(0, N, 480)])
bright = np.interp(np.arange(N), np.arange(0, N, 480), sec_curve)
bright = lp(bright, 2.0, 1)
pad = pad_dark * (1 - bright[:, None]) + pad_bright * bright[:, None]

# drums, bass, plucks on the beat grid
def kick():
    tt = t_(0.45); f = 45 + 80 * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 7.5) + 0.3 * np.exp(-tt * 300) * rng.standard_normal(len(tt)) * 0.3
def snare():
    tt = t_(0.25)
    return bp(rng.standard_normal(len(tt)), 1200, 6000) * np.exp(-tt * 22) * 0.7 + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 30) * 0.4
def hat(open_=False):
    tt = t_(0.18 if open_ else 0.05)
    return hp(rng.standard_normal(len(tt)), 7500) * np.exp(-tt * (18 if open_ else 90))
def pluck(f, dur=0.45):
    tt = t_(dur)
    x = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(4 * np.pi * f * tt) + 0.12 * np.sin(6 * np.pi * f * tt)
    return x * np.exp(-tt * 9) * np.minimum(1, tt / 0.004)
def bass(f, dur):
    tt = t_(dur)
    x = np.tanh(1.6 * (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)))
    return lp(x * np.minimum(1, tt / 0.01) * np.exp(-tt * 2.2), 600)

drums = np.zeros((N, 2)); bassbus = np.zeros((N, 2)); plk = np.zeros((N, 2))
duck = np.ones(N)
K, Sn = kick(), snare()
for b in range(final_beat):
    tb = b * BEAT
    sec = section_at(tb + 1e-4)
    beat_in_bar = b % 4
    bar = b // 4
    chord = CHORDS[bar % 4]
    if sec in ('climb', 'arrive', 'finale') or (sec == 'break' and beat_in_bar in (0, 2)) or (sec == 'hold' and beat_in_bar == 0):
        add(drums, K, tb, 0.9)
        i = int(tb * SR); w = int(0.22 * SR)
        duck[i:i + w] = np.minimum(duck[i:i + w], 0.55 + 0.45 * np.linspace(0, 1, len(duck[i:i + w])) ** 0.6)
    if sec in ('climb', 'arrive', 'finale') and beat_in_bar in (1, 3):
        add(drums, Sn, tb, 0.45, 0.05)
    if sec != 'fog':
        add(drums, hat(), tb + BEAT / 2, 0.22 if sec != 'hold' else 0.14, 0.35)
        if sec in ('climb', 'arrive', 'finale'):
            add(drums, hat(), tb, 0.12, -0.35)
    if sec in ('climb', 'arrive', 'finale'):
        for k in range(2):
            add(bassbus, bass(note(ROOTS[bar % 4]), BEAT / 2 * 0.95), tb + k * BEAT / 2, 0.35)
    # plucks: quarter notes in the fog, 8ths after the breakthrough, an octave up in the finale
    steps = 1 if sec == 'fog' else 2
    for k in range(steps):
        idx = (b * steps + k)
        m = chord[1 + (idx * 2) % 4] + 12 + (12 if sec == 'finale' and k == 1 else 0)
        g = {'fog': 0.10, 'break': 0.13, 'climb': 0.14, 'hold': 0.09, 'arrive': 0.14, 'finale': 0.16}[sec]
        add(plk, pluck(note(m)), tb + k * BEAT / steps, g, -0.3 if idx % 2 else 0.3)
# dotted-eighth delay on plucks
d = int(0.75 * BEAT * SR)
for k, g in ((1, 0.35), (2, 0.15)):
    plk[d * k:] += plk[:-d * k][:, ::-1] * g if k == 1 else plk[:-d * k] * g

# final hit: kick + crash + chord stab at the last downbeat
tt = t_(DUR - final_hit + 0.01)
crash = hp(rng.standard_normal(len(tt)), 4000) * np.exp(-tt * 2.6) * 0.35
stab = sum(np.sin(2 * np.pi * note(m + 12) * tt) for m in CHORDS[0][1:]) * np.exp(-tt * 1.8) * 0.12
add(drums, K, final_hit, 1.2)
add(drums, np.stack([crash, crash[::-1] * 0 + crash], 1), final_hit, 1)
add(plk, stab, final_hit, 1)

music = pad * duck[:, None] * 0.9 + bassbus * duck[:, None] + drums + plk

# ---------------- SFX from page cues ----------------
sfx = np.zeros((N, 2))
for c in TM['cues']:
    at, ty = c['t'], c['type']
    if ty == 'whoosh':
        L = 0.6 if not c.get('soft') else 0.45
        tt = t_(L); env = np.sin(np.pi * np.clip(tt / L, 0, 1)) ** 1.5
        x = sweep_filter(rng.standard_normal(len(tt)), 300, 2600, 'band', 0.9) * env
        add(sfx, x, at - 0.05, 0.55 if not c.get('soft') else 0.3, 0)
        add(sfx, sweep_filter(rng.standard_normal(len(tt)), 2600, 500, 'band', 0.9) * env, at - 0.05, 0.25, 0.5)
    elif ty == 'swipe':
        L = 0.35; tt = t_(L); env = np.sin(np.pi * tt / L) ** 2
        add(sfx, sweep_filter(rng.standard_normal(len(tt)), 3000, 6000, 'band', 0.7) * env, at, 0.12, -0.2)
    elif ty == 'swell':
        L = c.get('dur', 1.5); tt = t_(L + 0.4)
        env = np.minimum(1, tt / L) ** 1.5 * np.minimum(1, np.maximum(0, (L + 0.4 - tt) / 0.4))
        brown = lp(np.cumsum(rng.standard_normal(len(tt))) * 0.02, 220)
        f = 70 + 40 * np.minimum(1, tt / L)
        hum = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4
        x = (brown / (np.abs(brown).max() + 1e-9) * 0.6 + hum) * env
        add(sfx, x, at, 0.32, 0)
    elif ty == 'rumble':
        L = c.get('dur', 2.0); tt = t_(L)
        env = np.minimum(1, tt / 0.4) * np.minimum(1, (L - tt) / 0.4) * (0.7 + 0.3 * np.sin(2 * np.pi * 5.3 * tt))
        x = lp(rng.standard_normal(len(tt)), 160) * env
        add(sfx, x / (np.abs(x).max() + 1e-9), at, 0.18, 0)
    elif ty == 'pen':
        L = c.get('dur', 0.8); tt = t_(L)
        mod = np.abs(lp(rng.standard_normal(len(tt)), 30)); mod /= mod.max() + 1e-9
        x = bp(rng.standard_normal(len(tt)), 2500, 7000) * mod * np.sin(np.pi * tt / L)
        add(sfx, x, at, 0.07, 0.2)
    elif ty == 'pop':
        f0 = 1300 if c.get('hi') else 850
        tt = t_(0.09); f = f0 * (1 - 0.35 * np.minimum(1, tt / 0.05))
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 45)
        add(sfx, x, at, 0.22, 0.15)
    elif ty == 'tick':
        tt = t_(0.02)
        x = hp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 400) + np.sin(2 * np.pi * 3100 * tt) * np.exp(-tt * 500) * 0.4
        add(sfx, x, at, 0.06 if c.get('soft') else 0.09, rng.uniform(-0.3, 0.3))
    elif ty == 'chime':
        notes = [86, 90, 93, 98][: max(1, c.get('n', 1))]
        tt = t_(1.6)
        for k, m in enumerate(notes):
            f = note(m)
            x = (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * 2.76 * f * tt) * np.exp(-tt * 3) + 0.2 * np.sin(2 * np.pi * 5.4 * f * tt) * np.exp(-tt * 6)) * np.exp(-tt * 2.2)
            add(sfx, x * np.minimum(1, tt / 0.003), at + k * 0.04, 0.09, -0.4 + 0.8 * k / max(1, len(notes) - 1))
    elif ty == 'riser':
        L = c.get('dur', 4 * BEAT); tt = t_(L)
        env = (tt / L) ** 2.2
        x = sweep_filter(rng.standard_normal(len(tt)), 400, 9000, 'band', 0.8) * env
        f = 180 * (6 ** (tt / L))
        tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * env * 0.25
        add(sfx, x + tone, at, 0.35, 0)
    elif ty == 'impact':
        tt = t_(min(2.5, DUR - at + 0.01))
        f = 38 + 60 * np.exp(-tt * 10)
        boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.5)
        thump = lp(rng.standard_normal(len(tt)), 400) * np.exp(-tt * 12)
        add(sfx, boom + thump * 0.6, at, 0.8, 0)

# reverb on the musical bus + SFX send
ir_t = t_(2.4)
ir = np.stack([rng.standard_normal(len(ir_t)), rng.standard_normal(len(ir_t))], 1) * np.exp(-ir_t * 2.8)[:, None]
ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum(0))
send = pad * 0.6 + plk * 0.8 + sfx * 0.3
wet = np.stack([signal.fftconvolve(send[:, k], ir[:, k])[:N] for k in range(2)], 1)
mix = music + sfx + wet * 0.35
# gentle fade on the very last frames so the hit rings into the cut without a click
fade = int(0.12 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix = hp(mix, 28)
mix /= np.abs(mix).max() / 0.8
out = ROOT / 'build' / f'audio_{FMT}.wav'
wavfile.write(out, SR, mix.astype(np.float32))
print(out, f'{N / SR:.3f} s')
