const nameTable = 'users'

async function findUser(userEmail) {
    function requestFindUser() {
        try {
            return createPoolMysql.promise().query(`SELECT * FROM users WHERE UserEmail = '${userEmail}'`)
        } catch (e) {
            console.error(e.message.bgRed.black)
        }
    }
    let response = await requestFindUser()
    return response[0][0]
}

async function createUser(firstName, userEmail, userPassword) {
    function requestCreateUser() {
        try {
            return createPoolMysql.promise().query(
                `INSERT INTO users (UserEmail, UserPassword, FirstName)values('${userEmail}','${userPassword}','${firstName}')`)
        } catch (e) {
            console.error(`Ошибка при регистрации пользователя: ${userEmail}. ${e.message.bgRed.black}`)
        }
    }

    let response = await requestCreateUser()
    return response[0]
}