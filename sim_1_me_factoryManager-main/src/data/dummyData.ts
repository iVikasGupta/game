export interface User {
  id: string;
  email: string;
  full_name: string;
  student_id: string | null;
  role: 'student' | 'instructor';
}

export interface GameSession {
  id: string;
  name: string;
  instructor_id: string;
  status: 'active' | 'paused' | 'completed';
  current_level: number;
  current_round: number;
}

export interface SessionPlayer {
  id: string;
  session_id: string;
  user_id: string;
  starting_budget: number;
  current_budget: number;
  cumulative_revenue: number;
  cumulative_cost: number;
  cumulative_profit: number;
  total_output: number;
  average_cost_per_unit: number;
  rounds_completed: number;
  plant_size: 'none' | 'small' | 'medium' | 'large';
  final_rank: number | null;
}

export interface Round {
  id: string;
  session_id: string;
  level: number;
  round_number: number;
  production_function: 'single-input' | 'cobb-douglas' | 'irs' | 'crs' | 'drs';
  param_a: number | null;
  param_alpha: number | null;
  param_beta: number | null;
  fixed_capital: number | null;
  output_price: number;
  wage_rate: number;
  rental_rate: number;
  fixed_cost: number;
  status: 'pending' | 'open' | 'closed' | 'processed';
  deadline: string | null;
}

export interface Decision {
  id: string;
  round_id: string;
  user_id: string;
  labor: number;
  capital: number | null;
  estimated_output: number;
  estimated_cost: number;
  estimated_revenue: number;
  estimated_profit: number;
  submitted_at: string;
}

export interface Result {
  id: string;
  round_id: string;
  user_id: string;
  labor: number;
  capital: number;
  output: number;
  total_fixed_cost: number;
  total_variable_cost: number;
  total_cost: number;
  average_fixed_cost: number | null;
  average_variable_cost: number;
  average_total_cost: number;
  marginal_cost: number;
  marginal_product_labor: number;
  marginal_product_capital: number | null;
  total_revenue: number;
  profit: number;
  output_rank: number;
  profit_rank: number;
  efficiency_rank: number;
  rounds?: {
    level: number;
    round_number: number;
  };
}

export const dummyUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@university.edu',
    full_name: 'John Doe',
    student_id: 'STU001',
    role: 'student'
  },
  {
    id: 'user-2',
    email: 'jane.smith@university.edu',
    full_name: 'Jane Smith',
    student_id: 'STU002',
    role: 'student'
  },
  {
    id: 'instructor-1',
    email: 'prof.johnson@university.edu',
    full_name: 'Prof. Robert Johnson',
    student_id: null,
    role: 'instructor'
  }
];

export const dummySessions: GameSession[] = [
  {
    id: 'session-1',
    name: 'Economics 101 - Fall 2024',
    instructor_id: 'instructor-1',
    status: 'active',
    current_level: 1,
    current_round: 3
  }
];

export const dummySessionPlayers: SessionPlayer[] = [
  {
    id: 'player-1',
    session_id: 'session-1',
    user_id: 'user-1',
    starting_budget: 50000000,
    current_budget: 48500000,
    cumulative_revenue: 4500000,
    cumulative_cost: 6000000,
    cumulative_profit: -1500000,
    total_output: 450,
    average_cost_per_unit: 13333,
    rounds_completed: 8,
    plant_size: 'none',
    final_rank: null
  }
];

export const dummyRounds: Round[] = [
  {
    id: 'round-1',
    session_id: 'session-1',
    level: 1,
    round_number: 1,
    production_function: 'single-input',
    param_a: null,
    param_alpha: null,
    param_beta: null,
    fixed_capital: 10,
    output_price: 20000,
    wage_rate: 50000,
    rental_rate: 100000,
    fixed_cost: 0,
    status: 'processed',
    deadline: null
  },
  {
    id: 'round-2',
    session_id: 'session-1',
    level: 1,
    round_number: 2,
    production_function: 'single-input',
    param_a: null,
    param_alpha: null,
    param_beta: null,
    fixed_capital: 10,
    output_price: 18000,
    wage_rate: 50000,
    rental_rate: 100000,
    fixed_cost: 0,
    status: 'processed',
    deadline: null
  },
  {
    id: 'round-3',
    session_id: 'session-1',
    level: 1,
    round_number: 3,
    production_function: 'single-input',
    param_a: null,
    param_alpha: null,
    param_beta: null,
    fixed_capital: 10,
    output_price: 22000,
    wage_rate: 55000,
    rental_rate: 100000,
    fixed_cost: 0,
    status: 'open',
    deadline: '2024-12-31T23:59:59'
  }
];

