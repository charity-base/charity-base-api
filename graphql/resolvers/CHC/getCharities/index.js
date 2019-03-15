const config = require('../../../../config.json')
const { esClient } = require('../../../../connection')
const graphqlFields = require('graphql-fields')
const getElasticQuery = require('./query')
const countCharities = require('./count')
const listCharities = require('./list')
const aggregateCharities = require('./aggregate')

function combineQueries(searchParamsList, filters) {
  const baseParams = {
    index: [config.elastic.indexes.chc.charities],
    body: {
      query: getElasticQuery(filters),
      aggs: {},
    },
    _source: [],
    sort: [],
    size: 0,
    from: undefined,
  }
  const searchParams = searchParamsList.reduce((agg, x) => {
    agg.body.aggs = x.body && x.body.aggs ? ({
      ...agg.body.aggs,
      ...x.body.aggs, // todo: spread aggs one layer down too (to allow merging geo aggs under same filter)
    }) : agg.body.aggs
    agg._source = x._source ? [...agg._source, ...x._source] : agg._source
    agg.sort = x.sort ? [...agg.sort, ...x.sort] : agg.sort
    agg.size = x.size > 0 ? x.size : agg.size
    agg.from = x.from ? x.from : agg.from
    return agg
  }, baseParams)
  return searchParams
}

class FilteredCharitiesCHC {
  constructor(filters) {
    this.filters = filters
    this.queue = []
    this.dispatchQueue = this.dispatchQueue.bind(this)
    this.search = this.search.bind(this)
  }
  search(q) {
    // resolves with the Elasticsearch response
    return new Promise((resolve, reject) => {
      if (this.queue.length === 0) {
        process.nextTick(this.dispatchQueue)
      }
      this.queue.push([q, resolve, reject])
    })
  }
  async dispatchQueue() {
    const toDispatch = this.queue
    this.queue = []
    try {
      const searchParamsList = toDispatch.map(([q]) => q)
      const searchParams = combineQueries(
        searchParamsList,
        this.filters,
      )
      const response = await esClient.search(searchParams)
      toDispatch.map(([_, resolve]) => resolve(response))
    } catch(e) {
      toDispatch.map(([_, __, reject]) => reject(e))
    }
  }
  count() {
    return countCharities(
      this.search,
    )
  }
  list({ limit, skip, sort }, _, info) {
    const requestedFields = graphqlFields(info)
    return listCharities(
      { limit, skip, sort },
      this.search,
      requestedFields
    )
  }
  aggregate() {
    return aggregateCharities(
      this.search,
    )
  }
}

const getCharities = ({ filters }) => {
  return new FilteredCharitiesCHC(filters)
}

module.exports = getCharities
