const getFiltersOnStringList = require('./getFiltersOnStringList')

const getFundersFilters = funders => getFiltersOnStringList(
  'grants.fundingOrganization.id',
  funders,
)

module.exports = getFundersFilters
