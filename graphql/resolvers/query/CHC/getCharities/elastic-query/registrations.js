const getFiltersOnDate = require("./getFiltersOnDate")
const REGISTRATION_DATE_FIELD = "lastRegistrationDate"

const getRegistrationDateFilters = (registrations) => {
  if (!registrations) return []

  const dateRange = registrations.latestRegistrationDate

  return getFiltersOnDate(REGISTRATION_DATE_FIELD, dateRange)
}

module.exports = getRegistrationDateFilters
