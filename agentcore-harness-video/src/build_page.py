"""Concatenate src/js/*.js into build/page.js, copy html/fonts/gsap into build/."""
import os, shutil
R = os.path.dirname(os.path.abspath(__file__)) + "/.."
js = "".join(open(f"{R}/src/js/{f}.js").read() + "\n" for f in ["core", "shots_c", "boot"])
open(f"{R}/build/page.js", "w").write("(async()=>{try{\n" + js + "\n}catch(e){window.BUILD_ERROR=String(e.stack||e);console.error(e)}})();")
shutil.copy(f"{R}/src/index.html", f"{R}/build/index.html")
shutil.copy(f"{R}/node_modules/gsap/dist/gsap.min.js", f"{R}/build/gsap.min.js")
shutil.copytree(f"{R}/src/fonts", f"{R}/build/fonts", dirs_exist_ok=True)
print("page built", len(js))
