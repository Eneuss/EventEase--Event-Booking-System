const { run, get, all } = require('../db/connection');

const ticketsDao = {
    findAll() {
        return all('SELECT * FROM tickets');
    },

    findByEventIds(eventIds) {
        if (eventIds.length === 0) return Promise.resolve([]);
        const placeholders = eventIds.map(() => '?').join(', ');
        return all(
            `SELECT eventID, ticketType, price, availability FROM tickets WHERE eventID IN (${placeholders}) ORDER BY id`,
            eventIds
        );
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
