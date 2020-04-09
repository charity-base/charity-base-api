const getFiltersOnStringList = require('./getFiltersOnStringList')
const FUNDER_ID_FIELD = 'funding.funders.id'

const getGrantsFilters = grants => {
  if (!grants) return []

  const grantFundersFilters = getFiltersOnStringList(
    FUNDER_ID_FIELD,
    grants.funders,
  )

  return grantFundersFilters
}

module.exports = getGrantsFilters
