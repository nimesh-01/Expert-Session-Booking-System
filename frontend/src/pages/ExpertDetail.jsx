import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', notes: '', date: '', timeSlot: ''
  });
  const [bookingMsg, setBookingMsg] = useState({ type: '', text: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const res = await axios.get(`/experts/${id}`);
        setExpert(res.data.expert);
        setBookedSlots(res.data.bookedSlots);
        setError(null);
      } catch (err) {
        setError('Failed to fetch expert details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();

    socket.on('slot_booked', (data) => {
      if (data.expertId === id) {
        setBookedSlots(prev => [...prev, { date: data.date, timeSlot: data.timeSlot }]);
      }
    });

    return () => {
      socket.off('slot_booked');
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSlotSelect = (date, timeSlot) => {
    setFormData({ ...formData, date, timeSlot });
    setBookingMsg({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.timeSlot) {
       setBookingMsg({ type: 'error', text: 'Please select a date and time slot.' });
       return;
    }
    
    setBookingLoading(true);
    setBookingMsg({ type: '', text: '' });
    
    try {
      await axios.post('/bookings', { ...formData, expertId: id });
      setBookingMsg({ type: 'success', text: 'Booking successful!' });
      // Reset form (keep email/phone if desired, but let's reset)
      setFormData({ name: '', email: '', phone: '', notes: '', date: '', timeSlot: '' });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setBookingMsg({ type: 'error', text: 'This slot was just booked by someone else.' });
      } else {
        setBookingMsg({ type: 'error', text: err.response?.data?.message || 'An error occurred during booking.' });
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p>Loading expert...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!expert) return <p>Expert not found.</p>;

  return (
    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h2>{expert.name}</h2>
        <p><strong>Category:</strong> {expert.category}</p>
        <p><strong>Experience:</strong> {expert.experience} years</p>
        <p><strong>Rating:</strong> {expert.rating} / 5</p>

        <h3 style={{ marginTop: '30px' }}>Available Time Slots</h3>
        {expert.availableSlots.map(day => (
          <div key={day.date} style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '10px 0' }}>{new Date(day.date).toDateString()}</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {day.slots.map(slot => {
                const isBooked = bookedSlots.some(b => b.date === day.date && b.timeSlot === slot);
                const isSelected = formData.date === day.date && formData.timeSlot === slot;
                
                return (
                  <button 
                    key={slot}
                    disabled={isBooked}
                    onClick={() => handleSlotSelect(day.date, slot)}
                    style={{
                      padding: '8px 12px',
                      background: isBooked ? '#ccc' : isSelected ? '#007bff' : '#f8f9fa',
                      color: isBooked ? '#888' : isSelected ? 'white' : '#333',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      cursor: isBooked ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {slot} {isBooked && '(Booked)'}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minWidth: '300px', background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h3>Book Session</h3>
        {bookingMsg.text && (
           <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', background: bookingMsg.type === 'success' ? '#d4edda' : '#f8d7da', color: bookingMsg.type === 'success' ? '#155724' : '#721c24' }}>
             {bookingMsg.text}
           </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {formData.date ? (
            <p><strong>Selected Slot:</strong> {formData.date} at {formData.timeSlot}</p>
          ) : (
            <p style={{ color: '#888' }}>Please select a slot from the left to continue.</p>
          )}

          <div>
            <label>Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
          </div>
          <div>
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
          </div>
          <div>
            <label>Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
          </div>
          <div>
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', height: '80px' }}></textarea>
          </div>
          <button type="submit" disabled={bookingLoading} style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: bookingLoading ? 'not-allowed' : 'pointer' }}>
            {bookingLoading ? 'Booking...' : 'Confirm Book'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExpertDetail;
