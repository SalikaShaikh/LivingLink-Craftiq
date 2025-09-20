import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState('');

  async function fetchComplaints() {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch {
      setComplaints([]);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function updateStatus(id, status) {
    setMessage('');
    try {
      await api.put(`/complaints/${id}`, { status });
      setMessage('Complaint status updated.');
      fetchComplaints();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status.');
    }
  }

  return (
    <div>
      <h3>Anonymous Complaints</h3>
      {message && <div className="alert alert-info">{message}</div>}
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 900 }}>
          <thead>
            <tr>
              <th>Content</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c._id}>
                <td>{c.content}</td>
                <td>{c.status}</td>
                <td>
                  <select className="form-select" value={c.status} onChange={e => updateStatus(c._id, e.target.value)}>
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