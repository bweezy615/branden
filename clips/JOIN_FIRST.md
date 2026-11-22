# Join first: GTA 6 launch campaigns (Nov 19, 2026)

GTA 6 launched today, and streamer marathons are live right now. Pool campaigns split a fixed pot by each clipper's share of approved views **when the pool ends**, so posting early, while few clippers have joined, wins the biggest share. Also on the supervisor's per-view list (`clips/campaigns.md`): Clix x JBL (needs a JBL logo overlay; files unlock after joining) and Bobby Van Riper. All campaigns below pay on Instagram and use Twitch streams, which our pipeline handles.

| Join order | Campaign | Pay | Competition (Nov 22, 07:45 UTC) | Twitch | Rules that matter |
|---|---|---|---|---|---|
| 1 | [Lacy $25,000 30-Day Pool](https://contentrewards.com/c/campaigns/dc7183a8-7779-4b54-99a8-b7ac8c8452ec) (Reach) | $25K pool, split by views over 30 days | **0 clippers, new today** (the previous Lacy 30-day pool ended with ~6,000) | lacy | Reach rules: Lacy's name in caption or on screen, #LACY, English, no logos (`"brand_tag": false`). Will fill fast. |
| 2 | [Silky $7,500 Pool](https://contentrewards.com/c/campaigns/37f68297-664c-4820-a020-9bbb4a703bf9) (Reach) | $7.5K pool, split by views | 23 clippers (0 → 11 → 23), 1.4M views | silky | Reach rules; [rules](https://reachclipping.com/Silky). |
| 3 | [Arky $3,000 Pool](https://contentrewards.com/c/campaigns/772d9a4f-b60a-4bcb-b9b3-25d7b2edbf25) (Reach) | $3K pool, split by views | **still 0 clippers** | arky | Ends Dec 19. Reach rules. |
| 4 | [Boeshi GTA 6 Clipping](https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69) (ClipLaunch) | $1.50 per 1K views, up to $300/clip, $1,693 left | 9 clippers | darealboeshi | Steady pay per view. |
| 5 | [Bobby Van Riper GTA VI](https://contentrewards.com/c/campaigns/f583b069-ced7-49e5-9ed3-2d3a13d6df0c) (Clipping Nation) | $1.00 per 1K views, up to $250/clip, $958 left | 9 clippers | bobby_vanriper | Small budget. |

**Dropped:** Clix x JBL ($640 left of $4,000). **Crowded:** KreekCraft GTA 6, Kai Cenat $10K pool, Lacy GTA VI marathon pool. YourRAGE: story mode, no Twitch viewer clips.

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
{"twitch": "lacy", "name": "Lacy", "campaign": "https://contentrewards.com/c/campaigns/dc7183a8-7779-4b54-99a8-b7ac8c8452ec", "facecam": "auto", "tags": ["#LACY"], "brand_tag": false},
{"twitch": "kreekcraft", "name": "KreekCraft", "campaign": "https://contentrewards.com/c/campaigns/2eaa14fb-6927-4136-897e-b096e0d907d6", "facecam": null, "game": "Grand Theft Auto VI", "tags": ["#kreekcraft", "#gta6"], "caption_note": "Watch live: twitch.tv/kreekcraft"},
{"twitch": "arky", "name": "Arky", "campaign": "https://contentrewards.com/c/campaigns/772d9a4f-b60a-4bcb-b9b3-25d7b2edbf25", "facecam": "auto", "tags": ["#arky"], "brand_tag": false},
{"twitch": "kaicenat", "name": "Kai Cenat", "campaign": "https://contentrewards.com/c/campaigns/1d2bcb00-c904-415f-aa82-f95b96baad86", "facecam": "auto", "game": "Grand Theft Auto VI", "tags": ["#kaicenat", "#gta6"]},
{"twitch": "darealboeshi", "name": "Boeshi", "campaign": "https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69", "facecam": "auto", "tags": ["#boeshi"]}
```

The `"game"` value must match Twitch's exact category name. The supervisor checks it with `Twitch.game_id` on the first run.
