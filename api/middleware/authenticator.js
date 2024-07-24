const jwt = require("jsonwebtoken")

function authenticator(req, res, next) {
    const token = req.headers["authorisation"]

    if(token){
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, data) => {
            if(err){
                res.status(403).json({ err: err + 'Invalid token'})
            } else {
                req["user_id"] = data.user_id
                next()
            }
        })
    }else {
        res.status(403).json({ err: 'Missing token'})
    }
}

module.exports = authenticator