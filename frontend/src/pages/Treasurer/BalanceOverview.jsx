import React from "react";

const BalanceOverview = () => {
  return (
    <div>
      <h2>Balance Overview</h2>
      <p>Track total income vs expenses and budget utilization.</p>
      <div className="chart-box">📊 Chart placeholder (use Chart.js/Recharts)</div>
      <button className="btn">Download Balance Sheet (PDF)</button>
    </div>
  );
};

export default BalanceOverview;
