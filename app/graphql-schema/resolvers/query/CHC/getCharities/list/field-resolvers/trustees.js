const ES_FIELDS = ["trustees"]

async function getList(searchSource) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map((x) => {
      return x._source.trustees || []
    })
  } catch (e) {
    throw e
  }
}

module.exports = getList
