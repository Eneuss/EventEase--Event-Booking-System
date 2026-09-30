import BookingForm from './BookingForm.jsx';
import { formatEventDate } from '../utils/formatDate.js';

function EventList({ events, loggedInUser, onBooked }) {
  if (!Array.isArray(events) || events.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div className="event-results">
      {events.map((event) => (
        <div key={event.id} className="event-card">
          <h3>{event.name}</h3>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Date:</strong> {formatEventDate(event.date)}</p>
          <p>{event.description}</p>
          <BookingForm eventId={event.id} tickets={event.tickets} loggedInUser={loggedInUser} onBooked={onBooked} />
        </div>
      ))}
    </div>
  );
}

export default EventList;
