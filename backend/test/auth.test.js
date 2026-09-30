const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { useTempDatabase, setupDatabase, loginAs } = require('./helpers');

useTempDatabase();
const app = require('../app');
const connection = require('../DatabaseConnection/SQLCon');

setupDatabase({ before, after }, connection);

test('login with an unknown username returns 401 and the server keeps running', { timeout: 2000 }, async () => {
    const res = await request(app).post('/user/login').send({ username: 'ghost', password: 'whatever' });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    await request(app).get('/user/session').expect(200);
});

test('login with a wrong password returns 401 with the same message', { timeout: 2000 }, async () => {
    await request(app).post('/user/signup').send({ username: 'bob', password: 'right-password', isAdmin: 0 });
    const wrong = await request(app).post('/user/login').send({ username: 'bob', password: 'wrong' });
    const unknown = await request(app).post('/user/login').send({ username: 'nobody', password: 'wrong' });
    assert.equal(wrong.status, 401);
    assert.equal(wrong.body.message, unknown.body.message);
});

test('responses never contain password hashes', { timeout: 2000 }, async () => {
    const agent = request.agent(app);
    await agent.post('/user/signup').send({ username: 'carol', password: 'carol-password', isAdmin: 0 });
    const login = await agent.post('/user/login').send({ username: 'carol', password: 'carol-password' }).expect(200);
    assert.deepEqual(login.body, { success: true, username: 'carol' });

    const admin = await loginAs(app, connection, 'auditor', { admin: true });
    const users = await admin.get('/user/getAll').expect(200);
    assert.ok(users.body.some((u) => u.username === 'carol'));
    assert.doesNotMatch(JSON.stringify(users.body), /password|\$2b\$/);
});
