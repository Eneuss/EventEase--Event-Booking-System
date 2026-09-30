const { run, all } = require('../db/connection');

const eventsDao = {
    findAll() {
        return all('SELECT * FROM events');
    },

    findByLocation(location) {
        return all('SELECT * FROM events WHERE location = ?', [location]);
    },

    async create({ name, category, location, date, lon, lat, description }) {
        const { lastID } = await run(
            'INSERT INTO events (name, category, location, date, lon, lat, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, category, location, date, lon, lat, description]
        );
        return lastID;
    },
};

module.exports = eventsDao;
