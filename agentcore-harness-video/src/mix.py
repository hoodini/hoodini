"""VO + music (sidechain-ducked under the VO) + cue-synced SFX -> build/mix.wav, then loudnorm to -14 LUFS / -1 dBTP -> build/audio_final.m4a"""
import json, subprocess, numpy as np, soundfile as sf
from scipy import signal
import sfx, music
SR = 48000
try: import imageio_ffmpeg; FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception: FF = "ffmpeg"
C = json.load(open("build/cues.json")); T = C["timing"]; END = T["END"]; total = int((END + .05) * SR)
# --- VO: 24k -> 48k, tonal shaping (HPF, presence, gentle compression) via ffmpeg
vo24, _ = sf.read("tts/vo.wav"); vo = signal.resample_poly(vo24, 2, 1); sf.write("build/vo48.wav", vo, SR)
subprocess.run([FF, "-y", "-loglevel", "error", "-i", "build/vo48.wav", "-af", "highpass=f=90,equalizer=f=3200:t=q:w=1.1:g=2.5,equalizer=f=250:t=q:w=1:g=-1.5,acompressor=threshold=-21dB:ratio=3.2:attack=6:release=90:makeup=4", "build/vo_proc.wav"], check=True)
vo, _ = sf.read("build/vo_proc.wav"); vo = np.pad(vo, (0, max(0, total - len(vo))))[:total]
# --- music + sidechain duck from VO envelope
mus = music.build(); mus = mus[:total] if len(mus) >= total else np.pad(mus, ((0, total - len(mus)), (0, 0)))
env = np.abs(signal.hilbert(vo)); a_, r_ = np.exp(-1 / (SR * .012)), np.exp(-1 / (SR * .28)); e = np.zeros_like(env); v = 0
for i in range(0, len(env), 1):                      # attack/release follower (decimated for speed below)
    break
step = 48; envd = env[::step]; ed = np.zeros_like(envd); v = 0.
ad, rd = np.exp(-step / (SR * .012)), np.exp(-step / (SR * .28))
for i, x in enumerate(envd): v = ad * v + (1 - ad) * x if x > v else rd * v + (1 - rd) * x; ed[i] = v
ed = ed / (np.percentile(ed, 95) + 1e-9); duck = 1 - .68 * np.clip(ed, 0, 1)
duck = np.interp(np.arange(total), np.arange(len(duck)) * step, duck)
drop_i = int(T["DROP"] * SR); duck[drop_i - int(.3 * SR): drop_i + int(1.2 * SR)] = np.maximum(duck[drop_i - int(.3 * SR): drop_i + int(1.2 * SR)], .8)   # let the drop breathe
mus = mus * duck[:, None] * 10 ** (-9.5 / 20)
# --- SFX bus, placed at cue times (stereo pan varies slightly per cue index for width)
sb = np.zeros((total, 2)); cache = {}
for k_, c in enumerate(C["cues"]):
    n = c["name"]
    if n == "riser": x = sfx.riser(T["DROP"] - c["t"] - .02)
    else:
        if n not in cache: cache[n] = sfx.LIB[n]()
        x = cache[n]
    g = 10 ** (sfx.GAIN_DB[n] / 20) * c.get("vol", 1); i = int(c["t"] * SR); m = min(len(x), total - i)
    if m <= 0: continue
    pan = np.sin(k_ * 1.7) * .35; sb[i:i + m, 0] += x[:m] * g * (1 - pan) ** .5; sb[i:i + m, 1] += x[:m] * g * (1 + pan) ** .5
mix = np.stack([vo, vo], 1) * 1.0 + mus + sb * 1.0
mix[int(END * SR):] = 0
sf.write("build/mix_raw.wav", mix, SR)
# --- loudnorm two-pass to -14 LUFS / -1 dBTP
af = "loudnorm=I=-14:TP=-1:LRA=9:print_format=json"
r = subprocess.run([FF, "-hide_banner", "-i", "build/mix_raw.wav", "-af", af, "-f", "null", "-"], capture_output=True, text=True)
js = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
af2 = f"loudnorm=I=-14:TP=-1:LRA=9:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true,alimiter=limit=0.89:level=false"
subprocess.run([FF, "-y", "-loglevel", "error", "-i", "build/mix_raw.wav", "-af", af2, "-ar", "48000", "-c:a", "pcm_s16le", "build/mix_final.wav"], check=True)
subprocess.run([FF, "-y", "-loglevel", "error", "-i", "build/mix_final.wav", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "build/audio_final.m4a"], check=True)
print("pre-norm", js["input_i"], js["input_tp"], "-> mix_final.wav / audio_final.m4a")
