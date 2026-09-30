const fs = require('node:fs');
const path = require('node:path');
const { seed } = require('./seed');

// Create the tables if needed and seed demo data into an empty database.
async function initDatabase(connection) {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await new Promise((resolve, reject) => connection.exec(schema, (err) => (err ? reject(err) : resolve())));

    const { count } = await new Promise((resolve, reject) =>
        connection.get('SELECT COUNT(*) AS count FROM events', (err, row) => (err ? reject(err) : resolve(row))));
    if (count === 0) {
        await seed(connection);
        console.log('Database was empty: seeded demo data');
    }
}

module.exports = initDatabase;
