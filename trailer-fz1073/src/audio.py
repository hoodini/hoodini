"""Procedural trailer score + SFX (numpy/scipy), driven by the CUES the page emits. No vocals, no alarms, no crash/impact/blade/gunshot sounds.
Every musical section is anchored to its shot's own start, so each cut lands on a downbeat.
usage: audio.py cues.json out.wav"""
import sys, json
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
cues = json.load(open(sys.argv[1]))
TOTAL, BEAT = cues["total"], cues["beat"]
SH = {s["id"]: s for s in cues["shots"]}
EV = cues["events"]
N = int(np.ceil(TOTAL * SR)) + 1
mix = {k: np.zeros((N, 2)) for k in ("music", "sfx", "pad")}
rng = np.random.default_rng(1073)


def hz(note):  # 'D3' etc.
    names = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + 12 * (o + 1) - 69) / 12)


def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR / 2 - 100) / (SR / 2), "low", output="sos"), x, axis=0)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR / 2), "high", output="sos"), x, axis=0)


def bp(x, f1, f2, order=2):
    return sosfilt(butter(order, [f1 / (SR / 2), min(f2, SR / 2 - 100) / (SR / 2)], "band", output="sos"), x, axis=0)


def add(bus, t0, sig, gain=1.0, pan=0.0, t_max=None):
    i0 = int(round(t0 * SR))
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], 1)
    if i0 < 0:
        sig, i0 = sig[-i0:], 0
    end = min(N, i0 + len(sig))
    if t_max is not None:
        end = min(end, int(round(t_max * SR)))
    if end > i0:
        mix[bus][i0:end] += sig[: end - i0] * gain


def tt(d):
    return np.arange(int(d * SR)) / SR


def saw(f, d, detune=0.0):
    t = tt(d)
    return 2 * ((t * f * (1 + detune)) % 1) - 1


def adsr(n, a, r, sus=1.0):
    e = np.ones(n) * sus
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, sus, na)
    if nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


# ---------------- instruments ----------------
def pad(notes, d, a=1.2, r=1.5, bright=1400, amp=0.12):
    out = np.zeros((int(d * SR), 2))
    for i, n in enumerate(notes):
        f = hz(n)
        for ch, det in ((0, -0.004), (1, 0.004)):
            s = saw(f, d, det) + 0.6 * saw(f, d, -det * 1.7) + 0.5 * np.sin(2 * np.pi * f * tt(d))
            out[:, ch] += s
    out = lp(out, bright, 2) * amp / len(notes)
    return out * adsr(len(out), a, r)[:, None]


def tom(f0=140, f1=55, d=0.55, amp=0.9):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    skin = lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 40) * 0.35
    return (body + skin) * amp


def sub(f0=90, f1=42, d=1.4, amp=1.0):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 9)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6) * amp


def kick(amp=0.7):
    return sub(150, 48, 0.35, amp) * np.exp(-tt(0.35) * 6)


def pluck(f, d=0.22, amp=0.25, fc=1200):
    s = saw(f, d) + saw(f, d, 0.006)
    return lp(s, fc) * np.exp(-tt(d) * 16) * amp


def noise_sweep(d, f_from, f_to, amp, shape="rise"):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    seg = 2400
    for i in range(0, n, seg):
        p = i / n
        fc = f_from * (f_to / f_from) ** p
        out[i:i + seg] = bp(x[max(0, i - 2000):i + seg], fc * 0.6, fc * 1.6)[-len(x[i:i + seg]):]
    env = np.linspace(0, 1, n) ** 2 if shape == "rise" else np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    return out * env * amp


def heartbeat():
    d = 0.9
    out = np.zeros(int(d * SR))
    for k, (t0, g) in enumerate(((0.0, 1.0), (0.2, 0.75))):
        s = sub(70, 38, 0.5, g) * np.exp(-tt(0.5) * 9)
        i = int(t0 * SR)
        out[i:i + len(s)] += s
    return lp(out, 220)


def tick():
    d = 0.03
    s = rng.standard_normal(int(d * SR)) * np.exp(-tt(d) * 260)
    return bp(s, 1800, 5000) * 0.35


def ping():
    d = 1.1
    t = tt(d)
    return (np.sin(2 * np.pi * 1180 * t) * 0.6 + np.sin(2 * np.pi * 2360 * t) * 0.15) * np.exp(-t * 5.5) * np.minimum(1, t / 0.004) * 0.22


