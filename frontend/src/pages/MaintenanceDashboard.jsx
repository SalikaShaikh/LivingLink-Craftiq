// MaintenanceStaff.jsx
import React, { useState } from "react";
import "../styles.css";
import logo from "./logo.png"; // Update path if needed

const initialRequests = [
  { id: 1, name: "John Doe", issue: "Leaking tap in kitchen", status: "Pending" },
  { id: 2, name: "Jane Smith", issue: "AC not working", status: "Ongoing" },
  // Add more requests here
];

const MaintenanceStaff = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleStatusChange = (id, newStatus) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  return (
    <div className="maintenance-page">
      <header>
        <div className="header-left">
          <img src={logo} alt="LivingLink Logo" className="logo" />
          <h1>LivingLink - Maintenance Staff</h1>
        </div>
      </header>

      <main>
        <section className="maintenance-section">
          <h2>Resident Requests</h2>
          <div className="table-wrapper">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>Resident Name</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.name}</td>
                    <td>{req.issue}</td>
                    <td className={`status-cell ${req.status}`}>{req.status}</td>
                    <td>
                      <select
                        className="status-select"
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-contact">
          <p><strong>Contact Us:</strong></p>
          <p>Phone: <a href="tel:+9199111111">+91 9911111111</a></p>
          <p>Address: Goa, India</p>
          <p>Email: <a href="mailto:info@livinglink.com">info@livinglink05.com</a></p>
          <div className="footer-social">
            <a href="https://instagram.com/livinglink.app" target="_blank" rel="noopener noreferrer" className="social-icon instagram">Instagram</a>
            <a href="hhttps://facebook.com/profile.php?id=61579146957817" target="_blank" rel="noopener noreferrer" className="social-icon facebook">Facebook</a>
          </div>
        </div>
        <p>&copy; 2025 LivingLink</p>
      </footer>
    </div>
  );
};

export default MaintenanceStaff;
