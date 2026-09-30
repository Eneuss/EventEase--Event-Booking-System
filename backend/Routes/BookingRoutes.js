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
    if (!Number.isInteger(eventID) || eventID < 1 ||
      !ticketType || typeof ticketType !== 'string' ||
      !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ success: false, message: 'Invalid booking input.' });
    }

    try {
        // The booking always belongs to the logged-in user, whatever the client sends.
        const result = await bookingService.bookEvent({ eventID, ticketType, quantity, username: req.session.user });
        if (!result.success) {
            return res.status(result.status).json({ success: false, message: result.message });
        }
        res.json({ success: true, message: 'Booking confirmed.', bookingId: result.bookingId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while creating the booking.' });
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
