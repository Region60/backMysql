const dataBase = require('./dataBase')
const { configApp } = require('../../configApp/configApp')



export async function findUser(userEmail:string) {
    let arrUsersEmail = [userEmail]
    let result = await dataBase.dataBaseSearch(configApp.dataBaseConfig.tables.users.nameTables, 'UserEmail', arrUsersEmail)
    if (result.length > 0) {
        return result[0]
    } else {
        return result
    }
}

export async function createUser(firstName:string, userEmail:string, userPassword:string) {
    let string = `users (UserEmail, UserPassword, FirstName)values('${userEmail}','${userPassword}','${firstName}')`
    return await dataBase.addItemForTable(string)

}

