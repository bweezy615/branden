#!/usr/bin/env python3
"""Drive intake/output, private YouTube uploads and channel stats for the pipeline.

Needs GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN (gta6/SETUP.md, Part E).

  python3 gta6/pipeline/google_api.py pull <dir>             # new files from Drive "Clips IN" -> dir
  python3 gta6/pipeline/google_api.py push <dir> <name>      # dir's files -> Drive "Renders OUT/<name>"
  python3 gta6/pipeline/google_api.py upload <video> <meta.json>   # YouTube, always private
  python3 gta6/pipeline/google_api.py stats                  # channel totals + last 90 days

meta.json: {"title": ..., "description": ..., "tags": [...], "categoryId": "20"}
"""
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

import requests

API = "https://www.googleapis.com"
INTAKE, OUTPUT = "Clips IN", "Renders OUT"
FOLDER = "application/vnd.google-apps.folder"
CHUNK = 64 * 1024 * 1024  # resumable upload chunk (multiple of 256 KiB)


def token() -> str:
    r = requests.post("https://oauth2.googleapis.com/token", data={
        "client_id": os.environ["GOOGLE_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
        "refresh_token": os.environ["GOOGLE_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }, timeout=30)
    r.raise_for_status()
    return r.json()["access_token"]


class Google:
    def __init__(self) -> None:
        self.s = requests.Session()
        self.s.headers["Authorization"] = f"Bearer {token()}"

    def call(self, method: str, url: str, **kw) -> requests.Response:
        r = self.s.request(method, url, timeout=kw.pop("timeout", 60), **kw)
        if r.status_code >= 400:
            raise RuntimeError(f"{method} {url} -> {r.status_code}: {r.text[:500]}")
        return r

    # ---- Drive ----
    def find(self, q: str) -> list[dict]:
        files, page = [], None
        while True:
            params = {"q": f"{q} and trashed = false", "pageSize": 1000,
                      "fields": "nextPageToken, files(id, name, mimeType, size, createdTime)"}
            if page:
                params["pageToken"] = page
            body = self.call("GET", f"{API}/drive/v3/files", params=params).json()
            files += body["files"]
            page = body.get("nextPageToken")
            if not page:
                return files

    def folder(self, name: str, parent: str = "root") -> str:
        hits = self.find(f"name = '{name}' and mimeType = '{FOLDER}' and '{parent}' in parents")
        if len(hits) == 1:
            return hits[0]["id"]
        if hits:
            raise RuntimeError(f"{len(hits)} Drive folders named {name!r}; keep exactly one")
        if parent == "root":
            raise RuntimeError(f"Drive folder {name!r} not found in My Drive (gta6/SETUP.md, Part B)")
        meta = {"name": name, "mimeType": FOLDER, "parents": [parent]}
        return self.call("POST", f"{API}/drive/v3/files", json=meta).json()["id"]

    def pull(self, dest: Path) -> list[Path]:
        dest.mkdir(parents=True, exist_ok=True)
        got = []
        for f in sorted(self.find(f"'{self.folder(INTAKE)}' in parents"), key=lambda f: f["createdTime"]):
            out = dest / f["name"]
            if f["mimeType"] == FOLDER or (out.exists() and out.stat().st_size == int(f["size"])):
                continue
            with self.call("GET", f"{API}/drive/v3/files/{f['id']}", params={"alt": "media"},
                           stream=True, timeout=600) as r, open(out, "wb") as fh:
                for block in r.iter_content(CHUNK):
                    fh.write(block)
            got.append(out)
        return got

    def push(self, src: Path, name: str) -> str:
        target = self.folder(name, self.folder(OUTPUT))
        for path in sorted(p for p in src.iterdir() if p.is_file()):
            self.resumable(f"{API}/upload/drive/v3/files?uploadType=resumable",
                           {"name": path.name, "parents": [target]}, path)
        return target

    # ---- YouTube ----
    def upload(self, video: Path, meta: dict) -> str:
        body = {
            "snippet": {"title": meta["title"], "description": meta["description"],
                        "tags": meta["tags"], "categoryId": meta.get("categoryId", "20")},
            "status": {"privacyStatus": "private", "selfDeclaredMadeForKids": False,
                       "containsSyntheticMedia": False},
        }
        url = f"{API}/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status"
        return self.resumable(url, body, video)["id"]

    def stats(self) -> dict:
        ch = self.call("GET", f"{API}/youtube/v3/channels",
                       params={"part": "statistics", "mine": "true"}).json()["items"][0]["statistics"]
        end = date.today()
        report = self.call("GET", "https://youtubeanalytics.googleapis.com/v2/reports", params={
            "ids": "channel==MINE", "startDate": str(end - timedelta(days=90)), "endDate": str(end),
            "metrics": "views,estimatedMinutesWatched,subscribersGained",
        }).json()
        last90 = dict(zip([h["name"] for h in report["columnHeaders"]], report["rows"][0] if report.get("rows") else []))
        return {"channel": ch, "last_90_days": last90}

    # ---- shared ----
    def resumable(self, url: str, meta: dict, path: Path) -> dict:
        size = path.stat().st_size
        start = self.call("POST", url, json=meta, headers={"X-Upload-Content-Length": str(size)})
        session = start.headers["Location"]
        with open(path, "rb") as fh:
            offset = 0
            while True:
                fh.seek(offset)
                block = fh.read(CHUNK)
                end = offset + len(block) - 1
                r = self.s.put(session, data=block, timeout=600,
                               headers={"Content-Range": f"bytes {offset}-{end}/{size}"})
                if r.status_code in (200, 201):
                    return r.json()
                if r.status_code != 308:
                    raise RuntimeError(f"upload {path.name} -> {r.status_code}: {r.text[:500]}")
                # 308: the server says how much it has stored; resume from there.
                offset = int(r.headers["Range"].rsplit("-", 1)[1]) + 1 if "Range" in r.headers else 0


def main() -> None:
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    g = Google()
    if args[0] == "pull" and len(args) == 2:
        for p in g.pull(Path(args[1])):
            print(p)
    elif args[0] == "push" and len(args) == 3:
        print(g.push(Path(args[1]), args[2]))
    elif args[0] == "upload" and len(args) == 3:
        print(g.upload(Path(args[1]), json.loads(Path(args[2]).read_text())))
    elif args[0] == "stats" and len(args) == 1:
        print(json.dumps(g.stats(), indent=2))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
