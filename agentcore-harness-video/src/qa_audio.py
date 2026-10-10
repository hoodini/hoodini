"""QA: transcribe the FINAL mix (VO over music+sfx) and compute word accuracy vs the script."""
import json, re, sys, difflib
from faster_whisper import WhisperModel
src = sys.argv[1] if len(sys.argv) > 1 else "build/mix_final.wav"
S = json.load(open("src/script.json")); ref = re.sub(r"\{([^=}]+)=([^}]+)\}", r"\1", " ".join(l["t"] for l in S["lines"]))
norm = lambda t: re.sub(r"[^a-z0-9 ]", "", t.lower()).split()
m = WhisperModel("small.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(src, language="en", beam_size=5, vad_filter=False)
hyp = " ".join(s.text for s in segs); open("qa/final_mix_transcript.txt", "w").write(hyp)
r, h = norm(ref), norm(hyp); sm = difflib.SequenceMatcher(None, r, h, autojunk=False)
match = sum(b.size for b in sm.get_matching_blocks()); print("word match", match, "/", len(r), round(100 * match / len(r), 1), "%")
print(hyp[:600])
