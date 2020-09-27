// todo: allow getting name from another field (e.g. using another sub-agg)
function aggByTerm(aggName, esField, numValues) {
  async function getAggBuckets(search) {
    const searchParams = {
      index: undefined, // this is set when queries combined in parent class
      body: {
        query: undefined, // this is set when queries combined in parent class
        aggs: {
          [aggName]: {
            terms: {
              field: esField,
              size: numValues,
            },
          },
        },
      },
      size: 0,
    }
    try {
      const response = await search(searchParams)
      const buckets = response.aggregations[aggName].buckets.map((x) => ({
        key: `${x.key}`,
        name: `${x.key}`,
        count: x.doc_count,
      }))
      return {
        buckets,
      }
    } catch (e) {
      throw e
    }
  }
  return getAggBuckets
}

module.exports = aggByTerm
