const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function registerUser(data) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function loginUser(data) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Level-wise Decision Submission APIs
export async function submitLevel1Decision(data) {
  const response = await fetch(`${API_BASE_URL}/api/decisions/level1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function submitLevel2Decision(data) {
  const response = await fetch(`${API_BASE_URL}/api/decisions/level2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function submitLevel3Decision(data) {
  const response = await fetch(`${API_BASE_URL}/api/decisions/level3`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function submitLevel4Decision(data) {
  const response = await fetch(`${API_BASE_URL}/api/decisions/level4`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function submitLevel5Decision(data) {
  const response = await fetch(`${API_BASE_URL}/api/decisions/level5`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Get Results APIs
export async function getPlayerLevelResults(playerId, level) {
  const response = await fetch(`${API_BASE_URL}/api/decisions/results/${playerId}/level/${level}`);
  return response.json();
}

export async function getAllPlayerResults(playerId) {
  const response = await fetch(`${API_BASE_URL}/api/decisions/results/${playerId}/all`);
  return response.json();
}

// Check submission status for all levels
export async function checkSubmissionStatus(playerId) {
  const response = await fetch(`${API_BASE_URL}/api/decisions/status/${playerId}`);
  return response.json();
}

// Group APIs
export async function getMyGroupLeaderboard(userId) {
  const response = await fetch(`${API_BASE_URL}/api/groups/my-group/${userId}`);
  return response.json();
}

// Dashboard API - Get user's stats and recent results
export async function getUserDashboardData(userId) {
  const response = await fetch(`${API_BASE_URL}/api/groups/my-dashboard/${userId}`);
  return response.json();
}
