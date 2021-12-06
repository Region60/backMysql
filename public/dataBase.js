let mysql = require('mysql2')
const key = require('../keys/index')
const NAME_TABLE = 'users'
const colors = require('colors')

const dataBaseConfig = {
    name: 'appdb',
    password: 'qwqerty',
    tables: [
        {
        name: 'users',
        query: 'Id int primary key auto_increment,UserEmail varchar(60),UserPassword varchar(100),FirstName varchar(20),LevelOfAccess varchar(20)'
    },
        {
            name: 'images',
            query: 'Id int primary key auto_increment, Path varchar(50), FileName(50)'
        }
    ]

}

[{name:'NAME',
primaryKey:true
}]

function createComandQuery (objWidh) {


}

const createPoolMysql = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: key.database.PASSWORD,
    database: key.database.NAME_DATABASE,
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
                if (results.find((i) => i.Database === key.database.NAME_DATABASE)) {
                    console.log(`База данных ${key.NAME_DATABASE} уже создана`.green)
                } else {
                    connection.promise().query(`CREATE DATABASE ${key.database.NAME_DATABASE}`)
                        .then(() => {
                            console.log(`База данных ${key.database.NAME_DATABASE} создана`.green);
                        })
                        .catch(console.log)
                        .then(() => connection.end())
                }
            }
        })
dataBaseConfig.tables.forEach((i)=>{
    createTable(i.query,i.name,dataBaseConfig.name)
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
    function requestFindUser(email) {
        try {
            return createPoolMysql.promise().query(`SELECT * FROM ${NAME_TABLE} WHERE UserEmail = '${email}'`)
        } catch (e) {
            console.error(e.message.bgRed.black)
        }
    }

    let response = await requestFindUser(userEmail)
    return response[0][0]

}


async function createUser(firstName, userEmail, userPassword) {
    function requestCreateUser(name, email, password) {
        try {
            return createPoolMysql.promise().query(
                `INSERT INTO users (UserEmail, UserPassword, FirstName)values('${email}','${password}','${name}')`)
        } catch (e) {
            console.error(`Ошибка при регистрации пользователя: ${email}. ${e.message.bgRed.black}`)
        }
    }

    let response = await requestCreateUser(firstName, userEmail, userPassword)
    return response[0]
}


module.exports.createDataBase = createDataBase
module.exports.createUser = createUser
module.exports.findUser = findUser
module.exports.createTable = createTable