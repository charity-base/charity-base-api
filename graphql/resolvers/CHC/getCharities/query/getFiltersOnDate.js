const DATE_FORMAT = 'yyyy-MM-dd'

const getFiltersOnDate = (field, dateRangeInput) => {
  if (!dateRangeInput) return []

  const {
    gte,
    gt,
    lte,
    lt,
  } = dateRangeInput

  return [{
    range: {
      [field]: {
        gte,
        gt,
        lte,
        lt,
        format: DATE_FORMAT,
      },
    },
  }]
}

module.exports = getFiltersOnDate
