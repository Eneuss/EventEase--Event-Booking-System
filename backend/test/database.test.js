const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const request = require('supertest');
const { useTempDatabase, setupDatabase, query } = require('./helpers');

useTempDatabase();
const app = require('../src/app');
const { connection } = require('../src/db/connection');
const initDatabase = require('../src/db/init');
const { resolveDbPath } = require('../src/db/paths');

setupDatabase({ before, after }, connection);

test('relative DB paths resolve against the backend folder, not the working directory', () => {
    assert.equal(resolveDbPath('data/x.db'), path.join(__dirname, '..', 'data', 'x.db'));
    assert.equal(resolveDbPath(':memory:'), ':memory:');
});

test('initialising twice does not duplicate the seed data', async () => {
    const [{ before: count }] = await query(connection, 'SELECT COUNT(*) AS before FROM events');
    await initDatabase();
    const [{ after: again }] = await query(connection, 'SELECT COUNT(*) AS after FROM events');
    assert.equal(again, count);
});

test('the seed contains no bookings and stores only bcrypt hashes', async () => {
    assert.deepEqual(await query(connection, 'SELECT * FROM bookings'), []);
    const users = await query(connection, 'SELECT password FROM users');
    assert.ok(users.every((u) => u.password.startsWith('$2b$')));
});

test('the documented demo accounts can log in', { timeout: 2000 }, async () => {
    await request(app).post('/user/login').send({ username: 'demo', password: 'demo1234' }).expect(200);
    const admin = request.agent(app);
    await admin.post('/user/login').send({ username: 'admin', password: 'admin1234' }).expect(200);
    await admin.get('/user/getAll').expect(200);
});
