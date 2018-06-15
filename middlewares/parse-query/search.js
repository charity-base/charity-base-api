const parseSearch = q => {
  const search = q.search

  if (!search) {
    return { match_all: {} }
  }

  return {
    simple_query_string : {
      query: `${search.split(' ').join('~1 + ')}~1`,
      fields: [
        'name^3',
        'alternativeNames^3',
        'contact.email',
        'trustees.names',
        'areasOfOperation.name',
        'causes.name',
        'beneficiaries.name',
        'operations.name'
      ],
    }
  }
}

module.exports = parseSearch
