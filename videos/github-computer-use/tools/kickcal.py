"""calibrate a beat grid to real kick hits in the time domain: zero-phase low-pass <150 Hz, 5 ms RMS envelope,
kick peak = envelope argmax within +-60 ms of each grid beat; robust linear fit over beats with a clear kick.
usage: python -I kickcal.py song.mp3 analysis.json k0 k1"""
import sys, subprocess, json
import numpy as np
SR = 48000
f, aj, k0, k1 = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
a = json.load(open(aj)); t0, B = a['first_beat'], a['beat']
y = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).astype(np.float64)
Y = np.fft.rfft(y); fq = np.fft.rfftfreq(len(y), 1 / SR); Y[fq > 150] = 0; lp = np.fft.irfft(Y, len(y))
w = int(SR * 0.005); env = np.sqrt(np.convolve(lp ** 2, np.ones(w) / w, mode='same'))
rows = []
for k in range(k0, k1):
    t = t0 + k * B; i0, i1 = int((t - 0.06) * SR), int((t + 0.06) * SR); seg = env[i0:i1]; j = int(np.argmax(seg))
    base = np.median(env[int((t - 0.24) * SR):int((t - 0.1) * SR)])
    rows.append((k, t, (i0 + j) / SR, seg[j], seg[j] / (base + 1e-9)))
r = np.array(rows); strong = r[:, 4] > 2.5
A = np.vstack([np.ones(strong.sum()), r[strong, 0]]).T; c, *_ = np.linalg.lstsq(A, r[strong, 2], rcond=None)
res = r[strong, 2] - A @ c; keep = np.abs(res - np.median(res)) < 0.012
c, *_ = np.linalg.lstsq(A[keep], r[strong, 2][keep], rcond=None); res = r[strong, 2][keep] - A[keep] @ c
print(f'beats {k0}-{k1}: {strong.sum()} clear kicks, {keep.sum()} used; fit beat={c[1]:.6f}s ({60 / c[1]:.3f} BPM) first_beat={c[0] % c[1]:.4f} '
      f'shift vs auto grid {((c[0] + k0 * c[1]) - (t0 + k0 * B)) * 1000:+.1f} ms at beat {k0}; residual rms {np.sqrt((res ** 2).mean()) * 1000:.1f} ms, max {np.abs(res).max() * 1000:.1f} ms')
for k, t, tk, pk, ratio in rows[:12]: print(k, f'grid {t:.4f}', f'kick {tk:.4f}', f'dev {(tk - t) * 1000:+.1f} ms', f'clarity {ratio:.1f}')
json.dump(dict(beat=c[1], first_beat=c[0] % c[1], k0=k0, k1=k1, resid_ms=float(np.sqrt((res ** 2).mean()) * 1000)), open(aj.replace('.json', '_kick.json'), 'w'), indent=1)
