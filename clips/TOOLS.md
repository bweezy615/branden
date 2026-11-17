# Clipping software: what's on GitHub and what we use (Nov 17, 2026)

## Shortlist
| Project | Stars | License | What it does well | Why it isn't our base |
|---|---|---|---|---|
| [Anil-matcha/AI-Youtube-Shorts-Generator](https://github.com/Anil-matcha/AI-Youtube-Shorts-Generator) | ~6.2K | MIT | Opus Clip-style: an AI model ranks transcript moments, face-tracked vertical crop | Needs a **paid** AI key (OpenAI/Gemini/MuAPI) to pick highlights; built for YouTube talking-head videos, not Twitch facecam + gameplay |
| [ColinGPT9/clips-studio](https://github.com/ColinGPT9/clips-studio) ("Clips Kitty") | ~290 | AGPL-3.0 | The most complete streamer clipper: Twitch/Kick VODs, **chat replay as a highlight signal**, **webcam/gameplay split layout**, auto-posting | **Windows desktop app, NVIDIA GPU recommended**, 16 GB RAM: it can't run in our cloud supervisor. AGPL. |
| [WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor) | ~6K | Unlicense | Cuts silence/dead air automatically | Single-purpose; useful later for tightening long clips |
| [ClipsAI/clipsai](https://github.com/ClipsAI/clipsai) | ~575 | MIT | Transcript-based clip finding + resizing library | Not updated since Jan 2024 |
| [artkulak/twitch-stream-highlights-detection](https://github.com/artkulak/twitch-stream-highlights-detection) | ~60 | Unlicense | Chat-velocity highlight detection | 2021, unmaintained |

## Decision: our own pipeline (`clips/`), borrowing the best ideas
1. **Highlights: viewers pick them for free.** Twitch's most-viewed clips of the last 36 hours are moments real chat members chose to clip. For streamers that's a stronger, free signal than an AI model guessing from a transcript, and it's the same "audience signal" idea Clips Kitty gets from chat replay.
2. **Judgment: the supervisor agent is the AI.** `run.py plan` gives it each clip's transcript. It drops anything that breaks the rules (music, story spoilers, slurs, a weak moment) and writes a better hook and caption than the viewer's title. No paid API key.
3. **Layout: Clips Kitty's split screen.** Facecam on top, gameplay below. `facecam.py` finds the facecam automatically (a face that stays put across frames), so a new streamer needs no hand setup.
4. **Captions:** faster-whisper word timestamps (the same engine both tools use locally), 3 words at a time, burned in.
5. **Posting:** Meta's official Graph API (Instagram + Facebook Reels). No third-party posting service, no monthly fee.
6. **Runs headless** in the cloud supervisor's daily task: no GPU, no desktop app.

## Later, if needed
- **Chat-spike highlights from full VODs**, for streamers whose viewers make few clips. Twitch's chat-replay endpoint is unofficial, so test it before relying on it.
- **auto-editor** to trim dead air from clips longer than 60 s.
