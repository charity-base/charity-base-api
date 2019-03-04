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

module.exports = getFiltersOnIntegerList
