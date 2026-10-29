#!/usr/bin/env python3
"""yuv-edit compositor: edl.json -> picture (video-only MP4) + dialogue.wav.

Every output frame is a pure function of its time t, computed from the EDL:
  1. base   = the primary clip under t (A-roll / screen / image) with its treatment
              (punch-in zoom, face anchor, shake, whip)
  2. cover  = a B-roll / screen / screenshot item covering t (picture only; dialogue continues)
  3. gfx    = rendered PNG sequences (render_gfx.mjs) placed over or BEHIND the subject
  4. captions = karaoke caption stills
See references/edl-schema.md for the format.

usage: python3 compose.py edl.json out_dir [--preview] [--from S --to E]
"""
import argparse, json, math, os, subprocess, sys
from pathlib import Path
import numpy as np
import cv2

# ---------------------------------------------------------------- helpers
def spring(t, w=18.0, z=1.0):
    if t <= 0: return 0.0
    if z >= 1: return 1 - math.exp(-w * t) * (1 + w * t)
    wd = w * math.sqrt(1 - z * z)
    return 1 - math.exp(-z * w * t) * (math.cos(wd * t) + (z * w / wd) * math.sin(wd * t))

def ease_in_out(x):
    x = min(1.0, max(0.0, x))
    return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2

def lerp(a, b, k): return a + (b - a) * k

def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=width,height,r_frame_rate:format=duration', '-of', 'json', str(path)],
                         capture_output=True, text=True, check=True).stdout
    j = json.loads(out); s = j['streams'][0]
    num, den = s['r_frame_rate'].split('/')
    return dict(w=int(s['width']), h=int(s['height']), fps=float(num) / float(den),
                dur=float(j.get('format', {}).get('duration', 0) or 0))

IMG_EXT = {'.png', '.jpg', '.jpeg', '.webp'}

class Reader:
    """Sequential frame reader for one source range, at the output fps, scaled to COVER (W,H)*overscan."""
    def __init__(self, path, start, fps, W, H, speed=1.0, overscan=1.0, skip=0):
        self.path, self.W, self.H = str(path), W, H
        self.is_img = Path(path).suffix.lower() in IMG_EXT
        if self.is_img:
            im = cv2.imread(self.path, cv2.IMREAD_COLOR)
            self.frame = im; self.proc = None; return
        p = probe(path)
        sw, sh = p['w'], p['h']
        s = max(W / sw, H / sh) * overscan
        self.fw, self.fh = int(round(sw * s / 2) * 2), int(round(sh * s / 2) * 2)
        # always seek to the clip origin and drop `skip` frames AFTER the fps filter, so a slice that starts
        # mid-clip lands on exactly the same frame grid as a full render (no one-frame pops at slice joins)
        trim = f",trim=start_frame={skip},setpts=PTS-STARTPTS" if skip else ''
        vf = f"setpts=PTS/{speed},fps={fps}{trim},scale={self.fw}:{self.fh}:flags=lanczos"
        self.proc = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{start:.4f}', '-i', self.path, '-an',
                                      '-vf', vf, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'],
                                     stdout=subprocess.PIPE, bufsize=10 ** 8)
        self.last = None
    def read(self):
        if self.is_img: return self.frame
        n = self.fw * self.fh * 3
        buf = self.proc.stdout.read(n)
        if len(buf) < n:  # past the end: hold the last frame (never a black flash)
            return self.last if self.last is not None else np.zeros((self.fh, self.fw, 3), np.uint8)
        self.last = np.frombuffer(bytearray(buf), np.uint8).reshape(self.fh, self.fw, 3)
        return self.last
    def close(self):
        if self.proc: self.proc.kill()

def cover_crop(img, W, H, ax=0.5, ay=0.5):
    """Scale img to cover WxH and crop around the anchor (normalized)."""
    h, w = img.shape[:2]
    s = max(W / w, H / h)
    if abs(s - 1) > 1e-3: img = cv2.resize(img, (int(math.ceil(w * s)), int(math.ceil(h * s))), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_LANCZOS4)
    h, w = img.shape[:2]
    x0 = int(min(max(ax * w - W / 2, 0), w - W)); y0 = int(min(max(ay * h - H / 2, 0), h - H))
    return img[y0:y0 + H, x0:x0 + W]

