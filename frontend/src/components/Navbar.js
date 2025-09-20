// frontend/src/components/Navbar.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand navbar-dark" style={{ backgroundColor: 'var(--color-mid-dark-blue)' }}>
      <div className="container-fluid">
        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          className="btn btn-outline-light d-md-none me-3"
          onClick={onMobileMenuToggle}
          style={{ 
            padding: '0.25rem 0.5rem',
            fontSize: '1.25rem'
          }}
        >
          ☰
        </button>
        
        <span className="navbar-brand">Welcome, {user?.name}</span>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}