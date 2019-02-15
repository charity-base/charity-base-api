const graphqlFields = require('graphql-fields')
const countCharities = require('./count')
const listCharities = require('./list')
const { getElasticQuery } = require('./helpers')

class FilteredCharitiesCHC {
  constructor(filters) {
    this.filters = filters
    this.esQuery = getElasticQuery(filters)
  }
  list({ limit, skip, sort }, _, info) {
    const requestedFields = Object.keys(graphqlFields(info))
    return listCharities(
      { limit, skip, sort },
      this.esQuery,
      requestedFields
    )
  }
  count() {
    return countCharities(
      this.esQuery,
    )
  }
}

const getCharities = ({ filters }) => {
  return new FilteredCharitiesCHC(filters)
}

module.exports = getCharities
