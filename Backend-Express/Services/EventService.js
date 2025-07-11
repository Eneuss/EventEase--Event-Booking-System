const EventsDAO = require('../DAOs/EventsDAO');

class EventService {
    constructor() {
        this.eventsdao = new EventsDAO();
    }

    // Create a new event
    async create(req) {
        const result = await this.eventsdao.create(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve all events
    async retrieveAll() {
        const result = await this.eventsdao.retrieveAll();
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve an event by ID
    async retrieveById(req) {
        const result = await this.eventsdao.retrieveById(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve an event by Location
    async retrieveByLoc(req) {
        const result = await this.eventsdao.retrieveByLoc(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Update an event
    async update(req) {
        const result = await this.eventsdao.update(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Delete an event
    async delete(req) {
        const result = await this.eventsdao.delete(req);
        if (!result.success) {
            return result;
        }
        return result;
    }
}

module.exports = EventService;
