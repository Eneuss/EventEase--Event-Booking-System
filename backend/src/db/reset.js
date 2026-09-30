// Delete the database file and recreate it with fresh demo data: npm run db:reset
const fs = require('node:fs');
const { resolveDbPath } = require('./paths');

const dbPath = resolveDbPath();
if (dbPath !== ':memory:') {
    fs.rmSync(dbPath, { force: true });
}

const { connection } = require('./connection');
const initDatabase = require('./init');

initDatabase()
    .then(() => console.log(`Reset database at ${dbPath}`))
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => connection.close());
