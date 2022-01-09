if (process.env.NODE_ENV === 'development') {
    module.exports = require('./keys.prod')
} else {
    module.exports = require('./keys.dev')
}    