#!/usr/bin/env python3
"""ChatClipped daily run, in two steps so the supervisor agent can apply judgment between them.

  python3 clips/run.py plan <work_dir>            # find + download + transcribe + detect facecam
  #   -> <work_dir>/plan.json. The supervisor reads each transcript, sets "skip": true for anything
  #      that breaks the rules (music, story spoilers, hateful/sexual content, a weak moment),
  #      rewrites "hook" (the on-screen line for the first 3 s) and "caption_title", and checks
  #      "facecam" against "check_frame" (red box; fix the fractions, or [] for full-frame layout).
  python3 clips/run.py make <work_dir> [--post]   # render every non-skipped clip; --post publishes
  #   to Instagram + Facebook, logs to clips/log.csv, writes clips/whop_todo.md (links to submit
  #   on contentrewards.com within 30 minutes of posting; older posts can never be submitted)

Only streamers listed in clips/config.json are ever clipped, and each needs a "campaign":
proof that we're allowed to (a Whop campaign or the streamer's own clipping program).
Streamer entry:
  {"twitch": "login", "name": "Display Name", "campaign": "Whop campaign URL or program name",
   "facecam": "auto" | [x, y, w, h] | null,   # auto-detect, fixed fractions, or no facecam layout
   "tags": ["#campaign", "#tags"], "caption_note": "text the campaign requires"}
"""
import csv
import json
import re
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

CONFIG = HERE / "config.json"
LOG = HERE / "log.csv"
WHOP_TODO = HERE / "whop_todo.md"
FIELDS = ["date", "streamer", "campaign", "clip_id", "clip_url", "clip_views", "title", "hook",
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
    """Default hook from the viewer-written Twitch clip title; the supervisor usually rewrites it."""
    t = re.sub(r"(?i)\b(clip|twitch)\b", "", title)
    t = re.sub(r"\s+", " ", t).strip(" -|:")
    return (t[:57] + "...") if len(t) > 60 else t


def caption(streamer: dict, title: str, cfg: dict) -> str:
    # Content Rewards: a clear disclosure at the start of every clip and caption, whatever the brief says.
    parts = [f"#ad {title.strip()}", "", f"Credit: {streamer['name']} (twitch.tv/{streamer['twitch']})"]
    if streamer.get("caption_note"):
        parts.append(streamer["caption_note"])
    parts.append(" ".join(streamer.get("tags", []) + cfg["hashtags"]))
    return "\n".join(parts)


def plan(work: Path, cfg: dict) -> Path:
    from facecam import detect
    from transcribe import transcribe
    from twitch import Twitch, download

    tw, done, picks = Twitch(), logged_ids(), []
    for s in cfg["streamers"]:
        for c in tw.top_clips(s["twitch"], cfg["lookback_hours"]):
            if c["id"] not in done and c["view_count"] >= cfg["min_clip_views"]:
                picks.append((s, c))
    picks.sort(key=lambda sc: sc[1]["view_count"], reverse=True)

    items = []
    for s, c in picks[:cfg["max_clips_per_run"]]:
        src = download(c["url"], work / "src" / f"{c['id']}.mp4")
        words = transcribe(src)
        cam = s.get("facecam", "auto")
        box = list(detect(src) or []) if cam == "auto" else cam
        items.append({
            "clip_id": c["id"], "streamer": s["twitch"], "clip_url": c["url"], "clip_views": c["view_count"],
            "title": c["title"], "src": str(src), "words": words,
            "transcript": " ".join(w["word"].strip() for w in words),
            "facecam": box, "check_frame": str(review_frame(src, box, work / "src" / f"{c['id']}.check.jpg")),
            "hook": hook_from_title(c["title"]), "caption_title": c["title"], "skip": False,
        })
    out = work / "plan.json"
    out.write_text(json.dumps(items, indent=1) + "\n")
    return out


def review_frame(src: Path, box: list | None, out: Path) -> Path:
    """One frame from the middle of the clip with the facecam box drawn in red, for the supervisor's review.
    Auto-detection misses turned heads and can mark a static object, so every box gets checked by eye."""
    import cv2
    cap = cv2.VideoCapture(str(src))
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) // 2)
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError(f"can't read a frame from {src}")
    if box:
        h, w = frame.shape[:2]
        x, y, bw, bh = box
        cv2.rectangle(frame, (int(x * w), int(y * h)), (int((x + bw) * w), int((y + bh) * h)), (0, 0, 255), 6)
    cv2.imwrite(str(out), cv2.resize(frame, (960, 540)))
    return out


def make(work: Path, cfg: dict, post: bool) -> None:
    from render_clip import render
    if post:
        from meta import post_facebook, post_instagram
    streamers = {s["twitch"]: s for s in cfg["streamers"]}
    posted = []
    for it in json.loads((work / "plan.json").read_text()):
        if it["skip"]:
            continue
        s = streamers[it["streamer"]]  # KeyError = not permitted: stop
        out = render(Path(it["src"]), it["words"], it["hook"], work / "out" / f"{it['clip_id']}.mp4",
                     tuple(it["facecam"]) if it["facecam"] else None, s["twitch"])
        row = {"date": str(date.today()), "streamer": s["twitch"], "campaign": s["campaign"],
               "clip_id": it["clip_id"], "clip_url": it["clip_url"], "clip_views": it["clip_views"],
               "title": it["title"], "hook": it["hook"], "ig_media_id": "", "ig_url": "",
               "fb_video_id": "", "fb_url": "", "whop_submitted": "no"}
        if post:  # review-only runs don't log, so the same clips can still be posted
            text = caption(s, it["caption_title"], cfg)
            row["ig_media_id"], row["ig_url"] = post_instagram(out, text)
            row["fb_video_id"], row["fb_url"] = post_facebook(out, text)
            append_log(row)
            posted.append(row)
        print(f"{it['clip_id']}\t{out}\t{row['ig_url']}")
    if post:
        write_whop_todo(posted)


def write_whop_todo(posted: list[dict]) -> None:
    """This run's links, grouped by campaign: Content Rewards only accepts a post under 30 minutes old."""
    deadline = (datetime.now(timezone.utc) + timedelta(minutes=30)).strftime("%H:%M UTC")
    lines = [f"# Submit by {deadline} on contentrewards.com", "",
             "For each campaign: open it, press **Submit clip**, paste its links (one per line), tick the box, "
             "submit. A post older than 30 minutes can never be submitted.", ""]
    by_campaign: dict[str, list[str]] = {}
    for r in posted:
        by_campaign.setdefault(r["campaign"], []).append(r["ig_url"])
    for campaign, urls in by_campaign.items():
        lines += [f"## {campaign}", "", "```", *urls, "```", ""]
    WHOP_TODO.write_text("\n".join(lines))


def main() -> None:
    a = sys.argv[1:]
    if len(a) == 2 and a[0] == "plan":
        print(plan(Path(a[1]), load_config()))
    elif a[:1] == ["make"] and len(a) in (2, 3) and (len(a) == 2 or a[2] == "--post"):
        make(Path(a[1]), load_config(), len(a) == 3)
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
