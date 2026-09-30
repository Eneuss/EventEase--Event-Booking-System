const path = require('node:path');

const backendRoot = path.join(__dirname, '..', '..');

// Resolve relative paths against the backend folder so the server works from any working directory.
function resolveDbPath(dbPath = process.env.DB_PATH) {
    if (dbPath === ':memory:') return dbPath;
    return path.resolve(backendRoot, dbPath || path.join('data', 'eventease.db'));
}

module.exports = { resolveDbPath };
