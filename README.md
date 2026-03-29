# Blackjack Trainer: Count Lab

A training-focused blackjack app for faster card-counting skill development.

## What Was Added

- Upgraded round resolution:
  - Full hand outcomes (`win`, `loss`, `push`, `blackjack payout`)
  - Dealer reveal + dealer draw logic
  - Session stats (`hands`, `W/L/P`, streaks, bankroll)
- Freeze coaching popup system:
  - Pauses action during high-value learning spots
  - Explains the situation and recommended basic-strategy move
  - Resume button unfreezes play
- Audio system:
  - Toggleable ambient table loop (generated with WebAudio)
  - Action/result sound cues for feedback
- Quiz mode:
  - 120-question pool for true-count conversion
  - Each run shuffles and serves 30 questions
  - Immediate explanation after each answer
- Study guide tab:
  - Fast in-app reference for counting flow and discipline

## Stack

- React + Vite
- Material UI

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Card Counting Method (Hi-Lo)

Use the Hi-Lo system:

- `2, 3, 4, 5, 6` = `+1`
- `7, 8, 9` = `0`
- `10, J, Q, K, A` = `-1`

### Workflow

1. Track running count as cards are revealed.
2. Estimate decks remaining.
3. Convert:

```text
True Count = Running Count / Decks Remaining
```

4. Use true count for bet sizing and discipline.

## Why Freeze Moments Help

Most new counters lose edge from:

- Rushed decisions on stiff totals
- Ignoring count context when emotional
- Over-hitting made hands

The freeze coach interrupts these leak points and forces one focused decision cycle:

1. See board state
2. Read recommendation
3. Resume and execute intentionally

## Quiz Details

- Pool size: `120`
- Session size: `30`
- Question type: true-count conversion under time pressure
- Goal benchmark: `80%+` accuracy

## Suggested Practice Routine

1. Play 20-40 trainer hands with freeze mode ON.
2. Run one 30-question quiz.
3. Repeat with freeze mode OFF.
4. Track:
   - Quiz accuracy trend
   - Wrong-answer patterns
   - Stability of true-count/bet decisions

## Notes

- Audio uses generated tones (no external audio assets required).
- This is a training simulator, not gambling advice.
