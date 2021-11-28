let mysql = require('mysql2')
const key = require('../keys/index')
const NAME_TABLE = 'users'
const colors = require('colors')


const createPoolMysql = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: key.NAME_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


function createDataBase() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'qwerty',
    });
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
    });

    connection.query('SHOW DATABASES;',
        function (err, results, fields) {
            if (err) {
                return console.error(`Ошибка при чтении списка баз данных. ${err}`.bgRed.black)
            } else {
                if (results.find((i) => i.Database === key.NAME_DATABASE)) {
                    console.log(`База данных ${key.NAME_DATABASE} уже создана`.green)
                } else {
                    connection.promise().query(`CREATE DATABASE ${key.NAME_DATABASE}`)
                        .then(() => {
                            console.log(`База данных ${key.NAME_DATABASE} создана`.green);
                        })
                        .catch(console.log)
                        .then(() => connection.end())
                }
            }
        })
}

function createTable() {
    createPoolMysql.query(`SHOW TABLES FROM ${key.NAME_DATABASE} LIKE '${NAME_TABLE}';`,
        function (err, results) {
            if (err) {
                return console.error(`Ошибка при провеке таблицы ${NAME_TABLE}. ${err}`.bgRed.black)
            } else {
                if (results.find((i) => i[`Tables_in_appdb (${NAME_TABLE})`] === NAME_TABLE)) {
                    console.log(`таблица ${NAME_TABLE} уже существует`.green)
                } else {
                    createPoolMysql.query(`CREATE TABLE ${NAME_TABLE} (Id int primary key auto_increment,UserEmail varchar(60),UserPassword varchar(100),FirstName varchar(20),LevelOfAccess varchar(20));`,
                        function (err) {
                            if (err) {
                                return console.error(`Ошибка создания таблицы: ${NAME_TABLE}. ${err}`.bgRed.black)
                            } else {
                                console.log(`таблица '${NAME_TABLE}' создана`.green)
                            }
                        })
                }
            }
        })
}

async function findUser(userEmail) {
    function requestFindUser(email) {
        try {
            return createPoolMysql.promise().query(`SELECT * FROM ${NAME_TABLE} WHERE UserEmail = '${email}'`)
        } catch (e) {
            console.log(e.message.bgRed.black)
        }
    }

    let response = await requestFindUser(userEmail)
    return response[0][0]

}


function createUser(firstName, userEmail, userPassword) {
    createPoolMysql.query(
        `INSERT INTO users (UserEmail, UserPassword, FirstName)values('${userEmail}','${userPassword}','${firstName}')`,
        function (err) {
            if (err) {
                return console.error(`Ошибка при регистрации пользователя: ${userEmail}. ${err}`.bgRed.black)
            } else {
                console.log(`пользователь создан `.green)
            }
        })
}


module.exports.createDataBase = createDataBase
module.exports.createUser = createUser
module.exports.findUser = findUser
module.exports.createTable = createTable