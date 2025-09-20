import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function SocietyFinances() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const { data } = await api.get('/finances/summary');
        setSummary(data);
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) return <p>Loading finances...</p>;
  if (!summary) return <p>Failed to load finances.</p>;

  return (
    <div>
      <h3>Society Finances</h3>
      <p><strong>Total Income: </strong>₹{summary.totalIncome}</p>
      <p><strong>Total Expenses: </strong>₹{summary.totalExpenses}</p>
      <p><strong>Balance: </strong>₹{summary.balance}</p>

      <h5>Expenses</h5>
      {summary.expenses.length === 0 ? (
        <p>No expenses recorded.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 700 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {summary.expenses.map(e => (
              <tr key={e._id}>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.description}</td>
                <td>₹{e.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}