const requireAdmin = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({ error: "User is not authenticated" })
    }
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: "Admin privileges required" })
    }
    next()
}

module.exports = requireAdmin;
