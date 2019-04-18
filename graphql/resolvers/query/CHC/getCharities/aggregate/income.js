const LATEST_INCOME_FIELD = 'financial.latest.income'
const AGG_NAME = 'income'

async function aggIncome(search) {
  const searchParams = {
    index: undefined, // this is set when queries combined in parent class
    body: {
      query: undefined, // this is set when queries combined in parent class
      aggs: {
        [AGG_NAME]: {
          histogram: {
            field: LATEST_INCOME_FIELD,
            script: 'Math.log10(_value)',
            interval: 0.5,
            extended_bounds: {
              min: 0,
              max: 9,
            },
          },
          aggs: {
            total_income: {
              sum: {
                field: LATEST_INCOME_FIELD,
              },
            },
          },
        }
      }
    },
    size: 0,
  }

  try {
    const response = await search(searchParams)
    const buckets = response.aggregations[AGG_NAME].buckets.map(x => ({
      key: `${x.key}`,
      name: `Min. £${Math.round(Math.pow(10, x.key))}`,
      count: x.doc_count,
      sum: x.total_income.value,
    }))
    return {
      buckets,
    }
  } catch(e) {
    throw e
  }
}

module.exports = aggIncome
