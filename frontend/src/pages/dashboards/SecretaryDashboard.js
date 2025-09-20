// frontend/src/pages/dashboards/SecretaryDashboard.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Notices from './secretary/Notices';
import Complaints from './secretary/Complaints';
import FacilityBooking from './secretary/FacilityBooking';
import SocietyFinances from './secretary/SocietyFinances';
import VisitorLog from './secretary/VisitorLog'; // Add this import

const links = [
  { to: '/secretary/notices', label: 'Notices' },
  { to: '/secretary/complaints', label: 'Complaints' },
  { to: '/secretary/facility-booking', label: 'Facility Booking' },
  { to: '/secretary/society-finances', label: 'Society Finances' },
  { to: '/secretary/visitor-log', label: 'Visitor Log' }, // Add this link
];

export default function SecretaryDashboard() {
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
            <Route path="/" element={<Navigate to="/secretary/notices" />} />
            <Route path="notices" element={<Notices />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="facility-booking" element={<FacilityBooking />} />
            <Route path="society-finances" element={<SocietyFinances />} />
            <Route path="visitor-log" element={<VisitorLog />} /> {/* Add this route */}
            <Route path="*" element={<Navigate to="/secretary/notices" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}