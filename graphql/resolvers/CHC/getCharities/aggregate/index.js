const { esClient } = require('../../../../../connection')
const config = require('../../../../../config.json')
const aggIncome = require('./income')
const aggFinances = require('./finances')
const aggCauses = require('./causes')
const aggBeneficiaries = require('./beneficiaries')
const aggOperations = require('./operations')
const aggAreas = require('./areas')
const aggGeo = require('./geo')

const esIndex = config.elastic.indexes.chc.charities

const fieldMap = {
  income: aggIncome,
  finances: aggFinances,
  causes: aggCauses,
  beneficiaries: aggBeneficiaries,
  operations: aggOperations,
  areas: aggAreas,
  geo: aggGeo,
}

const getAggTypes = reqFieldsObj => {
  return Object.keys(reqFieldsObj).filter(x => fieldMap[x])
}

async function aggregateCharities(esQuery, requestedFields) {
  try {
    const aggs = getAggTypes(requestedFields).reduce((agg, x) => ({
      ...agg,
      [x]: fieldMap[x].aggQuery(requestedFields[x]),
    }), {})

    const searchParams = {
      index: [esIndex],
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
