# Gentle 6% slow-down (Rubber Band, formant-preserving): ~190 wpm -> ~180 wpm for a calmer, exec-friendly read
import json, subprocess, soundfile as sf, shutil, os
os.makedirs('audio/raw', exist_ok=True); d = {}
for k in json.load(open('audio/vo_durations.json')):
    shutil.copy(f'audio/vo_{k}.wav', f'audio/raw/vo_{k}.wav')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',f'audio/raw/vo_{k}.wav','-af','rubberband=tempo=0.94:formant=preserved:pitchq=quality:transients=smooth:detector=soft',f'audio/vo_{k}.wav'],check=True)
    x, sr = sf.read(f'audio/vo_{k}.wav'); d[k] = round(len(x)/sr, 3)
json.dump(d, open('audio/vo_durations.json','w'), indent=1); print('VO', round(sum(d.values()),2))
