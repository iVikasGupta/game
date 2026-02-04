import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMaxPlayers, setNewGroupMaxPlayers] = useState(5);

  useEffect(() => {
    fetchGroups();
    fetchAvailableUsers();
    fetchStats();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/groups");
      setGroups(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const res = await api.get("/groups/available/users");
      setAvailableUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch available users:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/groups/stats/summary");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/groups", {
        name: newGroupName,
        maxPlayers: newGroupMaxPlayers,
      });
      setNewGroupName("");
      setNewGroupMaxPlayers(5);
      setShowCreateModal(false);
      fetchGroups();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create group");
    }
  };

  const handleAddUser = async (userId) => {
    if (!selectedGroup) return;
    try {
      await api.post(`/groups/${selectedGroup._id}/add-user`, { userId });
      fetchGroups();
      fetchAvailableUsers();
      fetchStats();
      // Refresh selected group
      const res = await api.get(`/groups/${selectedGroup._id}`);
      setSelectedGroup(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleRemoveUser = async (groupId, userId) => {
    if (!window.confirm("Remove this user from the group?")) return;
    try {
      await api.post(`/groups/${groupId}/remove-user`, { userId });
      fetchGroups();
      fetchAvailableUsers();
      fetchStats();
      if (selectedGroup && selectedGroup._id === groupId) {
        const res = await api.get(`/groups/${groupId}`);
        setSelectedGroup(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove user");
    }
  };

  const handleLockGroup = async (groupId) => {
    if (!window.confirm("Lock this group? Users won't be able to join or leave.")) return;
    try {
      await api.patch(`/groups/${groupId}/lock`);
      fetchGroups();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to lock group");
    }
  };

  const handleUnlockGroup = async (groupId) => {
    try {
      await api.patch(`/groups/${groupId}/unlock`);
      fetchGroups();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unlock group");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await api.delete(`/groups/${groupId}`);
      fetchGroups();
      fetchAvailableUsers();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete group");
    }
  };

  const openAddUserModal = (group) => {
    setSelectedGroup(group);
    setShowAddUserModal(true);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>👥 Group Management</h2>
            <div>
              <button className="btn btn-success me-2" onClick={() => setShowCreateModal(true)}>
                ➕ Create Group
              </button>
              <button className="btn btn-primary" onClick={fetchGroups}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="row mb-4">
              <div className="col-md-2">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h5>Total Groups</h5>
                    <h2>{stats.totalGroups}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h5>Locked</h5>
                    <h2>{stats.lockedGroups}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h5>Unlocked</h5>
                    <h2>{stats.unlockedGroups}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="card bg-info text-white">
                  <div className="card-body text-center">
                    <h5>Full Groups</h5>
                    <h2>{stats.fullGroups}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="card bg-secondary text-white">
                  <div className="card-body text-center">
                    <h5>Players</h5>
                    <h2>{stats.totalPlayersInGroups}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="card bg-dark text-white">
                  <div className="card-body text-center">
                    <h5>Available</h5>
                    <h2>{availableUsers.length}</h2>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">Loading groups...</p>
            </div>
          ) : (
            <div className="row">
              {groups.length === 0 ? (
                <div className="col-12">
                  <div className="alert alert-info">
                    No groups created yet. Click "Create Group" to get started.
                  </div>
                </div>
              ) : (
                groups.map((group) => (
                  <div key={group._id} className="col-md-4 mb-4">
                    <div className={`card ${group.locked ? "border-success" : "border-warning"}`}>
                      <div className={`card-header d-flex justify-content-between align-items-center ${group.locked ? "bg-success text-white" : "bg-warning text-dark"}`}>
                        <h5 className="mb-0">
                          {group.locked ? "🔒" : "🔓"} {group.name}
                        </h5>
                        <span className="badge bg-light text-dark">
                          {group.players.length}/{group.maxPlayers}
                        </span>
                      </div>
                      <div className="card-body">
                        <p className="text-muted small mb-2">
                          Session: {group.sessionId?.substring(0, 8)}...
                        </p>

                        {/* Players List */}
                        <h6>Players:</h6>
                        {group.players.length === 0 ? (
                          <p className="text-muted">No players assigned</p>
                        ) : (
                          <ul className="list-group list-group-flush mb-3">
                            {group.players.map((player) => (
                              <li key={player._id} className="list-group-item d-flex justify-content-between align-items-center py-2">
                                <div>
                                  <strong>{player.name}</strong>
                                  <br />
                                  <small className="text-muted">{player.email}</small>
                                </div>
                                {!group.locked && (
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleRemoveUser(group._id, player._id)}
                                  >
                                    ✕
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Progress Bar */}
                        <div className="progress mb-3" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar ${group.players.length >= group.maxPlayers ? "bg-success" : "bg-primary"}`}
                            style={{ width: `${(group.players.length / group.maxPlayers) * 100}%` }}
                          ></div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-2">
                          {!group.locked && group.players.length < group.maxPlayers && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openAddUserModal(group)}
                            >
                              ➕ Add User
                            </button>
                          )}
                          {!group.locked && group.players.length > 0 && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleLockGroup(group._id)}
                            >
                              🔒 Lock
                            </button>
                          )}
                          {group.locked && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleUnlockGroup(group._id)}
                            >
                              🔓 Unlock
                            </button>
                          )}
                          {!group.locked && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteGroup(group._id)}
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="card-footer text-muted small">
                        Created: {new Date(group.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">➕ Create New Group</h5>
                <button className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateGroup}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Group Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Group A, Team 1"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Max Players</label>
                    <input
                      type="number"
                      className="form-control"
                      min="2"
                      max="10"
                      value={newGroupMaxPlayers}
                      onChange={(e) => setNewGroupMaxPlayers(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && selectedGroup && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  ➕ Add User to {selectedGroup.name}
                </h5>
                <button className="btn-close" onClick={() => setShowAddUserModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">
                  Available slots: {selectedGroup.maxPlayers - selectedGroup.players.length}
                </p>
                
                {availableUsers.length === 0 ? (
                  <div className="alert alert-info">
                    No available users. All students are already assigned to groups.
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table table-hover">
                      <thead className="table-dark sticky-top">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableUsers.map((user) => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleAddUser(user._id)}
                                disabled={selectedGroup.players.length >= selectedGroup.maxPlayers}
                              >
                                ➕ Add
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
