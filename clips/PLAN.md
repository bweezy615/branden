# Streamer clips channel: launch plan

Written Nov 17, 2026. Replaces the GTA VI guide channel as the main business (owners' decision, Nov 17). The GTA guide scripts stay in `gta6/` in case we want them later.

## The one thing to understand first: where the money comes from

Clips of other people's streams **don't qualify for most platform ad money**, so the plan is built around the payout that does work for clips: **paid clipping campaigns**.

| Money source | Pays clips of other streamers? | When it can start | Notes |
|---|---|---|---|
| **Whop Content Rewards** (paid clipping campaigns) | **Yes, that's what it's for.** Streamers and brands pay per view for clips of their content | **Week 1.** No follower minimum | Typical pay **~$1–$3 per 1,000 views**; a scan of 719 live campaigns (Oct 2026) found a median of $1.00 per 1,000. Whop keeps 10%. You connect your TikTok / YouTube / Instagram / X accounts, post, submit the link, and Whop counts the views itself. Withdraw from $1 after an ID check. |
| Streamers' own clipper programs (Discord) | Yes, with permission | Week 1–2 | Some big streamers pay their clippers directly (reported ~$40–50 per 100K views; secondhand). |
| YouTube Shorts ads (YouTube Partner Program) | **Risky.** Clip channels are a common rejection for "reused content" | Needs 1,000 subs + 10M Shorts views in 90 days; from **Feb 1, 2027** new applicants need **20M** | YouTube says a permitted compilation with no added commentary is still ineligible. Treat as a bonus, not the plan. |
| TikTok Creator Rewards | **No.** Clips of other creators count as "unoriginal" | — | Don't count on it. TikTok is still worth posting to for campaign views. |

**Bottom line:** we get paid per view through campaigns from the first week, on every platform at once. The YouTube channel grows alongside it; if it ever qualifies for ads, that's extra.

## Rules (protect the accounts)
1. **Only clip streamers who allow it:** ones running a campaign, or with a public "clip me" policy. Everyone else is a copyright strike waiting to happen; three YouTube strikes delete the channel.
2. **Credit the streamer** on screen and in every caption. Take a clip down the same day if they ask.
3. **Add our own edit to every clip:** hook text, captions, vertical layout with facecam, tight cut. This is what campaigns pay for, and it's our only defence against "reused content".
4. **Skip sections with music playing** (instant copyright claims) and **GTA VI story cutscenes or ending spoilers** (Rockstar files takedowns).
5. **Skip gambling and crypto-casino campaigns** even when they pay more: much of the audience is under 18, and they bring legal and platform risk.
6. **Disclose paid campaigns** where the campaign or platform requires it (e.g. #ad / the platform's "paid partnership" toggle).
7. Follow each campaign's own rules (length, tags, required caption). A clip that breaks them gets rejected and isn't paid.

## Channel name
All four were checked on Nov 17: the YouTube @handle returned "not found" and the domain is unregistered. Confirm the handle in YouTube's handle picker before you build the logo.

| Name | @handle | Domain | Why |
|---|---|---|---|
| **Chat Clipped** (recommended) | @chatclipped | chatclipped.com + .tv | Says exactly what it is ("the moments chat clipped"); works for any streamer, any game; short and easy to say |
| Stream Sifter | @streamsifter | streamsifter.com + .tv | "We sift hours of streams so you don't have to" |
| Clipsmith | @clipsmith | clipsmith.tv (.com taken) | Positions us as skilled editors, useful for winning campaign work |
| Chat Replay Club | @chatreplayclub | chatreplayclub.com | Community feel; longer |

Taken or too close to existing clip channels (don't use): Chat Saw It, Chat Went Crazy, Loud Chat Clips, Pog Daily, ClipLane, Stream Scraps, Front Row Clips, Caught On Stream.

**Use the same name and handle on all four platforms**: YouTube, TikTok, Instagram, X. Campaigns pay per platform, so one clip posted four times earns four times.

## Who does what
| Owners (phone, ~30–45 min/day) | Supervisor agent (daily) |
|---|---|
| Make the accounts and sign up for Whop (one-time) | Find campaigns that fit the rules, ranked by pay and how clippable the streamer is |
| Join the campaigns the agent picks (one click each) | Track each campaign's rules, rate and budget left |
| Each day: grab the source (campaign drive link, or the streamer's top Twitch/Kick clips of the day) and drop it in Drive `Clips IN` with a note of the moment (timestamp) | Cut each clip: vertical 9:16, facecam on top, gameplay below, hook text, burned-in captions, loudness |
| Post each finished clip to all four platforms from the phone and **submit the links in Whop within 30 minutes** (some campaigns require it) | Write the caption, credit and hashtags for each platform, plus the campaign's required tags |
| Withdraw earnings; tax forms | Log views and earnings per clip; drop campaigns that don't pay off; report weekly |

Why the owners post rather than the agent: TikTok, Instagram and X don't let our agent post, and campaigns want the link submitted fast. The agent can upload to YouTube once Google access is set up (`gta6/SETUP.md` Part E).

## Week-by-week

**Week 1 (Nov 17–23): accounts + first paid clips**
1. Pick the name (today).
2. Create a business Google account → YouTube channel (and verify its phone number), then TikTok, Instagram (switch it to a **Professional/Creator** account; Whop requires that) and X, all under the same name. Same profile picture and bio everywhere: "Best moments from your favorite streamers. All credit to the creators. Clip removal requests: DM us."
3. Sign up at whop.com → Content Rewards → connect and verify all four accounts.
4. Send the agent a screenshot or list of 10–20 open campaigns. The agent picks 3–5 to join.
5. Set up Drive `Clips IN` and `Renders OUT` (gta6/SETUP.md Part B).
6. **Target: 3 clips/day × 4 platforms.** GTA VI launches Nov 19, so streamers playing it will be the biggest clip source of the week. Favour free-roam chaos and reactions, never story cutscenes.

**Week 2 (Nov 24–30): volume**
- 5 clips/day. The agent starts reading results: which streamer, hook and length get views.
- Give the agent Google access (SETUP.md Part E) so YouTube uploads and stats are automatic.

**Weeks 3–4 (Dec 1–14): double down**
- Drop the campaigns earning under ~$1 per 1,000 views, or whose clips get rejected; add new ones.
- 5–8 clips/day if the owners have time. Once the agent's highlight finder works (below), the owners only post.
- **Dec 6 checkpoint:** keep going, change course, or stop, based on earnings per hour of owner time.

## What the agent still needs to build
1. **Vertical facecam layout** in `gta6/pipeline/render.py`: facecam crop on top, gameplay below, chosen per streamer (each streamer's facecam sits in a fixed spot, so it's set once per streamer).
2. **Hook text + word-by-word captions.** Captions need speech-to-text, and the model downloads it needs are blocked by this environment's network today. I'll ask you to approve one host (the model download site) when I get there. Until then, captions are hook text plus key lines typed from the owners' notes.
3. **Highlight finder**: picks moments from chat spikes and loudness so owners don't have to scrub through VODs. Needs network access to Twitch/Kick, which is blocked here today; I'll ask you to approve those hosts when it's ready to build.
4. **Clip log** (`clips/log.csv`): campaign, streamer, platform, link, views, earnings.

## Honest expectations
- At ~$1–$3 per 1,000 views, **100K views ≈ $100–$300**. New accounts often sit at a few hundred views per clip for the first week or two, then a few clips break out. Earnings are lumpy and depend on campaign budgets lasting.
- Clipping is crowded. What wins: speed (posting within hours of the stream), a strong first second, and volume across four platforms.

## Sources
- Campaign pay: [Clipping Collective, 719 campaigns, Oct 2026](https://clippingcollective.com/guides/clipping-campaign-data-2026); [OpenClip](https://openclip.app/guides/whop-clipping-guide); [RipClip](https://ripclip.org/clipper-pay-rates)
- How Content Rewards works (no follower minimum, platforms, verification, withdrawal): [OpusClip](https://www.opus.pro/blog/whop-content-rewards); [Scribix](https://scribix.io/guides/how-to-start-clipping-on-whop); [Sprites](https://www.sprites.ai/blog/whop-content-rewards-guide)
- YouTube reused content: [YouTube monetization policies](https://support.google.com/youtube/answer/1311392); [ForkOff, clip channels 2026](https://forkoff.xyz/blog/clipping/youtube-reused-content-policy-2026)
- YouTube Partner Program changes Feb 1, 2027: [YouTube Blog](https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/)
- TikTok and unoriginal clips: [FindClout](https://findclout.com/blog/tiktok-creator-rewards-reposted-clips); [OpenClip](https://openclip.app/guides/clipping-on-tiktok)
- Music rights in stream clips: [Promise Legal](https://blog.promise.legal/streamer-copyright-compliance-dmca-2026/)
