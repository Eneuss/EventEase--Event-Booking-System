import { useState } from 'react';
import { bookTicket } from '../api.js';

const TICKET_TYPES = ['General', 'VIP', 'Student'];

// Ticket type + quantity form used both in the event list and in the map popups.
// `compact` switches to the shorter labels used inside map popups.
function BookingForm({ eventId, loggedInUser, compact = false }) {
  const [ticketType, setTicketType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser) {
      setMessage({ type: 'error', text: 'You must be logged in to book.' });
      return;
    }
    const qty = Number(quantity);
    if (!ticketType || !Number.isInteger(qty) || qty < 1) {
      setMessage({ type: 'error', text: 'Please select a ticket type and quantity.' });
      return;
    }

    setSubmitting(true);
    try {
      const { ok, data } = await bookTicket({ eventID: eventId, ticketType, quantity: qty });
      if (ok && data.success) {
        setMessage({ type: 'success', text: 'Booking successful!' });
        setTicketType('');
        setQuantity('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Booking failed.' });
      }
    } catch (err) {
      console.error('Booking error:', err);
      setMessage({ type: 'error', text: 'Could not reach the server. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const separator = compact ? <br /> : ' ';

  return (
    <form className="booking-form" onSubmit={handleSubmit} style={compact ? { marginTop: '10px' } : undefined}>
      <label>
        {compact ? 'Type:' : 'Ticket Type:'}
        <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
          <option value="">{compact ? 'Select' : '-- Select Type --'}</option>
          {TICKET_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>
      {separator}
      <label>
        {compact ? 'Qty:' : 'Quantity:'}
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </label>
      {separator}
      <button type="submit" disabled={submitting}>{compact ? 'Book' : 'Book Ticket'}</button>
      {message && <p className={message.type} role="status">{message.text}</p>}
    </form>
  );
}

export default BookingForm;
