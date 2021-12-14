const configApp = {
    dataBaseConfig:{
        name: 'appdb',
        password: 'qwertyui',
        tables: {
            users: {
                name: 'users',
                queryCreatTable: 'Id int primary key auto_increment,UserEmail varchar(60),UserPassword varchar(100),FirstName varchar(20),LevelOfAccess varchar(20)'
            },
            images: {
                name: 'images',
                queryCreatTable: 'Id int primary key auto_increment, Path varchar(50), FileName varchar(50)'
            }
        }
    },
    dirSaveImages: '/uploads'
}



 

module.exports.configApp = configApp
