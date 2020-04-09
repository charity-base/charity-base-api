const getFiltersOnStringList = require('./getFiltersOnStringList')

const getGrantsFilters = grants => {
  if (!grants) return []

  const grantFundersFilters = getFiltersOnStringList(
    'funding.funders.id',
    grants.funders,
  )

  return grantFundersFilters
}

module.exports = getGrantsFilters
