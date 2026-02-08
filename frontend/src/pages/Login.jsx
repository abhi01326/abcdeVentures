import React, { useState } from "react";

const Login = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("admin", data.admin);
        onLogin(data.token, data);
      } else {
        setError(data?.error || "Invalid username or password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Welcome Back</h2>
      <p className="form-subtitle">Sign in to continue shopping</p>

      {error && <div className="form-error-banner">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ paddingRight: "48px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          style={{ width: "100%", marginTop: "8px" }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button
          className="btn btn-secondary"
          type="button"
          style={{ width: "100%", marginTop: "12px" }}
          onClick={onRegister}
          disabled={loading}
        >
          Create Account
        </button>
      </form>

      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "#f8fafc",
          borderRadius: "8px",
          fontSize: "13px",
          color: "#64748b",
        }}
      >
        <strong>Demo Credentials:</strong>
        <div style={{ marginTop: "8px" }}>Admin: admin / admin123</div>
        <div>User: user / user123</div>
      </div>
    </div>
  );
};

export default Login;
