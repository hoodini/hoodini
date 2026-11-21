#!/usr/bin/env python3
"""Export the EDL as an editable FCPXML 1.10 timeline (DaVinci Resolve: File > Import > Timeline;
Final Cut Pro: File > Import > XML). Premiere: import into Resolve and export an FCP7 XML, or use the
rendered MP4. Also writes captions.srt.

Layout: spine = primary clips (A-roll cuts with their punch-in as a scale transform);
lane 1 = covers (B-roll / screens / stills); lane 2+ = gfx movies (ProRes 4444 with alpha, from
prep_gfx --mov); lane -1 = music; lane -2 = SFX. Code-only treatments (card3d, parallax, screen stage)
are placed as their source media so the editor can rebuild or replace them; the rendered film keeps them.

usage: python3 export_fcpxml.py edl.json out.fcpxml
"""
import json, sys
from fractions import Fraction
from pathlib import Path
from xml.sax.saxutils import quoteattr as qa

def main():
    edl_p, out_p = Path(sys.argv[1]).resolve(), Path(sys.argv[2])
    edl = json.load(open(edl_p)); root = edl_p.parent
    fps = edl.get('fps', 30); W, H = edl.get('width', 1920), edl.get('height', 1080)
    fd = Fraction(1001, 30000) if abs(fps - 29.97) < .01 else Fraction(1, int(round(fps)))
    def T(sec):  # snap to the frame grid, FCPXML rational time
        f = round(Fraction(sec).limit_denominator(100000) / fd)
        v = f * fd
        return f'{v.numerator}/{v.denominator}s' if v.denominator != 1 else f'{v.numerator}s'
    assets, aid = {}, [0]
    def asset(path, video=True, audio=True, dur=36000):
        path = str(Path(path).resolve())
        if path not in assets:
            aid[0] += 1
            assets[path] = (f'r{aid[0] + 1}', video, audio, dur)
        return assets[path][0]
    srcs = {k: (root / v).resolve() for k, v in edl['sources'].items()}
    gdir = root / edl.get('gfx_dir', 'gfx')
    spine, t = [], 0.0
    prim = []
    for c in edl['video']:
        d = (c['out'] - c['in']) / c.get('speed', 1.0); prim.append((t, d, c)); t += d
    total = t
    def children_for(t0, d):
        out = []
        for cv in edl.get('covers', []):
            if t0 <= cv['at'] < t0 + d:
                r = asset(srcs[cv['src']], audio=False)
                out.append(f'<asset-clip ref="{r}" lane="1" offset="{{OFF:{cv["at"]}}}" start="{T(cv.get("in", 0))}" duration="{T(cv["dur"])}" name={qa(cv.get("kind", "broll") + " " + cv["src"])}/>')
        for i, g in enumerate(edl.get('gfx', [])):
            mov = gdir / f'{g["id"]}.mov'
            if t0 <= g['at'] < t0 + d and mov.exists():
                r = asset(mov, audio=False)
                out.append(f'<asset-clip ref="{r}" lane="{2 + g.get("z", 0)}" offset="{{OFF:{g["at"]}}}" start="0s" duration="{T(g["dur"])}" name={qa("gfx " + g["id"])}/>')
        for m in edl.get('audio', {}).get('music', []) if t0 == 0 else []:
            r = asset((root / m['src']).resolve(), video=False)
            out.append(f'<asset-clip ref="{r}" lane="-1" offset="{{OFF:{m.get("at", 0)}}}" start="{T(m.get("in", 0))}" duration="{T(m.get("dur", total - m.get("at", 0)))}" audioRole="music"><adjust-volume amount="{m.get("gain_db", -16)}dB"/></asset-clip>')
        for s in edl.get('audio', {}).get('sfx', []):
            at = max(0, s['event'] - s.get('peak', 0))
            if t0 <= at < t0 + d:
                r = asset((root / s['src']).resolve(), video=False)
                out.append(f'<asset-clip ref="{r}" lane="-2" offset="{{OFF:{at}}}" start="0s" duration="{T(1.5)}" audioRole="effects"><adjust-volume amount="{s.get("gain_db", -10)}dB"/></asset-clip>')
        return out
    for t0, d, c in prim:
        r = asset(srcs[c['src']], audio=c.get('role') == 'aroll')
        start = c['in']
        kids = [k.replace('{OFF:', '{OFF:') for k in children_for(t0, d)]
        # connected clip offsets are in the parent's source time
        kids = [_fix(k, lambda at: T(start + (at - t0))) for k in kids]
        z = c.get('zoom', 1.0); z = z if isinstance(z, (int, float)) else (z.get('from', 1) + z.get('to', 1)) / 2
        tf = f'<adjust-transform scale="{z:.4f} {z:.4f}"/>' if abs(z - 1) > 1e-3 else ''
        sp = c.get('speed', 1.0)
        ts = f'<timeMap><timept time="0s" value="0s" interp="linear"/><timept time="{T(d)}" value="{T(d * sp)}" interp="linear"/></timeMap>' if abs(sp - 1) > 1e-3 else ''
        spine.append(f'<asset-clip ref="{r}" offset="{T(t0)}" start="{T(start)}" duration="{T(d)}" name={qa(c["src"])}>{tf}{ts}{"".join(kids)}</asset-clip>')
    res = [f'<format id="r1" name="FFVideoFormat{H}p{int(round(fps))}" frameDuration="{fd.numerator}/{fd.denominator}s" width="{W}" height="{H}"/>']
    for path, (rid, v, au, dur) in assets.items():
        res.append(f'<asset id="{rid}" name={qa(Path(path).name)} start="0s" duration="{T(dur)}" hasVideo="{int(v)}" hasAudio="{int(au)}" format="r1">'
                   f'<media-rep kind="original-media" src={qa(Path(path).as_uri())}/></asset>')
    name = edl.get('title', root.name)
    xml = (f'<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n<fcpxml version="1.10">\n<resources>\n' + '\n'.join(res) +
           f'\n</resources>\n<library><event name={qa(name)}><project name={qa(name)}><sequence format="r1" duration="{T(total)}" tcStart="0s" audioLayout="stereo" audioRate="48k"><spine>\n'
           + '\n'.join(spine) + '\n</spine></sequence></project></event></library>\n</fcpxml>\n')
    out_p.write_text(xml)
    # captions.srt
    def ts(x): h, r = divmod(x, 3600); m, s = divmod(r, 60); return f'{int(h):02d}:{int(m):02d}:{int(s):02d},{int((s % 1) * 1000):03d}'
    chs = edl.get('captions', {}).get('chunks', [])
    if chs:
        (out_p.with_name('captions.srt')).write_text('\n'.join(f"{i + 1}\n{ts(c['s'])} --> {ts(c['e'])}\n{' '.join(c['words'])}\n" for i, c in enumerate(chs)))
    print(f'{out_p}: {len(spine)} spine clips, {len(assets)} assets' + (', captions.srt' if chs else ''))

def _fix(s, conv):
    import re
    return re.sub(r'\{OFF:([0-9.eE+-]+)\}', lambda m: conv(float(m.group(1))), s)

if __name__ == '__main__':
    main()
