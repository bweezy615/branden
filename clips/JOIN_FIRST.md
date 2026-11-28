# Join first: GTA 6 launch campaigns (Nov 19, 2026)

GTA 6 launched today, and streamer marathons are live right now. Pool campaigns split a fixed pot by each clipper's share of approved views **when the pool ends**, so posting early, while few clippers have joined, wins the biggest share. Also on the supervisor's per-view list (`clips/campaigns.md`): Clix x JBL (needs a JBL logo overlay; files unlock after joining) and Bobby Van Riper. All campaigns below pay on Instagram and use Twitch streams, which our pipeline handles.

| Join order | Campaign | Pay | Competition (Nov 28, 07:45 UTC) | Twitch | Rules that matter |
|---|---|---|---|---|---|
| 1 | [Nogla $5,000](https://contentrewards.com/c/campaigns/ae573d30-b451-4d3b-ac9b-2cd3f72edd11) (Reach) | **$2.00 per 1K views**, up to $500/clip | **0 clippers** | nogla (+ pastaroniravioli, emerome, moomooclover) | Only clips from Nogla + Pastaroniravioli's Nov 14 stream or Emerome + MoomooClover's Nov 18 stream (we read "11/14" and "11/18" as dates; confirm in the brief after joining). Now supported with `"clips_between"`. [Rules](https://reachclipping.com/Nogla). Reach rules. |
| 2 | [SypherPK $7,500](https://contentrewards.com/c/campaigns/f2c529a0-6777-4e8a-b50b-4c8bd4e4d90f) (Reach) | **$2.00 per 1K views**, up to $500/clip, $5,997 left | 16 clippers | sypherpk (+ Replays, Maddynf) | Only clips from their Nov 15 streams. Uses `"clips_between"`. Reach rules. |
| 3 | [YourRAGE $7,500 Pool](https://contentrewards.com/c/campaigns/2064cdb1-4357-4380-b99c-119c5b320d31) (Reach) | $7.5K pool, split by views | 86 clippers (~$86 per clipper) | yourragegaming | Any of his content. Reach rules. |
| 4 | [Arky $3,000 Pool](https://contentrewards.com/c/campaigns/772d9a4f-b60a-4bcb-b9b3-25d7b2edbf25) (Reach) | $3K pool, split by views; ends Dec 19 | 35 clippers (~$83 per clipper) | arky | Reach rules. |
| 5 | [Lacy $25,000 30-Day Pool](https://contentrewards.com/c/campaigns/dc7183a8-7779-4b54-99a8-b7ac8c8452ec) (Reach) | $25K pool; ends Dec 21 | 859 clippers (~$29 per clipper) | lacy | #Lacy, his name in the caption, no logos, audience at least 50% US/CA/UK/AU/NZ. |

**Filled up since Nov 26:** Lacy 155 → 859 clippers, YourRAGE 0 → 86, Boeshi 18 → 51 ($956 left). **Crowded:** Silky (409), CORE, Clix, KreekCraft, Kai Cenat.

Full scan with every pool and per-view campaign: `clips/campaigns.md`. Crowded pools we skip for now: Clix GTA VI marathon pool (149 clippers), CORE (739), Lacy 30-day (5,980).

**Skipped:**
- Lauren Hamden GTA 6: wants an account dedicated to her.
- TOMO GTA VI: streams on YouTube, which we can't download from.
- "Tokyo Girl" GTA 6: a music-promotion campaign, not a streamer.
- Gambling/crypto campaigns.

## Reach's rules, which apply to Nogla, SypherPK, YourRAGE, Arky, Lacy and Silky
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
{"twitch": "nogla", "name": "Nogla", "campaign": "https://contentrewards.com/c/campaigns/ae573d30-b451-4d3b-ac9b-2cd3f72edd11", "facecam": "auto", "clips_between": ["2026-11-14", "2026-11-16"], "tags": ["#nogla"], "brand_tag": false},
{"twitch": "emerome", "name": "Emerome", "campaign": "https://contentrewards.com/c/campaigns/ae573d30-b451-4d3b-ac9b-2cd3f72edd11", "facecam": "auto", "clips_between": ["2026-11-18", "2026-11-20"], "tags": ["#nogla"], "brand_tag": false},
{"twitch": "sypherpk", "name": "SypherPK", "campaign": "https://contentrewards.com/c/campaigns/f2c529a0-6777-4e8a-b50b-4c8bd4e4d90f", "facecam": "auto", "clips_between": ["2026-11-15", "2026-11-17"], "tags": ["#sypherpk"], "brand_tag": false},
{"twitch": "yourragegaming", "name": "YourRAGE", "campaign": "https://contentrewards.com/c/campaigns/2064cdb1-4357-4380-b99c-119c5b320d31", "facecam": "auto", "tags": ["#yourrage"], "brand_tag": false},
{"twitch": "lacy", "name": "Lacy", "campaign": "https://contentrewards.com/c/campaigns/dc7183a8-7779-4b54-99a8-b7ac8c8452ec", "facecam": "auto", "tags": ["#Lacy"], "caption_note": "Lacy", "brand_tag": false},
{"twitch": "kreekcraft", "name": "KreekCraft", "campaign": "https://contentrewards.com/c/campaigns/2eaa14fb-6927-4136-897e-b096e0d907d6", "facecam": null, "game": "Grand Theft Auto VI", "tags": ["#kreekcraft", "#gta6"], "caption_note": "Watch live: twitch.tv/kreekcraft"},
{"twitch": "arky", "name": "Arky", "campaign": "https://contentrewards.com/c/campaigns/772d9a4f-b60a-4bcb-b9b3-25d7b2edbf25", "facecam": "auto", "tags": ["#arky"], "brand_tag": false},
{"twitch": "kaicenat", "name": "Kai Cenat", "campaign": "https://contentrewards.com/c/campaigns/1d2bcb00-c904-415f-aa82-f95b96baad86", "facecam": "auto", "game": "Grand Theft Auto VI", "tags": ["#kaicenat", "#gta6"]},
{"twitch": "darealboeshi", "name": "Boeshi", "campaign": "https://contentrewards.com/c/campaigns/5c01ecdb-a148-4489-ba26-5aadbbb5bf69", "facecam": "auto", "tags": ["#boeshi"]}
```

The `"game"` value must match Twitch's exact category name. The supervisor checks it with `Twitch.game_id` on the first run.
