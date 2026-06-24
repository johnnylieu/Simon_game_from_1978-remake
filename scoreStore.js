// A tiny persistence layer for high scores.
//
// - If MONGODB_URI is set in the environment, it uses MongoDB via Mongoose.
// - Otherwise it falls back to a local JSON file (data/scores.json) so the
//   game works out-of-the-box with zero setup.
//
// Both backends expose the same async interface:
//   await store.init()
//   await store.addScore(name, score)   -> returns the saved record
//   await store.topScores(limit)        -> returns array sorted high -> low

const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

// ---------- MongoDB backend ----------
function createMongoStore() {
    const scoreSchema = new mongoose.Schema(
        {
            name: { type: String, required: true, trim: true, maxlength: 24 },
            score: { type: Number, required: true, min: 0 },
        },
        { timestamps: true },
    );

    const Score = mongoose.model("Score", scoreSchema);

    return {
        backend: "mongodb",
        async init() {
            mongoose.connection.on("error", (err) =>
                console.error("MongoDB error:", err.message),
            );
            await mongoose.connect(MONGODB_URI);
            console.log("Connected to MongoDB.");
        },
        async addScore(name, score) {
            return Score.create({ name, score });
        },
        async topScores(limit = 10) {
            return Score.find()
                .sort({ score: -1, createdAt: 1 })
                .limit(limit)
                .lean();
        },
    };
}

// ---------- JSON-file fallback backend ----------
function createFileStore() {
    const dataDir = path.join(__dirname, "data");
    const file = path.join(dataDir, "scores.json");

    async function readAll() {
        try {
            const raw = await fs.readFile(file, "utf8");
            return JSON.parse(raw);
        } catch (err) {
            if (err.code === "ENOENT") return [];
            throw err;
        }
    }

    async function writeAll(scores) {
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(file, JSON.stringify(scores, null, 2));
    }

    return {
        backend: "file",
        async init() {
            await fs.mkdir(dataDir, { recursive: true });
            console.log(
                "No MONGODB_URI set — saving high scores to data/scores.json " +
                    "(set MONGODB_URI in .env to use MongoDB instead).",
            );
        },
        async addScore(name, score) {
            const scores = await readAll();
            const record = { name, score, createdAt: new Date().toISOString() };
            scores.push(record);
            await writeAll(scores);
            return record;
        },
        async topScores(limit = 10) {
            const scores = await readAll();
            return scores
                .sort(
                    (a, b) =>
                        b.score - a.score ||
                        new Date(a.createdAt) - new Date(b.createdAt),
                )
                .slice(0, limit);
        },
    };
}

const store = MONGODB_URI ? createMongoStore() : createFileStore();

module.exports = store;
