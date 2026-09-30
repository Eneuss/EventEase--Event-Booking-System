const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashPassword = (plainPassword) => bcrypt.hash(plainPassword, SALT_ROUNDS);

// Returns false (instead of throwing) if the stored value is not a valid bcrypt hash.
async function verifyPassword(plainPassword, passwordHash) {
    try {
        return await bcrypt.compare(plainPassword, passwordHash);
    } catch {
        return false;
    }
}

module.exports = { hashPassword, verifyPassword };
