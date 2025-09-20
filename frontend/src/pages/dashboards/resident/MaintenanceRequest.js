import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function MaintenanceRequest() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    category: 'electrician',
    description: '',
  });
  const [message, setMessage] = useState('');

  async function fetchRequests() {
    try {
      const { data } = await api.get('/maintenance/my-requests');
      setRequests(data);
    } catch {
      setRequests([]);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!form.description.trim()) {
      setMessage('Description is required.');
      return;
    }
    try {
      await api.post('/maintenance', form);
      setMessage('Maintenance request submitted');
      setForm({ category: 'electrician', description: '' });
      fetchRequests();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed.');
    }
  }

  return (
    <div>
      <h3>Maintenance Requests</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }} className="mb-4">
        <div className="mb-3">
          <label>Category</label>
          <select name="category" className="form-select" value={form.category} onChange={handleChange}>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="carpenter">Carpenter</option>
            <option value="cleaner">Cleaner</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Request</button>
      </form>
      {message && <div className="alert alert-info">{message}</div>}

      <h5>Your Requests</h5>
      {requests.length === 0 ? (
        <p>No maintenance requests submitted yet.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 700 }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r._id}>
                <td>{r.category}</td>
                <td>{r.description}</td>
                <td>{r.status}</td>
                <td>{new Date(r.updatedAt || r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}