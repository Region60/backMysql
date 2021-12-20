const dataBase = require('./dataBase')
const { configApp } = require('../../configApp/configApp.ts')


async function findImage(filename) {
  return await dataBase.dataBaseSearch(configApp.dataBaseConfig.tables.images.nameTables, 'FileName', filename)
}

async function addImage(path, filename) {
  let string = `images (Path, FileName)values('${path}','${filename}')`
  return await dataBase.addItemForTable(string)
}

function deleteImage(ImageName) {
  console.log(ImageName)
  dataBase.deleteItemForTable(ImageName, 'FileName', configApp.dataBaseConfig.tables.images.nameTables)
}

module.exports.findImage = findImage
module.exports.addImage = addImage
module.exports.deleteImage = deleteImage