const ES_FIELDS = ["finances"]

async function getList(searchSource, { all }) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map((x) => {
      const { finances } = x._source
      if (!finances) {
        return []
      }
      if (all) {
        return finances.annual || []
      }
      return finances.latest ? [finances.latest] : []
    })
  } catch (e) {
    throw e
  }
}

module.exports = getList
