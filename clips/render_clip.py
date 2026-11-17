#!/usr/bin/env python3
"""Turn one 16:9 stream clip into a 1080x1920 Clipamole vertical video.

Layout with a facecam box (fractions of the source frame, set per streamer in config.json):
  top 40%  = streamer's facecam, cropped and scaled to fill
  bottom 60% = gameplay, centre-cropped to fill
Without a facecam box: the full frame fitted over a blurred copy of itself.

On top: hook text for the first HOOK_S seconds, word-by-word captions (from transcribe.py),
an #ad disclosure (Content Rewards requires one from the first frame of every clip), a
twitch.tv/<streamer> credit (many campaigns require it) and a small @handle tag. Everything sits
inside the Instagram Reels safe zone: clear of the bottom SAFE_BOTTOM px (caption, audio, buttons),
the top ~270 px, and the right-hand button column. Audio is loudness-normalized to -14 LUFS (two-pass).

Usage: python3 clips/render_clip.py <clip.mp4> <words.json> <hook text> <out.mp4> <twitch login> [facecam x,y,w,h]
"""
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "gta6" / "pipeline"))
from render import ass_time, normalize_loudness  # noqa: E402

W, H, FPS = 1080, 1920, 30
CAM_H = 768            # facecam band height (40%)
HOOK_S = 3.0
WORDS_PER_CAPTION = 3
HANDLE = json.loads((Path(__file__).resolve().parent / "config.json").read_text())["handle"]  # brand tag on every clip
FONT = "Inter"
SAFE_BOTTOM = 400      # Reels UI covers ~372-380 px at the bottom of a 1080x1920 frame


def caption_groups(words: list[dict]) -> list[dict]:
    """Group transcribed words into short on-screen captions."""
    groups = []
    for i in range(0, len(words), WORDS_PER_CAPTION):
        chunk = words[i:i + WORDS_PER_CAPTION]
        groups.append({
            "start": chunk[0]["start"],
            "end": chunk[-1]["end"],
            "text": " ".join(w["word"].strip() for w in chunk).upper(),
        })
    for a, b in zip(groups, groups[1:]):  # no overlaps, no flicker gaps under 0.3 s
        if b["start"] - a["end"] < 0.3:
            a["end"] = b["start"]
    return groups


def write_ass(hook: str, words: list[dict], duration: float, has_cam: bool, twitch_login: str, path: Path) -> None:
    hook_y = CAM_H if has_cam else 400
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hook,{FONT},70,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,3,18,0,5,60,60,0,1
Style: Cap,{FONT},86,&H0000F0FF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,7,3,5,60,60,0,1
Style: Tag,{FONT},38,&H90FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,2,0,1,60,60,{SAFE_BOTTOM + 56},1
Style: Disclose,{FONT},40,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,3,0,1,60,60,{SAFE_BOTTOM + 104},1
Style: Credit,{FONT},44,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,4,0,1,60,60,{SAFE_BOTTOM},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    hook_text = hook.replace("\n", "\\N").upper()
    lines = [
        f"Dialogue: 2,{ass_time(0)},{ass_time(min(HOOK_S, duration))},Hook,,0,0,0,,{{\\pos({W // 2},{hook_y})}}{hook_text}",
        f"Dialogue: 0,{ass_time(0)},{ass_time(duration)},Tag,,0,0,0,,{HANDLE}",
        f"Dialogue: 0,{ass_time(0)},{ass_time(duration)},Credit,,0,0,0,,twitch.tv/{twitch_login}",
        f"Dialogue: 0,{ass_time(0)},{ass_time(duration)},Disclose,,0,0,0,,#ad",
    ]
    cap_y = 1330 if has_cam else 1390
    for g in caption_groups(words):
        lines.append(f"Dialogue: 1,{ass_time(g['start'])},{ass_time(g['end'])},Cap,,0,0,0,,{{\\pos({W // 2},{cap_y})}}{g['text']}")
    path.write_text(header + "\n".join(lines) + "\n")


def probe(path: Path) -> tuple[int, int, float]:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration",
         "-of", "json", str(path)], check=True, capture_output=True, text=True).stdout
    info = json.loads(out)
    s = info["streams"][0]
    return s["width"], s["height"], float(info["format"]["duration"])


def video_filter(facecam: tuple[float, float, float, float] | None, src_w: int, src_h: int, ass: Path) -> str:
    ass_arg = str(ass).replace("\\", "/").replace(":", "\\:")
    if facecam:
        x, y, w, h = facecam
        cx, cy, cw, ch = int(x * src_w), int(y * src_h), int(w * src_w), int(h * src_h)
        game_h = H - CAM_H
        return (
            f"[0:v]fps={FPS},split[a][b];"
            f"[a]crop={cw}:{ch}:{cx}:{cy},scale={W}:{CAM_H}:force_original_aspect_ratio=increase,crop={W}:{CAM_H}[cam];"
            f"[b]scale=-2:{game_h},crop={W}:{game_h}[game];"
            f"[cam][game]vstack,setsar=1,ass='{ass_arg}'[v]"
        )
    return (
        f"[0:v]fps={FPS},split[a][b];"
        f"[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=30[bg];"
        f"[b]scale={W}:-2[fg];"
        f"[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1,ass='{ass_arg}'[v]"
    )


def render(clip: Path, words: list[dict], hook: str, out: Path,
           facecam: tuple[float, float, float, float] | None, twitch_login: str) -> Path:
    src_w, src_h, duration = probe(clip)
    if facecam and not all(0 <= v <= 1 for v in facecam):
        raise ValueError(f"facecam box must be fractions 0..1, got {facecam}")
    out.parent.mkdir(parents=True, exist_ok=True)
    ass = out.with_suffix(".ass")
    raw = out.with_suffix(".raw.mkv")
    write_ass(hook, words, duration, facecam is not None, twitch_login, ass)
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(clip),
         "-filter_complex", video_filter(facecam, src_w, src_h, ass),
         "-map", "[v]", "-map", "0:a", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
         "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", str(raw)],
        check=True,
    )
    normalize_loudness(raw, out)
    raw.unlink()
    ass.unlink()
    return out


def main() -> None:
    if len(sys.argv) not in (6, 7):
        sys.exit(__doc__)
    clip, words_file, hook, out = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3], Path(sys.argv[4])
    login = sys.argv[5]
    facecam = tuple(float(v) for v in sys.argv[6].split(",")) if len(sys.argv) == 7 else None
    print(render(clip, json.loads(words_file.read_text()), hook, out, facecam, login))


if __name__ == "__main__":
    main()
