
const fs = require('fs')

module.exports = {
  readDir: (path) => {
    return new Promise(resolve => {
      fs.readdir(path, (err, files) => {
        if (err) {
          throw err
        } else {
          resolve(files)
        }
      })
    })
  },
  writeFile: (path, data) => {
    return new Promise(resolve => {
      fs.writeFile(path, data, (err) => {
        if (err) {
          throw err
        } else {
          resolve(data)
        }
      })
    })
  },
  deleteFile: (path) => {
    return new Promise(resolve => {
      fs.unlink(path, (err) => {
        if (err) {
          throw err
        } else {
          resolve('Deleted')
        }
      })
    })
  },
  readFileStat: (path) => {
    return new Promise(resolve => {
      fs.stat(path, (err, stat) => {
        if (err) {
          throw err
        } else {
          resolve(stat)
        }
      })
    })
  },
}
