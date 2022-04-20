const mysql = require('mysql2')
const { configApp } = require('../../configApp/configApp')


const createPoolMysql = mysql.createPool({
    host: '172.17.0.2',
    user: 'root',

    password: configApp.dataBaseConfig.password,
    database: configApp.dataBaseConfig.nameDataBase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


export function createDataBase(nameDataBase: string) {
    const connection = mysql.createConnection({

        host: '172.17.0.2',

        user: 'root',
        password: configApp.dataBaseConfig.password,
    });
    connection.connect(function (err: any) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.info('connected as id ' + connection.threadId);
    });

    connection.query('SHOW DATABASES;',
        function (err: any, results: any, fields: any) {
            if (err) {
                return console.error(`Ошибка при чтении списка баз данных. ${err}`)
            } else {
                if (results.find((i: any) => i.Database === nameDataBase)) {
                    console.info('\x1b[34m%s\x1b[0m', `База данных ${nameDataBase} уже существует`)
                } else {
                    connection.promise().query(`CREATE DATABASE ${nameDataBase}`)
                        .then(() => {
                            console.info('\x1b[34m%s\x1b[0m', `База данных ${nameDataBase} создана`);
                        })
                        .then(() => connection.end())
                }
            }
        })
    for (let key in configApp.dataBaseConfig.tables) {
        createTable(configApp.dataBaseConfig.tables[key].queryCreatTable, configApp.dataBaseConfig.tables[key].nameTables, configApp.dataBaseConfig.nameDataBase)
    }
}

export function createTable(queryMysql: string, nameTable: string, nameDataBase: string) {
    createPoolMysql.query(`SHOW TABLES FROM ${nameDataBase} LIKE '${nameTable}';`,
        function (err: any, results: any) {
            if (err) {
                return console.error(`Ошибка при провеке таблицы ${nameTable}. ${err}`)
            } else {
                if (results.find((i: any) => i[`Tables_in_${nameDataBase} (${nameTable})`] === nameTable)) {
                    console.info('\x1b[34m%s\x1b[0m', `таблица ${nameTable} уже существует`)
                } else {
                    createPoolMysql.query(`CREATE TABLE ${nameTable} (${queryMysql});`,
                        function (err: any) {
                            if (err) {
                                return console.error(`Ошибка создания таблицы: ${nameTable}. ${err}`)
                            } else {
                                console.info('\x1b[34m%s\x1b[0m', `таблица '${nameTable}' создана`)
                            }
                        })
                }
            }
        })
}

export async function dataBaseSearch(table: string, column: string, value: Array<string>) {
    let arrRequests = value.map((element) => {
        return "'" + element + "'"
    });
    let stringForSearch: string = arrRequests.join(",")
    function requestFindUser() {
        try {
            return createPoolMysql.promise().query(`SELECT * FROM ${table} WHERE ${column} IN (${stringForSearch})`)
        } catch (e: any) {
            console.error(e.message)
        }
    }
    let foundItem = await requestFindUser()
    return foundItem[0]

}

export async function addItemForTable(partQuery: string) {
    function requestAddItem() {
        try {
            return createPoolMysql.promise().query(
                `INSERT INTO ${partQuery}`)
        } catch (e: any) {
            console.error(`Ошибка при добавлении в таблицу: ${e.message}`)
        }
    }
    let response = await requestAddItem()
    return response[0]
}

export function deleteItemForTable(idItem: string, column: string, table: string) {
    try {
        createPoolMysql.query(
            `DELETE FROM ${table} WHERE ${column}='${idItem}';`
        )
    } catch (e) {
        console.error(e)
    }
}


