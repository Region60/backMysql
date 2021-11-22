let mysql = require('mysql2')


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
            console.log("Подключение к серверу MySQL установаленно")
        }
    })
}

function createDataBase() {
    connectionMysql.query('SHOW DATABASES;',
        function (err, results, fields) {
            if (err) {
                return console.error('Ошибка при чтении списка баз данных' + err)
            } else {
                let NAME_DB = 'appdb'
                if (results.find((i) => i.Database === NAME_DB)) {
                    console.log(`База данных ${NAME_DB} уже создана`)
                } else {
                    connectionMysql.query(`CREATE DATABASE ${NAME_DB}`,
                        function (err) {
                            if (err) {
                                return console.error('Ошибка при создании базы данных' + err)
                            } else {
                                console.log(`База данных ${NAME_DB} создана`)
                            }
                        })
                }
                connectionMysql.query(`USE ${NAME_DB}`,
                    function (err) {
                        if (err) {
                            return console.error('Ошибка при подключении базы данных ' + err)
                        } else {
                            console.log(`База данных ${NAME_DB} подключена`)
                        }
                    })
                connectionMysql.query(`SHOW TABLES FROM ${NAME_DB} LIKE 'users';`,
                    function(err,results) {
                        if (err) {
                            return console.error('Ошибка при провеке таблицы ' + err)
                        } else {
                            console.log(results[0])
                        }
                    })

                connectionMysql.query('CREATE TABLE users (Id int primary key auto_increment,UserEmail varchar(20),UserPassword varchar(20),FirstName varchar(20));',
                    function (err) {
                        if (err) {
                            return console.error('Ошибка создания таблицы users ' + err)
                        } else {
                            console.log('таблица users создана')
                        }
                    })

            }
        })

}

function createUser(UserEmail, UserPassword,FirstName) {
    connectionMysql.query(`INSERT INTO users (UserEmail, UserPassword, FirstName)values(${UserEmail},${UserPassword},${FirstName})`,
        function (err) {
            if (err) {
                return console.error('Ошибка при регистрации пользователя>>' + err)
            } else {
                console.log(`пользователь создан`)
            }

        })
}


module.exports.connectDataBase = connectDataBase
module.exports.createDataBase = createDataBase
//module.exports.createUser = createUser