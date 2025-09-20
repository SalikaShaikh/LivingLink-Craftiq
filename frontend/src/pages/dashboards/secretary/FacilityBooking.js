import React, { useEffect, useState } from 'react';
import api from '../../../api/api';

export default function FacilityBooking() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  async function fetchBookings() {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch {
      setBookings([]);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleStatusChange(id, status) {
    setMessage('');
    try {
      await api.put(`/bookings/${id}`, { status });
      setMessage(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update booking.');
    }
  }

  return (
    <div>
      <h3>Booking Requests</h3>
      {message && <div className="alert alert-info">{message}</div>}
      {bookings.length === 0 ? (
        <p>No booking requests.</p>
      ) : (
        <table className="table table-striped" style={{ maxWidth: 900 }}>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.resident.name}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.timeSlot}</td>
                <td>{b.purpose}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === 'pending' && (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => handleStatusChange(b._id, 'approved')}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(b._id, 'rejected')}>Reject</button>
                    </>
                  )}
                  {b.status !== 'pending' && <span>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}