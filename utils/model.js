const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const crypto = require('crypto')


function read(fileName) {
  const data = readFileSync(resolve('database', fileName + '.json'), 'utf-8')
  return JSON.parse(data)
}

function write(fileName, data) {
  writeFileSync(resolve('database', fileName + '.json'), JSON.stringify(data, null, 4))
  return true
}

function hashPassword(password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  return hash
}

function filteredArray(array1, array2, id, name, objectId, objectName, objectArray, resArray) {
  const mapArray = array1.map(
    item =>
      array2.
        filter(subItem =>
          item[id] == subItem[id]))

  mapArray.forEach((item, index) => {
    let counter = index + 1
    let itemName = array1.find(item => item[id] == counter)[name]
    const newObject = {}
    newObject[objectId] = item[0]?.[id] || counter
    newObject[objectName] = array1.filter(subItem => subItem[id] == item[0]?.[id])[0]?.[name] || itemName
    newObject[objectArray] = item.filter(item => delete item[id])
    counter--
    resArray.push(newObject)
  })
}

module.exports = {
  read, write, hashPassword, filteredArray
}