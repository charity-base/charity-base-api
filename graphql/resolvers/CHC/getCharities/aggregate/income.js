const aggQuery = {
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
}

const parseResponse = aggregation => {
  const buckets = aggregation.buckets.map(x => ({
    id: `${x.key}`,
    name: `Min. £${Math.round(Math.pow(10, x.key))}`,
    count: x.doc_count,
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
