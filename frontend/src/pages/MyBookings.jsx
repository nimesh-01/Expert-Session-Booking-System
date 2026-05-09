import React, { useState } from 'react';
import axios from '../api/axios';

function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const fetchBookings = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setSearched(true);
      const res = await axios.get('/bookings', { params: { email } });
      setBookings(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>My Bookings</h2>
      <form onSubmit={fetchBookings} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="email" 
          placeholder="Enter your email address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          style={{ padding: '8px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Find Bookings</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && searched && !error && bookings.length === 0 && (
        <p>No bookings found for {email}.</p>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {!loading && bookings.map(booking => (
          <div key={booking._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Session with {booking.expertId?.name || 'Unknown Expert'}</h3>
              <p style={{ margin: '5px 0', color: '#555' }}>{booking.expertId?.category}</p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Date: {booking.date} | Time: {booking.timeSlot}</p>
              <p style={{ margin: '5px 0', fontSize: '0.9em' }}>Notes: {booking.notes || 'N/A'}</p>
            </div>
            <div>
              <span style={{ 
                padding: '5px 10px', 
                borderRadius: '15px', 
                fontSize: '0.8em',
                background: booking.status === 'Confirmed' ? '#d4edda' : booking.status === 'Completed' ? '#cce5ff' : '#fff3cd',
                color: booking.status === 'Confirmed' ? '#155724' : booking.status === 'Completed' ? '#004085' : '#856404'
              }}>
                {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
