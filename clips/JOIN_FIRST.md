# Join first: GTA 6 launch campaigns (Nov 19, 2026)

GTA 6 launched today, and streamer marathons are live right now. Pool campaigns split a fixed pot by each clipper's share of approved views **when the pool ends**, so posting early, while few clippers have joined, wins the biggest share. All campaigns below pay on Instagram and use Twitch streams, which our pipeline handles.

| Join order | Campaign | Pay | Competition (Nov 19) | Twitch | Rules that matter |
|---|---|---|---|---|---|
| 1 | [YourRAGE $5,000 GTA 6 Pool](https://contentrewards.com/c/campaigns/be9b123e-ea47-4305-b6c5-af81f503b247) (Reach) | $5K pool, split by views | **0 clippers**, launched today | yourragegaming | Runs only for his GTA 6 marathon. Reach rules (see below). |
| 2 | [Lacy $12,500 GTA VI Marathon Pool](https://contentrewards.com/c/campaigns/a5c63fad-cd53-4b81-9305-4a2d1696872a) (Reach) | $12.5K pool, split by views | 37 clippers | lacy | **Ends when the marathon ends.** Lacy's name in the caption or on-screen text, **#LACY**, English. Minimum total views to share the pool. [Rules](https://reachclipping.com/LACYGTA) |
| 3 | [Kai Cenat $10,000 GTA 6 Pool](https://contentrewards.com/c/campaigns/1d2bcb00-c904-415f-aa82-f95b96baad86) (Clipped & Shipped) | $10K pool, split by views | 46 clippers today; Kai draws hundreds of clip accounts | kaicenat | Biggest audience, toughest competition. Rules unlock after joining. |
| 4 | [Boeshi Clipping](https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69) (ClipLaunch) | $1.50 per 1K views, up to $300/clip | 4 clippers | darealboeshi | Steady pay per view, not a pool: income after the GTA marathons end. |

**Skipped:**
- Lauren Hamden GTA 6: wants an account dedicated to her.
- TOMO GTA VI: streams on YouTube, which we can't download from.
- "Tokyo Girl" GTA 6: a music-promotion campaign, not a streamer.
- Gambling/crypto campaigns.

## Reach's rules, which apply to YourRAGE and Lacy
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
{"twitch": "yourragegaming", "name": "YourRAGE", "campaign": "https://contentrewards.com/c/campaigns/be9b123e-ea47-4305-b6c5-af81f503b247", "facecam": "auto", "game": "Grand Theft Auto VI", "tags": ["#yourrage", "#gta6"], "brand_tag": false},
{"twitch": "lacy", "name": "Lacy", "campaign": "https://contentrewards.com/c/campaigns/a5c63fad-cd53-4b81-9305-4a2d1696872a", "facecam": "auto", "game": "Grand Theft Auto VI", "tags": ["#LACY", "#gta6"], "caption_note": "LACY GTA 6 marathon", "brand_tag": false},
{"twitch": "kaicenat", "name": "Kai Cenat", "campaign": "https://contentrewards.com/c/campaigns/1d2bcb00-c904-415f-aa82-f95b96baad86", "facecam": "auto", "game": "Grand Theft Auto VI", "tags": ["#kaicenat", "#gta6"]},
{"twitch": "darealboeshi", "name": "Boeshi", "campaign": "https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69", "facecam": "auto", "tags": ["#boeshi"]}
```

The `"game"` value must match Twitch's exact category name. The supervisor checks it with `Twitch.game_id` on the first run.
