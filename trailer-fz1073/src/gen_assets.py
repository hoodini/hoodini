"""Pre-render deterministic texture assets: soft cloud sprites (calm + storm) and 4 film-grain tiles."""
import numpy as np
from PIL import Image
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(1073)


def fbm(h, w, octaves=6, seed=0):
    r = np.random.default_rng(seed)
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        gh, gw = 3 * 2 ** o, int(3 * 2 ** o * w / h) + 1
        g = r.random((gh + 1, gw + 1)).astype(np.float32)
        img = Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += amp * (np.asarray(img, np.float32) / 255.0)
        tot += amp
        amp *= 0.5
    return acc / tot


def cloud(w, h, seed, puffs=7):
    r = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    shape = np.zeros((h, w), np.float32)
    for _ in range(puffs):
        cx, cy = r.uniform(0.2, 0.8) * w, r.uniform(0.45, 0.7) * h
        rx, ry = r.uniform(0.12, 0.28) * w, r.uniform(0.18, 0.32) * h
        d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
        shape = np.maximum(shape, np.clip(1 - d, 0, 1))
    n = fbm(h, w, seed=seed + 7)
    a = np.clip(shape * 1.6 - 0.35 + (n - 0.5) * 0.9, 0, 1) ** 1.3
    shade = np.clip(0.75 + 0.35 * (1 - yy / h) + (n - 0.5) * 0.3, 0, 1)
    return a, shade


def save_cloud(name, a, shade, top, bottom):
    top, bottom = np.array(top, np.float32), np.array(bottom, np.float32)
    rgb = bottom[None, None, :] * (1 - shade[..., None]) + top[None, None, :] * shade[..., None]
    rgba = np.dstack([rgb, a * 255]).clip(0, 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(OUT / name, optimize=True)


def hexrgb(h):
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


for i in range(3):
    a, s = cloud(900, 450, seed=100 + i)
    save_cloud(f"cloud_w{i}.png", a, s, hexrgb("FFFFFF"), hexrgb("8EC3F2"))       # cloud lit, sky in the shadow
    save_cloud(f"cloud_d{i}.png", a, s, hexrgb("FFFFFF"), hexrgb("FFE8EF"))       # dawn cloud
    a2, s2 = cloud(900, 450, seed=200 + i, puffs=9)
    save_cloud(f"cloud_s{i}.png", a2, s2, hexrgb("4A6285"), hexrgb("061A48"))     # storm, from muted + deep sky

for i in range(4):
    g = rng.normal(128, 40, (512, 512)).clip(0, 255).astype(np.uint8)
    Image.fromarray(g, "L").save(OUT / f"grain_{i}.png", optimize=True)
print("assets ok")
