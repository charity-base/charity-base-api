const ES_FIELDS = [
  'orgIds'
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => x._source.orgIds)
  } catch(e) {
    throw e
  }
}

module.exports = getList
