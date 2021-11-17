const jwt = require('jsonwebtoken')
const key =require('../keys/index')

function generateToken(user) {
    let u = {
        name: user.name,
        email: user.email,
        _id: user._id
    }
    console.log(u)
    return token = jwt.sign(u, key.JWT_SECRET,{
        expiresIn: 60*60*24
    })
}

module.exports = generateToken