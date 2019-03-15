const aggAreas = require('./areas')
const aggBeneficiaries = require('./beneficiaries')
const aggCauses = require('./causes')
const aggFinances = require('./finances')
const aggGeo = require('./geo')
const aggIncome = require('./income')
const aggOperations = require('./operations')

function aggregateCharities(search) {
  return {
    areas: () => aggAreas(search),
    beneficiaries: () => aggBeneficiaries(search),
    causes: () => aggCauses(search),
    finances: () => aggFinances(search),
    geo: (args) => aggGeo(search, args),
    income: () => aggIncome(search),
    operations: () => aggOperations(search),
  }
}

module.exports = aggregateCharities
