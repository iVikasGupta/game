export interface ProductionResult {
  output: number;
  labor: number;
  capital: number;
}

export interface MarginalProducts {
  marginalProductLabor: number;
  marginalProductCapital: number;
}

export interface CostBreakdown {
  totalFixedCost: number;
  totalVariableCost: number;
  totalCost: number;
  averageFixedCost: number | null;
  averageVariableCost: number | null;
  averageTotalCost: number | null;
  marginalCost: number | null;
  marginalProductLabor?: number;
  marginalProductCapital?: number;
}

export const calculateOutputLevel1 = (L: number, fixedK: number = 10): ProductionResult => {
  const output = 10 * Math.sqrt(L);

  return {
    output,
    labor: L,
    capital: fixedK
  };
};

export const calculateMarginalProductLabor = (L: number): number => {
  return 5 / Math.sqrt(L);
};

export const calculateAverageProductLabor = (L: number): number => {
  return 10 / Math.sqrt(L);
};

export const calculateCostsLevel1 = (
  L: number,
  output: number,
  wageRate: number
): CostBreakdown => {
  const TVC = wageRate * L;
  const TFC = 0;
  const TC = TFC + TVC;

  const AVC = output > 0 ? TVC / output : 0;
  const MP_L = calculateMarginalProductLabor(L);
  const MC = wageRate / MP_L;

  return {
    totalFixedCost: TFC,
    totalVariableCost: TVC,
    totalCost: TC,
    averageFixedCost: null,
    averageVariableCost: AVC,
    averageTotalCost: output > 0 ? TC / output : null,
    marginalCost: MC,
    marginalProductLabor: MP_L
  };
};

export const calculateOptimalLaborLevel1 = (price: number, wageRate: number) => {
  const optimalL = Math.pow((5 * price) / wageRate, 2);

  return {
    optimalLabor: optimalL,
    condition: 'P × MP_L = wage',
    formula: `L = (5P/w)² = (5×${price}/${wageRate})² = ${optimalL.toFixed(2)}`
  };
};

export const calculateOutputLevel2 = (
  L: number,
  K: number,
  A: number = 5,
  alpha: number = 0.5,
  beta: number = 0.5
): ProductionResult & { technology: number; laborElasticity: number; capitalElasticity: number } => {
  const output = A * Math.pow(L, alpha) * Math.pow(K, beta);

  return {
    output,
    labor: L,
    capital: K,
    technology: A,
    laborElasticity: alpha,
    capitalElasticity: beta
  };
};

export const calculateMarginalProducts = (
  L: number,
  K: number,
  A: number = 5,
  alpha: number = 0.5,
  beta: number = 0.5
): MarginalProducts => {
  const MP_L = alpha * A * Math.pow(L, alpha - 1) * Math.pow(K, beta);
  const MP_K = beta * A * Math.pow(L, alpha) * Math.pow(K, beta - 1);

  return {
    marginalProductLabor: MP_L,
    marginalProductCapital: MP_K
  };
};

export const calculateMRTS = (MP_L: number, MP_K: number) => {
  const MRTS = MP_L / MP_K;

  return {
    mrts: MRTS,
    interpretation: `Can replace 1 worker with ${MRTS.toFixed(4)} units of capital`
  };
};

export const calculateOptimalInputMix = (
  Q: number,
  wageRate: number,
  rentalRate: number,
  A: number = 5,
  alpha: number = 0.5,
  beta: number = 0.5
) => {
  const optimalRatio = wageRate / rentalRate;
  const optimalL = Q / (A * Math.pow(optimalRatio, beta));
  const optimalK = optimalRatio * optimalL;
  const totalCost = wageRate * optimalL + rentalRate * optimalK;

  return {
    optimalLabor: optimalL,
    optimalCapital: optimalK,
    optimalRatio,
    totalCost,
    condition: `K/L = w/r = ${wageRate}/${rentalRate} = ${optimalRatio.toFixed(4)}`
  };
};

export const calculateOutputIRS = (
  L: number,
  K: number,
  A: number = 2,
  alpha: number = 0.6,
  beta: number = 0.6
) => {
  const output = A * Math.pow(L, alpha) * Math.pow(K, beta);

  return {
    output,
    returnsToScale: 'increasing' as const,
    sumExponents: alpha + beta,
    explanation: 'Doubling inputs more than doubles output'
  };
};

