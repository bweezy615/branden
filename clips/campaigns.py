#!/usr/bin/env python3
"""Shortlist open Content Rewards (Whop) campaigns that Clipamole can join.

Usage: python3 clips/campaigns.py <out.md> [<out.json>]

Reads the public sitemap, fetches each public campaign page (plain HTML; robots.txt only
disallows /api/), and reads the campaign record embedded in the page. Keeps campaigns that:
  - are active, public and pay per 1,000 views (CPM),
  - pay on Instagram (the one Content Rewards platform we post to),
  - are tagged Streamer or link a Twitch/Kick channel (we clip streams, not game or app ads),
  - have at least MIN_REMAINING_USD of budget left,
  - aren't gambling, casino or crypto by category or text (clips/PLAN.md rule 4).
Writes a ranked Markdown table for the owners and, optionally, the raw rows as JSON.
"""
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import requests

SITE = "https://contentrewards.com"
UA = {"User-Agent": "Mozilla/5.0 (compatible; campaign-shortlist)"}
MIN_REMAINING_USD = 300
WORKERS = 4
BANNED = re.compile(r"\b(casino|gambl\w*|slots?|betting|sportsbook|crypto\w*|stake\.com|roobet|rollbit|memecoin)\b", re.I)
CHANNEL = re.compile(r"(?:twitch\.tv|kick\.com)/([A-Za-z0-9_]+)", re.I)
STREAM_CATEGORY = "streamer"
BANNED_CATEGORIES = {"crypto", "gambling", "casino", "betting"}


def campaign_urls() -> list[str]:
    xml = requests.get(f"{SITE}/sitemap.xml", headers=UA, timeout=30)
    xml.raise_for_status()
    return sorted(set(re.findall(r"<loc>(https://contentrewards\.com/c/campaigns/[0-9a-f-]{36})</loc>", xml.text)))


def page_record(url: str) -> dict:
    """The campaign object the page embeds in its Next.js flight data."""
    r = requests.get(url, headers=UA, timeout=30)
    r.raise_for_status()
    chunks = re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>', r.text, re.S)
    flight = "".join(json.loads(f'"{c}"') for c in chunks)
    key = flight.find('"queryKey":["campaigns","discover-card"')
    if key < 0:
        raise ValueError(f"no campaign record in {url}")
    start = flight.rfind('"state":{"data":', 0, key) + len('"state":{"data":')
    record, _ = json.JSONDecoder().raw_decode(flight[start:])
    return record


def row(c: dict) -> dict | None:
    """Flatten a campaign into a shortlist row, or None if we can't or shouldn't join it."""
    if c["status"] != "active" or c["private"] or c["payoutType"] != "cpm":
        return None
    ig = next((p for p in c["payouts"] if p["platform"] == "instagram" and p["payoutType"] == "cpm"), None)
    if not ig or not ig["rateCents"]:
        return None
    text = f"{c['name']}\n{c.get('description') or ''}"
    cats = {x["id"] for x in c.get("categories") or []}
    if BANNED.search(text) or cats & BANNED_CATEGORIES:
        return None
    channels = sorted({m.lower() for m in CHANNEL.findall(text)})
    if STREAM_CATEGORY not in cats and not channels:
        return None
    m = c["metrics"]
    remaining = (c["budgetCents"] - m["budgetSpentCents"]) / 100
    if remaining < MIN_REMAINING_USD:
        return None
    return {
        "name": c["name"], "url": f"{SITE}/c/campaigns/{c['id']}", "org": c["organizationName"],
        "categories": sorted(cats), "channels": channels,
        "ig_cpm": ig["rateCents"] / 100, "ig_min": ig["minPayoutCents"] / 100, "ig_max": ig["maxPayoutCents"] / 100,
        "budget": c["budgetCents"] / 100, "remaining": remaining,
        "creators": m["creatorCount"], "views": m["totalViews"],
        "application": c["requiresApplication"], "listed": (c.get("listedAt") or "")[:10],
    }


def fetch_all(urls: list[str]) -> tuple[list[dict], int]:
    def one(u: str) -> dict | None:
        time.sleep(0.25)  # stay polite: ~4 workers x 4 req/s at most
        try:
            return row(page_record(u))
        except (requests.RequestException, ValueError, KeyError) as e:
            print(f"skip {u}: {e}", file=sys.stderr)
            return None
    with ThreadPoolExecutor(WORKERS) as pool:
        rows = [r for r in pool.map(one, urls) if r]
    return rows, len(urls)


def markdown(rows: list[dict], scanned: int) -> str:
    rows = sorted(rows, key=lambda r: (r["ig_cpm"], r["remaining"]), reverse=True)
    out = [f"# Open streamer campaigns paying on Instagram ({time.strftime('%b %d, %Y %H:%M UTC', time.gmtime())})", "",
           f"Scanned {scanned} public Content Rewards campaigns; {len(rows)} match: active, CPM, pays on Instagram, "
           f"tagged Streamer or links a Twitch/Kick channel, at least ${MIN_REMAINING_USD} left, no gambling/crypto. "
           "Rates are listed rates before Content Rewards' 10% fee. **Views per creator** hints at how much each "
           "clipper is getting; very low numbers can mean strict approval.", "",
           "| # | Campaign | IG $/1K | Cap/clip | Left | Creators | Views/creator | Channels | Apply? |",
           "|---|---|---|---|---|---|---|---|---|"]
    for i, r in enumerate(rows, 1):
        vpc = r["views"] // r["creators"] if r["creators"] else 0
        out.append(f"| {i} | [{r['name']}]({r['url']}) ({r['org']}) | ${r['ig_cpm']:.2f} | ${r['ig_max']:,.0f} | "
                   f"${r['remaining']:,.0f} of ${r['budget']:,.0f} | {r['creators']} | {vpc:,} | "
                   f"{', '.join(r['channels']) or '-'} | {'yes' if r['application'] else 'no'} |")
    return "\n".join(out) + "\n"


def main() -> None:
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    rows, scanned = fetch_all(campaign_urls())
    Path(sys.argv[1]).write_text(markdown(rows, scanned))
    if len(sys.argv) == 3:
        Path(sys.argv[2]).write_text(json.dumps(rows, indent=1) + "\n")
    print(f"{len(rows)} of {scanned} campaigns shortlisted -> {sys.argv[1]}")


if __name__ == "__main__":
    main()
