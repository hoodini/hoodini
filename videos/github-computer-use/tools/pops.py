"""Single-frame pop scan on a finished video: a frame whose difference to BOTH neighbours is >3x the
neighbours' difference to each other (a spike 3x its neighbours). usage: python3 -I pops.py film.mp4 [film2.mp4 ...]"""
import sys, subprocess, numpy as np
for f in sys.argv[1:]:
    w, h, r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip().split(',')
    fps = eval(r); W, H = (192, 108) if int(w) > int(h) else (108, 192)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.int16); pops = []
    d = np.array([np.abs(fr[i + 1] - fr[i]).mean() for i in range(len(fr) - 1)])
    for i in range(1, len(fr) - 1):
        d1, d2, d3 = d[i - 1], d[i], np.abs(fr[i + 1] - fr[i - 1]).mean()
        if min(d1, d2) > 3 * max(d3, 0.3) and min(d1, d2) > 1.0: pops.append((i, round(i / fps, 3), round(float(min(d1, d2)), 2)))
    big = np.argsort(d)[-5:][::-1]
    print(f.split('/')[-1], f'{len(fr)} frames @ {fps:g} fps', 'pops:', pops if pops else 'NONE', '| largest frame diffs at s:', [round(float(i / fps), 2) for i in big])
