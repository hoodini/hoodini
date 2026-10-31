#!/usr/bin/env python3
"""Suggest zoom keyframes for a screen recording: where the screen is changing (typing, a click, a panel
opening) and that change is concentrated, the camera should be there. Claude then cross-checks with the
transcript ("here I click ...") and keeps only the zooms that serve the explanation.

usage: python3 screen_zoom.py screen.mp4 [--start 0 --end N] [--min-hold 1.2] [--max-area 0.3]
prints JSON: {"zooms": [{"t", "rect":[x,y,w,h]} ...]}   (t relative to --start; rect normalized; a full-frame
              rect [0,0,1,1] means "zoom back out")
"""
import argparse, json, subprocess
import numpy as np
import cv2

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('--start', type=float, default=0); ap.add_argument('--end', type=float, default=None)
    ap.add_argument('--fps', type=float, default=5); ap.add_argument('--min-hold', type=float, default=1.2)
    ap.add_argument('--max-area', type=float, default=0.30); ap.add_argument('--aspect', type=float, default=16 / 9)
    a = ap.parse_args()
    W, H = 640, 360
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(a.start)] + (['-to', str(a.end)] if a.end else []) + \
          ['-i', a.src, '-vf', f'fps={a.fps},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W)
    boxes = []
    for i in range(1, len(fr)):
        d = cv2.absdiff(fr[i], fr[i - 1]); _, m = cv2.threshold(d, 18, 255, cv2.THRESH_BINARY)
        m = cv2.dilate(m, np.ones((9, 9), np.uint8))
        pts = cv2.findNonZero(m)
        if pts is None or len(pts) < 30: boxes.append(None); continue
        x, y, w, h = cv2.boundingRect(pts); boxes.append((x / W, y / H, w / W, h / H))
    # group consecutive activity into windows; a window is zoom-worthy when its union box is small
    zooms, i, n = [], 0, len(boxes)
    while i < n:
        if boxes[i] is None: i += 1; continue
        j, ux0, uy0, ux1, uy1 = i, 1, 1, 0, 0
        while j < n and (boxes[j] is not None or (j + 1 < n and boxes[j + 1] is not None)):
            if boxes[j]: x, y, w, h = boxes[j]; ux0, uy0, ux1, uy1 = min(ux0, x), min(uy0, y), max(ux1, x + w), max(uy1, y + h)
            j += 1
        dur = (j - i) / a.fps
        area = (ux1 - ux0) * (uy1 - uy0)
        if dur >= 0.4 and 0 < area <= a.max_area:
            # pad and fit to the output aspect, min 32% width so text stays sharp
            cx, cy = (ux0 + ux1) / 2, (uy0 + uy1) / 2
            w = max((ux1 - ux0) * 1.5, 0.32); h = w / a.aspect * (16 / 9)
            if h < (uy1 - uy0) * 1.5: h = (uy1 - uy0) * 1.5; w = h * a.aspect * (9 / 16)
            w, h = min(w, 1), min(h, 1)
            x, y = min(max(cx - w / 2, 0), 1 - w), min(max(cy - h / 2, 0), 1 - h)
            t = max(0, i / a.fps - 0.35)  # arrive just before the action
            zooms.append({'t': round(t, 2), 'rect': [round(x, 3), round(y, 3), round(w, 3), round(h, 3)]})
            zooms.append({'t': round(max(t + a.min_hold, j / a.fps + 0.5), 2), 'rect': [0, 0, 1, 1]})
        i = j + 1
    # drop zoom-outs that are immediately followed by another zoom-in (stay in, move across instead)
    clean = []
    for z in zooms:
        if clean and clean[-1]['rect'] == [0, 0, 1, 1] and z['rect'] != [0, 0, 1, 1] and z['t'] - clean[-1]['t'] < 1.0:
            clean.pop()
        clean.append(z)
    print(json.dumps({'zooms': clean}))

if __name__ == '__main__':
    main()
