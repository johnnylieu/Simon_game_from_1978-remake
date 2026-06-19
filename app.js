require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const store = require("./scoreStore");

const port = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

// Return the top high scores as JSON (used by the leaderboard).
app.get("/api/scores", async function (req, res) {
  try {
    const scores = await store.topScores(10);
    res.json(scores);
  } catch (err) {
    console.error("Failed to load scores:", err.message);
    res.status(500).json({ error: "Could not load scores." });
  }
});

// Save a new score, then return the refreshed leaderboard.
app.post("/api/score", async function (req, res) {
  const name = String(req.body.name || "").trim().slice(0, 24) || "Anonymous";
  const score = Number(req.body.score);

  if (!Number.isFinite(score) || score < 0) {
    return res.status(400).json({ error: "Invalid score." });
  }

  try {
    await store.addScore(name, score);
    const scores = await store.topScores(10);
    res.status(201).json(scores);
  } catch (err) {
    console.error("Failed to save score:", err.message);
    res.status(500).json({ error: "Could not save score." });
  }
});

async function start() {
  // The game must stay playable even if the database is unreachable,
  // so a failed init logs a warning instead of crashing the server.
  try {
    await store.init();
  } catch (err) {
    console.error(
      "Score storage unavailable (" +
        err.message +
        "). The game will run, but high scores won't be saved."
    );
  }

  app.listen(port, function () {
    console.log(`Server started on port ${port} — http://localhost:${port}`);
  });
}

start();
