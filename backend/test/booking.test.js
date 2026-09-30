const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { useTempDatabase } = require('./helpers');

useTempDatabase();
const app = require('../app');
const connection = require('../DatabaseConnection/SQLCon');

after(() => connection.close());

async function loggedInAgent(username) {
    const agent = request.agent(app);
    await agent.post('/user/signup').send({ username, password: 'password123', isAdmin: 0 });
    await agent.post('/user/login').send({ username, password: 'password123' }).expect(200);
    return agent;
}

test('bookings are recorded for the session user, not the username in the body', { timeout: 2000 }, async () => {
    const dave = await loggedInAgent('dave');
    await dave
        .post('/booking/ticketing')
        .send({ eventID: 1, ticketType: 'General', username: 'john_doe', quantity: 1 })
        .expect(200);

    const row = await new Promise((resolve, reject) =>
        connection.get('SELECT username FROM bookings ORDER BY id DESC LIMIT 1', (err, r) => (err ? reject(err) : resolve(r))));
    assert.equal(row.username, 'dave');
});

test('the username field is optional in the booking request', { timeout: 2000 }, async () => {
    const erin = await loggedInAgent('erin');
    const res = await erin.post('/booking/ticketing').send({ eventID: 1, ticketType: 'General', quantity: 1 });
    assert.equal(res.body.success, true);
});
