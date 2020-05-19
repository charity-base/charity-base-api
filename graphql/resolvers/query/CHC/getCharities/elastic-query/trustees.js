const getFiltersOnStringList = require("./getFiltersOnStringList")
const TRUSTEE_ID_FIELD = "trustees.id"

const getTrusteesFilters = (trustees) =>
  getFiltersOnStringList(TRUSTEE_ID_FIELD, trustees)

module.exports = getTrusteesFilters
