const fs = require('node:fs');
const path = require('node:path');
const { exec, get } = require('./connection');
const { seed } = require('./seed');

// Create the tables if needed and seed demo data into an empty database.
async function initDatabase() {
    await exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

    const { count } = await get('SELECT COUNT(*) AS count FROM events');
    if (count === 0) {
        await seed();
        console.log('Database was empty: seeded demo data');
    }
}

module.exports = initDatabase;
