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

## What runs automatically
Software choice and the GitHub comparison: `clips/TOOLS.md`. Each day the supervisor (Claude, in its own cloud session on environment `branden-chatclipped`, daily at 7:41 UTC) runs:

1. `python3 clips/run.py plan <dir>`: most-viewed Twitch clips (last 36 h) of each permitted streamer → download → word-level transcript → auto facecam box → `plan.json`.
2. **The supervisor reviews `plan.json`:** skips rule-breakers (music, story spoilers, hateful/sexual content, weak moments) and writes the hook and caption.
3. `python3 clips/run.py make <dir> --post`: render 1080x1920 (facecam over gameplay, hook, captions, @chatclipped) → post Instagram + Facebook Reels → log → `clips/whop_todo.md`.
4. Reads Instagram views into the scorecard, drops weak streamers/campaigns, reports.

| Part | File | Tested |
|---|---|---|
| Clip finder + downloader | `clips/twitch.py` | Needs Twitch keys (live test on the supervisor environment) |
| Transcript | `clips/transcribe.py` | Needs package install (supervisor environment) |
| Facecam finder | `clips/facecam.py` | Needs OpenCV install (supervisor environment) |
| Vertical render | `clips/render_clip.py` | **Yes** (`clips/test/run_test.sh`, Nov 17) |
| Plan/make orchestration, permission check, skip handling | `clips/run.py` | **Make step yes**; plan step live |
| Instagram + Facebook posting | `clips/meta.py` | Needs Meta keys |

**Warm-up:** brand-new accounts that post many API videos on day one risk being flagged as spam, so we start at **3 clips/day** for the first week (`max_clips_per_run` in config) and raise it to 6, then 10. This is a precaution, not a published Meta rule.

**The one manual step left: submitting links in Whop.** Whop's submission API needs a logged-in user's permission (it can't be done with an account key), and it isn't confirmed that Content Rewards uses it. Until then, owners paste the day's links from `clips/whop_todo.md` into Whop (about 2 minutes). Submit soon after posting: views count from when the link is tracked.

## Owners' time
- One-time: about 60 minutes (`clips/SETUP.md`).
- Daily: about 5 minutes. Submit links in Whop, glance at the posts, and tell the agent about new campaigns.

## Timeline
| When | What |
|---|---|
| **Tomorrow (Nov 18)** | Owners: all of `clips/SETUP.md` (about 60 min) and send campaigns. Supervisor: same day, fills `config.json`, runs plan + make, sends 2 renders for review; on the owners' OK, first posts. |
| Nov 19 onward | Autopilot at 3/day (week 1), then 6, then 10. Owners: 2–5 min/day submitting Whop links. |
| Week 2 | 8–10 clips/day across 3–5 campaigns. Drop campaigns under ~$1 per 1,000 views or with rejected clips; add new ones. |
| Dec 6 checkpoint | Earnings per clip, per campaign, per hour of owner time → keep, change or stop. |
| Month 2 | If clips average 10K+ views: one-page media kit with our numbers, then outreach to 50 small streamers, artists and apps offering view campaigns. That's the broker step. |

## Honest expectations
- Whop's own numbers: $2.58M paid to 8,466 earners by early 2026, **about $305 per earner on average**. Most clippers earn little; a few earn a lot by posting fast, in volume, with strong hooks.
- At $1–3 per 1,000 views, 100K views comes to about $100–300. Getting to $1M means owning the broker side (step 3), not clipping alone.
