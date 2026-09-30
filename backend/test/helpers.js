const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Point the app at a throwaway copy of the database before it is loaded.
function useTempDatabase() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eventease-test-'));
    const dbPath = path.join(dir, 'eventease.db');
    fs.copyFileSync(path.join(__dirname, '..', 'eventease.db'), dbPath);
    process.env.DB_PATH = dbPath;
    return dbPath;
}

module.exports = { useTempDatabase };
