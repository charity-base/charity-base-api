const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const connectToDb = (address, config) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(address, config).then(resolve, reject);
  });
}

module.exports = connectToDb;
