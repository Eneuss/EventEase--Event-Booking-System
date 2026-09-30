const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3');
const { resolveDbPath } = require('./paths');

const dbPath = resolveDbPath();
if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const connection = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(`Could not open database at ${dbPath}:`, err.message);
        process.exit(1);
    }
});

// Run statements strictly in the order they are issued (needed for atomic bookings).
connection.serialize();

module.exports = connection;
