import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BookingForm from './BookingForm.jsx';

// Fix for missing marker icons in Leaflet when bundled: point to the hosted images.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// MapContainer only uses its center on first render; move the map when the results change.
function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 13);
  }, [map, lat, lon]);
  return null;
}

function MapView({ events, loggedInUser, onBooked }) {
  if (!Array.isArray(events) || events.length === 0) return null;

  // Center the map on the first result.
  const center = [events[0].lat, events[0].lon];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', marginTop: '20px' }}>
      <RecenterMap lat={center[0]} lon={center[1]} />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lon]}>
          <Popup>
            <strong>{event.name}</strong><br />
            {event.description}
            <BookingForm eventId={event.id} tickets={event.tickets} loggedInUser={loggedInUser} onBooked={onBooked} compact />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
