# ChatClipped: plan

Updated Nov 17, 2026. Owners chose the name **ChatClipped** (@chatclipped) and the platforms **Instagram + Facebook + Whop Content Rewards**. Goal: run as autonomously as possible. Research behind this plan: `clips/RESEARCH.md`. Setup steps: `clips/SETUP.md`.

## How it makes money, in order
1. **Whop campaigns (now):** streamers and brands pay ~$1–3 per 1,000 views for clips of their content. Instagram Reels count; Facebook doesn't (Whop only tracks TikTok, YouTube, Instagram and X).
2. **Streamers' own clipper programs (weeks 1–4):** some pay directly (N3on paid $1.4M to 303 clippers in 5 weeks at $40–50 per 100K views).
3. **Become the broker (month 2+):** this is where every $1M+ clipping business made its money. Sell view campaigns to small streamers, musicians and startups at a CPM (from a $2–3K minimum, keeping 20–30%), and pay other clippers through Whop to do the posting. Our own view counts are the sales pitch, so steps 1–2 are also collecting proof.
4. **Not counted on:** Facebook and Instagram ad payouts. Meta cuts monetization and reach for accounts that repost other people's videos (July 2025; tightened March 2026), and since April 30, 2026 Instagram stops recommending accounts that mostly repost untransformed content.

## Rules (hard-coded where possible)
1. **Permission only.** `clips/run.py` refuses to clip any streamer not listed in `clips/config.json` with a campaign or program. A streamer is added only when we've joined their Whop campaign or their own clipping program.
2. **Transform every clip:** our vertical layout (facecam over gameplay), a hook line in the first 3 seconds, word-by-word captions and the @chatclipped tag. This is what keeps Instagram recommending us.
3. **Credit the streamer** in every caption. Remove a clip the same day if they ask.
4. **Skip** clips with music playing, GTA VI story cutscenes, and gambling or crypto-casino campaigns.
5. **Disclose** paid campaigns where the campaign or platform asks (#ad / paid-partnership label); the campaign's required tags go in config.
6. **No view-botting or engagement buying, ever.** Whop bans permanently and takes the losses from earnings.

## What runs automatically (built Nov 17)
| Step | File | Status |
|---|---|---|
| Find the most-viewed clips of each permitted streamer in the last 36 h (Twitch API) | `clips/twitch.py` | Written; needs Twitch keys + new environment |
| Download them | `clips/twitch.py` (yt-dlp) | Written; same |
| Word-by-word transcript (faster-whisper, free, runs locally) | `clips/transcribe.py` | Written; needs the package install + model download |
| Render vertical 1080x1920: facecam on top, gameplay below (or full frame over blur), hook, captions, tag, -14 LUFS | `clips/render_clip.py` | **Tested** on synthetic clips |
| Post Instagram Reel + Facebook Reel with caption, credit and campaign tags | `clips/meta.py` | Written to Meta's current docs; needs Meta keys |
| Log every clip (dedupe + scorecard); list links to submit in Whop | `clips/run.py` → `clips/log.csv`, `clips/whop_todo.md` | Written |
| Daily: run, read Instagram views, pick tomorrow's streamers, report | supervisor daily run | Moves to a session on the new environment once keys exist |

**The one manual step left: submitting links in Whop.** Whop's submission API needs a logged-in user's permission (it can't be done with an account key), and it isn't confirmed that Content Rewards uses it. Until then, owners paste the day's links from `clips/whop_todo.md` into Whop (about 2 minutes). Submit soon after posting: views count from when the link is tracked.

## Owners' time
- One-time: about 60 minutes (`clips/SETUP.md`).
- Daily: about 5 minutes. Submit links in Whop, glance at the posts, and tell the agent about new campaigns.

## Timeline
| When | What |
|---|---|
| **Tonight** | Owners: SETUP Parts A–B (accounts, Whop) and send the agent 10–20 campaigns. |
| **Next 1–2 days** | Owners: SETUP Parts C–E (keys). Agent: test run → 2 renders for owner review → first post → daily autopilot at **6 clips/day**. |
| Week 2 | 8–10 clips/day across 3–5 campaigns. Drop campaigns under ~$1 per 1,000 views or with rejected clips; add new ones. |
| Dec 6 checkpoint | Earnings per clip, per campaign, per hour of owner time → keep, change or stop. |
| Month 2 | If clips average 10K+ views: one-page media kit with our numbers, then outreach to 50 small streamers, artists and apps offering view campaigns. That's the broker step. |

## Honest expectations
- Whop's own numbers: $2.58M paid to 8,466 earners by early 2026, **about $305 per earner on average**. Most clippers earn little; a few earn a lot by posting fast, in volume, with strong hooks.
- At $1–3 per 1,000 views, 100K views comes to about $100–300. Getting to $1M means owning the broker side (step 3), not clipping alone.
