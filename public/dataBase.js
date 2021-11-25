let mysql = require('mysql2')
let NAME_DB = 'appdb'
let NAME_TABLE = 'users'
const colors = require('colors')


const createPoolMysql = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: NAME_DB,
    waitForConnections: true,
    connectionLimit:10,
    queueLimit: 0
})



function createDataBase() {
    createPoolMysql.query('SHOW DATABASES;',
        function (err, results, fields) {
            if (err) {
                return console.error('Ошибка при чтении списка баз данных.'.bgRed + err)
            } else {
                if (results.find((i) => i.Database === NAME_DB)) {
                    console.log(`База данных ${NAME_DB} уже создана`.green)
                } else {
                    createPoolMysql.query(`CREATE DATABASE ${NAME_DB}`,
                        function (err) {
                            if (err) {
                                return console.error('Ошибка при создании базы данных: ${NAME_DB} '.bgRed + err)
                            } else {
                                console.log(`База данных ${NAME_DB} создана`.green)
                            }
                        })
                }
                createPoolMysql.query(`USE ${NAME_DB}`,
                    function (err) {
                        if (err) {
                            return console.error('Ошибка при подключении базы данных.'.red + err)
                        } else {
                            console.log(`База данных ${NAME_DB} подключена`.green)
                        }
                    })
                createPoolMysql.query(`SHOW TABLES FROM ${NAME_DB} LIKE '${NAME_TABLE}';`,
                    function (err, results) {
                        if (err) {
                            return console.error(`Ошибка при провеке таблицы ${NAME_TABLE}.`.bgRed + err)
                        } else {
                            if (results.find((i) => i[`Tables_in_appdb (${NAME_TABLE})` === NAME_TABLE])) {
                                console.log(`таблица ${NAME_TABLE} уже существует`.green)
                            } else {
                                createPoolMysql.query(`CREATE TABLE ${NAME_TABLE} (Id int primary key auto_increment,UserEmail varchar(20),UserPassword varchar(20),FirstName varchar(20));`,
                                    function (err) {
                                        if (err) {
                                            return console.error(`Ошибка создания таблицы: ${NAME_TABLE}.`.bgRed + err)
                                        } else {
                                            console.log(`таблица '${NAME_TABLE}' создана`.green)
                                        }
                                    })
                            }

                        }
                    })
            }
        })
}

 function findUser(userEmail) {
    try {
        return  createPoolMysql.promise().query(`SELECT * FROM ${NAME_TABLE} WHERE UserEmail = '${userEmail}'`)

    }catch(e){
        console.log(e.message.bgRed)
    }
}


function createUser(UserEmail, UserPassword, FirstName) {
    createPoolMysql.query(`INSERT INTO users (UserEmail, UserPassword, FirstName)values('${UserEmail}','${UserPassword}','${FirstName}')`,
        function (err) {
            if (err) {
                return console.error(`Ошибка при регистрации пользователя: ${UserEmail}.`.bgRed + err)
            } else {
                console.log(`пользователь создан `.green)
            }
        })
}


module.exports.createDataBase = createDataBase
module.exports.createUser = createUser
module.exports.findUser = findUser