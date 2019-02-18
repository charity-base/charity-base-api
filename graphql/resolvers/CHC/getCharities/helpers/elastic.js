const getElasticQuery = ({
  search,
  areas,
}) => {
  const must = search ? ({
    simple_query_string : {
      query: `${search.trim()}`, //`${search.trim().split(" ").join("~1 + ")}~1`, // what about "quoted searches"?
      fields: [
        "name^3",
        "alternativeNames^3",
        "activities",
        "contact.email",
        "trustees.names",
        "areasOfOperation.name",
        "causes.name",
        "beneficiaries.name",
        "operations.name",
        "grants.description",
        "grants.fundingOrganization.name",
      ],
    }
  }) : ({
    match_all: {}
  })

  const filter = areas && areas.some ? [{
    bool: {
      should: areas.some.map(id => ({
        "match_phrase": { "areasOfOperation.id": id }
      }))
    }
  }] : undefined

  return {
    bool: {
      must,
      filter,
    }
  }
}

module.exports = getElasticQuery
