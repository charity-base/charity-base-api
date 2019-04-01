const ES_FIELDS = [
  'name',
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => x._source.name)
  } catch(e) {
    throw e
  }
}

module.exports = getList
