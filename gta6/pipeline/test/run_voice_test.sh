#!/usr/bin/env bash
# Synthetic voice memo: 3 sections, with a fluffed take of section 2 followed by a 5 s retake pause.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
work="${1:?usage: run_voice_test.sh <work_dir>}"
mkdir -p "$work"
tone() { echo "sine=frequency=$1:duration=$2"; }
quiet() { echo "anullsrc=r=48000:cl=mono:d=$1"; }
# speech 3s | 2s | speech 2s (fluff) | 5s | speech 4s | 2s | speech 3s, with a 0.4 s mid-sentence breath gap
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "$(tone 300 3)" -f lavfi -i "$(quiet 2)" \
  -f lavfi -i "$(tone 300 2)" -f lavfi -i "$(quiet 5)" \
  -f lavfi -i "$(tone 300 2)" -f lavfi -i "$(quiet 0.4)" -f lavfi -i "$(tone 300 1.6)" -f lavfi -i "$(quiet 2)" \
  -f lavfi -i "$(tone 300 3)" \
  -filter_complex "[0][1][2][3][4][5][6][7][8]concat=n=9:v=0:a=1,aformat=sample_rates=48000:channel_layouts=mono" \
  -c:a aac "$work/memo.m4a"
cat > "$work/script.md" <<'MD'
## Script (read aloud)
## Hook (0:00)
a
## Middle
b
## Wrap-up
c
## On-screen captions
- x
MD
python3 "$here/../voice.py" "$work/memo.m4a" "$work/script.md" "$work/out" > /dev/null
python3 - "$work/out/sections.json" <<'PY'
import json, sys
d = [s["duration"] for s in json.load(open(sys.argv[1]))]
expect = [3.0, 4.0, 3.0]  # section 2 = the retake (2 + 0.4 + 1.6), fluff dropped
ok = len(d) == 3 and all(abs(a - b) < 0.5 for a, b in zip(d, expect))
print("durations", d, "PASS" if ok else "FAIL")
sys.exit(0 if ok else 1)
PY
