# {BRAND} Discord Setup

**Server name:** `{BRAND} Community`. Never put "GTA", "Grand Theft Auto", "Rockstar", "Vice City" or "Leonida" in the server name, icon, banner or vanity URL. Use an original icon with no official art.
**Server description:** "Spoiler-safe guides, finds and a free progress tracker for GTA VI on PS5 & Xbox. Fan-run; not affiliated with Rockstar Games or Take-Two Interactive."

## Base settings (Server Settings)

- **Enable Community.** This unlocks Onboarding, Rules Screening, the Welcome Screen and announcement channels.
- **Safety Setup:** verification level **Medium** (account older than 5 minutes); raise it to **High** during the launch rush. Explicit image filter: on for all members. DM spam filter: on.
- **AutoMod** (built in, free). Create these rules:
  1. *Block + alert mods* on keywords: `mod menu*`, `modmenu*`, `money drop*`, `moneydrop*`, `recovery`, `modded account*`, `boost*` (tune it, since it also hits "speed boost"), `selling account*`, `buy account*`, `*cheat engine*`, `leak*`, `cyberleek*`.
  2. *Block* Discord invite links and link shorteners for everyone except Mods.
  3. Turn on Discord's built-in *mention spam* and *suspected spam* rules.
- **Onboarding:** pre-select #welcome, #rules, #announcements and #general-spoiler-free. The questions are under Roles below.
- **Default notifications:** Only @mentions.

## Categories and channels

**📌 START HERE**
- `#welcome` (read-only): the welcome text below.
- `#rules` (read-only, also used as the Rules Screening text).
- `#announcements` (announcement channel, read-only): new videos, tracker updates, newsletter.
- `#tracker-updates` (read-only): changelog for {TRACKER_URL}.

**💬 COMMUNITY (spoiler-free)**
- `#general-spoiler-free`
- `#help-and-questions` (**Forum**; tags: PS5, Xbox, Settings, Bug, Solved)
- `#screenshots-and-clips` (your own captures only; no story cutscenes)
- `#setup-and-gear` (storage, headsets, controllers; affiliate links only from staff, with disclosure)
- `#off-topic`

**🧭 GUIDES & TRACKER**
- `#submissions` (**Forum**: the find-reporting flow below)
- `#vehicles` (Forum; one post per vehicle, which becomes the tracker entry)
- `#guide-requests` (Forum; tags: Location, Vehicle, Collectible, Completion; members upvote with 👍)
- `#our-videos` (read-only; auto/manual posts of new uploads)

**🔒 SPOILERS (opt-in role: Story Spoilers)**
- `#story-discussion`: still wrap key moments in `||spoiler tags||`. No ending-video links.

**🛠 STAFF (Mods only)**
- `#mod-queue` (tracker form webhook + AutoMod alerts)
- `#mod-log` (Carl-bot logging)
- `#staff-chat`

**🔊 VOICE**
- `Co-op Hangout`, `Stream Watch` (stage it only if you later stream)

## Roles

| Role | Who | Gets |
|---|---|---|
| `Owner` | the two founders | admin |
| `Mod` | trusted volunteers, added after launch week | manage messages, timeout, AutoMod bypass, `#mod-queue` |
| `Tracker Contributor` | members with 3+ approved finds | colored name, credit in the tracker and newsletter |
| `PS5` / `Xbox` | self-assigned | platform tag only |
| `Story Spoilers` | self-assigned | access to the 🔒 SPOILERS category |
| `Video Pings` / `Newsletter Pings` | self-assigned | pinged by #announcements |

**Onboarding questions** (built in, free):
1. "What do you play on?" → PS5 / Xbox Series X|S (assigns the role).
2. "Show the story spoiler channel?" → *No, keep me spoiler-free* (default) / *Yes, I've accepted spoilers* (assigns Story Spoilers).
3. "Pings?" → New videos / Newsletter / None.

## Rules (paste into #rules and Rules Screening)

```
1. Be decent. No harassment, hate, slurs, or doxxing. Discord's Terms and Community Guidelines apply.
2. NO LEAKS. No leaked or pre-release footage, images, files or "insider" info, and no links to them. No early-copy or "early unboxing" content.
3. NO CHEATS. No mod menus, trainers, money drops, glitches-for-cash, "recovery" or modded accounts, boosting, or account/currency selling or buying. Asking where to get them also gets you removed.
4. SPOILERS: story content only in #story-discussion, and even there use ||spoiler tags||. Nothing story-related in channel names, thread titles, nicknames or avatars.
5. Your own content only. Post screenshots and clips you captured. Credit others. No ending or cutscene compilations.
6. No self-promo or invite links outside the channels that allow them. No DM advertising.
7. Submissions must be real finds you made yourself. Don't copy other sites' maps or guides.
8. English in public channels so mods can moderate.
9. Mods' calls are final. Appeals go to a ticket (/ticket), not public channels.

Penalties: warning → timeout → kick → ban. Rules 2 and 3 are an instant ban.

{BRAND} is a fan community. Not affiliated with or endorsed by Rockstar Games or Take-Two Interactive.
```

