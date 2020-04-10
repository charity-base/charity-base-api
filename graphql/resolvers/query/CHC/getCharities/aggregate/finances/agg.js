async function agg(search, fieldName) {
  const searchParams = {
    index: undefined, // this is set when queries combined in parent class
    body: {
      query: undefined, // this is set when queries combined in parent class
      aggs: {
        agg1: {
          histogram: {
            field: fieldName,
            script: 'Math.log10(_value)',
            interval: 0.5,
            extended_bounds: {
              min: 0,
              max: 9,
            },
          },
          aggs: {
            total: {
              sum: {
                field: fieldName,
              },
            },
          },
        }
      }
    },
    size: 0,
  }

  try {
    const response = await search(searchParams)
    const buckets = response.aggregations.agg1.buckets.map(x => ({
      key: `${x.key}`,
      name: `Min. £${Math.round(Math.pow(10, x.key))}`,
      count: x.doc_count,
      sum: x.total.value,
    }))
    return {
      buckets,
    }
  } catch(e) {
    throw e
  }
}

module.exports = agg
