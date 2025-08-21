import React from 'react';
import './Complaints.css';

const Complaints = () => {
  const complaints = [
    'Noise complaint from Apartment 305',
    'Car parked in no-parking zone',
    'Broken street light near entrance',
  ];

  return (
    <div className="complaints-container">
      <h2>Complaints</h2>
      <ul className="complaints-list">
        {complaints.map((complaint, index) => (
          <li key={index} className="complaint-item">
            {complaint}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Complaints;
