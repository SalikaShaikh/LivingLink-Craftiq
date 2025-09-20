import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  async function fetchRequests() {
    try {
      const { data } = await api.get('/maintenance');
      setRequests(data);
    } catch {
      setRequests([]);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function updateStatus(id, status) {
    setMessage('');
    try {
      await api.put(`/maintenance/${id}/status`, { status });
      setMessage('Status updated');
      fetchRequests();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status.');
    }
  }

  return (
    <div>
      <h3>Maintenance Requests</h3>
      {message && <div className="alert alert-info">{message}</div>}
      {requests.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 900 }}>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r._id}>
                <td>{r.resident.name}</td>
                <td>{r.category}</td>
                <td>{r.description}</td>
                <td>{r.status}</td>
                <td>
                  <select className="form-select" value={r.status} onChange={e => updateStatus(r._id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="done">Done</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}