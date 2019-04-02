const ES_FIELDS = [
  'grants.id',
  'grants.title',
  'grants.description',
  'grants.fundingOrganization',
  'grants.amountAwarded',
  'grants.currency',
  'grants.awardDate',
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => x._source.grants)
  } catch(e) {
    throw e
  }
}

module.exports = getList
