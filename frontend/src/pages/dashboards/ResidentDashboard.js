// frontend/src/dashboards/ResidentDashboard.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import DashboardHome from './resident/DashboardHome';
import NoticeBoard from './resident/NoticeBoard';
import Payments from './resident/Payments';
import Complaints from './resident/Complaints';
import FacilityBooking from './resident/FacilityBooking';
import VisitorManagement from './resident/VisitorManagement';
import SocietyFinances from './resident/SocietyFinances';
import MaintenanceRequest from './resident/MaintenanceRequest';

const links = [
  { to: '/resident', label: 'Dashboard' },
  { to: '/resident/notices', label: 'Notices' },
  { to: '/resident/payments', label: 'Payments' },
  { to: '/resident/complaints', label: 'Complaints' },
  { to: '/resident/facility-booking', label: 'Facility Booking' },
  { to: '/resident/visitor-management', label: 'Visitor Management' },
  { to: '/resident/society-finances', label: 'Society Finances' },
  { to: '/resident/maintenance-request', label: 'Maintenance Request' },
];

export default function ResidentDashboard() {
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
            <Route path="/" element={<DashboardHome />} />
            <Route path="notices" element={<NoticeBoard />} />
            <Route path="payments" element={<Payments />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="facility-booking" element={<FacilityBooking />} />
            <Route path="visitor-management" element={<VisitorManagement />} />
            <Route path="society-finances" element={<SocietyFinances />} />
            <Route path="maintenance-request" element={<MaintenanceRequest />} />
            <Route path="*" element={<Navigate to="/resident" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}