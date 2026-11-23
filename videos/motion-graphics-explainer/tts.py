"""Voiceover with Gemini 3.8 Flash TTS -> vo/NN.wav, vo.wav, timing.json, timing.js

  GEMINI_API_KEY=... python3 tts.py            # real voiceover
  python3 tts.py --estimate                    # no key: estimated timing only (for previews)
"""
import base64, json, os, sys, time, urllib.request, wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, 'script.json'), encoding='utf-8'))
MODEL = os.environ.get('TTS_MODEL', 'gemini-3.8-flash-tts')
VOICE = os.environ.get('VOICE', S['voice'])
SR = 24000
LEAD_IN, TAIL = 0.35, 1.6


def tts(text):
    body = {
        "model": MODEL,
        "input": [{"type": "user_input", "content": [{
            "type": "text", "text": text,
            "annotations": [{"type": "speech_metadata", "style": S['style']}]}]}],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": VOICE}]},
    }
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        data=json.dumps(body).encode(), method='POST',
        headers={"x-goog-api-key": os.environ['GEMINI_API_KEY'], "Content-Type": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                res = json.load(r)
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:400]
            if e.code in (429, 500, 503) and attempt < 3:
                time.sleep(2 ** (attempt + 1)); continue
            sys.exit(f"TTS HTTP {e.code}: {msg}")
    audio = [c for st in res.get('steps', []) if st.get('type') == 'model_output'
             for c in st.get('content', []) if c.get('type') == 'audio']
    if not audio:
        sys.exit(f"No audio in response: {json.dumps(res)[:400]}")
    return base64.b64decode(audio[-1]['data'])


def wav_to_np(raw):
    import io
    with wave.open(io.BytesIO(raw)) as w:
        assert w.getsampwidth() == 2
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        if w.getnchannels() == 2:
            x = x.reshape(-1, 2).mean(1)
        return x, w.getframerate()


def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a, b = max(idx[0] - int(0.03 * SR), 0), min(idx[-1] + int(0.08 * SR), len(x))
    return x[a:b]


estimate = '--estimate' in sys.argv or not os.environ.get('GEMINI_API_KEY')
os.makedirs(os.path.join(HERE, 'vo'), exist_ok=True)
t, timing, clips = LEAD_IN, [], []
for i, ln in enumerate(S['lines']):
    if estimate:
        d = max(1.8, len(ln['vo']) * 0.068)
    else:
        path = os.path.join(HERE, 'vo', f'{i:02d}.wav')
        if not os.path.exists(path):
            print(f'[{i+1}/{len(S["lines"])}] {ln["vo"][:40]}...')
            open(path, 'wb').write(tts(ln['vo']))
        x, sr = wav_to_np(open(path, 'rb').read())
        assert sr == SR, sr
        x = trim(x)
        clips.append((t, x))
        d = len(x) / SR
    timing.append({"i": i, "scene": ln['scene'], "start": round(t, 3), "end": round(t + d, 3), "he": ln['he'], "en": ln['en']})
    t += d + S['gap']
total = round(t - S['gap'] + TAIL, 2)
out = {"duration": total, "estimated": estimate, "lines": timing}
json.dump(out, open(os.path.join(HERE, 'timing.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
open(os.path.join(HERE, 'timing.js'), 'w', encoding='utf-8').write('window.TIMING = ' + json.dumps(out, ensure_ascii=False) + ';\n')
if clips:
    vo = np.zeros(int(total * SR))
    for st, x in clips:
        i = int(st * SR); vo[i:i + len(x)] += x[: len(vo) - i]
    vo /= max(np.abs(vo).max() / 0.9, 1e-9)
    with wave.open(os.path.join(HERE, 'vo.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((vo * 32767).astype(np.int16).tobytes())
print(f"{'ESTIMATED' if estimate else 'VO'} timing: {total}s, {len(timing)} lines")
