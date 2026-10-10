"""Deterministic parallel renderer. Each worker: Playwright Chromium -> seek(t,frame) -> jpeg q92 screenshot -> piped into ffmpeg (chunk mp4).
Then concat + final encode (libx264 slow, tune grain, ~5.5 Mbps) muxed with the loudness-normalised AAC mix.
usage: python3 src/render.py [--workers N] [--name agentcore-harness-explainer] [--frames a:b] """
import asyncio, json, os, subprocess, sys, time, argparse
R = os.path.dirname(os.path.abspath(__file__)) + "/.."
CH = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
try:
    import imageio_ffmpeg; FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception: FF = "ffmpeg"
FPS = 30
async def worker(i, a, b):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        br = await p.chromium.launch(executable_path=CH, args=["--no-sandbox", "--force-color-profile=srgb", "--font-render-hinting=none", "--disable-lcd-text"])
        pg = await br.new_page(viewport={"width": 1920, "height": 1080})
        await pg.goto(f"file://{R}/build/index.html"); await pg.wait_for_function("window.READY===true||window.BUILD_ERROR", timeout=90000)
        assert not await pg.evaluate("window.BUILD_ERROR||null")
        ff = subprocess.Popen([FF, "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "11", "-pix_fmt", "yuv420p", "-r", str(FPS), f"{R}/build/chunk_{i:02d}.mp4"], stdin=subprocess.PIPE)
        t0 = time.time()
        for f in range(a, b):
            await pg.evaluate(f"seek({f / FPS:.6f},{f})")
            ff.stdin.write(await pg.screenshot(type="jpeg", quality=92))
            if (f - a) % 100 == 0: print(f"[w{i}] {f - a}/{b - a}  {(f - a + 1) / (time.time() - t0):.1f} fps", flush=True)
        ff.stdin.close(); ff.wait(); await br.close()
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--workers", type=int, default=os.cpu_count()); ap.add_argument("--name", default="agentcore-harness-explainer")
    ap.add_argument("--worker", nargs=3, type=int); ap.add_argument("--frames"); ap.add_argument("--skip-render", action="store_true"); A = ap.parse_args()
    if A.worker: asyncio.run(worker(*A.worker)); return
    T = json.load(open(f"{R}/build/cues.json"))["timing"]; n = int(round(T["END"] * FPS))
    a0, b0 = (int(x) for x in A.frames.split(":")) if A.frames else (0, n)
    if not A.skip_render:
        step = -(-(b0 - a0) // A.workers); ps = []
        for i in range(A.workers):
            a, b = a0 + i * step, min(b0, a0 + (i + 1) * step)
            if a < b: ps.append(subprocess.Popen([sys.executable, __file__, "--worker", str(i), str(a), str(b)]))
        for p in ps: assert p.wait() == 0, "worker failed"
    chunks = sorted(f for f in os.listdir(f"{R}/build") if f.startswith("chunk_") and f.endswith(".mp4"))
    open(f"{R}/build/chunks.txt", "w").write("".join(f"file '{R}/build/{c}'\n" for c in chunks))
    subprocess.run([FF, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", f"{R}/build/chunks.txt", "-c", "copy", f"{R}/build/video_raw.mp4"], check=True)
    os.makedirs(f"{R}/out", exist_ok=True); out = f"{R}/out/{A.name}.mp4"; dur = n / FPS
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", f"{R}/build/video_raw.mp4", "-i", f"{R}/build/audio_final.m4a", "-map", "0:v", "-map", "1:a", "-t", f"{dur:.3f}",
        "-c:v", "libx264", "-preset", "slow", "-tune", "grain", "-profile:v", "high", "-level", "4.2", "-pix_fmt", "yuv420p", "-r", "30", "-b:v", "5500k", "-maxrate", "7000k", "-bufsize", "14000k",
        "-g", "60", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", out], check=True)
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", out, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-tune", "grain", "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-b:v", "1700k", "-maxrate", "2300k", "-bufsize", "4600k", "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-movflags", "+faststart", f"{R}/out/{A.name}-720p-preview.mp4"], check=True)
    print("done", out)
if __name__ == "__main__": main()
