const getFiltersOnNumber = require("./getFiltersOnNumber")
const LATEST_INCOME_FIELD = "finances.latest.income"
const LATEST_SPENDING_FIELD = "finances.latest.spending"

const getFinancesFilters = (finances) => {
  if (!finances) return []

  const filters = []

  if (finances.latestIncome) {
    filters.push(
      ...getFiltersOnNumber(LATEST_INCOME_FIELD, finances.latestIncome)
    )
  }
  if (finances.latestSpending) {
    filters.push(
      ...getFiltersOnNumber(LATEST_SPENDING_FIELD, finances.latestSpending)
    )
  }

  return filters
}

module.exports = getFinancesFilters
