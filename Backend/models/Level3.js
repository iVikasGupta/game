export interface Level3DecisionModel {
  labor: number;
  capital: number;

  output: number;

  // Scale analysis (MAIN)
  alpha: number;
  beta: number;
  returnsToScale: number; // α + β
  scaleType: "IRS" | "CRS" | "DRS";

  // Cost & revenue (secondary)
  totalCost: number;
  totalRevenue: number;
  profit: number;

  interpretation: string;
}
