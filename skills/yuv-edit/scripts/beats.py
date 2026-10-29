#!/usr/bin/env python3
"""Beat grid + drop + SFX peak for music and sound effects (numpy only).

usage: python3 beats.py track.mp3 [--sfx]      -> prints JSON
  music: {"bpm", "beat", "first_beat", "beats":[...], "drop"}    (drop = biggest sustained energy rise)
  --sfx: {"peak", "dur"}   the time of the loudest moment — place the file at event_time - peak
"""
import argparse, json, subprocess
import numpy as np

def load(path, sr=22050):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32), sr

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('path'); ap.add_argument('--sfx', action='store_true')
    a = ap.parse_args()
    y, sr = load(a.path)
    if a.sfx:
        hop = 256; env = np.sqrt(np.convolve(y ** 2, np.ones(hop) / hop, 'same'))
        print(json.dumps({'peak': round(float(np.argmax(env)) / sr, 4), 'dur': round(len(y) / sr, 3)})); return
    n, hop = 2048, 512
    frames = np.lib.stride_tricks.sliding_window_view(np.pad(y, (n // 2, n // 2)), n)[::hop] * np.hanning(n)
    mag = np.abs(np.fft.rfft(frames, axis=1))
    flux = np.maximum(0, np.diff(np.log1p(mag), axis=0)).sum(1)
    flux = (flux - flux.mean()) / (flux.std() + 1e-9)
    fr = sr / hop
    ac = np.correlate(flux, flux, 'full')[len(flux) - 1:]
    lags = np.arange(len(ac)) / fr
    ok = (lags > 60 / 180) & (lags < 60 / 70)
    # prefer tempi near 120 a little (log-gaussian weight) to avoid octave errors
    wgt = np.exp(-0.5 * (np.log2(np.where(lags > 0, 60 / np.maximum(lags, 1e-6), 1) / 120) / 0.9) ** 2)
    lag = np.argmax(np.where(ok, ac * wgt, -np.inf))
    # refine period + phase jointly on a fine grid (integer-lag autocorrelation is only ~23ms accurate)
    def score(per, ph):
        idx = np.round(np.arange(ph, len(flux) / fr, per) * fr).astype(int)
        idx = idx[idx < len(flux)]
        return flux[np.clip(idx, 0, len(flux) - 1)].sum() + 0.5 * flux[np.clip(idx - 1, 0, len(flux) - 1)].sum()
    best, period, phase = -np.inf, lag / fr, 0.0
    for per in np.linspace(lag / fr * 0.97, lag / fr * 1.03, 61):
        for ph in np.linspace(0, per, 48, endpoint=False):
            sc = score(per, ph)
            if sc > best: best, period, phase = sc, per, ph
    # spectral flux fires when an onset ENTERS the centred window (~n/2 early); measured correction 0.8*n/2
    phase = (phase + 0.8 * (n / 2) / sr) % period
    beats = np.arange(phase, len(y) / sr, period)
    # drop: largest rise of 4-second RMS vs the previous 4 seconds
    win = int(sr * 4); rms = np.sqrt(np.convolve(y ** 2, np.ones(win) / win, 'valid'))
    step = int(sr * 0.25); r = rms[::step]
    rise = r[16:] - r[:-16] if len(r) > 16 else np.array([0])
    drop_t = (np.argmax(rise) + 16) * 0.25 if len(r) > 16 else 0.0
    drop_t = float(beats[np.argmin(np.abs(beats - drop_t))]) if len(beats) else drop_t
    print(json.dumps({'bpm': round(60 / period, 2), 'beat': round(period, 4), 'first_beat': round(float(phase), 4),
                      'drop': round(drop_t, 3), 'beats': [round(float(b), 3) for b in beats]}))

if __name__ == '__main__':
    main()
