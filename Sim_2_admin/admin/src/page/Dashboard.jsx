import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [groupStats, setGroupStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchGroupStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupStats = async () => {
    try {
      const res = await api.get("/groups/stats/summary");
      setGroupStats(res.data);
    } catch (err) {
      console.error("Failed to fetch group stats:", err);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h1>Welcome to Admin Dashboard!</h1>
          <p className="text-muted">Factory Management Simulation - Admin Panel</p>

          {/* Stats Cards */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : stats ? (
            <div className="row my-4">
              <div className="col-md-3 mb-3">
                <div className="card bg-primary text-white h-100">
                  <div className="card-body">
                    <h5 className="card-title">👤 Total Users</h5>
                    <h2>{stats.users?.total || 0}</h2>
                    <Link to="/admin/users" className="text-white">View All →</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-success text-white h-100">
                  <div className="card-body">
                    <h5 className="card-title">📊 Submissions</h5>
                    <h2>{stats.submissions?.total || 0}</h2>
                    <Link to="/admin/results" className="text-white">View All →</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-info text-white h-100">
                  <div className="card-body">
                    <h5 className="card-title">👥 Groups</h5>
                    <h2>{groupStats?.totalGroups || 0}</h2>
                    <Link to="/admin/groups" className="text-white">Manage →</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-warning text-dark h-100">
                  <div className="card-body">
                    <h5 className="card-title">🔒 Locked Groups</h5>
                    <h2>{groupStats?.lockedGroups || 0}</h2>
                    <small>Ready to play</small>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Group Stats */}
          {groupStats && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">👥 Group Overview</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col">
                    <h3 className="text-primary">{groupStats.totalGroups}</h3>
                    <small>Total Groups</small>
                  </div>
                  <div className="col">
                    <h3 className="text-success">{groupStats.lockedGroups}</h3>
                    <small>Locked</small>
                  </div>
                  <div className="col">
                    <h3 className="text-warning">{groupStats.unlockedGroups}</h3>
                    <small>Unlocked</small>
                  </div>
                  <div className="col">
                    <h3 className="text-info">{groupStats.totalPlayersInGroups}</h3>
                    <small>Players Assigned</small>
                  </div>
                  <div className="col">
                    <h3 className="text-secondary">{groupStats.fullGroups}</h3>
                    <small>Full Groups</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submissions by Level */}
          {stats?.submissions && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">📈 Submissions by Level</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className="col">
                      <div className="text-center p-3 border rounded">
                        <h4>Level {level}</h4>
                        <h2 className="text-primary">{stats.submissions[`level${level}`] || 0}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">🔗 Quick Links</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/admin/users" className="btn btn-outline-primary w-100 py-3">
                    👤 User Management
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/groups" className="btn btn-outline-info w-100 py-3">
                    👥 Group Management
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/results" className="btn btn-outline-success w-100 py-3">
                    📊 View Results
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-secondary w-100 py-3" onClick={() => { fetchStats(); fetchGroupStats(); }}>
                    🔄 Refresh Stats
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
