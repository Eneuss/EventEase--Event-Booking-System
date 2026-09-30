const BookingsDAO = require('../DAOs/BookingsDAO');

class BookingService {
    constructor() {
        this.bookingsdao = new BookingsDAO();
    }

    // Book tickets for an event
    async bookEvent(booking) {
        return this.bookingsdao.bookEvent(booking);
    }

    // Retrieve all bookings
    async retrieveAll() {
        const result = await this.bookingsdao.retrieveAll();
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve a booking by ID
    async retrieveById(req) {
        const result = await this.bookingsdao.retrieveById(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Update a booking
    async update(req) {
        const result = await this.bookingsdao.update(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Delete a booking
    async delete(req) {
        const result = await this.bookingsdao.delete(req);
        if (!result.success) {
            return result;
        }
        return result;
    }
}

module.exports = BookingService;
