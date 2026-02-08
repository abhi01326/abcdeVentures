import React, { useState, useCallback } from "react";

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password validation requirements
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Calculate password strength
  const calculateStrength = useCallback(() => {
    let strength = 0;
    if (requirements.minLength) strength += 20;
    if (requirements.hasUppercase) strength += 20;
    if (requirements.hasLowercase) strength += 20;
    if (requirements.hasNumber) strength += 20;
    if (requirements.hasSpecial) strength += 20;
    setPasswordStrength(strength);
  }, [requirements]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    calculateStrength();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate password
    if (!requirements.minLength || !requirements.hasUppercase || 
        !requirements.hasLowercase || !requirements.hasNumber || !requirements.hasSpecial) {
      setError("Password does not meet all requirements");
      setLoading(false);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          onRegister();
        }, 1500);
      } else {
        setError(data?.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return "#ef4444";
    if (passwordStrength <= 40) return "#f59e0b";
    if (passwordStrength <= 60) return "#fbbf24";
    if (passwordStrength <= 80) return "#10b981";
    return "#059669";
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Account</h2>
      <p className="form-subtitle">Join us and start shopping today</p>

      {error && <div className="form-error-banner">{error}</div>}
      {success && <div className="form-success-banner">{success}</div>}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={30}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className={`form-input ${error && !requirements.minLength ? 'is-invalid' : ''}`}
            placeholder="Create a strong password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          
          {password && (
            <div className="password-strength">
              <div className="password-strength-bar">
                <div 
                  className="password-strength-fill"
                  style={{ 
                    width: `${passwordStrength}%`,
                    background: getStrengthColor()
                  }}
                />
              </div>
              
              <div className="password-requirements">
                <div className={`password-requirement ${requirements.minLength ? 'valid' : 'invalid'}`}>
                  <span>{requirements.minLength ? '✓' : '○'}</span>
                  At least 8 characters
                </div>
                <div className={`password-requirement ${requirements.hasUppercase ? 'valid' : 'invalid'}`}>
                  <span>{requirements.hasUppercase ? '✓' : '○'}</span>
                  One uppercase letter
                </div>
                <div className={`password-requirement ${requirements.hasLowercase ? 'valid' : 'invalid'}`}>
                  <span>{requirements.hasLowercase ? '✓' : '○'}</span>
                  One lowercase letter
                </div>
                <div className={`password-requirement ${requirements.hasNumber ? 'valid' : 'invalid'}`}>
                  <span>{requirements.hasNumber ? '✓' : '○'}</span>
                  One number
                </div>
                <div className={`password-requirement ${requirements.hasSpecial ? 'valid' : 'invalid'}`}>
                  <span>{requirements.hasSpecial ? '✓' : '○'}</span>
                  One special character
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button 
          className="btn btn-primary" 
          type="submit" 
          style={{ width: '100%', marginTop: '8px' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <button
          className="btn btn-secondary"
          type="button"
          style={{ width: '100%', marginTop: '12px' }}
          onClick={onRegister}
          disabled={loading}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default Register;
