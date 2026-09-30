const express = require('express');
const userService = require('../services/userService');
const requireAdmin = require('../middleware/requireAdmin');
const loginRateLimit = require('../middleware/loginRateLimit');
const asyncHandler = require('../utils/asyncHandler');
const { isNonEmptyString } = require('../utils/validation');

const router = express.Router();

// Register a new (non-admin) user
router.post('/signup', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
    if (!(await userService.signup(username, password))) {
        return res.status(409).json({ success: false, message: 'Username is already taken.' });
    }
    res.json({ success: true, username });
}));

router.post('/login', loginRateLimit, asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
        return res.status(400).json({ success: false, message: 'Invalid username or password input.' });
    }
    const user = await userService.authenticate(username, password);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
    req.session.user = user.username;
    req.session.isAdmin = user.isAdmin;
    res.json({ success: true, username: user.username });
}));

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: 'Logged out' });
    });
});

// Lets the frontend restore the login state after a page reload
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// List all users without password hashes (admin only)
router.get('/getAll', requireAdmin, asyncHandler(async (req, res) => {
    res.json(await userService.listUsers());
}));

module.exports = router;
