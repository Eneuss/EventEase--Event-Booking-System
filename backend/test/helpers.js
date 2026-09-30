const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const request = require('supertest');

// Point the app at a fresh, empty database file before it is loaded; it is seeded by setupDatabase().
function useTempDatabase() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eventease-test-'));
    process.env.DB_PATH = path.join(dir, 'eventease.db');
    return process.env.DB_PATH;
}

// Create the schema and demo data, then close the connection once the test file is done.
function setupDatabase({ before, after }, connection) {
    const initDatabase = require('../src/db/init');
    before(() => initDatabase());
    after(() => connection.close());
}

function query(connection, sql, params = []) {
    return new Promise((resolve, reject) =>
        connection.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))));
}

// Sign up a user (optionally promoting them to admin directly in the DB) and return a logged-in agent.
async function loginAs(app, connection, username, { admin = false } = {}) {
    const agent = request.agent(app);
    const password = 'password123';
    await agent.post('/user/signup').send({ username, password });
    if (admin) {
        await query(connection, 'UPDATE users SET isAdmin = 1 WHERE username = ?', [username]);
    }
    await agent.post('/user/login').send({ username, password }).expect(200);
    return agent;
}

module.exports = { useTempDatabase, setupDatabase, query, loginAs };
