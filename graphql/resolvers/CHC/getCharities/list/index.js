const { esClient } = require('../../../../../connection')
const config = require('../../../../../config.json')
const fieldMap = require('./graphQLToElasticFields.json')
const getNestedField = require('./getNestedField')

const esIndex = config.elastic.index

// Note this is not the same as the FilteredCharitiesCHC.list resolver (additional args)
async function listCharities(
  { limit, skip, sort },
  esQuery,
  requestedFields
) {
  const searchParams = {
    index: esIndex,
    body: {
      query: esQuery,
    },
    _source: Object.keys(requestedFields).map(x => fieldMap[x]), // This could be further optimised by just fetching requested sub fields
    sort: [],
    size: limit || 10,
    from: skip || 0,
  }

  try {
    const response = await esClient.search(searchParams)
    return response.hits.hits.map(doc => (
      Object.keys(fieldMap).reduce((agg, field) => ({
        ...agg,
        [field]: getNestedField(doc._source, fieldMap[field])
      }), {})
    ))
  } catch(e) {
    throw e
  }
}

module.exports = listCharities
