#!/usr/bin/env bash
# Builds synthetic clips, renders the long and short test edits, and checks the outputs.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
work="${1:?usage: run_test.sh <work_dir>}"
mkdir -p "$work/clips" "$work/out"

# 16:9 1080p60 "gameplay" with loud game audio, and a 1440p30 clip to test mixed sources.
ffmpeg -hide_banner -loglevel error -y -f lavfi -i testsrc2=size=1920x1080:rate=60:duration=12 \
  -f lavfi -i "sine=frequency=220:duration=12,volume=0.8" -c:v libx264 -c:a aac -shortest "$work/clips/sample_a.mp4"
ffmpeg -hide_banner -loglevel error -y -f lavfi -i smptehdbars=size=2560x1440:rate=30:duration=10 \
  -f lavfi -i "sine=frequency=330:duration=10,volume=0.3" -c:v libx264 -c:a aac -shortest "$work/clips/sample_b.mp4"
# Stand-in voiceover (quiet tone, as a phone voice memo would be).
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "sine=frequency=600:duration=9,volume=0.1" -c:a aac "$work/clips/sample_vo.m4a"

for edit in long short; do
  python3 "$here/../render.py" "$here/$edit.json" "$work/clips" "$work/out"
done

check() {  # file expected_w expected_h expected_duration
  local f=$1 w h d lufs
  read -r w h < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$f" | tr x ' ')
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  lufs=$(ffmpeg -hide_banner -nostats -i "$f" -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}')
  echo "$f: ${w}x${h} ${d}s ${lufs} LUFS"
  [[ "$w" == "$2" && "$h" == "$3" ]] || { echo "FAIL size"; exit 1; }
  awk -v d="$d" -v e="$4" 'BEGIN{exit !(d>e-0.2 && d<e+0.2)}' || { echo "FAIL duration"; exit 1; }
  awk -v l="$lufs" 'BEGIN{exit !(l>-15.5 && l<-12.5)}' || { echo "FAIL loudness"; exit 1; }
}
check "$work/out/test-long.mp4" 1920 1080 11
check "$work/out/test-short.mp4" 1080 1920 11
ffmpeg -hide_banner -loglevel error -y -ss 1 -i "$work/out/test-long.mp4" -frames:v 1 "$work/out/test-long.png"
ffmpeg -hide_banner -loglevel error -y -ss 1 -i "$work/out/test-short.mp4" -frames:v 1 "$work/out/test-short.png"
echo PASS
