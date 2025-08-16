import React, { useState } from "react";
import BalanceOverview from "./BalanceOverview";
import Transactions from "./Transactions";
import Payments from "./Payments";
import Reports from "./Reports";
import Settings from "./Settings";
import "./treasurer.css";

const TreasurerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <BalanceOverview />;
      case "transactions":
        return <Transactions />;
      case "payments":
        return <Payments />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <BalanceOverview />;
    }
  };

  return (
    <div className="treasurer-container">
      <h1 className="title">Treasurer Dashboard</h1>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">💰 Balance <br/> ₹2,45,000</div>
        <div className="card">📈 Income (This Month)<br/> ₹75,000</div>
        <div className="card">📉 Expenses (This Month)<br/> ₹52,000</div>
        <div className="card">🧾 Pending Dues<br/> ₹23,000</div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab("overview")}>Balance Overview</button>
        <button onClick={() => setActiveTab("transactions")}>Transactions</button>
        <button onClick={() => setActiveTab("payments")}>Payments & Dues</button>
        <button onClick={() => setActiveTab("reports")}>Reports</button>
        <button onClick={() => setActiveTab("settings")}>Settings</button>
      </div>

      {/* Subpage Rendering */}
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default TreasurerDashboard;
