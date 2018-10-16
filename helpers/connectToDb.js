const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const connectToDb = (address, config) => {
  return mongoose.connect(address, config)
}

module.exports = connectToDb