export const dummyResults: Result[] = [
  {
    id: 'result-1',
    round_id: 'round-1',
    user_id: 'user-1',
    labor: 4,
    capital: 10,
    output: 20,
    total_fixed_cost: 0,
    total_variable_cost: 200000,
    total_cost: 200000,
    average_fixed_cost: null,
    average_variable_cost: 10000,
    average_total_cost: 10000,
    marginal_cost: 20000,
    marginal_product_labor: 2.5,
    marginal_product_capital: null,
    total_revenue: 400000,
    profit: 200000,
    output_rank: 2,
    profit_rank: 1,
    efficiency_rank: 1,
    rounds: {
      level: 1,
      round_number: 1
    }
  },
  {
    id: 'result-2',
    round_id: 'round-2',
    user_id: 'user-1',
    labor: 9,
    capital: 10,
    output: 30,
    total_fixed_cost: 0,
    total_variable_cost: 450000,
    total_cost: 450000,
    average_fixed_cost: null,
    average_variable_cost: 15000,
    average_total_cost: 15000,
    marginal_cost: 30000,
    marginal_product_labor: 1.67,
    marginal_product_capital: null,
    total_revenue: 540000,
    profit: 90000,
    output_rank: 1,
    profit_rank: 2,
    efficiency_rank: 2,
    rounds: {
      level: 1,
      round_number: 2
    }
  },
  {
    id: 'result-3',
    round_id: 'round-1',
    user_id: 'user-1',
    labor: 16,
    capital: 10,
    output: 40,
    total_fixed_cost: 0,
    total_variable_cost: 800000,
    total_cost: 800000,
    average_fixed_cost: null,
    average_variable_cost: 20000,
    average_total_cost: 20000,
    marginal_cost: 40000,
    marginal_product_labor: 1.25,
    marginal_product_capital: null,
    total_revenue: 800000,
    profit: 0,
    output_rank: 1,
    profit_rank: 3,
    efficiency_rank: 3,
    rounds: {
      level: 1,
      round_number: 3
    }
  },
  {
    id: 'result-4',
    round_id: 'round-1',
    user_id: 'user-1',
    labor: 1,
    capital: 10,
    output: 10,
    total_fixed_cost: 0,
    total_variable_cost: 50000,
    total_cost: 50000,
    average_fixed_cost: null,
    average_variable_cost: 5000,
    average_total_cost: 5000,
    marginal_cost: 10000,
    marginal_product_labor: 5.0,
    marginal_product_capital: null,
    total_revenue: 200000,
    profit: 150000,
    output_rank: 4,
    profit_rank: 2,
    efficiency_rank: 1,
    rounds: {
      level: 1,
      round_number: 4
    }
  },
  {
    id: 'result-5',
    round_id: 'round-2',
    user_id: 'user-1',
    labor: 25,
    capital: 10,
    output: 50,
    total_fixed_cost: 0,
    total_variable_cost: 1250000,
    total_cost: 1250000,
    average_fixed_cost: null,
    average_variable_cost: 25000,
    average_total_cost: 25000,
    marginal_cost: 50000,
    marginal_product_labor: 1.0,
    marginal_product_capital: null,
    total_revenue: 900000,
    profit: -350000,
    output_rank: 1,
    profit_rank: 5,
    efficiency_rank: 5,
    rounds: {
      level: 1,
      round_number: 5
    }
  },
  {
    id: 'result-6',
    round_id: 'round-1',
    user_id: 'user-1',
    labor: 6,
    capital: 10,
    output: 24.49,
    total_fixed_cost: 0,
    total_variable_cost: 300000,
    total_cost: 300000,
    average_fixed_cost: null,
    average_variable_cost: 12247,
    average_total_cost: 12247,
    marginal_cost: 24494,
    marginal_product_labor: 2.04,
    marginal_product_capital: null,
    total_revenue: 489800,
    profit: 189800,
    output_rank: 2,
    profit_rank: 1,
    efficiency_rank: 1,
    rounds: {
      level: 1,
      round_number: 6
    }
  },
  {
    id: 'result-7',
    round_id: 'round-2',
    user_id: 'user-1',
    labor: 2,
    capital: 10,
    output: 14.14,
    total_fixed_cost: 0,
    total_variable_cost: 100000,
    total_cost: 100000,
    average_fixed_cost: null,
    average_variable_cost: 7071,
    average_total_cost: 7071,
    marginal_cost: 14142,
    marginal_product_labor: 3.54,
    marginal_product_capital: null,
    total_revenue: 254520,
    profit: 154520,
    output_rank: 3,
    profit_rank: 2,
    efficiency_rank: 1,
    rounds: {
      level: 1,
      round_number: 7
    }
  },
  {
    id: 'result-8',
    round_id: 'round-1',
    user_id: 'user-1',
    labor: 3,
    capital: 10,
    output: 17.32,
    total_fixed_cost: 0,
    total_variable_cost: 150000,
    total_cost: 150000,
    average_fixed_cost: null,
    average_variable_cost: 8660,
    average_total_cost: 8660,
    marginal_cost: 17321,
    marginal_product_labor: 2.89,
    marginal_product_capital: null,
    total_revenue: 346400,
    profit: 196400,
    output_rank: 3,
    profit_rank: 1,
    efficiency_rank: 1,
    rounds: {
      level: 1,
      round_number: 8
    }
  }
];

