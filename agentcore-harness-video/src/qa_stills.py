"""QA: one still per shot (~85% in) -> qa/stills/*.jpg + contact sheets qa/sheet_XX.jpg (labelled)."""
import asyncio, sys, json, os
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright
R = os.path.dirname(os.path.abspath(__file__)) + "/.."
CH = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
only = sys.argv[1:]  # optional shot ids
async def main():
    os.makedirs(f"{R}/qa/stills", exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CH, args=["--no-sandbox", "--force-color-profile=srgb"])
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        pg.on("pageerror", lambda e: print("pageerror:", str(e)[:300]))
        await pg.goto(f"file://{R}/build/index.html")
        await pg.wait_for_function("window.READY===true||window.BUILD_ERROR", timeout=60000)
        print("ERR", await pg.evaluate("window.BUILD_ERROR||null"))
        shots = await pg.evaluate("TIMING.SHOTS")
        for s in shots:
            if only and s["id"] not in only: continue
            t = s["t0"] + .85 * (s["t1"] - s["t0"])
            await pg.evaluate(f"seek({t},{round(t*30)})")
            await pg.screenshot(path=f"{R}/qa/stills/{s['id']}.jpg", type="jpeg", quality=88)
        await b.close()
    if only: return
    W_, H_ = 640, 360
    for si in range(0, len(shots), 12):
        sheet = Image.new("RGB", (W_ * 3, H_ * 4), "#333")
        for j, s in enumerate(shots[si:si + 12]):
            im = Image.open(f"{R}/qa/stills/{s['id']}.jpg").resize((W_, H_)); d = ImageDraw.Draw(im)
            d.rectangle([0, H_ - 22, 260, H_], fill="#000"); d.text((6, H_ - 18), f"{s['id']} {s['t0']:.1f}-{s['t1']:.1f}", fill="#fff")
            sheet.paste(im, ((j % 3) * W_, (j // 3) * H_))
        sheet.save(f"{R}/qa/sheet_{si//12:02d}.jpg", quality=85)
asyncio.run(main())
