const latestIncome = require('./latestIncome')

function aggFinances(search) {
  return {
    latestIncome: () => latestIncome(search),
  }
}

module.exports = aggFinances
