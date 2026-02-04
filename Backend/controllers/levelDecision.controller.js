import { Level1Result, Level2Result, Level3Result, Level4Result, Level5Result } from "../models/LevelResult.js";

// Level 1: Single Input Production Function
export const submitLevel1Decision = async (req, res) => {
  try {
    const { playerId, sessionId, labor, fixedCapital = 10, wageRate, outputPrice } = req.body;

    // Check if user has already submitted for this level
    const existingSubmission = await Level1Result.findOne({ playerId });
    if (existingSubmission) {
      return res.status(400).json({ 
        error: "You have already submitted for Level 1. Only one submission per level is allowed.",
        alreadySubmitted: true 
      });
    }

    // Calculations
    const output = 10 * Math.sqrt(labor);
    const marginalProductLabor = 5 / Math.sqrt(labor);
    const totalCost = wageRate * labor;
    const totalRevenue = output * outputPrice;
    const profit = totalRevenue - totalCost;
    const averageVariableCost = output > 0 ? totalCost / output : 0;
    const marginalCost = wageRate / marginalProductLabor;

    // Optimal calculation
    const optimalLabor = Math.pow((5 * outputPrice) / wageRate, 2);
    const isOptimal = Math.abs(labor - optimalLabor) < 5;

    const result = await Level1Result.create({
      playerId,
      sessionId,
      labor,
      fixedCapital,
      output,
      marginalProductLabor,
      wageRate,
      outputPrice,
      totalCost,
      totalRevenue,
      profit,
      averageVariableCost,
      marginalCost,
      optimalLabor,
      isOptimal,
      optimalCondition: "P × MP_L = w",
      efficiencyScore: isOptimal ? 100 : Math.max(0, 100 - Math.abs(labor - optimalLabor) * 2),
      feedback: isOptimal ? "Optimal decision!" : "Consider adjusting labor closer to optimal",
    });

    res.status(201).json({
      message: "Level 1 decision submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Level 1 submission error:", error);
    res.status(500).json({ error: "Failed to submit Level 1 decision" });
  }
};

// Level 2: Cobb-Douglas (CRS) with MRTS Optimization
export const submitLevel2Decision = async (req, res) => {
  try {
    const { playerId, sessionId, labor, capital, wageRate = 50000, rentalRate = 100000, outputPrice = 20000, A = 5, alpha = 0.5, beta = 0.5 } = req.body;

    // Check if user has already submitted for this level
    const existingSubmission = await Level2Result.findOne({ playerId });
    if (existingSubmission) {
      return res.status(400).json({ 
        error: "You have already submitted for Level 2. Only one submission per level is allowed.",
        alreadySubmitted: true 
      });
    }

    // Calculations
    const output = A * Math.pow(labor, alpha) * Math.pow(capital, beta);
    const mpL = A * alpha * Math.pow(labor, alpha - 1) * Math.pow(capital, beta);
    const mpK = A * beta * Math.pow(labor, alpha) * Math.pow(capital, beta - 1);
    const mrts = mpL / mpK;
    const inputRatio = capital / labor;

    const laborCost = wageRate * labor;
    const capitalCost = rentalRate * capital;
    const totalCost = laborCost + capitalCost;
    const averageCost = output > 0 ? totalCost / output : 0;
    const totalRevenue = output * outputPrice;
    const profit = totalRevenue - totalCost;

    const optimalMRTS = wageRate / rentalRate;
    const isocostSlope = -wageRate / rentalRate;
    const isOptimal = Math.abs(mrts - optimalMRTS) < 0.01;

    const result = await Level2Result.create({
      playerId,
      sessionId,
      labor,
      capital,
      A,
      alpha,
      beta,
      output,
      mpL,
      mpK,
      mrts,
      inputRatio,
      wageRate,
      rentalRate,
      outputPrice,
      laborCost,
      capitalCost,
      totalCost,
      totalRevenue,
      profit,
      averageCost,
      optimalMRTS,
      isocostSlope,
      isOptimal,
    });

    res.status(201).json({
      message: "Level 2 decision submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Level 2 submission error:", error);
    res.status(500).json({ error: "Failed to submit Level 2 decision" });
  }
};

// Level 3: Returns to Scale Analysis (IRS)
export const submitLevel3Decision = async (req, res) => {
  try {
    const { playerId, sessionId, labor, capital, wageRate = 45000, rentalRate = 90000, outputPrice = 18000, A = 5, alpha = 0.6, beta = 0.6 } = req.body;

    // Check if user has already submitted for this level
    const existingSubmission = await Level3Result.findOne({ playerId });
    if (existingSubmission) {
      return res.status(400).json({ 
        error: "You have already submitted for Level 3. Only one submission per level is allowed.",
        alreadySubmitted: true 
      });
    }

    // Calculations
    const output = A * Math.pow(labor, alpha) * Math.pow(capital, beta);
    const mpL = A * alpha * Math.pow(labor, alpha - 1) * Math.pow(capital, beta);
    const mpK = A * beta * Math.pow(labor, alpha) * Math.pow(capital, beta - 1);
    const mrts = mpL / mpK;
    const inputRatio = capital / labor;

    const laborCost = wageRate * labor;
    const capitalCost = rentalRate * capital;
    const totalCost = laborCost + capitalCost;
    const averageCost = output > 0 ? totalCost / output : 0;
    const totalRevenue = output * outputPrice;
    const profit = totalRevenue - totalCost;

    // Returns to Scale
    const returnsToScale = alpha + beta;
    let scaleType, scaleInterpretation;
    if (returnsToScale > 1) {
      scaleType = "IRS";
      scaleInterpretation = "Increasing Returns to Scale (Economies of Scale)";
    } else if (returnsToScale === 1) {
      scaleType = "CRS";
      scaleInterpretation = "Constant Returns to Scale";
    } else {
      scaleType = "DRS";
      scaleInterpretation = "Decreasing Returns to Scale (Diseconomies of Scale)";
    }

    const result = await Level3Result.create({
      playerId,
      sessionId,
      labor,
      capital,
      A,
      alpha,
      beta,
      output,
      mpL,
      mpK,
      mrts,
      inputRatio,
      returnsToScale,
      scaleType,
      scaleInterpretation,
      wageRate,
      rentalRate,
      outputPrice,
      laborCost,
      capitalCost,
      totalCost,
      totalRevenue,
      profit,
      averageCost,
    });

    res.status(201).json({
      message: "Level 3 decision submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Level 3 submission error:", error);
    res.status(500).json({ error: "Failed to submit Level 3 decision" });
  }
};

// Level 4: Short-Run Cost Analysis with Shutdown Decision
export const submitLevel4Decision = async (req, res) => {
  try {
    const {
      playerId,
      sessionId,
      labor,
      fixedCapital = 20,
      wageRate = 60000,
      rentalRate = 120000,
      outputPrice = 25000,
      A = 5,
      alpha = 0.5,
      beta = 0.5,
    } = req.body;

    // Check if user has already submitted for this level
    const existingSubmission = await Level4Result.findOne({ playerId });
    if (existingSubmission) {
      return res.status(400).json({ 
        error: "You have already submitted for Level 4. Only one submission per level is allowed.",
        alreadySubmitted: true 
      });
    }

    // Calculations
    const output = A * Math.pow(labor, alpha) * Math.pow(fixedCapital, beta);
    const mpL = A * alpha * Math.pow(labor, alpha - 1) * Math.pow(fixedCapital, beta);
    const apL = output / labor;

    const TFC = rentalRate * fixedCapital;
    const TVC = wageRate * labor;
    const TC = TFC + TVC;
    const AFC = output > 0 ? TFC / output : 0;
    const AVC = output > 0 ? TVC / output : 0;
    const ATC = output > 0 ? TC / output : 0;
    const MC = mpL > 0 ? wageRate / mpL : 0;

    const totalRevenue = output * outputPrice;
    const profit = totalRevenue - TC;

    // Shutdown Analysis
    const shutdownRule = outputPrice > AVC ? "Operate" : "Shutdown";
    const lossIfOperate = TC > totalRevenue ? TC - totalRevenue : 0;
    const lossIfShutdown = TFC;

    let bestDecision;
    if (outputPrice > AVC) {
      bestDecision = "Continue Operating";
    } else if (lossIfOperate < lossIfShutdown) {
      bestDecision = "Continue Operating (smaller loss)";
    } else {
      bestDecision = "Shutdown";
    }

    const result = await Level4Result.create({
      playerId,
      sessionId,
      labor,
      fixedCapital,
      A,
      alpha,
      beta,
      output,
      mpL,
      apL,
      wageRate,
      rentalRate,
      outputPrice,
      TFC,
      TVC,
      TC,
      AFC,
      AVC,
      ATC,
      MC,
      totalRevenue,
      profit,
      shutdownRule,
      lossIfOperate,
      lossIfShutdown,
      bestDecision,
    });

    res.status(201).json({
      message: "Level 4 decision submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Level 4 submission error:", error);
    res.status(500).json({ error: "Failed to submit Level 4 decision" });
  }
};

// Level 5: Long-Run Cost & Plant Size Choice
export const submitLevel5Decision = async (req, res) => {
  try {
    const { playerId, sessionId, plantSize, labor, wageRate = 50000, rentalRate = 100000, outputPrice = 30000, A = 5, alpha = 0.5, beta = 0.5 } = req.body;

    // Check if user has already submitted for this level
    const existingSubmission = await Level5Result.findOne({ playerId });
    if (existingSubmission) {
      return res.status(400).json({ 
        error: "You have already submitted for Level 5. Only one submission per level is allowed.",
        alreadySubmitted: true 
      });
    }

    // Plant options
    const plantOptions = {
      S: { K: 10, fixedCost: 1000000 },
      M: { K: 25, fixedCost: 2500000 },
      L: { K: 50, fixedCost: 5000000 },
    };

    const selectedPlant = plantOptions[plantSize];
    const capital = selectedPlant.K;
    const TFC = selectedPlant.fixedCost;

    // Output calculations
    const output = A * Math.pow(labor, alpha) * Math.pow(capital, beta);
    const TVC = wageRate * labor;
    const TC = TFC + TVC;
    const SRAC = output > 0 ? TC / output : 0;
    const totalRevenue = output * outputPrice;
    const profit = totalRevenue - TC;

    // SRAC for all plants (at same labor)
    const sracSmall = output > 0 ? (plantOptions.S.fixedCost + TVC) / (A * Math.pow(labor, alpha) * Math.pow(plantOptions.S.K, beta)) : 0;
    const sracMedium = output > 0 ? (plantOptions.M.fixedCost + TVC) / (A * Math.pow(labor, alpha) * Math.pow(plantOptions.M.K, beta)) : 0;
    const sracLarge = output > 0 ? (plantOptions.L.fixedCost + TVC) / (A * Math.pow(labor, alpha) * Math.pow(plantOptions.L.K, beta)) : 0;
    const LRAC = Math.min(sracSmall, sracMedium, sracLarge);

    // Output range and optimal plant
    let outputRange, optimalPlant;
    if (output < 150) {
      outputRange = "< 150 units";
      optimalPlant = "Small";
    } else if (output <= 400) {
      outputRange = "150-400 units";
      optimalPlant = "Medium";
    } else {
      outputRange = "> 400 units";
      optimalPlant = "Large";
    }

    // Optimal plant at output
    let optimalPlantAtOutput = "Small";
    if (sracMedium < sracSmall && sracMedium <= sracLarge) optimalPlantAtOutput = "Medium";
    if (sracLarge < sracSmall && sracLarge < sracMedium) optimalPlantAtOutput = "Large";

    const isOptimal =
      (plantSize === "S" && optimalPlantAtOutput === "Small") ||
      (plantSize === "M" && optimalPlantAtOutput === "Medium") ||
      (plantSize === "L" && optimalPlantAtOutput === "Large");

    const costDiff = SRAC - LRAC;

    // Calculate optimal profit
    let optimalTC = 0;
    if (optimalPlantAtOutput === "Small") {
      optimalTC = plantOptions.S.fixedCost + TVC;
    } else if (optimalPlantAtOutput === "Medium") {
      optimalTC = plantOptions.M.fixedCost + TVC;
    } else {
      optimalTC = plantOptions.L.fixedCost + TVC;
    }
    const optimalProfit = totalRevenue - optimalTC;
    const profitLost = optimalProfit - profit;

    // MES Analysis
    let MES;
    if (LRAC === sracSmall) MES = "< 150 units";
    else if (LRAC === sracMedium) MES = "150-400 units";
    else MES = "> 400 units";

    const scaleStatus = SRAC > LRAC ? "Not at Minimum Efficient Scale (MES)" : "At MES (Efficient Scale)";

    const result = await Level5Result.create({
      playerId,
      sessionId,
      plantSize,
      labor,
      capital,
      fixedCost: TFC,
      A,
      alpha,
      beta,
      output,
      outputRange,
      wageRate,
      rentalRate,
      outputPrice,
      TFC,
      TVC,
      TC,
      SRAC,
      sracSmall,
      sracMedium,
      sracLarge,
      LRAC,
      totalRevenue,
      profit,
      optimalPlant,
      optimalPlantAtOutput,
      isOptimal,
      costDiff,
      optimalProfit,
      profitLost,
      MES,
      scaleStatus,
    });

    res.status(201).json({
      message: "Level 5 decision submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Level 5 submission error:", error);
    res.status(500).json({ error: "Failed to submit Level 5 decision" });
  }
};

// Get results by level and player
export const getPlayerResults = async (req, res) => {
  try {
    const { playerId, level } = req.params;

    let results;
    switch (parseInt(level)) {
      case 1:
        results = await Level1Result.find({ playerId }).sort({ createdAt: -1 });
        break;
      case 2:
        results = await Level2Result.find({ playerId }).sort({ createdAt: -1 });
        break;
      case 3:
        results = await Level3Result.find({ playerId }).sort({ createdAt: -1 });
        break;
      case 4:
        results = await Level4Result.find({ playerId }).sort({ createdAt: -1 });
        break;
      case 5:
        results = await Level5Result.find({ playerId }).sort({ createdAt: -1 });
        break;
      default:
        return res.status(400).json({ error: "Invalid level" });
    }

    res.json({ results });
  } catch (error) {
    console.error("Get results error:", error);
    res.status(500).json({ error: "Failed to get results" });
  }
};

// Get all results for a player across all levels
export const getAllPlayerResults = async (req, res) => {
  try {
    const { playerId } = req.params;

    const [level1, level2, level3, level4, level5] = await Promise.all([
      Level1Result.find({ playerId }).sort({ createdAt: -1 }),
      Level2Result.find({ playerId }).sort({ createdAt: -1 }),
      Level3Result.find({ playerId }).sort({ createdAt: -1 }),
      Level4Result.find({ playerId }).sort({ createdAt: -1 }),
      Level5Result.find({ playerId }).sort({ createdAt: -1 }),
    ]);

    res.json({
      level1,
      level2,
      level3,
      level4,
      level5,
    });
  } catch (error) {
    console.error("Get all results error:", error);
    res.status(500).json({ error: "Failed to get all results" });
  }
};

// Check submission status for all levels
export const checkSubmissionStatus = async (req, res) => {
  try {
    const { playerId } = req.params;

    const [level1, level2, level3, level4, level5] = await Promise.all([
      Level1Result.findOne({ playerId }),
      Level2Result.findOne({ playerId }),
      Level3Result.findOne({ playerId }),
      Level4Result.findOne({ playerId }),
      Level5Result.findOne({ playerId }),
    ]);

    res.json({
      level1: { submitted: !!level1, result: level1 },
      level2: { submitted: !!level2, result: level2 },
      level3: { submitted: !!level3, result: level3 },
      level4: { submitted: !!level4, result: level4 },
      level5: { submitted: !!level5, result: level5 },
    });
  } catch (error) {
    console.error("Check submission status error:", error);
    res.status(500).json({ error: "Failed to check submission status" });
  }
};
