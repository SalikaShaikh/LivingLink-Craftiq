// frontend/src/pages/dashboards/treasurer/SocietyFinances.js
import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function SocietyFinances() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

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

  function handleExpenseChange(e) {
    setExpenseForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    setMessage('');
    
    if (!expenseForm.description.trim() || !expenseForm.amount || expenseForm.amount <= 0) {
      setMessage('Please enter valid description and amount.');
      return;
    }

    try {
      await api.post('/finances', {
        description: expenseForm.description,
        amount: Number(expenseForm.amount)
      });
      setMessage('Expense added successfully!');
      setExpenseForm({ description: '', amount: '' });
      fetchSummary(); // Refresh the summary
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add expense.');
    }
  }

  if (loading) return <p>Loading finances...</p>;
  if (!summary) return <p>Failed to load finances.</p>;

  return (
    <div>
      <h3>Society Finances</h3>
      
      {/* Financial Summary */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Financial Summary</h5>
          <div className="row">
            <div className="col-md-4">
              <p><strong>Total Income: </strong>₹{summary.totalIncome}</p>
            </div>
            <div className="col-md-4">
              <p><strong>Total Expenses: </strong>₹{summary.totalExpenses}</p>
            </div>
            <div className="col-md-4">
              <p><strong>Balance: </strong>₹{summary.balance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add Expense</h5>
          <form onSubmit={handleAddExpense} style={{ maxWidth: 500 }}>
            <div className="mb-3">
              <label>Description</label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={expenseForm.description}
                onChange={handleExpenseChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                className="form-control"
                value={expenseForm.amount}
                onChange={handleExpenseChange}
                min="1"
                step="0.01"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </form>
          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} mt-3`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Expenses List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Expense Records</h5>
          {summary.expenses.length === 0 ? (
            <p>No expenses recorded.</p>
          ) : (
            <table className="table table-striped">
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
      </div>
    </div>
  );
}