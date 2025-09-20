// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css'; // We'll create this CSS file

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'resident',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="/logo.png" alt="LivingLink Logo" className="logo-image" />
              <span className="logo-text">LivingLink</span>
            </div>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/login" className="btn-login">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="auth-container">
        <div className="auth-form-container">
          <h2 className="auth-title">Register at LivingLink</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Name</label>
              <input name="name" type="text" className="form-control" required value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" className="form-control" required value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" className="form-control" required value={form.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="resident">Resident</option>
                <option value="secretary">Secretary</option>
                <option value="treasurer">Treasurer</option>
                <option value="security">Security Guard</option>
                <option value="maintenance">Maintenance Staff</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-info">
                <div className="footer-logo">
                  <span className="logo-text">LivingLink</span>
                </div>
                <p className="footer-description">Simplifying community living through innovative technology solutions.</p>
                <div className="social-links">
                  <a href="https://www.facebook.com/share/1AwowHZh8t/" aria-label="Facebook" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/livinglink.app?igsh=M204YmpsNzNhbWh2" aria-label="Instagram" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C14.6522 2 15.4836 2.01364 16.5127 2.06273C17.5418 2.11182 18.2118 2.29455 18.7882 2.53182C19.4182 2.78909 19.9364 3.12 20.3636 3.54727C20.7909 3.97455 21.1218 4.49273 21.3791 5.12273C21.6164 5.69909 21.7991 6.36909 21.8482 7.39818C21.8973 8.42727 21.9109 9.25864 21.9109 12C21.9109 14.7414 21.8973 15.5727 21.8482 16.6018C21.7991 17.6309 21.6164 18.3009 21.3791 18.8773C21.1218 19.5073 20.7909 20.0255 20.3636 20.4527C19.9364 20.88 19.4182 21.2109 18.7882 21.4682C18.2118 21.7055 17.5418 21.8882 16.5127 21.9373C15.4836 21.9864 14.6522 22 12 22C9.34773 22 8.51636 21.9864 7.48727 21.9373C6.45818 21.8882 5.78818 21.7055 5.21182 21.4682C4.58182 21.2109 4.06364 20.88 3.63636 20.4527C3.20909 20.0255 2.87818 19.5073 2.62091 18.8773C2.38364 18.3009 2.20091 17.6309 2.15182 16.6018C2.10273 15.5727 2.08909 14.7414 2.08909 12C2.08909 9.25864 2.10273 8.42727 2.15182 7.39818C2.20091 6.36909 2.38364 5.69909 2.62091 5.12273C2.87818 4.49273 3.20909 3.97455 3.63636 3.54727C4.06364 3.12 4.58182 2.78909 5.21182 2.53182C5.78818 2.29455 6.45818 2.11182 7.48727 2.06273C8.51636 2.01364 9.34773 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.25 6.75L17.2505 6.75955" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/livinglink/" aria-label="LinkedIn" className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="footer-links">
                <div className="footer-column">
                  <h3>Quick Links</h3>
                  <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </ul>
                </div>
                
                <div className="footer-column">
                  <h3>Contact Info</h3>
                  <ul className="contact-info">
                    <li>📍 Goa - India</li>
                    <li>📞 +91 7411111111</li>
                    <li>✉️ livinglink05@gmail.com</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <p>&copy; 2025 LivingLink. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}