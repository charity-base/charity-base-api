const ES_FIELDS = [
  "funding.funders.id",
  "funding.funders.name",
  "funding.grants.id",
  "funding.grants.title",
  "funding.grants.description",
  "funding.grants.funder",
  "funding.grants.amountAwarded",
  "funding.grants.currency",
  "funding.grants.awardDate",
]

const parse = ({ funders, grants }) => {
  const fundersArr = funders ? funders : []
  const grantsArr = grants
    ? grants.map((x) => ({
        ...x,
        fundingOrganization: [x.funder], // legacy
        funder: x.funder,
      }))
    : []
  return {
    funders: fundersArr,
    grants: grantsArr,
  }
}

async function getList(searchSource) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map((x) =>
      x._source.funding
        ? parse(x._source.funding)
        : {
            funders: [],
            grants: [],
          }
    )
  } catch (e) {
    throw e
  }
}

module.exports = getList
