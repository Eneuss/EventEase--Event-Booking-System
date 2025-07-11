const connection = require('../DatabaseConnection/SQLCon');
const createResponse = require('../Utilities/createResponse');

class EventsDAO {
    constructor() {}

    // Create a new event
    async create(req) {
        return new Promise((resolve, reject) => {
            connection.run('INSERT INTO events (name, category, location, date, lon, lat, description) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [
                req.body.name,
                req.body.category,
                req.body.location,
                req.body.date,
                req.body.lon,
                req.body.lat,
                req.body.description
            ], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, 'Event created successfully', { id: this.lastID }));
            });
        });
    }

    // Retrieve all events
    async retrieveAll() {
        return new Promise((resolve, reject) => {
            connection.all('SELECT * FROM events', [], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, result));
            });
        });
    }

    // Retrieve event by location
    async retrieveByLoc(location) {
        return new Promise((resolve, reject) => {
            connection.all('SELECT * FROM events WHERE location = ?', [location], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, result));
            });
        });
    }


    // Retrieve event by ID
    async retrieveById(req) {
        return new Promise((resolve, reject) => {
            connection.get('SELECT * FROM events WHERE id = ?', [req.body.id], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, result));
            });
        });
    }

    // Update an event
    async update(req) {
        return new Promise((resolve, reject) => {
            connection.run('UPDATE events SET name = ?, category = ?, location = ?, date = ?, lon = ?, lat = ?, description = ? WHERE id = ?',
            [
                req.body.name,
                req.body.category,
                req.body.location,
                req.body.date,
                req.body.lon,
                req.body.lat,
                req.body.description,
                req.body.id
            ], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, 'Event updated successfully'));
            });
        });
    }

    // Delete an event
    async delete(req) {
        return new Promise((resolve, reject) => {
            connection.run('DELETE FROM events WHERE id = ?', [req.body.id], (err, result) => {
                if (err) {
                    reject(createResponse(false, 'DB error', err));
                }
                resolve(createResponse(true, 'Event deleted successfully'));
            });
        });
    }
}

module.exports = EventsDAO;
