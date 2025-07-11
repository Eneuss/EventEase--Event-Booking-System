const express = require('express');
const router = express.Router();
const EventService = require('../Services/EventService');
const path = require('path');

const eventService = new EventService();

// Create a new event
router.post('/create', async (req, res) => {
    try {
        const result = await eventService.create(req);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the event.' });
    }
});




// Retrieve all events
router.get('/getAll', async (req, res) => {
    try {
        const result = await eventService.retrieveAll();
        res.json(result.result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving events.' });
    }
});

// Get the event creation page
router.get('/getAllPage', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'events.html'));
});


// Retrive a event by Location
router.get('/:location', async (req, res) => {
    try {
        const location = req.params.location;
        const result = await eventService.retrieveByLoc(location);
        res.json(result.result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving events.' });
    }
});

module.exports = router;
