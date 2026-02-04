export interface DecisionModel {
  id: string;

  // User & game context
  userId: string;
  sessionId: string;
  level: number;
  roundNumber: number;

  // User inputs
  labor: number;
  capital?: number; // Level 2+ only

  // Production results
  output: number;
  marginalProductLabor?: number;
  marginalProductCapital?: number;
  mrtS?: number;

  // Cost & revenue
  totalCost: number;
  totalRevenue: number;
  profit: number;

  // Optimization checks
  isOptimal: boolean;
  optimalCondition: string; // e.g. "P × MP_L = w" or "MRTS = w/r"

  // Scoring
  score: number;
  feedback: string;

  // Meta
  submittedAt: string;
}
