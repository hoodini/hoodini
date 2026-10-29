#!/usr/bin/env python3
"""Snap every cut in edit.json 'keep' to real silence, so no cut lands inside a word.
Ranges closer than 0.25 s are merged first (a micro-cut inside a breath sounds like a stutter).
Each boundary moves to the nearest point >= 15 dB under the speech median within 350 ms (with 30 ms of quiet around it).
usage: python3 snapcuts.py edit.json      -> keep_snapped.json + a report (any FLAG must be fixed by hand)"""
import json, subprocess, sys
import numpy as np
cfg = json.load(open(sys.argv[1]))
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', cfg['source'], '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
y = np.frombuffer(raw, np.float32)
env = 20 * np.log10(np.sqrt(np.convolve(y ** 2, np.ones(320) / 320, 'same'))[::160] + 1e-9)   # 20 ms RMS, 10 ms hop
MED = float(np.median(env[env > -60])); QUIET = MED - 15
def snap(t, side):
    for r in range(36):
        for d in ((-r, r) if side == 'in' else (r, -r)):
            i = int(round(t * 100)) + d
            if 0 <= i < len(env) and env[max(0, i - 1):i + 2].max() <= QUIET + 3 and env[i] <= QUIET: return i / 100, True
    i0 = max(0, int(t * 100) - 35); return (i0 + int(np.argmin(env[i0:int(t * 100) + 36]))) / 100, False
K = []
for a, b in cfg['keep']:
    if K and a - K[-1][1] < 0.25: K[-1][1] = b
    else: K.append([a, b])
out = []
print(f'speech median {MED:.1f} dB, quiet <= {QUIET:.1f} dB')
for j, (a, b) in enumerate(K):
    sa, oka = snap(a, 'in'); sb, okb = snap(b, 'out')
    out.append([sa, sb])
    print(f"{a:8.2f}->{sa:8.2f} {env[int(sa*100)]:6.1f}dB {'' if oka else 'FLAG'}   {b:8.2f}->{sb:8.2f} {env[min(len(env)-1,int(sb*100))]:6.1f}dB {'' if okb else 'FLAG'}")
json.dump(out, open('keep_snapped.json', 'w'))
