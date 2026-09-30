import { useState, useEffect } from 'react';
import EventSearch from './components/EventSearch.jsx';
import EventList from './components/EventList.jsx';
import MapView from './components/MapView.jsx';
import Login from './components/Login.jsx';
import { getSession, searchEvents } from './api.js';

function App() {
  const [events, setEvents] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);

  // Restore the login state from the server session after a page reload.
  useEffect(() => {
    getSession()
      .then(({ data }) => {
        if (data.loggedIn) setLoggedInUser(data.username);
      })
      .catch((err) => console.error('Could not restore session:', err));
  }, []);

  const handleResults = (results, location) => {
    setEvents(results);
    setLastLocation(location);
  };

  // Reload the current results after a booking so the remaining availability is up to date.
  const refreshResults = async () => {
    try {
      const { ok, data } = await searchEvents(lastLocation);
      if (ok && Array.isArray(data)) setEvents(data);
    } catch (err) {
      console.error('Could not refresh events:', err);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>EventEase Booking System</h1>
        <Login loggedInUser={loggedInUser} onLoginChange={setLoggedInUser} />
      </div>

      <EventSearch onResults={handleResults} />
      <MapView events={events} loggedInUser={loggedInUser} onBooked={refreshResults} />
      <EventList events={events} loggedInUser={loggedInUser} onBooked={refreshResults} />
    </div>
  );
}

export default App;
