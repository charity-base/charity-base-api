const ES_FIELDS = [
  'fyend',
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => x._source.fyend)
  } catch(e) {
    throw e
  }
}

module.exports = getList
