#!/usr/bin/env bash
# Full pipeline: evidence → QA stills + contact sheets (also feeds thumbs/end still) → render → score → encode + verify.
set -euo pipefail
cd "$(dirname "$0")"
node evidence.mjs > /dev/null
for F in ${FORMATS:-A B}; do
  node qa.mjs --fmt "$F"
  python3 contact.py "$F"
  node render.mjs --fmt "$F"
  python3 audio.py "$F"
  if [ "$F" = A ]; then python3 finalize.py "$F" --stats; else python3 finalize.py "$F"; fi
done
