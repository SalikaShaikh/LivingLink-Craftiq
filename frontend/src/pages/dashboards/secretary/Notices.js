import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');

  async function fetchNotices() {
    try {
      const { data } = await api.get('/notices');
      setNotices(data);
    } catch {
      setNotices([]);
    }
  }

  useEffect(() => {
    fetchNotices();
  }, []);

  function handleChange(e) {
    setNewNotice(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      setMessage('Title and content are required.');
      return;
    }
    try {
      await api.post('/notices', newNotice);
      setMessage('Notice posted successfully!');
      setNewNotice({ title: '', content: '' });
      fetchNotices();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to post notice.');
    }
  }

  return (
    <div>
      <h3>Post New Notice</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }} className="mb-4">
        <div className="mb-3">
          <label>Title</label>
          <input name="title" className="form-control" value={newNotice.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Content</label>
          <textarea name="content" className="form-control" rows="4" value={newNotice.content} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Post Notice</button>
      </form>
      {message && <div className="alert alert-info">{message}</div>}

      <h5>All Notices</h5>
      {notices.length === 0 ? (
        <p>No notices posted yet.</p>
      ) : (
        notices.map(notice => (
          <div key={notice._id} className="card mb-3">
            <div className="card-header">{new Date(notice.createdAt).toLocaleDateString()}</div>
            <div className="card-body">
              <h5>{notice.title}</h5>
              <p>{notice.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}