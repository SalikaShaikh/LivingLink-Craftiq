// /frontend/src/dashboards/resident/Complaints.js
import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchComplaints() {
    try {
      setLoading(true);
      const { data } = await api.get('/complaints');
      setComplaints(data);
      setError('');
    } catch (err) {
      console.error('Error fetching complaints:', err);
      if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view complaints.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch complaints');
      }
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!content.trim()) {
      setMessage('Please enter complaint content.');
      return;
    }
    try {
      await api.post('/complaints', { content });
      setMessage('Complaint submitted anonymously');
      setContent('');
      fetchComplaints(); // Refresh the list after submission
    } catch (err) {
      console.error('Error submitting complaint:', err);
      if (err.response?.status === 403) {
        setMessage('Access denied. Only residents can submit complaints.');
      } else {
        setMessage(err.response?.data?.message || 'Submission failed.');
      }
    }
  }

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  return (
    <div>
      <h3>Anonymous Complaints</h3>
      <form onSubmit={handleSubmit} className="mb-4" style={{ maxWidth: 600 }}>
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="Write your complaint here..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Submit Complaint</button>
      </form>
      
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <h5>Your Complaints Status</h5>
      <table className="table table-striped" style={{ maxWidth: 700 }}>
        <thead>
          <tr>
            <th>Content</th>
            <th>Status</th>
            <th>Submitted On</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 && !loading && !error && (
            <tr><td colSpan="3">No complaints submitted yet.</td></tr>
          )}
          {complaints.map(c => (
            <tr key={c._id}>
              <td>{c.content}</td>
              <td>
                <span className={`badge ${
                  c.status === 'pending' ? 'bg-warning' : 
                  c.status === 'ongoing' ? 'bg-info' : 
                  'bg-success'
                }`}>
                  {c.status}
                </span>
              </td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}