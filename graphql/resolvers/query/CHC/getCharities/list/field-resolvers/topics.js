const ES_FIELDS = [
  'topics',
]

async function getTopics(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => {
      return x._source.topics || []
    })
  } catch(e) {
    throw e
  }
}

module.exports = getTopics
