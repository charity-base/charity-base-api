// Return an array of Elasticsearch filters on length of given list field.
// numericRangeInput corresponds to type NumericRangeInput defined in GraphQL typeDefs.
const getFiltersOnListLength = (field, numericRangeInput) => {
  if (!numericRangeInput) return []

  const filters = []

  const gte = isNaN(numericRangeInput.gte) ? (
    isNaN(numericRangeInput.moreThanInclusive) ? undefined : numericRangeInput.moreThanInclusive
  ) : numericRangeInput.gte
  const gt = isNaN(numericRangeInput.gt) ? (
    isNaN(numericRangeInput.moreThanExclusive) ? undefined : numericRangeInput.moreThanExclusive
  ) : numericRangeInput.gt
  const lte = isNaN(numericRangeInput.lte) ? (
    isNaN(numericRangeInput.lessThanInclusive) ? undefined : numericRangeInput.lessThanInclusive
  ) : numericRangeInput.lte
  const lt = isNaN(numericRangeInput.lt) ? (
    isNaN(numericRangeInput.lessThanExclusive) ? undefined : numericRangeInput.lessThanExclusive
  ) : numericRangeInput.lt

  if (!isNaN(lte)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length <= params.value`,
          lang: 'painless',
          params: { value: lte },
        }
      }
    })
  }

  if (!isNaN(lt)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length < params.value`,
          lang: 'painless',
          params: { value: lt },
        }
      }
    })
  }

  if (!isNaN(gte)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length >= params.value`,
          lang: 'painless',
          params: { value: gte },
        }
      }
    })
  }

  if (!isNaN(gt)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length > params.value`,
          lang: 'painless',
          params: { value: gt },
        }
      }
    })
  }

  return filters
}

module.exports = getFiltersOnListLength