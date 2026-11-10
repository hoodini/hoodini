"""Score the film from out/cues.json: music from S0 + every SFX placed so its MEASURED PEAK lands on the event
(start = event - peak), two-pass loudnorm to -14 LUFS / -1.5 dBTP, then mux into each silent render (-t DUR, never -shortest).
No VO in this film, so there is no sidechain duck. usage: python3 tools/mix.py out/cues.json audio out/audio.wav [silent.mp4 out.mp4 ...]"""
import json, subprocess, re, sys, os
C = json.load(open(sys.argv[1])); A_DIR = sys.argv[2]; WAV = sys.argv[3]; MUX = sys.argv[4:]
A = json.load(open(os.path.join(A_DIR, 'analysis.json')))['sfx']; DUR = C['dur']; m = C['music']
inputs = ['-ss', f"{m['S0']:.4f}", '-t', f'{DUR + 0.2:.4f}', '-i', os.path.join(A_DIR, m['file'])]
filt = [f"[0:a]aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st={DUR - 0.8:.3f}:d=0.8,volume={m.get('gain', -2)}dB[m]"]; labels = ['[m]']
for i, (name, ev, g) in enumerate(C['cues'], start=1):
    a = A[name]; start = ev - a['peak']; cut = max(0.0, -start); start = max(0.0, start)
    inputs += ['-i', os.path.join(A_DIR, a['file'])]
    filt.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=start={cut:.4f},asetpts=PTS-STARTPTS,volume={g}dB,adelay={int(round(start * 1000))}:all=1[s{i}]'); labels.append(f'[s{i}]')
filt.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=first,atrim=0:{DUR:.4f}[mix]'); fc = ';'.join(filt)
run = lambda a: subprocess.run(['ffmpeg', '-y', '-hide_banner'] + a, capture_output=True, text=True)
r = run(inputs + ['-filter_complex', fc + ';[mix]loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json[o]', '-map', '[o]', '-f', 'null', '-'])
mm = json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}', r.stderr)[-1])
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={mm['input_i']}:measured_TP={mm['input_tp']}:measured_LRA={mm['input_lra']}:measured_thresh={mm['input_thresh']}:offset={mm['target_offset']}:linear=true"
r = run(inputs + ['-filter_complex', fc + f';[mix]{ln},alimiter=limit=0.82:level=false:attack=1:release=40,aresample=48000[o]', '-map', '[o]', '-c:a', 'pcm_s16le', WAV])
if r.returncode: print(r.stderr[-2000:]); sys.exit(1)
chk = run(['-i', WAV, '-af', 'ebur128=peak=true', '-f', 'null', '-'])
print('loudness', re.findall(r'I:\s+(-?[\d.]+) LUFS', chk.stderr)[-1], 'LUFS · true peak', re.findall(r'Peak:\s+(-?[\d.]+) dBFS', chk.stderr)[-1], 'dBFS ·', len(C['cues']), 'cues')
for src, out in zip(MUX[0::2], MUX[1::2]):
    r = run(['-i', src, '-i', WAV, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', f'{DUR:.4f}', '-movflags', '+faststart', out])
    print(out, 'ok' if r.returncode == 0 else r.stderr[-600:])
