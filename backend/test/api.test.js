const { test, describe, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { useTempDatabase } = require('./helpers');

useTempDatabase();
const app = require('../app');
const connection = require('../DatabaseConnection/SQLCon');

// The open SQLite handle would otherwise keep the test process alive.
after(() => connection.close());

describe('events', () => {
    test('search by location returns matching events', async () => {
        const res = await request(app).get('/event/London').expect(200);
        assert.ok(Array.isArray(res.body));
        assert.ok(res.body.length > 0);
        assert.ok(res.body.every((e) => e.location === 'London'));
    });

    test('search for an unknown location returns an empty list', async () => {
        const res = await request(app).get('/event/Atlantis').expect(200);
        assert.deepEqual(res.body, []);
    });
});

describe('booking flow', () => {
    const agent = request.agent(app);

    test('booking requires a session', async () => {
        await request(app)
            .post('/booking/ticketing')
            .send({ eventID: 1, ticketType: 'General', username: 'x', quantity: 1 })
            .expect(401);
    });

    test('signup, login and session', async () => {
        await agent.post('/user/signup').send({ username: 'alice', password: 'secret123', isAdmin: 0 }).expect(200);
        const login = await agent.post('/user/login').send({ username: 'alice', password: 'secret123' }).expect(200);
        assert.equal(login.body.success, true);
        const session = await agent.get('/user/session').expect(200);
        assert.deepEqual(session.body, { loggedIn: true, username: 'alice' });
    });

    test('wrong password is rejected', async () => {
        const res = await request(app).post('/user/login').send({ username: 'alice', password: 'nope' });
        assert.equal(res.body.success, false);
    });

    test('booking decreases availability', async () => {
        const before = (await request(app).get('/ticket/getAll')).body
            .find((t) => t.eventID === 1 && t.ticketType === 'General').availability;
        const res = await agent
            .post('/booking/ticketing')
            .send({ eventID: 1, ticketType: 'General', username: 'alice', quantity: 2 });
        assert.equal(res.body.success, true);
        const after = (await request(app).get('/ticket/getAll')).body
            .find((t) => t.eventID === 1 && t.ticketType === 'General').availability;
        assert.equal(after, before - 2);
    });

    test('booking more tickets than available is rejected', async () => {
        const res = await agent
            .post('/booking/ticketing')
            .send({ eventID: 1, ticketType: 'General', username: 'alice', quantity: 100000 });
        assert.equal(res.body.success, false);
    });

    test('invalid booking input is rejected', async () => {
        await agent.post('/booking/ticketing').send({ eventID: '1', ticketType: 'General', quantity: 1 }).expect(400);
    });

    test('logout ends the session', async () => {
        await agent.post('/user/logout').expect(200);
        const session = await agent.get('/user/session');
        assert.equal(session.body.loggedIn, false);
    });
});
