// name is deprecated in favour of names
const ES_FIELDS = [
  'primaryName',
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => x._source.primaryName)
  } catch(e) {
    throw e
  }
}

module.exports = getList