export const leaderboardData = [
  {
    rank: 1,
    name: 'Sarah Chen',
    student_id: 'STU045',
    cumulative_profit: 2500000,
    avg_cost: 8500,
    total_output: 680,
    efficiency_score: 95.5
  },
  {
    rank: 2,
    name: 'John Doe',
    student_id: 'STU001',
    cumulative_profit: -1500000,
    avg_cost: 13333,
    total_output: 450,
    efficiency_score: 72.3
  },
  {
    rank: 3,
    name: 'Michael Torres',
    student_id: 'STU023',
    cumulative_profit: -2800000,
    avg_cost: 18200,
    total_output: 520,
    efficiency_score: 68.9
  },
  {
    rank: 4,
    name: 'Emily Watson',
    student_id: 'STU012',
    cumulative_profit: -3200000,
    avg_cost: 21500,
    total_output: 480,
    efficiency_score: 65.2
  },
  {
    rank: 5,
    name: 'David Park',
    student_id: 'STU067',
    cumulative_profit: -4100000,
    avg_cost: 25000,
    total_output: 410,
    efficiency_score: 58.7
  }
];

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const login = (email: string, password: string): User | null => {
  const user = dummyUsers.find(u => u.email === email);
  if (user && password.length >= 6) {
    setCurrentUser(user);
    return user;
  }
  return null;
};

export const register = (email: string, password: string, fullName: string, studentId?: string, role: 'student' | 'instructor' = 'student'): User => {
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    full_name: fullName,
    student_id: studentId || null,
    role
  };
  setCurrentUser(newUser);
  return newUser;
};

export const logout = () => {
  setCurrentUser(null);
};

export const getCurrentRound = (): Round | null => {
  return dummyRounds.find(r => r.status === 'open') || null;
};

export const getUserResults = (userId: string): Result[] => {
  return dummyResults.filter(r => r.user_id === userId);
};

export const getCurrentPlayer = (userId: string): SessionPlayer | null => {
  return dummySessionPlayers.find(p => p.user_id === userId) || null;
};
