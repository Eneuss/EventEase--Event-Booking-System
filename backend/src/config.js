const DEV_SESSION_SECRET = 'dev-only-insecure-secret-do-not-use-in-production';

// Read settings from environment variables. Pure, so it can be tested with any env object.
function loadConfig(env = process.env) {
    const isProduction = env.NODE_ENV === 'production';
    if (isProduction && !env.SESSION_SECRET) {
        throw new Error('SESSION_SECRET must be set when NODE_ENV=production');
    }
    return {
        port: Number(env.PORT) || 3000,
        isProduction,
        sessionSecret: env.SESSION_SECRET || DEV_SESSION_SECRET,
        usingDevSecret: !env.SESSION_SECRET,
        // Set TRUST_PROXY=1 when running behind a reverse proxy (e.g. nginx in Docker Compose)
        // so the rate limiter sees the client's IP instead of the proxy's.
        trustProxy: env.TRUST_PROXY === '1',
    };
}

module.exports = loadConfig;
