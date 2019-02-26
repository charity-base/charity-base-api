const { esClient } = require('../../../../../connection')
const config = require('../../../../../config.json')
const aggIncome = require('./income')
const aggCauses = require('./causes')
const aggBeneficiaries = require('./beneficiaries')
const aggOperations = require('./operations')
const aggAreas = require('./areas')
const aggGeo = require('./geo')

const esIndex = config.elastic.index

const fieldMap = {
  income: aggIncome,
  causes: aggCauses,
  beneficiaries: aggBeneficiaries,
  operations: aggOperations,
  areas: aggAreas,
  geo: aggGeo,
}

async function aggregateCharities(esQuery, aggTypes) {
  try {
    const aggs = Object.keys(aggTypes).reduce((agg, x) => ({
      ...agg,
      [x]: fieldMap[x].aggQuery(aggTypes[x]),
    }), {})

    const searchParams = {
      index: esIndex,
      size: 0,
      body: {
        query: esQuery,
        aggs,
      },
    }

    const response = await esClient.search(searchParams)
    return Object.keys(aggs).reduce((agg, x) => ({
      ...agg,
      [x]: aggs[x] ? fieldMap[x].parseResponse(response.aggregations[x]) : null,
    }), {})
  } catch(e) {
    throw e
  }

}

module.exports = aggregateCharities
