import sys, asyncio, certifi
certifi.where = lambda: '/root/.ccr/ca-bundle.crt'
import edge_tts, edge_tts.communicate as C
C.certifi.where = certifi.where
async def main(text, voice, out, rate='+0%', pitch='+0Hz'):
    await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(out)
asyncio.run(main(*sys.argv[1:]))
