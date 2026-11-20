# Join first: GTA 6 launch campaigns (Nov 19, 2026)

GTA 6 launched today, and streamer marathons are live right now. Pool campaigns split a fixed pot by each clipper's share of approved views **when the pool ends**, so posting early, while few clippers have joined, wins the biggest share. Also on the supervisor's per-view list (`clips/campaigns.md`): Clix x JBL (needs a JBL logo overlay; files unlock after joining) and Bobby Van Riper. All campaigns below pay on Instagram and use Twitch streams, which our pipeline handles.

| Join order | Campaign | Pay | Competition (Nov 20, 07:45 UTC) | Twitch | Rules that matter |
|---|---|---|---|---|---|
| 1 | [Silky $7,500 Pool](https://contentrewards.com/c/campaigns/37f68297-664c-4820-a020-9bbb4a703bf9) (Reach) | $7.5K pool, split by views | **0 clippers**, listed Nov 20 | silky (**live: "PLAYING GTA 6 FOR THE FIRST TIME"**, 19 clips in 24 h) | Reach rules (see below); [rules](https://reachclipping.com/Silky). |
| 2 | [Arky $3,000 Pool](https://contentrewards.com/c/campaigns/772d9a4f-b60a-4bcb-b9b3-25d7b2edbf25) (Reach) | $3K pool, split by views | **0 clippers** | arky (30 clips in 24 h; playing Overwatch, not GTA) | Ends Dec 19. Reach rules. |
| 3 | [Kai Cenat $10,000 GTA 6 Pool](https://contentrewards.com/c/campaigns/1d2bcb00-c904-415f-aa82-f95b96baad86) (Clipped & Shipped) | $10K pool, split by views | 92 clippers (46 → 66 → 92) | kaicenat | Biggest audience, toughest competition. Rules unlock after joining. |
| 4 | [KreekCraft GTA 6 Clipping](https://contentrewards.com/c/campaigns/2eaa14fb-6927-4136-897e-b096e0d907d6) (ClipLaunch) | $1.00 per 1K views, up to $400/clip, $5,976 left | 32 clippers (0 yesterday) | kreekcraft | Overlay visible, send viewers to his stream: full-frame layout (`"facecam": null`). |
| 5 | [Boeshi GTA 6 Clipping](https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69) (ClipLaunch) | $1.50 per 1K views, up to $300/clip, $1,721 left | 8 clippers | darealboeshi | Now a GTA 6 campaign. Steady pay per view. |
| 6 | [Bobby Van Riper GTA VI](https://contentrewards.com/c/campaigns/f583b069-ced7-49e5-9ed3-2d3a13d6df0c) (Clipping Nation) | $1.00 per 1K views, up to $250/clip, $974 left | 7 clippers | bobby_vanriper | Small budget. |
| 7 | [Clix x JBL](https://contentrewards.com/c/campaigns/07b7f0ce-ca55-4a2f-9e91-0d57ca6d72c5) (Reach) | $1.00 per 1K views, $2,178 left (half spent in a day) | 5 clippers | clix | JBL event only, JBL logo on clips. May run out soon. |

**Dropped today:** YourRAGE $5K pool (still 0 clippers, but he's playing GTA 6 *story mode*, which carries spoiler and takedown risk, and he had **no** Twitch viewer clips in 24 h, which our pipeline needs). Lacy GTA pool: 427 clippers.

Full scan with every pool and per-view campaign: `clips/campaigns.md`. Crowded pools we skip for now: Clix GTA VI marathon pool (149 clippers), CORE (739), Lacy 30-day (5,980).

**Skipped:**
- Lauren Hamden GTA 6: wants an account dedicated to her.
- TOMO GTA VI: streams on YouTube, which we can't download from.
- "Tokyo Girl" GTA 6: a music-promotion campaign, not a streamer.
- Gambling/crypto campaigns.

## Reach's rules, which apply to Silky, Arky, YourRAGE, Lacy and Clix x JBL
From [reachclipping.com/LACYGTA](https://reachclipping.com/LACYGTA):
- **"Logos of any kind are not allowed."** Our on-screen @clipamole tag could count, so these entries use `"brand_tag": false`. The twitch.tv credit and #ad stay.
- **"AI-generated content removes you from every Reach campaign permanently."** Our clips are the streamer's real footage, with captions transcribed from the real audio. That isn't AI-generated content, but **the hook text must be written by a human or the supervisor**, never invented quotes, and never fake or AI voice or video.
- The video must actually feature the streamer, not just an intro, and must not portray them negatively or "hate farm".
- No botting, reposts or collab posts. The account's niche must match: a gaming/streamer clip page is fine.
- Pool share needs a minimum total of approved views.

## GTA 6 story spoilers
Rockstar issues takedowns over story and ending content. The supervisor drops any clip whose transcript or check frame shows a cutscene or story reveal, and keeps free-roam chaos and reactions.

## `clips/config.json` entries
Add an entry **only after the owners confirm they joined** that campaign. Re-read each brief after joining, because rules unlock then.

```json
{"twitch": "silky", "name": "Silky", "campaign": "https://contentrewards.com/c/campaigns/37f68297-664c-4820-a020-9bbb4a703bf9", "facecam": "auto", "tags": ["#silky"], "brand_tag": false},
{"twitch": "yourragegaming", "name": "YourRAGE", "campaign": "https://contentrewards.com/c/campaigns/be9b123e-ea47-4305-b6c5-af81f503b247", "facecam": "auto", "game": "Grand Theft Auto VI", "tags": ["#yourrage", "#gta6"], "brand_tag": false},
{"twitch": "lacy", "name": "Lacy", "campaign": "https://contentrewards.com/c/campaigns/a5c63fad-cd53-4b81-9305-4a2d1696872a", "facecam": "auto", "game": "Grand Theft Auto VI", "tags": ["#LACY", "#gta6"], "caption_note": "LACY GTA 6 marathon", "brand_tag": false},
{"twitch": "kreekcraft", "name": "KreekCraft", "campaign": "https://contentrewards.com/c/campaigns/2eaa14fb-6927-4136-897e-b096e0d907d6", "facecam": null, "game": "Grand Theft Auto VI", "tags": ["#kreekcraft", "#gta6"], "caption_note": "Watch live: twitch.tv/kreekcraft"},
{"twitch": "arky", "name": "Arky", "campaign": "https://contentrewards.com/c/campaigns/772d9a4f-b60a-4bcb-b9b3-25d7b2edbf25", "facecam": "auto", "tags": ["#arky"], "brand_tag": false},
{"twitch": "kaicenat", "name": "Kai Cenat", "campaign": "https://contentrewards.com/c/campaigns/1d2bcb00-c904-415f-aa82-f95b96baad86", "facecam": "auto", "game": "Grand Theft Auto VI", "tags": ["#kaicenat", "#gta6"]},
{"twitch": "darealboeshi", "name": "Boeshi", "campaign": "https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69", "facecam": "auto", "tags": ["#boeshi"]}
```

The `"game"` value must match Twitch's exact category name. The supervisor checks it with `Twitch.game_id` on the first run.