def bell(f, d=2.2, amp=0.08):
    t = tt(d)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.01 * t) + 0.12 * np.sin(2 * np.pi * f * 3.02 * t)) * np.exp(-t * 2.2) * np.minimum(1, t / 0.006) * amp


def reverb(x, secs=2.2, wet=0.25):
    ir_n = int(secs * SR)
    ir = rng.standard_normal((ir_n, 2)) * np.exp(-np.linspace(0, 7, ir_n))[:, None]
    ir = lp(ir, 6000)
    ir /= np.sqrt((ir ** 2).sum(0))
    y = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    return x + y * wet


def beats_of(s, div=1):
    n = int(round(s["beats"] * div))
    return [s["start"] + k * BEAT / div for k in range(n)]


# ---------------- ACT 1: calm, airy ----------------
s1, s5 = SH[1], SH[5]
a1_end = s5["end"]
add("pad", 0.0, pad(["D3", "A3", "E4", "F4"], a1_end, a=1.6, r=0.01, bright=1100, amp=0.16))
for t in beats_of(s1)[2:]:
    add("music", t, bell(hz("A5"), 1.6, 0.03), pan=0.3)
for sid in (2, 3, 4, 5):
    s = SH[sid]
    add("music", s["start"], tom(120, 60, 0.6, 0.35))
    for k, t in enumerate(beats_of(s, 2)):
        add("music", t, pluck(hz("D3") if k % 4 != 3 else hz("A2"), 0.2, 0.16, 900), pan=(-0.2 if k % 2 else 0.2))
    for t in beats_of(s):
        add("music", t, kick(0.32))
# hard stop at the cut to black, then 0.3 s of total silence (enforced at the end)

# ---------------- ACT 2: silence, heartbeat, sub hits ----------------
s6, s9 = SH[6], SH[9]
for e in EV:
    if e["type"] == "heartbeat":
        add("sfx", e["t"], heartbeat(), 1.0)
    if e["type"] == "subhit":
        add("sfx", e["t"], sub(95, 40, 1.6, 0.95))
        add("sfx", e["t"], lp(rng.standard_normal(int(0.4 * SR)) * np.exp(-tt(0.4) * 9), 400) * 0.18)
    if e["type"] == "punch":
        add("sfx", e["t"], sub(110, 50, 0.6, 0.45))
drone_d = s9["end"] + cues["trans"] / 2 - s6["start"]
dt = tt(drone_d)
drone = (np.sin(2 * np.pi * hz("D1") * dt) + 0.5 * np.sin(2 * np.pi * hz("A1") * dt) + 0.15 * lp(rng.standard_normal(len(dt)), 300)) * np.linspace(0.05, 0.4, len(dt)) * 0.35
add("music", s6["start"] + 0.35, drone * adsr(len(drone), 0.8, 0.02)[: len(drone)], t_max=s9["end"] + cues["trans"] / 2)
for sid in (8, 9):
    for k, t in enumerate(beats_of(SH[sid])):
        if k % 2 == 1:
            add("music", t, tom(100, 48, 0.6, 0.45))

