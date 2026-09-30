const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const session = require('express-session')
const UserRouter = require('./Routes/UserRoutes');
const EventRouter = require('./Routes/EventRoutes');
const TicketRouter = require('./Routes/TicketRoutes');
const BookingRouter = require('./Routes/BookingRoutes');
app.use(express.json())
app.use(session({
    secret: 'my_secret_',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));  // Cross-origin resource sharing

// User Routes
app.use('/user', UserRouter);

// Event Routes
app.use('/event', EventRouter);

// Ticket Routes
app.use('/ticket', TicketRouter);

// Booking Routes
app.use('/booking', BookingRouter);

// Last-resort error handler: log and answer with a generic 500 instead of crashing.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

module.exports = app;
