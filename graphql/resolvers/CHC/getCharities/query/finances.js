const getFiltersOnNumber = require('./getFiltersOnNumber')
const LATEST_INCOME_FIELD = 'financial.latest.income'

const getFinancesFilters = finances => {
  if (!finances) return []

  const numericRange = finances.latestIncome

  return getFiltersOnNumber(LATEST_INCOME_FIELD, numericRange)
}

module.exports = getFinancesFilters