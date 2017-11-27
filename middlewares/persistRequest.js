const mongoose = require('mongoose');

const hitSchema = new mongoose.Schema({
  params : mongoose.Schema.Types.Mixed,
  query : mongoose.Schema.Types.Mixed,
}, {
  timestamps : true
});

const Hit = mongoose.model('Hit', hitSchema)


const persistRequest = () => (req, res, next) => {
  const { params, query } = req;
  const hit = new Hit({ params, query });
  hit.save();
  return next();
}

module.exports = persistRequest;
