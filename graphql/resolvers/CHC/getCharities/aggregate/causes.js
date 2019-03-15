const aggByTerm = require('./aggByTerm')
const AGG_NAME = 'causes'
const ES_FIELD = 'causes.id'
const NUM_VALUES = 17

const aggCauses = aggByTerm(AGG_NAME, ES_FIELD, NUM_VALUES)

module.exports = aggCauses
