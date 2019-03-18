const ES_FIELDS = [
  'contact.geo',
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => x._source.contact.geo)
  } catch(e) {
    throw e
  }
}

module.exports = getList
