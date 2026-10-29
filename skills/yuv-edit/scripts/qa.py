#!/usr/bin/env python3
"""Edit QA: pacing stats from the EDL, a contact sheet of the ACTUAL output, loudness, frame count.
Prints PASS/WARN/FAIL lines against the rules in references/playbook.md. Look at the sheet yourself.

usage: python3 qa.py edl.json final.mp4 out_dir [--sheet 24]
"""
import argparse, json, re, subprocess
from pathlib import Path

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('edl'); ap.add_argument('video'); ap.add_argument('out')
    ap.add_argument('--sheet', type=int, default=24)
    a = ap.parse_args()
    edl = json.load(open(a.edl)); out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    res = []
    def rep(level, msg): res.append(f'{level:4} {msg}')
    # --- timeline stats
    prim, t = [], 0.0
    for c in edl['video']:
        d = (c['out'] - c['in']) / c.get('speed', 1.0); prim.append((t, d, c)); t += d
    D = t
    changes = sorted({round(p[0], 2) for p in prim[1:]} | {round(c['at'], 2) for c in edl.get('covers', [])}
                     | {round(c['at'] + c['dur'], 2) for c in edl.get('covers', [])} | {round(g['at'], 2) for g in edl.get('gfx', [])})
    changes = [x for x in changes if 0 < x < D]
    cpm = len(changes) / (D / 60) if D else 0
    is_short = D <= 75 or edl.get('height', 1080) > edl.get('width', 1920)
    lo, hi = (20, 45) if is_short else (12, 28)
    rep('PASS' if lo <= cpm <= hi else 'WARN', f'visual changes/min {cpm:.1f} (target {lo}-{hi} for {"short" if is_short else "long-form"}; faster is not better)')
    per_min = {}
    for x in changes: per_min[int(x // 60)] = per_min.get(int(x // 60), 0) + 1
    flat = [m for m in range(int(D // 60) + 1) if per_min.get(m, 0) < (6 if not is_short else 10) and (m + 1) * 60 <= D]
    if flat: rep('WARN', f'minutes with few visual changes: {flat} — add B-roll/graphics or tighten')
    gaps = [b - a_ for a_, b in zip([0] + changes, changes + [D])]
    longest = max(gaps) if gaps else D
    rep('PASS' if longest <= (12 if not is_short else 4) else 'WARN', f'longest unchanged shot {longest:.1f}s')
    first = changes[0] if changes else D
    rep('PASS' if first <= (4 if not is_short else 1.5) else 'FAIL', f'first visual change at {first:.1f}s (hook needs motion early)')
    beh = [g for g in edl.get('gfx', []) if g.get('behind_subject')]
    lim = max(1, int(D / 120) + 1)
    rep('PASS' if len(beh) <= lim else 'WARN', f'text-behind-subject moments {len(beh)} (limit ~1 per 2 min = {lim}; it is a highlight, not a style)')
    sfx = sorted(s['event'] for s in edl.get('audio', {}).get('sfx', []))
    tight = [round(b, 2) for a_, b in zip(sfx, sfx[1:]) if b - a_ < 0.8]
    rep('PASS' if not tight else 'WARN', f'back-to-back SFX (<0.8s apart): {tight or "none"}')
    ctas = [g for g in edl.get('gfx', []) if g['template'] == 'cta']
    early = [g['at'] for g in ctas if g['at'] < 30]
    rep('PASS' if not early else 'WARN', f'CTA in first 30s: {early or "none"} (ask after the payoff, not before)')
    if not any(g['template'] == 'endcard' for g in edl.get('gfx', [])): rep('WARN', 'no endcard / signature')
    # --- output checks
    pr = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
                         'stream=nb_read_frames:format=duration', '-of', 'json', a.video], capture_output=True, text=True).stdout
    j = json.loads(pr); frames = int(j['streams'][0]['nb_read_frames']); dur = float(j['format']['duration'])
    exp = round(D * edl.get('fps', 30))
    rep('PASS' if abs(frames - exp) <= 2 else 'FAIL', f'frames {frames} (expected {exp}), duration {dur:.2f}s')
    lo_ = subprocess.run(['ffmpeg', '-i', a.video, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', lo_); p = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', lo_)
    if m:
        I = float(m[-1]); rep('PASS' if abs(I + 14) <= 1 else 'FAIL', f'loudness {I:.1f} LUFS (target -14 ±1)' + (f', true peak {p[-1]} dBFS' if p else ''))
    else: rep('WARN', 'no audio stream measured')
    n = a.sheet; cols = 6
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', a.video, '-vf',
                    f"fps={n}/{max(dur, 0.1)},scale=480:-2,drawtext=text='%{{pts\\:hms}}':x=8:y=8:fontsize=18:fontcolor=white:box=1:boxcolor=0x0E0D2A@0.7,tile={cols}x{(n + cols - 1) // cols}",
                    '-frames:v', '1', str(out / 'sheet.png')], check=False)
    report = '\n'.join(res)
    (out / 'qa.txt').write_text(report + '\n')
    print(report); print(f'contact sheet: {out / "sheet.png"}  <- open it and look')

if __name__ == '__main__':
    main()
