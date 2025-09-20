// frontend/src/dashboards/resident/DashboardHome.js
import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch only 5 recent notices
        const noticesResponse = await api.get('/notices?limit=3');
        setRecentNotices(noticesResponse.data);
        
        // Fetch only 5 recent payments
        const paymentsResponse = await api.get('/payments/my-payments?limit=3');
        setRecentPayments(paymentsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h3>Resident Dashboard</h3>
      
      <div className="row">
        {/* Recent Notices Section - Only 5 items */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0" style={{ color: 'var(--color-off-white)' }}>Recent Notices</h5>
              <Link to="/resident/notices" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentNotices.length === 0 ? (
                <p className="text-muted">No recent notices</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentNotices.map(notice => (
                    <div key={notice._id} className="list-group-item border-0 px-0 py-2">
                      <h6 className="mb-1">{notice.title}</h6>
                      <p className="mb-1 text-muted small">
                        {notice.content.length > 100 
                          ? `${notice.content.substring(0, 100)}...` 
                          : notice.content
                        }
                      </p>
                      <small className="text-muted">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Payments Section - Only 5 items */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0" style={{ color: 'var(--color-off-white)' }}>Recent Payments</h5>
              <Link to="/resident/payments" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentPayments.length === 0 ? (
                <p className="text-muted">No payment history</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentPayments.map(payment => (
                    <div key={payment._id} className="list-group-item border-0 px-0 py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">₹{payment.amount}</h6>
                          <small className="text-muted">
                            {payment.month && payment.year ? 
                              `For ${getMonthName(payment.month)} ${payment.year}` : 
                              `Receipt: ${payment.receiptNumber}`
                            }
                          </small>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-success">Paid</span>
                          <br />
                          <small className="text-muted">
                            {new Date(payment.paidAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{recentNotices.length}</h5>
              <p className="card-text">Recent Notices</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{recentPayments.length}</h5>
              <p className="card-text">Recent Payments</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">
                ₹{recentPayments.reduce((total, payment) => total + payment.amount, 0)}
              </h5>
              <p className="card-text">Recent Paid Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get month name
function getMonthName(monthNumber) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || '';
}