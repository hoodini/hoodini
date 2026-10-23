# Re-render the master on Yuval's PC GPU (Windows). Run from the film folder (ASCII path, e.g. C:\Users\User\yuvwork\gh-computer-use).
# Needs: node, ffmpeg on PATH, npm i (playwright), brand\logo-square-transparent.png, audio\ (Mixkit files, see analysis\sfx_used.json).
$ErrorActionPreference = 'Stop'
node build.mjs
$N = 1974; $K = 6; $per = [Math]::Ceiling($N / $K)
New-Item -ItemType Directory -Force out\seg, out\logs | Out-Null
$procs = @()
foreach ($L in 'h', 'v') { for ($i = 0; $i -lt $K; $i++) { $a = $i * $per; $b = [Math]::Min($N, $a + $per)
  $procs += Start-Process node -ArgumentList "tools\render.mjs out\film.html $L $a $b out\seg\m_$($L)_$i.mp4 master" -NoNewWindow -PassThru -RedirectStandardOutput "out\logs\m_$($L)_$i.log" -RedirectStandardError "out\logs\m_$($L)_$i.err" } }
$procs | Wait-Process
foreach ($L in 'h', 'v') { $list = "out\seg\list_$L.txt"; Remove-Item $list -ErrorAction SilentlyContinue
  for ($i = 0; $i -lt $K; $i++) { Add-Content $list ("file '" + (Resolve-Path "out\seg\m_$($L)_$i.mp4").Path.Replace('\', '/') + "'") }
  ffmpeg -y -v error -f concat -safe 0 -i $list -c copy "out\seg\master_$($L)_silent.mp4" }
py tools\mix.py cues.json audio out\audio.wav out\seg\master_h_silent.mp4 out\gh-computer-use-16x9-master.mp4 out\seg\master_v_silent.mp4 out\gh-computer-use-9x16-master.mp4
py -I tools\pops.py out\gh-computer-use-16x9-master.mp4 out\gh-computer-use-9x16-master.mp4
Get-FileHash out\*.mp4 -Algorithm MD5 | Format-Table -AutoSize
