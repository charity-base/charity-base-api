const getIdFilters = id => {
  if (!id || !id.length) return []
  const idInts = id.map(x => parseInt(x)).filter(x => !isNaN(x))
  if (idInts.length === 0) {
    // all values provided were of invalid form, return none
    return [{
      "match_none": {}
    }]
  }
  return [{
    bool: {
      should: idInts.map(id => ({
        "term": { "ids.GB-CHC": id }
      }))
    }
  }]
}

module.exports = getIdFilters
