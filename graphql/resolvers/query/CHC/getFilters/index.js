const { esClient } = require('../../../../../connection')
const config = require('../../../../../config.json')

const esIndex = config.elastic.indexes.chc.filters

const MAX_SUGGESTIONS = 12

const FILTER_TYPES = [
  { context: "trustee", boost: 1 },
  { context: "id", boost: 2 },
  { context: "area", boost: 3 },
  { context: "funder", boost: 4 },
  { context: "cause", boost: 5 },
  { context: "operation", boost: 5 },
  { context: "beneficiary", boost: 5 },
]

async function getFilters({ filterType, id, search }) {
  const filterIds = id && id.length > 0

  if (!filterIds && !search) return []

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
  } else if (search) {
    searchParams.body.suggest = {
      filterSuggest: {
        prefix: search.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        completion: {
          field: 'suggest',
          size: MAX_SUGGESTIONS,
          fuzzy: {
            fuzziness: 1,
          },
          contexts: {
            filter_type: filterType ? (FILTER_TYPES.filter(x => {
              return filterType.indexOf(x.context) > -1
            })) : FILTER_TYPES
          },
        }
      }
    }
  }

  try {
    const response = await esClient.search(searchParams)
    if (!filterIds && search) {
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
