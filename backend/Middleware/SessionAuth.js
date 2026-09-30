const  sessionAuth = async(req, res, next) =>{
    if(!req.session.isAuthenticated){
        return res.status(401).json({
            error:"User is not authenticated"
        })
    }
    next()
}

module.exports = sessionAuth;

