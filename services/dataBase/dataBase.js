const mysql = require('mysql2')
const colors = require('colors')
const { configApp } = require('../../configApp/configApp')


const createPoolMysql = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: configApp.dataBaseConfig.password,
    database: configApp.dataBaseConfig.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


function createDataBase(nameDataBase) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: configApp.dataBaseConfig.password,
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
    /*dataBaseConfig.tables.forEach((i) => {
        createTable(i.query, i.name, dataBaseConfig.name)
    })*/
    for (key in configApp.dataBaseConfig.tables) {
        createTable(configApp.dataBaseConfig.tables[key].queryCreatTable, configApp.dataBaseConfig.tables[key].name, configApp.dataBaseConfig.name)
    }
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

async function dataBaseSearch(table, column, value) {
    function requestFindUser() {
        try {
            return createPoolMysql.promise().query(`SELECT * FROM ${table} WHERE ${column} = '${value}'`)
        } catch (e) {
            console.error(e.message.bgRed.black)
        }
    }

    let response = await requestFindUser()
    return response[0][0]
}

async function addItemForTable(partQuery) {
    function requestAddItem() {
        try {
            return createPoolMysql.promise().query(
                `INSERT INTO ${partQuery}`)
        } catch (e) {
            console.error(`Ошибка при добавлении в таблицу: ${e.message.bgRed.black}`)
        }
    }

    let response = await requestAddItem()
    return response[0]
}

 function deleteItemForTable(idItem,column,table) {
    function requestDeleteItem() {
        try {
 createPoolMysql.query(
    `DELETE FROM ${table} WHERE ${column}='${idItem}';`
)
        } catch (e) {
            console.error()
        }
    }
}


module.exports.createDataBase = createDataBase
module.exports.dataBaseSearch = dataBaseSearch
module.exports.createTable = createTable
module.exports.addItemForTable = addItemForTable
module.exports.deleteItemForTable = deleteItemForTable