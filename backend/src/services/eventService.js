const eventsDao = require('../daos/eventsDao');
const ticketsDao = require('../daos/ticketsDao');

// Attach each event's ticket types (type, price, availability) using a single query for all events.
async function withTickets(events) {
    const tickets = await ticketsDao.findByEventIds(events.map((e) => e.id));
    return events.map((event) => ({
        ...event,
        tickets: tickets
            .filter((t) => t.eventID === event.id)
            .map(({ ticketType, price, availability }) => ({ ticketType, price, availability })),
    }));
}

const eventService = {
    listEvents: async () => withTickets(await eventsDao.findAll()),
    searchByLocation: async (location) => withTickets(await eventsDao.findByLocation(location)),
    createEvent: (event) => eventsDao.create(event),
};

module.exports = eventService;