# ---------------- ACT 3: drive ----------------
a3 = [SH[i] for i in (10, 11, 12, 13)]
for s in a3:
    for k, t in enumerate(beats_of(s)):
        add("music", t, tom(150 if k % 4 == 0 else 120, 55, 0.5, 0.85 if k == 0 else 0.6), pan=(-0.25 if k % 2 else 0.25))
        add("music", t, kick(0.55))
    for k, t in enumerate(beats_of(s, 4)):
        add("music", t, pluck(hz("D2") if (k // 8) % 2 == 0 else hz("F2"), 0.12, 0.2, 700 + 120 * k % 900), pan=(-0.35 if k % 2 else 0.35))
d3 = a3[-1]["end"] + cues["trans"] / 2 - a3[0]["start"]
add("pad", a3[0]["start"], pad(["D2", "A2", "D3", "F3"], d3, a=0.05, r=0.05, bright=600, amp=0.2))
for e in EV:
    if e["type"] == "wind":
        add("sfx", e["t"], noise_sweep(e["dur"], 300, 2400, 0.32), pan=0.0)
    if e["type"] == "tick":
        add("sfx", e["t"], tick(), 0.9)
    if e["type"] == "ping":
        add("sfx", e["t"], ping(), 0.9, pan=-0.3)
    if e["type"] == "whoosh":
        add("sfx", e["t"] - 0.08, noise_sweep(e["dur"] + 0.25, 3500, 400, 0.42, "arc"))

# ---------------- ACT 4: the build ----------------
chords = {14: ["Bb2", "F3", "D4"], 15: ["F2", "C3", "A3"], 16: ["C3", "G3", "E4"], 17: ["D2", "A2", "F3", "D4"], 18: ["Bb2", "F3", "D4", "A4"]}
for sid in (14, 15, 16, 17, 18):
    s = SH[sid]
    div = 2 if sid < 17 else 4
    for k, t in enumerate(beats_of(s, div)):
        add("music", t, tom(160 if k % div == 0 else 130, 60, 0.4, 0.75 if k % div == 0 else 0.45), pan=(-0.3 if k % 2 else 0.3))
    for t in beats_of(s):
        add("music", t, kick(0.6))
    st = pad(chords[sid], s["hold"] + 0.25, a=0.01, r=0.2, bright=2200, amp=0.5)
    add("music", s["start"], st * np.exp(-tt(s["hold"] + 0.25) * 1.2)[:, None])
add("sfx", SH[17]["start"], sub(100, 40, 1.8, 0.9))
rise_d = SH[19]["start"] - SH[14]["start"]
add("music", SH[14]["start"], noise_sweep(rise_d, 200, 6000, 0.22))
rt = tt(rise_d)
add("music", SH[14]["start"], np.sin(2 * np.pi * np.cumsum(110 * 2 ** (rt / rise_d * 2)) / SR) * (rt / rise_d) ** 2 * 0.12)
for e in EV:
    if e["type"] == "swell":
        sw = pad(["D3", "F#3", "A3", "E4"], e["dur"] + 0.4, a=e["dur"], r=0.3, bright=1800, amp=0.35)
        add("pad", e["t"], sw)

# ---------------- catharsis: drop-out into warm pad, then resolve ----------------
s19, s20 = SH[19], SH[20]
tail = TOTAL - s19["start"]
warm = pad(["D3", "F#3", "A3", "E4", "A4"], tail, a=0.5, r=1.6, bright=1600, amp=0.34)
add("pad", s19["start"], warm)
add("pad", s20["start"], pad(["G2", "D3", "B3", "F#4"], 1.8, a=0.4, r=1.2, bright=1300, amp=0.12))

# ---------------- bus processing ----------------
music = reverb(mix["music"], 1.8, 0.22)
padb = reverb(mix["pad"], 3.0, 0.35)
sfx = reverb(mix["sfx"], 1.4, 0.15)
# music drop-out on shot 19: everything rhythmic gone (tails allowed for 120 ms)
i19 = int(s19["start"] * SR)
fade = np.ones(N)
fade[i19:i19 + int(0.12 * SR)] = np.linspace(1, 0, int(0.12 * SR))
fade[i19 + int(0.12 * SR):] = 0
music[:, :] *= fade[:, None]
# catharsis bells on their own reverb send, after the drop-out
mix["music"][:] = 0
for k, n in enumerate(["A4", "D5", "F#5", "E5"]):
    add("music", s19["start"] + 0.5 + k * BEAT * 1.5, bell(hz(n), 2.4, 0.05), pan=(-0.3 + 0.2 * k))
for k, n in enumerate(["D5", "A4", "F#4", "D4"]):
    add("music", s20["start"] + 0.2 + k * BEAT * 2, bell(hz(n), 3.0, 0.05), pan=(0.3 - 0.2 * k))
music += reverb(mix["music"], 2.5, 0.4)
out = music * 1.0 + padb * 1.0 + sfx * 1.1
out = hp(out, 28)
# hard cut to black: total silence for exactly the gap before shot 6 (5 ms ramps)
i0, i1 = int(SH[5]["end"] * SR), int(SH[6]["start"] * SR)
r = int(0.005 * SR)
out[i0 - r:i0] *= np.linspace(1, 0, r)[:, None]
out[i0:i1] = 0
# tail fade on the end card
fl = int(1.2 * SR)
out[-fl:] *= np.linspace(1, 0, fl)[:, None] ** 1.5
out = np.tanh(out * 0.9) / 0.9
out /= np.max(np.abs(out)) / 0.7
wavfile.write(sys.argv[2], SR, out.astype(np.float32))
print("audio", out.shape[0] / SR, "s")
