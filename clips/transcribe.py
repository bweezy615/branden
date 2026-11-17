#!/usr/bin/env python3
"""Word-level transcript of a clip with faster-whisper (runs on CPU, no API key).

Usage: python3 clips/transcribe.py <clip.mp4> <words.json>
Output: [{"word": "no", "start": 0.42, "end": 0.61}, ...]
The model (~500 MB, "small") downloads from huggingface.co on first use.
"""
import json
import sys
from pathlib import Path

from faster_whisper import WhisperModel

MODEL = "small"


def transcribe(clip: Path) -> list[dict]:
    model = WhisperModel(MODEL, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(str(clip), word_timestamps=True, vad_filter=True)
    return [{"word": w.word, "start": round(w.start, 2), "end": round(w.end, 2)}
            for seg in segments for w in seg.words]


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    words = transcribe(Path(sys.argv[1]))
    Path(sys.argv[2]).write_text(json.dumps(words) + "\n")
    print(f"{len(words)} words")


if __name__ == "__main__":
    main()
