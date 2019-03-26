const { esClient } = require('../../../../connection')
const config = require('../../../../config.json')

const esIndex = config.elastic.indexes.chc.filters

const MAX_SUGGESTIONS = 12

async function getFilters({ prefix, id }) {
  const filterIds = id && id.length > 0

  if (!filterIds && !prefix) return []

  const searchParams = {
    index: [esIndex],
    body: {},
    _source: ['id', 'value', 'label', 'filterType'],
  }

  if (filterIds) {
    searchParams.body.query = {
      bool: {
        should: id.map(x => ({
          term: { id: x }
        }))
      }
    }
  } else if (prefix) {
    searchParams.body.suggest = {
      filterSuggest: {
        prefix: prefix.toLowerCase(),
        completion: {
          field: 'suggest',
          size: MAX_SUGGESTIONS,
          fuzzy: {
            fuzziness: 1,
          },
          contexts: {
            filter_type: [
              { context: "id", boost: 1 },
              { context: "area", boost: 2 },
              { context: "funder", boost: 3 },
              { context: "cause", boost: 4 },
              { context: "operation", boost: 4 },
              { context: "beneficiary", boost: 4 },
            ]
          },
        }
      }
    }
  }

  try {
    const response = await esClient.search(searchParams)
    if (!filterIds && prefix) {
      return response.suggest.filterSuggest[0].options.map(x => ({
        ...x._source,
        score: x._score,
      }))
    } else {
      return response.hits.hits.map(x => x._source)
    }
  } catch(e) {
    throw e
  }
}

module.exports = getFilters
