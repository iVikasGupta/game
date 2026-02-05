import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";

const Results = () => {
  const [results, setResults] = useState({ level1: [], level2: [], level3: [], level4: [], level5: [] });
  const [users, setUsers] = useState([]);
  const [groupSummaries, setGroupSummaries] = useState([]);
  const [selectedGroupResults, setSelectedGroupResults] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [viewMode, setViewMode] = useState("user"); // "user" or "group"

  useEffect(() => {
    fetchResults();
    fetchStats();
    fetchUsers();
    fetchGroupSummaries();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/results");
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      console.log("Users API response 👉", res.data);
      // Handle both { users: [...] } and direct array response
      setUsers(res.data?.users || res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchGroupSummaries = async () => {
    try {
      const res = await api.get("/admin/results/groups/summary");
      setGroupSummaries(res.data);
    } catch (err) {
      console.error("Failed to fetch group summaries:", err);
    }
  };

  const fetchGroupResults = async (groupId) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/results/group/${groupId}`);
      setSelectedGroupResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch group results");
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSelect = async (groupId) => {
    await fetchGroupResults(groupId);
  };

  const formatCurrency = (amount) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  // Get unique players from results
  const getUniquePlayers = () => {
    const playerIds = new Set();
    const playerMap = {};

    Object.values(results).forEach(levelResults => {
      if (Array.isArray(levelResults)) {
        levelResults.forEach(r => {
          if (r.playerId) {
            playerIds.add(r.playerId);
            // Try to find user name
            const user = users.find(u => u._id === r.playerId);
            playerMap[r.playerId] = user ? user.name : r.playerId.substring(0, 8) + "...";
          }
        });
      }
    });

    return Array.from(playerIds).map(id => ({
      id,
      name: playerMap[id]
    }));
  };

  const uniquePlayers = getUniquePlayers();

  const getAllResults = () => {
    const all = [];
    
    const addResults = (levelResults, level) => {
      if (!Array.isArray(levelResults)) return;
      levelResults.forEach(r => {
        // Filter by user
        if (selectedUser !== "all" && r.playerId !== selectedUser) return;
        all.push({ ...r, level });
      });
    };

    if (selectedLevel === "all" || selectedLevel === "1") {
      addResults(results.level1, 1);
    }
    if (selectedLevel === "all" || selectedLevel === "2") {
      addResults(results.level2, 2);
    }
    if (selectedLevel === "all" || selectedLevel === "3") {
      addResults(results.level3, 3);
    }
    if (selectedLevel === "all" || selectedLevel === "4") {
      addResults(results.level4, 4);
    }
    if (selectedLevel === "all" || selectedLevel === "5") {
      addResults(results.level5, 5);
    }
    
    return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const allResults = getAllResults();

  // Calculate user stats
  const getUserStats = () => {
    if (selectedUser === "all") return null;
    
    const userResults = allResults;
    const totalProfit = userResults.reduce((sum, r) => sum + (r.profit || 0), 0);
    const avgProfit = userResults.length > 0 ? totalProfit / userResults.length : 0;
    const profitableRounds = userResults.filter(r => r.profit >= 0).length;
    
    return {
      totalSubmissions: userResults.length,
      totalProfit,
      avgProfit,
      profitableRounds,
      successRate: userResults.length > 0 ? ((profitableRounds / userResults.length) * 100).toFixed(1) : 0
    };
  };

  const userStats = getUserStats();

  // Get user name by ID
  const getUserName = (playerId) => {
    const user = users.find(u => u._id === playerId);
    return user ? user.name : playerId?.substring(0, 8) + "...";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>📊 Game Results</h2>
            <button className="btn btn-primary" onClick={() => { fetchResults(); fetchGroupSummaries(); }}>
              🔄 Refresh
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Users</h5>
                    <h2>{stats.users?.total || 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Submissions</h5>
                    <h2>{stats.submissions?.total || 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Groups</h5>
                    <h2>{stats.groups?.total || 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body">
                    <h5 className="card-title">Locked Groups</h5>
                    <h2>{stats.groups?.locked || 0}</h2>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="btn-group mb-4" role="group">
            <button
              className={`btn ${viewMode === "user" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => { setViewMode("user"); setSelectedGroupResults(null); }}
            >
              👤 User View
            </button>
            <button
              className={`btn ${viewMode === "group" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("group")}
            >
              👥 Group View
            </button>
          </div>

          {/* GROUP VIEW */}
          {viewMode === "group" && (
            <>
              {/* Group Summaries with Winners */}
              <div className="card mb-4">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">🏆 Group Leaderboard</h5>
                </div>
                <div className="card-body">
                  {groupSummaries.length === 0 ? (
                    <p className="text-muted text-center">No groups found</p>
                  ) : (
                    <div className="row">
                      {groupSummaries.map((group) => (
                        <div key={group._id} className="col-md-4 mb-3">
                          <div className={`card h-100 ${group.locked ? "border-success" : "border-secondary"}`}>
                            <div className={`card-header ${group.locked ? "bg-success text-white" : "bg-light"}`}>
                              <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">{group.name}</h6>
                                {group.locked && <span className="badge bg-light text-dark">🔒 Locked</span>}
                              </div>
                            </div>
                            <div className="card-body">
                              <p className="mb-1">
                                <small className="text-muted">Players:</small> {group.playerCount}/{group.maxPlayers}
                              </p>
                              <p className="mb-2">
                                <small className="text-muted">Submissions:</small> {group.totalSubmissions}
                              </p>
                              
                              {group.winner ? (
                                <div className="alert alert-success py-2 mb-2">
                                  <strong>🏆 Winner:</strong> {group.winner.name}
                                  <br />
                                  <small>Profit: {formatCurrency(group.winner.totalProfit)}</small>
                                </div>
                              ) : (
                                <div className="alert alert-secondary py-2 mb-2">
                                  <small>No submissions yet</small>
                                </div>
                              )}

                              <button 
                                className="btn btn-sm btn-outline-primary w-100"
                                onClick={() => handleGroupSelect(group._id)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Group Details */}
              {selectedGroupResults && (
                <div className="card mb-4 border-primary">
                  <div className="card-header bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">📋 {selectedGroupResults.group.name} - Detailed Results</h5>
                      <button 
                        className="btn btn-sm btn-light"
                        onClick={() => setSelectedGroupResults(null)}
                      >
                        ✕ Close
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    {/* Player Rankings */}
                    <h6 className="mb-3">🥇 Player Rankings</h6>
                    <div className="table-responsive mb-4">
                      <table className="table table-striped">
                        <thead className="table-dark">
                          <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Email</th>
                            <th>Submissions</th>
                            <th>Total Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGroupResults.players.map((player) => (
                            <tr key={player.playerId} className={player.rank === 1 && player.totalSubmissions > 0 ? "table-success" : ""}>
                              <td>
                                {player.rank === 1 && player.totalSubmissions > 0 ? "🥇" : 
                                 player.rank === 2 && player.totalSubmissions > 0 ? "🥈" : 
                                 player.rank === 3 && player.totalSubmissions > 0 ? "🥉" : player.rank}
                              </td>
                              <td>
                                <strong>{player.name}</strong>
                                {player.rank === 1 && player.totalSubmissions > 0 && 
                                  <span className="badge bg-warning text-dark ms-2">Winner</span>
                                }
                              </td>
                              <td>{player.email}</td>
                              <td>{player.totalSubmissions}</td>
                              <td className={player.totalProfit >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {formatCurrency(player.totalProfit)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Level-wise submission counts */}
                    <h6 className="mb-3">📊 Submissions by Level</h6>
                    <div className="row mb-4">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div key={level} className="col">
                          <div className="card text-center">
                            <div className="card-body py-2">
                              <h5 className="mb-0">{selectedGroupResults.totals[`level${level}`]}</h5>
                              <small className="text-muted">Level {level}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* USER VIEW */}
          {viewMode === "user" && (
            <>
              {/* Filters Row */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row align-items-center">
                    {/* User Filter */}
                    <div className="col-md-4 mb-2">
                      <label className="form-label fw-bold">👤 Filter by User:</label>
                      <select
                        className="form-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      >
                        <option value="all">All Users ({uniquePlayers.length})</option>
                        {uniquePlayers.map((player) => (
                          <option key={player.id} value={player.id}>
                            {player.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Level Filter */}
                    <div className="col-md-8 mb-2">
                      <label className="form-label fw-bold">📊 Filter by Level:</label>
                      <div className="btn-group w-100" role="group">
                        <button
                          className={`btn ${selectedLevel === "all" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setSelectedLevel("all")}
                        >
                          All
                        </button>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            className={`btn ${selectedLevel === String(level) ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSelectedLevel(String(level))}
                          >
                            L{level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Stats (when user is selected) */}
              {userStats && (
                <div className="card mb-4 border-info">
                  <div className="card-header bg-info text-white">
                    <h5 className="mb-0">📈 Stats for: {getUserName(selectedUser)}</h5>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col">
                        <h4>{userStats.totalSubmissions}</h4>
                        <small className="text-muted">Total Submissions</small>
                      </div>
                      <div className="col">
                        <h4 className={userStats.totalProfit >= 0 ? "text-success" : "text-danger"}>
                          {formatCurrency(userStats.totalProfit)}
                        </h4>
                        <small className="text-muted">Total Profit</small>
                      </div>
                      <div className="col">
                        <h4>{formatCurrency(userStats.avgProfit)}</h4>
                        <small className="text-muted">Avg Profit/Round</small>
                      </div>
                      <div className="col">
                        <h4>{userStats.profitableRounds}</h4>
                        <small className="text-muted">Profitable Rounds</small>
                      </div>
                      <div className="col">
                        <h4 className="text-primary">{userStats.successRate}%</h4>
                        <small className="text-muted">Success Rate</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="alert alert-danger">{error}</div>}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading results...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Level</th>
                        <th>User</th>
                        <th>Labor</th>
                        <th>Capital</th>
                        <th>Output</th>
                        <th>Total Cost</th>
                        <th>Revenue</th>
                        <th>Profit</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allResults.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center py-4">
                            No results found
                          </td>
                        </tr>
                      ) : (
                        allResults.map((result, index) => (
                          <tr key={result._id}>
                            <td>{index + 1}</td>
                            <td>
                              <span className={`badge bg-${result.level === 1 ? 'primary' : result.level === 2 ? 'success' : result.level === 3 ? 'info' : result.level === 4 ? 'warning' : 'danger'}`}>
                                Level {result.level}
                              </span>
                            </td>
                            <td>
                              <span 
                                className="text-primary" 
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedUser(result.playerId)}
                              >
                                {getUserName(result.playerId)}
                              </span>
                            </td>
                            <td>{result.labor}</td>
                            <td>{result.capital || result.fixedCapital || "-"}</td>
                            <td>{result.output?.toFixed(2)}</td>
                            <td>{formatCurrency(result.totalCost || result.TC || 0)}</td>
                            <td>{formatCurrency(result.totalRevenue || 0)}</td>
                            <td>
                              <span className={result.profit >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {formatCurrency(result.profit || 0)}
                              </span>
                            </td>
                            <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-3 d-flex justify-content-between">
                <p className="text-muted">
                  Showing {allResults.length} results
                  {selectedUser !== "all" && ` for ${getUserName(selectedUser)}`}
                  {selectedLevel !== "all" && ` (Level ${selectedLevel})`}
                </p>
                {selectedUser !== "all" && (
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setSelectedUser("all")}
                  >
                    Clear User Filter
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
