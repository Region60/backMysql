import { NextFunction, Request, Response } from "express"

const generateToken = require('../../src/public/generateToken')
 
const key = require('../keys/index')
const jwt = require('jsonwebtoken')


function switches(error:any, response: Response) {
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

function auth(req: Request, res: Response, next:NextFunction) {
    try {
        let tokens: Array<string> = req.headers['authorization'].split(',')
        let accessToken = tokens[0]

        if (!tokens) {
            return res.send('отсутствует токен утентификации')
        }
        if (tokens.length === 1) {
            jwt.verify(accessToken, key.JWT_SECRET, function (err: Errorr, decoded) {
                if (err) {
                    switches(err, res)
                } else {
                    next()
                }
            })
        } else {
            let refreshToken = tokens[1]
            let payload

            let {name, email, _id} = jwt.decode(accessToken)
            payload = {
                name: name,
                email: email,
                _id: _id
            }
            jwt.verify(refreshToken, key.JWT_SECRET, function (err, decoded) {
                if (err) {
                    console.log(err)
                    switches(err, res)
                } else {
                    let newAccessToken = generateToken.generateAccessToken(payload)
                    let newRefreshToken = generateToken.generateRefreshToken(newAccessToken.slice(-10))
                    return res.status(307).json({
                        tokens: [
                            newAccessToken,
                            newRefreshToken
                        ]
                    })
                }
            })
        }
    } catch (e) {
        console.log(e)
    }
}


module.exports = auth