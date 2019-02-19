// Return an array of Elasticsearch filters on given field (for which each doc has a list of string values)
// listFilterInput corresponds to type ListFilterInput defined in GraphQL typeDefs.
const getFiltersOnStringList = (field, listFilterInput) => {
  if (!listFilterInput) return []

  const filters = []
  const { some, every } = listFilterInput

  // Logical OR query:
  if (some && some.length > 0) {
    filters.push({
      bool: {
        should: some.map(value => ({
          match_phrase: { [field]: value }
        }))
      }
    })
  }

  // Logical AND query:
  if (every && every.length > 0) {
    filters.push({
      bool: {
        must: every.map(value => ({
          match_phrase: { [field]: value }
        }))
      }
    })
  }

  return filters
}

module.exports = getFiltersOnStringList