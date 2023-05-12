const jwt = require('jsonwebtoken')

function userAuthenticate(req, res, next) {
    const token = req.headers['x-access-token'] || req.body.headers['x-access-token']

    if (!token) {
        return res.status(401).send('No token provided')
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        req.name = decoded.name
        next()
    } catch (error) {
        return res.status(401).send('Authentication failed')
    }
}

module.exports = userAuthenticate;