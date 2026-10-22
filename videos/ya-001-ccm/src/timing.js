// Shot timing for YA-001 · CCM. Shared by the page (browser) and the Node/Python tooling.
// Classic Flight: hold = max(1.6 s, words × 0.33 s + 0.6 s), clamped to the shot's min/max,
// then rounded UP to whole beats (rounded down only when that would exceed a shot's max).
(function (root) {
  function countWords(text) {
    return text.replace(/\|/g, ' ').split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
  }

  function build(data, fmt) {
    const beat = 60 / data.bpm;
    const fps = data.fps;
    const shots = data.shots.filter((s) => s.fmts.includes(fmt));
    const wptTotal = shots.filter((s) => s.wpt).length;
    let beatCursor = 0;
    let wptN = 0;
    const out = shots.map((s, i) => {
      const words = countWords(s.text);
      const formula = Math.max(1.6, words * 0.33 + 0.6, s.min || 0);
      let beats = Math.ceil(formula / beat - 1e-9);
      if (s.max && beats * beat > s.max + 1e-9) beats -= 1;
      if (i > 0) beatCursor += data.transitionBeats;
      const startBeat = beatCursor;
      beatCursor += beats;
      if (s.wpt) wptN += 1;
      const [l1, l2] = s.text.split('|');
      return {
        ...s, index: i, words, formula, beats, l1, l2: l2 || '',
        hold: beats * beat, startBeat, start: startBeat * beat, end: beatCursor * beat,
        wptN: s.wpt ? wptN : null, wptCurrent: wptN,
      };
    });
    const totalBeats = beatCursor;
    const duration = totalBeats * beat;
    return {
      fmt, beat, fps, shots: out, wptTotal, totalBeats, duration,
      frames: Math.round(duration * fps),
      holdBeats: out.reduce((a, s) => a + s.beats, 0),
      transitions: out.length - 1,
    };
  }

  const api = { countWords, build };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.YATiming = api;
})(this);
