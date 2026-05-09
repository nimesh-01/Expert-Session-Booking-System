import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

function ExpertListing() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/experts', {
        params: { search, category, page }
      });
      setExperts(res.data.experts);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [page]); // Removed search and category to avoid auto-fetch on typing, rely on submit

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExperts();
  };

  return (
    <div>
      <h2>Find an Expert</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by name" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ padding: '8px', flex: 1 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px' }}>
          <option value="">All Categories</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Product Management">Product Management</option>
          <option value="UX Design">UX Design</option>
        </select>
        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Search</button>
      </form>

      {loading && <p>Loading experts...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && experts.length === 0 && <p>No experts found.</p>}

      <div style={{ display: 'grid', gap: '15px' }}>
        {!loading && experts.map(expert => (
          <div key={expert._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{expert.name}</h3>
              <p style={{ margin: '5px 0', color: '#555' }}>{expert.category}</p>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.9em' }}>
                <span>★ {expert.rating} / 5</span>
                <span>⏱ {expert.experience} yrs exp</span>
              </div>
            </div>
            <Link to={`/experts/${expert._id}`} style={{ padding: '8px 15px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
              View Details
            </Link>
          </div>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: '8px' }}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{ padding: '8px' }}>Next</button>
        </div>
      )}
    </div>
  );
}

export default ExpertListing;
