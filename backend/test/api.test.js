const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { useTempDatabase, setupDatabase } = require('./helpers');

useTempDatabase();
const app = require('../src/app');
const { connection } = require('../src/db/connection');

setupDatabase({ before, after }, connection);

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

    test('search results include each event\'s ticket types, prices and availability', async () => {
        const res = await request(app).get('/event/London').expect(200);
        const rock = res.body.find((e) => e.name === 'Rock Concert');
        assert.deepEqual(rock.tickets.map((t) => t.ticketType), ['General', 'VIP', 'Student']);
        for (const ticket of rock.tickets) {
            assert.deepEqual(Object.keys(ticket).sort(), ['availability', 'price', 'ticketType']);
        }
    });

    test('all events are listed', async () => {
        const res = await request(app).get('/event/getAll').expect(200);
        assert.ok(res.body.length >= 5);
    });

    test('availability and price can be looked up by event name', async () => {
        const res = await request(app).get('/ticket/Rock%20Concert').expect(200);
        assert.equal(typeof res.body.availability, 'number');
        assert.equal(typeof res.body.price, 'number');
    });

    test('unknown routes return a JSON 404', async () => {
        const res = await request(app).get('/nope').expect(404);
        assert.equal(res.body.success, false);
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
