#!/usr/bin/env python3
"""ChatClipped daily run: find -> download -> transcribe -> render -> (post) -> log.

  python3 clips/run.py <work_dir>          # render only, for review
  python3 clips/run.py <work_dir> --post   # also publish to Instagram + Facebook

Only streamers listed in clips/config.json are ever clipped. A streamer goes in that list
only when we have permission: a Whop campaign or the streamer's own clipping program.
Each entry:
  {"twitch": "login", "name": "Display Name", "campaign": "Whop campaign URL or program name",
   "facecam": [x, y, w, h] or null,        # fractions of the 16:9 frame; null = blurred-fit layout
   "tags": ["#required", "#campaign", "#tags"], "caption_note": "text the campaign requires" }

Every clip is appended to clips/log.csv (dedupe + scorecard). Links that still need submitting
to Whop are listed in clips/whop_todo.md until Whop submission is automated.
"""
import csv
import json
import re
import sys
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from render_clip import render  # noqa: E402

CONFIG = HERE / "config.json"
LOG = HERE / "log.csv"
WHOP_TODO = HERE / "whop_todo.md"
FIELDS = ["date", "streamer", "campaign", "clip_id", "clip_url", "clip_views", "title",
          "ig_media_id", "ig_url", "fb_video_id", "fb_url", "whop_submitted"]


def load_config() -> dict:
    cfg = json.loads(CONFIG.read_text())
    if not cfg["streamers"]:
        raise SystemExit("clips/config.json has no streamers. Add only streamers we have permission to clip "
                         "(a Whop campaign or their own clipping program).")
    for s in cfg["streamers"]:
        if not s.get("campaign"):
            raise SystemExit(f"streamer {s.get('twitch')!r} has no 'campaign': no permission, not clipping")
    return cfg


def logged_ids() -> set[str]:
    if not LOG.exists():
        return set()
    with LOG.open() as fh:
        return {row["clip_id"] for row in csv.DictReader(fh)}


def append_log(row: dict) -> None:
    new = not LOG.exists()
    with LOG.open("a", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=FIELDS)
        if new:
            w.writeheader()
        w.writerow(row)


def hook_from_title(title: str) -> str:
    """Twitch clip titles are written by viewers; tidy one into on-screen hook text."""
    t = re.sub(r"(?i)\b(clip|twitch)\b", "", title)
    t = re.sub(r"\s+", " ", t).strip(" -|:")
    return (t[:57] + "...") if len(t) > 60 else t


def caption(streamer: dict, title: str, cfg: dict) -> str:
    parts = [title.strip(), "",
             f"Credit: {streamer['name']} (twitch.tv/{streamer['twitch']})"]
    if streamer.get("caption_note"):
        parts.append(streamer["caption_note"])
    parts.append(" ".join(streamer.get("tags", []) + cfg["hashtags"]))
    return "\n".join(parts)


def pick_clips(cfg: dict) -> list[tuple[dict, dict]]:
    from twitch import Twitch
    tw, done, picks = Twitch(), logged_ids(), []
    for s in cfg["streamers"]:
        for c in tw.top_clips(s["twitch"], cfg["lookback_hours"]):
            if c["id"] not in done and c["view_count"] >= cfg["min_clip_views"]:
                picks.append((s, c))
    picks.sort(key=lambda sc: sc[1]["view_count"], reverse=True)
    return picks[:cfg["max_clips_per_run"]]


def write_whop_todo() -> None:
    with LOG.open() as fh:
        pending = [r for r in csv.DictReader(fh) if r["whop_submitted"] != "yes" and (r["ig_url"] or r["fb_url"])]
    lines = ["# Links to submit in Whop Content Rewards", "",
             "Submit each link in its campaign right away (views count once the link is tracked). "
             "Then tell the agent, or mark `whop_submitted` = yes in clips/log.csv.", ""]
    for r in pending:
        lines.append(f"- [{r['campaign']}] {r['streamer']}: {r['ig_url']}  (Facebook: {r['fb_url'] or 'n/a'})")
    WHOP_TODO.write_text("\n".join(lines) + "\n")


def main() -> None:
    args = sys.argv[1:]
    if not args or len(args) > 2 or (len(args) == 2 and args[1] != "--post"):
        sys.exit(__doc__)
    work, post = Path(args[0]), len(args) == 2
    cfg = load_config()

    from transcribe import transcribe
    from twitch import download
    if post:
        from meta import post_facebook, post_instagram

    for streamer, clip in pick_clips(cfg):
        cid = clip["id"]
        src = download(clip["url"], work / "src" / f"{cid}.mp4")
        words = transcribe(src)
        (work / "src" / f"{cid}.words.json").write_text(json.dumps(words))
        out = render(src, words, hook_from_title(clip["title"]), work / "out" / f"{cid}.mp4",
                     tuple(streamer["facecam"]) if streamer.get("facecam") else None)
        row = {"date": str(date.today()), "streamer": streamer["twitch"], "campaign": streamer["campaign"],
               "clip_id": cid, "clip_url": clip["url"], "clip_views": clip["view_count"], "title": clip["title"],
               "ig_media_id": "", "ig_url": "", "fb_video_id": "", "fb_url": "", "whop_submitted": "no"}
        if post:  # review-only runs don't log, so the same clips can be posted later
            text = caption(streamer, clip["title"], cfg)
            row["ig_media_id"], row["ig_url"] = post_instagram(out, text)
            row["fb_video_id"], row["fb_url"] = post_facebook(out, text)
            append_log(row)
        print(f"{cid}\t{out}\t{row['ig_url']}")
    if post:
        write_whop_todo()


if __name__ == "__main__":
    main()
