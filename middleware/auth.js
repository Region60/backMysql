const key = require('../keys/index')
const jwt = require('jsonwebtoken')


function auth(req, res, next) {
    let token = req.headers['authorization']
    if (!token) {
        return res.send('где токен')
    }
    token = token.replace('Bearer ', '')

    jwt.verify(token, key.JWT_SECRET, function (err, decoded) {
        console.log(decoded)
        if (err) {
            return res.status(401).json({
                success: false,
                message: "выполните вход"
            })
        } else {
            next()
        }
    })
}

module.exports = auth