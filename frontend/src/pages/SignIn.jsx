// SignIn.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../styles.css"; 
import logo from "./logo.png"; 

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "resident",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      alert("Login successful!");

      // Redirect based on role
      switch (data.role) {
        case "resident":
          navigate("/resident-home");
          break;
        case "secretary":
          navigate("/secretary-home");
          break;
        case "treasurer":
          navigate("/treasurer-home");
          break;
        case "maintenance":
          navigate("/maintenance");
          break;
        case "security":
          navigate("/security");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signin-page">
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="LivingLink Logo" className="logo" />
          <h1>LivingLink</h1>
        </div>
      </header>

      <main className="signin-main">
        <section className="signin-section">
          <h2>Sign In</h2>
          <form className="signin-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label htmlFor="role">Sign in as:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="resident">Resident</option>
              <option value="secretary">Secretary</option>
              <option value="treasurer">Treasurer</option>
              <option value="maintenance">Maintenance Staff</option>
              <option value="security">Security Guard</option>
            </select>

            <button type="submit" className="sign-in-btn">
              Sign In
            </button>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 LivingLink</p>
      </footer>
    </div>
  );
};

export default SignIn;
