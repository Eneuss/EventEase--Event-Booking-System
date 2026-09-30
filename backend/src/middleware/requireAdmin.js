const requireAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'You must be logged in.' });
    }
    if (!req.session.isAdmin) {
        return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }
    next();
};

module.exports = requireAdmin;
