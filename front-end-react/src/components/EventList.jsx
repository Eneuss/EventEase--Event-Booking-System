import React, { useState } from 'react';

function EventList({ events, loggedInUser }) {
  const [formData, setFormData] = useState({}); //store selected ticket type and quantity per event

  const handleInputChange = (eventId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value
      }
    }));
  };

  const handleBooking = async (eventId) => {
    //task 11, let only logged in users book
    if (!loggedInUser) {
        alert('You must be logged in to book.');
        return;
      }

    const eventData = formData[eventId];
    if (!eventData || !eventData.ticketType || !eventData.quantity) {
      alert("Please select ticket type and quantity.");
      return;
    }

    try {
      const response = await fetch('/booking/ticketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventID: eventId,
          ticketType: eventData.ticketType,
          username: loggedInUser, 
          quantity: parseInt(eventData.quantity, 10)
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert(`Booking successful`);

        //to reset the form fields for this event after puchesing tickets
        setFormData((prev) => ({
            ...prev,
            [eventId]: {
            ticketType: '',
            quantity: ''
            }
        }));
      } else if (response.status === 400) {
        alert(`Invalid input: ${data.message}`);
      } else if (response.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert(data.message || 'Booking failed.');

      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('An unexpected error occurred while booking.');
    }
  };

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

          {/* Ticket type selector */}
          <label>
            Ticket Type:
            <select
              value={formData[event.id]?.ticketType || ''}
              onChange={(e) =>
                handleInputChange(event.id, 'ticketType', e.target.value)
              }
            >
              <option value="">-- Select Type --</option>
              <option value="General">General</option>
              <option value="VIP">VIP</option>
              <option value="Student">Student</option>
            </select>
          </label>

          {/* Quantity input */}
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={formData[event.id]?.quantity || ''}
              onChange={(e) =>
                handleInputChange(event.id, 'quantity', e.target.value)
              }
            />
          </label>

          <button onClick={() => handleBooking(event.id)}>Book Ticket</button>
        </div>
      ))}
    </div>
  );
}

export default EventList;
