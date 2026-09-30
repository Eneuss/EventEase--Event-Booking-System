const connection = require('../DatabaseConnection/SQLCon');
const createResponse = require('../Utilities/createResponse');

class BookingsDAO {
    constructor() {}

    async bookEvent(req) {
        return new Promise((resolve, reject) => {
            const { eventID, ticketType, username, quantity } = req.body;
            const qty = parseInt(quantity);
            
            //check ticket availability
            connection.get(
                `SELECT availability FROM tickets WHERE eventID = ? AND ticketType = ?`,
                [eventID, ticketType],
                (err, ticket) => {

                    if (err) {
                        return reject({ success: false, message: 'Database error while checking availability', error: err });
                      }
              
                      if (!ticket) {
                        return reject({ success: false, message: 'This ticket type does not exist for this event.' });
                      }
              
                      if (!ticket.availability || ticket.availability < qty) {
                        return reject({ success: false, message: 'This ticket type is sold out or does not have enough availability.' });
                      }
              

                    //booking
                    connection.run(
                        `INSERT INTO bookings (eventID, ticketType, username, quantity) VALUES (?, ?, ?, ?)`,
                        [eventID, ticketType, username, qty],
                        function (err) {
                            if (err) {
                                return reject(createResponse(false, 'DB error while creating booking', err));
                            }
    
                            //update ticket availability
                            connection.run(
                                `UPDATE tickets SET availability = availability - ? WHERE eventID = ? AND ticketType = ?`,
                                [qty, eventID, ticketType],
                                (err2) => {
                                    if (err2) {
                                        return reject(createResponse(false, 'Failed to update ticket availability', err2));
                                    }
    
                                    resolve(
                                        createResponse(true, 'Booking created and availability updated', {
                                            bookingId: this.lastID
                                        })
                                    );
                                }
                            );
                        }
                    );
                }
            );
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
