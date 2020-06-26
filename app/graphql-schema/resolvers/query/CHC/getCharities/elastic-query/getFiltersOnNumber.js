const getFiltersOnNumber = (field, numericRangeInput) => {
  if (!numericRangeInput) return []

  const { gte, gt, lte, lt } = numericRangeInput

  return [
    {
      range: {
        [field]: {
          gte,
          gt,
          lte,
          lt,
        },
      },
    },
  ]
}

module.exports = getFiltersOnNumber
