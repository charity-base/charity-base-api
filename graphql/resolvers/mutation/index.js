const createKey = require('./create')
const updateKey = require('./update')
const deleteKey = require('./delete')

const apiKey = () => ({
  create: createKey,
  update: updateKey,
  delete: deleteKey,
})

module.exports = {
  apiKey,
}
