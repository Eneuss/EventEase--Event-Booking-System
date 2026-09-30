const express = require('express');
const eventService = require('../services/eventService');
const requireAdmin = require('../middleware/requireAdmin');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Create a new event (admin only)
router.post('/create', requireAdmin, asyncHandler(async (req, res) => {
    const id = await eventService.createEvent(req.body);
    res.json({ success: true, id });
}));

// List all events
router.get('/getAll', asyncHandler(async (req, res) => {
    res.json(await eventService.listEvents());
}));

// Search events by location
router.get('/:location', asyncHandler(async (req, res) => {
    res.json(await eventService.searchByLocation(req.params.location));
}));

module.exports = router;
