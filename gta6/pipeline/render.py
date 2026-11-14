#!/usr/bin/env python3
"""Render one video from an edit list (JSON) with ffmpeg.

Usage: python3 gta6/pipeline/render.py <edit.json> <clips_dir> <out_dir>

Edit list format (see README.md):
{
  "name": "v001-settings-long",
  "format": "long" | "short",
  "segments": [{"src": "clip1.mp4", "in": 12.0, "out": 20.5}, ...],
  "voiceover": "vo.m4a" | null,          # file in clips_dir, starts at 0:00
  "captions": [{"start": 0.0, "end": 2.5, "text": "..."}, ...]   # output timeline
}

Long  -> 1920x1080, 60 fps.  Short -> 1080x1920, 60 fps, gameplay fitted
over a blurred copy of itself. Both: burned-in captions, game audio ducked
under the voiceover, loudness normalized to -14 LUFS (two-pass), H.264 + AAC.
"""
import json
import subprocess
import sys
from pathlib import Path

FPS = 60
LUFS = -14
GAME_UNDER_VO_DB = -14  # game audio level while a voiceover track is present
SIZES = {"long": (1920, 1080), "short": (1080, 1920)}


def load_edit(path: Path) -> dict:
    edit = json.loads(path.read_text())
    if edit["format"] not in SIZES:
        raise ValueError(f"format must be one of {list(SIZES)}, got {edit['format']!r}")
    if not edit["segments"]:
        raise ValueError("edit list has no segments")
    for s in edit["segments"]:
        if s["out"] <= s["in"]:
            raise ValueError(f"segment out <= in: {s}")
    if edit["format"] == "short":
        total = sum(s["out"] - s["in"] for s in edit["segments"])
        if total > 180:
            raise ValueError(f"short is {total:.1f}s; YouTube Shorts max is 180s")
    return edit


def ass_time(t: float) -> str:
    cs = round(t * 100)
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def write_ass(captions: list, fmt: str, path: Path) -> None:
    w, h = SIZES[fmt]
    # Long: bottom-centre lower third. Short: upper third, larger, above the gameplay band.
    size, align, margin_v = (64, 2, 70) if fmt == "long" else (78, 8, 300)
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter,{size},&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,5,2,{align},80,80,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    for c in captions:
        if c["end"] <= c["start"]:
            raise ValueError(f"caption end <= start: {c}")
        text = c["text"].replace("\n", "\\N")
        lines.append(f"Dialogue: 0,{ass_time(c['start'])},{ass_time(c['end'])},Cap,,0,0,0,,{text}")
    path.write_text(header + "\n".join(lines) + "\n")


def build_command(edit: dict, clips: Path, out_file: Path, ass_file: Path) -> list:
    fmt = edit["format"]
    w, h = SIZES[fmt]
    segs = edit["segments"]
    inputs, filters, concat_in = [], [], ""

    for i, s in enumerate(segs):
        src = clips / s["src"]
        if not src.is_file():
            raise FileNotFoundError(src)
        inputs += ["-ss", str(s["in"]), "-to", str(s["out"]), "-i", str(src)]
        # Every segment -> 1920x1080 @ 60 fps, stereo 48 kHz, so concat accepts them.
        filters.append(
            f"[{i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,"
            f"pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps={FPS},setsar=1,setpts=PTS-STARTPTS[v{i}]"
        )
        filters.append(
            f"[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,asetpts=PTS-STARTPTS[a{i}]"
        )
        concat_in += f"[v{i}][a{i}]"
    filters.append(f"{concat_in}concat=n={len(segs)}:v=1:a=1[vcat][acat]")

    if fmt == "short":
        filters.append("[vcat]split[bgsrc][fgsrc]")
        filters.append(f"[bgsrc]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},gblur=sigma=30[bg]")
        filters.append(f"[fgsrc]scale={w}:-2[fg]")
        filters.append("[bg][fg]overlay=(W-w)/2:(H-h)/2[vbase]")
    else:
        filters.append("[vcat]null[vbase]")
    ass_arg = str(ass_file).replace("\\", "/").replace(":", "\\:")
    filters.append(f"[vbase]ass='{ass_arg}'[vout]")

    if edit.get("voiceover"):
        vo = clips / edit["voiceover"]
        if not vo.is_file():
            raise FileNotFoundError(vo)
        inputs += ["-i", str(vo)]
        vo_idx = len(segs)
        filters.append(f"[acat]volume={GAME_UNDER_VO_DB}dB[game]")
        filters.append(f"[{vo_idx}:a]aformat=sample_rates=48000:channel_layouts=stereo[vo]")
        filters.append("[game][vo]amix=inputs=2:duration=first:normalize=0[amixed]")
        audio_src = "[amixed]"
    else:
        audio_src = "[acat]"
    filters.append(f"{audio_src}anull[aout]")

    # Pass 1 output: final video, uncompressed audio (loudness is fixed in pass 2).
    return [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs,
        "-filter_complex", ";".join(filters),
        "-map", "[vout]", "-map", "[aout]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "pcm_s16le",
        str(out_file),
    ]


LOUDNORM = f"loudnorm=I={LUFS}:TP=-1.5:LRA=11"


def normalize_loudness(src: Path, out_file: Path) -> None:
    """Two-pass EBU R128: measure, then apply a linear gain to hit LUFS exactly."""
    probe = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(src), "-vn",
         "-af", f"{LOUDNORM}:print_format=json", "-f", "null", "-"],
        check=True, capture_output=True, text=True,
    ).stderr
    m = json.loads(probe[probe.rindex("{"):])
    measured = (f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
                f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(src),
         "-map", "0:v", "-map", "0:a", "-c:v", "copy",
         "-af", f"{LOUDNORM}:{measured},aresample=48000",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out_file)],
        check=True,
    )


def main() -> None:
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    edit_path, clips, out_dir = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    edit = load_edit(edit_path)
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"{edit['name']}.mp4"
    ass_file = out_dir / f"{edit['name']}.ass"
    raw_file = out_dir / f"{edit['name']}.raw.mkv"
    write_ass(edit["captions"], edit["format"], ass_file)
    subprocess.run(build_command(edit, clips, raw_file, ass_file), check=True)
    normalize_loudness(raw_file, out_file)
    raw_file.unlink()
    print(out_file)


if __name__ == "__main__":
    main()
