// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResidentDashboard from './pages/dashboards/ResidentDashboard';
import SecretaryDashboard from './pages/dashboards/SecretaryDashboard';
import TreasurerDashboard from './pages/dashboards/TreasurerDashboard';
import SecurityDashboard from './pages/dashboards/SecurityDashboard';
import MaintenanceDashboard from './pages/dashboards/MaintenanceDashboard';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/resident/*"
            element={
              <PrivateRoute roles={['resident']}>
                <ResidentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/secretary/*"
            element={
              <PrivateRoute roles={['secretary']}>
                <SecretaryDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/treasurer/*"
            element={
              <PrivateRoute roles={['treasurer']}>
                <TreasurerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/security/*"
            element={
              <PrivateRoute roles={['security']}>
                <SecurityDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/maintenance/*"
            element={
              <PrivateRoute roles={['maintenance']}>
                <MaintenanceDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}