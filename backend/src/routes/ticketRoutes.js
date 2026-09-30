const express = require('express');
const ticketService = require('../services/ticketService');
const requireAdmin = require('../middleware/requireAdmin');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Create a new ticket type for an event (admin only)
router.post('/create', requireAdmin, asyncHandler(async (req, res) => {
    const id = await ticketService.createTicket(req.body);
    res.json({ success: true, id });
}));

// List all tickets
router.get('/getAll', asyncHandler(async (req, res) => {
    res.json(await ticketService.listTickets());
}));

// Availability and price of an event, by event name
router.get('/:event', asyncHandler(async (req, res) => {
    res.json(await ticketService.findAvailableByEventName(req.params.event));
}));

module.exports = router;
