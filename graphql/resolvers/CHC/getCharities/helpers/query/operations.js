const getOperationsFilters = operations => {
  if (!operations) return []
  if (!operations.some || !operations.some.length) return []
  const ids = operations.some.map(x => parseInt(x)).filter(x => !isNaN(x))
  if (ids.length === 0) {
    // all values provided were of invalid form, return none
    return [{
      "match_none": {}
    }]
  }
  return [{
    bool: {
      should: ids.map(id => ({
        "term": { "operations.id": id }
      }))
    }
  }]
}

module.exports = getOperationsFilters
