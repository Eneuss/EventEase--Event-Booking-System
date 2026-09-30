import BookingForm from './BookingForm.jsx';

function EventList({ events, loggedInUser }) {
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
          <p><strong>Date:</strong> {event.date}</p>
          <p>{event.description}</p>
          <BookingForm eventId={event.id} loggedInUser={loggedInUser} />
        </div>
      ))}
    </div>
  );
}

export default EventList;
