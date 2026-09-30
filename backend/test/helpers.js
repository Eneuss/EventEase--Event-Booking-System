const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const request = require('supertest');

// Point the app at a throwaway copy of the database before it is loaded.
function useTempDatabase() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eventease-test-'));
    const dbPath = path.join(dir, 'eventease.db');
    fs.copyFileSync(path.join(__dirname, '..', 'eventease.db'), dbPath);
    process.env.DB_PATH = dbPath;
    return dbPath;
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

module.exports = { useTempDatabase, query, loginAs };
