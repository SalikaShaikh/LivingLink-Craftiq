// frontend/src/pages/dashboards/secretary/VisitorLog.js
import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchVisitors() {
    try {
      const { data } = await api.get('/visitors');
      setVisitors(data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVisitors();
  }, []);

  if (loading) {
    return <div>Loading visitors...</div>;
  }

  return (
    <div>
      <h3>Visitor Log</h3>
      
      {visitors.length === 0 ? (
        <p>No visitors found.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 1000 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Flat Number</th>
              <th>Date of Visit</th>
              <th>Time</th>
              <th>Added By</th>
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(v => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.flatNumber}</td>
                <td>{new Date(v.dateOfVisit).toLocaleDateString()}</td>
                <td>{v.time || '—'}</td>
                <td>{v.addedBy}</td>
                <td>{v.approved ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}