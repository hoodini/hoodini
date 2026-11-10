#!/usr/bin/env bash
# Two-pass loudnorm to -14 LUFS / -1 dBTP after gentle compression + limiting
set -e
PRE="acompressor=threshold=-20dB:ratio=2.5:attack=5:release=120:makeup=2,alimiter=limit=0.63:attack=2:release=40:level=false"
J=$(ffmpeg -hide_banner -i audio/mix_premaster.wav -af "$PRE,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/{/,/}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -loglevel error -y -i audio/mix_premaster.wav -af "$PRE,loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s24le audio/master.wav
ffmpeg -hide_banner -i audio/master.wav -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:"
