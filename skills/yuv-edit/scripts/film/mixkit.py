#!/usr/bin/env python3
"""Fetch licensed Mixkit music / SFX (Mixkit free licence: use in videos, never redistribute the raw files or commit them).
usage: python3 mixkit.py video <tag> [n]      e.g. candles, coding, city, jerusalem -> broll/v<ID>.mp4 + a contact sheet to choose by eye
       python3 mixkit.py music <tag> [n]      e.g. technology, corporate, chill  -> music/mk<ID>.mp3 + duration/BPM/drop table
       python3 mixkit.py sfx <tag> [n]        e.g. whoosh, pop, click, notification, transition -> sfx/s<ID>.mp3 + peak table
Pick by the table (length >= film, a steady BPM, energy that fits); you cannot listen, so say how you chose."""
import json, re, subprocess, sys, urllib.request
from pathlib import Path
kind, tag, n = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 8
if kind == 'video':   # licensed stock B-roll (Mixkit free licence): download previews, make a sheet, pick by eye, then fetch 720/1080
    html = urllib.request.urlopen(urllib.request.Request('https://mixkit.co/free-stock-video/%s/' % tag, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read().decode('utf8', 'ignore')
    ids = list(dict.fromkeys(m.group(1) for m in re.finditer(r'https://assets\.mixkit\.co/videos/(\d+)/\1-360\.mp4', html)))[:n]
    d = Path('broll'); d.mkdir(exist_ok=True)
    for i in ids:
        (d / f'v{i}-360.mp4').write_bytes(urllib.request.urlopen(urllib.request.Request(f'https://assets.mixkit.co/videos/{i}/{i}-360.mp4', headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read())
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', '1.5', '-i', str(d / f'v{i}-360.mp4'), '-frames:v', '1', '-vf',
                        f"scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2,drawtext=text='{i}':x=4:y=4:fontsize=16:fontcolor=yellow:box=1:boxcolor=black", str(d / f'v{i}.png')])
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-pattern_type', 'glob', '-i', str(d / 'v[0-9]*.png'), '-vf', 'tile=5x2', str(d / f'sheet_{tag}.png')])
    print('look at', d / f'sheet_{tag}.png', '- then: curl https://assets.mixkit.co/videos/<ID>/<ID>-720.mp4 (1080 exists for some)', ids); sys.exit()
UA = {'User-Agent': 'Mozilla/5.0'}
page = 'https://mixkit.co/free-stock-music/tag/%s/' % tag if kind == 'music' else 'https://mixkit.co/free-sound-effects/%s/' % tag
html = urllib.request.urlopen(urllib.request.Request(page, headers=UA), timeout=30).read().decode('utf8', 'ignore')
pat = r'https://assets\.mixkit\.co/music/(\d+)/\1\.mp3' if kind == 'music' else r'https://assets\.mixkit\.co/active_storage/sfx/(\d+)/\1-preview\.mp3'
ids = list(dict.fromkeys(m.group(1) for m in re.finditer(pat, html)))[:n]
d = Path('music' if kind == 'music' else 'sfx'); d.mkdir(exist_ok=True)
beats = str(Path(__file__).resolve().parent.parent / 'beats.py')
for i in ids:
    url = f'https://assets.mixkit.co/music/{i}/{i}.mp3' if kind == 'music' else f'https://assets.mixkit.co/active_storage/sfx/{i}/{i}-preview.mp3'
    out = d / (f'mk{i}.mp3' if kind == 'music' else f's{i}.mp3')
    out.write_bytes(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read())
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(out)], capture_output=True, text=True).stdout)
    info = json.loads(subprocess.run(['python3', beats, str(out)] + ([] if kind == 'music' else ['--sfx']), capture_output=True, text=True).stdout)
    print(out, f'{dur:6.1f}s', {k: v for k, v in info.items() if k != 'beats'})
