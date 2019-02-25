const { esClient } = require('../../../../connection')
const config = require('../../../../config.json')

const esIndex = config.elastic.index

// map from GraphQL fields to Elasticsearch fields
const fieldMap = {
  'id': 'ids.GB-CHC',
  'name': 'name',
  'activities': 'activities',
  'income': 'income',
  'grants': 'grants',
  'areas': 'areasOfOperation',
  'causes': 'causes',
  'beneficiaries': 'beneficiaries',
  'operations': 'operations',
  'geo': 'contact.geo',
  'contact': 'contact',
  'website': 'website',
}

// allow getting nested field from object with dot notation e.g. getNestedField({ a: { b: 'hello' } }, 'a.b')
const getNestedField = (obj, field) => (
  field.split('.').reduce((acc, part) => acc ? acc[part] : '', obj)
)

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
    _source: requestedFields.map(x => fieldMap[x]), // This could be further optimised by just fetching requested sub fields
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
