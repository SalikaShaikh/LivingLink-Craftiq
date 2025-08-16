// SignIn.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // for client-side routing
import "../styles.css"; 
import logo from "./logo.png"; 

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "resident",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // API call can go here
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
