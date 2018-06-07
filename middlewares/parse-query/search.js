const parseSearch = q => {
  const search = q.search

  if (!search) {
    return { match_all: {} }
  }

  return {
    multi_match: {
      query: search,
      fields: [ 'name^3', 'alternativeNames^3', 'contact.email', 'trustees.names', 'areasOfOperation.name' ],
      type: 'phrase_prefix',
      operator: 'and',
    }
  }
}

module.exports = parseSearch
