# GTA VI content business: operating file

Single source of truth. The supervisor agent reads this first every run, works its queue, then updates **Status**, **Scorecard** and **Log** and pushes to `claude/clever-tesla-lza1gp`. Playbook: `.claude/skills/gta6-business/SKILL.md`.

## Key dates
- Unlock: **midnight local time, Thu Nov 19, 2026**, PS5 and Xbox Series X|S. Install up to 212 GB; pre-load opened Nov 10 (Rockstar).
- **Feb 1, 2027**: YouTube Partner Program bar doubles for new applicants. Qualify and apply before then.
- Checkpoints: **Dec 6** and **Jan 3**: double down or change course.

## Strategy decision
_Supervisor fills this in on its first run: format, platforms, posting cadence, and why._

## Status
- Tracker app: **dropped** by the owners (Nov 14).
- Supervisor agent: set up Nov 14, with a daily run.
- Intake location for raw clips: **not set up yet** (see checklist).
- Brand/channel name: **not chosen**.

## Owners' checklist (only humans can do these)
1. **Pick a channel name** with no "GTA", "Rockstar", "Vice City" or "Leonida" in it. The supervisor will propose options.
2. **Create the YouTube channel** (and TikTok, if the supervisor's strategy calls for it). Paste the links in chat.
3. **Set up clip intake**: a shared Google Drive folder, or tell the supervisor which other option works. Clips go from console → phone/PC → that folder.
4. **Play and capture**: during play, save clips of anything useful (finds, locations, vehicles, funny moments). The supervisor will post a "clip shopping list" for each video.
5. **Sign-ups when the supervisor asks**: Amazon Associates, beehiiv, YPP application. You do tax and payout forms.

## Supervisor's queue
- [ ] First run: research and record the **Strategy decision** (formats, platforms, cadence, AI-voice vs. captions vs. owner voice, under current YouTube and TikTok policies).
- [ ] First run: research the most practical **clip intake and publishing** setup for a cloud agent (shared folder, YouTube upload options), and write exact setup steps into the checklist.
- [ ] First run: propose 5 channel names (check that the @handle and .com are free where possible).
- [ ] Build the `ffmpeg` pipeline in `gta6/pipeline/` (cut, 9:16 Shorts crop, burned-in captions, loudness normalize), tested on a sample clip.
- [ ] Keep at least 3 scripts ready in `gta6/creator/scripts/` and a topic queue in `gta6/creator/queue.md`.
- [ ] Daily: Rockstar news check. Plan triggers: online mode, PC date, creator platform.
- [ ] Dec 6 checkpoint report.

## Scorecard
| Date | Subs | Watch hours (12 mo) | Shorts views (90 d) | Videos posted | Revenue | Notes |
|---|---|---|---|---|---|---|

## Log
- Nov 9: Research report written.
- Nov 11: Tracker app built; creator kit drafted; launch facts checked against Rockstar's pages.
- Nov 14: Owners dropped the tracker and asked for an autonomous content business. Tracker removed. Supervisor playbook written; supervisor agent hired with a daily run.
