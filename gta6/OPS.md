# GTA VI side project: operating file

This is the single source of truth for the project. Claude's scheduled daily run reads this file first, does the next items in **Claude's queue**, updates **Status** and **Log**, then commits and pushes to `claude/clever-tesla-lza1gp`.

Strategy: `reports/GTA 6 launch money plan.md`. Video and community scripts: `gta6/creator/`. Tracker app: `gta6/tracker/`.

## Key dates
- Pre-load opened **Nov 10**. Install size: **up to 212 GB** (Rockstar).
- Unlock: **midnight local time, Thu Nov 19**, PS5 and Xbox Series X|S (Rockstar Support).
- **Feb 1, 2027**: YouTube Partner Program bar doubles for new applicants (8,000 watch hours). Apply before then.
- ~4 months after the domain is registered: ad networks bid properly.

## Status (update every run)
- Tracker: built, tested, committed. **Not deployed**: Vercel connector can't create projects (403). Needs a one-time import by a human (see "Your checklist").
- Creator kit: first 10 video plans, Discord setup, newsletter drafts in `gta6/creator/`.
- Brand: working name **Glovebox** (not final). Domain `glovebox.gg` was available on Nov 11, not bought.

## Your checklist (things only a human can do)
Do these in order. Tell Claude in chat when each is done, and paste any link it needs.
1. **Pick the brand name.** Default: Glovebox. Run a free search at https://tmsearch.uspto.gov for the name before buying anything.
2. **Buy the domain** (about $15–80/yr depending on the ending). Claude can check availability; it will not spend money.
3. **Deploy the tracker on Vercel**: vercel.com → Add New → Project → import `bweezy615/branden` → set **Root Directory** to `gta6/tracker` → Deploy. Framework is detected as Vite. Then add the domain under Project → Domains. After that, every push redeploys automatically.
4. **Create accounts**: YouTube channel, Discord server (layout in `gta6/creator/discord.md`), beehiiv newsletter, Amazon Associates. Paste the public links into chat so Claude can wire them into `gta6/tracker/src/config.ts`.
5. **Support payments**: make a Ko-fi or Stripe Payment Link for the $3–5 supporter tip. Paste the link.
6. **Record videos** from your own gameplay using `gta6/creator/videos.md`. Claude can't play the game or record.
7. **Launch week**: play from unlock, and note what you find (collectibles, vehicles, shops) in Discord #submissions or in chat. First-hand data is the moat.

## Claude's queue (autonomous work, top first)
- [ ] Daily: check Rockstar Newswire and Support for GTA VI news (patches, online mode, PC date, creator platform). Log anything that triggers a plan change.
- [ ] Before Nov 19: add a "First hours" checklist (settings, first purchases, early unlocks) that's safe to publish without spoilers. Fill in item details after launch.
- [ ] After Nov 19: build collectible / 100% checklists and fill the vehicle database from first-hand submissions plus public facts. Write every description ourselves: no copying wiki text, no Rockstar map art or screenshots.
- [ ] After Nov 19: write video scripts for the most-searched questions of the day (templates are in `gta6/creator/videos.md`).
- [ ] When links arrive: wire support/Discord/YouTube links into `src/config.ts`, add an Amazon accessories page, rebuild, test, push.
- [ ] Dec 6 checkpoint: compare against the plan's thresholds and recommend double down or scale back.
- [ ] Triggers: if online mode or a PC date is announced, draft the plan for calculators/crew finder or the PC module.

## Rules Claude follows (from the plan's red-lines table)
- Never: cheats, mod menus, money drops, modded accounts, boosting, leaked or pre-release material, spoilers in titles, Rockstar art/logos/map images.
- Never put "GTA", "Rockstar", "Vice City" or "Leonida" in the brand, domain or app name. Use "GTA VI" only descriptively, with the not-affiliated footer.
- Never spend money, create accounts, or publish to new places without the human's OK. Pushing to this branch is fine.
- Run `npm test` and `npm run build` in `gta6/tracker` before every push.

## Log
- Nov 9: Research report written.
- Nov 11: Tracker v0.1 built (checklists, garage, export codes, PWA). Creator kit drafted. Launch facts corrected to Rockstar's own pages.
- Nov 14: Vercel deploy blocked by connector permissions; human import needed. Daily scheduled run set up.
