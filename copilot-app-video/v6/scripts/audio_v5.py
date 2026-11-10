# v5 score: real sampled instruments (FluidR3 GM soundfont via FluidSynth), arranged in code with mido.
# Key C major, 100 BPM, I–V–vi–IV. Leitmotif: "Mary Had a Little Lamb" (public domain):
# Mia practising with one wrong note -> played right, solo piano, at 6:02 PM.
import json, subprocess, numpy as np, soundfile as sf, mido
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000; rng = np.random.default_rng(6)
TL = json.load(open('src/timeline.json')); CU = json.load(open('audio/cues.json'))
DUR = TL['total']; N = int((DUR + 1) * SR)
Wd = lambda k, w, n=1: [x for x in TL['words'][k] if ''.join(c for c in x['w'].lower() if c.isalnum()).startswith(w.lower())][n-1]
L = lambda k: TL['lines'][k]['start']; LE = lambda k: TL['lines'][k]['end']
beat = 60 / 100; bar = 4 * beat
DROP = Wd('reveal', 'github')['s']

# ---------------- MIDI arrangement (absolute seconds) ----------------
EV = []   # (t, order, msg)
def note(ch, m, t, d, v):
    EV.append((t, 1, mido.Message('note_on', channel=ch, note=int(m), velocity=int(max(1, min(127, v))))))
    EV.append((t + d, 0, mido.Message('note_off', channel=ch, note=int(m), velocity=0)))
def cc(ch, c, val, t): EV.append((t, 0, mido.Message('control_change', channel=ch, control=c, value=int(val))))
def ramp(ch, c, v0, v1, t0, t1, steps=24):
    for i in range(steps + 1): cc(ch, c, v0 + (v1 - v0) * i / steps, t0 + (t1 - t0) * i / steps)
PIANO, STR, BASS, PIZZ, CELE, PAD, HARP, DR = 0, 1, 2, 3, 4, 5, 6, 9
PROGS = {PIANO: 0, STR: 48, BASS: 33, PIZZ: 45, CELE: 8, PAD: 89, HARP: 46}
for ch, p in PROGS.items():
    EV.append((0, -1, mido.Message('program_change', channel=ch, program=p)))
    cc(ch, 91, 70 if ch in (PIANO, STR, CELE, HARP) else 35, 0); cc(ch, 7, 100, 0)
cc(STR, 11, 90, 0); cc(PAD, 11, 80, 0)

C, G, Am, F = (48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])
PROG = [C, G, Am, F]
MARY = [(64,1),(62,1),(60,1),(62,1),(64,1),(64,1),(64,2),(62,1),(62,1),(62,2),(64,1),(67,1),(67,2)]
MARY_FULL = MARY + [(64,1),(62,1),(60,1),(62,1),(64,1),(64,1),(64,1),(64,1),(62,1),(62,1),(64,1),(62,1),(60,4)]

P0, P1 = L('promise') - .05, L('habit') - .05
H0, H1 = L('habit') - .05, L('scale') - .05
PAY0 = L('payoff') - .05; CTA0 = L('cta') - .05; END = LE('cta') + .3

# 1) night: low strings + lonely piano (Am – F)
t = 0.; k = 0
while t < P0 - .1:
    r, ch = [Am, F][k % 2]; d = min(bar, P0 - t)
    for m in ch: note(STR, m - 12, t, d + .3, 84)
    note(STR, r, t, d + .3, 90); note(PIANO, r + 24, t + .02, 2.2, 74); note(PIANO, ch[2] + 12, t + beat * 2, 1.6, 60)
    t += bar; k += 1
# 2) Mia practising: soft upright feel, one wrong note (7th note F instead of E)
t = Wd('promise', 'her')['s']; step = .3
for i, (m, d) in enumerate(MARY):
    if t > P1 - .1: break
    note(PIANO, m + (1 if i == 6 else 0), t, d * step * .95, 80 + rng.integers(-6, 6)); t += d * step
for m in [60, 64, 67]: note(STR, m - 12, P0, P1 - P0, 64)
# 3) habit: comedic pizzicato walk + woodblock ticks (the "does everything herself" hustle)
t = H0; walk = [48, 55, 52, 55, 48, 55, 53, 55]; k = 0
while t < H1 - .05:
    note(PIZZ, walk[k % 8], t, .2, 88 if k % 2 == 0 else 70); note(PIZZ, walk[k % 8] + 12, t + beat / 4, .15, 50) if k % 4 == 3 else None
    note(DR, 76 if k % 2 else 77, t + beat / 2, .05, 55); t += beat / 2; k += 1
