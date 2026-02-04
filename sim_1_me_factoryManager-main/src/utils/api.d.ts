export function registerUser(data: { name: string; email: string; password: string; role?: string }): Promise<any>;
export function loginUser(data: { email: string; password: string }): Promise<any>;

// Level-wise Decision Submission APIs
export function submitLevel1Decision(data: {
  playerId: string;
  sessionId: string;
  labor: number;
  fixedCapital?: number;
  wageRate: number;
  outputPrice: number;
}): Promise<any>;

export function submitLevel2Decision(data: {
  playerId: string;
  sessionId: string;
  labor: number;
  capital: number;
  wageRate?: number;
  rentalRate?: number;
  outputPrice?: number;
  A?: number;
  alpha?: number;
  beta?: number;
}): Promise<any>;

export function submitLevel3Decision(data: {
  playerId: string;
  sessionId: string;
  labor: number;
  capital: number;
  wageRate?: number;
  rentalRate?: number;
  outputPrice?: number;
  A?: number;
  alpha?: number;
  beta?: number;
}): Promise<any>;

export function submitLevel4Decision(data: {
  playerId: string;
  sessionId: string;
  labor: number;
  fixedCapital?: number;
  wageRate?: number;
  rentalRate?: number;
  outputPrice?: number;
  A?: number;
  alpha?: number;
  beta?: number;
}): Promise<any>;

export function submitLevel5Decision(data: {
  playerId: string;
  sessionId: string;
  plantSize: string;
  labor: number;
  wageRate?: number;
  rentalRate?: number;
  outputPrice?: number;
  A?: number;
  alpha?: number;
  beta?: number;
}): Promise<any>;

// Get Results APIs
export function getPlayerLevelResults(playerId: string, level: number): Promise<any>;
export function getAllPlayerResults(playerId: string): Promise<any>;

// Check submission status
export function checkSubmissionStatus(playerId: string): Promise<{
  level1: { submitted: boolean; result: any };
  level2: { submitted: boolean; result: any };
  level3: { submitted: boolean; result: any };
  level4: { submitted: boolean; result: any };
  level5: { submitted: boolean; result: any };
}>;

// Group APIs
export function getMyGroupLeaderboard(userId: string): Promise<{
  group: {
    _id: string;
    name: string;
    sessionId: string;
    locked: boolean;
    maxPlayers: number;
    playerCount: number;
  };
  leaderboard: Array<{
    playerId: string;
    name: string;
    email: string;
    totalProfit: number;
    totalOutput: number;
    totalCost: number;
    totalRevenue: number;
    submissions: number;
    avgCostPerUnit: number;
    efficiencyScore: number;
    rank: number;
  }>;
  currentUserId: string;
  message?: string;
}>;

// Dashboard API
export function getUserDashboardData(userId: string): Promise<{
  user: {
    _id: string;
    name: string;
    email: string;
  };
  group: {
    _id: string;
    name: string;
    playerCount: number;
    locked: boolean;
  } | null;
  stats: {
    totalProfit: number;
    totalOutput: number;
    totalCost: number;
    totalRevenue: number;
    submissions: number;
    avgCostPerUnit: number;
    levelsCompleted: number;
    rank: number | null;
  };
  recentResults: Array<{
    _id: string;
    level: number;
    labor: number;
    capital?: number;
    output: number;
    totalCost: number;
    totalRevenue: number;
    profit: number;
    createdAt: string;
  }>;
  levelBreakdown: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };
  message?: string;
}>;
