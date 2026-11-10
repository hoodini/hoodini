"""measure each SFX: peak time (5 ms RMS envelope argmax), onset (first >10% of peak), duration, peak dBFS, active RMS dB.
usage: python -I sfxpeaks.py out.json file1.mp3 file2.mp3 ..."""
import sys, subprocess, json, os
import numpy as np
SR = 48000
out = {}
for f in sys.argv[2:]:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    y = np.frombuffer(raw, np.float32).astype(np.float64)
    w = int(SR * 0.005); env = np.sqrt(np.convolve(y ** 2, np.ones(w) / w, mode='same'))
    p = int(np.argmax(env)); on = int(np.argmax(env > 0.1 * env[p]))
    act = env > 0.05 * env[p]
    out[os.path.basename(f)[:-4]] = dict(peak=round(p / SR, 4), onset=round(on / SR, 4), dur=round(len(y) / SR, 3), peak_db=round(float(20 * np.log10(np.abs(y).max() + 1e-9)), 1), rms_db=round(float(20 * np.log10(np.sqrt((y[act] ** 2).mean()) + 1e-9)), 1))
json.dump(out, open(sys.argv[1], 'w'), indent=1)
for k, v in out.items(): print(k, v)