# 4) scale: strings swell + harp arpeggios, rising into the drop
t = H1; b = 0
ramp(STR, 11, 50, 127, H1, DROP - .1)
while t < DROP - .1:
    r, ch = PROG[b % 4]
    note(STR, r, t, bar + .1, 80); [note(STR, m, t, bar + .1, 76) for m in ch]; [note(STR, m + 12, t, bar + .1, 60) for m in ch]
    for e in range(8):
        te = t + e * beat / 2
        if te < DROP - .1: note(HARP, ch[e % 3] + 12 * (e // 3), te, .8, 60 + 6 * e)
    t += bar; b += 1
note(DR, 49, DROP, 2.5, 110); note(DR, 36, DROP, .3, 120); note(DR, 57, DROP - 1.2, .1, 0)  # crash on the drop
# timpani-ish roll before drop (tom roll)
for i in range(12): note(DR, 45 if i % 2 else 47, DROP - 1.2 + i * .1, .08, 40 + i * 6)
# 5) groove from the drop until the payoff
def groove(t0, t1, lvl=1.):
    t = t0; b = 0
    while t < t1 - .05:
        r, ch = PROG[b % 4]
        for m in ch: note(PAD, m, t, bar, 58 * lvl)
        for m in ch: note(STR, m + 12, t, bar, 46 * lvl)
        for q in range(4):
            tq = t + q * beat
            if tq >= t1 - .05: break
            if q in (0, 2): note(DR, 36, tq, .1, 100 * lvl)
            if q in (1, 3): note(DR, 39, tq, .1, 78 * lvl); note(DR, 38, tq, .1, 55 * lvl)
            note(DR, 42, tq, .05, 58 * lvl); note(DR, 42, tq + beat / 2, .05, 42 * lvl)
            note(BASS, r, tq, beat * .85, 96 * lvl); note(BASS, r + 12, tq + beat / 2, beat * .35, 70 * lvl) if q == 3 else None
            note(PIANO, ch[q % 3] + 12, tq + beat / 2, beat * .45, 64 * lvl)
        if b % 2 == 1: note(CELE, ch[2] + 24, t + 3 * beat, 1., 80 * lvl); note(CELE, ch[1] + 24, t + 3.5 * beat, 1., 70 * lvl)
        t += bar; b += 1
groove(DROP, L('merge') - .05, .9)
groove(L('merge') - .05, L('sandbox') - .05, 1.)
groove(L('sandbox') - .05, L('ships') - .05, .7)
groove(L('ships') - .05, PAY0 - .6, 1.)
note(DR, 49, PAY0 - .6, 1.5, 70)
# 6) 6:02 PM: solo piano plays the leitmotif right; strings bloom underneath
t = PAY0 + .2; step = .26
for m, d in MARY_FULL:
    if t > CTA0 - .3: break
    note(PIANO, m + 12, t, d * step * 1.6, 78); note(PIANO, m, t, d * step * 1.6, 44); t += d * step
for m in [48, 60, 64, 67]: note(STR, m, PAY0 + .2, CTA0 - PAY0, 50)
ramp(STR, 11, 60, 110, PAY0, CTA0)
# 7) CTA: band returns, resolve on C
groove(CTA0, END, 1.)
for m in (36, 48, 60, 64, 67, 72): note(PIANO, m, END, 4.5, 90)
for m in (48, 60, 64, 67, 72): note(STR, m, END, 4., 80)
note(CELE, 84, END, 3, 90); note(DR, 49, END, 3, 90); note(DR, 36, END, .3, 110)

mid = mido.MidiFile(ticks_per_beat=480); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage('set_tempo', tempo=1_000_000))   # 60 BPM -> 1 beat = 1 s -> tick = 1/480 s
last = 0
for t, _, msg in sorted(EV, key=lambda e: (e[0], e[1])):
    tk = int(round(max(0, t) * 480)); msg.time = tk - last; last = tk; tr.append(msg)
mid.save('audio/score.mid')
subprocess.run(['fluidsynth', '-ni', '-g', '0.6', '-r', str(SR), '-F', 'audio/score.wav',
                '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'audio/score.mid'], check=True, capture_output=True)
music, sr = sf.read('audio/score.wav'); assert sr == SR
music = music[:N] if len(music) >= N else np.pad(music, ((0, N - len(music)), (0, 0)))

# ---------------- restrained SFX from page cues ----------------
t_ = lambda n: np.arange(n) / SR
def env(n, a=.004, d=.4): x = t_(n); return np.minimum(1, x / a) * np.exp(-x / d)
def lp(x, f): return sosfilt(butter(2, f, 'lp', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'hp', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'bp', fs=SR, output='sos'), x)
def add(buf, x, at, g=1.):
    i = int(at * SR)
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x)); buf[i:j] += g * x[:j - i]
db = lambda v: 10 ** (v / 20); NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
def bell(m, dur=1.5):
    n = int(dur * SR); x = t_(n); f = NOTE(m)
    return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x * 3)) * env(n, .002, .5) * .18
