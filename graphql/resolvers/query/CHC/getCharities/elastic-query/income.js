const getFiltersOnNumber = require('./getFiltersOnNumber')
const LATEST_INCOME_FIELD = 'financial.latest.income'

const getIncomeFilters = income => {
  if (!income) return []

  const numericRange = income.latest && income.latest.total

  return getFiltersOnNumber(LATEST_INCOME_FIELD, numericRange)
}

module.exports = getIncomeFilters