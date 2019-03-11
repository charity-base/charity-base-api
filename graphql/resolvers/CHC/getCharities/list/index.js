const { esClient } = require('../../../../../connection')
const config = require('../../../../../config.json')
const {
  getSourceFields,
  mapDocToGraphQL
} = require('./fields-map')

const esIndex = config.elastic.indexes.chc.charities

// Note this is not the same as the FilteredCharitiesCHC.list resolver (additional args)
async function listCharities(
  { limit, skip, sort },
  esQuery,
  requestedFields
) {
  const searchParams = {
    index: [esIndex],
    body: {
      query: esQuery,
    },
    _source: getSourceFields(requestedFields),
    sort: [],
    size: limit || 10,
    from: skip || 0,
  }

  try {
    const response = await esClient.search(searchParams)
    return response.hits.hits.map(doc => mapDocToGraphQL(doc, requestedFields))
  } catch(e) {
    throw e
  }
}

module.exports = listCharities
