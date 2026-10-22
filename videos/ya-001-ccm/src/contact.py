"""Contact sheets from QA stills, plus the thumbnails and end-card still the page reuses.
Usage: python3 contact.py A"""
import json, sys, pathlib
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
fmt = sys.argv[1].upper()
qa = json.loads((ROOT / 'qa' / fmt / 'qa.json').read_text())
stills = [ROOT / r['still'] for r in qa['report']]
ims = [Image.open(p).convert('RGB') for p in stills]
w, h = ims[0].size
cols = 4 if fmt == 'A' else 5
tw = 640 if fmt == 'A' else 360
th = round(h * tw / w)
rows = -(-len(ims) // cols)
pad, lab = 16, 34
sheet = Image.new('RGB', (cols * (tw + pad) + pad, rows * (th + pad + lab) + pad), (11, 42, 91))
d = ImageDraw.Draw(sheet)
for i, (im, r) in enumerate(zip(ims, qa['report'])):
    x = pad + (i % cols) * (tw + pad)
    y = pad + (i // cols) * (th + pad + lab)
    sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y + lab))
    d.text((x, y + 8), f"{i + 1:02d} {r['key']}  t={r['t']}s", fill=(255, 255, 255))
out = ROOT / 'qa' / f'contact_{fmt}.png'
sheet.save(out)
print(out)

gen = ROOT / 'src' / 'gen'
by_key = {r['key']: ROOT / r['still'] for r in qa['report']}
for k, key in enumerate(['app', 'prompt', 'result']):
    im = Image.open(by_key[key]).convert('RGB')
    im.thumbnail((480, 480), Image.LANCZOS)
    im.save(gen / f'thumb{k}_{fmt}.png')
end = Image.open(by_key['end']).convert('RGB')
end.thumbnail((720, 1280), Image.LANCZOS)
end.save(gen / f'end_{fmt}.png')
