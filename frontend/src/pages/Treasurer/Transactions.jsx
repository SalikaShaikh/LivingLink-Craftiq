import React from "react";

const Transactions = () => {
  const data = [
    { date: "2025-08-01", desc: "Maintenance Collection", type: "Income", amount: "₹10,000", status: "Received" },
    { date: "2025-08-05", desc: "Lift Repair", type: "Expense", amount: "₹4,500", status: "Paid" },
  ];

  return (
    <div>
      <h2>Transactions</h2>
      <button className="btn">+ Add Transaction</button>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t, i) => (
            <tr key={i}>
              <td>{t.date}</td><td>{t.desc}</td><td>{t.type}</td><td>{t.amount}</td><td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
