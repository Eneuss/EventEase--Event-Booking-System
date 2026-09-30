const { rateLimit } = require('express-rate-limit');

// Slow down password guessing: at most 10 failed logins per IP address in 15 minutes.
// Successful logins do not count. Counters live in memory, so they reset when the server restarts.
const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many failed login attempts. Please try again later.' },
});

module.exports = loginRateLimit;
