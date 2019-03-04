const getFiltersOnStringList = require('./getFiltersOnStringList')

const getBeneficiariesFilters = beneficiaries => getFiltersOnStringList(
  'beneficiaries.id',
  beneficiaries,
)

module.exports = getBeneficiariesFilters
