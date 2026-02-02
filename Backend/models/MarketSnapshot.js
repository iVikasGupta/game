const mongoose = require("mongoose");

const marketSnapshotSchema = new mongoose.Schema(
  {
    roundId: mongoose.Schema.Types.ObjectId,

    totalLabor: Number,
    marketWage: Number,

    totalOutput: Number,
    marketPrice: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketSnapshot", marketSnapshotSchema);
