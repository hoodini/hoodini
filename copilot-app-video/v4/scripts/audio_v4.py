# v4 score: warm, bright, human. Key C major, 100 BPM, I–V–vi–IV.
# Leitmotif: "Mary Had a Little Lamb" (public domain) — Mia practising (one wrong note) → played right at 6:02 PM.
import json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000
rng = np.random.default_rng(6)
TL = json.load(open('src/timeline.json')); CU = json.load(open('audio/cues.json'))
DUR = TL['total']; N = int((DUR + 1) * SR)
Wd = lambda k, w, n=1: [x for x in TL['words'][k] if ''.join(c for c in x['w'].lower() if c.isalnum()).startswith(w.lower())][n-1]
L = lambda k: TL['lines'][k]['start']; LE = lambda k: TL['lines'][k]['end']
beat = 60 / 100; bar = 4 * beat
DROP = Wd('reveal', 'github')['s']

t_ = lambda n: np.arange(n) / SR
def env(n, a=.004, d=.4): x = t_(n); return np.minimum(1, x / a) * np.exp(-x / d)
def lp(x, f): return sosfilt(butter(2, f, 'lp', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'hp', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'bp', fs=SR, output='sos'), x)
def add(buf, x, at, g=1.):
    i = int(at * SR)
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x)); buf[i:j] += g * x[:j - i]
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
db = lambda v: 10 ** (v / 20)

def piano(m, dur=1.2, vel=1.):
    f = NOTE(m); n = int(dur * SR); x = t_(n); o = 0
    for k, a in enumerate([1, .55, .3, .16, .08, .04]):
        fk = f * (k + 1) * (1 + .0004 * (k + 1) ** 2)
        o += a * np.sin(2 * np.pi * fk * x) * np.exp(-x * (1.1 + k * .9))
    o *= np.minimum(1, x / .003)
    o += lp(rng.standard_normal(n), 2500) * np.exp(-x / .01) * .05
    return o * vel * .32
def pad(ms, dur):
    n = int(dur * SR); x = t_(n); o = 0
    for m in ms:
        for d in (-.07, .07):
            ph = x * NOTE(m) * 2 ** (d / 12); o += (2 * np.abs(2 * (ph % 1) - 1) - 1)  # triangle
    a = np.minimum(1, x / .6) * np.minimum(1, (n - np.arange(n)) / (.5 * SR))
    return lp(o / (2 * len(ms)), 1800) * a * .22
def bass(m, dur=.5):
    n = int(dur * SR); x = t_(n); return np.tanh(1.5 * np.sin(2 * np.pi * NOTE(m) * x)) * env(n, .005, dur * .5) * .4
def kick(): n = int(.35 * SR); x = t_(n); f = 48 + 70 * np.exp(-x / .04); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .22) * .8
def clap(): n = int(.25 * SR); return bp(rng.standard_normal(n), 1000, 4500) * env(n, .002, .07) * .25
def shaker(): n = int(.07 * SR); return hp(rng.standard_normal(n), 6000) * env(n, .01, .02) * .12
def bell(m, dur=1.5):
    n = int(dur * SR); x = t_(n); f = NOTE(m)
    return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x * 3)) * env(n, .002, .5) * .18

music = np.zeros(N)
PROG = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]  # C G Am F
NIGHT = [(45, [57, 60, 64]), (41, [57, 60, 65])]                                          # Am F (night)

P0, P1 = L('promise') - .05, L('habit') - .05
H0, H1 = L('habit') - .05, L('scale') - .05
PAY0, PAYM = L('payoff') - .05, Wd('payoff', 'merged')['s']
END_CHORD = LE('cta') + .3

# 1) night: soft minor pads + a lonely low piano note per bar
t = 0.
while t < P0:
    r, ch = NIGHT[int(t / bar) % 2]; add(music, pad(ch, bar + .6), t, .8); add(music, piano(r + 12, 2.5, .5), t, 1); t += bar
# 2) Mia practising — one wrong note (humour)
MARY = [(64,1),(62,1),(60,1),(62,1),(64,1),(64,1),(64,2),(62,1),(62,1),(62,2),(64,1),(67,1),(67,2)]
t = Wd('promise', 'her')['s']; step = .3
for i, (m, d) in enumerate(MARY):
    if t > P1: break
    add(music, piano(m + (1 if i == 6 else 0), .8, .8), t, 1)  # 7th note is F instead of E: the "♪?" moment
    t += d * step
