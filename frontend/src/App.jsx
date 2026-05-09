import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ExpertListing from './pages/ExpertListing';
import ExpertDetail from './pages/ExpertDetail';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <div className="App" style={{fontFamily: 'sans-serif'}}>
        <Navbar />
        <main style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
          <Routes>
            <Route path="/" element={<ExpertListing />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
