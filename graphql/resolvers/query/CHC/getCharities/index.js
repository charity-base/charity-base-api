const { esClient } = require('../../../../../connection')
const getElasticQuery = require('./elastic-query')
const countCharities = require('./count')
const listCharities = require('./list')
const aggregateCharities = require('./aggregate')
const downloadCharities = require('./download')

const {
  CHARITY_BASE_ES_AWS_INDEX_CHC_CHARITY,
} = process.env

function combineQueries(searchParamsList, filters) {
  const baseParams = {
    index: [CHARITY_BASE_ES_AWS_INDEX_CHC_CHARITY],
    body: {
      query: getElasticQuery(filters),
      aggs: {},
      sort: [],
    },
    _source: [],
    size: 0,
    from: undefined,
  }
  const searchParams = searchParamsList.reduce((agg, x) => {
    agg.body.aggs = x.body && x.body.aggs ? ({
      ...agg.body.aggs,
      ...x.body.aggs, // todo: spread aggs one layer down too (to allow merging geo aggs under same geo filter)
    }) : agg.body.aggs
    agg.body.sort = agg.body.sort.length > 0 ? agg.body.sort : ((x.body && x.body.sort) || []) // only take the first non-trivial sort
    agg._source = x._source ? [...new Set([...agg._source, ...x._source])] : agg._source
    agg.size = x.size > 0 ? x.size : agg.size
    agg.from = !isNaN(x.from) ? x.from : agg.from
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
    // Resolves with the Elasticsearch response
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
  list(args) {
    return listCharities(
      this.search,
      args,
    )
  }
  aggregate() {
    return aggregateCharities(
      this.search,
    )
  }
  download() {
    // Not merging queries here since we need to slice & scroll
    return downloadCharities(
      this.filters,
    )
  }
}

const getCharities = ({ filters }) => {
  return new FilteredCharitiesCHC(filters)
}

module.exports = getCharities
