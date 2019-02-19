// Return an array of Elasticsearch filters on given field (for which each doc has a list of string values)
// listFilterInput corresponds to type ListFilterInput defined in GraphQL typeDefs.
const getFiltersOnStringList = (field, listFilterInput) => {
  if (!listFilterInput) return []
  if (!listFilterInput.some || !listFilterInput.some.length) return []
  const someFilters = [{
    bool: {
      should: listFilterInput.some.map(value => ({
        match_phrase: { [field]: value }
      }))
    }
  }]
  return someFilters
}

module.exports = getFiltersOnStringList