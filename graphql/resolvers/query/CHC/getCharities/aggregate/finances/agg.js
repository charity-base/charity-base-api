const agg = (aggName, esField) => {
  return async (search) => {
    const searchParams = {
      index: undefined, // this is set when queries combined in parent class
      body: {
        query: undefined, // this is set when queries combined in parent class
        aggs: {
          [aggName]: {
            histogram: {
              field: esField,
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
                  field: esField,
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
      const buckets = response.aggregations[aggName].buckets
        .map(x => ({
          key: `${x.key}`,
          name: `Min. £${Math.round(Math.pow(10, x.key))}`,
          count: x.doc_count,
          sum: x.total.value,
        }))
        .filter(x => x.key !== 'NaN') // to deal with negative spending (bad data from CC)
      return {
        buckets,
      }
    } catch(e) {
      throw e
    }
  }
}

module.exports = agg
