const { esClient } = require('../../../../../connection')
const config = require('../../../../../config.json')

const esIndex = config.elastic.index

const aggs = {
  agg_by_income: {
    histogram: {
      field: 'income.latest.total',
      script: 'Math.log10(_value)',
      interval: 0.5,
      extended_bounds: {
        min: 0,
        max: 9,
      },
    },
    aggs: {
      total_income: {
        sum: {
          field: 'income.latest.total',
        },
      },
    },
  },
}

async function aggByIncome(esQuery) {
  const searchParams = {
    index: esIndex,
    size: 0,
    body: {
      query: esQuery,
      aggs,
    },
  }
  try {
    const response = await esClient.search(searchParams)
    const buckets = response.aggregations.agg_by_income.buckets.map(x => ({
      id: x.key,
      name: `Min. £${Math.round(Math.pow(10, x.key))}`,
      count: x.doc_count,
      sumIncome: x.total_income.value,
    }))
    return {
      buckets,
    }
  } catch(e) {
    throw e
  }
}

module.exports = aggByIncome
