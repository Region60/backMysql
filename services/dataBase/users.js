const dataBase = require('./dataBase')


async function findUser(userEmail) {
    return await dataBase.dataBaseSearch(dataBase.dataBaseConfig.tables.users.name, 'UserEmail', userEmail)
}

async function createUser(firstName, userEmail, userPassword) {
    let string = `users (UserEmail, UserPassword, FirstName)values('${userEmail}','${userPassword}','${firstName}')`
   return await dataBase.addItemForTable(string)

}

module.exports.findUser = findUser
module.exports.createUser = createUser
