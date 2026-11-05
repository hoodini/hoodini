#!/usr/bin/env python3
"""Dialogue from the silence-snapped cuts (10 ms fades) + the Mixkit music bed + SFX hung on the same named anchors
the motion uses. Writes build/dialogue.wav, build/timeline.json and audio_edl.json for ../mix.py.
usage: python3 build_audio.py edit.json      (after build_data.py)"""
import json, subprocess, sys
from pathlib import Path
CFG = json.load(open(sys.argv[1])); D = json.load(open('data.json')); A = D['A']
KEEP = json.load(open('keep_snapped.json')); M = json.load(open('music.json'))
Path('build').mkdir(exist_ok=True)
f = [f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
     f"afade=t=in:d=0.01,afade=t=out:st={max(0, b - a - 0.01):.3f}:d=0.01[a{i}]" for i, (a, b) in enumerate(KEEP)]
f.append(f"anullsrc=r=48000:cl=stereo,atrim=0:{D['DUR'] - D['SPEECH']:.3f}[tail]")
f.append(''.join(f'[a{i}]' for i in range(len(KEEP))) + f'[tail]concat=n={len(KEEP) + 1}:v=0:a=1[out]')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', CFG['source'], '-filter_complex', ';'.join(f), '-map', '[out]', 'build/dialogue.wav'], check=True)
json.dump({'duration': D['DUR'], 'fps': 60}, open('build/timeline.json', 'w'))
S = CFG['sfx']; P = S['peaks']
ev = [(n, A[k] + off, g) for n, k, off, g in S['events']]
if S.get('push_cut'):   # a swish on every screen->screen jump cut (the PUSH)
    n, g = S['push_cut']; pl = D['plates']
    ev += [(n, p['t0'], g) for i, p in enumerate(pl) if i and p['cut'] and p['kind'] == 'screen' and pl[i - 1]['kind'] == 'screen']
ev.sort(key=lambda e: e[1]); clean = []
for e in ev:
    if clean and e[1] - clean[-1][1] < 0.8: continue   # never back to back
    clean.append(e)
mu = CFG['music']
json.dump({'audio': {'music': [{'src': mu['file'], 'at': 0, 'in': M['music_in'], 'dur': D['DUR'], 'gain_db': mu.get('gain_db', -17),
                                'duck_db': mu.get('duck_db', 11), 'fade_out': 3.0}],
                     'sfx': [{'src': f'sfx/{n}.mp3', 'event': round(t, 3), 'peak': P[n], 'gain_db': g} for n, t, g in clean]}},
          open('audio_edl.json', 'w'), indent=1)
print(f"dialogue {D['DUR']:.2f}s, {len(clean)} sfx ({len(ev) - len(clean)} dropped as too close)")
