let mysql = require('mysql2')


const connectionMysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "qwerty"
})
function connectDataBase (){
    connectionMysql.connect(function (err) {
        if (err) {
            return console.error("Ошибка: " + err.message)
        } else {
            console.log("Подключение к серверу MySQL установаленно")
        }
    })
}
function createDataBase (){
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
                    connectionMysql.query(`USE ${NAME_DB}`,
                        function (err) {
                            if (err) {
                                return console.error('Ошибка при подключении базы данных' + err)
                            } else {
                                console.log(`База данных ${NAME_DB} подключена`)
                            }
                        })
                }
            }
        })

}
/*function createUser () {
    connectionMysql.query('INSERT INTO users (log)values("fdfd")',
        function (err) {
            if (err) {
                return console.error('Ошибка при регистрации пользователя>>' + err)
            } else {
                console.log(`пользователь создан`)
            }

        })}*/


module.exports.connectDataBase = connectDataBase
module.exports.createDataBase = createDataBase
//module.exports.createUser = createUser