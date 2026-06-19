# Simon Game from the 1990s!

## Description

Remember & repeat the patterns!

## Video Demo

https://youtu.be/mwT84KOlSoc

## Deployment

https://johnnylieu.github.io/Simon_game_from_1978-remake/

# Simon Says — setup

A static Simon memory game with a shared high-score leaderboard.
The frontend is plain HTML/CSS/JS hosted on **GitHub Pages**; high scores
are stored in **Firebase Firestore**. There is no server to run.

## Project structure

- `index.html` — the page (also holds the Firebase config + leaderboard listener)
- `public/css/styles.css` — styles
- `public/script/game.js` — game logic + score rendering
- `public/sounds/*.mp3` — button sounds

## Run it locally

The page uses ES modules, which browsers won't load from a `file://` path —
so don't just double-click `index.html`. Serve it over http with any of:

- **VS Code:** install the "Live Server" extension → right-click `index.html` → _Open with Live Server_
- **Node:** `npx serve` (then open the URL it prints)
- **Python:** `python3 -m http.server` → open http://localhost:8000

Firestore works fine from `localhost`.

## High scores (Firebase Firestore)

Scores live in the Firestore database of the Firebase project `simon-says-ec47e`.
The web config and the live leaderboard listener are in the
`<script type="module">` block at the bottom of `index.html`.

The Firebase config (including `apiKey`) is **safe to commit** — it just
identifies the project. Access is controlled by Firestore security rules, not
by hiding the key.

Security rules (Firestore → Rules): public read, validated create, no edits/deletes.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{doc} {
      allow read: if true;
      allow create: if request.resource.data.score is number
                    && request.resource.data.score >= 0
                    && request.resource.data.name is string
                    && request.resource.data.name.size() <= 24;
      allow update, delete: if false;
    }
  }
}
```

## Deploy (GitHub Pages)

1. Push to the `main` branch — `index.html` must be at the repo root.
2. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. After pushing, hard-refresh (Ctrl+Shift+R); GitHub Pages can serve a cached copy for a minute or two.

## What changed from the old version

- Rebuilt from a Node/Express + MongoDB app into a **static site + Firebase Firestore**, hosted free on GitHub Pages. No `.env`, no `npm start`, no server.
- Shared, persistent leaderboard via Firestore (replaced the old per-device localStorage attempt).
- Fixed the off-by-one bug in `checkAnswer` that broke win/lose detection.
- Space bar no longer restarts the game while you're typing your name.
- Fixed HTML typos (`lass="row"`, `type="'text"`) and added the leaderboard.

## Legacy files (optional cleanup)

The old server files — `app.js`, `scoreStore.js`, `package.json`,
`package-lock.json`, `views/` — are **not used** by the live site. You can delete
them, or keep them as a reference for the server-based (Express + Mongo) approach.
