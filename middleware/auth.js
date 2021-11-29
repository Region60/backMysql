const generateToken = require('../public/generateToken')

const key = require('../keys/index')
const jwt = require('jsonwebtoken')


function switches(error, response) {
console.log(response)
    switch (error.name) {
        case  'TokenExpiredError':
            console.log('TokenExpiredError')
            return response.status(401).json({
                success: false,
                message: "jwt expired",
            })
        case 'JsonWebTokenError':
            console.log('JsonWebTokenError')
            return response.status(401).json({
                success: false,
                message: error.message,
            })
        case 'NotBeforeError':
            console.log('NotBeforeError')
            return response.status(401).json({
                success: false,
                message: error.message,
            })
    }


}

function auth(req, res, next) {
    try {
        let tokens = req.headers['authorization'].split(',')
        console.log(typeof tokens)
        let accessToken = tokens[0]
        let payload

        if (!tokens) {
            return res.send('отсутствует токен утентификации')
        }
        if (tokens.length === 1) {
            jwt.verify(accessToken, key.JWT_SECRET, function (err, decoded) {
                payload = decoded
                console.log(payload)
                if (err) {
                    switches(err, res)
                    return res.status(401)
                } else {
                    next()
                }
            })
        } else {
            console.log('2  token')
            let refreshToken = tokens[1]
            jwt.verify(accessToken, key.JWT_SECRET, function (err, decoded) {
                if (err) {
                    switches(err, res)
                    return res.status(401)
                }else {
                    jwt.verify(refreshToken, tokens[0].slice(-10), function (err, decoded) {
                        if (err) {
                            switches(err, res)
                            return res.status(401)
                        }else{
                            return res.status(307).json({
                                tokens: [
                                    generateToken.generateAccessToken(),
                                    generateToken.generateRefreshToken()
                                ]
                            })
                        }
                    })
                }
            })


        }
    } catch (e) {
        console.log(e)
    }

}


module.exports = auth