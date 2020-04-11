const aggByTerm = require('./aggByTerm')
const AGG_NAME = 'agg_operation'
const ES_FIELD = 'operations.id'
const NUM_VALUES = 10

const aggOperations = aggByTerm(AGG_NAME, ES_FIELD, NUM_VALUES)

module.exports = aggOperations
