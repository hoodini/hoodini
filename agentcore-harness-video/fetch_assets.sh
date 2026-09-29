#!/usr/bin/env bash
# Fetches the third-party assets that are NOT committed (models, AWS icon package, AWS logo). Run once.
set -euo pipefail
cd "$(dirname "$0")"; mkdir -p assets/models
curl -L -o assets/models/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -L -o assets/models/voices-v1.0.bin  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
# AWS Architecture Icons (official package, https://aws.amazon.com/architecture/icons/)
curl -L -o assets/icons.zip "https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/architecture/approved/architecture-icons/Icon-package_01302026.31b40d126ed27079b708594940ad577a86150582.zip"
unzip -q -o assets/icons.zip -d assets/icons
# AWS logo (Wikimedia Commons copy of the official mark; swap for your brand-portal SVG if you prefer)
curl -L -o assets/aws_logo.svg https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg
npm install
