const bookingsDao = require('../daos/bookingsDao');

const bookingService = {
    listBookings: () => bookingsDao.findAll(),

    // Returns { success: true, bookingId } or { success: false, status, message }.
    async book({ eventID, ticketType, username, quantity }) {
        const bookingId = await bookingsDao.bookTickets({ eventID, ticketType, username, quantity });
        if (bookingId !== null) {
            return { success: true, bookingId };
        }

        const ticket = await bookingsDao.findTicketStatus(eventID, ticketType);
        if (!ticket) {
            return { success: false, status: 404, message: 'This ticket type does not exist for this event.' };
        }
        if (ticket.isPast) {
            return { success: false, status: 400, message: 'This event has already taken place.' };
        }
        return { success: false, status: 409, message: 'This ticket type is sold out or does not have enough availability.' };
    },
};

module.exports = bookingService;
