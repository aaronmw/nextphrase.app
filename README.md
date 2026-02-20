# NextPhrase

A party guessing game played with one phone passed around a circle. Teams alternate guessing phrases while a timer runs; the team guessing when time runs out loses a heart. First team to lose all 7 hearts loses.

## How It Works

- Gather an even number of people in a circle. The phone holder is on **Team A**; the person to their left is **Team B**, then A, then B, and so on.
- Team A goes first. Hit **Start** to begin a round.
- A phrase appears. Team A must guess it while the phone holder gives clues—no words from the phrase, no rhyming, no other tricks.
- When they guess correctly, swipe to reveal the next phrase. Pass the phone left to someone on Team B; they guess next.
- A timer runs each round (45–60 seconds). In the final 10–15 seconds it accelerates (faster ticking). When time runs out, the team currently guessing loses a heart.
- Tap the team’s button on the scoring screen to record the loss. First team to lose all 7 hearts loses; the other team wins.

## Architecture

- **Framework**: Next.js 15, React 19 RC
- **State**: React Context + `useReducer`, with `usePersistedReducer` persisting selected keys to `localStorage`
- **Data**: Supabase (PostgreSQL) for `categories` and `phrases`; fetched on mount and keyed by id
- **Screens**: Six screens rendered as siblings; visibility controlled by `activeScreen` in state. Each uses `ScreenContainer` with GSAP for enter/exit animations.
- **Screens**: Main Menu, Instructions, Options, Scoring, Guessing, Winners
- **Guessing flow**: `PhraseFlipper` shows the current phrase; horizontal swipe reveals the next. Round timing uses `currentRoundStartTime`, `currentRoundAccelerationStartTime`, and `currentRoundEndTime` with GSAP-driven visual timer and sound.
- **Styling**: Tailwind CSS, custom theme (team colors, primary color)
- **PWA**: Install prompt, viewport locked, touch selection disabled
