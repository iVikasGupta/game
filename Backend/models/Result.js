const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    roundId: mongoose.Schema.Types.ObjectId,
    playerId: mongoose.Schema.Types.ObjectId,

    labor: Number,
    output: Number,

    wagePaid: Number,
    priceReceived: Number,

    revenue: Number,
    cost: Number,
    profit: Number,

    marketShare: Number,
    strategyType: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
