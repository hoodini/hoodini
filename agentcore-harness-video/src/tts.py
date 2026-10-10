"""Per-line Kokoro-82M TTS -> tts/<key>.wav + tts/vo.wav (24 kHz) + tts/lines.json (line offsets).
Script syntax: {spoken words=Display} lets spoken form differ from on-screen text."""
import json, re, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
ROOT = sys.path[0] + "/.."
S = json.load(open(f"{ROOT}/src/script.json"))
k = Kokoro(f"{ROOT}/assets/models/kokoro-v1.0.onnx", f"{ROOT}/assets/models/voices-v1.0.bin")
SR = 24000
def spoken(t):  return re.sub(r"\{([^=}]+)=([^}]+)\}", r"\1", t)
out, offs, cur = [np.zeros(int(S["preroll"] * SR), dtype=np.float32)], {}, S["preroll"]
for L in S["lines"]:
    a, sr = k.create(spoken(L["t"]), voice=S["voice"], speed=S["speed"], lang="en-us")
    assert sr == SR
    a = a.astype(np.float32)
    # trim leading/trailing near-silence so timing is tight
    m = np.abs(a) > 0.01
    i0, i1 = np.argmax(m), len(m) - np.argmax(m[::-1])
    a = a[max(0, i0 - 240):min(len(a), i1 + 480)]
    sf.write(f"{ROOT}/tts/{L['k']}.wav", a, SR)
    gap = L.get("gap", S["default_gap"])
    offs[L["k"]] = {"start": cur, "dur": len(a) / SR, "spoken": spoken(L["t"]), "text": L["t"]}
    out += [a, np.zeros(int(gap * SR), dtype=np.float32)]
    cur += len(a) / SR + gap
    print(L["k"], round(offs[L["k"]]["start"], 2), round(len(a) / SR, 2), flush=True)
vo = np.concatenate(out)
sf.write(f"{ROOT}/tts/vo.wav", vo, SR)
json.dump({"lines": offs, "total": len(vo) / SR}, open(f"{ROOT}/tts/lines.json", "w"), indent=1)
print("TOTAL", len(vo) / SR)
