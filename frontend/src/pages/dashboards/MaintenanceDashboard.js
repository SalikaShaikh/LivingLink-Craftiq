import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import MaintenanceRequests from './maintenance/MaintenanceRequests';

const links = [{ to: '/maintenance/maintenance-requests', label: 'Maintenance Requests' }];

export default function MaintenanceDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="d-flex">
      <Sidebar 
        links={links} 
        isMobileOpen={mobileSidebarOpen} 
        onMobileToggle={toggleMobileSidebar} 
      />
      <div className="flex-grow-1">
        <Navbar onMobileMenuToggle={toggleMobileSidebar} />
        <main className="p-4" style={{ minHeight: 'calc(100vh - 56px)', backgroundColor: 'var(--color-off-white)' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/maintenance/maintenance-requests" />} />
            <Route path="maintenance-requests" element={<MaintenanceRequests />} />
            <Route path="*" element={<Navigate to="/maintenance/maintenance-requests" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}