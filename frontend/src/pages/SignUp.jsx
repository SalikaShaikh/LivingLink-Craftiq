import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // import useNavigate
import "../styles.css"; 
import logo from "./logo.png"; 

const SignUp = () => {
  const navigate = useNavigate(); // initialize navigate
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "resident",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Form submitted:", formData);
    // Call your signup API here if needed

    // Redirect based on selected role
    switch (formData.role) {
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
        navigate("/"); // fallback
    }
  };

  return (
    <div className="signup-page">
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="LivingLink Logo" className="logo" />
          <h1>LivingLink</h1>
        </div>
      </header>

      <main className="signin-main">
        <section className="signin-section">
          <h2>Sign Up</h2>
          <form className="signin-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

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

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <label htmlFor="role">Sign up as:</label>
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
              Sign Up
            </button>
          </form>

          <p className="signup-link">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 LivingLink</p>
      </footer>
    </div>
  );
};

export default SignUp;
