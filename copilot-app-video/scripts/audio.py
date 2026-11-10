# Procedural 140 BPM trap/electronic bed + page-cued SFX + Kokoro VO, ducked and mixed.
# Everything is driven by audio/cues.json (emitted by the page) and src/timeline.json.
import json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000
rng = np.random.default_rng(140)
meta = json.load(open('audio/cues.json'))
TL = json.load(open('src/timeline.json'))
M = meta['META']; DUR = meta['DURATION']
N = int(DUR * SR) + SR
beat = M['beat']; DROP = M['DROP']; B0, B1 = M['BREAK0'], M['BREAK1']
END_HIT = TL['lines']['cta']['end'] + 0.2

def t(n): return np.arange(n) / SR
def env(n, a=0.002, d=0.2):
    x = t(n); e = np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d); return e
def hp(x, f): return sosfilt(butter(2, f, 'hp', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'lp', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'bp', fs=SR, output='sos'), x)
def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x)); buf[i:j] += g * x[:j - i]
def noise(n): return rng.standard_normal(n)
def db(v): return 10 ** (v / 20)

# ---------- instruments
def kick():
    n = int(.45 * SR); x = t(n); f = 45 + 110 * np.exp(-x / .045)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(1.6 * np.sin(ph) * env(n, .001, .28)) + 0.3 * hp(noise(n), 3000) * env(n, .0005, .008)
def snare():
    n = int(.3 * SR); return .7 * bp(noise(n), 1200, 7000) * env(n, .001, .11) + .5 * np.sin(2 * np.pi * 190 * t(n)) * env(n, .001, .06)
def clap():
    n = int(.35 * SR); e = sum(env(n, .001, .012) * (t(n) >= k * .011) for k in range(3)) + env(n, .001, .12)
    return bp(noise(n), 900, 5000) * np.roll(e, 0) * .6
def hat(open_=False):
    n = int((.25 if open_ else .05) * SR); return hp(noise(n), 7000) * env(n, .0005, .08 if open_ else .015) * .35
def s808(freq, dur, glide_from=None):
    n = int(dur * SR); x = t(n)
    f = np.full(n, freq) if glide_from is None else freq + (glide_from - freq) * np.exp(-x / .06)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(2.2 * np.sin(ph)) * env(n, .003, dur * .6) * .55
def saw(freq, n, det=(0, .12, -.12)):
    x = t(n); o = 0
    for d in det:
        ff = freq * 2 ** (d / 12); o = o + 2 * ((x * ff + rng.random()) % 1) - 1
    return o / len(det)
def pad(freqs, dur, cutoff=1800):
    n = int(dur * SR); s = sum(saw(f, n) for f in freqs) / len(freqs)
    a = np.minimum(1, t(n) / .08) * np.minimum(1, (n - np.arange(n)) / (.12 * SR))
    return lp(s, cutoff) * a * .32
def pluck(freq, dur=.22):
    n = int(dur * SR); return lp(saw(freq, n, (0, .07)), 3200) * env(n, .002, .09) * .35

NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
# F minor-ish progression: Fm  Db  Ab  Eb  (root midi, chord tones)
PROG = [(41, [65, 68, 72]), (37, [61, 65, 68]), (44, [68, 72, 75]), (39, [63, 67, 70])]

