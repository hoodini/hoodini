. ./.ffpath; cd stills; rm -rf sheets; mkdir -p sheets; files=($(ls t*.png)); n=${#files[@]}
for ((s=0;s<n;s+=6)); do ins=""; c=0; for k in 0 1 2 3 4 5; do f=${files[$((s+k))]}; [ -n "$f" ] && ins="$ins -i $f" && c=$((c+1)); done
 if [ $c -eq 6 ]; then $FF -y -loglevel error $ins -filter_complex "[0][1][2][3][4][5]xstack=inputs=6:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0,scale=1620:-1" sheets/sheet$s.png; fi; done
