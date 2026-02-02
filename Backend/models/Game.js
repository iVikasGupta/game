const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: String,
    totalPlayers: Number,
    currentLevel: { type: Number, default: 1 },
    currentRound: { type: Number, default: 1 },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