music = np.zeros(N)
bar = 4 * beat; step = beat / 4
first_bar = int(np.floor((0 - DROP) / bar)) - 1
KICK, SN, CL = kick(), snare(), clap()
k = first_bar
while DROP + k * bar < DUR:
    b0 = DROP + k * bar; root, tones = PROG[k % 4]
    if b0 + bar < 0: k += 1; continue
    intro = b0 < DROP - 1e-6
    brk = (b0 + bar > B0) and (b0 < B1)
    outro = b0 >= END_HIT
    if outro:
        if b0 < END_HIT + bar:  # final sustained chord
            add(music, pad([NOTE(m) for m in tones] + [NOTE(root + 12)], 3.2, 1400), END_HIT, .9)
        k += 1; continue
    # pads always (filtered darker in intro / breakdown)
    add(music, pad([NOTE(m) for m in tones], bar, 900 if (intro or brk) else 2200), b0, .8 if intro else 1.0)
    for s in range(16):
        ts = b0 + s * step
        if ts < 0 or ts >= DUR: continue
        if brk and B0 <= ts < B1: continue
        if intro:
            if s % 4 == 2: add(music, hat(), ts, .6)
            if s % 8 == 0: add(music, pluck(NOTE(tones[(s // 8) % 3] + 12)), ts, .5)
            continue
        if ts >= END_HIT: continue
        if s in (0, 7, 10) or (k % 2 == 1 and s == 14): add(music, KICK, ts, .9)
        if s == 8: add(music, SN, ts, .8); add(music, CL, ts, .5)
        if s % 2 == 0: add(music, hat(), ts, .8 if s % 4 == 0 else .55)
        if k % 4 == 3 and s >= 12:  # trap hat roll
            for r in range(3): add(music, hat(), ts + r * step / 3, .4)
        if s == 14 and k % 2 == 0: add(music, hat(True), ts, .5)
        if s in (0, 7, 10): add(music, s808(NOTE(root - 12 + (12 if s == 10 and k % 2 else 0)), step * (6 if s == 0 else 3), NOTE(root) if s == 7 else None), ts, .9)
        if s % 2 == 0: add(music, pluck(NOTE(tones[(s // 2) % 3] + 12)), ts, .35)
    k += 1

# ---------- SFX
def sweep(n, f0, f1): x = t(n); f = f0 + (f1 - f0) * x / x[-1]; return np.sin(2 * np.pi * np.cumsum(f) / SR)
def sfx(c):
    ty = c['type']; d = c.get('d', .5)
    if ty == 'cut': n = int(.03 * SR); return hp(noise(n), 5000) * env(n, .0005, .006), -26
    if ty == 'whoosh':
        n = int(.45 * SR); e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
        return bp(noise(n), 400, 5000) * e * .6, -14
    if ty == 'slam':
        n = int(.5 * SR); return np.tanh(3 * sweep(n, 120, 38) * env(n, .001, .16)) * .8 + bp(noise(n), 200, 3000) * env(n, .001, .05) * .5, -10
    if ty in ('pop', 'pop2'):
        n = int(.09 * SR); return sweep(n, 500, 1400 if ty == 'pop' else 900) * env(n, .001, .03), -15
    if ty in ('buzz', 'buzz_s'):
        dd = .32 if ty == 'buzz' else .14; n = int(dd * SR); x = t(n)
        return lp(np.sign(np.sin(2 * np.pi * 98 * x)) + .6 * np.sign(np.sin(2 * np.pi * 104 * x)), 2400) * env(n, .002, dd * .7) * .5, -14
    if ty == 'ding':
        f = 1046.5 * 2 ** ([0, 4, 7, 12, 16][c.get('n', 0) % 5] / 12); n = int(.9 * SR); x = t(n)
        return (np.sin(2 * np.pi * f * x) + .35 * np.sin(2 * np.pi * 2.01 * f * x) + .15 * np.sin(2 * np.pi * 3.2 * f * x)) * env(n, .001, .22) * .6, -12
    if ty == 'stamp':
        n = int(.6 * SR); return np.tanh(4 * sweep(n, 90, 30) * env(n, .001, .2)) + .6 * lp(noise(n), 1500) * env(n, .001, .04), -8
    if ty in ('click', 'snap'):
        n = int(.05 * SR); x = hp(noise(n), 2000) * env(n, .0003, .004)
        if ty == 'snap': n2 = int(.3 * SR); y = np.zeros(n2); y[:n] += x; y += np.sin(2 * np.pi * 70 * t(n2)) * env(n2, .001, .07); return y, -10
        return x, -12
    if ty == 'keys':
        n = int((d + .1) * SR); y = np.zeros(n); tt = 0
        while tt < d:
            m = int(.018 * SR); tick = bp(noise(m), 1500, 6000) * env(m, .0003, .004)
            i = int(tt * SR); y[i:i + m] += tick[:len(y[i:i + m])] * (.6 + .4 * rng.random()); tt += .045 + .05 * rng.random()
        return y, -18
    if ty in ('riser', 'riser_s'):
        n = int(max(d, .3) * SR); x = np.linspace(0, 1, n)
        y = bp(noise(n), 300, 8000) * x ** 2 * .6 + sweep(n, 200, 1600) * x ** 3 * .25
        return y, (-12 if ty == 'riser' else -18)
    if ty == 'boom':
        n = int(1.6 * SR); return np.tanh(2 * sweep(n, 70, 28) * env(n, .001, .6)) + .5 * lp(noise(n), 900) * env(n, .001, .25), -5
    if ty == 'toast':
        n = int(.12 * SR); a = np.sin(2 * np.pi * 880 * t(n)) * env(n, .002, .05)
        b = np.sin(2 * np.pi * 1318.5 * t(n)) * env(n, .002, .07); y = np.zeros(int(.3 * SR)); y[:n] += a; y[int(.1 * SR):int(.1 * SR) + n] += b; return y, -16
    if ty == 'scribble':
        n = int(.35 * SR); return bp(noise(n), 2500, 6000) * (0.5 + 0.5 * np.sin(2 * np.pi * 22 * t(n))) * .4 * np.hanning(n), -22
    return None, 0
fxbus = np.zeros(N)
for c in meta['CUES']:
    x, g = sfx(c)
    if x is not None: add(fxbus, x, c['t'], db(g))

# ---------- VO
vo = np.zeros(N)
for key, L in TL['lines'].items():
    x, sr = sf.read(f'audio/vo_{key}.wav')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr)
    add(vo, hp(x, 80), L['start'])
vo /= np.abs(vo).max() + 1e-9

# ---------- ducking (sidechain from VO envelope)
win = int(.02 * SR); e = np.sqrt(np.convolve(vo ** 2, np.ones(win) / win, 'same'))
e = np.minimum(1, e / (np.percentile(e[e > 1e-4], 90) + 1e-9))
# attack/release smoothing
g = np.zeros_like(e); a_, r_ = np.exp(-1 / (.01 * SR)), np.exp(-1 / (.25 * SR)); prev = 0
for i in range(0, len(e), 64):
    v = e[i:i + 64].max(); c = a_ ** 64 if v > prev else r_ ** 64; prev = c * prev + (1 - c) * v; g[i:i + 64] = prev
duck = 1 - .6 * g
music = music / (np.abs(music).max() + 1e-9)
mix = vo * db(0) + music * duck * db(-13) + fxbus * db(-2)
fade = np.ones(N); fe = int((DUR - .02) * SR); fs = int((DUR - 1.2) * SR); fade[fs:fe] = np.linspace(1, 0, fe - fs); fade[fe:] = 0
mix = (mix * fade)[:int(DUR * SR)]
mix = mix / (np.abs(mix).max() + 1e-9) * .89
sf.write('audio/mix_premaster.wav', np.stack([mix, mix], 1), SR, subtype='PCM_24')
sf.write('audio/music_only.wav', (music * duck * db(-13))[:int(DUR * SR)], SR, subtype='PCM_16')
print('ok', DUR, 'drop', DROP)
