const connection = require('../DatabaseConnection/SQLCon');
const createResponse = require('../Utilities/createResponse');

class TicketsDAO {
    constructor() {}

    // Create a new ticket
    async create(req) {
        return new Promise((resolve, reject) => {
            connection.run('INSERT INTO tickets (eventID, ticketType, price, availability) VALUES (?, ?, ?, ?)', 
            [
                req.body.eventID,
                req.body.ticketType,
                req.body.price,
                req.body.availability
            ], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, 'Ticket created successfully', { id: this.lastID }));
            });
        });
    }

    // Retrieve all tickets for an event
    async retrieveAll() {
        return new Promise((resolve, reject) => {
            connection.all('SELECT * FROM tickets', [], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, result));
            });
        });
    }

    // Retrieve ticket by ID
    async retrieveById(req) {
        return new Promise((resolve, reject) => {
            connection.get('SELECT * FROM tickets WHERE id = ?', [req.body.id], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, result));
            });
        });
    }

    // Retrieve ticket by Event
    async retrieveByEvent(name) {
        return new Promise((resolve, reject) => {
            connection.get(`SELECT availability, price FROM tickets t 
            JOIN events e ON t.eventID = e.id 
            WHERE e.name = ? and availability > 0`, [name], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, result));
            });
        });
    }
      

    // Update ticket details
    async update(req) {
        return new Promise((resolve, reject) => {
            connection.run('UPDATE tickets SET eventID = ?, ticketType = ?, price = ?, availability = ? WHERE id = ?',
            [
                req.body.eventID,
                req.body.ticketType,
                req.body.price,
                req.body.availability,
                req.body.id
            ], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, 'Ticket updated successfully'));
            });
        });
    }

    // Delete a ticket
    async delete(req) {
        return new Promise((resolve, reject) => {
            connection.run('DELETE FROM tickets WHERE id = ?', [req.body.id], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, 'Ticket deleted successfully'));
            });
        });
    }
}

module.exports = TicketsDAO;
