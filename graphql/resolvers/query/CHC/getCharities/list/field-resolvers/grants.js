const ES_FIELDS = [
  "funding.grants.id",
  "funding.grants.title",
  "funding.grants.description",
  "funding.grants.fundingOrganization",
  "funding.grants.amountAwarded",
  "funding.grants.currency",
  "funding.grants.awardDate",
]

const parse = (grants) => {
  if (!grants) {
    return []
  }
  return grants.map((x) => ({
    ...x,
    fundingOrganization: [x.fundingOrganization],
    funder: x.fundingOrganization,
  }))
}

async function getList(searchSource) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map((x) =>
      x._source.funding ? parse(x._source.funding.grants) : []
    )
  } catch (e) {
    throw e
  }
}

module.exports = getList
