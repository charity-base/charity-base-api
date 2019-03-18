const fieldResolvers = require('./field-resolvers')

async function listCharities(search, { limit, skip, sort }) {
  try {
    const searchSource = ({ _source }) => search({
      index: undefined, // this is set when queries combined in parent class
      body: {
        query: undefined, // this is set when queries combined in parent class
      },
      _source,
      size: limit,
      from: skip,
      // todo: add sort
    })

    // Is there a way to limit the results without an extra elasticsearch round trip?
    const countResponse = await search({})
    const numResults = Math.min(countResponse.hits.total, limit)

    const fieldValueLists = {}
    const results = [...new Array(numResults)].map((_, i) => {
      return Object.keys(fieldResolvers).reduce((agg, x) => ({
        ...agg,
        [x]: fieldArgs => {
          // This only gets called for the requested fields
          if (i === 0) {
            fieldValueLists[x] = fieldResolvers[x](searchSource, fieldArgs)
          }
          return fieldValueLists[x].then(res => res[i])
        }
      }), {})
    })
    return results
  } catch(e) {
    throw e
  }
}

module.exports = listCharities
