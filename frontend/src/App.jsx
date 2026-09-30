import { useState, useEffect } from 'react';
import EventSearch from './components/EventSearch.jsx';
import EventList from './components/EventList.jsx';
import MapView from './components/MapView.jsx';
import Login from './components/Login.jsx';
import { getSession } from './api.js';

function App() {
  const [events, setEvents] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Restore the login state from the server session after a page reload.
  useEffect(() => {
    getSession()
      .then(({ data }) => {
        if (data.loggedIn) setLoggedInUser(data.username);
      })
      .catch((err) => console.error('Could not restore session:', err));
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>EventEase Booking System</h1>
        <Login loggedInUser={loggedInUser} onLoginChange={setLoggedInUser} />
      </div>

      <EventSearch onResults={setEvents} />
      <MapView events={events} loggedInUser={loggedInUser} />
      <EventList events={events} loggedInUser={loggedInUser} />
    </div>
  );
}

export default App;
