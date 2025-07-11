const TicketsDAO = require('../DAOs/TicketsDAO');

class TicketService {
    constructor() {
        this.ticketsdao = new TicketsDAO();
    }

    // Create a new ticket
    async create(req) {
        const result = await this.ticketsdao.create(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve all tickets
    async retrieveAll() {
        const result = await this.ticketsdao.retrieveAll();
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve tickets of a event
    async retrieveByEvent(req) {
        const result = await this.ticketsdao.retrieveByEvent(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve a ticket by ID
    async retrieveById(req) {
        const result = await this.ticketsdao.retrieveById(req);
        if (!result.success) {
            return result;
        }
        return result;
    }
      
    // Update a ticket
    async update(req) {
        const result = await this.ticketsdao.update(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Delete a ticket
    async delete(req) {
        const result = await this.ticketsdao.delete(req);
        if (!result.success) {
            return result;
        }
        return result;
    }
}

module.exports = TicketService;
