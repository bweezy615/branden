#!/usr/bin/env python3
"""Publish a vertical video as an Instagram Reel and a Facebook Page Reel (Meta Graph API).

Needs (clips/SETUP.md, Part C): META_PAGE_ID, META_IG_USER_ID, META_PAGE_TOKEN
(a long-lived Page access token with instagram_basic, instagram_content_publish,
pages_show_list, pages_read_engagement, pages_manage_posts).

Limits (Meta docs, Nov 2026): Instagram 100 API posts / 24 h; Facebook Reels 30 / 24 h.

  python3 clips/meta.py ig <video.mp4> <caption>    # prints media id + permalink
  python3 clips/meta.py fb <video.mp4> <caption>    # prints video id + link
  python3 clips/meta.py views <ig_media_id>
"""
import os
import sys
import time
from pathlib import Path

import requests

VERSION = "v25.0"
GRAPH = f"https://graph.facebook.com/{VERSION}"
POLL_S, POLL_MAX = 5, 120  # wait up to 10 min for Meta to process a video


def _token() -> str:
    return os.environ["META_PAGE_TOKEN"]


def _call(method: str, url: str, **kw) -> dict:
    r = requests.request(method, url, timeout=kw.pop("timeout", 60), **kw)
    if r.status_code >= 400:
        raise RuntimeError(f"{method} {url.split('?')[0]} -> {r.status_code}: {r.text[:500]}")
    return r.json()


def _upload_bytes(upload_url: str, video: Path) -> None:
    data = video.read_bytes()
    _call("POST", upload_url, data=data, timeout=600, headers={
        "Authorization": f"OAuth {_token()}", "offset": "0", "file_size": str(len(data)),
    })


def post_instagram(video: Path, caption: str) -> tuple[str, str]:
    ig = os.environ["META_IG_USER_ID"]
    container = _call("POST", f"{GRAPH}/{ig}/media", data={
        "media_type": "REELS", "upload_type": "resumable", "caption": caption,
        "share_to_feed": "true", "access_token": _token(),
    })["id"]
    _upload_bytes(f"https://rupload.facebook.com/ig-api-upload/{VERSION}/{container}", video)
    for _ in range(POLL_MAX):
        status = _call("GET", f"{GRAPH}/{container}", params={"fields": "status_code", "access_token": _token()})["status_code"]
        if status == "FINISHED":
            break
        if status in ("ERROR", "EXPIRED"):
            raise RuntimeError(f"Instagram processing {status} for container {container}")
        time.sleep(POLL_S)
    else:
        raise RuntimeError(f"Instagram container {container} still processing after {POLL_S * POLL_MAX} s")
    media = _call("POST", f"{GRAPH}/{ig}/media_publish", data={"creation_id": container, "access_token": _token()})["id"]
    link = _call("GET", f"{GRAPH}/{media}", params={"fields": "permalink", "access_token": _token()})["permalink"]
    return media, link


def post_facebook(video: Path, caption: str) -> tuple[str, str]:
    page = os.environ["META_PAGE_ID"]
    start = _call("POST", f"{GRAPH}/{page}/video_reels", data={"upload_phase": "start", "access_token": _token()})
    _upload_bytes(start["upload_url"], video)
    _call("POST", f"{GRAPH}/{page}/video_reels", data={
        "upload_phase": "finish", "video_id": start["video_id"], "video_state": "PUBLISHED",
        "description": caption, "access_token": _token(),
    })
    return start["video_id"], f"https://www.facebook.com/reel/{start['video_id']}"


def instagram_views(media_id: str) -> int:
    data = _call("GET", f"{GRAPH}/{media_id}/insights", params={"metric": "views", "access_token": _token()})["data"]
    return int(data[0]["values"][0]["value"])


def main() -> None:
    args = sys.argv[1:]
    if len(args) == 3 and args[0] in ("ig", "fb"):
        post = post_instagram if args[0] == "ig" else post_facebook
        print(*post(Path(args[1]), args[2]))
    elif len(args) == 2 and args[0] == "views":
        print(instagram_views(args[1]))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
