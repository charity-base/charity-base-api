const getCausesFilters = causes => {
  if (!causes) return []
  if (!causes.some || !causes.some.length) return []
  const ids = causes.some.map(x => parseInt(x)).filter(x => !isNaN(x))
  if (ids.length === 0) {
    // all values provided were of invalid form, return none
    return [{
      "match_none": {}
    }]
  }
  return [{
    bool: {
      should: ids.map(id => ({
        "term": { "causes.id": id }
      }))
    }
  }]
}

module.exports = getCausesFilters
