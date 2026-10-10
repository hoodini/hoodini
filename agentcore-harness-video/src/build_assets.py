"""Builds build/assets.js (icons + logo variants), src/fonts/*.woff2, build/grain_{0..3}.png"""
import json, re, shutil, os, numpy as np
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__)) + "/.."
os.makedirs(f"{R}/src/fonts", exist_ok=True); os.makedirs(f"{R}/build", exist_ok=True)
F = f"{R}/node_modules/@fontsource"
for src, dst in [("anton/files/anton-latin-400-normal.woff2", "anton.woff2"),
                 ("instrument-serif/files/instrument-serif-latin-400-italic.woff2", "instrument-serif-italic.woff2"),
                 ("jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2", "jbm-400.woff2"),
                 ("jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2", "jbm-700.woff2"),
                 ("jetbrains-mono/files/jetbrains-mono-latin-800-normal.woff2", "jbm-800.woff2")]:
    shutil.copy(f"{F}/{src}", f"{R}/src/fonts/{dst}")
# --- official AWS logo (mark from aws.amazon.com brand assets, via Wikimedia copy) in 3 variants
svg = open(f"{R}/assets/aws_logo.svg").read()
svg = re.sub(r"<\?xml[^>]*\?>|<!--.*?-->", "", svg, flags=re.S).strip()
def variant(txt, smile):
    s = svg.replace("#252F3E", txt).replace("#FF9900", smile)
    return re.sub(r"<style.*?</style>", lambda m: m.group(0), s, flags=re.S)
LOGO = {"default": variant("#252F3E", "#FF9900"),   # on paper
        "reversed": variant("#FFFFFF", "#FF9900"),  # on ink
        "mono": variant("#0B0B0C", "#0B0B0C")}      # on AWS orange
# --- AWS Architecture Icons (64px svgs)
A = f"{R}/assets/icons/Architecture-Service-Icons_01302026"
aws = {"agentcore": "Arch_Artificial-Intelligence/64/Arch_Amazon-Bedrock-AgentCore_64.svg",
       "bedrock": "Arch_Artificial-Intelligence/64/Arch_Amazon-Bedrock_64.svg",
       "lambda": "Arch_Compute/64/Arch_AWS-Lambda_64.svg", "cloudwatch": "Arch_Management-Tools/64/Arch_Amazon-CloudWatch_64.svg",
       "dynamodb": "Arch_Databases/64/Arch_Amazon-DynamoDB_64.svg", "cognito": "Arch_Security-Identity/64/Arch_Amazon-Cognito_64.svg",
       "secrets": "Arch_Security-Identity/64/Arch_AWS-Secrets-Manager_64.svg", "ecs": "Arch_Containers/64/Arch_Amazon-Elastic-Container-Service_64.svg",
       "iam": "Arch_Security-Identity/64/Arch_AWS-Identity-and-Access-Management_64.svg", "s3": "Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.svg"}
ICONS = {"aws:" + k: re.sub(r"<\?xml[^>]*\?>", "", open(f"{A}/{v}").read()).strip() for k, v in aws.items()}
want = "laptop rocket box brain key-round scroll-text trending-up globe square-terminal terminal folder-open plug-zap cable lock vault eye-off activity undo-2 flask-conical split chef-hat utensils server clock shield-check file-code package database layers check x cpu dollar-sign tag git-branch hourglass flame bell bug code-xml sparkles gauge user-round wifi-off circle-dot badge-check moon repeat arrow-right network mouse-pointer-2 timer zap square-code files folder-tree bot circle-x rewind radio hard-drive mic settings-2 shield-off eraser refresh-cw".split()
L = f"{R}/node_modules/lucide-static/icons"
miss = []
for n in want:
    p = f"{L}/{n}.svg"
    if os.path.exists(p): ICONS["l:" + n] = re.sub(r"<!--.*?-->|\s+class=\"[^\"]*\"", "", open(p).read(), flags=re.S).strip()
    else: miss.append(n)
print("missing lucide:", miss)
open(f"{R}/build/assets.js", "w").write("window.LOGO=" + json.dumps(LOGO) + ";window.ICONS=" + json.dumps(ICONS) + ";")
# --- 4 pre-rendered film-grain frames (cycled per frame, no live SVG filter)
rng = np.random.default_rng(1337)
for i in range(4):
    n = rng.normal(128, 46, (540, 960)).clip(0, 255).astype(np.uint8)
    Image.fromarray(n, "L").save(f"{R}/build/grain_{i}.png", optimize=True)
print("assets ok", len(ICONS), "icons")
