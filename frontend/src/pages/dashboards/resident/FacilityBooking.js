import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function FacilityBooking() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    date: '',
    timeSlot: '',
    purpose: '',
  });
  const [message, setMessage] = useState('');

  async function fetchBookings() {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data);
    } catch {
      setBookings([]);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!form.date || !form.timeSlot || !form.purpose.trim()) {
      setMessage('All fields are required.');
      return;
    }
    try {
      await api.post('/bookings', form);
      setMessage('Booking request submitted');
      setForm({ date: '', timeSlot: '', purpose: '' });
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed.');
    }
  }

  return (
    <div>
      <h3>Clubhouse Facility Booking</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }} className="mb-4">
        <div className="mb-3">
          <label>Date</label>
          <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Time Slot</label>
          <select name="timeSlot" className="form-select" value={form.timeSlot} onChange={handleChange} required>
            <option value="">Select a slot</option>
            <option value="09:00-13:00">09:00 - 13:00</option>
            <option value="14:00-18:00">14:00 - 18:00</option>
            <option value="19:00-23:00">19:00 - 23:00</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Purpose</label>
          <input type="text" name="purpose" className="form-control" value={form.purpose} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Request Booking</button>
      </form>
      {message && <div className="alert alert-info">{message}</div>}

      <h5>Your Booking Requests</h5>
      {bookings.length === 0 ? (
        <p>No booking requests submitted.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 700 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Purpose</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.timeSlot}</td>
                <td>{b.purpose}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}