import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '15px 20px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>ExpertBooking</Link>
      </h2>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '15px' }}>Experts</Link>
        <Link to="/my-bookings" style={{ color: '#fff', textDecoration: 'none' }}>My Bookings</Link>
      </div>
    </nav>
  );
}

export default Navbar;
