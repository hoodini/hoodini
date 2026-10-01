"""Deterministic renderer: Playwright Chromium screenshots -> ffmpeg, split across parallel workers.
usage: render.py stills <fmt> <out_dir> [t1 t2 ...]   |   render.py video <fmt> <out.mp4> [workers]   |   render.py cues <out.json>"""
import sys, os, json, subprocess, threading, http.server, socketserver, functools, math
from concurrent.futures import ProcessPoolExecutor
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8731
import glob
CHROME = (glob.glob("/opt/pw-browsers/chromium_headless_shell-*/chrome-*/chrome-headless-shell") + glob.glob("/opt/pw-browsers/chromium-*/chrome-linux*/chrome"))[0]


def serve():
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k): pass
    h = functools.partial(Q, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", PORT), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def open_page(p, fmt):
    W, H = (1080, 1920) if fmt == "v" else (1920, 1080)
    b = p.chromium.launch(executable_path=CHROME, args=["--disable-gpu", "--font-render-hinting=none", "--disable-lcd-text"])
    pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    pg.on("pageerror", lambda e: print("PAGEERROR", e))
    pg.on("console", lambda m: print("CONSOLE", m.text) if m.type in ("error", "warning") else None)
    pg.goto(f"http://127.0.0.1:{PORT}/src/index.html?fmt={fmt}")
    pg.wait_for_function("window.READY === true", timeout=20000)
    return b, pg


def shot(pg, t, frame):
    pg.evaluate(f"window.seek({t}, {frame})")
    return pg.screenshot(type="png", clip=None, animations="disabled", caret="hide", full_page=False)


def worker(args):
    fmt, f0, f1, seg = args
    with sync_playwright() as p:
        b, pg = open_page(p, fmt)
        W, H = (1080, 1920) if fmt == "v" else (1920, 1080)
        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "png", "-i", "-",
                               "-c:v", "libx264", "-preset", "veryfast", "-crf", "10", "-pix_fmt", "yuv420p", "-r", "30", seg], stdin=subprocess.PIPE)
        for f in range(f0, f1):
            ff.stdin.write(shot(pg, f / 30.0, f))
        ff.stdin.close(); ff.wait(); b.close()
    return seg


if __name__ == "__main__":
    mode = sys.argv[1]
    srv = serve()
    if mode == "cues":
        with sync_playwright() as p:
            b, pg = open_page(p, "v")
            cues = pg.evaluate("window.CUES"); fit_v = pg.evaluate("window.FIT"); b.close()
            b, pg = open_page(p, "h"); fit_h = pg.evaluate("window.FIT"); b.close()
        cues["fit"] = {"v": fit_v, "h": fit_h}
        json.dump(cues, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
        print(json.dumps({"total": cues["total"], "frames": cues["frames"]}))
        bad = {k: [i for i, v in f.items() if not v["ok"]] for k, f in cues["fit"].items()}
        print("fit problems:", bad)
    elif mode == "stills":
        fmt, out = sys.argv[2], sys.argv[3]
        os.makedirs(out, exist_ok=True)
        times = [float(x) for x in sys.argv[4:]]
        with sync_playwright() as p:
            b, pg = open_page(p, fmt)
            if not times:
                cues = pg.evaluate("window.CUES")
                times = [s["start"] + s["hold"] * 0.85 for s in cues["shots"]]
            for i, t in enumerate(times):
                open(os.path.join(out, f"{i + 1:02d}.png"), "wb").write(shot(pg, t, round(t * 30)))
            b.close()
    elif mode == "video":
        fmt, outp = sys.argv[2], sys.argv[3]
        nw = int(sys.argv[4]) if len(sys.argv) > 4 else os.cpu_count()
        with sync_playwright() as p:
            b, pg = open_page(p, fmt); frames = pg.evaluate("window.CUES.frames"); b.close()
        tmp = outp + ".parts"; os.makedirs(tmp, exist_ok=True)
        step = math.ceil(frames / nw)
        jobs = [(fmt, i * step, min(frames, (i + 1) * step), os.path.join(tmp, f"seg{i:02d}.mp4")) for i in range(nw) if i * step < frames]
        with ProcessPoolExecutor(nw) as ex:
            segs = list(ex.map(worker, jobs))
        lst = os.path.join(tmp, "list.txt")
        open(lst, "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", outp], check=True)
        print("video frames:", frames, "->", outp)
    srv.shutdown()
