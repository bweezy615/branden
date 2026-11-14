# GTA VI content business: operating file

Single source of truth. The supervisor agent reads this first every run, works its queue, then updates **Status**, **Scorecard** and **Log** and pushes to `claude/clever-tesla-lza1gp`. Playbook: `.claude/skills/gta6-business/SKILL.md`.

## Key dates
- Unlock: **midnight local time, Thu Nov 19, 2026**, PS5 and Xbox Series X|S. Install up to 212 GB; pre-load opened Nov 10 (Rockstar).
- **Feb 1, 2027**: YouTube Partner Program bar doubles for new applicants. Qualify and apply before then.
- Checkpoints: **Dec 6** and **Jan 3**: double down or change course.

## Strategy decision
_Decided Nov 14, 2026 (first supervisor run). Revisit at the Dec 6 and Jan 3 checkpoints._

**One goal until Feb 1, 2027: get into the YouTube Partner Program before the bar doubles.** Today: 1,000 subs + 4,000 public watch hours (12 months) or 10M Shorts views (90 days). New applicants from Feb 1: 8,000 hours or 20M Shorts views ([YouTube Blog](https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/)). Shorts views don't count toward watch hours, so long-form carries the goal: 4,000 h is about 48K views at a 5-minute average view, or 24K at 10 minutes.

