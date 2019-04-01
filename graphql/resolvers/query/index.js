const getCharities = require('./getCharities')
const getFilters = require('./getFilters')

const CHC = () => ({
  getCharities,
  getFilters,
})

module.exports = {
  CHC,
}

// methods:

// - get scopes of api key (api key sent in request header) (no auth required)
// - get api keys & scopes for a given user (jwt with user id sent in request header)
