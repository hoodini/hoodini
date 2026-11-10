# Build index.html (single-scope inline script, HyperFrames-safe) from src/template.html
import json, glob, os, re
icons = {os.path.basename(f)[:-7]: open(f).read() for f in glob.glob('../assets/logos/*.svg')}
tl = json.load(open('src/timeline.json'))
data = 'window.TL=%s;\nwindow.ICON=%s;\n' % (json.dumps(tl), json.dumps(icons))
open('src/data.js','w').write(data)
s = open('src/template.html').read()
s = s.replace('<script src="src/data.js"></script>\n','').replace('<script src="src/kit.js"></script>\n','')
scripts = re.findall(r'<script>(.*?)</script>', s, flags=re.S)
assert len(scripts) == 2, len(scripts)
bundle = '\n'.join([data, open('src/kit.js').read(), scripts[0], open('src/shots.js').read(), scripts[1]])
s = re.sub(r'<script>.*?</script>\s*<script src="src/shots.js"></script>\s*<script>.*?</script>', lambda m: '<script>\n' + bundle + '\n</script>', s, flags=re.S)
s = re.sub(r'data-duration="[^"]*"', f'data-duration="{tl["total"]}"', s)
open('index.html','w').write(s); print('built index.html', len(s)//1024, 'KB; dur', tl['total'])
