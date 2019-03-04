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

  if (notSome && notSome.length > 0) {
    filters.push({
      bool: {
        must_not: notSome.map(value => ({
          match_phrase: { [field]: value }
        }))
      }
    })
  }

  if (length && !isNaN(length.lessThanInclusive)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length <= params.value`,
          lang: 'painless',
          params: { value: length.lessThanInclusive },
        }
      }
    })
  }

  if (length && !isNaN(length.lessThanExclusive)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length < params.value`,
          lang: 'painless',
          params: { value: length.lessThanExclusive },
        }
      }
    })
  }

  if (length && !isNaN(length.moreThanInclusive)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length >= params.value`,
          lang: 'painless',
          params: { value: length.moreThanInclusive },
        }
      }
    })
  }

  if (length && !isNaN(length.moreThanExclusive)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length > params.value`,
          lang: 'painless',
          params: { value: length.moreThanExclusive },
        }
      }
    })
  }

  return filters
}

module.exports = getFiltersOnStringList