#!/usr/bin/env bash
# Offline test of the make step: synthetic clip + hand-written plan.json -> two vertical renders.
# (plan needs Twitch + Whisper, so it is tested live on the supervisor environment instead.)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
work="${1:?usage: run_test.sh <work_dir>}"
mkdir -p "$work/src"
ffmpeg -hide_banner -loglevel error -y -f lavfi -i testsrc2=size=1920x1080:rate=60:duration=6 \
  -f lavfi -i "sine=frequency=300:duration=6,volume=0.5" -c:v libx264 -c:a aac -shortest "$work/src/c1.mp4"
cp "$work/src/c1.mp4" "$work/src/c2.mp4"
python3 - "$work" <<'PY'
import json, sys
work = sys.argv[1]
words = [{"word": w, "start": i * 0.4, "end": i * 0.4 + 0.35} for i, w in enumerate("no way he did that chat".split())]
base = {"streamer": "teststreamer", "clip_url": "https://clips.twitch.tv/x", "clip_views": 999, "title": "t",
        "words": words, "transcript": "", "hook": "HE DID NOT EXPECT THAT", "caption_title": "t"}
plan = [dict(base, clip_id="c1", src=f"{work}/src/c1.mp4", facecam=[0.0, 0.0, 0.3, 0.3], skip=False),
        dict(base, clip_id="c2", src=f"{work}/src/c2.mp4", facecam=[], skip=False),
        dict(base, clip_id="c3", src=f"{work}/src/missing.mp4", facecam=[], skip=True)]
json.dump(plan, open(f"{work}/plan.json", "w"))
sys.path.insert(0, "clips")
import run
run.make(__import__("pathlib").Path(work), {"hashtags": [], "streamers": [{"twitch": "teststreamer", "name": "T", "campaign": "test"}]}, post=False)
PY
for c in c1 c2; do
  read -r w h < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$work/out/$c.mp4" | tr x ' ')
  [[ "$w" == 1080 && "$h" == 1920 ]] || { echo "FAIL $c ${w}x${h}"; exit 1; }
done
[[ ! -e "$work/out/c3.mp4" ]] || { echo "FAIL skipped clip was rendered"; exit 1; }
echo PASS
