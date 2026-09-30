const { connection, get, all } = require('../db/connection');

const bookingsDao = {
    findAll() {
        return all('SELECT * FROM bookings');
    },

    // Book tickets atomically. The availability and event-date checks and the decrement are a single conditional
    // UPDATE, and the INSERT only runs if that UPDATE changed a row. The connection is in serialized mode and all
    // four statements are queued in the same tick, so no other request's statements can run in between.
    // Resolves to the new booking id, or null if nothing could be reserved.
    bookTickets({ eventID, ticketType, username, quantity }) {
        return new Promise((resolve, reject) => {
            let reserved = 0;
            let bookingId = null;
            let failure = null;

            connection.run('BEGIN IMMEDIATE');
            connection.run(
                `UPDATE tickets SET availability = availability - ?
                 WHERE eventID = ? AND ticketType = ? AND availability >= ?
                   AND eventID IN (SELECT id FROM events WHERE date >= date('now'))`,
                [quantity, eventID, ticketType, quantity],
                function (err) {
                    if (err) failure = err;
                    else reserved = this.changes;
                }
            );
            connection.run(
                `INSERT INTO bookings (eventID, ticketType, username, quantity)
                 SELECT ?, ?, ?, ? WHERE changes() = 1`,
                [eventID, ticketType, username, quantity],
                function (err) {
                    if (err) failure = err;
                    else if (this.changes === 1) bookingId = this.lastID;
                }
            );
            connection.run('COMMIT', (err) => {
                if (err || failure) return reject(err || failure);
                resolve(reserved === 1 ? bookingId : null);
            });
        });
    },

    // Used after a failed booking to explain why it failed.
    findTicketStatus(eventID, ticketType) {
        return get(
            `SELECT t.availability, e.date < date('now') AS isPast
             FROM tickets t JOIN events e ON e.id = t.eventID
             WHERE t.eventID = ? AND t.ticketType = ?`,
            [eventID, ticketType]
        );
    },
};

module.exports = bookingsDao;
