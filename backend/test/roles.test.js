const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { useTempDatabase, setupDatabase, query, loginAs } = require('./helpers');

useTempDatabase();
const app = require('../src/app');
const { connection } = require('../src/db/connection');

setupDatabase({ before, after }, connection);

const newEvent = {
    name: 'Test Gig', category: 'Concert', location: 'Leeds', date: '2099-01-01',
    lon: -1.5491, lat: 53.8008, description: 'A test event',
};

test('signup always creates a normal user, even if isAdmin is sent', { timeout: 2000 }, async () => {
    await request(app).post('/user/signup').send({ username: 'mallory', password: 'password123', isAdmin: 1 }).expect(200);
    const [row] = await query(connection, 'SELECT isAdmin FROM users WHERE username = ?', ['mallory']);
    assert.equal(row.isAdmin, 0);
});

test('signup works without an isAdmin field', { timeout: 2000 }, async () => {
    await request(app).post('/user/signup').send({ username: 'frank', password: 'password123' }).expect(200);
});

test('signup with an existing username returns 409', { timeout: 2000 }, async () => {
    await request(app).post('/user/signup').send({ username: 'frank', password: 'password123' }).expect(409);
});

test('signup rejects missing credentials', { timeout: 2000 }, async () => {
    await request(app).post('/user/signup').send({ username: 'nopass' }).expect(400);
});

for (const [path, body] of [
    ['/event/create', newEvent],
    ['/ticket/create', { eventID: 1, ticketType: 'Student', price: 10, availability: 5 }],
]) {
    test(`POST ${path} requires an admin session`, { timeout: 2000 }, async () => {
        await request(app).post(path).send(body).expect(401);
        const user = await loginAs(app, connection, `user_${path.split('/')[1]}`);
        await user.post(path).send(body).expect(403);
        const admin = await loginAs(app, connection, `admin_${path.split('/')[1]}`, { admin: true });
        const res = await admin.post(path).send(body).expect(200);
        assert.equal(res.body.success, true);
    });
}

for (const path of ['/user/getAll', '/booking/getAll']) {
    test(`GET ${path} is admin-only`, { timeout: 2000 }, async () => {
        await request(app).get(path).expect(401);
        const user = await loginAs(app, connection, `reader_${path.split('/')[1]}`);
        await user.get(path).expect(403);
        const admin = await loginAs(app, connection, `root_${path.split('/')[1]}`, { admin: true });
        const res = await admin.get(path).expect(200);
        assert.ok(Array.isArray(res.body));
    });
}

test('the unauthenticated /booking/create endpoint no longer exists', { timeout: 2000 }, async () => {
    await request(app).post('/booking/create').send({ eventID: 1, ticketType: 'General', username: 'x', quantity: 1 }).expect(404);
});
