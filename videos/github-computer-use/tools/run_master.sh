#!/bin/bash
# parallel master render: K workers per layout, then lossless concat. usage: tools/run_master.sh <film.html> <frames> <workers-per-layout>
set -e
FILM=$1; N=$2; K=$3; mkdir -p out/seg out/logs
PER=$(( (N + K - 1) / K ))
for L in h v; do
  for i in $(seq 0 $((K-1))); do
    A=$((i*PER)); B=$(( (i+1)*PER < N ? (i+1)*PER : N ))
    node tools/render.mjs $FILM $L $A $B out/seg/m_${L}_$i.mp4 master > out/logs/m_${L}_$i.log 2>&1 &
  done
done
wait
for L in h v; do
  rm -f out/seg/list_$L.txt; for i in $(seq 0 $((K-1))); do echo "file '$PWD/out/seg/m_${L}_$i.mp4'" >> out/seg/list_$L.txt; done
  ffmpeg -y -v error -f concat -safe 0 -i out/seg/list_$L.txt -c copy out/seg/master_${L}_silent.mp4
done
echo ALLDONE $(date -u +%T)
