const getFiltersOnListLength = require('./getFiltersOnListLength')
// Return an array of Elasticsearch filters on given field (for which each doc has a list of integer values)
// listFilterInput corresponds to type ListFilterInput defined in GraphQL typeDefs.
const getFiltersOnIntegerList = (field, listFilterInput) => {
  if (!listFilterInput) return []

  const filters = []
  const { some, every, notSome, length } = listFilterInput

  if (some && some.length > 0) {
    const someInts = some.map(x => parseInt(x)).filter(x => !isNaN(x))
    if (someInts.length === 0) {
      return [{
        match_none: {}
      }]
    } else {
      filters.push({
        bool: {
          should: someInts.map(value => ({
            term: { [field]: value }
          }))
        }
      })
    }
  }

  if (every && every.length > 0) {
    const everyInts = every.map(x => parseInt(x)).filter(x => !isNaN(x))
    if (everyInts.length === 0) {
      return [{
        match_none: {}
      }]
    } else {
      filters.push({
        bool: {
          must: everyInts.map(value => ({
            term: { [field]: value }
          }))
        }
      })
    }
  }

  if (notSome && notSome.length > 0) {
    const notSomeInts = notSome.map(x => parseInt(x)).filter(x => !isNaN(x))
    if (notSomeInts.length > 0) {
      filters.push({
        bool: {
          must_not: notSomeInts.map(value => ({
            term: { [field]: value }
          }))
        }
      })
    }
  }

  getFiltersOnListLength(field, length).map(f => filters.push(f))

  return filters
}

module.exports = getFiltersOnIntegerList
