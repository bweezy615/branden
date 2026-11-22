# GTA VI content business: operating file

Single source of truth. The supervisor agent reads this first every run, works its queue, then updates **Status**, **Scorecard** and **Log** and pushes to `claude/clever-tesla-lza1gp`. Playbook: `.claude/skills/gta6-business/SKILL.md`.

> **Nov 17, 2026: owners pivoted.** The main business is now a **streamer clips channel** paid through clipping campaigns (Whop Content Rewards). Plan and name options: **`clips/PLAN.md`**. The GTA VI guide strategy below is paused, not deleted. The owners' checklist and supervisor queue below now follow the clips plan.

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
- **Instagram @clipamole created (Nov 19, per the parent session, which saw the owners' screenshot).** Handle confirmed, bio set, profile picture `clips/brand/profile.webp`. Still to do: display name "Clip Mole" → "Clipamole | Streamer Clips", and switch to Professional → Creator (needed for API posting and Content Rewards). Not yet confirmed: Facebook Page, TikTok and X handles, contentrewards.com signup, joined campaigns, keys.
- **NAME: Clipamole (@clipamole), owners' pick on Nov 17.** ChatClipped was dropped because @chatclipped on Instagram belongs to a competing clip page. When checked: free on Instagram, YouTube, Twitch, Kick; clipamole.com unregistered; no web mentions. TikTok, X and the Facebook username couldn't be checked: owners claim them at signup and tell the agent which handles they got. Brand and tag live in `clips/config.json` (`brand`, `handle`, hashtags). Environment renamed `branden-clipamole`.
- **Owners OK'd the 2 test renders (Nov 17).** First real posts can go out once accounts, keys and joined campaigns exist, at an owner-chosen posting window.
- **Clipamole pipeline (Nov 17, tested on environment `branden-clipamole`):** download (yt-dlp) → transcribe (faster-whisper "small", CPU, ~6 s per 10 s clip) → render 1080x1920 at about -14 LUFS all **work**, tested on synthetic clips and one public Twitch clip (render kept in scratch only; nothing posted). Both layouts (facecam-over-gameplay and blurred-fit) checked by eye.
- **Hosts:** reachable: graph.facebook.com, rupload.facebook.com, api.whop.com, id/api/gql.twitch.tv, Twitch clip CDN, huggingface.co, Google APIs. Added Nov 17 (were refused): `cas-server.xethub.hf.co`, `us.aws.cdn.hf.co` (Whisper model files), `d1ndex63qxojbr.cloudfront.net` (Twitch clip video). If downloads start failing with a proxy 403, check the proxy status for a new CDN host.
- **Environment setup script** now installs `clips/requirements.txt` (yt-dlp, faster-whisper, OpenCV pinned below 5, PyAV pinned below 18; reasons in the file). Not yet proven in a fresh container.
- **Facecam auto-detect (`clips/facecam.py`)** works with OpenCV 4.14: finds a static face in the corner of a synthetic clip, returns `none` for a clip with no face, and the detected box renders correctly. OpenCV 5 removed the face detector from the main package, hence the pin.
- **Campaign picks (Nov 17, from `clips/campaigns.md`; full scan of 746 public Content Rewards campaigns).** Join these on contentrewards.com: all pay on Instagram, need no application, and the streamer has fresh Twitch clips (checked: 30 clips in the last 7 days each):
  1. **[Boeshi Clipping](https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69)**: $1.50 per 1K, up to $300/clip, $1,742 left, only 4 clippers. Funny gaming moments, drive viewers to twitch.tv/darealboeshi. Best fit.
  2. **[SkiiMaskTimmy](https://contentrewards.com/c/campaigns/9a53cf91-e0ac-4157-bed0-81eb7095827d)**: $1.00, up to $150, $2,242 left, 152 clippers. Needs facecam visible + twitch.tv/skiimasktimmy on every clip (our layout does both).
  3. **[DiegoLoveless](https://contentrewards.com/c/campaigns/5d37d3dd-adf3-401f-9c62-24bb54d5087a)**: $1.50, up to $300, $774 left. Marvel Rivals clips only, with a Twitch call to action.
  4. **[Bobby Van Riper](https://contentrewards.com/c/campaigns/f583b069-ced7-49e5-9ed3-2d3a13d6df0c)**: $1.00, up to $250, $974 left, 5 clippers.
  - Ready-made `clips/config.json` entries. Add each **only after the owners confirm they joined it**:
    ```json
    {"twitch": "darealboeshi", "name": "Boeshi", "campaign": "https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69", "facecam": "auto", "tags": ["#boeshi"]},
    {"twitch": "skiimasktimmy", "name": "SkiiMaskTimmy", "campaign": "https://contentrewards.com/c/campaigns/9a53cf91-e0ac-4157-bed0-81eb7095827d", "facecam": "auto", "tags": ["#skiimasktimmy"]},
    {"twitch": "diegoloveless", "name": "DiegoLoveless", "campaign": "https://contentrewards.com/c/campaigns/5d37d3dd-adf3-401f-9c62-24bb54d5087a", "facecam": "auto", "game": "Marvel Rivals", "tags": ["#marvelrivals"], "caption_note": "Watch live: twitch.tv/diegoloveless"},
    {"twitch": "bobby_vanriper", "name": "Bobby Van Riper", "campaign": "https://contentrewards.com/c/campaigns/f583b069-ced7-49e5-9ed3-2d3a13d6df0c", "facecam": "auto", "tags": ["#bobbyvanriper"]}
    ```
    Campaign rules and reference files unlock only after joining: re-read each brief then and adjust tags/caption_note.
  - Skipped: johndoe_100x ($3 but only $387 left, Miami streams only), SypherPK and IShowSpeed x Expedia (one specific past stream only), TapCap (AI videos), Austin Millz (DJ sets = music), TJR (no Twitch; finance), ThreadGuy (crypto), and several with no Twitch clips.
- **Content Rewards rules that changed our flow (verified on its help center):** (1) a post can only be submitted while it's **under 30 minutes old**, once, ever; (2) every clip needs a **clear disclosure at the start**. So renders now show `#ad` from frame 1 and captions start with `#ad`, and we only post when an owner is free to submit within 30 minutes (PLAN.md). Content Rewards is now its own site (contentrewards.com); Whop only handles withdrawals.
- **Render:** every clip now carries `twitch.tv/<streamer>` (several campaigns require it) and all labels sit inside the Instagram Reels safe zone (clear of the bottom ~400 px and the right-hand buttons).
- **Keys:** no `TWITCH_*` or `META_*` env vars yet, so `twitch.py top` (Twitch API) and posting are untested. `clips/config.json` has no streamers yet (no campaigns joined).
- Tracker app: **dropped** by the owners (Nov 14).
- Supervisor agent: set up Nov 14, with a daily run.
- Intake location for raw clips: **Google Drive `Clips IN` folder on a business Google account**, designed; owners haven't set it up yet (`gta6/SETUP.md`).
- Publishing: agent uploads to YouTube as private via API once credentials exist; TikTok posted by hand.
- Brand/channel name: **not chosen**; 5 options below.
- Pipeline: `render.py` (long + Shorts, captions, voiceover mix, -14 LUFS) and `voice.py` (splits voice memo by pauses) tested on synthetic media. `google_api.py` (Drive pull/push, private YouTube upload, stats) written Nov 15, untested until credentials exist.
- Credentials (`GOOGLE_*` env vars): **not added yet**.
- Scripts ready: v001 settings, v002 beginner tips, v003 map drive (`gta6/creator/scripts/`). Queue: `gta6/creator/queue.md`.

## Owners' checklist (only humans can do these)
Clipamole, see `clips/SETUP.md`:
1. **Part A**: ~~Instagram @clipamole~~ created Nov 19; still: switch it to Professional → Creator, rename display to "Clipamole | Streamer Clips", create the Facebook Page and link them.
2. **Part B**: sign up on contentrewards.com, connect @clipamole there, and **join the 4 campaigns picked under Status**.
3. **Parts C–D**: Twitch app keys, Meta app + Page token.
4. **Part E**: start a session on environment `branden-clipamole`, add the 5 keys, say "keys added".
5. Daily, at a time you choose: say "post", then paste the links the agent sends into Content Rewards **within 30 minutes**.

## Supervisor's queue
- [x] Clipamole pipeline written (Nov 17): `clips/twitch.py`, `transcribe.py`, `render_clip.py` (tested), `meta.py`, `run.py`.
- [x] On the new environment: yt-dlp + faster-whisper installed, model downloads, download→transcribe→render tested (Nov 17).
- [ ] Once keys exist: `twitch.py top <login>` read-only test, then 2 renders for the owners' review before the first post.
- [ ] Pick campaigns from the owners' list; fill `clips/config.json` (facecam box per streamer from a frame).
- [ ] Look into automating Whop submissions (user-OAuth bounty submissions API).
- GTA VI guide items below are paused.
- [x] First run: research and record the **Strategy decision** (Nov 14).
- [x] First run: clip intake and publishing setup researched; steps in `gta6/SETUP.md` (Nov 14).
- [x] First run: 5 channel names proposed (Nov 14).
- [x] Build the `ffmpeg` render pipeline, tested on synthetic clips (Nov 14).
- [x] Voice-memo splitter and Google API client written (Nov 15).
- [ ] First run with real credentials: `google_api.py stats`, then a test upload of a 10 s private clip; fix anything that fails.
- [ ] Thumbnail maker; timer overlay for v003.
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
- Nov 15 (run 2): No owner input yet (no name pick, no credentials). News: no Rockstar post today; launch Nov 19 confirmed; Rockstar will release a free printable map Nov 19 (don't use it in thumbnails; it's Rockstar art). Built `voice.py` (tested) and `google_api.py` (awaiting credentials); SETUP.md voice rules updated (5 s pause = retake, say "skip").
- Nov 16 (run 3): Still no owner input; 3 days to launch, so name + Google access (SETUP.md Parts A–E) is now urgent. News: Rockstar co-director says the console build runs at **30 fps**; no 60 fps mode confirmed ([VGC](https://www.videogameschronicle.com/news/gta-6-is-confirmed-to-be-30-frames-per-second-at-launch-no-performance-mode-at-launch/), [TechRadar](https://techradar.com/gaming/gta-6-will-launch-at-30fps-on-ps5-and-xbox-for-now-confirms-rockstar-but-while-60fps-is-reportedly-possible-its-a-40fps-mode-we-really-want-to-see)). Changes: renders now 30 fps (no duplicated frames); v001's graphics-mode section notes this. If a performance mode does exist at launch, it becomes the first Short.
- Nov 17: Owners pivoted to a streamer clips channel. Researched clip monetization (Whop Content Rewards ~$1–3 per 1K views, no follower minimum; YouTube reused-content risk; TikTok rewards exclude unoriginal clips). Checked names: Chat Clipped, Stream Sifter, Clipsmith, Chat Replay Club have free @handles and domains. Plan in `clips/PLAN.md`.
- Nov 17 (evening): Owners chose ChatClipped; platforms Instagram + Facebook + Whop; want autonomy. Researched $1M+ clipping businesses (`clips/RESEARCH.md`): the big money is the broker model. Built the clip pipeline; render tested. Created environment `branden-chatclipped` (Meta, Twitch, Whop, Hugging Face, Google hosts); this session couldn't move onto it.
- Nov 17 (night, first run on `branden-chatclipped`): Host check: Meta, Whop, Twitch API and Google hosts answer. The Whisper model download and Twitch clip video were refused by the proxy (Hugging Face now serves files from `cas-server.xethub.hf.co` / `us.aws.cdn.hf.co`; Twitch clips from a CloudFront host); added those 3 hosts with the owners' approval. Fixed a faster-whisper 1.2.1 + PyAV 19 crash by pinning `av<18` (`clips/requirements.txt`); the setup script installs it. Tests passed: GTA pipeline `run_test.sh`, both `render_clip.py` layouts, Whisper word timings, and one real public clip end to end (not posted, not kept). Merged with the parallel session's facecam/plan-make changes; `clips/test/run_test.sh` also passes, and `clips/requirements.txt` now combines both lists. No Twitch/Meta keys yet, so the API and posting tests wait on SETUP Parts C–E.
- Nov 17 (night, follow-up): Tested the new plan/make split. `run.py plan` correctly refuses while `config.json` has no streamers; the offline make test passes. Found and fixed `facecam.py` failing on OpenCV 5.0 (no `CascadeClassifier`) by pinning `opencv-python-headless<5`, then verified detection on synthetic clips. Waiting for the owners' accounts and Whop campaigns (planned Nov 18): then fill config, run plan → review → make, and send 2 renders for review before any `--post`. Start at 3 clips/day.
- Nov 17 (late night; owners asleep, said "auto update environment, keep working"): Added `contentrewards.com` to the environment. Wrote `clips/campaigns.py` (daily scan of all public campaigns → `clips/campaigns.md`); 19 of 746 fit, 4 picked (see Status). Found two Content Rewards rules that change the flow: submit within 30 minutes of posting, and a disclosure at the start of every clip. Added `#ad` on screen + in captions, the `twitch.tv/<streamer>` credit, and moved all labels into the Reels safe zone. `whop_todo.md` now lists each run's links by campaign with the 30-minute deadline. Updated SETUP Part B (sign up on contentrewards.com) and PLAN rules 5 + daily flow. Changed the daily scheduled run to never post unless an owner is ready to submit. Both test suites pass.
- Nov 17 (late night, cont.): Made the **2 test renders for owner review** from real public clips of the top two picks (Boeshi "bro can't catch a break", SkiiMaskTimmy "Killed by a door"); sent in chat, kept in scratch only, not posted, footage not committed. Real-clip findings: `facecam.py` missed Boeshi's cam (head turned) and marked his ring lights as a face on a full-cam scene, so `run.py plan` now saves a `check_frame` per clip with the box drawn in red and the review checks every box by eye. Both streamers burn live subtitles into their stream; ours sit above theirs, theirs mostly fall under Instagram's UI.
- Nov 17 (late night, cont.): Added an optional per-streamer `"game"` filter (Twitch category, verified against Twitch's Get Clips/Get Games docs) for single-game campaigns like DiegoLoveless; tested with a mocked Twitch client. Ready-made config entries for the 4 picks are under Status.
- Nov 17 news check: launch still Nov 19 (early unlocks by time zone); Rockstar x Weather Channel footage and story previews. Nothing plan-changing; from Nov 19 expect many GTA story-spoiler stream clips, which the plan review skips (PLAN rule 4).
- Nov 17 07:41 UTC (daily run): No owner input yet (no keys, no joined campaigns, no review OK on the 2 test renders). Campaign scan: still 19 of 746 fit; all 4 picks still open with unchanged budgets. Nothing rendered or posted.
- Nov 17 (day): Owners OK'd both test renders. Name check found @chatclipped taken on Instagram by a competing clip page; owners asked for a new name. Checked ~30 candidates across Instagram, YouTube, Twitch, Kick, .com and web search; **Clipamole** is the only fully clean one (backup PogTide). Awaiting owners' pick before renaming.
- Nov 17 (day, cont.): Owners picked **Clipamole**. Renamed everything (code, config, docs, on-screen tag @clipamole, #clipamole, environment `branden-clipamole`); dated log lines keep the old name.
- Nov 17 (day, cont.): Second check for TikTok, X, Facebook, Threads, Snapchat via search-engine results: no "clipamole" anywhere (the TikTok search returned only unrelated videos). Weaker evidence than a direct check; direct page checks there are blocked for our tools. Owners confirm at signup.
- Nov 18 07:41 UTC (daily run): No owner input yet (no keys, no joined campaigns, no handles reported). @clipamole re-checked on Instagram: still free. Campaign scan: 22 of 755 fit; all 4 picks still open (DiegoLoveless budget down to $757). New: TOMO GTA VI ($2/1K, YouTube livestreams), Cartier2Real and Bichou (Kick). None fit yet: the pipeline only pulls Twitch clips; YouTube video hosts can't be allowlisted (rotating CDN hostnames); Kick support is possible later if we join a Kick campaign. Nothing rendered or posted.
- Nov 19 ~02:55 UTC (GTA VI launch; parent session asked for a fresh scan): 24 of 764 fit. New GTA VI campaigns: KreekCraft GTA 6 ($1, $6,825, 0 clippers, live GTA 6 now), Clix x JBL ($1, $4,000, Clix live GTA VI marathon; JBL logo needed), Lauren Hamden GTA 6 (dedicated-account rule: skip). Bobby Van Riper is streaming GTA tonight. "Join first" list (KreekCraft, Clix x JBL, Bobby Van Riper, Boeshi, SkiiMaskTimmy) is at the top of `clips/campaigns.md`; Kick/YouTube-only campaigns listed separately there.
- Nov 19 ~03:00 UTC: `clips/campaigns.py` now also lists **pool** campaigns (a fixed pot split by views), sorted by pool per clipper. New pool: Arky $3K (Reach, 0 clippers, ends Dec 19). Lacy's GTA pool went from 37 to 178 clippers in a few hours. `clips/JOIN_FIRST.md` is the one hand-picked list (8 picks, refreshed numbers); `clips/campaigns.md` is the full generated scan.
- Nov 19 ~03:56 UTC: Owners created Instagram @clipamole (confirmed by the parent session from a screenshot). Display name and Professional switch pending.
- Nov 19 07:42 UTC (daily run): No new owner input since @clipamole was created (no keys, no joined campaigns, config has no streamers). Scan: 36 of 767 fit. Zero-clipper picks still empty: YourRAGE $5K pool, Arky $3K pool, KreekCraft GTA 6 ($6,825), Clix x JBL ($4,000). Kai pool 66 clippers, Lacy pool 340 (filling fast). JOIN_FIRST numbers refreshed. Nothing rendered or posted.
- Nov 20 07:42 UTC (daily run): No owner input since Nov 19 (no keys, no joins, config empty). Scan: 36 of 766. Free spots are going: KreekCraft 0 → 32 clippers, Clix x JBL half its budget spent, Kai pool 92, Lacy 427. Still 0 clippers: Arky $3K pool and NEW **Silky $7.5K pool** (Reach; Silky live playing GTA 6 for the first time) → now #1 in JOIN_FIRST. YourRAGE dropped (story mode + no viewer clips in 24 h). Nothing rendered or posted.
- Nov 21 07:42 UTC (daily run): No owner input since Nov 19 (no keys, no joins, config empty). Scan: 35 of 767, no new campaigns. Launch-week campaigns filled up: Kai pool 92 → 588 clippers, KreekCraft 32 → 110, Silky 0 → 11. Arky $3K pool still 0. JOIN_FIRST reordered: Silky, Arky, Boeshi, Bobby Van Riper, Clix x JBL. Nothing rendered or posted.
- Nov 22 07:42 UTC (daily run): No owner input since Nov 19 (no keys, no joins, config empty). Scan: 36 of 767. NEW: **Lacy $25K 30-day pool**, 0 clippers (a new cycle; the last one ended with ~6,000) → #1 in JOIN_FIRST; its config entry now points at the new pool. Silky 23 clippers, Arky still 0. Clix x JBL dropped ($640 left). Nothing rendered or posted.
