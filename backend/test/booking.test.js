const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { useTempDatabase, query, loginAs } = require('./helpers');

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

test('concurrent bookings never oversell', { timeout: 5000 }, async () => {
    await query(connection, "UPDATE tickets SET availability = 5 WHERE eventID = 1 AND ticketType = 'VIP'");
    const [{ before }] = await query(connection, "SELECT COUNT(*) AS before FROM bookings WHERE eventID = 1 AND ticketType = 'VIP'");
    const agent = await loggedInAgent('rush');

    const responses = await Promise.all(Array.from({ length: 20 }, () =>
        agent.post('/booking/ticketing').send({ eventID: 1, ticketType: 'VIP', quantity: 1 })));

    const succeeded = responses.filter((r) => r.status === 200 && r.body.success).length;
    const [{ availability }] = await query(connection, "SELECT availability FROM tickets WHERE eventID = 1 AND ticketType = 'VIP'");
    const [{ after }] = await query(connection, "SELECT COUNT(*) AS after FROM bookings WHERE eventID = 1 AND ticketType = 'VIP'");

    assert.equal(succeeded, 5);
    assert.equal(availability, 0);
    assert.equal(after - before, 5);
    assert.ok(responses.filter((r) => !r.body.success).every((r) => r.status === 409));
});

test('booking an unknown ticket type returns 404', { timeout: 2000 }, async () => {
    const agent = await loggedInAgent('gina');
    const res = await agent.post('/booking/ticketing').send({ eventID: 1, ticketType: 'Backstage', quantity: 1 });
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message);
});

test('a successful booking returns its id', { timeout: 2000 }, async () => {
    const agent = await loggedInAgent('hank');
    const res = await agent.post('/booking/ticketing').send({ eventID: 1, ticketType: 'General', quantity: 1 }).expect(200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.bookingId, 'number');
});

test('quantity and eventID must be positive integers', { timeout: 2000 }, async () => {
    const agent = await loggedInAgent('ivan');
    const [{ availability: before }] = await query(connection, "SELECT availability FROM tickets WHERE eventID = 1 AND ticketType = 'General'");
    for (const body of [
        { eventID: 1, ticketType: 'General', quantity: -5 },
        { eventID: 1, ticketType: 'General', quantity: 1.5 },
        { eventID: 1.5, ticketType: 'General', quantity: 1 },
    ]) {
        await agent.post('/booking/ticketing').send(body).expect(400);
    }
    const [{ availability: after }] = await query(connection, "SELECT availability FROM tickets WHERE eventID = 1 AND ticketType = 'General'");
    assert.equal(after, before);
});
