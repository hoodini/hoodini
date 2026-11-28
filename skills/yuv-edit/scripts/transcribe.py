#!/usr/bin/env python3
"""Word-level transcript: the clock of every edit.

usage: python3 transcribe.py input.mp4 out_dir [--lang he] [--engine auto|scribe|whisper] [--model large-v3]
writes: words.json  [{"w": word, "s": start, "e": end, "p": prob}]
        transcript.md  sentences with timestamps (what Claude reads to plan the edit)

engine auto = ElevenLabs Scribe if ELEVENLABS_API_KEY is set (best Hebrew), else local faster-whisper.
"""
import argparse, json, os, subprocess, sys, tempfile
from pathlib import Path

def extract_wav(src, dst):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(src), '-vn', '-ac', '1', '-ar', '16000', str(dst)], check=True)

def scribe(wav, lang):
    import urllib.request, uuid
    key = os.environ['ELEVENLABS_API_KEY']
    b = uuid.uuid4().hex
    fields = {'model_id': 'scribe_v1', 'timestamps_granularity': 'word', 'tag_audio_events': 'false'}
    if lang: fields['language_code'] = lang
    body = b''.join(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode() for k, v in fields.items())
    body += f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n'.encode()
    body += Path(wav).read_bytes() + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body, method='POST',
                                 headers={'xi-api-key': key, 'Content-Type': f'multipart/form-data; boundary={b}'})
    j = json.load(urllib.request.urlopen(req, timeout=900))
    return [{'w': x['text'].strip(), 's': x['start'], 'e': x['end'], 'p': 1.0} for x in j['words'] if x.get('type', 'word') == 'word' and x['text'].strip()]

def whisper(wav, lang, model):
    from faster_whisper import WhisperModel
    import numpy as np
    m = WhisperModel(model, device='auto', compute_type='auto')
    # hand faster-whisper a float32 array (decoded by ffmpeg) so it never touches PyAV, whose versions drift
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(wav), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'],
                         capture_output=True, check=True).stdout
    segs, _ = m.transcribe(np.frombuffer(pcm, np.float32), language=lang, word_timestamps=True, vad_filter=True,
                           condition_on_previous_text=False)
    return [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3), 'p': round(w.probability, 3)}
            for s in segs for w in (s.words or []) if w.word.strip()]

def sentences(words, gap=0.6):
    out, cur = [], []
    for w in words:
        if cur and (w['s'] - cur[-1]['e'] > gap or cur[-1]['w'][-1:] in '.?!'):
            out.append(cur); cur = []
        cur.append(w)
    if cur: out.append(cur)
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--lang', default='he'); ap.add_argument('--engine', default='auto')
    ap.add_argument('--model', default='large-v3')
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / 'a.wav'; extract_wav(a.src, wav)
        eng = a.engine
        if eng == 'auto': eng = 'scribe' if os.environ.get('ELEVENLABS_API_KEY') else 'whisper'
        words = scribe(wav, a.lang) if eng == 'scribe' else whisper(wav, a.lang, a.model)
    json.dump(words, open(out / 'words.json', 'w'), ensure_ascii=False, indent=0)
    with open(out / 'transcript.md', 'w') as f:
        for s in sentences(words):
            f.write(f"[{s[0]['s']:7.2f} – {s[-1]['e']:7.2f}] {' '.join(w['w'] for w in s)}\n")
    print(f'{len(words)} words via {eng} -> {out}/words.json, transcript.md')

if __name__ == '__main__':
    main()
