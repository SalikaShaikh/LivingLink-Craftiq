// frontend/src/pages/dashboards/resident/Payments.js
import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [year, setYear] = useState(new Date().getFullYear()); // Current year
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchPayments() {
    try {
      const { data } = await api.get('/payments/my-payments');
      setPayments(data);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  async function handlePay(e) {
    e.preventDefault();
    setMessage('');
    
    if (!amount || amount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
    
    if (!month || month < 1 || month > 12) {
      setMessage('Please select a valid month.');
      return;
    }
    
    if (!year || year < 2000 || year > 2100) {
      setMessage('Please select a valid year.');
      return;
    }

    try {
      const { data } = await api.post('/payments', { 
        amount: Number(amount),
        month: Number(month),
        year: Number(year)
      });
      setMessage('Payment successful! Receipt: ' + data.payment.receiptNumber);
      setAmount('');
      fetchPayments();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Payment failed.');
    }
  }

  // Generate month options
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Generate year options (current year and next year)
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear + 1];

  return (
    <div>
      <h3>Maintenance Fee Payments</h3>
      
      <form onSubmit={handlePay} className="mb-4" style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label>Amount (₹)</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="1"
            required
          />
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Month</label>
            <select
              className="form-select"
              value={month}
              onChange={e => setMonth(parseInt(e.target.value))}
              required
            >
              <option value="">Select Month</option>
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6">
            <label>Year</label>
            <select
              className="form-select"
              value={year}
              onChange={e => setYear(parseInt(e.target.value))}
              required
            >
              <option value="">Select Year</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">Pay Now</button>
      </form>
      
      {message && (
        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
      
      <h5>Payment History</h5>
      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments made yet.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 800 }}>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Month/Year</th>
              <th>Receipt Number</th>
              <th>Paid On</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td>₹{p.amount}</td>
                <td>
                  {monthOptions.find(m => m.value === p.month)?.label} {p.year}
                </td>
                <td>{p.receiptNumber}</td>
                <td>{new Date(p.paidAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}