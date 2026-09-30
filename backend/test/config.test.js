const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const loadConfig = require('../src/config');

test('production mode requires SESSION_SECRET', () => {
    assert.throws(() => loadConfig({ NODE_ENV: 'production' }), /SESSION_SECRET/);
    assert.equal(loadConfig({ NODE_ENV: 'production', SESSION_SECRET: 's3cret' }).sessionSecret, 's3cret');
});

test('development mode falls back to a clearly marked insecure secret', () => {
    const config = loadConfig({});
    assert.match(config.sessionSecret, /insecure/);
    assert.equal(config.usingDevSecret, true);
});

test('trusting a reverse proxy is opt-in', () => {
    assert.equal(loadConfig({}).trustProxy, false);
    assert.equal(loadConfig({ TRUST_PROXY: '1' }).trustProxy, true);
});

test('PORT is configurable', () => {
    assert.equal(loadConfig({}).port, 3000);
    assert.equal(loadConfig({ PORT: '4000' }).port, 4000);
});

test('the server refuses to start in production without SESSION_SECRET', { timeout: 10000 }, () => {
    const env = { ...process.env, NODE_ENV: 'production', DB_PATH: path.join(os.tmpdir(), `eventease-${process.pid}.db`) };
    delete env.SESSION_SECRET;
    const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'src', 'server.js')], { env, encoding: 'utf8', timeout: 5000 });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /SESSION_SECRET/);
});
