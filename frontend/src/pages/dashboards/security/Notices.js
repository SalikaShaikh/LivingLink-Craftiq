import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const { data } = await api.get('/notices');
        setNotices(data);
      } catch (err) {
        setNotices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  if (loading) return <p>Loading notices...</p>;

  return (
    <div>
      <h3>Notices</h3>
      {notices.length === 0 && <p>No notices available.</p>}
      {notices.map(notice => (
        <div key={notice._id} className="card mb-3">
          <div className="card-header">{new Date(notice.createdAt).toLocaleDateString()}</div>
          <div className="card-body">
            <h5 className="card-title">{notice.title}</h5>
            <p className="card-text">{notice.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}