let mysql = require('mysql2')
const colors = require('colors')

//вынести dataBaseConfig в key
const dataBaseConfig = {
    name: 'appdb',
    password: 'qwertyui',
    tables: [
        {
            name: 'users',
            query: 'Id int primary key auto_increment,UserEmail varchar(60),UserPassword varchar(100),FirstName varchar(20),LevelOfAccess varchar(20)'
        },
        {
            name: 'images',
            query: 'Id int primary key auto_increment, Path varchar(50), FileName varchar(50)'
        }
    ]
}



const createPoolMysql = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: dataBaseConfig.password,
    database:dataBaseConfig.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


function createDataBase(nameDataBase) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: dataBaseConfig.password,
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
                if (results.find((i) => i.Database === nameDataBase)) {
                    console.log(`База данных ${nameDataBase} уже создана`.green)
                } else {
                    connection.promise().query(`CREATE DATABASE ${nameDataBase}`)
                        .then(() => {
                            console.log(`База данных ${nameDataBase} создана`.green);
                        })
                        .catch(console.log)
                        .then(() => connection.end())
                }
            }
        })
    dataBaseConfig.tables.forEach((i) => {
        createTable(i.query, i.name, dataBaseConfig.name)
    })
}

function createTable(queryMysql, nameTable, nameDataBase) {
    createPoolMysql.query(`SHOW TABLES FROM ${nameDataBase} LIKE '${nameTable}';`,
        function (err, results) {
            if (err) {
                return console.error(`Ошибка при провеке таблицы ${nameTable}. ${err}`.bgRed.black)
            } else {
                if (results.find((i) => i[`Tables_in_${nameDataBase} (${nameTable})`] === nameTable)) {
                    console.log(`таблица ${nameTable} уже существует`.green)
                } else {
                    createPoolMysql.query(`CREATE TABLE ${nameTable} (${queryMysql});`,
                        function (err) {
                            if (err) {
                                return console.error(`Ошибка создания таблицы: ${nameTable}. ${err}`.bgRed.black)
                            } else {
                                console.log(`таблица '${nameTable}' создана`.green)
                            }
                        })
                }
            }
        })
}

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


module.exports.createDataBase = createDataBase
module.exports.createUser = createUser
module.exports.findUser = findUser
module.exports.createTable = createTable
module.exports.dataBaseConfig = dataBaseConfig