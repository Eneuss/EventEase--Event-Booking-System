import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

//fixes for missing marker icons in Leaflet by providing the correct image URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

//this component updates the map view when the location changes
function RecenterMap({ lat, lon }) {
  const map = useMap();
  map.setView([lat, lon], 13);
  return null;
}

function MapView({ events, loggedInUser }) {

    //Task 12
    const [formState, setFormState] = useState({});

    //to not render the map if there are no events
    if (!Array.isArray(events) || events.length === 0) return null;

    //to use the first event's coordinates to center the map
    const center = [events[0].lat, events[0].lon];

    const handleBooking = async (eventId) => {
        const current = formState[eventId];
        if (!loggedInUser) {
          alert('You must be logged in to book tickets.');
          return;
        }
        if (!current || !current.ticketType || !current.quantity) {
          alert('Please select ticket type and quantity.');
          return;
        }

        try {
          const res = await fetch('/booking/ticketing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              eventID: eventId,
              ticketType: current.ticketType,
              quantity: parseInt(current.quantity),
              username: loggedInUser
            })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            alert('Booking successful!');
          } else {
            alert(data.message || 'Booking failed.');

          }
          
        } catch (err) {
          console.error('Booking error:', err);
          alert('Booking request failed');
        }
    };

    return (
        <MapContainer center={center} zoom={13} style={{ height: '400px', marginTop: '20px' }}>
        <RecenterMap lat={center[0]} lon={center[1]} />

        {/*OpenStreetMap tiles */}
        <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      {/*needed to create a marker for each event and show details in a popup */}
      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lon]}>
            <Popup>
                <strong>{event.name}</strong><br />
                {event.description}

                <div style={{ marginTop: '10px' }}>
                    <label>
                    Type:
                    <select
                        value={formState[event.id]?.ticketType || ''}
                        onChange={(e) =>
                        setFormState(prev => ({
                            ...prev,
                            [event.id]: {
                            ...prev[event.id],
                            ticketType: e.target.value
                            }
                        }))
                        }
                    >
                        <option value="">Select</option>
                        <option value="General">General</option>
                        <option value="VIP">VIP</option>
                        <option value="Student">Student</option>
                    </select>
                    </label>
                    <br />
                    <label>
                    Qty:
                    <input
                        type="number"
                        min="1"
                        value={formState[event.id]?.quantity || ''}
                        onChange={(e) =>
                        setFormState(prev => ({
                            ...prev,
                            [event.id]: {
                            ...prev[event.id],
                            quantity: e.target.value
                            }
                        }))
                        }
                    />
                    </label>
                    <br />
                    <button onClick={() => handleBooking(event.id)}>Book</button>
                </div>
            </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
