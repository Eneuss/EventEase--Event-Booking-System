const express = require('express');
const bookingService = require('../services/bookingService');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const asyncHandler = require('../utils/asyncHandler');
const { isNonEmptyString, isPositiveInteger } = require('../utils/validation');

const router = express.Router();

// Book tickets for the logged-in user
router.post('/ticketing', requireAuth, asyncHandler(async (req, res) => {
    const { eventID, ticketType, quantity } = req.body;
    if (!isPositiveInteger(eventID) || !isNonEmptyString(ticketType) || !isPositiveInteger(quantity)) {
        return res.status(400).json({ success: false, message: 'Invalid booking input.' });
    }

    // The booking always belongs to the logged-in user, whatever the client sends.
    const result = await bookingService.book({ eventID, ticketType, quantity, username: req.session.user });
    if (!result.success) {
        return res.status(result.status).json({ success: false, message: result.message });
    }
    res.json({ success: true, message: 'Booking confirmed.', bookingId: result.bookingId });
}));

// List all bookings (admin only)
router.get('/getAll', requireAdmin, asyncHandler(async (req, res) => {
    res.json(await bookingService.listBookings());
}));

module.exports = router;
