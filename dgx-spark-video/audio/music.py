"""Procedural 140 BPM trap/electronic bed (numpy/scipy) — fallback when ElevenLabs music isn't available.
Beat grid is anchored so a downbeat lands exactly on the product reveal (the drop). Breakdown before the verdict.
Writes audio/music.wav (48k stereo) and page/beats.js (kick times for beat-synced micro-zoom)."""
import json, os, re
import numpy as np, soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
SR, BPM = 48000, 140
BEAT = 60 / BPM; STEP = BEAT / 4; BAR = BEAT * 4
T = json.loads(re.sub(r'^window.TIMINGS=|;$', '', open(os.path.join(HERE, '..', 'page', 'timings.js')).read().strip()))
L = T['lines']; DUR = T['duration']
def wt(key, word):
    for w in L[key]['words']:
        if w['w'].lower().startswith(word.lower()): return w['s']
    raise KeyError(word)

T_DROP = wt('w1', 'Spark')              # product reveal
T_BREAK = L['c2']['start'] - 0.2        # breakdown before the verdict
T_VERD = L['v1']['start']               # final section
T_SEC = [L[k]['start'] for k in ('p1', 'r1', 'b1', 'c1')]  # crash on section starts
T_END = L['v1']['end'] + 0.12       # hard stop right after 'bottleneck.'

rng = np.random.default_rng(11)
N = int(SR * DUR); outL = np.zeros(N); outR = np.zeros(N)
ts = lambda d: np.arange(int(SR * d)) / SR

def add(x, t, g=1.0, pan=0.0):
    i = int(round(t * SR))
    if i >= N or i + len(x) <= 0: return
    a = max(0, i); b = min(N, i + len(x)); seg = x[a - i:b - i] * g
    outL[a:b] += seg * np.sqrt(0.5 * (1 - pan)) * 1.414; outR[a:b] += seg * np.sqrt(0.5 * (1 + pan)) * 1.414

def filt(x, kind, f, order=2):
    return signal.sosfilt(signal.butter(order, f, kind, fs=SR, output='sos'), x)

# ---- instruments ----
def kick():
    t = ts(0.32); f = 45 + 110 * np.exp(-t * 38)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
    x[:120] += rng.normal(0, .5, 120) * np.linspace(1, 0, 120)
    return np.tanh(x * 1.8)
def b808(freq, d=0.62):
    t = ts(d); f = freq * (1 + 0.5 * np.exp(-t * 30))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / .004) * np.exp(-t * 2.6)
    return np.tanh(x * 2.2) * .8
def snare():
    t = ts(0.22); n = filt(rng.normal(0, 1, len(t)), 'bandpass', [1200, 7000]) * np.exp(-t * 20)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
    clap = sum(np.roll(filt(rng.normal(0, 1, len(t)), 'bandpass', [900, 3000]) * np.exp(-t * 60), int(k * .011 * SR)) for k in range(3))
    return n * .8 + tone * .6 + clap * .5
def hat(open_=False):
    d = .22 if open_ else .045; t = ts(d)
    return filt(rng.normal(0, 1, len(t)), 'highpass', 7500) * np.exp(-t * (14 if open_ else 90))
def crash():
    t = ts(1.8); return filt(rng.normal(0, 1, len(t)), 'highpass', 4000) * np.exp(-t * 2.2) * .7
def saw_chord(freqs, d, cutoff, detune=0.006):
    t = ts(d); x = sum(signal.sawtooth(2 * np.pi * f * (1 + dt) * t) for f in freqs for dt in (-detune, 0, detune))
    return filt(x / (3 * len(freqs)), 'lowpass', cutoff)

# A-minor trap progression: Am – F – G – Em
PROG = [(55.0, [220.0, 261.63, 329.63]), (43.65, [174.61, 220.0, 261.63]), (49.0, [196.0, 246.94, 293.66]), (41.2, [164.81, 196.0, 246.94])]
KICK_STEPS = [0, 7, 10]; B808_STEPS = [0, 7, 10, 14]

# bars anchored on the drop
first_bar = T_DROP - np.ceil(T_DROP / BAR) * BAR
beats = []
bar_t = first_bar; bi = 0
while bar_t < T_END:
    root, chord = PROG[bi % 4]
    full = T_DROP - 1e-3 <= bar_t < T_BREAK - 1e-3 or T_VERD - 1e-3 <= bar_t
    intro = bar_t < T_DROP - 1e-3
    brk = T_BREAK - 1e-3 <= bar_t < T_VERD - 1e-3
    # pad (always, quieter in full sections)
    pad = saw_chord(chord, BAR + .05, 700 if (intro or brk) else 1100)
    pad *= np.minimum(1, ts(BAR + .05) / .08) * np.minimum(1, (BAR + .05 - ts(BAR + .05)) / .1)
    add(pad, bar_t, .35 if (intro or brk) else .22, pan=-.15); add(pad, bar_t + .012, .35 if (intro or brk) else .22, pan=.15)
    for s in range(16):
        st = bar_t + s * STEP
        if st < 0 or st >= T_END: continue
        if intro:  # filtered hats that open up toward the drop
            if s % 2 == 0: add(filt(hat(), 'lowpass', 3000 + 9000 * max(0, st / T_DROP)), st, .25 + .25 * st / T_DROP, pan=.3)
            continue
        if brk:
            if s % 4 == 0: add(hat(), st, .12, pan=.3)
            continue
        if full:
            if s in KICK_STEPS: add(kick(), st, .9); beats.append(round(st, 3))
            if s in B808_STEPS: add(b808(root, .55 if s != 14 else .25), st, .75)
            if s == 8: add(snare(), st, .75)
            roll = (bi % 2 == 1 and s >= 12)
            if s % 2 == 0 or roll: add(hat(), st, .32 if s % 4 == 0 else .22, pan=.35)
            if roll: add(hat(), st + STEP / 2, .16, pan=.35)
            if s == 6 and bi % 4 == 3: add(hat(True), st, .2, pan=-.3)
            if s in (3, 11) and bi % 2 == 0: add(saw_chord([c * 2 for c in chord], .16, 2600) * np.exp(-ts(.16) * 18), st, .3, pan=-.25)
    nxt = bar_t + BAR
    if bar_t < T_VERD - 1e-3 < nxt: nxt = T_VERD   # re-anchor the final section on the verdict
    bar_t = nxt; bi += 1

for t in [T_DROP, T_VERD] + [x for x in T_SEC]:
    add(crash(), t, .55)
# final hit + hard stop
fin = kick() * 1.0; add(fin, T_END - 0.02, 1.0); add(crash(), T_END - 0.02, .6)
i0 = int(T_END * SR); fade = np.ones(N); fade[i0:] = np.exp(-np.arange(N - i0) / SR * 2.2)  # boom/crash tail rings out over the end card
st = np.stack([outL * fade, outR * fade], 1)
st = st / np.abs(st).max() * 0.89
sf.write(os.path.join(HERE, 'music.wav'), st.astype(np.float32), SR)
open(os.path.join(HERE, '..', 'page', 'beats.js'), 'w').write('window.BEATS=' + json.dumps(beats) + ';')
json.dump({'bpm': BPM, 'drop': T_DROP, 'breakdown': [T_BREAK, T_VERD], 'end': T_END, 'bars': bi}, open(os.path.join(HERE, 'music_meta.json'), 'w'))
print(f'music: {DUR:.2f}s, drop@{T_DROP:.2f}, breakdown {T_BREAK:.2f}-{T_VERD:.2f}, {len(beats)} kicks')
