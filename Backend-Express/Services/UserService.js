const UsersDAO = require('../DAOs/UsersDAO');
const [hashedpassword, verifyPassword] = require('../Utilities/bcryptUtility')

class UserService {
    constructor() {
        this.userdao = new UsersDAO();
    }

    // Create a new user
    async create(req) {
        req.body.password = await hashedpassword(req.body.password)
        const result = await this.userdao.create(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve all users
    async retrieveAll() {
        const result = await this.userdao.retrieveAll();
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Retrieve a user by ID
    async retrieveById(req) {
        const result = await this.userdao.retrieveById(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Update a user
    async update(req) {
        const result = await this.userdao.update(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    // Delete a user
    async delete(req) {
        const result = await this.userdao.delete(req);
        if (!result.success) {
            return result;
        }
        return result;
    }

    async login(req){
        const result = await this.userdao.retrieveByUsername(req)
        const isMatch = await verifyPassword(req.body.password ,result.result.password)
        if(isMatch){
            req.session.user = req.body.username;
            req.session.isAuthenticated = true
        }
        result.success = isMatch
        return result
    }
}

module.exports = UserService;
