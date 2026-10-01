"""Loudness-normalize the score, mux with the rendered video, encode final + 720p preview, verify.
Usage: python3 finalize.py A [--stats]   (--stats writes src/gen/stats.json for the PROOF shot)"""
import json, re, subprocess, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
B = ROOT / 'build'
FMT = sys.argv[1].upper()
NAME = {'A': 'YA-001-CCM_16x9', 'B': 'YA-001-CCM_9x16'}[FMT]

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=True)

def probe(path):
    out = run(['ffprobe', '-v', 'error', '-count_frames', '-show_entries',
               'stream=codec_type,codec_name,profile,width,height,r_frame_rate,nb_read_frames,sample_rate,channels:format=duration,size',
               '-of', 'json', str(path)]).stdout
    return json.loads(out)

def loudness(path):
    err = run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
    summ = err[err.rfind('Summary:'):]
    i = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1))
    tp = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
    return i, tp

timing = json.loads((B / f'timing_{FMT}.json').read_text())
render = json.loads((B / f'render_{FMT}.json').read_text())

# 1) loudness: bus compression + limiter, then two-pass loudnorm to -14 LUFS (TP target -1.5 to leave AAC headroom)
src = B / f'audio_{FMT}.wav'
pre = 'acompressor=threshold=-22dB:ratio=2.5:attack=8:release=160:makeup=2,alimiter=limit=0.7:level=false'
m = run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(src), '-af', f'{pre},loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json', '-f', 'null', '-']).stderr
meas = json.loads(m[m.rfind('{'):m.rfind('}') + 1])
ln = (f"loudnorm=I=-14:TP=-2.0:LRA=11:measured_I={meas['input_i']}:measured_TP={meas['input_tp']}:"
      f"measured_LRA={meas['input_lra']}:measured_thresh={meas['input_thresh']}:offset={meas['target_offset']}:linear=true")
norm = B / f'audio_{FMT}_norm.wav'
# oversampled limiter after loudnorm approximates true-peak limiting (AAC adds a little overshoot on top)
tp = 'aresample=192000,alimiter=limit=0.75:attack=1:release=60:level=false,aresample=48000'
run(['ffmpeg', '-y', '-hide_banner', '-i', str(src), '-af', f'{pre},{ln},{tp}', '-ar', '48000', '-c:a', 'pcm_s24le', str(norm)])

# 2) final encode
final = ROOT / f'{NAME}.mp4'
run(['ffmpeg', '-y', '-hide_banner', '-i', str(B / f'video_{FMT}.mp4'), '-i', str(norm), '-map', '0:v', '-map', '1:a',
     '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30',
     '-b:v', '5M', '-maxrate', '7M', '-bufsize', '10M',
     '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', '-shortest', str(final)])

# 3) 720p preview
prev = ROOT / f'{NAME}_720p.mp4'
scale = 'scale=1280:720' if FMT == 'A' else 'scale=720:1280'
run(['ffmpeg', '-y', '-hide_banner', '-i', str(final), '-vf', f'{scale}:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow',
     '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '24', '-maxrate', '2.5M', '-bufsize', '5M',
     '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(prev)])

# 4) verify
res = {}
for label, path, limit in (('final', final, 100e6), ('preview', prev, 30e6)):
    p = probe(path)
    v = next(s for s in p['streams'] if s['codec_type'] == 'video')
    a = next(s for s in p['streams'] if s['codec_type'] == 'audio')
    i, tp = loudness(path)
    size = int(p['format']['size'])
    res[label] = {
        'file': path.name, 'width': v['width'], 'height': v['height'], 'fps': v['r_frame_rate'], 'video': f"{v['codec_name']} {v.get('profile')}",
        'frames': int(v['nb_read_frames']), 'duration': float(p['format']['duration']), 'audio': f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']}ch",
        'lufs': i, 'true_peak_dbfs': tp, 'size_mb': round(size / 1e6, 2),
        'checks': {
            'frames_match': int(v['nb_read_frames']) == timing['frames'],
            'fps_30': v['r_frame_rate'] == '30/1',
            'loudness_ok': abs(i + 14) <= 0.5,
            'true_peak_ok': tp <= -1.0,
            'size_ok': size < limit,
        },
    }
res['render'] = render
res['expected'] = {'frames': timing['frames'], 'duration': timing['duration'], 'shots': len(timing['shots'])}
(ROOT / 'qa' / f'final_{FMT}.json').write_text(json.dumps(res, indent=1))
print(json.dumps(res, indent=1))

if '--stats' in sys.argv:
    f = res['final']
    stats = {'shots': len(timing['shots']), 'frames': f['frames'], 'duration': round(f['frames'] / 30, 2), 'workers': render['workers'],
             'source': f'measured from {f["file"]} (ffprobe) and build/render_{FMT}.json'}
    (ROOT / 'src' / 'gen' / 'stats.json').write_text(json.dumps(stats, indent=1))
    print('stats.json', stats)