def kick(): n = int(.35 * SR); x = t_(n); f = 48 + 70 * np.exp(-x / .04); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .22) * .8
def sfx(c):
    ty = c['type']; d = c.get('d', .5)
    if ty == 'whoosh': n = int(.5 * SR); return lp(rng.standard_normal(n), 3000) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * .35, -20
    if ty == 'pop': n = int(.08 * SR); x = t_(n); return np.sin(2 * np.pi * (700 + 900 * x / x[-1]) * x) * env(n, .002, .03), -26
    if ty == 'ping': n = int(.35 * SR); x = t_(n); y = np.sin(2 * np.pi * 1318.5 * x) * env(n, .002, .08); y[int(.09*SR):] += (np.sin(2*np.pi*1760*x) * env(n, .002, .1))[:n-int(.09*SR)]; return y, -24
    if ty == 'paper': n = int(.2 * SR); return bp(rng.standard_normal(n), 1500, 7000) * env(n, .005, .05), -24
    if ty == 'error': n = int(.22 * SR); x = t_(n); return (np.sin(2*np.pi*220*x) + np.sin(2*np.pi*233*x)) * env(n, .005, .09) * .5, -24
    if ty == 'clunk': n = int(.3 * SR); return lp(rng.standard_normal(n), 400) * env(n, .002, .06), -22
    if ty == 'squeak': n = int(.28 * SR); x = t_(n); f = 1100 + 700 * x / x[-1] + 60 * np.sin(2 * np.pi * 28 * x); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .01, .12), -22
    if ty == 'ding': m = [76, 79, 84, 88, 91][c.get('n', 0) % 5]; return bell(m, 1.2) * 4, -16
    if ty in ('stamp', 'snap'): n = int(.3 * SR); return kick()[:n] * .8 + bp(rng.standard_normal(n), 800, 3000) * env(n, .001, .03) * .3, -16
    if ty == 'click': n = int(.04 * SR); return hp(rng.standard_normal(n), 3000) * env(n, .0005, .004), -20
    if ty == 'tick':
        n = int((d + .2) * SR); y = np.zeros(n)
        for k in range(int(d) + 1): i = int(k * SR); m = int(.02 * SR); y[i:i+m] += (hp(rng.standard_normal(m), 4000) * env(m, .0005, .004))[:len(y[i:i+m])]
        return y, -22
    if ty == 'keys':
        n = int((d + .1) * SR); y = np.zeros(n); tt = 0
        while tt < d: i = int(tt * SR); m = int(.015 * SR); y[i:i+m] += (bp(rng.standard_normal(m), 1500, 6000) * env(m, .0003, .004))[:len(y[i:i+m])]; tt += .05 + .05 * rng.random()
        return y, -24
    if ty == 'riser': n = int(max(d, .3) * SR); x = np.linspace(0, 1, n); return bp(rng.standard_normal(n), 300, 6000) * x ** 2 * .5, -22
    if ty == 'scribble':   # felt pen on paper: band-limited friction noise in quick strokes
        n = int(max(d, .25) * SR); x = t_(n); y = bp(rng.standard_normal(n), 1800, 7000)
        rate = 9 + 5 * rng.random(); am = (.5 + .5 * np.sign(np.sin(2 * np.pi * rate * x + rng.random() * 6))) * (.6 + .4 * rng.random(n))
        am = lp(am, 40); fade = np.minimum(1, x / .03) * np.minimum(1, (x[-1] - x) / .06)
        return y * am * fade * .5, -27
    if ty == 'sigh': n = int(.7 * SR); x = np.linspace(0, 1, n); return bp(rng.standard_normal(n), 300, 1800) * np.sin(np.pi * x) ** 2 * (1 - .5 * x) * .5, -24
    if ty == 'applause':
        n = int((d + .6) * SR); y = np.zeros(n)
        for k in range(int(d * 40)): i = int(rng.random() * d * SR); m = int(.03 * SR); y[i:i+m] += (bp(rng.standard_normal(m), 800, 5000) * env(m, .001, .012))[:len(y[i:i+m])] * (.4 + .6 * rng.random())
        return y * np.minimum(1, np.linspace(1.4, 0, n)), -18
    return None, 0
fx = np.zeros(N)
for c in CU['CUES']:
    x, g = sfx(c)
    if x is not None: add(fx, x, c['t'], db(g))

# ---------------- VO + sidechain ducking ----------------
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
duck = (1 - .6 * g)[:, None]
mix = vo[:, None] + music * duck * db(-11) + fx[:, None] * db(-3)
n_end = int(DUR * SR); fade = np.ones(N); fs0 = int((DUR - 1.5) * SR); fade[fs0:n_end] = np.linspace(1, 0, n_end - fs0); fade[n_end:] = 0
mix = (mix * fade[:, None])[:n_end]; mix = mix / (np.abs(mix).max() + 1e-9) * .89
sf.write('audio/mix_premaster.wav', mix, SR, subtype='PCM_24')
print('ok', DUR, 'drop', DROP)
