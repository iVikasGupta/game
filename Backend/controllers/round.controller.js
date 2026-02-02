const Round = require("../models/Round");
const Decision = require("../models/Decision");
const MarketSnapshot = require("../models/MarketSnapshot");
const Result = require("../models/Result");
const market = require("../services/market.service");

exports.clearRound = async (req, res) => {
  const { roundId } = req.params;

  const round = await Round.findById(roundId);
  const decisions = await Decision.find({ roundId });

  const totalLabor = decisions.reduce((s, d) => s + d.labor, 0);
  const totalOutput = decisions.reduce((s, d) => s + 10 * Math.sqrt(d.labor), 0);

  const wage = market.marketWage({
    totalLabor,
    laborPool: round.laborPool,
    baseWage: round.baseWage,
    elasticity: round.wageElasticity,
  });

  const price = market.marketPrice({
    totalOutput,
    basePrice: round.basePrice,
    sensitivity: round.priceSensitivity,
  });

  await MarketSnapshot.create({
    roundId,
    totalLabor,
    marketWage: wage,
    totalOutput,
    marketPrice: price,
  });

  const avgLabor = totalLabor / decisions.length;

  for (const d of decisions) {
    const output = 10 * Math.sqrt(d.labor);
    const cost = d.labor * wage;
    const revenue = output * price;

    let strategy = "Moderate";
    if (d.labor >= avgLabor * 1.2) strategy = "Aggressive";
    if (d.labor <= avgLabor * 0.8) strategy = "Conservative";

    await Result.create({
      roundId,
      playerId: d.playerId,
      labor: d.labor,
      output,
      wagePaid: wage,
      priceReceived: price,
      revenue,
      cost,
      profit: revenue - cost,
      marketShare: (output / totalOutput) * 100,
      strategyType: strategy,
    });
  }

  round.status = "cleared";
  await round.save();

  res.json({ message: "Round cleared", wage, price });
};
