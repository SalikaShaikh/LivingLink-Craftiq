// frontend/src/pages/dashboards/resident/VisitorManagement.js
import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function VisitorManagement() {
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    flatNumber: '', // Changed from contactNumber to flatNumber
    dateOfVisit: '',
  });
  const [message, setMessage] = useState('');

  async function fetchVisitors() {
    try {
      const { data } = await api.get('/visitors/my-visitors');
      setVisitors(data);
    } catch {
      setVisitors([]);
    }
  }

  useEffect(() => {
    fetchVisitors();
  }, []);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!form.name || !form.flatNumber || !form.dateOfVisit) {
      setMessage('All fields are required.');
      return;
    }
    try {
      await api.post('/visitors', form);
      setMessage('Visitor added for approval');
      setForm({ name: '', flatNumber: '', dateOfVisit: '' });
      fetchVisitors();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Adding visitor failed.');
    }
  }

  return (
    <div>
      <h3>Visitor Management</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }} className="mb-4">
        <div className="mb-3">
          <label>Visitor Name</label>
          <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Flat Number to Visit</label> {/* Changed label */}
          <input type="text" name="flatNumber" className="form-control" value={form.flatNumber} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Date of Visit</label>
          <input type="date" name="dateOfVisit" className="form-control" value={form.dateOfVisit} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Add Visitor</button>
      </form>
      {message && <div className="alert alert-info">{message}</div>}

      <h5>Your Visitors</h5>
      {visitors.length === 0 ? (
        <p>No visitors added yet.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 700 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Flat Number</th> {/* Changed header */}
              <th>Date</th>
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(v => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.flatNumber}</td> {/* Changed from contactNumber to flatNumber */}
                <td>{new Date(v.dateOfVisit).toLocaleDateString()}</td>
                <td>{v.approved ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}