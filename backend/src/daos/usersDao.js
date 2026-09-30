const { run, get, all } = require('../db/connection');

const usersDao = {
    // Never select the password hash for listings.
    findAll() {
        return all('SELECT id, username, isAdmin FROM users');
    },

    findByUsername(username) {
        return get('SELECT * FROM users WHERE username = ?', [username]);
    },

    // New users are never admins; admins are created by the seed or directly in the database.
    async create(username, passwordHash) {
        const { lastID } = await run('INSERT INTO users (username, password, isAdmin) VALUES (?, ?, 0)', [username, passwordHash]);
        return lastID;
    },
};

module.exports = usersDao;