export const calculateOutputCRS = (
  L: number,
  K: number,
  A: number = 3,
  alpha: number = 0.5,
  beta: number = 0.5
) => {
  const output = A * Math.pow(L, alpha) * Math.pow(K, beta);

  return {
    output,
    returnsToScale: 'constant' as const,
    sumExponents: alpha + beta,
    explanation: 'Doubling inputs exactly doubles output'
  };
};

export const calculateOutputDRS = (
  L: number,
  K: number,
  A: number = 10,
  alpha: number = 0.3,
  beta: number = 0.3
) => {
  const output = A * Math.pow(L, alpha) * Math.pow(K, beta);

  return {
    output,
    returnsToScale: 'decreasing' as const,
    sumExponents: alpha + beta,
    explanation: 'Doubling inputs less than doubles output'
  };
};

export const testReturnsToScale = (
  L1: number,
  K1: number,
  L2: number,
  K2: number,
  output1: number,
  output2: number
) => {
  const scaleFactor = L2 / L1;
  const kScaleFactor = K2 / K1;

  if (Math.abs(scaleFactor - kScaleFactor) > 0.01) {
    return {
      error: 'Inputs not scaled proportionally',
      laborScale: scaleFactor,
      capitalScale: kScaleFactor
    };
  }

  const outputScale = output2 / output1;

  let returnsToScale: 'increasing' | 'decreasing' | 'constant';
  if (outputScale > scaleFactor * 1.05) {
    returnsToScale = 'increasing';
  } else if (outputScale < scaleFactor * 0.95) {
    returnsToScale = 'decreasing';
  } else {
    returnsToScale = 'constant';
  }

  return {
    inputScale: scaleFactor,
    outputScale,
    returnsToScale,
    elasticity: outputScale / scaleFactor
  };
};

export const calculateOutputShortRun = (
  L: number,
  fixedK: number = 20,
  A: number = 5,
  alpha: number = 0.5,
  beta: number = 0.5
) => {
  const output = A * Math.pow(L, alpha) * Math.pow(fixedK, beta);
  const simplifiedA = A * Math.pow(fixedK, beta);

  return {
    output,
    labor: L,
    capital: fixedK,
    simplifiedForm: `Q = ${simplifiedA.toFixed(2)}L^${alpha}`
  };
};

export const calculateShortRunCosts = (
  L: number,
  output: number,
  wageRate: number,
  rentalRate: number,
  fixedK: number
): CostBreakdown => {
  const TFC = rentalRate * fixedK;
  const TVC = wageRate * L;
  const TC = TFC + TVC;

  if (output === 0) {
    return {
      totalFixedCost: TFC,
      totalVariableCost: TVC,
      totalCost: TC,
      averageFixedCost: null,
      averageVariableCost: null,
      averageTotalCost: null,
      marginalCost: null
    };
  }

  const AFC = TFC / output;
  const AVC = TVC / output;
  const ATC = TC / output;
  const MC = (2 * wageRate * output) / Math.pow(5 * Math.sqrt(fixedK), 2);

  return {
    totalFixedCost: TFC,
    totalVariableCost: TVC,
    totalCost: TC,
    averageFixedCost: AFC,
    averageVariableCost: AVC,
    averageTotalCost: ATC,
    marginalCost: MC
  };
};

export const shouldShutdown = (price: number, averageVariableCost: number) => {
  if (price < averageVariableCost) {
    return {
      shutdown: true,
      reason: `Price (${price}) < AVC (${averageVariableCost.toFixed(2)})`,
      explanation: 'Not covering variable costs - minimize loss by shutting down'
    };
  }

  return {
    shutdown: false,
    reason: `Price (${price}) ≥ AVC (${averageVariableCost.toFixed(2)})`,
    explanation: 'Continue operating - covering variable costs and contributing to fixed costs'
  };
};

export const calculateOptimalOutputShortRun = (price: number, wageRate: number, fixedK: number) => {
  const coefficient = (2 * wageRate) / Math.pow(5 * Math.sqrt(fixedK), 2);
  const optimalOutput = price / coefficient;

  return {
    optimalOutput,
    condition: 'P = MC',
    formula: `Q = P / MC_coefficient = ${price} / ${coefficient.toFixed(2)} = ${optimalOutput.toFixed(2)}`
  };
};

export interface PlantSize {
  capital: number;
  fixedCost: number;
  name: string;
  bestFor: string;
}

