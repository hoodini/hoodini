#!/usr/bin/env python3
"""Turn the EDL's gfx list + captions into render jobs and render them (PNG sequences, transparent).
Also builds karaoke caption chunks from words.json when edl.captions.style is set and chunks are empty.

usage: python3 prep_gfx.py edl.json [--words words.json] [--mov] [--preview]
"""
import argparse, json, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

def remap(words, video):
    """Source word times -> output times through the primary A-roll clips (words in cut gaps are dropped)."""
    out, t0 = [], 0.0
    for c in video:
        d = (c['out'] - c['in']) / c.get('speed', 1.0)
        if c.get('role') == 'aroll':
            for w in words:
                if w['s'] >= c['in'] - 1e-3 and w['e'] <= c['out'] + 0.05:
                    out.append({'w': w['w'], 's': t0 + (w['s'] - c['in']), 'e': t0 + (min(w['e'], c['out']) - c['in'])})
        t0 += d
    return out

def chunks(words, max_words=3, max_chars=18):
    res, cur = [], []
    for w in words:
        if cur and (len(cur) >= max_words or sum(len(x['w']) + 1 for x in cur) + len(w['w']) > max_chars
                    or w['s'] - cur[-1]['e'] > 0.45 or cur[-1]['w'][-1:] in '.,?!'):
            res.append(cur); cur = []
        cur.append(w)
    if cur: res.append(cur)
    return [{'id': f'c{i:04d}', 'words': [w['w'] for w in c], 'ws': [w['s'] for w in c], 's': c[0]['s'],
             'e': (res[i + 1][0]['s'] if i + 1 < len(res) and res[i + 1][0]['s'] - c[-1]['e'] < 0.45 else c[-1]['e'] + 0.15)}
            for i, c in enumerate(res)]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('edl'); ap.add_argument('--words'); ap.add_argument('--mov', action='store_true')
    ap.add_argument('--preview', action='store_true')
    a = ap.parse_args()
    p = Path(a.edl).resolve(); edl = json.load(open(p))
    W, H, fps = edl.get('width', 1920), edl.get('height', 1080), edl.get('fps', 30)
    if a.preview: W, H = W // 2, H // 2
    gdir = p.parent / edl.get('gfx_dir', 'gfx'); gdir.mkdir(parents=True, exist_ok=True)
    cap = edl.setdefault('captions', {'chunks': []})
    if cap.get('style') == 'karaoke' and not cap.get('chunks') and a.words:
        cap['chunks'] = chunks(remap(json.load(open(a.words)), edl['video']), cap.get('max_words', 3))
        json.dump(edl, open(p, 'w'), ensure_ascii=False, indent=1)
        print(f"captions: {len(cap['chunks'])} chunks written into the edl")
    jobs = [{'id': g['id'], 'template': g['template'], 'props': g.get('props', {}), 'dur': g['dur'], 'fps': fps, 'w': W, 'h': H}
            for g in edl.get('gfx', [])]
    size = cap.get('size', 96 if H <= W else 110)
    (gdir / 'captions').mkdir(exist_ok=True)
    for ch in cap.get('chunks', []):
        for i in range(len(ch['words'])):
            jobs.append({'id': f"captions/{ch['id']}_{i}", 'template': 'caption', 'still': True,
                         'props': {'words': ch['words'], 'active': i, 'size': size, 'unit': min(W, H) / 1080}, 'w': W, 'h': int(H * 0.22)})
    jp = gdir / 'jobs.json'; json.dump(jobs, open(jp, 'w'), ensure_ascii=False)
    cmd = ['node', str(HERE / 'gfx' / 'render_gfx.mjs'), str(jp), str(gdir)] + (['--mov'] if a.mov else [])
    sys.exit(subprocess.run(cmd).returncode)

if __name__ == '__main__':
    main()
