// frontend/src/components/Sidebar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ links, isMobileOpen, onMobileToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileSidebar = () => {
    if (isMobileOpen) {
      onMobileToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay - Only visible when sidebar is open on mobile */}
      {isMobileOpen && (
        <div 
          className="d-md-none position-fixed w-100 h-100"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            top: 0,
            left: 0
          }}
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`sidebar p-3 d-flex flex-column position-relative ${
          isCollapsed ? 'collapsed' : ''
        } ${isMobileOpen ? 'mobile-open' : 'mobile-closed'}`}
        style={{ 
          width: isCollapsed ? 60 : 250, 
          backgroundColor: 'var(--color-dark-blue)', 
          color: 'var(--color-off-white)',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          minHeight: '100vh',
          zIndex: 1000
        }}
      >
        {/* Menu Toggle Button (Desktop) */}
        <button
          onClick={toggleSidebar}
          className="btn btn-sm btn-outline-light position-absolute d-none d-md-block"
          style={{ top: 15, right: 15, zIndex: 1000 }}
        >
          {isCollapsed ? '→' : '←'}
        </button>

        {/* Close Button for Mobile */}
        <button
          onClick={closeMobileSidebar}
          className="btn btn-sm btn-outline-light position-absolute d-md-none"
          style={{ top: 15, right: 15, zIndex: 1000 }}
        >
          ×
        </button>

        {/* Logo - Only show when expanded */}
        {!isCollapsed && (
          <h3 className="mb-4" style={{ color: 'white'}}>LivingLink</h3>
        )}
        
        {/* Navigation Links - Only show when expanded */}
        {!isCollapsed && (
          <nav className="flex-grow-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `d-block mb-2 p-2 rounded text-decoration-none ${isActive ? 'bg-primary text-white' : 'text-light'}`
                }
                onClick={closeMobileSidebar}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/* Add CSS for mobile responsiveness - NO SLIDE ANIMATION */}
      <style>
        {`
          @media (max-width: 767.98px) {
            .sidebar {
              position: fixed !important;
              left: 0;
              top: 0;
              height: 100vh;
              display: none; /* Hidden by default on mobile */
            }
            
            .sidebar.mobile-open {
              display: flex !important; /* Show when open */
              box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
            }
            
            .sidebar.mobile-closed {
              display: none !important; /* Hide when closed */
            }
            
            .sidebar.collapsed {
              width: 250px !important;
            }
          }
          
          @media (min-width: 768px) {
            .sidebar.mobile-closed {
              display: flex !important;
            }
          }
        `}
      </style>
    </>
  );
}