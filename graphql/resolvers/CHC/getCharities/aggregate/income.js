const LATEST_INCOME_FIELD = 'financial.latest.income'

const aggQuery = () => ({
  histogram: {
    field: LATEST_INCOME_FIELD,
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
        field: LATEST_INCOME_FIELD,
      },
    },
  },
})

const parseResponse = aggregation => {
  const buckets = aggregation.buckets.map(x => ({
    id: `${x.key}`,
    key: `${x.key}`,
    name: `Min. £${Math.round(Math.pow(10, x.key))}`,
    count: x.doc_count,
    sum: x.total_income.value,
    sumIncome: x.total_income.value,
  }))
  return {
    buckets,
  }
}

module.exports = {
  aggQuery,
  parseResponse,
}
