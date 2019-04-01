const ES_FIELDS = [
  'financial',
]

async function getList(
  searchSource,
) {
  try {
    const searchParams = {
      _source: ES_FIELDS,
    }
    const response = await searchSource(searchParams)
    return response.hits.hits.map(x => {
      const { financial } = x._source
      return {
        latest: {
          date: financial.latest && financial.latest.financialYear ? financial.latest.financialYear.end : null,
          total: financial.latest ? financial.latest.income : null,
        },
        annual: (financial.annual || []).map(x => ({
          income: x.income,
          expend: x.spending,
          financialYear: x.financialYear
        }))
      }
    })
  } catch(e) {
    throw e
  }
}

module.exports = getList
