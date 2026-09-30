const UsersDAO = require('../DAOs/UsersDAO');
const [hashedpassword, verifyPassword] = require('../Utilities/bcryptUtility')

class UserService {
    constructor() {
        this.userdao = new UsersDAO();
    }

    // Create a new user
    async create(req) {
        const existing = await this.userdao.retrieveByUsername(req)
        if (existing.result) {
            return { success: false, conflict: true }
        }
        const passwordHash = await hashedpassword(req.body.password)
        return this.userdao.create(req.body.username, passwordHash)
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
        const user = result.result
        const isMatch = user ? await verifyPassword(req.body.password, user.password) : false
        if(isMatch){
            req.session.user = req.body.username;
            req.session.isAuthenticated = true
            req.session.isAdmin = user.isAdmin === 1
        }
        result.success = isMatch
        return result
    }
}

module.exports = UserService;
