# Clipamole one-time setup (about 60 min total)

Do the parts in order on a computer. Nothing here costs money. **Never paste a token or secret into the chat.** Part D says where they go.

## Part A: Accounts (15 min)
1. **Facebook Page:** facebook.com/pages/create → name **Clipamole** → category "Video creator" → Create. Profile picture and cover: plain logo text, no streamer faces.
2. **Instagram:** create **@clipamole** → Settings → *Account type and tools* → **Switch to professional account** → Creator → category "Video creator".
3. **Link them:** Facebook Page → Settings → *Linked accounts* → Instagram → Connect → log into @clipamole. (Automatic posting to Instagram needs this link.)
4. **Bio on both:** "The best stream clips, mashed fresh daily 🥑 / Your favorite streamers' wildest moments 🎥 / All credit to the creators / Clip removal? DM us"

## Part B: Content Rewards (10 min)
Content Rewards (formerly "Whop Content Rewards") now runs on its own site, contentrewards.com. Whop only handles withdrawals.
1. contentrewards.com → **Get started** → sign up → **Settings → connected accounts** → connect and verify **@clipamole on Instagram** (the professional account from A2). It must be connected **in Content Rewards itself**; an Instagram linked inside Whop's settings doesn't count. Facebook isn't a Content Rewards platform; we post there for extra reach only.
2. Campaigns: the agent already shortlists open streamer campaigns daily in **`clips/campaigns.md`**, with its picks in `gta6/OPS.md`. **Join the ones the agent recommends** (each is one **Join Campaign** click), then tell the agent which you joined. After you join, the campaign's rules and reference files unlock; copy any rules the agent can't see into the chat.
3. Withdrawals go Content Rewards balance → Whop balance → bank/PayPal. You'll need a Whop account with a payout method and an ID check (KYC) the first time you withdraw.

## Part C: Twitch app, so the agent can find and download clips (5 min)
1. Log into twitch.tv (any account, but it needs **two-factor authentication** turned on: Settings → Security).
2. dev.twitch.tv/console → **Register Your Application**: Name `Clipamole Finder`, OAuth Redirect URL `http://localhost`, Category `Application Integration`, Client Type **Confidential** → Create.
3. **Manage** → copy the **Client ID** → **New Secret** → copy the **Client Secret**. Keep both in a note for Part E.

## Part D: Meta app, so the agent can post Reels (25 min)
1. developers.facebook.com → log in with the Facebook account that owns the Clipamole Page → **My Apps → Create App** → name `Clipamole Poster` → for use cases pick **"Manage everything on your Page"** and **"Manage messaging & content on Instagram"** (Facebook Login for Business) → Create. **Leave it in Development mode.** You're an admin of the app, so it can post to your own Page and Instagram without Meta's App Review.
2. Open **Graph API Explorer** (developers.facebook.com/tools/explorer) → choose your app → **User or Page: Get User Access Token** → tick these permissions: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`, `business_management` → **Generate Access Token** → allow everything for the Clipamole Page and @clipamole.
3. Make it long-lived: open the **Access Token Debugger** (developers.facebook.com/tools/debug/accesstoken) → paste the token → Debug → **Extend Access Token** → copy the new token.
4. Back in Graph API Explorer, paste the long-lived token in the token box and run `GET me/accounts`. In the result, find Clipamole and copy its **`id`** (the Page ID) and its **`access_token`**. This Page token doesn't expire.
5. Run `GET <Page ID>?fields=instagram_business_account` → copy the **`id`** inside `instagram_business_account` (the Instagram user ID).

## Part E: Hand the keys to the agent (5 min)
1. On claude.ai/code, open a new session and pick the environment **`branden-clipamole`** (the agent created it; it allows Meta, Twitch, Content Rewards and the speech-to-text model download, which the default environment blocks).
2. Environment menu → **Edit** → Environment variables, add:
   ```
   TWITCH_CLIENT_ID=...
   TWITCH_CLIENT_SECRET=...
   META_PAGE_ID=...
   META_IG_USER_ID=...
   META_PAGE_TOKEN=...
   ```
   Save. These are stored as plain text in your personal environment. If one leaks, reset it: Twitch → Manage → New Secret; Meta → change your Facebook password, which kills the token.
3. Tell the agent "keys added". It will run a test: render 2 clips for you to check, then post 1 to Instagram + Facebook.

## Revoking
- Meta: Facebook → Settings → Business integrations → remove `Clipamole Poster`.
- Twitch: dev console → delete the app.
