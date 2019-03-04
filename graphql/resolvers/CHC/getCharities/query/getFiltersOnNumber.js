const getFiltersOnNumber = (field, numericRangeInput) => {
  if (!numericRangeInput) return []

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

  return [{
    range: {
      [field]: {
        gte,
        gt,
        lte,
        lt,
      },
    },
  }]
}

module.exports = getFiltersOnNumber
