const ES_FIELDS = [
  'financial',
]

async function getList(
  searchSource,
  { all },
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => {
      const { financial } = x._source
      if (all) {
        return financial.annual || []
      }
      return financial.latest ? [financial.latest] : []
    })
  } catch(e) {
    throw e
  }
}

module.exports = getList
