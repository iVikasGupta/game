const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    gameId: mongoose.Schema.Types.ObjectId,
    level: Number,
    roundNumber: Number,

    laborPool: Number,
    baseWage: Number,
    wageElasticity: Number,

    basePrice: Number,
    priceSensitivity: Number,

    status: { type: String, default: "collecting" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Round", roundSchema);
