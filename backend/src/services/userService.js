const usersDao = require('../daos/usersDao');
const { hashPassword, verifyPassword } = require('../utils/password');

const userService = {
    listUsers: () => usersDao.findAll(),

    // Returns false if the username is already taken.
    async signup(username, password) {
        if (await usersDao.findByUsername(username)) {
            return false;
        }
        await usersDao.create(username, await hashPassword(password));
        return true;
    },

    // Returns { username, isAdmin } for valid credentials, otherwise null.
    // Unknown users and wrong passwords are indistinguishable to the caller.
    async authenticate(username, password) {
        const user = await usersDao.findByUsername(username);
        if (!user || !(await verifyPassword(password, user.password))) {
            return null;
        }
        return { username: user.username, isAdmin: user.isAdmin === 1 };
    },
};

module.exports = userService;
