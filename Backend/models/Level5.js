export interface Level5DecisionModel {
  plantSize: "Small" | "Medium" | "Large";
  labor: number;

  output: number;

  // Short-run costs
  SRAC: number;
  SRAC_S: number;
  SRAC_M: number;
  SRAC_L: number;

  // Long-run cost
  LRAC: number;

  // Optimality
  optimalPlantAtOutput: "Small" | "Medium" | "Large";
  isAtMES: boolean;
  costDifference: number;

  // Profit comparison
  profit: number;
  optimalProfit: number;
  profitLost: number;

  // Scale analysis
  MESRange: string;
  scaleStatus: string;
}