## Welcome text (#welcome, pinned)

```
Welcome to {BRAND} 👋

We help each other find everything in GTA VI and track 100% progress, spoiler-free by default.

➡️ Free tracker (checklists + vehicle database, saves in your browser): {TRACKER_URL}
➡️ Video guides: {YOUTUBE_URL}
➡️ Weekly guide roundup newsletter: {NEWSLETTER_URL}

Start here:
1. Read #rules. Two are zero-tolerance: no leaks and no cheats or money drops.
2. Pick your platform and spoiler preference in Channels & Roles.
3. Found a collectible, vehicle spawn or location? Post it in #submissions and get credited in the tracker.
4. Want a guide? Request it in #guide-requests and 👍 the ones you want.

Fan-run. Not affiliated with Rockstar Games or Take-Two Interactive.
```

## #submissions flow (finds → tracker)

**Two ways in, one queue.**

1. **Discord (Forum post in `#submissions`).** Required tags: `Collectible` / `Vehicle` / `Location` / `Correction`, plus platform. Pin this post template:
   ```
   Item / vehicle name:
   Category: (collectible type, vehicle class, etc.)
   Region: (Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia, Mount Kalaga, other)
   Landmark / how to get there:
   Requirements (story progress, time of day, etc.; no plot details):
   Platform:
   Proof: your own screenshot of the item AND the pause-map pin
   Tracker entry ID (if it's a correction):
   ```
2. **Tracker web form** at {TRACKER_URL}/submit → a **Discord channel webhook** (Channel Settings → Integrations → Webhooks, built in and free) that posts into `#mod-queue`. The builder points the form's POST at `{DISCORD_WEBHOOK_URL}`. **Keep that URL secret** and store it server-side, not in client code.

**Moderation (target: same day during launch fortnight)**
- A Mod checks for: own screenshot, no spoiler text, not copied from another site, not a cheat or glitch exploit.
- **Verify:** a second member reproduces it, or a founder confirms it in-game. Add the tag `Needs Repro` → `Verified` or `Rejected` (with a reason).
- **Publish:** the builder adds `Verified` items to the tracker, credits `@handle` (opt-in), and posts in `#tracker-updates`. The Mod tags the post `Added`.
- After 3 `Added` finds, give the member the `Tracker Contributor` role.
- Duplicates: link the original and close. Corrections: edit the tracker entry and note it in the changelog.
- Good finds feed Video 8 ("Where to Find") topics. Credit the finder in the video description.

## Bots (all free tiers; checked Nov 11, 2026)

| Bot | Use it for | Status check |
|---|---|---|
| **Built-in Discord tools** (AutoMod, Onboarding, Forum channels, Webhooks, Rules Screening) | most of the setup above, with no bot needed | first-party |
| **Carl-bot** ([carl.gg](https://carl.gg/)) | logging to `#mod-log`, extra regex automod, reaction roles if you skip Onboarding, custom tags such as `!tracker` | dashboard live; core features free |
| **Ticket Tool** ([tickettool.xyz](https://tickettool.xyz/)) | `/ticket` for appeals and private reports | free tier covers basic tickets (2026 comparison) |
| **YAGPDB** ([yagpdb.xyz](https://yagpdb.xyz/)) | backup choice if Carl-bot is down or limits bite; custom commands, automod | site live; free |
| **Dyno** ([dyno.gg](https://dyno.gg/bot)) | alternative to Carl-bot; don't run both automods | site live ("11.6M servers") |

Notes: run **one** moderation bot plus built-in AutoMod. Skip MEE6, since most of its useful features are now paid. For `#our-videos`, post manually during launch week. Automate later only if it's a chore (check whether your chosen bot's current free tier includes YouTube feeds). Don't add an economy or levelling bot, because "money" commands invite confusion with banned money-drop talk.

## Launch-week mod schedule

- **Wed Nov 18 (NZ unlocks at 6 a.m. ET):** spoiler and leak pressure peaks. Set verification to High, and keep a founder online 6 a.m.–noon ET.
- **Thu Nov 19 – Sun Nov 22:** clear the submissions queue twice a day. Recruit 2–3 Mods from the most helpful members.
- **Before Nov 19:** the tracker form webhook is tested, and test posts in `#mod-queue` are deleted.
