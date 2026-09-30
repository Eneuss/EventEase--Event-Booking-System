import React, { useState, useEffect } from 'react';
import EventSearch from './components/EventSearch.jsx';
import EventList from './components/EventList.jsx';
import MapView from './components/MapView.jsx';
import Login from './components/Login.jsx';
import './style.css';

function App() {
  const [events, setEvents] = useState([]);

  // Stores the logged-in user
  const [loggedInUser, setLoggedInUser] = useState(null);

  //task 10 addition, check session on page load to restore login
  useEffect(() => {
    fetch('/user/session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setLoggedInUser(data.username);
        }
      });
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>EventEase Booking System</h1>

        <Login onLoginSuccess={setLoggedInUser} />
      </div>

      <EventSearch onResults={setEvents} />
      <MapView events={events} loggedInUser={loggedInUser}/>
      <EventList events={events} loggedInUser={loggedInUser}/>
    </div>
  );
}
export default App;
