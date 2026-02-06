# Duel Trivia Design

**Date:** 2026-02-06
**Status:** Validated

## Summary

Duel Trivia is a browser-based 1v1 trivia game where coworkers compete head-to-head on work/industry knowledge. Players hit "Play," get randomly matched, and race through 5 questions where the fastest correct answer wins each point. An Elo leaderboard tracks rankings across the office. A single round takes ~2 minutes.

## Goals

- Provide a quick, competitive game playable between meetings (~2 min rounds)
- Test and reinforce work/industry knowledge in a fun format
- Maintain a persistent Elo leaderboard for office-wide competition

## Non-Goals (Out of Scope)

- Authentication/SSO — v1 uses a simple "enter your name" flow, no login
- Custom question packs — admins seed questions via CSV, no in-app editor
- Spectator mode — no watching live duels
- Team/group matches — strictly 1v1
- Chat or emotes — no in-match communication
- Mobile-optimized UI — works in browser but not tuned for phones
- Analytics dashboard — match history stored but no admin UI for trends
- Rematch button — players re-queue through the normal flow
- Multiple question types — v1 is multiple choice only, no free-text or code challenges

## Architecture

Three components:

### Frontend (React SPA)

- Lobby screen — leaderboard + "Play" button
- Matchmaking screen — waiting spinner
- Duel screen — question, 4 answer choices, timer, scores
- Results screen — round outcome, Elo change

### Backend (Node.js + WebSocket server)

- **Matchmaking service** — maintains a queue, pairs players FIFO, creates a game room
- **Game engine** — manages round state: sends questions, receives answers, determines point winner, advances to next question
- **Elo service** — calculates and updates ratings after each match

### Database (PostgreSQL)

- Players, questions, match history, Elo ratings
- Admin can seed questions via a simple script or CSV import

### Request Flow

1. Player connects via WebSocket, enters queue
2. Two players matched → server creates a game room, both sockets join
3. Server sends question to both players simultaneously
4. First correct answer scores — server is the authority (no client trust)
5. After 5 questions → server calculates Elo delta, persists results, sends summary

**Key principle:** The server is the single source of truth. Clients send answer selections, server validates and scores.

## Data Model

### players

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| display_name | varchar | |
| elo_rating | integer | default 1200 |
| wins | integer | |
| losses | integer | |
| created_at | timestamp | |

### questions

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| category | varchar | e.g. "javascript", "devops", "company" |
| text | varchar | the question |
| choices | jsonb | array of 4 options |
| correct_index | integer | 0-3 |
| difficulty | integer | 1-3 |

### matches

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| player_1_id | uuid | FK → players |
| player_2_id | uuid | FK → players |
| winner_id | uuid | FK → players, nullable for draws |
| player_1_score | integer | |
| player_2_score | integer | |
| elo_delta | integer | points exchanged |
| played_at | timestamp | |

### match_rounds

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| match_id | uuid | FK → matches |
| question_id | uuid | FK → questions |
| round_number | integer | 1-5 |
| winner_id | uuid | FK → players, nullable if timeout |
| answer_time_ms | integer | winning answer speed |

## Key Flows

### Matchmaking Flow

1. Player clicks "Play" → client sends `JOIN_QUEUE` over WebSocket
2. Server adds player to in-memory queue
3. When queue has 2+ players → pop first two, create game room
4. Server sends `MATCH_FOUND` to both with opponent's name and Elo
5. 3-second countdown → game begins

### Question Flow (repeats 5 times)

1. Server picks a random question (not yet seen in this match)
2. Server sends `QUESTION` event to both players simultaneously
3. 15-second timer starts server-side
4. Player taps an answer → client sends `ANSWER { questionId, choiceIndex, timestamp }`
5. Server validates:
   - If correct and first to answer → `ROUND_RESULT { winner, correctIndex, timeMs }`
   - If correct but second → shown as correct, no point
   - If wrong → locked out for that question, opponent can still answer
   - If both wrong or timeout → no point awarded
6. 2-second pause showing result → next question

### End of Match Flow

1. After 5 rounds → server tallies scores
2. Elo calculated: K-factor of 32, standard formula
3. Server sends `MATCH_RESULT { scores, eloDelta, newRating }` to both
4. Match and rounds persisted to database
5. Both players returned to lobby with updated leaderboard

### Disconnection Flow

- If a player disconnects mid-match, server waits 10 seconds for reconnect
- If they don't return → opponent wins by forfeit, Elo adjusts with reduced delta

## Edge Cases

- **Simultaneous answers** — Server uses message arrival order. WebSocket messages processed sequentially, so there's always a first.
- **Question pool exhaustion** — Allow question repeats but prioritize unseen ones. Track per-match, not globally.
- **Queue sitting** — 30-second timeout, then return to lobby.
- **Rapid re-matching** — Skip if you played this opponent in the last 2 minutes.
- **Elo floor** — Minimum Elo of 800.
- **Answer spamming** — Server accepts one answer per question per player. Subsequent messages ignored.
- **Stale WebSocket** — Heartbeat ping every 10 seconds. No pong in 3 cycles → forfeit flow.

## Open Questions

None — design validated.

## Next Steps

- [ ] Create issues with `/backlog docs/designs/2026-02-06-duel-trivia.md`
- [ ] Or create manually with `/parent` or `/issue`
