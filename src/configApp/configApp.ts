interface IconfigApp {
    dataBaseConfig: IdataBaseConfig
    dirSaveImages: string
}

interface IdataBaseConfig {
    nameDataBase: string
    password: string
    tables: Itables
}

interface Itables {
    users: Itable
    images: Itable
}

interface Itable {
    nameTables: string
    columns:Array<Icolumn>
    queryCreatTable: string
}

interface Icolumn {
    nameColumn: string
    type: string
}

export const configApp: IconfigApp = {
    dataBaseConfig: {

        //nameDataBase: 'appdb',
        nameDataBase: 'dockertest',
        //password: 'cjkzhbc86VFRCBV!',
        password: 'qwertyui',
       
        tables: {
            users: {
                nameTables: 'users',
                columns: [
                    { nameColumn: 'Id', type: 'number' },
                    { nameColumn: 'UserEmail', type: 'string' },
                    { nameColumn: 'UserPassword', type: 'string' },
                    { nameColumn: 'FirstName', type: 'string' },
                ],
                queryCreatTable: 'Id int primary key auto_increment,UserEmail varchar(60),UserPassword varchar(100),FirstName varchar(20),LevelOfAccess varchar(20)'
            },
            images: {
                nameTables: 'images',
                columns: [
                    { nameColumn: 'Id', type: 'number' },
                    { nameColumn: 'Path', type: 'string' },
                    { nameColumn: 'FileName', type: 'string' },
                ],
                queryCreatTable: 'Id int primary key auto_increment, Path varchar(50), FileName varchar(50)'
            }
        }
    },
    dirSaveImages: 'uploads/'
};

