import fs from 'fs';
import { launch, openPage, ROOT } from './common.mjs';
const b = await launch();
for (const fmt of ['h', 'v']) {
  const p = await openPage(b, fmt);
  const T = await p.evaluate(() => window.TIMING);
  fs.writeFileSync(`${ROOT}/build/timing-${fmt}.json`, JSON.stringify(T, null, 2));
  if (fmt === 'h') { console.log('duration', T.DURATION.toFixed(3), 'frames', T.FRAMES); T.CUTS.forEach(c => console.log(c.id, c.key, c.words, c.beats, c.hold.toFixed(2), c.start.toFixed(2))); console.log('cues', T.CUES.length); }
}
await b.close();
