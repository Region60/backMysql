const nameTable = 'images'
async function findImage(originalname) {
    function requestFindUser() {
        try {
            return createPoolMysql.promise().query(`SELECT * FROM users WHERE UserEmail = '${originalname}'`)
        } catch (e) {
            console.error(e.message.bgRed.black)
        }
    }
    let response = await requestFindUser()
    return response[0][0]
}

async function addImage(originalname, path, filename) {
    function requestCreateUser() {
        try {
            return createPoolMysql.promise().query(
                `INSERT INTO users (UserEmail, UserPassword, FirstName)values('${originalname}','${path}','${filename}')`)
        } catch (e) {
            console.error(`Ошибка при регистрации пользователя: ${originalname}. ${e.message.bgRed.black}`)
        }
    }

    let response = await requestCreateUser()
    return response[0]
}