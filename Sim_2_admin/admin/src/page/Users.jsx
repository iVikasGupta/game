import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // Fetch all users
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/users");

      // 🔍 STEP 1: LOG RESPONSE
      console.log("Users API response 👉", res.data);

      setUsers(res.data?.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Create new user
  // =========================
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await api.post("/admin/users", newUser);

      // Backend expected:
      // { success: true, user: {...} }
      const createdUser = res.data?.user || res.data;

      setUsers((prev) => [createdUser, ...prev]);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "student",
      });

      setShowCreateModal(false);
      alert("User created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // Delete user
  // =========================
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };
  // =========================
  // Change role
  // =========================
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });

      // Backend expected:
      // { success: true, user: {...} }
      const updatedUser = res.data?.user || res.data;

      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  // =========================
  // Change password
  // =========================
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowPasswordModal(true);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;

    try {
      await api.patch(`/admin/users/${selectedUser._id}/password`, { password: newPassword });
      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setSelectedUser(null);
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "20px" }}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>👤 User Management</h2>
            <div>
              <button className="btn btn-success me-2" onClick={() => setShowCreateModal(true)}>
                ➕ Create User
              </button>
              <button className="btn btn-primary" onClick={fetchUsers}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2">Loading users...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            style={{ width: "120px" }}
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                        <td>
                          <button 
                            className="btn btn-warning btn-sm me-2" 
                            onClick={() => openPasswordModal(user)}
                          >
                            🔑 Password
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user._id)}>
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-muted mt-3">Total Users: {users.length}</p>
        </div>
      </div>

      {/* ================= Create User Modal ================= */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">➕ Create New User</h5>
                <button className="btn-close" onClick={() => setShowCreateModal(false)} />
              </div>

              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={creating}>
                    {creating ? "Creating..." : "Create User"}
                  </button>                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= Change Password Modal ================= */}
      {showPasswordModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🔑 Change Password</h5>
                <button className="btn-close" onClick={() => setShowPasswordModal(false)} />
              </div>

              <form onSubmit={handlePasswordChange}>
                <div className="modal-body">
                  <p className="text-muted mb-3">
                    Changing password for: <strong>{selectedUser.name}</strong> ({selectedUser.email})
                  </p>
                  <div className="mb-3">
                    <label className="form-label">New Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
