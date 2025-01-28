

// components/ClubDetails.jsx
import React from 'react';
import './ClubDetails.css';

const ClubDetails = ({ clubs }) => {
  return (
    <div className="club-details">
      <div className="details-container">
        <h1>{clubs.name}</h1>
        <p className="description">{clubs.description}</p>
        <div className="contact-info">
          <div>
            <i className="fas fa-envelope"></i>
            <span>{clubs.email}</span>
          </div>
          <div>
            <i className="fas fa-phone"></i>
            <span>{clubs.phone}</span>
          </div>
          <div>
            <i className="fas fa-tag"></i>
            <span>{clubs.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;