const express = require('express');
const router = express.Router();
const UserService = require('../Services/UserService');
const SessionAuth = require('../Middleware/SessionAuth');
const path = require('path');
const asyncHandler = require('../Utilities/asyncHandler');

const userService = new UserService();

// Create a new user
router.post('/signup', async (req, res) => {
    try {
        const result = await userService.create(req);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

// Retrieve all users
router.get('/getAll', SessionAuth, async (req, res) => {
    try {
        const result = await userService.retrieveAll();
        res.json(result.result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving users.' });
    }
});

// Get the user creation page
router.get('/getAllPage', SessionAuth, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'users.html'));
});

router.post("/login", asyncHandler(async (req, res) =>{
    const { username, password } = req.body;

    //input check for security measures
    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid username or password input.' });
    }
    const result = await userService.login(req)
    if (!result.success) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
    res.json({ success: true, username: req.session.user })
}))

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true, message: 'Logged out' });
    });
});

  
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user });
    } else {
        res.json({ loggedIn: false });
   }
});
  

module.exports = router;
