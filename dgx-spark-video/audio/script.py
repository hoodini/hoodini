"""Single source of truth for the VO script.
Markup: {spoken words|Caption Text} — TTS reads the left side, captions/W() use the right side.
[tag] = eleven_v3 audio tag (not spoken, not captioned).
gap = extra silence (s) inserted AFTER the line when assembling the VO track."""
import json, os, re

LINES = [
    # key, section, gap_after, text
    ('h1', 'HOOK', 0.00, "[excited] POV: you want to run a {one-twenty B|120B} model at home…"),
    ('h2', 'HOOK', 0.05, "and your GPU has {thirty-two gigs.|32 GB.}"),
    ('h3', 'HOOK', 0.55, "[deadpan] CUDA out of memory. Classic."),
    ('w1', 'WHAT IS IT', 0.10, "[excited] Enter DGX Spark. A tiny box with {a hundred twenty-eight gigs|128 GB} of memory the GPU can actually use."),
    ('w2', 'WHAT IS IT', 0.10, "Unified memory: CPU and GPU share one giant pantry. No more tiny GPU mini fridge."),
    ('w3', 'WHAT IS IT', 0.35, "Inside: a {G B ten|GB10} Grace Blackwell chip, {twenty|20} Arm cores, up to a petaflop of sparse {F P four.|FP4.}"),
    ('f1', 'WHAT RUNS', 0.05, "So what fits? {Eight B,|8B,} {twenty B:|20B:} easy on both."),
    ('f2', 'WHAT RUNS', 0.05, "{Seventy B:|70B:} Spark, yes. The {fifty-ninety?|5090?} Nope."),
    ('f3', 'WHAT RUNS', 0.05, "{One-twenty B:|120B:} Spark only. Up to {two hundred B|200B} if you quantize."),
    ('q1', 'WHAT RUNS', 0.40, "Quantizing is zipping the model: way smaller, slightly dumber."),
    ('p1', 'THE BOTTLENECK', 0.10, "[serious] Now the plot twist. Memory size decides what runs. Bandwidth decides how fast."),
    ('p2', 'THE BOTTLENECK', 0.05, "Spark is a huge warehouse with a narrow door: {two seventy-three|273} gigabytes per second."),
    ('p3', 'THE BOTTLENECK', 0.45, "The {fifty-ninety|5090} is a small garage on a highway: {seventeen ninety-two.|1,792.} Six and a half times wider."),
    ('r1', 'HEAD-TO-HEAD', 0.10, "[excited] Round one: same {twenty B|20B} model. The {fifty-ninety|5090} hits {two hundred five|205} tokens a second. Spark? {Sixty-one.|61.}"),
    ('r2', 'HEAD-TO-HEAD', 0.10, "On a dense {thirty-two B:|32B:} six times. That's the bandwidth gap."),
    ('r3', 'HEAD-TO-HEAD', 0.10, "Reading your prompt? {Fifty-ninety|5090} again, four times faster."),
    ('r4', 'HEAD-TO-HEAD', 0.10, "{Seventy B:|70B:} Spark runs it at four and a half tokens a second. The {fifty-ninety|5090} can't even fit it."),
    ('r5', 'HEAD-TO-HEAD', 0.10, "{One-twenty B:|120B:} Spark does {forty-two|42} tokens a second, and serves {sixty-four|64} users at once."),
    ('r6', 'HEAD-TO-HEAD', 0.10, "Power: Spark draws just {sixty to ninety|60 to 90} watts on LLMs. The {fifty-ninety|5090} card alone? Rated {five seventy-five.|575 W.}"),
    ('r7', 'HEAD-TO-HEAD', 0.10, "Price: Spark, {forty-six ninety-nine.|$4,699.} The {fifty-ninety,|5090,} {nineteen ninety-nine,|$1,999,} plus a whole PC."),
    ('r8', 'HEAD-TO-HEAD', 0.45, "Software: Spark ships NVIDIA's AI stack. The {fifty-ninety|5090} also games and renders."),
    ('b1', 'WHICH ONE?', 0.10, "[curious] So which one should you buy?"),
    ('b2', 'WHICH ONE?', 0.05, "Big models, agents, fine-tuning, or a silent desk box: Spark."),
    ('b3', 'WHICH ONE?', 0.05, "Max speed on models under {thirty B,|30B,} plus gaming and creative work: {fifty-ninety.|5090.}"),
    ('b4', 'WHICH ONE?', 0.40, "Need more? Link two Sparks for {four-oh-five B.|405B.}"),
    ('c1', 'VALUE', 0.10, "Value math, dollars per token-per-second: on {twenty B,|20B,} a {fifty-ninety|5090} build is {seventeen bucks.|$17.} Spark, {seventy-seven.|$77.}"),
    ('c2', 'VALUE', 0.60, "On {one-twenty B,|120B,} the {fifty-ninety|5090} can't play."),
    ('v1', 'VERDICT', 0.00, "[confident] Spark equals capacity. {Fifty-ninety|5090} equals speed. Pick your bottleneck."),
]

UNIT = re.compile(r'\{([^|}]+)\|([^}]+)\}|\[[^\]]+\]|(\S+)')


def parse(text):
    """-> tts string, list of units [{say:[tokens], cap:str}]"""
    units = []
    for m in UNIT.finditer(text):
        if m.group(0).startswith('['):
            continue
        if m.group(1):
            units.append({'say': m.group(1).split(), 'cap': m.group(2)})
        else:
            units.append({'say': [m.group(3)], 'cap': m.group(3)})
    tts = UNIT.sub(lambda m: m.group(1) if m.group(1) else m.group(0), text)
    return tts, units


def build():
    out = []
    for key, sec, gap, text in LINES:
        tts, units = parse(text)
        out.append({'key': key, 'section': sec, 'gap': gap, 'tts': tts, 'units': units,
                    'caption': ' '.join(u['cap'] for u in units)})
    return out


if __name__ == '__main__':
    s = build()
    here = os.path.dirname(os.path.abspath(__file__))
    json.dump(s, open(os.path.join(here, 'script.json'), 'w'), indent=1)
    full = '\n'.join(x['tts'] for x in s)
    open(os.path.join(here, 'tts_full.txt'), 'w').write(full)
    words = sum(len(x['caption'].split()) for x in s)
    print(len(s), 'lines,', words, 'words,', len(full), 'chars')
    print(full)
