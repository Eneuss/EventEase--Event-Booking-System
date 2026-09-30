const express = require('express');
const router = express.Router();
const BookingService = require('../Services/BookingService');
const SessionAuth = require('../Middleware/SessionAuth')
const RequireAdmin = require('../Middleware/RequireAdmin')
const path = require('path');

const bookingService = new BookingService();

// Create a new booking
router.post('/ticketing', SessionAuth, async (req, res) => {
    //input validation
    const { eventID, ticketType, quantity } = req.body;

    //input validation for security measures
    if (!eventID || typeof eventID !== 'number' ||
      !ticketType || typeof ticketType !== 'string' ||
      !quantity || typeof quantity !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid booking input.' });
    }

    // The booking always belongs to the logged-in user, whatever the client sends.
    req.body.username = req.session.user;

    try {
        const result = await bookingService.bookEvent(req);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the booking.' });
    }
});

// Retrieve all bookings
router.get('/getAll', RequireAdmin, async (req, res) => {
    try {
        const result = await bookingService.retrieveAll();
        res.json(result.result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving bookings.' });
    }
});

// Get the booking creation page
router.get('/getAllPage', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'bookings.html'));
});

module.exports = router;
