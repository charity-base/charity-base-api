const getAreasFilters = require('./areas')
const getCausesFilters = require('./causes')
const getBeneficiariesFilters = require('./beneficiaries')
const getOperationsFilters = require('./operations')

const getElasticQuery = ({
  search,
  areas,
  causes,
  beneficiaries,
  operations,
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

  const filter = [
    ...getAreasFilters(areas),
    ...getCausesFilters(causes),
    ...getBeneficiariesFilters(beneficiaries),
    ...getOperationsFilters(operations),
  ]

  return {
    bool: {
      must,
      filter,
    }
  }
}

module.exports = getElasticQuery
