exports.marketWage = ({ totalLabor, laborPool, baseWage, elasticity }) => {
  const shortage = Math.max(0, totalLabor - laborPool);
  return baseWage * (1 + (shortage / laborPool) * elasticity);
};

exports.marketPrice = ({ totalOutput, basePrice, sensitivity }) => {
  return Math.max(5000, basePrice - totalOutput * sensitivity);
};
