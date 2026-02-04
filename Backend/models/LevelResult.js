import mongoose from "mongoose";

// Level 1 Result Schema - Single Input Production Function
const level1ResultSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round" },

    // Inputs
    labor: { type: Number, required: true },
    fixedCapital: { type: Number, default: 10 },

    // Production Results
    output: { type: Number, required: true },
    marginalProductLabor: { type: Number },

    // Cost & Revenue
    wageRate: { type: Number, required: true },
    outputPrice: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    profit: { type: Number, required: true },

    // Cost Analysis
    averageVariableCost: { type: Number },
    marginalCost: { type: Number },

    // Optimization
    optimalLabor: { type: Number },
    isOptimal: { type: Boolean },
    optimalCondition: { type: String, default: "P × MP_L = w" },

    // Scoring
    efficiencyScore: { type: Number },
    feedback: { type: String },
  },
  { timestamps: true }
);

// Level 2 Result Schema - Cobb-Douglas (CRS)
const level2ResultSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round" },

    // Inputs
    labor: { type: Number, required: true },
    capital: { type: Number, required: true },

    // Production Parameters
    A: { type: Number, default: 5 },
    alpha: { type: Number, default: 0.5 },
    beta: { type: Number, default: 0.5 },

    // Production Results
    output: { type: Number, required: true },
    mpL: { type: Number },
    mpK: { type: Number },
    mrts: { type: Number },
    inputRatio: { type: Number },

    // Prices
    wageRate: { type: Number, required: true },
    rentalRate: { type: Number, required: true },
    outputPrice: { type: Number, required: true },

    // Cost & Revenue
    laborCost: { type: Number },
    capitalCost: { type: Number },
    totalCost: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    profit: { type: Number, required: true },
    averageCost: { type: Number },

    // Optimization (MRTS check)
    optimalMRTS: { type: Number },
    isocostSlope: { type: Number },
    isOptimal: { type: Boolean },
  },
  { timestamps: true }
);

// Level 3 Result Schema - Returns to Scale (IRS)
const level3ResultSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round" },

    // Inputs
    labor: { type: Number, required: true },
    capital: { type: Number, required: true },

    // Production Parameters
    A: { type: Number, default: 5 },
    alpha: { type: Number, default: 0.6 },
    beta: { type: Number, default: 0.6 },

    // Production Results
    output: { type: Number, required: true },
    mpL: { type: Number },
    mpK: { type: Number },
    mrts: { type: Number },
    inputRatio: { type: Number },

    // Scale Analysis
    returnsToScale: { type: Number },
    scaleType: { type: String, enum: ["IRS", "CRS", "DRS"] },
    scaleInterpretation: { type: String },

    // Prices
    wageRate: { type: Number, required: true },
    rentalRate: { type: Number, required: true },
    outputPrice: { type: Number, required: true },

    // Cost & Revenue
    laborCost: { type: Number },
    capitalCost: { type: Number },
    totalCost: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    profit: { type: Number, required: true },
    averageCost: { type: Number },
  },
  { timestamps: true }
);

// Level 4 Result Schema - Short-Run Cost Analysis
const level4ResultSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round" },

    // Inputs
    labor: { type: Number, required: true },
    fixedCapital: { type: Number, default: 20 },

    // Production Parameters
    A: { type: Number, default: 5 },
    alpha: { type: Number, default: 0.5 },
    beta: { type: Number, default: 0.5 },

    // Production Results
    output: { type: Number, required: true },
    mpL: { type: Number },
    apL: { type: Number },

    // Prices
    wageRate: { type: Number, required: true },
    rentalRate: { type: Number, required: true },
    outputPrice: { type: Number, required: true },

    // Cost Analysis
    TFC: { type: Number, required: true },
    TVC: { type: Number, required: true },
    TC: { type: Number, required: true },
    AFC: { type: Number },
    AVC: { type: Number },
    ATC: { type: Number },
    MC: { type: Number },

    // Revenue & Profit
    totalRevenue: { type: Number, required: true },
    profit: { type: Number, required: true },

    // Shutdown Analysis
    shutdownRule: { type: String, enum: ["Operate", "Shutdown"] },
    lossIfOperate: { type: Number },
    lossIfShutdown: { type: Number },
    bestDecision: { type: String },
  },
  { timestamps: true }
);

// Level 5 Result Schema - Long-Run & Plant Size Choice
const level5ResultSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round" },

    // Inputs
    plantSize: { type: String, enum: ["S", "M", "L"], required: true },
    labor: { type: Number, required: true },
    capital: { type: Number },
    fixedCost: { type: Number },

    // Production Parameters
    A: { type: Number, default: 5 },
    alpha: { type: Number, default: 0.5 },
    beta: { type: Number, default: 0.5 },

    // Production Results
    output: { type: Number, required: true },
    outputRange: { type: String },

    // Prices
    wageRate: { type: Number, required: true },
    rentalRate: { type: Number, required: true },
    outputPrice: { type: Number, required: true },

    // Cost Analysis
    TFC: { type: Number },
    TVC: { type: Number },
    TC: { type: Number, required: true },
    SRAC: { type: Number },
    sracSmall: { type: Number },
    sracMedium: { type: Number },
    sracLarge: { type: Number },
    LRAC: { type: Number },

    // Revenue & Profit
    totalRevenue: { type: Number, required: true },
    profit: { type: Number, required: true },

    // Optimal Analysis
    optimalPlant: { type: String },
    optimalPlantAtOutput: { type: String },
    isOptimal: { type: Boolean },
    costDiff: { type: Number },
    optimalProfit: { type: Number },
    profitLost: { type: Number },

    // MES Analysis
    MES: { type: String },
    scaleStatus: { type: String },
  },
  { timestamps: true }
);

const Level1Result = mongoose.model("Level1Result", level1ResultSchema);
const Level2Result = mongoose.model("Level2Result", level2ResultSchema);
const Level3Result = mongoose.model("Level3Result", level3ResultSchema);
const Level4Result = mongoose.model("Level4Result", level4ResultSchema);
const Level5Result = mongoose.model("Level5Result", level5ResultSchema);

export { Level1Result, Level2Result, Level3Result, Level4Result, Level5Result };
