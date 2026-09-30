const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { useTempDatabase, setupDatabase } = require('./helpers');

useTempDatabase();
const app = require('../src/app');
const { connection } = require('../src/db/connection');

setupDatabase({ before, after }, connection);

test('successful logins do not count towards the limit', { timeout: 10000 }, async () => {
    for (let i = 0; i < 12; i++) {
        await request(app).post('/user/login').send({ username: 'demo', password: 'demo1234' }).expect(200);
    }
});

test('login is blocked with 429 after 10 failed attempts', { timeout: 10000 }, async () => {
    for (let i = 0; i < 10; i++) {
        await request(app).post('/user/login').send({ username: 'demo', password: 'wrong' }).expect(401);
    }
    const blocked = await request(app).post('/user/login').send({ username: 'demo', password: 'demo1234' }).expect(429);
    assert.equal(blocked.body.success, false);
    assert.match(blocked.body.message, /Too many/);
    assert.ok(blocked.headers['ratelimit-reset'] || blocked.headers['retry-after']);
});
