const { run, get, all } = require('../db/connection');

const ticketsDao = {
    findAll() {
        return all('SELECT * FROM tickets');
    },

    // Availability and price of the first ticket type still available for the named event.
    findAvailableByEventName(name) {
        return get(
            `SELECT availability, price FROM tickets t
             JOIN events e ON t.eventID = e.id
             WHERE e.name = ? AND availability > 0`,
            [name]
        );
    },

    async create({ eventID, ticketType, price, availability }) {
        const { lastID } = await run(
            'INSERT INTO tickets (eventID, ticketType, price, availability) VALUES (?, ?, ?, ?)',
            [eventID, ticketType, price, availability]
        );
        return lastID;
    },
};

module.exports = ticketsDao;