| Choice | Decision | Why |
|---|---|---|
| **Primary format** | YouTube long-form **search guides**, 8–12 min, one topic each, spoiler-free, from the owners' own gameplay | The only format that builds watch hours fast. Launch-week searches ("settings", "beginner tips", "make money", "best cars", "where to find") keep ranking for weeks. Small channels broke out pre-launch with narrow single-topic videos; generic news didn't ([vidIQ](https://vidiq.com/blog/post/gta-6-youtube-channel/)). |
| **Funnel** | YouTube **Shorts**, 2/day, each a fresh edit cut from the same footage; caption-led with game audio | Cheap reach and subscribers. Shorts pay almost nothing (gaming ~$0.01–0.20 per 1,000 views, per research notes), so they exist to feed the long videos. |
| **Second platform** | **TikTok**, 1/day, 61–90 s versions posted by hand from the phone | Creator Rewards needs 10K followers, 100K views/30 days and videos over 1 minute (third-party summaries of TikTok's rules; TikTok's page blocks our scraper). Unlikely to pay before Jan, but it's 2 min/day of extra reach. |
| **Not now** | Instagram/Facebook, Twitch/Kick, newsletter, Discord | Meta monetization is invite-only; streaming pays ~0 below ~50 viewers and eats live hours; a newsletter/Discord with no audience is setup time with no return. **Trigger:** launch beehiiv + Discord at 500 subscribers or the Dec 6 checkpoint, whichever is first. |
| **Narration** | **Owner's own voice** on long-form (phone voice memo, about 10 min per video). Shorts: captions + game audio, plus owner VO lines lifted from the long video. **No synthetic voice.** | See below. |
| **Cadence, Nov 19 – Dec 6** | 4 long videos/week (launch week: Nov 19, 20, 22, 24), 2 Shorts/day, 1 TikTok/day | Matches the 30 min/day human budget below. More long videos only if the owners want to spend more time. |
| **Publishing** | Agent uploads to YouTube as **private** via the YouTube Data API; owners check and set Public/Schedule. TikTok posted by hand. | Uploading through the API is now allowed from an unverified project without forced-private mode and is 1 call of a 100/day upload bucket ([videos.insert reference, updated Nov 12, 2026](https://developers.google.com/youtube/v3/docs/videos/insert)). The owners keep the final say on everything public. |

**Why the owner's voice, not captions-only or a synthetic voice.** All three are monetizable on paper. YouTube doesn't ban AI voices, and its help page says disclosure is only required for *realistic* AI depictions and "won't limit a video's audience or impact its eligibility to earn money" ([YouTube Help](https://support.google.com/youtube/answer/14328491)). The decision turns on risk and on cost:
1. **YPP review is a human check of "is this yours?".** YouTube's policy demonetizes "AI-generated content made with generic or unoriginal templates giving the impression of mass production" and asks reviewers to check "how you created, participated in, or produced your content" ([YouTube monetization policies](https://support.google.com/youtube/answer/1311392)). A brand-new faceless gameplay channel applying in January, during YouTube's anti-"AI slop" push, is exactly what reviewers scrutinize. A real person's voice explaining their own gameplay is the strongest evidence we can give. One rejection costs a 30-day wait (re-verify when we apply), which could push us past Feb 1.
2. **TikTok** says videos "produced primarily by artificial intelligence" don't count in at least one of its creator programs and runs AI detection (TikTok Creator Growth Challenge terms, via search); a TTS voice puts Creator Rewards at risk.
3. **Captions-only** long-form loses viewers faster, and average view duration *is* the watch-hour metric. Fine for Shorts, wrong for the long videos.
4. **Cost.** A good synthetic voice costs money (we don't spend) or needs model downloads our network doesn't allow. The owner's voice costs ~10 minutes per long video.

**Human time budget (beyond playing, which they'd do anyway):** clip transfer 10 min + voice memo 10 min (on long-video days) + YouTube check/publish 5 min + TikTok post 2 min ≈ **25–30 min/day**.

**Revisit triggers:** Dec 6: if long videos average under 1,000 views, shift to more Shorts and test which topics pull; if any video passes 20K, make three follow-ups on the same topic. If owners can't keep up with voiceover, test captions-only long-form on one video and compare retention before changing.

## Status
- Tracker app: **dropped** by the owners (Nov 14).
- Supervisor agent: set up Nov 14, with a daily run.
- Intake location for raw clips: **Google Drive `Clips IN` folder on a business Google account**, designed; owners haven't set it up yet (`gta6/SETUP.md`).
- Publishing: agent uploads to YouTube as private via API once credentials exist; TikTok posted by hand.
- Brand/channel name: **not chosen**; 5 options below.
- Pipeline: `gta6/pipeline/render.py` works (long 16:9 + 9:16 Shorts, captions, voiceover mix, -14 LUFS); tested on synthetic clips Nov 14. Drive and YouTube API scripts come next, once credentials exist.
- Scripts ready: v001 settings, v002 beginner tips, v003 map drive (`gta6/creator/scripts/`). Queue: `gta6/creator/queue.md`.

## Owners' checklist (only humans can do these)
Do them in this order. Full click-by-click steps: **`gta6/SETUP.md`**.

1. **Pick the channel name** (5 min). Options, all checked Nov 14: .com unregistered (registrar lookup) and the YouTube @handle URL returns "not found" (a 404 means no channel uses it; confirm in YouTube's handle picker). None contain a red-line word.

   | # | Name | @handle | .com | Note |
   |---|---|---|---|---|
   | 1 | **Map Marker Guides** (recommended) | @mapmarkerguides | mapmarkerguides.com | Says exactly what the channel is; works for any open-world game after GTA VI; no known brand conflict |
   | 2 | Pin Drop Guides | @pindropguides | pindropguides.com | Catchiest, but "Pindrop" is a known voice-security company; different field, small confusion risk |
   | 3 | Quicksave Guides | @quicksaveguides | quicksaveguides.com | Gamer-friendly; generic word others use |
   | 4 | Salt Air Guides | @saltairguides | saltairguides.com | Coastal mood that fits the setting without naming it |
   | 5 | Night Drive Guides | @nightdriveguides | nightdriveguides.com | Atmosphere; slightly narrower (driving) |

   Don't buy the domain yet; we don't need a site. Reply in chat with the pick.
2. **Part A of SETUP.md: business Google account + YouTube channel + phone verification** (15 min). Paste the channel link in chat.
3. **Parts B–C: Drive folders and console capture settings** (10 min).
4. **Part E: give the agent access** (25–30 min, once). Ideally before Nov 19 so launch-day clips flow automatically.
5. **Nov 19 onward, daily: play, capture from the shopping list, transfer clips + voice memo to `Clips IN`** (Part D, ~20 min), then **check and publish** (Part F, ~7 min).
6. **TikTok account** (optional, 5 min): create it under the same name; post the daily `-tiktok.mp4` from `Renders OUT`.
7. **Later, when the agent asks:** Amazon Associates, beehiiv, YPP application. You do tax and payout forms.

## Supervisor's queue
- [x] First run: research and record the **Strategy decision** (Nov 14).
- [x] First run: clip intake and publishing setup researched; steps in `gta6/SETUP.md` (Nov 14).
- [x] First run: 5 channel names proposed (Nov 14).
- [x] Build the `ffmpeg` render pipeline, tested on synthetic clips (Nov 14).
- [ ] When credentials exist: `drive.py` (intake/output), `youtube.py` (private upload + analytics), thumbnail maker, voice-memo splitter (silence detection at the 2-second pauses).
- [x] First 3 scripts + queue written (Nov 14). Ongoing: keep at least 3 scripts ready in `gta6/creator/scripts/` and a topic queue in `gta6/creator/queue.md`.
- [ ] Daily: Rockstar news check. Plan triggers: online mode, PC date, creator platform.
- [ ] Dec 6 checkpoint report.

## Scorecard
| Date | Subs | Watch hours (12 mo) | Shorts views (90 d) | Videos posted | Revenue | Notes |
|---|---|---|---|---|---|---|

## Log
- Nov 9: Research report written.
- Nov 11: Tracker app built; creator kit drafted; launch facts checked against Rockstar's pages.
- Nov 14: Owners dropped the tracker and asked for an autonomous content business. Tracker removed. Supervisor playbook written; supervisor agent hired with a daily run.
- Nov 14 (supervisor run 1): Strategy decided (owner-voiced long-form guides + Shorts funnel + TikTok; YPP before Feb 1 is the goal). Intake/publishing designed around a business Google account (Drive + YouTube API, private uploads). 5 names proposed. Queue + scripts v001–v003 written. Render pipeline built and tested. News: launch still Nov 19, pre-load live since Nov 10; nothing plan-changing.
