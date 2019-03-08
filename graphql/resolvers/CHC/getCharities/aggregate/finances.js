const LATEST_INCOME_FIELD = 'financial.latest.income'
const AGG_TYPES = [
  'latestIncome',
] // reflects the fields on type FinancesAggregation

const getBucketKey = (key, aggType) => {
  return `${key}`
}

const getBucketName = (key, aggType) => {
  if (aggType === 'latestIncome') {
    return `Min. £${Math.round(Math.pow(10, key))}`
  }
  return `${key}`
}

const aggQuery = graphQLFields => {
  if (!graphQLFields) return undefined

  const financesAggs = {
    filter: { match_all: {} },
    aggs: {},
  }

  if (graphQLFields.latestIncome) {
    financesAggs.aggs.latestIncome = {
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

  return Object.keys(financesAggs.aggs).length > 0 ? financesAggs : undefined
}

const parseResponse = aggregation => {
  const aggTypes = Object.keys(aggregation).filter(x => AGG_TYPES.indexOf(x) !== -1)
  const aggBuckets = aggTypes.reduce((combinedAggs, aggType) => ({
    ...combinedAggs,
    [aggType]: {
      buckets: aggregation[aggType].buckets.map(x => ({
        id: getBucketKey(x.key, aggType),
        key: getBucketKey(x.key, aggType),
        name: getBucketName(x.key, aggType),
        count: x.doc_count,
        sumIncome: x.total_income ? x.total_income.value : null,
      }))
    }
  }), {})

  return aggBuckets
}

module.exports = {
  aggQuery,
  parseResponse,
}
