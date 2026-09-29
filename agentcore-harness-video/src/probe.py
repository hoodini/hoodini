import asyncio, sys, json
from playwright.async_api import async_playwright
R = sys.path[0] + "/.."
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox','--force-color-profile=srgb','--font-render-hinting=none'])
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        pg.on("console", lambda m: print("console:", m.text[:300]))
        pg.on("pageerror", lambda e: print("pageerror:", str(e)[:400]))
        await pg.goto(f"file://{R}/build/index.html")
        await pg.wait_for_function("window.READY===true||window.BUILD_ERROR", timeout=60000)
        print("ERR:", await pg.evaluate("window.BUILD_ERROR||null"))
        print(json.dumps(await pg.evaluate("window.TIMING&&{end:TIMING.END,drop:TIMING.DROP,n:TIMING.SHOTS.length,cues:CUES.length}")))
        await b.close()
asyncio.run(main())