export const plantSizes: Record<string, PlantSize> = {
  small: {
    capital: 10,
    fixedCost: 1000000,
    name: 'Small Plant',
    bestFor: 'Output < 1500 units'
  },
  medium: {
    capital: 25,
    fixedCost: 2500000,
    name: 'Medium Plant',
    bestFor: 'Output 1500-4000 units'
  },
  large: {
    capital: 50,
    fixedCost: 5000000,
    name: 'Large Plant',
    bestFor: 'Output > 4000 units'
  }
};

export const calculateSRAC = (
  output: number,
  plantSize: 'small' | 'medium' | 'large',
  wageRate: number,
  rentalRate: number,
  A: number = 5,
  alpha: number = 0.5,
  beta: number = 0.5
) => {
  const plant = plantSizes[plantSize];
  const K = plant.capital;
  const fixedCost = plant.fixedCost;

  if (output === 0) {
    return {
      srac: Infinity,
      tfc: fixedCost,
      tvc: 0,
      tc: fixedCost,
      labor: 0,
      capital: K
    };
  }

  const L = Math.pow(output / (A * Math.pow(K, beta)), 1 / alpha);

  const TFC = fixedCost;
  const TVC = wageRate * L;
  const TC = TFC + TVC;
  const SRAC = TC / output;

  return {
    srac: SRAC,
    tfc: TFC,
    tvc: TVC,
    tc: TC,
    labor: L,
    capital: K
  };
};

export const calculateLAC = (output: number, wageRate: number, rentalRate: number) => {
  const sracSmall = calculateSRAC(output, 'small', wageRate, rentalRate);
  const sracMedium = calculateSRAC(output, 'medium', wageRate, rentalRate);
  const sracLarge = calculateSRAC(output, 'large', wageRate, rentalRate);

  const costs = [
    { size: 'small' as const, srac: sracSmall.srac },
    { size: 'medium' as const, srac: sracMedium.srac },
    { size: 'large' as const, srac: sracLarge.srac }
  ];

  costs.sort((a, b) => a.srac - b.srac);

  return {
    lac: costs[0].srac,
    optimalPlantSize: costs[0].size,
    allCosts: costs
  };
};

export const calculateMES = (
  wageRate: number,
  rentalRate: number,
  outputRange: [number, number] = [0, 10000],
  step: number = 100
) => {
  let minLAC = Infinity;
  let mesOutput = 0;
  let mesPlant: 'small' | 'medium' | 'large' = 'small';

  for (let Q = step; Q <= outputRange[1]; Q += step) {
    const result = calculateLAC(Q, wageRate, rentalRate);

    if (result.lac < minLAC) {
      minLAC = result.lac;
      mesOutput = Q;
      mesPlant = result.optimalPlantSize;
    }
  }

  return {
    mes: mesOutput,
    minLAC,
    optimalPlant: mesPlant,
    explanation: `Produce at least ${mesOutput} units to minimize average cost at ${minLAC.toFixed(2)}/unit`
  };
};

export const analyzeScaleEconomies = (
  output: number,
  previousOutput: number | null,
  wageRate: number,
  rentalRate: number
) => {
  if (!previousOutput || output <= previousOutput) {
    return { scale: 'insufficient_data' as const };
  }

  const currentLAC = calculateLAC(output, wageRate, rentalRate);
  const previousLAC = calculateLAC(previousOutput, wageRate, rentalRate);

  const lacChange = currentLAC.lac - previousLAC.lac;
  const lacChangePercent = (lacChange / previousLAC.lac) * 100;

  let scaleType: 'economies' | 'diseconomies' | 'constant';
  if (lacChange < -0.01) {
    scaleType = 'economies';
  } else if (lacChange > 0.01) {
    scaleType = 'diseconomies';
  } else {
    scaleType = 'constant';
  }

  return {
    scale: scaleType,
    currentLAC: currentLAC.lac,
    previousLAC: previousLAC.lac,
    lacChange,
    lacChangePercent,
    explanation: scaleType === 'economies'
      ? 'Average cost falling - economies of scale'
      : scaleType === 'diseconomies'
      ? 'Average cost rising - diseconomies of scale'
      : 'Average cost constant'
  };
};

export const calculatePlantSwitchingCost = (
  currentPlant: string,
  newPlant: string
) => {
  if (currentPlant === newPlant) {
    return {
      switchingCost: 0,
      shouldSwitch: false,
      reason: 'Already in selected plant size'
    };
  }

  const switchingCost = 10000000;

  return {
    switchingCost,
    currentPlant,
    newPlant,
    warning: 'Switching plants costs Rs. 100 lakhs'
  };
};
