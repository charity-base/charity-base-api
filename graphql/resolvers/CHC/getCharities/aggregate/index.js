const { esClient } = require('../../../../../connection')
const config = require('../../../../../config.json')
const aggIncome = require('./income')
const aggCauses = require('./causes')
const aggBeneficiaries = require('./beneficiaries')
const aggOperations = require('./operations')
const aggAreas = require('./areas')

const esIndex = config.elastic.index

const fieldMap = {
  income: aggIncome,
  causes: aggCauses,
  beneficiaries: aggBeneficiaries,
  operations: aggOperations,
  areas: aggAreas,
}

async function aggregateCharities(esQuery, aggTypes) {
  try {
    const searchParams = {
      index: esIndex,
      size: 0,
      body: {
        query: esQuery,
        aggs: aggTypes.reduce((agg, x) => ({
          ...agg,
          [x]: fieldMap[x].aggQuery,
        }), {})
      },
    }
    const response = await esClient.search(searchParams)
    return aggTypes.reduce((agg, x) => ({
      ...agg,
      [x]: fieldMap[x].parseResponse(response.aggregations[x]),
    }), {})
  } catch(e) {
    throw e
  }

}

module.exports = aggregateCharities
