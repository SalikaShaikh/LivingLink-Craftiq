import React from "react";

const Payments = () => {
  const dues = [
    { name: "Rahul Sharma", flat: "A-101", amount: "₹2,000", dueDate: "2025-08-20", status: "Pending" },
    { name: "Neha Patel", flat: "B-203", amount: "₹1,500", dueDate: "2025-08-15", status: "Paid" },
  ];

  return (
    <div>
      <h2>Payments & Dues</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th><th>Flat</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dues.map((d, i) => (
            <tr key={i}>
              <td>{d.name}</td><td>{d.flat}</td><td>{d.amount}</td><td>{d.dueDate}</td>
              <td>{d.status}</td>
              <td>
                {d.status === "Pending" ? <button className="btn">Send Reminder</button> : "✅"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
