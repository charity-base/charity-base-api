const getFiltersOnListLength = require("./getFiltersOnListLength")
// Return an array of Elasticsearch filters on given field (for which each doc has a list of string values)
// listFilterInput corresponds to type ListFilterInput defined in GraphQL typeDefs.
const getFiltersOnStringList = (field, listFilterInput) => {
  if (!listFilterInput) return []

  const filters = []
  const { some, every, notSome, length } = listFilterInput

  // Logical OR query:
  if (some && some.length > 0) {
    filters.push({
      bool: {
        should: some.map((value) => ({
          term: { [field]: value },
        })),
      },
    })
  }

  // Logical AND query:
  if (every && every.length > 0) {
    filters.push({
      bool: {
        must: every.map((value) => ({
          term: { [field]: value },
        })),
      },
    })
  }

  if (notSome && notSome.length > 0) {
    filters.push({
      bool: {
        must_not: notSome.map((value) => ({
          term: { [field]: value },
        })),
      },
    })
  }

  filters.push(...getFiltersOnListLength(field, length))

  return filters
}

module.exports = getFiltersOnStringList
