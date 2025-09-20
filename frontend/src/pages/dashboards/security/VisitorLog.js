// frontend/src/pages/dashboards/security/VisitorLog.js
import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    flatNumber: '',
    dateOfVisit: '',
    time: ''
  });

  async function fetchVisitors() {
    try {
      const { data } = await api.get('/visitors');
      setVisitors(data);
    } catch {
      setVisitors([]);
    }
  }

  useEffect(() => {
    fetchVisitors();
  }, []);

  async function approveVisitor(id) {
    setMessage('');
    try {
      await api.put(`/visitors/${id}/approve`);
      setMessage('Visitor approved');
      fetchVisitors();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to approve visitor.');
    }
  }

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleAddVisitor(e) {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/visitors/security', form);
      setMessage('Visitor added successfully');
      setForm({ name: '', flatNumber: '', dateOfVisit: '', time: '' });
      setShowAddForm(false);
      fetchVisitors();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add visitor.');
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Visitor Log</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Visitor'}
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Add Visitor (Security)</h5>
            <form onSubmit={handleAddVisitor} style={{ maxWidth: 600 }}>
              <div className="mb-3">
                <label>Visitor Name</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleFormChange} required />
              </div>
              <div className="mb-3">
                <label>Flat Number to Visit</label>
                <input type="text" name="flatNumber" className="form-control" value={form.flatNumber} onChange={handleFormChange} required />
              </div>
              <div className="mb-3">
                <label>Date of Visit</label>
                <input type="date" name="dateOfVisit" className="form-control" value={form.dateOfVisit} onChange={handleFormChange} required />
              </div>
              <div className="mb-3">
                <label>Time</label>
                <input type="time" name="time" className="form-control" value={form.time} onChange={handleFormChange} required />
              </div>
              <button type="submit" className="btn btn-success">Add Visitor</button>
            </form>
          </div>
        </div>
      )}

      {message && <div className="alert alert-info">{message}</div>}
      
      {visitors.length === 0 ? (
        <p>No visitors found.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 1000 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Flat No.</th>
              <th>Date</th>
              <th>Time</th>
              <th>Added By</th>
              <th>Approved</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(v => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.addedBy === 'resident' ? v.flatNumber : v.flatNumber}</td>
                <td>{new Date(v.dateOfVisit).toLocaleDateString()}</td>
                <td>{v.time || '—'}</td>
                <td>{v.addedBy}</td>
                <td>{v.approved ? 'Yes' : 'No'}</td>
                <td>
                  {!v.approved && v.addedBy === 'resident' && (
                    <button className="btn btn-success btn-sm" onClick={() => approveVisitor(v._id)}>Approve</button>
                  )}
                  {v.approved && '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}