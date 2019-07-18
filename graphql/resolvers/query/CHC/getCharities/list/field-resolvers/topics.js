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
      const topics = x._source.topics || []
      return topics.map(({ id, content, score }) => ({
        id,
        score,
        name: content,
      }))
    })
  } catch(e) {
    throw e
  }
}

module.exports = getTopics
