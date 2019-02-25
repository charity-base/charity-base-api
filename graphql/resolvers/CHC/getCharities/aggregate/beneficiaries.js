const aggQuery = {
  terms: {
    field: 'beneficiaries.id',
    size: 7,
  },
}

const parseResponse = aggregation => {
  const buckets = aggregation.buckets.map(x => ({
    id: `${x.key}`,
    name: `${x.key}`,
    count: x.doc_count,
    sumIncome: null, // remove this from bucket type?
  }))
  return {
    buckets,
  }
}

module.exports = {
  aggQuery,
  parseResponse,
}