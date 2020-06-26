const fieldResolvers = require("./field-resolvers")
const sortFields = require("./sortFields")

async function listCharities(search, { limit, skip, sort }) {
  try {
    const searchSource = ({ _source }) =>
      search({
        index: undefined, // this is set when queries combined in parent class
        body: {
          query: undefined, // this is set when queries combined in parent class
          sort: [
            ...sortFields[sort],
            "_doc", // ensures sorting is consistent
          ],
        },
        _source,
        size: limit,
        from: skip,
      })

    // Is there a way to limit the results without an extra elasticsearch round trip?
    const countResponse = await search({})
    const numResults = Math.min(countResponse.hits.total - skip, limit)

    if (numResults < 1) return []

    const fieldValueLists = {}
    const results = [...new Array(numResults)].map((_, i) => {
      return Object.keys(fieldResolvers).reduce(
        (agg, x) => ({
          ...agg,
          [x]: (fieldArgs) => {
            // This only gets called for the requested fields
            if (i === 0) {
              fieldValueLists[x] = fieldResolvers[x](searchSource, fieldArgs)
            }
            return fieldValueLists[x].then((res) => res[i])
          },
        }),
        {}
      )
    })
    return results
  } catch (e) {
    throw e
  }
}

module.exports = listCharities
