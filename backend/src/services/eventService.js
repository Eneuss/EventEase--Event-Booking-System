const eventsDao = require('../daos/eventsDao');

const eventService = {
    listEvents: () => eventsDao.findAll(),
    searchByLocation: (location) => eventsDao.findByLocation(location),
    createEvent: (event) => eventsDao.create(event),
};

module.exports = eventService;
