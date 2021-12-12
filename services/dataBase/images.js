const dataBase = require('./dataBase')

async function findImage(filename) {
    return await dataBase.dataBaseSearch(dataBase.dataBaseConfig.tables.images.name, 'FileName', filename)

}

async function addImage( path, filename) {
  let string = `images (Path, FileName)values('${path}','${filename}')`
    return await dataBase.addItemForTable(string)

}

module.exports.findImage = findImage
module.exports.addImage = addImage