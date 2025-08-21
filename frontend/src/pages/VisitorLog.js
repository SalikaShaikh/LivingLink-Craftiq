import React from 'react';
import './VisitorLog.css';

const VisitorLog = () => {
  const visitorData = [
    { name: 'John Doe', time: '10:00 AM', purpose: 'Visiting Mr. Smith' },
    { name: 'Jane Doe', time: '10:30 AM', purpose: 'Delivering package' },
    { name: 'Tom Lee', time: '11:00 AM', purpose: 'Visiting Mrs. Black' },
  ];

  return (
    <div className="visitor-log-container">
      <h2>Visitor Log</h2>
      <table className="visitor-log-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {visitorData.map((visitor, index) => (
            <tr key={index}>
              <td>{visitor.name}</td>
              <td>{visitor.time}</td>
              <td>{visitor.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorLog;
