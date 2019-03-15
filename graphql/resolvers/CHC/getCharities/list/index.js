const {
  getSourceFields,
  mapDocToGraphQL
} = require('./fields-map')

async function listCharities(
  { limit, skip, sort },
  search,
  requestedFields
) {
  const searchParams = {
    index: undefined, // this is set when queries combined in parent class
    body: {
      query: undefined, // this is set when queries combined in parent class
    },
    _source: getSourceFields(requestedFields),
    sort: [],
    size: limit || 10,
    from: skip || 0,
  }

  try {
    const response = await search(searchParams)
    return response.hits.hits.map(doc => mapDocToGraphQL(doc, requestedFields))
  } catch(e) {
    throw e
  }
}

module.exports = listCharities
