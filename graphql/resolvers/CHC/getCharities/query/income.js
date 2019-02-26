const LATEST_INCOME_FIELD = 'income.latest.total'

const getIncomeFilters = income => {
  if (!income) return []

  const filters = []

  if (income.latest && income.latest.total) {
    filters.push({
      range: {
        [LATEST_INCOME_FIELD]: income.latest.total,
      },
    })
  }

  return filters
}

module.exports = getIncomeFilters
