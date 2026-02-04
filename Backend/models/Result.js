const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    // Context
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    roundId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    level: {
      type: Number,
      required: true,
    },

    // User inputs (vary by level)
    inputs: {
      labor: Number,
      capital: Number,
      plantSize: {
        type: String,
        enum: ["S", "M", "L"],
      },
    },

    // Core outputs (COMMON for all levels)
    output: Number,
    revenue: Number,
    cost: Number,
    profit: Number,

    // Prices & payments
    wageRate: Number,
    price: Number,
    rentalRate: Number,

    // Optimization & evaluation
    isOptimal: Boolean,
    efficiencyScore: Number,
    strategyType: String, // e.g. "Cost Min", "Profit Max", "MES"

    // Level-specific metrics (OPTIONAL bucket)
    metrics: {
      mpL: Number,
      mpK: Number,
      mrtS: Number,

      returnsToScale: Number,
      scaleType: String, // IRS / CRS / DRS

      AVC: Number,
      ATC: Number,
      MC: Number,

      SRAC: Number,
      LRAC: Number,
      isAtMES: Boolean,
      optimalPlant: String,
    },

    // Competitive metrics (optional)
    marketShare: Number,
    profitRank: Number,
    efficiencyRank: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
