import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Attempting login with:", { email, password });
      const res = await api.post("/auth/admin-login", {
        email,
        password,
      });
      console.log("Login response:", res.data);

      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Login failed. Make sure admin user exists in database.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <form onSubmit={handleSubmit} className="card p-4  mt-5 shadow mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {/* Button */}
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot password */}
        <p className="text-center mt-3 mb-0">
          <Link to="/forgot-password" className="text-decoration-none">
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
