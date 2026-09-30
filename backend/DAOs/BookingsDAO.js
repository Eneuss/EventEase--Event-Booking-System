const connection = require('../DatabaseConnection/SQLCon');
const createResponse = require('../Utilities/createResponse');

class BookingsDAO {
    constructor() {}

    // Book tickets atomically. The availability check and decrement are a single conditional UPDATE,
    // and the INSERT only runs if that UPDATE changed a row. The connection is in serialized mode and
    // all four statements are queued in the same tick, so no other request's statements can run in between.
    async bookEvent({ eventID, ticketType, username, quantity }) {
        return new Promise((resolve, reject) => {
            let reserved = 0;
            let bookingId = null;
            let failure = null;

            connection.run('BEGIN IMMEDIATE');
            connection.run(
                `UPDATE tickets SET availability = availability - ?
                 WHERE eventID = ? AND ticketType = ? AND availability >= ?`,
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
                if (err || failure) {
                    return reject(err || failure);
                }
                if (reserved === 1 && bookingId !== null) {
                    return resolve({ success: true, bookingId });
                }
                // Nothing was reserved: find out why, for a useful error message.
                connection.get(
                    'SELECT availability FROM tickets WHERE eventID = ? AND ticketType = ?',
                    [eventID, ticketType],
                    (err2, ticket) => {
                        if (err2) return reject(err2);
                        if (!ticket) {
                            return resolve({ success: false, status: 404, message: 'This ticket type does not exist for this event.' });
                        }
                        resolve({ success: false, status: 409, message: 'This ticket type is sold out or does not have enough availability.' });
                    }
                );
            });
        });
    }

    // Retrieve all bookings
    async retrieveAll() {
        return new Promise((resolve, reject) => {
            connection.all('SELECT * FROM bookings', [], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, result));
            });
        });
    }

    // Retrieve booking by ID
    async retrieveById(req) {
        return new Promise((resolve, reject) => {
            connection.get('SELECT * FROM bookings WHERE id = ?', [req.body.id], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, result));
            });
        });
    }

    // Update a booking
    async update(req) {
        return new Promise((resolve, reject) => {
            connection.run('UPDATE bookings SET eventID = ?, ticketType = ?, username = ?, quantity = ? WHERE id = ?',
            [
                req.body.eventID,
                req.body.ticketType,
                req.body.username,
                req.body.quantity,
                req.body.id
            ], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, 'Booking updated successfully'));
            });
        });
    }

    // Delete a booking
    async delete(req) {
        return new Promise((resolve, reject) => {
            connection.run('DELETE FROM bookings WHERE id = ?', [req.body.id], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, 'Booking deleted successfully'));
            });
        });
    }
}

module.exports = BookingsDAO;
