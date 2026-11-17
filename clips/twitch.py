#!/usr/bin/env python3
"""Find a streamer's most-viewed Twitch clips and download them.

Needs TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET (a free app at dev.twitch.tv/console;
clips/SETUP.md). Listing uses the official Helix API; downloading uses yt-dlp.

  python3 clips/twitch.py top <login> [hours=36]     # list clips, most viewed first
  python3 clips/twitch.py get <clip_url> <out.mp4>    # download one clip
"""
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

HELIX = "https://api.twitch.tv/helix"


class Twitch:
    def __init__(self) -> None:
        r = requests.post("https://id.twitch.tv/oauth2/token", data={
            "client_id": os.environ["TWITCH_CLIENT_ID"],
            "client_secret": os.environ["TWITCH_CLIENT_SECRET"],
            "grant_type": "client_credentials",
        }, timeout=30)
        r.raise_for_status()
        self.s = requests.Session()
        self.s.headers.update({
            "Client-Id": os.environ["TWITCH_CLIENT_ID"],
            "Authorization": f"Bearer {r.json()['access_token']}",
        })

    def get(self, path: str, **params) -> list[dict]:
        r = self.s.get(f"{HELIX}/{path}", params=params, timeout=30)
        if r.status_code >= 400:
            raise RuntimeError(f"GET {path} -> {r.status_code}: {r.text[:300]}")
        return r.json()["data"]

    def user_id(self, login: str) -> str:
        users = self.get("users", login=login)
        if not users:
            raise RuntimeError(f"Twitch user {login!r} not found")
        return users[0]["id"]

    def top_clips(self, login: str, hours: int = 36) -> list[dict]:
        since = (datetime.now(timezone.utc) - timedelta(hours=hours)).strftime("%Y-%m-%dT%H:%M:%SZ")
        clips = self.get("clips", broadcaster_id=self.user_id(login), started_at=since, first=20)
        return sorted(clips, key=lambda c: c["view_count"], reverse=True)


def download(clip_url: str, out: Path) -> Path:
    import yt_dlp
    out.parent.mkdir(parents=True, exist_ok=True)
    opts = {"outtmpl": str(out), "format": "best[ext=mp4]/best", "quiet": True, "overwrites": True}
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([clip_url])
    if not out.is_file():
        raise RuntimeError(f"download produced no file for {clip_url}")
    return out


def main() -> None:
    args = sys.argv[1:]
    if len(args) in (2, 3) and args[0] == "top":
        clips = Twitch().top_clips(args[1], int(args[2]) if len(args) == 3 else 36)
        print(json.dumps([{k: c[k] for k in ("id", "url", "title", "view_count", "duration", "created_at")}
                          for c in clips], indent=2))
    elif len(args) == 3 and args[0] == "get":
        print(download(args[1], Path(args[2])))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
