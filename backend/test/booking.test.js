const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { useTempDatabase, loginAs } = require('./helpers');

useTempDatabase();
const app = require('../app');
const connection = require('../DatabaseConnection/SQLCon');

after(() => connection.close());

const loggedInAgent = (username) => loginAs(app, connection, username);

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
