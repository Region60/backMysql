const generateToken = require('../public/generateToken')

const key = require('../keys/index')
const jwt = require('jsonwebtoken')


function switches(error, response) {
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
        let accessToken = tokens[0]

        if (!tokens) {
            return res.send('отсутствует токен утентификации')
        }
        if (tokens.length === 1) {
            jwt.verify(accessToken, key.JWT_SECRET, function (err, decoded) {
                console.log(payload)
                if (err) {
                    switches(err, res)
                    return res.status(401)
                } else {
                    next()
                }
            })
        } else {
            console.log('>>>>>>>>>>>2  token')
            let refreshToken = tokens[1]
            let payload
            jwt.verify(accessToken, key.JWT_SECRET, function (err, decoded) {
                payload = decoded
                if (err) {
                    switches(err, res)
                    return res.status(401)
                }else {
                    jwt.verify(refreshToken, accessToken.slice(-10), function (err, decoded) {
                        if (err) {
                            switches(err, res)
                            return res.status(401)
                        }else{
                            let newAccesToken = generateToken.generateAccessToken(payload)
                            let newRefreshToken =generateToken.generateRefreshToken(newAccesToken.slice(-10))
                            return res.status(307).json({
                                tokens: [
                                    newAccesToken,
                                    newRefreshToken
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