export interface Level4DecisionModel {
  labor: number; // decision variable
  fixedCapital: number;

  output: number;

  // Costs
  TFC: number;
  TVC: number;
  TC: number;
  AFC: number;
  AVC: number;
  ATC: number;
  MC: number;

  // Revenue & profit
  price: number;
  totalRevenue: number;
  profit: number;

  // Shutdown logic (MAIN)
  shutdownRule: "Operate" | "Shutdown";
  lossIfOperate: number;
  lossIfShutdown: number;
  bestDecision: string;
}