def zoom_about(img, s, ax, ay, dx=0.0, dy=0.0):
    """Scale about (ax,ay) in output pixels; subpixel-smooth (no stepping in slow pushes)."""
    H, W = img.shape[:2]
    M = np.float32([[s, 0, ax * (1 - s) + dx], [0, s, ay * (1 - s) + dy]])
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

def over(dst, rgba, x=0, y=0, opacity=1.0):
    """Alpha-composite rgba (H,W,4 BGRA) onto dst at (x,y)."""
    H, W = dst.shape[:2]; h, w = rgba.shape[:2]
    x0, y0, x1, y1 = max(x, 0), max(y, 0), min(x + w, W), min(y + h, H)
    if x1 <= x0 or y1 <= y0: return dst
    src = rgba[y0 - y:y1 - y, x0 - x:x1 - x]
    if src.shape[2] == 3:  # opaque (e.g. a full-frame end card)
        dst[y0:y1, x0:x1] = src if opacity >= 1 else (src * opacity + dst[y0:y1, x0:x1] * (1 - opacity)).astype(np.uint8)
        return dst
    a = src[..., 3].astype(np.float32) * (opacity / 255.0)
    dst[y0:y1, x0:x1] = cv2.blendLinear(np.ascontiguousarray(src[..., :3]), dst[y0:y1, x0:x1], a, 1.0 - a)
    return dst

# ---------------------------------------------------------------- brand stage
_SKY = {}
def night_sky(W, H, side='right', seed=7):
    if (W, H, side, seed) not in _SKY: _SKY[(W, H, side, seed)] = _night_sky(W, H, side, seed)
    return _SKY[(W, H, side, seed)].copy()

def _night_sky(W, H, side='right', seed=7):
    """Phoenix Ink night stage (yuv-design-system §1): indigo base + pink/violet/orange glows + stars."""
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    top, bot = np.array([0x22, 0x09, 0x0A], np.float32), np.array([0x3C, 0x13, 0x15], np.float32)  # BGR
    img = np.broadcast_to(top + (bot - top) * y[..., None], (H, W, 3)).copy()
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    sx = W * (0.8 if side == 'right' else 0.2)
    for (cx, cy, bgr, a, r) in [(sx, H * .45, (160, 46, 255), .17, .55), (sx, H * .05, (255, 108, 139), .16, .5), (W * .5, H * 1.05, (58, 143, 255), .20, .6)]:
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / (max(W, H) * r)
        k = (np.clip(1 - d, 0, 1) ** 2 * a)[..., None]
        img = img * (1 - k) + np.array(bgr, np.float32) * k
    rng = np.random.default_rng(seed)
    for _ in range(int(W * H / 13000)):
        px, py = rng.integers(0, W), rng.integers(0, H)
        img[py:py + 2, px:px + 2] = img[py:py + 2, px:px + 2] * .45 + 255 * .55
    return img.astype(np.uint8)

