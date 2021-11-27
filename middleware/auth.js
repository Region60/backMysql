const key = require('../keys/index')
const jwt = require('jsonwebtoken')


function auth(req, res, next) {
    let token = req.headers['authorization']
    if (!token) {
        return res.send('отсутствует токен утентификации')
    }
    token = token.replace('Bearer ', '')

    jwt.verify(token, key.JWT_SECRET, function (err, decoded) {
        console.log(decoded)
        if (err) {
            switch (err.name) {
                case  'TokenExpiredError':
                    return  res.status(401).json({
                        success: false,
                        message: "jwt expired",
                    })
                case 'JsonWebTokenError':
                    return  res.status(401).json({
                        success: false,
                        message: err.message,
                    })
                case 'NotBeforeError':
                    return  res.status(401).json({
                        success: false,
                        message: err.message,
                    })
            }
            return res.status(401)
        } else {
            next()
        }
    })
}



module.exports = auth