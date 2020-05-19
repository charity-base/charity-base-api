const getFiltersOnStringList = require("./getFiltersOnStringList")
const TOPIC_ID_FIELD = "topics.id"

const getTopicsFilters = (topics) =>
  getFiltersOnStringList(TOPIC_ID_FIELD, topics)

module.exports = getTopicsFilters
