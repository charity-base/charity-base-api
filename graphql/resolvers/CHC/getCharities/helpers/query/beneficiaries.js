const getFiltersOnIntegerList = require('./getFiltersOnIntegerList')

const getBeneficiariesFilters = beneficiaries => getFiltersOnIntegerList(
  'beneficiaries.id',
  beneficiaries,
)

module.exports = getBeneficiariesFilters
