const dataBase = require('./dataBase')
const { configApp } = require('../../configApp/configApp')


export async function findImage(filename: string) {
  let arrWithFileName: Array<string> = []

  if (typeof filename === 'string'){
     arrWithFileName.push(filename)

  }
  let result = await dataBase.dataBaseSearch(configApp.dataBaseConfig.tables.images.nameTables, 'FileName', arrWithFileName)
  return result[0]
}

export async function addImage(path: string, filename: string) {
  let string: string = `images (Path, FileName)values('${path}','${filename}')`
  return await dataBase.addItemForTable(string)
}

export function deleteImage(ImageName: string) {
  dataBase.deleteItemForTable(ImageName, 'FileName', configApp.dataBaseConfig.tables.images.nameTables)
}

