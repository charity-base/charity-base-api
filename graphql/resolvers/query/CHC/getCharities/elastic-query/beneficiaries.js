const getFiltersOnStringList = require("./getFiltersOnStringList")
const BENEFICIARY_ID_FIELD = "beneficiaries.id"

const getBeneficiariesFilters = (beneficiaries) =>
  getFiltersOnStringList(BENEFICIARY_ID_FIELD, beneficiaries)

module.exports = getBeneficiariesFilters
