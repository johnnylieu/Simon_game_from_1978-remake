# Simon Says — setup

## Run it
```bash
npm install
npm start
```
Then open http://localhost:3000

That's it — high scores save to `data/scores.json` out of the box, no database install needed.

## Use a real database (MongoDB)
1. `cp .env.example .env`
2. In `.env`, set `MONGODB_URI` to a local MongoDB or an Atlas URI.
3. `npm start` — scores now read/write in MongoDB instead of the JSON file.

## What changed from the old version
- Removed the missing `noneyo.js` secrets file that crashed startup. Secrets now live in `.env` (git-ignored).
- `POST /api/score` actually saves now; added `GET /api/scores` for the leaderboard. Schema field renamed `store` -> `score`.
- Fixed the off-by-one bug in `checkAnswer` that broke win/lose detection.
- Scores are sent to the server via fetch (the old prompt()/form combo never saved anything).
- Fixed HTML typos (`lass="row"`, `type="'text"`) and added a high-score leaderboard.
- Server stays playable even if the database is down.
