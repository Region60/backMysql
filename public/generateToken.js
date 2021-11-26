const jwt = require('jsonwebtoken')
const key =require('../keys/index')

function generateToken(user) {
    let u = {
        name: user.FirstName,
        email: user.UserEmail,
        _id: user.Id
    }
    console.log(u)
    return token = jwt.sign(u, key.JWT_SECRET,{
        expiresIn: 60*60*24
    })
}

module.exports = generateToken