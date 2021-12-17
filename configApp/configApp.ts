const configApp = {
    dataBaseConfig: {
        nameDataBase: 'appdb',
        password: 'qwertyui',
        tables: {
            users: {
                nameTables: 'users',
                columns: [
                    {nameColumn: 'Id',type: 'number'},
                    {nameColumn: 'UserEmail',type: 'string'},
                    {nameColumn: 'UserPassword',type: 'string'},
                    {nameColumn: 'FirstName',type: 'string'},
                ],
                queryCreatTable: 'Id int primary key auto_increment,UserEmail varchar(60),UserPassword varchar(100),FirstName varchar(20),LevelOfAccess varchar(20)'
            },
            images: {
                nameTables: 'images',
                columns: [
                    {nameColumn: 'Id',type: 'number'},
                    {nameColumn: 'Path',type: 'string'},
                    {nameColumn: 'FileName',type: 'string'},
                ],
                queryCreatTable: 'Id int primary key auto_increment, Path varchar(50), FileName varchar(50)'
            }
        }
    },
    dirSaveImages: 'uploads/'
}


module.exports.configApp = configApp
