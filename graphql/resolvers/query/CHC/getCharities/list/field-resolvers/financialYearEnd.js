const ES_FIELDS = ["financialYearEnd"]

async function getList(searchSource) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map((x) => x._source.financialYearEnd)
  } catch (e) {
    throw e
  }
}

module.exports = getList
