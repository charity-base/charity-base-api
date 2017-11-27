const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connectToDb = (address, config) => {
  mongoose.connect(address, config);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Successfully connected to db');
  });
}

module.exports = connectToDb;
