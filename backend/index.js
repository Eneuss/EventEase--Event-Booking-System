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

const PORT = 3000;

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

app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`);
});
