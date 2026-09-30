const ticketsDao = require('../daos/ticketsDao');

const ticketService = {
    listTickets: () => ticketsDao.findAll(),
    findAvailableByEventName: (name) => ticketsDao.findAvailableByEventName(name),
    createTicket: (ticket) => ticketsDao.create(ticket),
};

module.exports = ticketService;
