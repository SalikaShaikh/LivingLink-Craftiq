import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import SocietyFinances from './treasurer/SocietyFinances';
import MaintenanceFees from './treasurer/MaintenanceFees';

const links = [
  { to: '/treasurer/society-finances', label: 'Society Finances' },
  { to: '/treasurer/maintenance-fees', label: 'Maintenance Fees' },
];

export default function TreasurerDashboard() {
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
            <Route path="/" element={<Navigate to="/treasurer/society-finances" />} />
            <Route path="society-finances" element={<SocietyFinances />} />
            <Route path="maintenance-fees" element={<MaintenanceFees />} />
            <Route path="*" element={<Navigate to="/treasurer/society-finances" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}