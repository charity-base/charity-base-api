const { esClient } = require('../../../../connection')
const config = require('../../../../config.json')

const esIndex = config.elastic.indexes.chc.filters

const MAX_SUGGESTIONS = 12

async function getFilters({ prefix, id }) {
  if (!prefix) return []
  const searchParams = {
    index: [esIndex],
    body: {
      suggest: {
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
    },
    _source: ['id', 'value', 'label', 'filterType'],
  }

  try {
    const response = await esClient.search(searchParams)
    return response.suggest.filterSuggest[0].options.map(x => ({
      ...x._source,
      score: x._score,
    }))
  } catch(e) {
    throw e
  }
}

module.exports = getFilters
