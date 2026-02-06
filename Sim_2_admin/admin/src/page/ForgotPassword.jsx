import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);

      if (res.data.resetUrl) {
        setMessage(`Reset link: ${res.data.resetUrl}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Forgot Password</h2>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />

        <button disabled={loading} className="btn btn-primary w-100 ">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p style={styles.back}>
          <Link to="/login" style={styles.link}>
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
  },

  error: {
    background: "#ffe5e5",
    color: "#d8000c",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "12px",
    fontSize: "14px",
  },
  success: {
    background: "#e6fffa",
    color: "#065f46",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "12px",
    fontSize: "14px",
    wordBreak: "break-all",
  },
  back: {
    marginTop: "16px",
    textAlign: "center",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default ForgotPassword;
