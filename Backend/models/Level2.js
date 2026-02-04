export interface Level2DecisionModel {
  // Inputs chosen by user
  labor: number;
  capital: number;

  // Production
  output: number;
  mpL: number;
  mpK: number;
  mrtS: number;

  // Prices
  wageRate: number;
  rentalRate: number;

  // Costs & revenue (shown, not optimized)
  totalCost: number;
  totalRevenue: number;
  profit: number;

  // Optimality check (MAIN)
  optimalMRTS: number; // w / r
  isOptimal: boolean; // |MRTS − w/r| < ε
}
