const dataBase = require('./dataBase')
const { configApp } = require('../../configApp/configApp')



async function findUser(userEmail) {
    let arrUsersEmail = [userEmail]
    let result = await dataBase.dataBaseSearch(configApp.dataBaseConfig.tables.users.nameTables, 'UserEmail', arrUsersEmail)
    if (result.length > 0) {
        return result[0]
    } else {
        return result
    }
}

async function createUser(firstName, userEmail, userPassword) {
    let string = `users (UserEmail, UserPassword, FirstName)values('${userEmail}','${userPassword}','${firstName}')`
    return await dataBase.addItemForTable(string)

}

module.exports.findUser = findUser
module.exports.createUser = createUser
