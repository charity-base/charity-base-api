// Return an array of Elasticsearch filters on length of given list field.
// numericRangeInput corresponds to type NumericRangeInput defined in GraphQL typeDefs.
const getFiltersOnListLength = (field, numericRangeInput) => {
  if (!numericRangeInput) return []

  const filters = []

  const { gte, gt, lte, lt } = numericRangeInput

  if (!isNaN(lte)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length <= params.value`,
          lang: "painless",
          params: { value: lte },
        },
      },
    })
  }

  if (!isNaN(lt)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length < params.value`,
          lang: "painless",
          params: { value: lt },
        },
      },
    })
  }

  if (!isNaN(gte)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length >= params.value`,
          lang: "painless",
          params: { value: gte },
        },
      },
    })
  }

  if (!isNaN(gt)) {
    filters.push({
      script: {
        script: {
          source: `doc['${field}'].values.length > params.value`,
          lang: "painless",
          params: { value: gt },
        },
      },
    })
  }

  return filters
}

module.exports = getFiltersOnListLength
