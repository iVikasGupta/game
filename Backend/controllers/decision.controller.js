const Decision = require("../models/Decision");

exports.submitDecision = async (req, res) => {
  const { roundId, playerId, labor, capital, plantSize } = req.body;

  await Decision.create({
    roundId,
    playerId,
    labor,
    capital,
    plantSize,
  });

  res.json({ message: "Decision submitted" });
};
