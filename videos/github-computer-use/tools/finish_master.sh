#!/bin/bash
# re-render the second halves with the fixed film, wait for the first halves (other processes) to finish, then concat
set -e
node tools/render.mjs out/film.html h 987 1974 out/seg/m_h_1.mp4 master > out/logs/m_h_1.log 2>&1 &
node tools/render.mjs out/film.html v 987 1974 out/seg/m_v_1.mp4 master > out/logs/m_v_1.log 2>&1 &
wait
until grep -q DONE out/logs/m_h_0.log && grep -q DONE out/logs/m_v_0.log; do sleep 5; done
for L in h v; do
  rm -f out/seg/list_$L.txt; for i in 0 1; do echo "file '$PWD/out/seg/m_${L}_$i.mp4'" >> out/seg/list_$L.txt; done
  ffmpeg -y -v error -f concat -safe 0 -i out/seg/list_$L.txt -c copy out/seg/master_${L}_silent.mp4
done
echo ALLDONE $(date -u +%T)
