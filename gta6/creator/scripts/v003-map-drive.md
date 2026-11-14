# v003: How big is the map? Timed drive

| Field | Value |
|---|---|
| Title | How Big Is the GTA 6 Map? We Drove Across It (Timed) |
| Alt title | Driving Across the ENTIRE GTA 6 Map: How Long Does It Take? |
| Target length | 10–12 min (the drive is sped up; the timer stays real) |
| Publish | Sun Nov 22, 12–2 p.m. ET (weekend, high viewing) |
| Thumbnail | Your own map screen with a bold route line drawn by the agent, text **"HOW LONG?"** + your measured time |
| Spoiler risk | Low if done in free roam. Needs the map open enough to drive edge to edge. If parts of the map are locked when you record, say so in the video and drive what's open; **don't** show how areas unlock if that's story-related. |
| Why it can break out | It's original data. Nobody can copy our time, and "how big is the map" was the most-asked pre-launch question. |

## How the owner uses this script
1. Pick the **fastest car you own** (note its name) and set the **in-game clock / weather** to whatever it is; don't wait.
2. Run 1: **south to north** (or the longest straight-line axis). Run 2: **west to east**. Optional run 3: a **coastline lap** or "airport to the farthest point".
3. Before each run, open the map, place a waypoint at the far edge, and **screenshot the map with the route** (Create button → screenshot on PS5; Share on Xbox).
4. Record each run as back-to-back clips **under 3 minutes each** (PS5 phone upload limit), or one long recording copied via USB. **Don't stop between clips**; the agent stitches them.
5. Drive the GPS route, obey nothing, don't crash on purpose. If the cops get you, keep going: it's honest and it's content.
6. Note real-world start and end time on your phone for each run (the agent also measures from the footage).
7. Record the voice memo after: fill in the times and what you saw.

## Clip shopping list
| # | Clip | Length |
|---|---|---|
| 1 | Hook: 10 s of the car at top speed on a highway | 10 s |
| 2 | Map screenshot with run 1 route + 10 s video scrolling the full map zoomed out | 1 image + 10 s |
| 3 | Run 1, start to finish, uncut | as long as it takes |
| 4 | Map screenshot with run 2 route | 1 image |
| 5 | Run 2, uncut | as long as it takes |
| 6 | Optional run 3 | as long as it takes |
| 7 | 3–4 "on the way" moments you'd point out (a landmark, a change of scenery, a funny moment) | No extra clip: they're inside the runs. Write the rough minute of each in your phone notes so the voice memo can mention them |
| 8 | Outro: arrival shot at the far edge (beach, water, map border) | 15 s |

## Script (read aloud)

## Hook (0:00)
How big is GTA 6's map, really? Not trailer guesses. We took the fastest car I've got, a {FILL: car name}, and drove it from one edge of the map to the other, twice, with a timer running. The answer surprised me: {FILL: one-line headline, e.g. "it's longer than I expected north to south"}.

## The rules (0:25)
The rules: one car, the {FILL: car}, follow the GPS, no fast travel, no stopping. Run one goes {FILL: start point} to {FILL: end point}, run two goes {FILL: start} to {FILL: end}. The clock on screen is real time. We sped up the boring parts, but the timer never lies.

## Run 1 (0:55)
Here's the route on the map. {FILL: describe the route in one sentence, e.g. "from the southern keys, up through the city, into the swamps"}.
{FILL: 3–4 short lines about what you pass, each one sentence, e.g. "About two minutes in, the city ends and it's all wetland."}
And we're there. Run one: **{FILL: minutes and seconds}**.

## Run 2 (4:30)
Run two, {FILL: direction}. {FILL: route in one sentence}.
{FILL: 3–4 lines about what you pass}.
Run two: **{FILL: time}**.

## Run 3 (optional) (7:30)
{FILL: what the third run was and its time, or skip}.

## What it means (9:00)
So, {FILL: run 1 time} one way and {FILL: run 2 time} the other, in one of the fastest cars available early. {FILL: your honest take: does the map feel big, dense, empty, what surprised you}. If you want a feel for it: {FILL: a relatable comparison you can stand behind, e.g. "that's about the length of a TV episode's opening scene"}. Don't compare to other games unless we timed them ourselves.

## Wrap-up (9:40)
Want me to time a specific route, like walking it, or the slowest car in the game? Comment and I'll do the best idea. Subscribe so you catch it.

## On-screen captions
- Persistent **timer** in the top-right during each run (agent adds from the clip timestamps; real time, even when sped up)
- "RUN 1 · {start} → {end}" / "RUN 2 · …"
- Speed-up marker: "▶▶ 4x" whenever footage is sped up
- Result cards: "RUN 1: {time}" big and centered for 3 s

## Description
```
We drove across the whole GTA 6 map, edge to edge, twice, with a real timer: {run 1 time} {direction 1}, {run 2 time} {direction 2}. Car: {car}. No fast travel, no stopping, GPS route only. Free roam, no story spoilers.

Chapters
0:00 How big is the map?
0:25 The rules
0:55 Run 1
4:30 Run 2
9:00 What it means

All footage captured by us on our own console. Narration is our own voice. Sped-up sections are marked; times are real.
Not affiliated with Rockstar Games or Take-Two Interactive. GTA VI is a trademark of Take-Two Interactive.
```

## Tags
gta 6 map size, how big is gta 6 map, gta 6 map, gta 6 drive across map, gta 6 map comparison, gta vi map, gta 6 how long to drive across map, gta 6 fastest car, gta 6 free roam, gta 6 exploring

## Shorts / TikTok cut-downs
1. **"How long to drive across GTA 6?"** (30–45 s): run 1 at 16x with the timer, result card at the end. Caption: "HOW LONG? ⏱".
2. **The best view on the drive** (15–25 s): one scenic moment, caption with the place name (only if it's a non-spoiler, map-visible location).
3. **TikTok (61–90 s):** both runs at high speed with both result cards, then "comment a route for me to time".

## Agent notes (edit plan)
- Speed-up: `setpts` 4x–16x on straight stretches, real speed for the 3–4 noted moments and the arrival.
- Timer overlay: computed from source clip durations (stitched runs), drawn with `drawtext`; add to `render.py` as an edit-list option when this video is cut.
