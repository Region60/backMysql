const {dataBaseConfig} = require('./dataBase')
const {dataBaseSearch} = require('./dataBase')

async function findUser(userEmail) {
    return dataBaseSearch(dataBaseConfig.tables.users.name, 'UserEmail', userEmail)
}




module.exports.findUser = findUser
