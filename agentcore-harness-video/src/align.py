"""faster-whisper word timestamps per VO line, aligned onto the *script* tokens (so captions use the
script's spelling -> homophones like Claude/cloud, ex/X, 3AM, AgentCore can never be mis-transcribed).
Output: build/words.js  (window.WORDS = {lineKey: {start,end,sp:[{w,s,e}], disp:[{t,s,e}]}})"""
import json, re, sys, difflib
from faster_whisper import WhisperModel
ROOT = sys.path[0] + "/.."
L = json.load(open(f"{ROOT}/tts/lines.json"))["lines"]
model = WhisperModel("small.en", device="cpu", compute_type="int8")
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
out = {}
for key, v in L.items():
    segs, _ = model.transcribe(f"{ROOT}/tts/{key}.wav", word_timestamps=True, language="en", beam_size=5, initial_prompt=v["spoken"], condition_on_previous_text=False, vad_filter=False)
    ww = [(norm(w.word), w.start, w.end) for s in segs for w in s.words if norm(w.word)]
    # spoken tokens from script; groups {a b c=Disp}
    toks, disp, i = [], [], 0
    for m in re.finditer(r"\{([^=}]+)=([^}]+)\}|([^\s{]+)", v["text"]):
        if m.group(1):
            sp = m.group(1).split(); toks += sp; disp.append((m.group(2), i, i + len(sp) - 1)); i += len(sp)
        else:
            toks.append(m.group(3)); disp.append((m.group(3), i, i)); i += 1
    sn = [norm(t) for t in toks]
    wn = [w[0] for w in ww]
    times = [None] * len(sn)
    sm = difflib.SequenceMatcher(None, sn, wn, autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for j in range(n): times[a + j] = (ww[b + j][1], ww[b + j][2])
    # interpolate the rest between known neighbours (or line bounds)
    t0, t1 = (ww[0][1], ww[-1][2]) if ww else (0, v["dur"])
    for idx in range(len(times)):
        if times[idx] is None:
            l = idx - 1
            while l >= 0 and times[l] is None: l -= 1
            r = idx + 1
            while r < len(times) and times[r] is None: r += 1
            ls = times[l][1] if l >= 0 else t0
            rs = times[r][0] if r < len(times) else t1
            span = r - l
            times[idx] = (ls + (rs - ls) * (idx - l - 1) / (span - 1 if span > 1 else 1), ls + (rs - ls) * (idx - l) / (span - 1 if span > 1 else 1))
    # enforce monotonic times and a minimum word length (whisper can collapse very short words)
    for i in range(len(times)):
        a, b = times[i]
        if i and a < times[i-1][1] - 1e-3: a = times[i-1][1]
        if b - a < 0.11: b = a + 0.11
        times[i] = (a, b)
    o = v["start"]
    out[key] = {"start": o, "end": o + v["dur"],
                "sp": [{"w": norm(t), "s": round(o + s, 3), "e": round(o + e, 3)} for t, (s, e) in zip(toks, times)],
                "disp": [{"t": d, "s": round(o + times[a][0], 3), "e": round(o + times[b][1], 3)} for d, a, b in disp]}
    miss = sum(1 for a in range(len(sn)) if a not in [x for blk in sm.get_matching_blocks() for x in range(blk[0], blk[0]+blk[2])])
    print(key, "unmatched", miss, "/", len(sn), flush=True)
json.dump(out, open(f"{ROOT}/build/words.json", "w"), indent=1)
open(f"{ROOT}/build/words.js", "w").write("window.WORDS=" + json.dumps(out) + ";")
