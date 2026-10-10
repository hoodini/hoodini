"""Procedural 140 BPM F-minor trap/phonk instrumental (numpy/scipy), 48 kHz stereo.
Structure comes from the page: intro tension -> DROP (logo slam) -> full beat -> BREAKDOWN (pad only, before the verdict)
-> RE-DROP ("Go build.") -> HARD STOP at END."""
import json, numpy as np
from scipy import signal
import sfx
SR = 48000; BPM = 140; BEAT = 60 / BPM; BAR = 4 * BEAT; STEP = BEAT / 4
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def _lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "low", fs=SR, output="sos"), x)
def _hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "high", fs=SR, output="sos"), x)
def _bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def kick():
    n = int(.42 * SR); t = np.arange(n) / SR; f = 46 + 130 * np.exp(-t * 32); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    x += .5 * _bp(np.random.default_rng(1).standard_normal(n), 1500, 6000) * np.exp(-t * 90); return np.tanh(x * 1.8) * .95
def s808(m, dur=.62):
    n = int(dur * SR); t = np.arange(n) / SR; f0 = hz(m); f = f0 * (1 + 1.2 * np.exp(-t * 45)); x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    e = np.exp(-t * 3.2) * np.minimum(1, t / .004); x = np.tanh(x * e * 3.4) * .85; return _lp(x + .18 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * e, 1800)
def clap():
    n = int(.32 * SR); r = np.random.default_rng(2).standard_normal(n); t = np.arange(n) / SR; e = np.zeros(n)
    for o in (0, .011, .022): e[int(o * SR):] += np.exp(-np.arange(n - int(o * SR)) / SR * 90) * .6
    e += np.exp(-t * 16) * .55; return _bp(r, 900, 6500) * e * .9
def hat(op=False):
    n = int((.18 if op else .05) * SR); t = np.arange(n) / SR; return _hp(np.random.default_rng(3 + op).standard_normal(n), 7500) * np.exp(-t * (18 if op else 75)) * .5
def cowbell():
    n = int(.3 * SR); t = np.arange(n) / SR; x = signal.square(2 * np.pi * 587 * t) + signal.square(2 * np.pi * 845 * t); return _bp(x, 500, 3200) * np.exp(-t * 14) * .3
def stab(notes, dur=.22):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in notes:
        for det in (-.12, .12): x += signal.sawtooth(2 * np.pi * hz(m + det) * t)
    x = _lp(x, 2600) * np.exp(-t * 11) * np.minimum(1, t / .004); return x * .11
def pad(notes, dur, level=.06):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in notes:
        for det in (-.18, 0, .18): x += signal.sawtooth(2 * np.pi * hz(m + det) * t + m)
    e = np.minimum(1, t / .9) * np.minimum(1, (dur - t) / .5); x = _lp(x, 1250) * e * (.85 + .15 * np.sin(2 * np.pi * .35 * t)); return x * level
CH = [([53, 56, 60], 29), ([49, 53, 56], 25), ([51, 55, 58], 27), ([48, 52, 55], 24)]   # Fm, Db, Eb, C  (808 roots: F1 Db1 Eb1 C1)
def build(cues_path="build/cues.json"):
    T = json.load(open(cues_path))["timing"]; END, D, BRK, RE = T["END"], T["DROP"], T["BREAK"], T["REDROP"]
    total = int((END + .05) * SR); L = np.zeros(total); R = np.zeros(total)
    g0 = D - 9 * BAR                                       # bar grid: DROP falls exactly on bar 9
    def put(x, t, gl=1.0, gr=None):
        i = int(round(t * SR)); 
        if i < 0 or i >= total: return
        m = min(len(x), total - i); L[i:i + m] += x[:m] * gl; R[i:i + m] += x[:m] * (gl if gr is None else gr)
    K, C, H, HO, CB = kick(), clap(), hat(), hat(True), cowbell()
    def drum_bar(t0, bar_idx, full=True, fill=False):
        ch = CH[bar_idx % 4]
        for s in ([0, 6, 10] if full else [0]): put(K, t0 + s * STEP, .9); put(s808(ch[1]), t0 + s * STEP, .8)
        if full and bar_idx % 2 == 1: put(s808(ch[1] + 12, .3), t0 + 14 * STEP, .35)
        if full: put(C, t0 + 8 * STEP, .75)
        for s in range(0, 16, 2): put(H, t0 + s * STEP, .35 if s % 4 else .5, .5 if s % 4 else .35)
        if full and bar_idx % 4 == 3:                        # hat roll into next bar
            for j in range(8): put(H, t0 + 12 * STEP + j * STEP / 2, .25 + .04 * j)
        if full:
            for s in (0, 3, 6, 8, 11): put(CB, t0 + s * STEP, .3, .2)
            for s in (3, 7, 11): put(stab(ch[0]), t0 + s * STEP, .8, .8)
        if fill:
            for j in range(8): put(C, t0 + 12 * STEP + j * STEP / 2, .22 + .05 * j)
    # ---- intro (bars 0-8): pad + sparse heartbeat, building
    for b in range(0, 9):
        t0 = g0 + b * BAR
        if t0 < 0: continue
        put(pad(CH[b % 4][0], BAR + .6, .05 + .004 * b), t0, .9)
        put(K, t0, .5 if b < 4 else .8); put(s808(CH[b % 4][1], .45), t0, .4 if b < 4 else .6)
        for s in range(0, 16, 2 if b < 4 else 1): put(H, t0 + s * STEP, .12 + .01 * b, .15)
        if b >= 4: put(C, t0 + 8 * STEP, .5)
    # snare roll into drop (accelerating) + 0.16 s dropout for impact
    for j in range(16): put(C, D - .95 + j * (.95 / 16) * (1 - .25 * j / 16), .12 + .035 * j)
    # ---- main drop: D -> BRK (loops), zero pad at drop for clarity
    b = 0; t0 = D
    while t0 < BRK - .05:
        drum_bar(t0, b, True, fill=(b % 8 == 7)); put(pad(CH[b % 4][0], BAR + .2, .035), t0); b += 1; t0 += BAR
    # ---- breakdown: pad + sub + reverse-ish cymbal swell, no drums
    dur = RE - BRK
    put(pad([53, 56, 60, 65], dur + .3, .09), BRK); put(pad([41], dur + .3, .12), BRK)
    put(sfx.riser(dur - .05), RE - dur + .05, .45, .45)
    put(K, BRK, .8); put(s808(29, 1.2), BRK, .8)
    # ---- re-drop (own grid) until END, hard stop
    b = 0; t0 = RE
    while t0 < END - .02:
        drum_bar(t0, b, True); put(pad(CH[b % 4][0], BAR + .2, .04), t0); b += 1; t0 += BAR
    put(sfx.crash(2.0), RE, .8)
    # hard stop: 12 ms fade-out at END
    n_end = int(END * SR); f = int(.012 * SR)
    L[n_end - f:n_end] *= np.linspace(1, 0, f); R[n_end - f:n_end] *= np.linspace(1, 0, f); L[n_end:] = 0; R[n_end:] = 0
    # short pre-drop dropout (silence) for impact
    i0, i1 = int((D - .16) * SR), int(D * SR); L[i0:i1] *= .05; R[i0:i1] *= .05
    m = np.stack([L, R], 1); return m / (np.abs(m).max() + 1e-9) * .9
if __name__ == "__main__":
    import soundfile as sf
    m = build(); sf.write("build/music.wav", m, SR); print("music", m.shape[0] / SR)
