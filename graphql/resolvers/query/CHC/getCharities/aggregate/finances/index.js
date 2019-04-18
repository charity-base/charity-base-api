const latestIncome = require('./latestIncome')
const latestSpending = require('./latestSpending')

function aggFinances(search) {
  return {
    latestIncome: () => latestIncome(search),
    latestSpending: () => latestSpending(search),
  }
}

module.exports = aggFinances
