const getFiltersOnStringList = require("./getFiltersOnStringList")
const AREA_ID_FIELD = "areas.id"

const getAreasFilters = (areas) => getFiltersOnStringList(AREA_ID_FIELD, areas)

module.exports = getAreasFilters