def rounded_mask(w, h, r):
    m = np.zeros((h, w), np.uint8)
    r = int(min(r, w // 2, h // 2))
    cv2.rectangle(m, (r, 0), (w - r, h), 255, -1); cv2.rectangle(m, (0, r), (w, h - r), 255, -1)
    for cx, cy in [(r, r), (w - r - 1, r), (r, h - r - 1), (w - r - 1, h - r - 1)]:
        cv2.circle(m, (cx, cy), r, 255, -1, lineType=cv2.LINE_AA)
    return m

def panel_rgba(img, r, shadow=True):
    """Image -> BGRA with rounded corners (radius r)."""
    h, w = img.shape[:2]
    return np.dstack([img, rounded_mask(w, h, r)])

def drop_shadow(dst, x, y, w, h, r, blur=60, offset=26, strength=0.55):
    """Soft night-tinted shadow under a card; computed at 1/4 resolution (it is a blur anyway)."""
    H, W = dst.shape[:2]; q = 4
    m = np.zeros((H // q, W // q), np.float32)
    cv2.rectangle(m, (int((x + r / 2) / q), int((y + offset) / q)), (int((x + w - r / 2) / q), int((y + h + offset) / q)), 1.0, -1)
    m = cv2.GaussianBlur(m, (0, 0), blur / 2 / q) * strength
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)[..., None]
    shade = np.array([20, 4, 5], np.float32)  # deep night tint (BGR of #050414)
    dst[:] = (dst * (1 - m) + shade * m).astype(np.uint8)

# ---------------------------------------------------------------- treatments
_FACE = []
def face_anchor(frame):
    """Where the eyes are, so punch-ins and 9:16 crops keep the face. Haar cascade (OpenCV 4.x);
    returns None when unavailable (OpenCV 5 dropped it) -> the caller uses a safe default anchor."""
    if not _FACE:
        try: _FACE.append(cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'))
        except Exception: _FACE.append(None)
    if _FACE[0] is None: return None
    g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    s = 480 / g.shape[1]; small = cv2.resize(g, None, fx=s, fy=s)
    faces = _FACE[0].detectMultiScale(small, 1.1, 5, minSize=(30, 30))
    if len(faces) == 0: return None
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    return ((x + w / 2) / s / g.shape[1], (y + h * 0.45) / s / g.shape[0])

def zoom_value(z, lt, dur):
    """z: number (constant punch) | {from,to,ease:'smooth'|'spring'|'linear', start?, len?}"""
    if z is None: return 1.0
    if isinstance(z, (int, float)): return float(z)
    a, b = z.get('from', 1.0), z.get('to', 1.0)
    st, ln = z.get('start', 0.0), z.get('len', dur)
    k = (lt - st) / max(ln, 1e-3)
    e = z.get('ease', 'smooth')
    if e == 'spring': k = spring(lt - st, z.get('w', 14), z.get('z', 0.6))
    elif e == 'linear': k = min(1, max(0, k))
    else: k = ease_in_out(k)
    return math.exp(lerp(math.log(a), math.log(b), k))  # zoom in log space

def shake(seed, t, amp):
    if not amp: return 0.0, 0.0
    f = lambda o: sum(math.sin(t * w + seed * 1.7 + o * p) / (i + 1) for i, (w, p) in enumerate([(13, 1.3), (29, 2.1), (47, .7)]))
    return amp * f(0), amp * f(5)

class ScreenTreatment:
    """Screen recording / screenshot on the night stage: rounded panel, deep shadow, and a camera that
    springs between zoom targets. zooms: [{t, rect:[x,y,w,h] (0..1 of the source), hold?}]"""
    def __init__(self, W, H, spec):
        self.W, self.H, self.spec = W, H, spec
        self.bg = night_sky(W, H, spec.get('side', 'right'))
        self.margin = spec.get('margin', 0.085)
        self.zooms = sorted(spec.get('zooms', []), key=lambda z: z['t'])
    def target(self, lt):
        # camera rect in panel-normalized coords; eased transition 0.55s into each keyframe
        cur = [0, 0, 1, 1]
        prev = cur
        for z in self.zooms:
            if lt >= z['t']:
                prev, cur = cur, z['rect']
                k = ease_in_out((lt - z['t']) / z.get('ease', 0.55))
                cur = [lerp(p, c, k) for p, c in zip(prev, cur)]
        return cur
    def render(self, frame, lt):
        W, H = self.W, self.H
        fh, fw = frame.shape[:2]
        pw = int(W * (1 - 2 * self.margin)); ph = int(pw * fh / fw)
        if ph > H * (1 - 2 * self.margin): ph = int(H * (1 - 2 * self.margin)); pw = int(ph * fw / fh)
        px, py = (W - pw) // 2, (H - ph) // 2
        r = int(40 * min(W, H) / 1080)
        if getattr(self, '_stage_key', None) != (pw, ph):
            self._stage = self.bg.copy(); drop_shadow(self._stage, px, py, pw, ph, r); self._stage_key = (pw, ph)
        canvas = self._stage.copy()
        over(canvas, panel_rgba(cv2.resize(frame, (pw, ph), interpolation=cv2.INTER_AREA), r), px, py)
        rx, ry, rw, rh = self.target(lt)
        if (rw, rh) == (1, 1) and (rx, ry) == (0, 0): return canvas
        # map the target rect (in panel coords) to fill ~88% of the frame
        tx, ty, tw, th = px + rx * pw, py + ry * ph, rw * pw, rh * ph
        s = min(W * .88 / tw, H * .88 / th, self.spec.get('max_zoom', 3.0))
        s = max(1.0, s)
        cx, cy = tx + tw / 2, ty + th / 2
        M = np.float32([[s, 0, W / 2 - s * cx], [0, s, H / 2 - s * cy]])
        return cv2.warpAffine(canvas, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

_BLUR = {}
def card3d(img, W, H, lt, dur, spec, bg):
    """Apple-style 2.5D: the screenshot is a rounded card in 3D space; the camera pushes on Z while the card
    turns a few degrees; the backdrop is the same image, blurred (depth of field) and darkened, or the night sky."""
    k = ease_in_out(lt / max(dur, 1e-3))
    ry = math.radians(lerp(spec.get('rot_y', [-14, 6])[0], spec.get('rot_y', [-14, 6])[1], k))
    rx = math.radians(lerp(spec.get('rot_x', [8, 2])[0], spec.get('rot_x', [8, 2])[1], k))
    z = lerp(spec.get('z', [2.6, 1.9])[0], spec.get('z', [2.6, 1.9])[1], k)  # camera distance in card-widths
    h, w = img.shape[:2]
    r = int(36 * w / 1920 * 2)
    src = panel_rgba(img, r)
    aspect = h / w
    pts3 = np.array([[-.5, -.5 * aspect, 0], [.5, -.5 * aspect, 0], [.5, .5 * aspect, 0], [-.5, .5 * aspect, 0]], np.float32)
    Ry = np.array([[math.cos(ry), 0, math.sin(ry)], [0, 1, 0], [-math.sin(ry), 0, math.cos(ry)]])
    Rx = np.array([[1, 0, 0], [0, math.cos(rx), -math.sin(rx)], [0, math.sin(rx), math.cos(rx)]])
    p = pts3 @ (Rx @ Ry).T
    f = W * (1.1 if W >= H else 1.75)  # focal length in px (portrait: the card should fill the width)
    proj = np.array([[W / 2 + f * x / (z + zz), H / 2 + f * y / (z + zz)] for x, y, zz in p], np.float32)
    srcq = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    M = cv2.getPerspectiveTransform(srcq, proj)
    warped = cv2.warpPerspective(src, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
    if bg == 'blur':
        ck = (id(img), W, H)
        if ck not in _BLUR:
            b_ = cv2.GaussianBlur(cv2.resize(cover_crop(img, W, H), (W // 4, H // 4)), (0, 0), 10)
            b_ = cv2.resize(b_, (W, H), interpolation=cv2.INTER_LINEAR)
            _BLUR.clear(); _BLUR[ck] = (b_.astype(np.float32) * 0.45 + np.array([42, 13, 14], np.float32) * 0.55).astype(np.uint8)
        back = _BLUR[ck].copy()
    else:
        back = night_sky(W, H)
    x0, y0 = int(proj[:, 0].min()), int(proj[:, 1].min())
    drop_shadow(back, x0, y0, int(proj[:, 0].max() - x0), int(proj[:, 1].max() - y0), r, blur=90, offset=40, strength=.6)
    # sheen: a soft diagonal highlight sweeping across once (sells the glass)
    if spec.get('sheen', True):
        a = warped[..., 3].astype(np.float32) / 255
        xx = np.linspace(0, 1, W, dtype=np.float32)[None, :]
        band = np.exp(-((xx - lerp(-.3, 1.3, k)) / .08) ** 2) * .18 * a
        warped[..., :3] = np.clip(warped[..., :3] + 255 * band[..., None], 0, 255).astype(np.uint8)
    return over(back, warped)

def parallax(img, depth, W, H, lt, dur, spec):
    """2.5D photo parallax from a depth map (white = near). Layers move/scale by depth as the camera dollies."""
    k = ease_in_out(lt / max(dur, 1e-3))
    base = cover_crop(img, int(W * 1.15), int(H * 1.15))
    d = cv2.resize(depth, (base.shape[1], base.shape[0])).astype(np.float32) / 255
    push, pan = spec.get('push', 0.08), spec.get('pan', [0.03, 0.0])
    # per-pixel displacement field: near pixels move more (inverse warp)
    hh, ww = d.shape
    yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
    s = 1 + push * k * (0.3 + d)
    cx, cy = ww / 2, hh / 2
    mx = cx + (xx - cx) / s - pan[0] * k * ww * d
    my = cy + (yy - cy) / s - pan[1] * k * hh * d
    out = cv2.remap(base, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    return cover_crop(out, W, H)

# ---------------------------------------------------------------- matte (text behind subject)
class Matter:
    def __init__(self):
        self.sess = None
    def __call__(self, frame):
        if self.sess is None:
            try:
                from rembg import new_session, remove  # pip install rembg onnxruntime
                self.sess, self.remove = new_session('u2net_human_seg'), remove
            except Exception as e:
                sys.exit(f'text-behind-subject needs rembg (pip install rembg onnxruntime): {e}')
        small = cv2.resize(frame, (frame.shape[1] // 2, frame.shape[0] // 2))
        m = self.remove(small, session=self.sess, only_mask=True)
        m = np.array(m) if not isinstance(m, np.ndarray) else m
        if m.ndim == 3: m = m[..., 0]
        m = cv2.resize(m, (frame.shape[1], frame.shape[0]), interpolation=cv2.INTER_LINEAR)
        return cv2.GaussianBlur(m, (0, 0), 1.2)

# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('edl'); ap.add_argument('out')
    ap.add_argument('--preview', action='store_true', help='half resolution, fast')
    ap.add_argument('--from', dest='t0', type=float, default=0); ap.add_argument('--to', dest='t1', type=float, default=None)
    ap.add_argument('--jobs', type=int, default=max(1, (os.cpu_count() or 2) // 2), help='parallel time slices')
    ap.add_argument('--part', type=int, default=None, help=argparse.SUPPRESS)
    a = ap.parse_args()
    edl = json.load(open(a.edl)); root = Path(a.edl).resolve().parent
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    W, H, fps = edl.get('width', 1920), edl.get('height', 1080), edl.get('fps', 30)
    if a.preview: W, H = W // 2, H // 2
    src = {k: str((root / v).resolve()) for k, v in edl['sources'].items()}
    gfx_dir = (root / edl.get('gfx_dir', 'gfx')).resolve()

    # timeline of primary clips
    prim, t = [], 0.0
    for i, c in enumerate(edl['video']):
        d = c.get('dur') or (c['out'] - c['in']) / c.get('speed', 1.0)
        prim.append(dict(c, _t0=t, _dur=d, _i=i)); t += d
    total = t
    t1 = min(a.t1 or total, total)
    n0, n1 = int(round(a.t0 * fps)), int(round(t1 * fps))
    pic_name = 'picture_preview.mp4' if a.preview else 'picture.mp4'
    if a.part is None and a.jobs > 1 and (n1 - n0) > fps * 8:
        # split into frame-exact slices, render in parallel, concat losslessly (each slice starts on an IDR)
        k = a.jobs; edges = [n0 + (n1 - n0) * i // k for i in range(k + 1)]
        procs = [subprocess.Popen([sys.executable, __file__, a.edl, a.out, '--part', str(i), '--from', f'{edges[i] / fps:.6f}',
                                   '--to', f'{edges[i + 1] / fps:.6f}', '--jobs', '1'] + (['--preview'] if a.preview else []))
                 for i in range(k)]
        if any(p.wait() for p in procs): sys.exit('a slice failed')
        lst = out / 'parts.txt'; lst.write_text(''.join(f"file 'picture_part{i}.mp4'\n" for i in range(k)))
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(out / pic_name)], check=True)
        for i in range(k): (out / f'picture_part{i}.mp4').unlink()
        lst.unlink()
        n0 = n1  # picture done; fall through to the dialogue track
    if a.part is not None: pic_name = f'picture_part{a.part}.mp4'
    covers = sorted(edl.get('covers', []), key=lambda c: c['at'])
    gfx = edl.get('gfx', [])
    caps = edl.get('captions', {}).get('chunks', [])

    enc = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(fps),
                            '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast' if a.preview else 'slow', '-crf', '23' if a.preview else '15',
                            '-pix_fmt', 'yuv420p', str(out / pic_name)], stdin=subprocess.PIPE) if n1 > n0 else None
    readers, anchors, screen_tx, gfx_cache = {}, {}, {}, {}
    matter = Matter()
    face_ok = {}

    def get_reader(key, path, start, speed, overscan=1.0, lt=0.0):
        if key not in readers:
            readers[key] = Reader(path, start, fps, W, H, speed, overscan, skip=int(round(lt * fps)))
        return readers[key]

    def drop_readers(keep):
        for k in list(readers):
            if k not in keep: readers[k].close(); del readers[k]

    def load_png(path):
        if path not in gfx_cache:
            im = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)  # gfx must be rendered at this size (prep_gfx --preview)
            x0 = y0 = 0
            if im is not None and im.ndim == 3 and im.shape[2] == 4:  # crop to the visible pixels: 5-20x faster blends
                nz = cv2.findNonZero((im[..., 3] > 0).astype(np.uint8))
                if nz is None: im = None
                else:
                    x0, y0, w_, h_ = cv2.boundingRect(nz); im = im[y0:y0 + h_, x0:x0 + w_]
            if len(gfx_cache) > 400: gfx_cache.clear()
            gfx_cache[path] = (im, x0, y0)
        return gfx_cache[path]

    def render_item(c, key, lt, dur):
        """Render a primary clip or a cover item at local time lt."""
        kind = c.get('kind', 'video')
        path = src[c['src']]
        if kind == 'card3d':
            img = cv2.imread(path); return card3d(img, W, H, lt, dur, c, c.get('bg', 'blur'))
        if kind == 'parallax':
            img = cv2.imread(path); dep = cv2.imread(str((root / c['depth']).resolve()), cv2.IMREAD_GRAYSCALE)
            return parallax(img, dep, W, H, lt, dur, c)
        if kind == 'screen':
            if key not in screen_tx: screen_tx[key] = ScreenTreatment(W, H, c)
            r = get_reader(key, path, c.get('in', 0), c.get('speed', 1.0), overscan=1.0, lt=lt)
            return screen_tx[key].render(r.read(), lt)
        # plain video / image with optional zoom (punch-in, push), face anchor and shake
        r = get_reader(key, path, c.get('in', 0), c.get('speed', 1.0), lt=lt)  # opened at first use: slices start mid-clip
        fr = r.read()
        if key not in anchors:
            anc = c.get('anchor', 'face' if c.get('role') == 'aroll' else [0.5, 0.5])
            if anc == 'face':
                fa = face_anchor(fr); anc = list(fa) if fa else [0.5, 0.42]
            anchors[key] = anc
        ax, ay = anchors[key]
        base = cover_crop(fr, W, H, ax, ay)
        z = zoom_value(c.get('zoom'), lt, dur)
        dx, dy = shake(c.get('_i', 0), lt, c.get('shake', 0) * W / 1920)
        if abs(z - 1) > 1e-4 or dx or dy:
            # zoom about the subject's face position on screen so punch-ins keep the eyes in place
            fh, fw = fr.shape[:2]
            sx = (ax * fw - max(0, min(ax * fw - W / 2, fw - W))) if fw > W else ax * W
            sy = (ay * fh - max(0, min(ay * fh - H / 2, fh - H))) if fh > H else ay * H
            base = zoom_about(base, z, sx, sy, dx, dy)
        return base

    pi = 0
    for n in range(n0, n1):
        t = n / fps
        while pi < len(prim) - 1 and t >= prim[pi]['_t0'] + prim[pi]['_dur']: pi += 1
        c = prim[pi]; lt = t - c['_t0']
        live = {('p', c['_i'])}
        frame = np.ascontiguousarray(render_item(c, ('p', c['_i']), lt, c['_dur']))
        # whip transition into this clip (or out of the previous): directional blur across the cut
        wh = c.get('transition') == 'whip' and lt < 0.12
        if wh:
            k = 1 - lt / 0.12; L = int(2 + 80 * k * W / 1920)
            frame = cv2.filter2D(frame, -1, np.ones((1, L), np.float32) / L)
        # covers
        for ci, cv_ in enumerate(covers):
            if cv_['at'] <= t < cv_['at'] + cv_['dur']:
                key = ('c', ci); live.add(key)
                clt = t - cv_['at']
                f2 = render_item(dict(cv_, _i=1000 + ci), key, clt, cv_['dur'])
                # optional entrance: punch from 1.06 (a small "settle") — shape change, not a fade
                frame = np.ascontiguousarray(f2)
        drop_readers(live)
        # gfx
        behind = [g for g in gfx if g['at'] <= t < g['at'] + g['dur'] and g.get('behind_subject')]
        if behind:
            matte = matter(frame)
            subj = np.dstack([frame, matte])
        for g in sorted([g for g in gfx if g['at'] <= t < g['at'] + g['dur']], key=lambda g: g.get('z', 0)):
            f = int((t - g['at']) * fps)
            png = gfx_dir / g['id'] / f'{f:05d}.png'
            im, gx, gy = load_png(png) if png.exists() else (None, 0, 0)
            if im is None: continue
            over(frame, im, gx, gy)
            if g.get('behind_subject'): over(frame, subj)
        # captions (karaoke stills, springing in at each chunk start)
        for ch in caps:
            if ch['s'] <= t < ch['e']:
                ai = max([i for i, ws in enumerate(ch['ws']) if ws <= t] or [0])
                im = load_png(gfx_dir / 'captions' / f"{ch['id']}_{ai}.png")[0]
                if im is None: break
                k = spring(t - ch['s'], 26, 0.5); sc = 0.78 + 0.22 * k
                ih, iw = im.shape[:2]
                if abs(sc - 1) > 1e-3:
                    im = cv2.resize(im, (int(iw * sc), int(ih * sc)), interpolation=cv2.INTER_LINEAR)
                cy = int(edl['captions'].get('y', 0.80) * H)
                over(frame, im, (W - im.shape[1]) // 2, cy - im.shape[0] // 2)
                break
        enc.stdin.write(frame.tobytes())
        if n % (fps * 5) == 0: print(f'  {t:7.2f}s / {t1:.2f}s', flush=True)
    if enc: enc.stdin.close(); enc.wait()
    for r in readers.values(): r.close()
    if a.part is not None: return

    # dialogue track: the primary clips' audio, each cut with 8ms fades (no clicks)
    parts, filt = [], []
    for i, c in enumerate(prim):
        if c.get('audio', 'keep' if c.get('role') == 'aroll' else 'mute') == 'mute' or Path(src[c['src']]).suffix.lower() in IMG_EXT:
            filt.append(f"anullsrc=r=48000:cl=stereo,atrim=0:{c['_dur']:.4f}[a{i}]")
        else:
            parts += ['-i', src[c['src']]]
            j = len(parts) // 2 - 1
            g = c.get('gain_db', 0); sp = c.get('speed', 1.0)
            tempo = f",atempo={sp}" if abs(sp - 1) > 1e-3 else ''
            filt.append(f"[{j}:a]atrim={c['in']:.4f}:{c['out']:.4f},asetpts=PTS-STARTPTS{tempo},aresample=48000,aformat=channel_layouts=stereo,"
                        f"volume={g}dB,afade=t=in:d=0.008,afade=t=out:st={max(0, c['_dur'] - 0.008):.4f}:d=0.008[a{i}]")
    filt.append(''.join(f'[a{i}]' for i in range(len(prim))) + f'concat=n={len(prim)}:v=0:a=1[out]')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *parts, '-filter_complex', ';'.join(filt), '-map', '[out]', str(out / 'dialogue.wav')], check=True)
    json.dump({'duration': total, 'fps': fps, 'w': W, 'h': H}, open(out / 'timeline.json', 'w'))
    print(f'picture + dialogue.wav -> {out}  ({total:.2f}s)')

if __name__ == '__main__':
    main()
