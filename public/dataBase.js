let mysql = require('mysql2')
let NAME_DB = 'appdb'
let NAME_TABLE = 'users'
const colors = require('colors')



const connectionMysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "qwerty"
})

function connectDataBase() {
    connectionMysql.connect(function (err) {
        if (err) {
            return console.error("Ошибка: " + err.message)
        } else {
            console.log("Подключение к серверу MySQL установаленно".green)
        }
    })
}

function createDataBase() {
    connectionMysql.query('SHOW DATABASES;',
        function (err, results, fields) {
            if (err) {
                return console.error('Ошибка при чтении списка баз данных' + err)
            } else {
                if (results.find((i) => i.Database === NAME_DB)) {
                    console.log(`База данных ${NAME_DB} уже создана`.green)
                } else {
                    connectionMysql.query(`CREATE DATABASE ${NAME_DB}`,
                        function (err) {
                            if (err) {
                                return console.error('Ошибка при создании базы данных: ${NAME_DB} ' + err)
                            } else {
                                console.log(`База данных ${NAME_DB} создана`.green)
                            }
                        })
                }
                connectionMysql.query(`USE ${NAME_DB}`,
                    function (err) {
                        if (err) {
                            return console.error('Ошибка при подключении базы данных: ' + err)
                        } else {
                            console.log(`База данных ${NAME_DB} подключена`.green)
                        }
                    })
                connectionMysql.query(`SHOW TABLES FROM ${NAME_DB} LIKE '${NAME_TABLE}';`,
                    function (err, results) {
                        if (err) {
                            return console.error(`Ошибка при провеке таблицы '${NAME_TABLE}': ` + err)
                        } else {
                            if (results.find((i) => i[`Tables_in_appdb (${NAME_TABLE})` === NAME_TABLE])) {
                                console.log(`таблица ${NAME_TABLE} уже существует`.green)
                            } else {
                                connectionMysql.query(`CREATE TABLE ${NAME_TABLE} (Id int primary key auto_increment,UserEmail varchar(20),UserPassword varchar(20),FirstName varchar(20));`,
                                    function (err) {
                                        if (err) {
                                            return console.error(`Ошибка создания таблицы: '${NAME_TABLE}' ` + err)
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

function createUser(UserEmail, UserPassword, FirstName) {
    connectionMysql.query(`INSERT INTO users (UserEmail, UserPassword, FirstName)values(${UserEmail},${UserPassword},${FirstName})`,
        function (err) {
            if (err) {
                return console.error('Ошибка при регистрации пользователя: ' + err)
            } else {
                console.log(`пользователь создан`)
            }
        })
}


module.exports.connectDataBase = connectDataBase
module.exports.createDataBase = createDataBase
//module.exports.createUser = createUser