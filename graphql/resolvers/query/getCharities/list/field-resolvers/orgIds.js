const ES_FIELDS = [
  'ids.GB-CHC',
  'companiesHouseNumber',
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => {
      const chcId = x._source.ids['GB-CHC']
      const cohId = x._source.companiesHouseNumber
      const orgIds = [{
        id: `GB-CHC-${chcId}`,
        scheme: 'GB-CHC',
        rawId: chcId,
      }]
      if (cohId) {
        orgIds.push({
          id: `GB-COH-${cohId}`,
          scheme: 'GB-COH',
          rawId: cohId,
        })
      }
      return orgIds
    })
  } catch(e) {
    throw e
  }
}

module.exports = getList
