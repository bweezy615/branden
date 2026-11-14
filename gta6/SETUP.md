# One-time setup: clip intake and publishing

Written Nov 14, 2026 by the supervisor. Total owner time: about 60–75 minutes, once. Do the parts in order. Nothing here costs money.

**How it fits together**

```
Console ──► phone (PlayStation App / Xbox app) ──► Google Drive "Clips IN" folder
                                                          │
                                   supervisor (cloud) downloads, edits with ffmpeg
                                                          │
          Google Drive "Renders OUT" folder ◄─────────────┤
          (Shorts + TikTok files, post notes)             │
                                                          ▼
                                     YouTube, uploaded as PRIVATE
                                     ──► owner checks it, sets it Public
```

Why this design: the cloud agent can reach Google's APIs (`www.googleapis.com`, `oauth2.googleapis.com`; checked Nov 14) but can't log into anything itself. One Google login token lets it read your clips, hand back finished files, upload to YouTube as private, and read your channel's analytics for the scorecard. You stay the one who makes a video public. The agent never posts publicly.

---

## Part A: Business Google account and channel (15 min)

1. Create a **new Google account just for the business** (accounts.google.com → Create account → "For my personal use" is fine). Using a separate account keeps the agent's access away from your personal Drive and email. Both owners can share the password, or add the partner later as a channel Manager (YouTube Studio → Settings → Permissions).
2. Signed in as that account, go to youtube.com → profile picture → **Create a channel** → enter the channel name you picked (see `OPS.md`) → set the handle to match.
3. Go to **youtube.com/verify** and verify with a phone number. This unlocks custom thumbnails and videos longer than 15 minutes ([YouTube Help](https://support.google.com/youtube/answer/171664)).
4. YouTube Studio → Settings → Upload defaults → Advanced: Category **Gaming**, Video language **English**. Settings → Channel → Advanced: audience **"No, set this channel as not made for kids"** (the game is rated M).

## Part B: Drive folders (5 min)

1. In that account's Google Drive (drive.google.com), create two folders in **My Drive**: `Clips IN` and `Renders OUT`. Use exactly those names; the agent finds them by name.
2. If the partner uploads from their own Google account: right-click `Clips IN` → Share → add the partner's email as **Editor**.
3. Install the **Google Drive** app on each owner's phone and sign in (business account, or partner's account with the shared folder).

## Part C: Console capture settings (5 min per console)

**PS5** (Settings → Captures and Broadcasts → Captures):
- Video Clip Format → Resolution: **1080p**, File type: **MP4**. (Clips above 1080p or longer than 3 minutes won't go to the PlayStation App; source: [PlayStation Support](https://www.playstation.com/en-us/support/games/ps5-game-captures-ps-app/).)
- Include your microphone audio: **Off** (keeps party chat and your room out of the footage).
- **Auto-Upload: On.** Link the PS5 to the PlayStation App on your phone and leave the PS5 in Rest Mode with "Stay Connected to the Internet" on.
- Capturing: press **Create** → "Save Recent Gameplay" (last 15 s to 60 min) or "Start New Recording". Keep each clip **under 3 minutes**; for a long drive, record several 3-minute clips back to back.
- Longer clips (over 3 min): Media Gallery → select → copy to a USB stick (exFAT) → PC → drag into `Clips IN` on drive.google.com.

**Xbox Series X|S** (Settings → Preferences → Capture & share):
- Game clip resolution: **1080p SDR**.
- Capturing: press the **Share** button (record what happened) or hold it to start/stop a recording.
- Clips sync to the **Xbox app** on your phone (Profile → Captures). OneDrive auto-upload exists on newer firmware; either works.

## Part D: Daily clip transfer (about 10 min/day, the recurring job)

1. On your phone, open the **PlayStation App** (Library → Captures) or **Xbox app** (Profile → Captures). Open each clip → **Download**. PlayStation keeps uploads only **14 days**, so transfer the same day.
2. Open the **Google Drive** app → `Clips IN` → **+** → Upload → select the clips (and your voice memo, below).
3. Capture in the order of the video's **clip shopping list**, and put the video number in front of the voice memo's name, e.g. `v001-vo.m4a`. Don't rename the game clips; the agent sorts them by time and looks at frames.

**Voiceover (about 10 min per long video):** open the final script in this repo (`gta6/creator/scripts/`), go somewhere quiet, and read it into your phone's voice recorder (iPhone Voice Memos or any Android recorder). Fill in the `{FILL: …}` blanks with what you saw in your game. **Pause for a full 2 seconds between sections** (the `##` headings). The agent uses the pauses to line your voice up with the footage. Fluffs are fine: pause 2 seconds and say the sentence again; the agent keeps the last take.

## Part E: Give the agent access (25–30 min, once)

This is the one fiddly part. Do it on a computer, signed in as the **business** Google account.

1. Go to **console.cloud.google.com** → accept the terms → top bar project picker → **New project** → name it `channel-pipeline` → Create → select it.
2. Search bar → **APIs & Services → Library**. Enable each of these three (search, click, **Enable**):
   - YouTube Data API v3
   - YouTube Analytics API
   - Google Drive API
3. Left menu → **Google Auth Platform** (called "OAuth consent screen" on older screens) → **Get started**:
   - App name `channel-pipeline`, support email = the business account → Next.
   - Audience: **External** → Next. Contact email = the business account → Next → agree → **Create**.
4. Google Auth Platform → **Audience** → under Publishing status click **Publish app** → Confirm. Status should read **In production**. Do **not** submit it for verification; it's for your own use. (Left in "Testing", Google expires the login after 7 days and the agent loses access.)
5. Google Auth Platform → **Clients** → **Create client**:
   - Application type: **Web application**, name `pipeline`.
   - Authorized redirect URIs → Add URI → `https://developers.google.com/oauthplayground`
   - **Create**. Copy the **Client ID** and **Client secret** into a note on your computer (not into the chat).
6. Open **developers.google.com/oauthplayground**:
   - Click the **gear icon** (top right) → tick **Use your own OAuth credentials** → paste the Client ID and Client secret. Leave OAuth flow "Server-side" and Access type **Offline**. Close the gear panel.
   - In the left box "Input your own scopes", paste this whole line:
     `https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/drive`
   - Click **Authorize APIs** → sign in as the **business** account → pick the channel if asked.
   - You'll see "Google hasn't verified this app". That's expected for your own app: click **Advanced → Go to channel-pipeline (unsafe)** → tick every permission → **Continue**.
   - Back in the Playground, click **Exchange authorization code for tokens**. Copy the **Refresh token** into your note.
7. Store the three values where the agent can read them, **not in chat**: open this Claude Code session on claude.ai/code → the **environment menu** in the session's title bar (it says "Default") → **Edit** → Environment variables → add three lines:
   ```
   GOOGLE_CLIENT_ID=<the client ID>
   GOOGLE_CLIENT_SECRET=<the client secret>
   GOOGLE_REFRESH_TOKEN=<the refresh token>
   ```
   Save. The agent picks them up the next time the session starts or resumes. Note: the "Default" environment is used by all your Claude cloud sessions and stores variables as plain text, which is one more reason to use a business-only Google account.
8. Delete the note from your computer. Tell the agent in chat "credentials added".

**To revoke access at any time:** business account → myaccount.google.com/permissions → channel-pipeline → Remove access. Or delete the variables.

## Part F: Publishing, every video (5 min per long video, 2 min per Short)

**YouTube** (the agent uploads; you approve):
1. YouTube Studio app or studio.youtube.com → Content. New uploads appear as **Private**, with title, description, tags, chapters and captions filled in. A note in `Renders OUT/<video>/post.md` gives the recommended publish time.
2. Watch it at 2x. Check: no story spoilers on screen, nothing you'd be embarrassed by, audio OK.
3. Set the thumbnail from `Renders OUT/<video>/thumb.png` (Studio → video → Details → Thumbnail → Upload file).
4. Visibility → **Schedule** for the time in `post.md` (or Public now). Done.

**TikTok** (manual; TikTok's posting API requires an audited app, so the agent doesn't post there):
1. Drive app → `Renders OUT/<video>/` → open the file ending in `-tiktok.mp4` → ⋮ → **Download** (saves to your phone).
2. TikTok app → **+** → Upload → pick the file → paste the caption from `post.md`. Leave "AI-generated content" **off** (it's your gameplay and your voice). Post.

## What the agent does once this is set up
Every day: download new clips from `Clips IN`, match them to the shopping list, cut the long video and 2–3 Shorts, burn in captions, mix your voiceover, normalize loudness, make a thumbnail from your footage, upload the long video and Shorts to YouTube as **private**, put the TikTok cut and `post.md` in `Renders OUT`, read your channel analytics into the scorecard, and write tomorrow's shopping list.

## Sources
- PS5 capture upload limits (3 min, 1080p, 14 days): [PlayStation Support](https://www.playstation.com/en-us/support/games/ps5-game-captures-ps-app/)
- YouTube Data API `videos.insert`: 100 uploads/day quota bucket; "Videos uploaded from unverified API projects are not restricted to private viewing mode"; `status.containsSyntheticMedia` field (page last updated Nov 12, 2026): [Google for Developers](https://developers.google.com/youtube/v3/docs/videos/insert)
- 7-day token expiry in "Testing" status: [Google Ads API forum, citing Google OAuth docs](https://groups.google.com/g/adwords-api/c/nmIY_WDNyTU/m/uc7Bk0PmBgAJ)
- OAuth Playground with your own credentials: [Google for Developers](https://developers.google.com/google-ads/api/docs/oauth/playground)
- Xbox clips in the phone app: [insights.gg, 2026](https://insights.gg/blog/how-to-clip-on-xbox)
