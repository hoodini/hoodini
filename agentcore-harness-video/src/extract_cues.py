"""Loads the page and dumps CUES (sfx events), CUTS and TIMING (drop / breakdown / end) -> build/cues.json"""
import asyncio, json, os
from playwright.async_api import async_playwright
R = os.path.dirname(os.path.abspath(__file__)) + "/.."
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox"])
        pg = await b.new_page(); await pg.goto(f"file://{R}/build/index.html")
        await pg.wait_for_function("window.READY===true||window.BUILD_ERROR", timeout=60000)
        d = await pg.evaluate("({cues:CUES,cuts:CUTS,timing:TIMING})")
        json.dump(d, open(f"{R}/build/cues.json", "w"), indent=1); print(len(d["cues"]), "cues", len(d["cuts"]), "cuts", d["timing"]["END"])
        await b.close()
asyncio.run(main())
