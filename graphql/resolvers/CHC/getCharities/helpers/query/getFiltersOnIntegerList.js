// Return an array of Elasticsearch filters on given field (for which each doc has a list of integer values)
// listFilterInput corresponds to type ListFilterInput defined in GraphQL typeDefs.
const getFiltersOnIntegerList = (field, listFilterInput) => {
  if (!listFilterInput) return []
  if (!listFilterInput.some || !listFilterInput.some.length) return []
  const someInts = listFilterInput.some.map(x => parseInt(x)).filter(x => !isNaN(x))
  const someFilters = someInts.length > 0 ? [{
    bool: {
      should: someInts.map(value => ({
        term: { [field]: value }
      }))
    }
  }] : [{
    match_none: {}
  }]
  return someFilters
}

module.exports = getFiltersOnIntegerList
