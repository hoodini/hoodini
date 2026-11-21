#!/usr/bin/env python3
"""Draft the A-roll cut from words.json: remove dead air, fillers and retakes; hide jump cuts with
alternating punch-ins. Output is a DRAFT edl.json — Claude then reads transcript.md + cuts.md and makes the
editorial decisions (what to cut for story, where B-roll and graphics go).

usage: python3 autocut.py words.json source_key out_edl.json [--gap 0.35] [--fps 30] [--w 1920 --h 1080]
        [--punch 1.0,1.12] [--fillers he|en|none] [--src path]
writes out_edl.json and cuts.md (every removal with its reason, so nothing disappears silently)
"""
import argparse, json, re
from difflib import SequenceMatcher
from pathlib import Path

FILLERS = {
    'he': {'אממ', 'אמ', 'אה', 'אהה', 'אהם', 'הממ', 'אממממ', 'ממ'},
    'en': {'um', 'uh', 'erm', 'uhm', 'hmm', 'mm'},
}
norm = lambda w: re.sub(r'[^\w֐-׿]', '', w.lower())

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('words'); ap.add_argument('key'); ap.add_argument('out')
    ap.add_argument('--src', default=None, help='source path to write into edl.sources')
    ap.add_argument('--gap', type=float, default=0.35, help='pauses longer than this are cut')
    ap.add_argument('--pre', type=float, default=0.06); ap.add_argument('--post', type=float, default=0.14)
    ap.add_argument('--punch', default='1.0,1.12', help='zoom levels alternated across jump cuts')
    ap.add_argument('--fillers', default='he'); ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--w', type=int, default=1920); ap.add_argument('--h', type=int, default=1080)
    a = ap.parse_args()
    words = json.load(open(a.words))
    fill = set().union(*(FILLERS[k] for k in a.fillers.split(',') if k in FILLERS)) if a.fillers != 'none' else set()
    log = []

    # 1. fillers
    kept = []
    for w in words:
        if norm(w['w']) in fill: log.append(f"{w['s']:7.2f} filler «{w['w']}»"); continue
        kept.append(w)

    # 2. sentences (by pause), then retakes: a sentence restarted within 25s with the same opening -> drop the earlier take
    sents, cur = [], []
    for w in kept:
        if cur and w['s'] - cur[-1]['e'] > 0.6: sents.append(cur); cur = []
        cur.append(w)
    if cur: sents.append(cur)
    drop = set()
    for i, s in enumerate(sents):
        a_txt = ' '.join(norm(w['w']) for w in s)
        for j in range(i + 1, min(i + 4, len(sents))):
            b = sents[j]
            if b[0]['s'] - s[-1]['e'] > 25: break
            b_txt = ' '.join(norm(w['w']) for w in b)
            head = min(len(s), len(b), 4)
            same_open = [norm(w['w']) for w in s[:head]] == [norm(w['w']) for w in b[:head]] and head >= 2
            ratio = SequenceMatcher(None, a_txt, b_txt[:len(a_txt) + 10]).ratio()
            if same_open or ratio > 0.72:
                drop.add(i); log.append(f"{s[0]['s']:7.2f} retake «{' '.join(w['w'] for w in s)[:60]}» (redone at {b[0]['s']:.2f})"); break
    kept = [w for i, s in enumerate(sents) if i not in drop for w in s]

    # 2b. restarts inside one breath: "the secret of X ... the secret of X and ..." -> keep the last take
    i = 0
    while i < len(kept):
        hit = None
        for n in (5, 4, 3, 2):
            a_ = [norm(w['w']) for w in kept[i:i + n]]
            if len(a_) < n or (n == 2 and len(''.join(a_)) < 6): continue
            for j in range(i + n, min(i + n + 4, len(kept) - n + 1)):
                if [norm(w['w']) for w in kept[j:j + n]] == a_: hit = j; break
            if hit: break
        if hit:
            log.append(f"{kept[i]['s']:7.2f} restart «{' '.join(w['w'] for w in kept[i:hit])}»")
            kept = kept[:i] + kept[hit:]
        else: i += 1

    # 3. segments: merge words separated by < gap
    segs = []
    for w in kept:
        s0, e0 = max(0, w['s'] - a.pre), w['e'] + a.post
        if segs and w['s'] - segs[-1][2] < a.gap:
            segs[-1][1] = e0; segs[-1][2] = w['e']
        else:
            if segs: log.append(f"{segs[-1][1]:7.2f} pause {w['s'] - segs[-1][2]:.2f}s cut")
            segs.append([s0, e0, w['e']])
    # never overlap
    for i in range(1, len(segs)):
        if segs[i][0] < segs[i - 1][1]: segs[i][0] = segs[i - 1][1] = (segs[i][0] + segs[i - 1][1]) / 2

    # 4. jump-cut hiding: alternate punch levels; a long pause (new thought) resets to wide
    levels = [float(x) for x in a.punch.split(',')]
    video, li = [], 0
    for i, (s, e, _) in enumerate(segs):
        if i and s - segs[i - 1][1] > 1.2: li = 0
        video.append({'src': a.key, 'role': 'aroll', 'in': round(s, 3), 'out': round(e, 3), 'zoom': levels[li % len(levels)]})
        li += 1
    total = sum(v['out'] - v['in'] for v in video)
    raw = words[-1]['e'] - words[0]['s'] if words else 0
    edl = {'fps': a.fps, 'width': a.w, 'height': a.h, 'sources': {a.key: a.src or f'{a.key}.mp4'},
           'gfx_dir': 'gfx', 'video': video, 'covers': [], 'gfx': [], 'captions': {'chunks': []},
           'audio': {'music': [], 'sfx': []}}
    json.dump(edl, open(a.out, 'w'), ensure_ascii=False, indent=1)
    cpm = (len(video) - 1) / (total / 60) if total else 0
    with open(Path(a.out).with_name('cuts.md'), 'w') as f:
        f.write(f'# autocut\nraw speech span {raw:.1f}s -> {total:.1f}s ({len(video)} segments, {cpm:.1f} cuts/min before B-roll)\n\n')
        f.write('\n'.join(log) + '\n')
    print(f'{len(video)} segments, {raw:.1f}s -> {total:.1f}s, {cpm:.1f} cuts/min -> {a.out}')

if __name__ == '__main__':
    main()
