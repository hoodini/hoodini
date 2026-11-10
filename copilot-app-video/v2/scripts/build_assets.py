# Bundle timeline + octicons + noise frames for the page
import json, glob, os, numpy as np
from PIL import Image
icons = {os.path.basename(f)[:-7]: open(f).read() for f in glob.glob('assets/logos/*.svg')}
tl = json.load(open('src/timeline.json'))
open('src/data.js','w').write('window.TL=%s;\nwindow.ICON=%s;\n' % (json.dumps(tl), json.dumps(icons)))
os.makedirs('assets/noise', exist_ok=True)
rng = np.random.default_rng(7)
for i in range(4):
    n = rng.normal(128, 40, (540, 960)).clip(0,255).astype('uint8')
    Image.fromarray(n, 'L').save(f'assets/noise/n{i}.png')
print('ok', list(icons))
