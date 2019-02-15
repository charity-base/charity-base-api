const customTypes = require('./custom-types')
const CHC = require('./CHC')

module.exports = {
  ...customTypes,
  Query: {
    CHC: () => CHC,
  },
}
