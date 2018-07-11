const parseSearch = q => {
  const search = q.search

  if (!search) {
    return { match_all: {} }
  }

  return {
    simple_query_string : {
      query: `${search.trim().split(' ').join('~1 + ')}~1`, // what about "quoted searches"?
      fields: [
        'name^3',
        'alternativeNames^3',
        'activities',
        'contact.email',
        'trustees.names',
        'areasOfOperation.name',
        'causes.name',
        'beneficiaries.name',
        'operations.name',
        'grants.description',
      ],
    }
  }
}

module.exports = parseSearch
