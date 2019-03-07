const getFiltersOnDate = require('./getFiltersOnDate')
const REGISTRATION_DATE_FIELD = 'lastRegistrationDate'

const getRegistrationDateFilters = dateRange => {
  if (!dateRange) return []
  
  return getFiltersOnDate(REGISTRATION_DATE_FIELD, dateRange)
}

module.exports = getRegistrationDateFilters
