#!/usr/bin/env python3
"""Final mix + mux: dialogue chain, music bed ducked under the voice, SFX placed by their peaks,
two-pass loudness to -14 LUFS / -1.5 dBTP, muxed with picture.mp4.

usage: python3 mix.py edl.json build_dir out.mp4 [--no-clean]
edl.audio = {
  "music": [{"src": "music/track.mp3", "at": 0, "in": 12.4, "dur": 60, "gain_db": -16, "duck_db": 10, "fade_out": 2}],
  "sfx":   [{"src": "sfx/whoosh.wav", "event": 12.30, "peak": 0.21, "gain_db": -10}]
}
"""
import argparse, json, re, subprocess
from pathlib import Path

def run(cmd): return subprocess.run(cmd, capture_output=True, text=True, check=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('edl'); ap.add_argument('build'); ap.add_argument('out')
    ap.add_argument('--no-clean', action='store_true', help='skip the dialogue cleanup chain')
    ap.add_argument('--picture', default=None)
    a = ap.parse_args()
    root = Path(a.edl).resolve().parent; edl = json.load(open(a.edl)); b = Path(a.build)
    tl = json.load(open(b / 'timeline.json')); D = tl['duration']
    au = edl.get('audio', {})
    ins = ['-i', str(b / 'dialogue.wav')]; f = []
    # dialogue: rumble cut, gentle denoise, level-riding compressor, a touch of presence
    clean = '' if a.no_clean else 'highpass=f=75,afftdn=nf=-28:tn=1,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3,equalizer=f=3500:t=q:w=1.2:g=2,'
    f.append(f'[0:a]{clean}aresample=48000,asplit=2[dlg][key]')
    music, sfx = [], []
    for m in au.get('music', []):
        ins += ['-i', str((root / m['src']).resolve())]; i = len(ins) // 2 - 1
        dur = m.get('dur', D - m.get('at', 0)); fo = m.get('fade_out', 2.0)
        f.append(f"[{i}:a]atrim={m.get('in', 0)}:{m.get('in', 0) + dur},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
                 f"volume={m.get('gain_db', -16)}dB,afade=t=in:d={m.get('fade_in', 0.05)},afade=t=out:st={max(0, dur - fo)}:d={fo},"
                 f"adelay={int(m.get('at', 0) * 1000)}:all=1[m{i}]")
        music.append(f'[m{i}]')
    for s in au.get('sfx', []):
        ins += ['-i', str((root / s['src']).resolve())]; i = len(ins) // 2 - 1
        st = max(0.0, s['event'] - s.get('peak', 0.0))
        f.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={s.get('gain_db', -10)}dB,adelay={int(st * 1000)}:all=1[s{i}]")
        sfx.append(f'[s{i}]')
    bus = ['[dlg]']
    if music:
        duck = max([m.get('duck_db', 10) for m in au['music']] or [10])
        ratio = min(20, 10 ** (duck / 20) * 2)
        f.append(f"{''.join(music)}amix=inputs={len(music)}:normalize=0[mb]")
        f.append(f"[mb][key]sidechaincompress=threshold=0.025:ratio={ratio:.1f}:attack=25:release=450:makeup=1[md]")
        bus.append('[md]')
    else:
        f.append('[key]anullsink')
    bus += sfx
    f.append(f"{''.join(bus)}amix=inputs={len(bus)}:normalize=0:duration=first,atrim=0:{D}[mix]")
    pre = b / 'mix_pre.wav'
    run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', ';'.join(f), '-map', '[mix]', '-ar', '48000', str(pre)])
    # two-pass loudnorm
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', str(pre), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
          f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    fin = b / 'mix.wav'
    run(['ffmpeg', '-y', '-v', 'error', '-i', str(pre), '-af', ln + ',aresample=48000', str(fin)])
    pic = a.picture or str(b / 'picture.mp4')
    run(['ffmpeg', '-y', '-v', 'error', '-i', pic, '-i', str(fin), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k',
         '-t', f'{D:.3f}', '-movflags', '+faststart', a.out])
    print(f'mixed -> {a.out}  (input {m["input_i"]} LUFS -> -14)')

if __name__ == '__main__':
    main()
