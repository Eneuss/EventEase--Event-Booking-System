import React, { useState } from 'react';

function EventSearch({ onResults }) {
  //store the search input and error message
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);

  //handles the search when the user clicks the button
  const handleSearch = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    try {
      //sends the GET request to the backend
      const res = await fetch(`/event/${encodeURIComponent(location)}`);
      const data = await res.json();

      //Makes sure that the result is an array
      if (Array.isArray(data)) {
        onResults(data);
      } else {
        onResults([data]);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Could not fetch events.');
    }
  };

  return (
    <div className="event-search">
      {/* Input for the location and button to trigger search */}
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {/* Display error if something goes wrong */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default EventSearch;
