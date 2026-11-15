#!/usr/bin/env python3
"""Split an owner's voice memo into script sections using its pauses.

Usage: python3 gta6/pipeline/voice.py <voice_memo> <script.md> <out_dir>

Reading rules (also in gta6/SETUP.md, Part D):
- Pause ~2 s between `##` sections of the script.
- Fluffed a section? Pause 5 s, then restart that section from its first sentence.
- Skipping a section (e.g. the game has no such setting)? Just say "skip" in its place.

Silence 1.5–4 s = section boundary. Silence >= 4 s = retake: the speech just
before it is thrown away. The number of kept chunks must equal the number of
`##` sections being read (script sections between "## Script" and the next
non-read heading); otherwise this fails and the memo needs a manual look.
Writes <out_dir>/sNN.m4a per section and sections.json with durations
(file null = skipped section).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

NOISE_DB = -35
BOUNDARY_S = 1.5
RETAKE_S = 4.0
PAD_S = 0.15  # keep a little air around each chunk
SKIP_MAX_S = 1.0  # a spoken "skip" is shorter than any real section

# Headings after "## Script" that are not read aloud.
NOT_READ = ("On-screen captions", "Description", "Tags", "Shorts", "Agent notes")


def read_sections(script: Path) -> list[str]:
    text = script.read_text()
    after = text.split("## Script (read aloud)", 1)
    if len(after) != 2:
        raise ValueError(f"{script} has no '## Script (read aloud)' heading")
    names = []
    for heading in re.findall(r"^## (.+)$", after[1], flags=re.M):
        if heading.startswith(NOT_READ):
            break
        names.append(heading.strip())
    if not names:
        raise ValueError(f"{script}: no read-aloud sections found")
    return names


def silences(memo: Path) -> tuple[list[tuple[float, float]], float]:
    err = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(memo),
         "-af", f"silencedetect=noise={NOISE_DB}dB:d={BOUNDARY_S}", "-f", "null", "-"],
        check=True, capture_output=True, text=True,
    ).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err).groups()
    total = int(h) * 3600 + int(m) * 60 + float(s)
    if len(ends) < len(starts):  # memo ends in silence
        ends.append(total)
    return list(zip(starts, ends)), total


def speech_chunks(gaps: list[tuple[float, float]], total: float) -> list[tuple[float, float]]:
    """Speech spans between gaps; a span followed by a retake-length gap is dropped."""
    chunks, cursor = [], 0.0
    for start, end in gaps:
        if start - cursor > 0.3:  # ignore clicks/breaths between silences
            if end - start < RETAKE_S:
                chunks.append((cursor, start))
            # else: retake, discard this span
        cursor = end
    if total - cursor > 0.3:
        chunks.append((cursor, total))
    return chunks


def main() -> None:
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    memo, script, out_dir = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    names = read_sections(script)
    gaps, total = silences(memo)
    chunks = speech_chunks(gaps, total)
    if len(chunks) != len(names):
        raise SystemExit(
            f"{memo}: found {len(chunks)} spoken chunks but the script has {len(names)} sections "
            f"({', '.join(names)}). Chunks: {[(round(a, 1), round(b, 1)) for a, b in chunks]}"
        )
    out_dir.mkdir(parents=True, exist_ok=True)
    result = []
    for i, ((a, b), name) in enumerate(zip(chunks, names), 1):
        if b - a < SKIP_MAX_S:
            result.append({"section": name, "file": None, "duration": 0.0})
            continue
        a, b = max(0.0, a - PAD_S), min(total, b + PAD_S)
        out = out_dir / f"s{i:02d}.m4a"
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}",
             "-i", str(memo), "-c:a", "aac", "-b:a", "192k", str(out)],
            check=True,
        )
        result.append({"section": name, "file": out.name, "duration": round(b - a, 3)})
    (out_dir / "sections.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
