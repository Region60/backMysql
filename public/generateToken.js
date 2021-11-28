const jwt = require('jsonwebtoken')
const key =require('../keys/index')

function generateAccessToken(user) {
    let u = {
        name: user.FirstName,
        email: user.UserEmail,
        _id: user.Id
    }
    return   jwt.sign(u, key.JWT_SECRET,{
        expiresIn: '1m'
    })
}

function generateRefreshToken(token) {

    return  jwt.sign(token.slice(-10), key.JWT_SECRET,{
        expiresIn: '12w'
    })
}


module.exports.generateAccessToken = generateAccessToken
module.exports.generateRefreshToken = generateRefreshToken