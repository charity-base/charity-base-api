const createKey = require('./create')
const updateKey = require('./update')
const deleteKey = require('./delete')

const apiKeys = () => ({
  createKey,
  updateKey,
  deleteKey,
})

module.exports = {
  apiKeys,
}
