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

// Promise wrappers for single statements.
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        connection.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) =>
        connection.get(sql, params, (err, row) => (err ? reject(err) : resolve(row))));
}

function all(sql, params = []) {
    return new Promise((resolve, reject) =>
        connection.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))));
}

function exec(sql) {
    return new Promise((resolve, reject) => connection.exec(sql, (err) => (err ? reject(err) : resolve())));
}

module.exports = { connection, run, get, all, exec };