add(music, pad([60, 64, 67], P1 - P0), P0, .5)
# 3) habit: playful staccato bass walk + light ticks (tension, comedic)
t = H0; walk = [36, 43, 40, 43, 36, 43, 41, 43]; k = 0
while t < H1:
    add(music, bass(walk[k % 8] + 12, .22), t, .9); add(music, shaker(), t + beat / 2, 1); t += beat / 2; k += 1
# 4) scale: swell + rising arpeggio into the drop
t = H1
while t < DROP:
    r, ch = PROG[int((t - H1) / bar) % 4]; add(music, pad(ch, bar + .6), t, .9)
    for e in range(8): add(music, piano(ch[e % 3] + 12 * (e // 3), .9, .45 + .06 * e), t + e * beat / 2, 1)
    t += bar
rn = int((DROP - (DROP - 2.2)) * SR); add(music, bp(rng.standard_normal(rn), 400, 6000) * np.linspace(0, 1, rn) ** 2 * .25, DROP - 2.2)
# 5) groove from the drop until the payoff
def groove(t0, t1, lvl=1.):
    t = t0; b = 0
    while t < t1:
        r, ch = PROG[b % 4]
        add(music, pad(ch, bar + .6), t, .8 * lvl)
        for q in range(4):
            tq = t + q * beat
            if tq >= t1: break
            if q in (0, 2): add(music, kick(), tq, .8 * lvl)
            if q in (1, 3): add(music, clap(), tq, .9 * lvl)
            add(music, bass(r, beat * .9), tq, .7 * lvl)
            add(music, piano(ch[q % 3] + 12, .5, .5), tq + beat / 2, lvl)
            add(music, shaker(), tq + beat / 2, lvl); add(music, shaker(), tq, .6 * lvl)
        if b % 2 == 1: add(music, bell(ch[2] + 24), t + 3 * beat, lvl)
        t += bar; b += 1
add(music, np.tanh(2 * np.sin(2 * np.pi * np.cumsum(60 + 40 * np.exp(-t_(int(1.2 * SR)) / .06)) / SR)) * env(int(1.2 * SR), .002, .5) * .9, DROP)
groove(DROP, L('money') - .05, 1.)
groove(L('money') - .05, L('listen') - .05, .6)   # honest part: quieter, drums lighter
groove(L('listen') - .05, PAY0, 1.)
# 6) 6:02 PM — solo piano, the leitmotif played right (the emotional peak)
MARY_FULL = MARY + [(64,1),(62,1),(60,1),(62,1),(64,1),(64,1),(64,1),(64,1),(62,1),(62,1),(64,1),(62,1),(60,4)]
t = PAY0 + .2; step = .26
for m, d in MARY_FULL:
    if t > L('cta') - .3: break
    add(music, piano(m + 12, 1.4, .9), t, 1); add(music, piano(m, 1.4, .3), t, 1); t += d * step
add(music, pad([60, 64, 67], L('cta') - PAY0 + .3), PAY0, .6)
# 7) CTA: band returns, resolve on C
groove(L('cta') - .05, END_CHORD, 1.)
for m in (48, 60, 64, 67, 72): add(music, piano(m, 4.5, .8), END_CHORD, 1)
add(music, pad([60, 64, 67, 72], 4), END_CHORD, 1); add(music, bell(84, 3), END_CHORD, 1.2)

# ---------- restrained SFX from page cues ----------
def sfx(c):
    ty = c['type']; d = c.get('d', .5)
    if ty == 'whoosh': n = int(.5 * SR); return lp(rng.standard_normal(n), 3000) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * .35, -18
    if ty == 'pop': n = int(.08 * SR); x = t_(n); return np.sin(2 * np.pi * (700 + 900 * x / x[-1]) * x) * env(n, .002, .03), -24
    if ty == 'ping': n = int(.35 * SR); x = t_(n); y = np.sin(2 * np.pi * 1318.5 * x) * env(n, .002, .08); y[int(.09*SR):] += (np.sin(2*np.pi*1760*x) * env(n, .002, .1))[:n-int(.09*SR)]; return y, -22
    if ty == 'paper': n = int(.2 * SR); return bp(rng.standard_normal(n), 1500, 7000) * env(n, .005, .05), -22
    if ty == 'error': n = int(.22 * SR); x = t_(n); return (np.sin(2*np.pi*220*x) + np.sin(2*np.pi*233*x)) * env(n, .005, .09) * .5, -22
    if ty == 'clunk': n = int(.3 * SR); return lp(rng.standard_normal(n), 400) * env(n, .002, .06), -20
    if ty == 'squeak': n = int(.28 * SR); x = t_(n); f = 1100 + 700 * x / x[-1] + 60 * np.sin(2 * np.pi * 28 * x); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .01, .12), -20
    if ty == 'ding': m = [76, 79, 84, 88, 91][c.get('n', 0) % 5]; return bell(m, 1.2) * 4, -14
    if ty in ('stamp', 'snap'): n = int(.3 * SR); return kick()[:n] * .8 + bp(rng.standard_normal(n), 800, 3000) * env(n, .001, .03) * .3, -14
    if ty == 'click': n = int(.04 * SR); return hp(rng.standard_normal(n), 3000) * env(n, .0005, .004), -18
    if ty == 'tick':
        n = int((d + .2) * SR); y = np.zeros(n)
        for k in range(int(d) + 1): i = int(k * SR); m = int(.02 * SR); y[i:i+m] += (hp(rng.standard_normal(m), 4000) * env(m, .0005, .004))[:len(y[i:i+m])]
        return y, -20
    if ty == 'keys':
        n = int((d + .1) * SR); y = np.zeros(n); tt = 0
        while tt < d: i = int(tt * SR); m = int(.015 * SR); y[i:i+m] += (bp(rng.standard_normal(m), 1500, 6000) * env(m, .0003, .004))[:len(y[i:i+m])]; tt += .05 + .05 * rng.random()
        return y, -22
    if ty == 'riser': n = int(max(d, .3) * SR); x = np.linspace(0, 1, n); return bp(rng.standard_normal(n), 300, 6000) * x ** 2 * .5, -20
    if ty in ('hit', 'hit_soft'): return np.zeros(10), 0
    if ty == 'applause':
        n = int((d + .6) * SR); y = np.zeros(n)
        for k in range(int(d * 40)): i = int(rng.random() * d * SR); m = int(.03 * SR); y[i:i+m] += (bp(rng.standard_normal(m), 800, 5000) * env(m, .001, .012))[:len(y[i:i+m])] * (.4 + .6 * rng.random())
        return y * np.minimum(1, np.linspace(1.4, 0, n)), -16
    return None, 0
fx = np.zeros(N)
for c in CU['CUES']:
    x, g = sfx(c)
    if x is not None: add(fx, x, c['t'], db(g))

# ---------- VO + ducking ----------
vo = np.zeros(N)
for k, Lr in TL['lines'].items():
    x, sr = sf.read(f'audio/vo_{k}.wav')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr)
    add(vo, hp(x, 70), Lr['start'])
vo /= np.abs(vo).max() + 1e-9
win = int(.03 * SR); e = np.sqrt(np.convolve(vo ** 2, np.ones(win) / win, 'same')); e = np.minimum(1, e / (np.percentile(e[e > 1e-4], 85) + 1e-9))
g = np.zeros_like(e); prev = 0; a_, r_ = np.exp(-64 / (.02 * SR)), np.exp(-64 / (.35 * SR))
for i in range(0, len(e), 64): v = e[i:i+64].max(); c = a_ if v > prev else r_; prev = c * prev + (1 - c) * v; g[i:i+64] = prev
music /= np.abs(music).max() + 1e-9
mix = vo + music * (1 - .55 * g) * db(-12) + fx * db(-3)
n_end = int(DUR * SR); fade = np.ones(N); fs0 = int((DUR - 1.5) * SR); fade[fs0:n_end] = np.linspace(1, 0, n_end - fs0); fade[n_end:] = 0
mix = (mix * fade)[:n_end]; mix = mix / (np.abs(mix).max() + 1e-9) * .89
sf.write('audio/mix_premaster.wav', np.stack([mix, mix], 1), SR, subtype='PCM_24')
print('ok', DUR, 'drop', DROP)
