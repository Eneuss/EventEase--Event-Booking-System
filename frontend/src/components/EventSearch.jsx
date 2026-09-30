import { useState } from 'react';
import { searchEvents } from '../api.js';

function EventSearch({ onResults }) {
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    try {
      const { ok, data } = await searchEvents(location);
      if (!ok || !Array.isArray(data)) {
        throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
      }
      onResults(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Could not fetch events.');
    }
  };

  return (
    <div className="event-search">
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default EventSearch;
