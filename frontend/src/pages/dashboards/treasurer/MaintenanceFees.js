// frontend/src/pages/dashboards/treasurer/MaintenanceFees.js
import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function MaintenanceFees() {
  const [payments, setPayments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPayments();
    fetchResidents();
    fetchAvailableMonths();
  }, [selectedMonth, selectedYear]);

  async function fetchPayments() {
    try {
      const { data } = await api.get(`/payments/all?month=${selectedMonth}&year=${selectedYear}`);
      setPayments(data);
    } catch {
      setPayments([]);
    }
  }

  async function fetchResidents() {
    try {
      const { data } = await api.get('/users/residents');
      setResidents(data);
    } catch {
      setResidents([]);
    }
  }

  async function fetchAvailableMonths() {
    try {
      const { data } = await api.get('/payments/months');
      setAvailableMonths(data);
    } catch {
      setAvailableMonths([]);
    }
  }

  // Calculate total amount paid for the selected month
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

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

  // Generate year options (last 5 years and next 1 year)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    yearOptions.push(i);
  }

  return (
    <div>
      <h3>Maintenance Fee Payment Status</h3>
      
      {/* Month/Year Filter */}
      <div className="row mb-4" style={{ maxWidth: 600 }}>
        <div className="col-md-6">
          <label>Month</label>
          <select 
            className="form-select" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthOptions.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Year</label>
          <select 
            className="form-select" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="alert alert-info mb-4">
        <strong>
          {payments.length} out of {residents.length} residents have paid for {
            monthOptions.find(m => m.value === selectedMonth)?.label
          } {selectedYear}
        </strong>
        <br />
        <strong>Total Amount Collected: ₹{totalAmount}</strong>
      </div>

      {residents.length === 0 ? (
        <p>No residents found.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 1000 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Payment Status</th>
              <th>Amount Paid</th>
              <th>Paid Date</th>
            </tr>
          </thead>
          <tbody>
            {residents.map(r => {
              const payment = payments.find(p => p.resident && p.resident._id === r._id);
              return (
                <tr key={r._id}>
                  <td>{r.name || 'Unknown'}</td>
                  <td>{r.email || 'N/A'}</td>
                  <td>
                    <span className={`badge ${payment ? 'bg-success' : 'bg-danger'}`}>
                      {payment ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {payment ? `₹${payment.amount}` : '—'}
                  </td>
                  <td>
                    {payment ? new Date(payment.paidAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}