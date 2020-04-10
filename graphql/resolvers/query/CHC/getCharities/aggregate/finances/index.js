const agg = require('./agg')

const ES_FIELD_INCOME = 'finances.latest.income'
const ES_FIELD_SPENDING = 'finances.latest.spending'

function aggFinances(search) {
  return {
    latestIncome: () => agg(search, ES_FIELD_INCOME),
    latestSpending: () => agg(search, ES_FIELD_SPENDING),
  }
}

module.exports = aggFinances
