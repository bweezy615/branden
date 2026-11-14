# Editing pipeline

One script, one input format. `render.py` turns an **edit list** (JSON) plus raw clips into a finished video.

```
python3 gta6/pipeline/render.py <edit.json> <clips_dir> <out_dir>
```

| Format | Output | Layout |
|---|---|---|
| `long` | 1920x1080, 60 fps, H.264 + AAC | Gameplay full frame, captions in the lower third |
| `short` | 1080x1920, 60 fps, max 180 s | Full 16:9 gameplay centred over a blurred copy of itself, big captions in the upper third |

Every render: segments trimmed and joined (mixed resolutions/frame rates are scaled to 1080p60), captions burned in (Inter Bold, white with black outline), game audio dropped 14 dB under the owner's voiceover when there is one, then **two-pass loudness normalization to -14 LUFS** (YouTube's playback target).

## Edit list

```json
{
  "name": "v001-settings-long",
  "format": "long",
  "segments": [{"src": "ps5_2026-11-19_001.mp4", "in": 12.0, "out": 20.5}],
  "voiceover": "v001-vo.m4a",
  "captions": [{"start": 0.0, "end": 2.5, "text": "Line one\nLine two"}]
}
```

- `in`/`out` are seconds in the source clip. Caption times are on the **output** timeline.
- `voiceover` is a file in `clips_dir` that starts at 0:00 (the owner's phone voice memo), or `null`.

## Rules
- Raw footage and renders never go into git (`.gitignore` blocks video files). Clips come from the Drive intake folder; renders go back to the Drive output folder (see `gta6/SETUP.md`).
- Each video gets its own edit list in `gta6/creator/edits/` (small JSON, committed), so every cut is reproducible.

## Test
`gta6/pipeline/test/run_test.sh <work_dir>` builds synthetic clips (1080p60 and 1440p30 test patterns, tones as game audio and voiceover), renders one long and one short, and checks size, duration and loudness (within ±1.5 LU of -14). Last run: Nov 14, 2026, PASS (long 1920x1080 11.0 s -13.2 LUFS; short 1080x1920 11.0 s -13.2 LUFS).

## Next (once Google credentials exist)
- `drive.py`: list new clips in the intake folder, download them, upload renders to the output folder.
- `youtube.py`: upload as **private** with title/description/tags, `selfDeclaredMadeForKids=false`, `containsSyntheticMedia=false`; owners flip to public after a quick check.
