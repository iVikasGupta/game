const mongoose = require("mongoose");

const decisionSchema = new mongoose.Schema(
  {
    roundId: mongoose.Schema.Types.ObjectId,
    playerId: mongoose.Schema.Types.ObjectId,

    labor: Number,
    capital: Number,
    plantSize: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Decision", decisionSchema);
