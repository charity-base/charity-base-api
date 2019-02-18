const aggByIncome = require('./income')

function aggregateCharities(esQuery) {
  return {
    income: () => aggByIncome(esQuery),
  }
}

module.exports = aggregateCharities
