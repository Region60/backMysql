const dataBase = require('./dataBase')
const {configApp} = require('../../configApp/configApp')



async function findUser(userEmail) {
    return await dataBase.dataBaseSearch(configApp.dataBaseConfig.tables.users.nameTables, 'UserEmail', userEmail)
}

async function createUser(firstName, userEmail, userPassword) {
    let string = `users (UserEmail, UserPassword, FirstName)values('${userEmail}','${userPassword}','${firstName}')`
   return await dataBase.addItemForTable(string)

}

module.exports.findUser = findUser
module.exports.createUser = createUser
