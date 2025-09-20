import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Notices from './security/Notices';
import VisitorLog from './security/VisitorLog';
import Complaints from './security/Complaints';

const links = [
  { to: '/security/notices', label: 'Notices' },
  { to: '/security/visitor-log', label: 'Visitor Log' },
  { to: '/security/complaints', label: 'Complaints' },
];

export default function SecurityDashboard() {
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
            <Route path="/" element={<Navigate to="/security/notices" />} />
            <Route path="notices" element={<Notices />} />
            <Route path="visitor-log" element={<VisitorLog />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="*" element={<Navigate to="/security/notices" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}