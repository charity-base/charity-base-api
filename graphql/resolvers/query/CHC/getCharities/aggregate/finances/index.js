const agg = require("./agg")

const ES_FIELD_INCOME = "finances.latest.income"
const ES_FIELD_SPENDING = "finances.latest.spending"

const aggIncome = agg("agg_latest_income", ES_FIELD_INCOME)
const aggSpending = agg("agg_latest_spending", ES_FIELD_SPENDING)

function aggFinances(search) {
  return {
    latestIncome: () => aggIncome(search),
    latestSpending: () => aggSpending(search),
  }
}

module.exports = aggFinances
