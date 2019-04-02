const createKey = require('./create')
const updateKey = require('./update')
const deleteKey = require('./delete')

const apiKeys = () => ({
  create: createKey,
  update: updateKey,
  delete: deleteKey,
})

module.exports = {
  apiKeys,
}
