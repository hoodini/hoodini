"""numpy-only beat analysis: tempo (autocorr), kick-calibrated grid, energy per bar, drop.
usage: python -I beats.py file.mp3 [--json out.json] [--quiet]"""
import sys, subprocess, json
import numpy as np
SR = 22050; HOP = 128
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)
def stft_mag(y, n=1024):
    win = np.hanning(n); nf = 1 + (len(y) - n) // HOP
    idx = np.arange(n)[None, :] + HOP * np.arange(nf)[:, None]
    return np.abs(np.fft.rfft(y[idx] * win, axis=1))
def analyze(f, quiet=False):
    y = load(f); dur = len(y) / SR
    S = stft_mag(y); freqs = np.fft.rfftfreq(1024, 1 / SR); fr = SR / HOP
    L = np.log1p(100 * S)
    flux = np.maximum(0, np.diff(L, axis=0)).sum(1); flux = np.concatenate([[0], flux])
    kb = (freqs >= 35) & (freqs <= 130)
    kick = np.maximum(0, np.diff(np.log1p(100 * S[:, kb].sum(1)))); kick = np.concatenate([[0], kick])
    def norm(e):
        k = int(fr * 0.5); pad = np.pad(e, k, mode='edge'); c = np.cumsum(pad); m = (c[2 * k:] - c[:-2 * k]) / (2 * k)
        e = np.maximum(0, e - m[:len(e)]); return e / (e.std() + 1e-9)
    on = norm(flux); kn = norm(kick)
    # tempo by autocorrelation over 80..180 BPM, weighted toward 120 (log-gaussian)
    env = on + kn; env = env - env.mean()
    ac = np.correlate(env, env, mode='full')[len(env) - 1:]
    lags = np.arange(len(ac)); bpm = 60 * fr / np.maximum(lags, 1)
    sel = (bpm >= 80) & (bpm <= 180)
    w = np.exp(-0.5 * (np.log2(bpm / 120) / 0.6) ** 2)
    score = np.where(sel, ac * w, -np.inf); lag0 = int(np.argmax(score))
    # parabolic refine
    a, b, c = ac[lag0 - 1], ac[lag0], ac[lag0 + 1]; lagf = lag0 + 0.5 * (a - c) / (a - 2 * b + c + 1e-12)
    B = lagf / fr
    # phase: maximize kick at grid
    n = int(dur / B)
    best = None
    for ph in np.linspace(0, B, 200, endpoint=False):
        tt = ph + B * np.arange(n); ii = (tt * fr).astype(int); ii = ii[ii < len(kn)]
        s = kn[ii].sum()
        if best is None or s > best[0]: best = (s, ph)
    ph = best[1]
    # calibrate: find actual kick peak near each grid beat (+-45ms), keep strong ones, linear fit
    hits = []
    for k in range(n):
        t = ph + k * B; i0 = int((t - 0.045) * fr); i1 = int((t + 0.045) * fr)
        if i0 < 0 or i1 >= len(kn): continue
        seg = kn[i0:i1]; j = int(np.argmax(seg))
        if seg[j] > 2.0:
            # sub-frame parabolic
            jj = i0 + j
            if 0 < jj < len(kn) - 1:
                a, b, c = kn[jj - 1], kn[jj], kn[jj + 1]; off = 0.5 * (a - c) / (a - 2 * b + c + 1e-12)
            else: off = 0
            hits.append((k, (jj + off) / fr))
    hits = np.array(hits)
    if len(hits) > 8:
        A = np.vstack([np.ones(len(hits)), hits[:, 0]]).T
        coef, *_ = np.linalg.lstsq(A, hits[:, 1], rcond=None)
        res = hits[:, 1] - A @ coef
        keep = np.abs(res) < 0.02
        coef, *_ = np.linalg.lstsq(A[keep], hits[keep, 1], rcond=None)
        res = hits[keep, 1] - A[keep] @ coef
        t0, B2 = coef; t0 = t0 % B2
        jitter = float(np.sqrt(np.mean(res ** 2)) * 1000); nhits = int(keep.sum())
    else:
        t0, B2, jitter, nhits = ph, B, -1, len(hits)
    # energy per bar (4 beats), RMS + low-band RMS
    rms = np.sqrt(np.convolve(y ** 2, np.ones(HOP) / HOP, mode='same')[::HOP])
    low = S[:, (freqs >= 30) & (freqs <= 150)].sum(1)
    bars = []
    nb = int((dur - t0) / (4 * B2))
    for j in range(nb):
        a = t0 + j * 4 * B2; b = a + 4 * B2
        ia, ib = int(a * fr), int(b * fr)
        bars.append((j, round(a, 3), float(20 * np.log10(rms[ia:ib].mean() + 1e-9)), float(20 * np.log10(low[ia:ib].mean() + 1e-9))))
    # drop = biggest jump in (rms+low) vs mean of previous 2 bars, after bar 2
    E = np.array([b_[2] + 0.5 * b_[3] for b_ in bars])
    jumps = [(E[j] - E[max(0, j - 2):j].mean(), j) for j in range(2, len(E) - 1)]
    jumps.sort(reverse=True)
    out = dict(file=f, dur=round(dur, 3), bpm=round(60 / B2, 3), beat=round(B2, 6), first_beat=round(float(t0), 4), jitter_ms=round(jitter, 2), kick_hits=nhits,
               drops=[dict(bar=int(j), t=bars[j][1], jump_db=round(float(d), 2)) for d, j in jumps[:3]],
               bars=[dict(bar=j, t=a, rms_db=round(r, 1), low_db=round(l, 1)) for j, a, r, l in bars])
    return out
if __name__ == '__main__':
    r = analyze(sys.argv[1])
    if '--json' in sys.argv: json.dump(r, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1)
    if '--quiet' in sys.argv: print(r['file'].split('/')[-1], r['bpm'], 'jit', r['jitter_ms'], 'hits', r['kick_hits'], 'drops', [(d['bar'], d['t'], d['jump_db']) for d in r['drops']])
    else: print(json.dumps({k: v for k, v in r.items() if k != 'bars'}, indent=1)); [print(b) for b in r['bars']]
