// Load the page, report errors / shot count / cue count.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  p.on('console', m => console.log('LOG', m.text()));
  await p.goto('file://' + __dirname + '/page/index.html');
  await p.waitForFunction(() => window.READY === true, null, { timeout: 30000 }).catch(() => console.log('not ready'));
  console.log(await p.evaluate(() => ({ shots: SHOTS.length, cues: CUES.length, dur: DURATION,
    shortest: Math.min(...SHOTS.map(s => s.t1 - s.t0)).toFixed(2), times: SHOTS.map(s => s.t0.toFixed(2)).join(' ') })));
  await b.close();
})();
