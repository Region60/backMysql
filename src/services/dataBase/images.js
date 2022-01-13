const dataBase = require('./dataBase')
const { configApp } = require('../../configApp/configApp')


async function findImage(filename) {
  if (typeof filename === 'string'){
    filename = [filename]
  }
  let result = await dataBase.dataBaseSearch(configApp.dataBaseConfig.tables.images.nameTables, 'FileName', filename)
  console.log(result)
  return result[0]
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