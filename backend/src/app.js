const express = require('express');
const session = require('express-session');
const loadConfig = require('./config');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const config = loadConfig();
const app = express();

if (config.trustProxy) {
    app.set('trust proxy', 1);
}

app.use(express.json());
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));

app.use('/user', userRoutes);
app.use('/event', eventRoutes);
app.use('/ticket', ticketRoutes);
app.use('/booking', bookingRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Not found.' });
});

// Last-resort error handler: log and answer with a generic 500 instead of crashing.
// Express recognises error handlers by their four parameters, so _next must stay.
app.use((err, req, res, _next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

module.exports = app;
