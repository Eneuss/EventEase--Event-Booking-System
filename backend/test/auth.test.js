const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { useTempDatabase } = require('./helpers');

useTempDatabase();
const app = require('../app');
const connection = require('../DatabaseConnection/SQLCon');

after(() => connection.close());

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
