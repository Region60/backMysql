import * as generateToken from "../public/generateToken";

const key = require('../keys/index')
const jwt = require('jsonwebtoken')


function switches (error) {
    switch (error.name) {
        case  'TokenExpiredError':
            return  error.status(401).json({
                success: false,
                message: "jwt expired",
            })
        case 'JsonWebTokenError':
            return  error.status(401).json({
                success: false,
                message: err.message,
            })
        case 'NotBeforeError':
            return  error.status(401).json({
                success: false,
                message: error.message,
            })
    }


}

function auth(req, res, next) {
    let tokens = req.headers['authorization']
    let accessToken = tokens[0]

    if (!tokens) {
        return res.send('отсутствует токен утентификации')
    }
    if (tokens.length ===1){

        jwt.verify(accessToken, key.JWT_SECRET, function (err, decoded) {
            if (err) {
                switches(err)
                return res.status(401)
            } else {
                next()
            }
        })
    }
    let refreshToken = tokens[1]
    jwt.verify(accessToken, key.JWT_SECRET, function (err, decoded) {
        if (err) {
            switches(err)
            return res.status(401)
        }
    })
    jwt.verify(refreshToken, tokens[0].slice(-10), function (err, decoded) {
        if (err) {
            switches(err)
            return res.status(401)
        }
    })
return res.status(307).json({
    tokens:[
        generateToken.generateAccessToken(),
        generateToken.generateRefreshToken()
    ]
})

}


module.exports = auth