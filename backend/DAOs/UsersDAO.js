const connection = require('../DatabaseConnection/SQLCon')
const createresponse = require('../Utilities/createResponse')

class UsersDAO {
    constructor() {}

    // Create a new user
    async create(req) {
        return new Promise((resolve, reject) => {
            connection.run('INSERT INTO users (username, password, isAdmin) VALUES (?,?,?)', 
                [req.body.username, req.body.password, req.body.isAdmin], 
                (err, result) => {
                    if (err) {
                        reject(createresponse(false, 'DB error', err))
                    }
                    resolve(createresponse(true, result))
                })
        })
    }

    // Retrieve all users
    async retrieveAll() {
        return new Promise((resolve, reject) => {
            connection.all('SELECT id, username, isAdmin FROM users', [], (err, result) => {
                if (err) {
                    reject(createresponse(false, 'DB error', err))
                }
                resolve(createresponse(true, result))
            })
        })
    }

    // Retrieve user by ID
    async retrieveById(req) {
        return new Promise((resolve, reject) => {
            connection.get('SELECT * FROM users WHERE id = (?)', [req.body.id], (err, result) => {
                if (err) {
                    reject(createresponse(false, 'DB error', err))
                }
                resolve(createresponse(true, result))
            })
        })
    }

    //retrieve user by username
    async retrieveByUsername(req) {
        return new Promise((resolve, reject) => {
            connection.get('SELECT * FROM users WHERE username = (?)', [req.body.username], (err, result) => {
                if (err) {
                    reject(createresponse(false, 'DB error', err))
                }
                resolve(createresponse(true, result))
            })
        })
    }

    // Update a user's information
    async update(req) {
        return new Promise((resolve, reject) => {
            connection.run('UPDATE users SET username = ?, password = ?, isAdmin = ? WHERE id = ?', 
                [req.body.username, req.body.password, req.body.isAdmin, req.body.id], 
                (err, result) => {
                    if (err) {
                        reject(createresponse(false, 'DB error', err))
                    }
                    resolve(createresponse(true, result))
                })
        })
    }

    // Delete a user
    async delete(req) {
        return new Promise((resolve, reject) => {
            connection.run('DELETE FROM users WHERE id = (?)', [req.body.id], (err, result) => {
                if (err) {
                    reject(createresponse(false, 'DB error', err))
                }
                resolve(createresponse(true, result))
            })
        })
    }
}

module.exports = UsersDAO
