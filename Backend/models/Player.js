const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    gameId: mongoose.Schema.Types.ObjectId,
    name: String,
    totalProfit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
