const express = require('express');
const router = express.Router();
const TicketService = require('../Services/TicketService');
const path = require('path');
const RequireAdmin = require('../Middleware/RequireAdmin');

const ticketService = new TicketService();

// Create a new ticket
router.post('/create', RequireAdmin, async (req, res) => {
    try {
        const result = await ticketService.create(req);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the ticket.' });
    }
});


// Retrieve all tickets
router.get('/getAll', async (req, res) => {
    try {
        const result = await ticketService.retrieveAll();
        res.json(result.result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving tickets.' });
    }
});

// Get the ticket creation page
router.get('/getAllPage', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'tickets.html'));
});

// Retrive ticket availability and price of a event
router.get('/:event', async (req, res) => {
    try {
        const event = req.params.event;
        const result = await ticketService.retrieveByEvent(event);
        res.json(result.result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving tickets.' });
    }
});


module.exports = router;
